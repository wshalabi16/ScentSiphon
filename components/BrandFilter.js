"use client";
import styled from "styled-components";

const FilterWrapper = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  border: 1px solid #f0f0f0;
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
`;

const FilterTitle = styled.h3`
  font-family: var(--font-playfair), serif;
  font-size: 1.3rem;
  margin: 0 0 20px 0;
  font-weight: 500;
  color: #1a1a1a;
`;

const BrandList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BrandLabel = styled.label`
  display: flex;
  align-items: center;
  font-family: var(--font-inter), sans-serif;
  font-size: 0.95rem;
  color: #333;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #1a1a1a;
  }
  
  input {
    margin-right: 10px;
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #1a1a1a;
  }
`;

const ClearButton = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  background-color: transparent;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-family: var(--font-inter), sans-serif;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #1a1a1a;
    color: #1a1a1a;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function BrandFilter({ brands, selectedBrands, onBrandToggle, onClearFilters }) {
  return (
    <FilterWrapper>
      <FilterTitle>Brands</FilterTitle>
      <BrandList>
        {brands.map(brand => (
          <BrandLabel key={brand}>
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => onBrandToggle(brand)}
            />
            {brand}
          </BrandLabel>
        ))}
      </BrandList>
      {selectedBrands.length > 0 && (
        <ClearButton onClick={onClearFilters}>
          Clear Filters
        </ClearButton>
      )}
    </FilterWrapper>
  );
}