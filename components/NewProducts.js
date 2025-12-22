"use client";
import styled from 'styled-components';
import Center from "./Center";
import ProductsGrid from "./ProductsGrid";

const Title = styled.h2`
  font-family: var(--font-playfair), serif;
  font-size: 2.5rem;
  margin: 60px 0 40px;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin: 40px 0 30px;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin: 30px 0 20px;
  }
`;

export default function NewProducts({ products }) {
  return (
    <Center>
      <Title>New Arrivals</Title>
      <ProductsGrid products={products} />
    </Center>
  );
}