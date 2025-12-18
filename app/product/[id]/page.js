import Center from "@/components/Center";
import Header from "@/components/Header";
import WhiteBox from "@/components/WhiteBox";
import ProductColumnsWrapper from "@/components/ProductColumnsWrapper";
import { Product } from "@/lib/models";
import { mongooseConnect } from "@/lib/mongoose";
import ProductImages from "@/components/ProductImages";
import ProductInfo from "@/components/ProductInfo";

export default async function ProductPage({ params }) {
  const { id } = await params;  
  await mongooseConnect();
  const product = await Product.findById(id);

  return (
    <>
      <Header />
      <Center>
        <ProductColumnsWrapper>
          <WhiteBox>
            <ProductImages images={product.images}/>
          </WhiteBox>
          <div>
            <ProductInfo product={JSON.parse(JSON.stringify(product))} />
          </div>
        </ProductColumnsWrapper>
      </Center>
    </>
  );
}