import { mongooseConnect } from "@/lib/mongoose";
import { Product, Order } from "@/lib/models";
import { NextResponse } from "next/server";

const stripe = require('stripe')(process.env.STRIPE_SK);

export async function POST(req) {
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
    } = await req.json();

    if (!name || !email || !city || !province || !postalCode || !streetAddress || !country) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    if (!cartProducts || cartProducts.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    const productIds = [...new Set(cartProducts.map(item => item.productId))];

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

    for (const [key, item] of Object.entries(groupedCart)) {
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

      // Build full product name: "Brand Title (Size)"
      const brandName = productInfo.category?.name || '';
      const fullProductName = brandName
        ? `${brandName} ${productInfo.title}`
        : productInfo.title;
      const productName = `${fullProductName} (${variant.size})`;

      // Stripe line item
      line_items.push({
        quantity: item.quantity,
        price_data: {
          currency: 'CAD',
          product_data: { name: productName },
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
        productName: fullProductName
      });
    }

    // Create full address string
    const fullAddress = addressLine2 
      ? `${streetAddress}, ${addressLine2}`
      : streetAddress;

    // Create order document
    const orderDoc = await Order.create({
      line_items: orderItems,  // Store structured data for webhook
      name,
      email,
      city,
      province,
      postalCode,
      streetAddress: fullAddress,
      country,
      phone: phone || '',
      paid: false,
      currency: 'CAD',
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      customer_email: email,
      success_url: process.env.PUBLIC_URL + '/checkout?success=1',
      cancel_url: process.env.PUBLIC_URL + '/checkout?canceled=1',
      metadata: { orderId: orderDoc._id.toString() },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    );
  }
}