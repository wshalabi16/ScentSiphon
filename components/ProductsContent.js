"use client";
import { useState } from "react";
import styled from "styled-components";
import Header from "@/components/Header";
import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";
import BrandFilter from "@/components/BrandFilter";

const PageWrapper = styled.div`
  background-color: #fafafa;
  min-height: 100vh;
  padding-bottom: 80px;
`;

const PageHeader = styled.div`
  background-color: white;
  padding: 60px 0 30px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-family: var(--font-playfair), serif;
  font-size: 3rem;
  margin: 0;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  font-family: var(--font-inter), sans-serif;
  font-size: 1.1rem;
  color: #666;
  margin: 15px 0 0;
  font-weight: 400;
`;

const ProductCount = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-size: 0.95rem;
  color: #999;
  margin-top: 10px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 240px 1fr;
    gap: 30px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FilterColumn = styled.div`
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const ProductsColumn = styled.div`
  min-width: 0;
`;

export default function ProductsContent({ products, brands }) {
  const [selectedBrands, setSelectedBrands] = useState([]);

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleClearFilters = () => {
    setSelectedBrands([]);
  };

  // Filter products based on selected brands
  const filteredProducts = selectedBrands.length > 0
    ? products.filter(product => {
        const productBrand = product.category?.name;
        return selectedBrands.includes(productBrand);
      })
    : products;

  return (
    <PageWrapper>
      <Header />
      <PageHeader>
        <Center>
          <Title>All Fragrances</Title>
          <Subtitle>Discover our curated collection of luxury perfume decants</Subtitle>
          <ProductCount>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
            {selectedBrands.length > 0 && ` (filtered)`}
          </ProductCount>
        </Center>
      </PageHeader>
      <Center>
        <ContentWrapper>
          <FilterColumn>
            <BrandFilter 
              brands={brands}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              onClearFilters={handleClearFilters}
            />
          </FilterColumn>
          <ProductsColumn>
            <ProductsGrid products={filteredProducts} />
          </ProductsColumn>
        </ContentWrapper>
      </Center>
    </PageWrapper>
  );
}