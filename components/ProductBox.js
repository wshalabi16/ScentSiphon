"use client";
import styled from 'styled-components';
import ButtonLink from "./ButtonLink";

const ProductWrapper = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;  
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);  
  border: 1px solid #f0f0f0; 
  transition: all 0.3s ease; 
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0,0,0,0.08);  
    transform: translateY(-4px); 
    border-color: #e5e5e5;  
  }
`;

const WhiteBox = styled.div`
  background-color: #fafafa;  
  padding: 20px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-bottom: 15px;
  
  img {
    max-width: 100%;
    max-height: 150px;
    object-fit: contain;
  }
`;

const ProductTitle = styled.h3`
  font-family: var(--font-playfair), serif;
  font-weight: 600;
  font-size: 1rem;
  margin: 0 0 8px 0;
  color: #1a1a1a;
  min-height: 40px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const Price = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-size: 0.9rem;
  color: #666;
  
  span {
    display: block;
    font-size: 1.2rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-top: 2px;
  }
`;

export default function ProductBox({ product }) {
  return (
    <ProductWrapper>
      <WhiteBox>
        <img src={product.images?.[0]} alt={product.title} />
      </WhiteBox>
      <ProductTitle>{product.title}</ProductTitle>
      <PriceRow>
        <Price>Starting from<span>${product.price}</span></Price>
        <ButtonLink href={`/product/${product._id}`} primary>View</ButtonLink>
      </PriceRow>
    </ProductWrapper>
  );
}