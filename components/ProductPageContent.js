"use client";
import styled from "styled-components";
import Header from "@/components/Header";
import Center from "@/components/Center";
import ProductImages from "@/components/ProductImages";
import ProductInfo from "@/components/ProductInfo";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin: 60px 0;
  align-items: start;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
    margin: 30px 0;
  }
`;

export default function ProductPageContent({ product }) {
  if (!product) {
    return (
      <>
        <Header />
        <Center>
          <h1>Product not found</h1>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <ProductImages images={product.images} />
          <ProductInfo product={product} />
        </ColWrapper>
      </Center>
    </>
  );
}