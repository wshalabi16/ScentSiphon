"use client";
import styled from 'styled-components';
import Center from "./Center";
import ProductBox from "./ProductBox";

const Title = styled.h2`
  font-family: var(--font-playfair), serif;
  font-size: 2.5rem;
  margin: 60px 0 40px;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: -0.5px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);  
  gap: 24px;
  padding-bottom: 60px;
`;

export default function NewProducts({ products }) {
  return (
    <Center>
      <Title>New Arrivals</Title>
      <ProductsGrid>
        {products?.map(product => (
          <ProductBox key={product._id} product={product} />
        ))}
      </ProductsGrid>
    </Center>
  );
}