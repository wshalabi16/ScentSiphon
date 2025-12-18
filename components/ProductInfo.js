"use client";

import { useContext, useState } from "react";
import { CartContext } from "@/components/CartContext";
import styled from "styled-components";

const ProductInfoWrapper = styled.div`
  font-family: var(--font-inter), sans-serif;
`;

const Title = styled.h1`
  font-family: var(--font-playfair), serif;
  font-size: 2.5rem;
  font-weight: 500;
  margin: 0 0 20px 0;
  color: #1a1a1a;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  color: #666;
  line-height: 1.8;
  margin-bottom: 30px;
  font-size: 1rem;
`;

const SizeSelectionLabel = styled.div`
  font-family: var(--font-playfair), serif;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 15px;
  color: #1a1a1a;
`;

const VariantButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 35px;
  flex-wrap: wrap;
`;

const VariantButton = styled.button`
  font-family: var(--font-inter), sans-serif;
  padding: 18px 28px;
  border-radius: 8px;
  border: 1px solid ${props => props.$selected ? '#1a1a1a' : '#f0f0f0'};
  background-color: ${props => props.$selected ? '#1a1a1a' : '#fafafa'};
  color: ${props => props.$selected ? 'white' : '#1a1a1a'};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 150px;
  
  &:hover {
    border-color: #1a1a1a;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const VariantSize = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
`;

const VariantPrice = styled.div`
  font-size: 0.9rem;
  font-weight: 400;
  opacity: ${props => props.$selected ? 1 : 0.7};
`;

const PriceDisplay = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 25px;
  font-family: var(--font-inter), sans-serif;
  transition: all 0.3s ease;
`;

const AddToCartButton = styled.button`
  width: 100%;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 18px 32px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-inter), sans-serif;
  letter-spacing: 0.5px;
  
  &:hover {
    background-color: #000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  margin-top: 15px;
  padding: 12px;
  background-color: #f0f9f4;
  border: 1px solid #d4edda;
  border-radius: 8px;
  color: #155724;
  font-size: 0.9rem;
  text-align: center;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function ProductInfo({ product }) {
  const { addProduct } = useContext(CartContext);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [showSuccess, setShowSuccess] = useState(false);

  function handleAddToCart() {
    if (!selectedVariant) return;
    
    addProduct(product._id, selectedVariant);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000); // Reduced from 3000 to 2000
  }

  // Clear success message when variant changes
  function handleVariantChange(variant) {
    setSelectedVariant(variant);
    setShowSuccess(false); // Clear success message
  }

  // Helper function to format size display
  function formatSize(size) {
    // If size already has "ml", return as is
    if (typeof size === 'string' && size.toLowerCase().includes('ml')) {
      return size;
    }
    // Otherwise add "ml"
    return `${size} ml`;
  }

  return (
    <ProductInfoWrapper>
      <Title>{product.title}</Title>
      
      <Description>{product.description}</Description>
      
      {product.variants && product.variants.length > 0 && (
        <>
          <SizeSelectionLabel>Select Size</SizeSelectionLabel>
          <VariantButtons>
            {product.variants.map((variant) => (
              <VariantButton
                key={variant.size}
                $selected={selectedVariant?.size === variant.size}
                onClick={() => handleVariantChange(variant)}
              >
                <VariantSize>{formatSize(variant.size)}</VariantSize>
                <VariantPrice $selected={selectedVariant?.size === variant.size}>
                  ${variant.price} CAD
                </VariantPrice>
              </VariantButton>
            ))}
          </VariantButtons>
        </>
      )}
      
      <PriceDisplay>
        ${selectedVariant?.price || product.price} CAD
      </PriceDisplay>
      
      <AddToCartButton 
        onClick={handleAddToCart}
        disabled={!selectedVariant}
      >
        Add to Cart
      </AddToCartButton>
      
      {showSuccess && (
        <SuccessMessage>
          ✓ Added {formatSize(selectedVariant.size)} to cart!
        </SuccessMessage>
      )}
    </ProductInfoWrapper>
  );
}