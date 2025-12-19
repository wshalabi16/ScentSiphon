import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/lib/models";
import ProductsContent from "@/components/ProductsContent";

export default async function ProductsPage() {
  await mongooseConnect();
  
  // Fetch products and populate category to get brand names
  const products = await Product.find({}, null, { sort: { '_id': -1 } })
    .populate('category');

  // Extract unique brands from categories
  const brands = [...new Set(
    products
      .map(p => p.category?.name)
      .filter(Boolean)
  )].sort();

  return (
    <ProductsContent 
      products={JSON.parse(JSON.stringify(products))} 
      brands={brands}
    />
  );
}