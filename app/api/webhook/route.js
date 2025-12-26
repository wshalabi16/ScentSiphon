import { Order, Product } from '@/lib/models';
import { mongooseConnect } from '@/lib/mongoose';
import mongoose from 'mongoose';

const stripe = require('stripe')(process.env.STRIPE_SK);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  await mongooseConnect();

  const buf = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err.message);
    // Don't leak internal error details to client
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    if (!orderId) {
      console.error('❌ No orderId in webhook metadata');
      return new Response('No orderId in metadata', { status: 400 });
    }

    // 🔒 SECURITY: Validate orderId is a valid MongoDB ObjectId (NoSQL injection prevention)
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.error('❌ Invalid orderId format in webhook metadata:', orderId);
      return new Response('Invalid orderId format', { status: 400 });
    }

    // 🔒 SECURITY: Timestamp validation - Reject events older than 5 minutes
    const eventTimestamp = event.created; // Unix timestamp in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const maxAgeSeconds = 300; // 5 minutes

    if (currentTimestamp - eventTimestamp > maxAgeSeconds) {
      console.warn('⚠️  Webhook event too old (possible replay attack):', {
        eventId: event.id,
        eventAge: currentTimestamp - eventTimestamp,
        maxAge: maxAgeSeconds
      });
      return new Response('Event too old', { status: 400 });
    }

    try {
      // 🔒 SECURITY: Idempotency check - Check if this exact event was already processed
      const existingOrder = await Order.findOne({ stripeEventId: event.id });

      if (existingOrder) {
        console.log('⚠️  Duplicate webhook event (idempotency):', {
          eventId: event.id,
          orderId: existingOrder._id,
          processedAt: existingOrder.processedAt
        });
        return new Response('Event already processed', { status: 200 });
      }

      // Get the order
      const order = await Order.findById(orderId);

      if (!order) {
        console.error('❌ Order not found:', orderId);
        return new Response('Order not found', { status: 404 });
      }

      // Additional safety check (defensive programming)
      if (order.paid) {
        console.log('⚠️  Order already marked as paid:', orderId);
        return new Response('Order already processed', { status: 200 });
      }

      console.log('✅ Processing payment for order:', orderId, 'Event:', event.id);

      // ✅ DECREASE STOCK FOR EACH ITEM IN ORDER
      for (const item of order.line_items) {
        try {
          // 🔒 SECURITY: Validate product ID before query (defensive programming)
          if (!mongoose.Types.ObjectId.isValid(item.productId)) {
            console.error('❌ Invalid productId in order line items:', item.productId);
            continue;
          }

          const product = await Product.findById(item.productId);
          
          if (!product) {
            console.error('❌ Product not found:', item.productId);
            continue;
          }

          // Find the variant to get info for logging
          const variant = product.variants.id(item.variantId);

          if (!variant) {
            console.error('❌ Variant not found:', item.variantId, 'in product:', item.productId);
            continue;
          }

          // 🔒 ATOMIC UPDATE: Prevent race conditions
          const updateResult = await Product.updateOne(
            {
              _id: item.productId,
              'variants._id': item.variantId,
              'variants.stock': { $gte: item.quantity }  // Only update if enough stock
            },
            {
              $inc: { 'variants.$.stock': -item.quantity }
            }
          );

          // ✅ CHECK if update succeeded
          if (updateResult.modifiedCount === 0) {
            // Stock update failed - either insufficient stock or variant not found
            console.error(`⚠️ OVERSOLD: Failed to update stock for ${product.title} (${variant.size}ml)`);
            console.error(`   Requested: ${item.quantity} units, Current stock: ${variant.stock} units`);
            console.error(`   OrderId: ${orderId}, EventId: ${event.id}`);
            console.error(`   ⚠️  ACTION REQUIRED: Manual stock adjustment needed`);
            // Continue processing - payment already received, order should complete
          } else {
            // Stock updated successfully
            console.log(`📦 Stock decreased for ${product.title} (${variant.size}ml): -${item.quantity} units`);
          }
          
        } catch (itemError) {
          console.error('❌ Error processing item:', item.productId, itemError);
          // Continue processing other items even if one fails
        }
      }

      // 🔒 SECURITY: Mark order as paid with idempotency key
      await Order.findByIdAndUpdate(orderId, {
        paid: true,
        stripeEventId: event.id,  // Store event ID for idempotency
        processedAt: new Date()   // Record when webhook was processed
      });
      console.log('✅ Order marked as paid:', orderId, 'Event:', event.id);

      return new Response('Stock updated and order marked as paid', { status: 200 });
      
    } catch (error) {
      console.error('❌ Error processing webhook:', error);
      return new Response('Processing error', { status: 500 });
    }
  }

  // Return 200 for unhandled event types
  return new Response('Event received but not processed', { status: 200 });
}