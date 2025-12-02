import Header from "@/components/Header";
import Featured from "@/components/Featured";
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
    </div>
  );
}