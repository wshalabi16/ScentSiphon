import Header from "@/components/Header";
import Featured from "@/components/Featured";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/lib/models";

// Disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  await mongooseConnect();
  
  const [heroProduct] = await Product.aggregate([
    { $match: { featured: true } },
    { $sample: { size: 1 } }
  ]);
  
  // Latest 10 products
  const newProducts = await Product.find()
    .sort({ _id: -1 })  
    .limit(8);
  
  if (!heroProduct) {
    return (
      <div>
        <Header />
        <p>No featured products available</p>
      </div>
    );
  }
  
  return (
    <div>
      <Header />
      <Featured product={JSON.parse(JSON.stringify(heroProduct))} />
      <NewProducts products={JSON.parse(JSON.stringify(newProducts))} />
    </div>
  );
}