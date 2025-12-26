import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/lib/models";
import ProductPageContent from "@/components/ProductPageContent";

// Generate static paths for all products at build time
export async function generateStaticParams() {
  await mongooseConnect();
  const products = await Product.find({}).select('_id').lean();

  return products.map((product) => ({
    id: product._id.toString(),
  }));
}

// Generate unique metadata for each product
export async function generateMetadata({ params }) {
  const { id } = await params;

  await mongooseConnect();
  const product = await Product.findById(id).populate('category').lean();

  if (!product) {
    return {
      title: 'Product Not Found | ScentSiphon',
      description: 'The product you are looking for could not be found.',
    };
  }

  const brandName = product.category?.name || '';
  const fullName = brandName ? `${brandName} ${product.title}` : product.title;
  const lowestPrice = product.variants?.length > 0
    ? Math.min(...product.variants.map(v => v.price))
    : 0;

  return {
    title: `${fullName} | ScentSiphon`,
    description: `${product.description?.substring(0, 155) || `Shop ${fullName} at ScentSiphon. Premium fragrances starting at $${lowestPrice.toFixed(2)}.`}`,
    openGraph: {
      title: fullName,
      description: product.description || `Shop ${fullName} at ScentSiphon`,
      images: product.images?.length > 0 ? [{ url: product.images[0] }] : [],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;

  await mongooseConnect();
  const product = await Product.findById(id).populate('category');

  return <ProductPageContent product={product ? JSON.parse(JSON.stringify(product)) : null} />;
}