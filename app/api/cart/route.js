import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/lib/models";
import { NextResponse } from "next/server";
import { cartRateLimit } from "@/lib/rateLimit";
import mongoose from "mongoose";

export async function POST(req) {
  // Rate limiting: 100 cart requests per IP per hour
  const rateLimitResult = cartRateLimit(req);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'You have exceeded the maximum number of requests. Please try again later.'
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
    // Parse request body with error handling for empty bodies
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request: empty or malformed JSON body' },
        { status: 400 }
      );
    }

    const { ids } = body;

    // 🔒 SECURITY: Validate that ids is an array
    if (!Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Invalid request: ids must be an array' },
        { status: 400 }
      );
    }

    // 🔒 SECURITY: Validate each ID is a valid MongoDB ObjectId (NoSQL injection prevention)
    const invalidIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidIds.length > 0) {
      return NextResponse.json(
        {
          error: 'Invalid product IDs',
          message: 'One or more product IDs are invalid'
        },
        { status: 400 }
      );
    }

    const products = await Product.find({ _id: { $in: ids } })
      .populate('category');

    return NextResponse.json(products, {
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.reset.toISOString()
      }
    });
  } catch (error) {
    console.error('Cart API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart products' },
      { status: 500 }
    );
  }
}