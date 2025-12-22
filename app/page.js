import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/lib/models";
import Header from "@/components/Header";
import Featured from "@/components/Featured";
import NewProducts from "@/components/NewProducts";

export default async function HomePage() {
  await mongooseConnect();
  
  const featuredProducts = await Product.find({ featured: true })
    .populate('category');
  let displayProduct = null;
  if (featuredProducts.length > 0) {
    const randomIndex = Math.floor(Math.random() * featuredProducts.length);
    displayProduct = featuredProducts[randomIndex];
  }
  
  // Fallback to newest if no featured products
  if (!displayProduct) {
    displayProduct = await Product.findOne({}, null, { 
      sort: { '_id': -1 } 
    }).populate('category');
  }
  
  const newProducts = await Product.find({}, null, { 
    sort: { '_id': -1 }, 
    limit: 8 
  }).populate('category');

  return (
    <div>
      <Header />
      <Featured product={displayProduct ? JSON.parse(JSON.stringify(displayProduct)) : null} />
      <NewProducts products={JSON.parse(JSON.stringify(newProducts))} />
    </div>
  );
}