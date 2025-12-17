import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import ProductColumnsWrapper from "@/components/ProductColumnsWrapper";
import { Product } from "@/lib/models";
import { mongooseConnect } from "@/lib/mongoose";
import ProductImages from "@/components/ProductImages";

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
            <Title>{product.title}</Title>
            <p style={{
              fontFamily: 'var(--font-inter), sans-serif',
              color: '#666',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              {product.description}
            </p>
            <p style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              fontFamily: 'var(--font-inter), sans-serif'
            }}>
              ${product.price} CAD
            </p>
          </div>
        </ProductColumnsWrapper>
      </Center>
    </>
  );
}