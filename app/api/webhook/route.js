import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/lib/models";
import { NextResponse } from "next/server";

const stripe = require('stripe')(process.env.STRIPE_SK);

export async function POST(req) {
  await mongooseConnect();
  
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const body = await req.text();
    
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session?.metadata?.orderId;

    console.log('✅ Payment succeeded for order:', orderId);

    if (orderId) {
      try {
        await Order.findByIdAndUpdate(orderId, {
          paid: true,
        });
        console.log(`✅ Order ${orderId} marked as PAID`);
      } catch (error) {
        console.error('❌ Error updating order:', error);
        return NextResponse.json(
          { error: 'Failed to update order' },
          { status: 500 }
        );
      }
    } else {
      console.log('⚠️  No orderId found in session metadata');
    }
  }

  return NextResponse.json({ received: true });
}