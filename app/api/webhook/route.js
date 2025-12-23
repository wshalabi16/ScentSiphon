import { Order, Product } from '@/lib/models';
import { mongooseConnect } from '@/lib/mongoose';

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
    console.log('⚠️  Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    if (!orderId) {
      console.error('❌ No orderId in webhook metadata');
      return new Response('No orderId in metadata', { status: 400 });
    }

    try {
      // Get the order
      const order = await Order.findById(orderId);
      
      if (!order) {
        console.error('❌ Order not found:', orderId);
        return new Response('Order not found', { status: 404 });
      }

      // Prevent duplicate processing
      if (order.paid) {
        console.log('⚠️  Order already marked as paid:', orderId);
        return new Response('Order already processed', { status: 200 });
      }

      console.log('✅ Processing payment for order:', orderId);

      // ✅ DECREASE STOCK FOR EACH ITEM IN ORDER
      for (const item of order.line_items) {
        try {
          const product = await Product.findById(item.productId);
          
          if (!product) {
            console.error('❌ Product not found:', item.productId);
            continue;
          }

          // Find the variant using Mongoose subdocument ID
          const variant = product.variants.id(item.variantId);
          
          if (!variant) {
            console.error('❌ Variant not found:', item.variantId, 'in product:', item.productId);
            continue;
          }

          const previousStock = variant.stock;
          
          // Decrease stock (ensure it doesn't go below 0)
          variant.stock = Math.max(0, variant.stock - item.quantity);
          
          // Save the product with updated variant stock
          await product.save();

          console.log(`📦 Stock updated for ${product.title} (${variant.size}ml):`);
          console.log(`   Previous: ${previousStock} → New: ${variant.stock} (sold: ${item.quantity})`);
          
        } catch (itemError) {
          console.error('❌ Error processing item:', item.productId, itemError);
          // Continue processing other items even if one fails
        }
      }

      // Mark order as paid
      await Order.findByIdAndUpdate(orderId, { paid: true });
      console.log('✅ Order marked as paid:', orderId);

      return new Response('Stock updated and order marked as paid', { status: 200 });
      
    } catch (error) {
      console.error('❌ Error processing webhook:', error);
      return new Response('Processing error', { status: 500 });
    }
  }

  // Return 200 for unhandled event types
  return new Response('Event received but not processed', { status: 200 });
}

export const config = {
  api: {
    bodyParser: false,
  },
};