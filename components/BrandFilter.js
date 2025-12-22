"use client";
import { useState } from "react";
import styled from "styled-components";

const FilterWrapper = styled.div`
  background-color: white;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;

  @media (max-width: 768px) {
    position: static;
    max-height: none;
    overflow: visible;
  }
`;

const FilterHeader = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;

  @media (max-width: 768px) {
    padding: 16px;
    border-bottom: ${props => props.$isOpen ? '1px solid #f0f0f0' : 'none'};

    &:hover {
      background-color: #fafafa;
    }
  }

  @media (min-width: 769px) {
    cursor: default;
    padding-bottom: 0;
  }
`;

const FilterTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterTitle = styled.h3`
  font-family: var(--font-playfair), serif;
  font-size: 1.3rem;
  margin: 0;
  font-weight: 500;
  color: #1a1a1a;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const SelectedCount = styled.span`
  font-family: var(--font-inter), sans-serif;
  font-size: 0.85rem;
  color: #666;
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;

  @media (min-width: 769px) {
    display: none;
  }
`;

const ToggleIcon = styled.div`
  font-size: 1.2rem;
  color: #666;
  transition: transform 0.2s;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};

  @media (min-width: 769px) {
    display: none;
  }
`;

const BrandList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 20px 20px 20px;

  @media (max-width: 768px) {
    padding: ${props => props.$isOpen ? '16px' : '0 16px'};
    max-height: ${props => props.$isOpen ? '400px' : '0'};
    overflow: hidden;
    transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out;
  }
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
  margin: ${props => props.$isOpen ? '20px' : '0 20px 20px'};
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

  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
  }
`;

export default function BrandFilter({ brands, selectedBrands, onBrandToggle, onClearFilters }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleHeaderClick = () => {
    // Only toggle on mobile (< 769px)
    if (window.innerWidth <= 768) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <FilterWrapper>
      <FilterHeader onClick={handleHeaderClick} $isOpen={isOpen}>
        <FilterTitleRow>
          <FilterTitle>Brands</FilterTitle>
          {selectedBrands.length > 0 && (
            <SelectedCount>{selectedBrands.length}</SelectedCount>
          )}
        </FilterTitleRow>
        <ToggleIcon $isOpen={isOpen}>▼</ToggleIcon>
      </FilterHeader>
      <BrandList $isOpen={isOpen}>
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
        <ClearButton onClick={onClearFilters} $isOpen={isOpen}>
          Clear Filters
        </ClearButton>
      )}
    </FilterWrapper>
  );
}