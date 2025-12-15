import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
  await mongooseConnect();
  
  try {
    const { ids } = await req.json();
    const products = await Product.find({ _id: { $in: ids } });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Cart API error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart products' }, { status: 500 });
  }
}