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

    // Build line items for Stripe
    let line_items = [];
    for (const [key, item] of Object.entries(groupedCart)) {
      const productInfo = productsInfos.find(p => p._id.toString() === item.productId);

      if (!productInfo) continue;

      // Build full product name: "Brand Title (Size)"
      const brandName = productInfo.category?.name || '';
      const fullProductName = brandName 
        ? `${brandName} ${productInfo.title}`
        : productInfo.title;
      const productName = `${fullProductName} (${item.size})`;

      line_items.push({
        quantity: item.quantity,
        price_data: {
          currency: 'CAD',
          product_data: { name: productName },
          unit_amount: Math.round(item.price * 100),
        },
      });
    }

    // Create full address string
    const fullAddress = addressLine2 
      ? `${streetAddress}, ${addressLine2}`
      : streetAddress;

    // Create order document
    const orderDoc = await Order.create({
      line_items,
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