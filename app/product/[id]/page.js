import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/lib/models";
import ProductPageContent from "@/components/ProductPageContent";

export default async function ProductPage({ params }) {
  const { id } = await params;
  
  await mongooseConnect();
  const product = await Product.findById(id).populate('category');

  return <ProductPageContent product={product ? JSON.parse(JSON.stringify(product)) : null} />;
}