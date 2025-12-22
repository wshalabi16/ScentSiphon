import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/lib/models";
import ProductsContent from "@/components/ProductsContent";

export default async function ProductsPage() {
  await mongooseConnect();

  const products = await Product.find({})
    .populate('category');

  // Sort products by brand name alphabetically
  const sortedProducts = products.sort((a, b) => {
    const brandA = a.category?.name || '';
    const brandB = b.category?.name || '';

    // First sort by brand name
    if (brandA < brandB) return -1;
    if (brandA > brandB) return 1;

    // If brands are the same, sort by product title
    const titleA = a.title || '';
    const titleB = b.title || '';
    return titleA.localeCompare(titleB);
  });

  const brands = [...new Set(
    sortedProducts
      .map(p => p.category?.name)
      .filter(Boolean)
  )].sort();

  return (
    <ProductsContent
      products={JSON.parse(JSON.stringify(sortedProducts))}
      brands={brands}
    />
  );
}