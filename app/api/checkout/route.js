import { mongooseConnect } from "@/lib/mongoose";
import { Product, Order } from "@/lib/models";
import { NextResponse } from "next/server";
import { checkoutRateLimit } from "@/lib/rateLimit";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sanitizeCheckoutData } from "@/lib/sanitize";
import mongoose from "mongoose";
import { calculateShipping } from "@/lib/shipping";

const stripe = require('stripe')(process.env.STRIPE_SK);

export async function POST(req) {
  // Rate limiting: 10 checkout attempts per IP per hour
  const rateLimitResult = checkoutRateLimit(req);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'You have exceeded the maximum number of checkout attempts. Please try again later.',
        retryAfter: rateLimitResult.reset
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.reset.toISOString(),
          'Retry-After': '3600' // 1 hour in seconds
        }
      }
    );
  }

  await mongooseConnect();

  try {
    const {
      name,
      email,
      city,
      province,
      postalCode,
      streetAddress,
      addressLine2,
      country,
      phone,
      cartProducts,
      recaptchaToken,
    } = await req.json();

    // reCAPTCHA v3 Verification
    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!recaptchaToken) {
        return NextResponse.json(
          { error: 'Security verification required' },
          { status: 403 }
        );
      }

      const recaptchaResult = await verifyRecaptcha(recaptchaToken);

      if (!recaptchaResult.success) {
        console.warn('reCAPTCHA verification failed:', recaptchaResult.error);
        return NextResponse.json(
          {
            error: 'Security verification failed',
            message: 'Your request could not be verified. Please try again or contact support if this issue persists.'
          },
          { status: 403 }
        );
      }

      // Log the score for monitoring (optional)
      console.log('reCAPTCHA verification successful. Score:', recaptchaResult.score);
    }

    // 🔒 SECURITY: Sanitize and validate all user input
    const sanitizationResult = sanitizeCheckoutData({
      name,
      email,
      streetAddress,
      addressLine2,
      city,
      province,
      postalCode,
      country,
      phone
    });

    if (!sanitizationResult.valid) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          message: 'Please check your information and try again',
          details: sanitizationResult.errors
        },
        { status: 400 }
      );
    }

    // Use sanitized data from this point forward
    const sanitizedData = sanitizationResult.sanitized;

    if (!cartProducts || cartProducts.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // 🔒 SECURITY: Validate cart products structure
    if (!Array.isArray(cartProducts)) {
      return NextResponse.json(
        { error: 'Invalid cart data' },
        { status: 400 }
      );
    }

    // 🔒 SECURITY: Validate each cart item has required properties
    for (const item of cartProducts) {
      if (!item.productId || !item.variantId || !item.size) {
        return NextResponse.json(
          {
            error: 'Invalid cart item structure',
            message: 'Each cart item must have productId, variantId, and size'
          },
          { status: 400 }
        );
      }
    }

    const productIds = [...new Set(cartProducts.map(item => item.productId))];

    // 🔒 SECURITY: Validate each product ID is a valid MongoDB ObjectId (NoSQL injection prevention)
    const invalidProductIds = productIds.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidProductIds.length > 0) {
      return NextResponse.json(
        {
          error: 'Invalid product IDs in cart',
          message: 'Your cart contains invalid product references. Please refresh and try again.'
        },
        { status: 400 }
      );
    }

    // 🔒 SECURITY: Validate each variant ID is a valid MongoDB ObjectId
    const variantIds = [...new Set(cartProducts.map(item => item.variantId))];
    const invalidVariantIds = variantIds.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidVariantIds.length > 0) {
      return NextResponse.json(
        {
          error: 'Invalid variant IDs in cart',
          message: 'Your cart contains invalid variant references. Please refresh and try again.'
        },
        { status: 400 }
      );
    }

    const productsInfos = await Product.find({ _id: productIds })
      .populate('category');

    // Group cart items by productId + variant
    const groupedCart = {};
    cartProducts.forEach(item => {
      const key = `${item.productId}-${item.variantId}`;
      if (!groupedCart[key]) {
        groupedCart[key] = {
          productId: item.productId,
          variantId: item.variantId,
          size: item.size,
          price: item.price,
          quantity: 0
        };
      }
      groupedCart[key].quantity++;
    });

    // Build line items for Stripe and validate stock
    let line_items = [];
    let orderItems = []; // For storing in database (for webhook stock decrement)
    let subtotal = 0; // ✅ Calculate subtotal for shipping logic

    for (const [, item] of Object.entries(groupedCart)) {
      const productInfo = productsInfos.find(p => p._id.toString() === item.productId);

      if (!productInfo) {
        return NextResponse.json(
          { error: 'One or more products in cart not found' },
          { status: 400 }
        );
      }

      // Find the matching variant in the database to get the REAL price
      const variant = productInfo.variants.find(v => v._id.toString() === item.variantId);

      if (!variant) {
        return NextResponse.json(
          { error: `Invalid variant for product: ${productInfo.title}` },
          { status: 400 }
        );
      }

      // STOCK VALIDATION: Check if sufficient stock available
      if (variant.stock < item.quantity) {
        const brandName = productInfo.category?.name || '';
        const fullProductName = brandName
          ? `${brandName} ${productInfo.title}`
          : productInfo.title;

        return NextResponse.json({
          error: 'insufficient_stock',
          message: `Sorry, only ${variant.stock} units of ${fullProductName} (${variant.size}) are available. Please adjust your cart.`,
          availableStock: variant.stock,
          requestedQuantity: item.quantity,
          productName: fullProductName,
          variantSize: variant.size
        }, { status: 400 });
      }

      // SECURITY FIX: Use server-side price from database, NEVER trust client
      const serverPrice = variant.price;

      // ✅ Add to subtotal
      subtotal += serverPrice * item.quantity;

      // Build product name for Stripe checkout
      const brandName = productInfo.category?.name || '';
      const fullProductName = brandName
        ? `${brandName} ${productInfo.title}`
        : productInfo.title;

      // Format: "Brand - Product Title - Size ml"
      const stripeProductName = brandName
        ? `${brandName} - ${productInfo.title} - ${variant.size}ml`
        : `${productInfo.title} - ${variant.size}ml`;

      // Stripe line item
      line_items.push({
        quantity: item.quantity,
        price_data: {
          currency: 'CAD',
          product_data: {
            name: stripeProductName,
            description: `${variant.size}ml bottle`
          },
          unit_amount: Math.round(serverPrice * 100),  // Using SERVER price
        },
      });

      // Store structured order item for webhook processing
      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: serverPrice,
        size: variant.size,
        brand: brandName,                // Category name (e.g., "CHRISTIAN DIOR")
        productTitle: productInfo.title, // Product title (e.g., "Dior Homme Intense")
        productName: fullProductName     // Keep for backwards compatibility
      });
    }

    // ✅ ADD SHIPPING AS LINE ITEM
    const shippingCost = calculateShipping(subtotal);

    if (shippingCost > 0) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: 'CAD',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping (5-7 business days)'
          },
          unit_amount: Math.round(shippingCost * 100), // $9.99 → 999 cents
        },
      });
    }

    // Create full address string using SANITIZED data
    const fullAddress = sanitizedData.addressLine2
      ? `${sanitizedData.streetAddress}, ${sanitizedData.addressLine2}`
      : sanitizedData.streetAddress;

    // Create order document with SANITIZED data
    const orderDoc = await Order.create({
      line_items: orderItems,  // Store structured data for webhook
      name: sanitizedData.name,
      email: sanitizedData.email,
      city: sanitizedData.city,
      province: sanitizedData.province,
      postalCode: sanitizedData.postalCode,
      streetAddress: fullAddress,
      country: sanitizedData.country,
      phone: sanitizedData.phone,
      paid: false,
      currency: 'CAD',
    });

    // Create Stripe checkout session with SANITIZED email
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      customer_email: sanitizedData.email,
      success_url: process.env.PUBLIC_URL + '/checkout?success=1',
      cancel_url: process.env.PUBLIC_URL + '/checkout?canceled=1',
      metadata: { orderId: orderDoc._id.toString() },
    });

    return NextResponse.json({ url: session.url }, {
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.reset.toISOString()
      }
    });
  } catch (error) {
    // 🔒 SECURITY: Log detailed error server-side only
    console.error('❌ Checkout error details:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Return generic error to client (no implementation details)
    return NextResponse.json(
      {
        error: 'Unable to process checkout',
        message: 'An unexpected error occurred. Please try again or contact support if the issue persists.'
      },
      { status: 500 }
    );
  }
}