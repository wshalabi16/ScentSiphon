"use client";
import styled from "styled-components";
import Link from "next/link";
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

const NotFoundWrapper = styled.div`
  text-align: center;
  padding: 80px 20px;
  font-family: var(--font-inter), sans-serif;

  h1 {
    font-family: var(--font-playfair), serif;
    font-size: 2rem;
    margin-bottom: 16px;
    color: #1a1a1a;
  }

  p {
    color: #666;
    font-size: 1rem;
    margin-bottom: 24px;
  }

  a {
    display: inline-block;
    background-color: #1a1a1a;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s;

    &:hover {
      background-color: #000;
    }
  }
`;

export default function ProductPageContent({ product }) {
  if (!product) {
    return (
      <>
        <Header />
        <Center>
          <NotFoundWrapper>
            <h1>Product Not Found</h1>
            <p>Sorry, we couldn't find the product you're looking for. It may have been removed or is no longer available.</p>
            <Link href="/products">Browse All Products</Link>
          </NotFoundWrapper>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <ProductImages
            images={product.images}
            productName={product.title}
            brandName={product.category?.name}
          />
          <ProductInfo product={product} />
        </ColWrapper>
      </Center>
    </>
  );
}