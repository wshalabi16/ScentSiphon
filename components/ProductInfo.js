"use client";
import { useContext, useState } from "react";
import styled from "styled-components";
import { CartContext } from "./CartContext";

const InfoWrapper = styled.div`
  font-family: var(--font-inter), sans-serif;
`;

const BrandName = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-weight: 400;
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Title = styled.h1`
  font-family: var(--font-playfair), serif;
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 30px 0;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 0 0 20px 0;
  }
`;

const SizeSelector = styled.div`
  margin-bottom: 30px;

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const SizeLabel = styled.div`
  font-weight: 500;
  margin-bottom: 12px;
  color: #1a1a1a;
`;

const SizeOptions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const SizeButton = styled.button`
  padding: 12px 24px;
  border: 2px solid ${props => props.$selected ? '#1a1a1a' : '#e5e5e5'};
  background-color: ${props => props.$selected ? '#1a1a1a' : 'white'};
  color: ${props => props.$selected ? 'white' : '#1a1a1a'};
  border-radius: 8px;
  cursor: pointer;
  font-family: var(--font-inter), sans-serif;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.95rem;

  &:hover {
    border-color: #1a1a1a;
    background-color: ${props => props.$selected ? '#000' : '#f5f5f5'};
  }

  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

const PriceDisplay = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }
`;

const AddToCartButton = styled.button`
  width: 100%;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-inter), sans-serif;
  
  &:hover {
    background-color: #000;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  margin-top: 15px;
  padding: 12px;
  background-color: #dcfce7;
  color: #16a34a;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
`;

export default function ProductInfo({ product }) {
  const { addProduct } = useContext(CartContext);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null
  );
  const [showSuccess, setShowSuccess] = useState(false);

  function formatSize(size) {
    if (!size) return '';
    if (typeof size === 'string' && size.toLowerCase().includes('ml')) {
      return size;
    }
    return `${size} ml`;
  }

  function handleVariantChange(variant) {
    setSelectedVariant(variant);
    setShowSuccess(false);
  }

  function handleAddToCart() {
    if (!selectedVariant) return;
    
    addProduct(product._id, selectedVariant);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  }

  // Extract brand name and product title separately
  const brandName = product.category?.name || '';
  const productTitle = product.title || '';
  const fullName = brandName ? `${brandName} ${productTitle}` : productTitle;

  return (
    <InfoWrapper>
      {brandName && <BrandName>{brandName}</BrandName>}
      <Title>{productTitle}</Title>
      <Description>{product.description || `this is ${fullName}`}</Description>
      
      {product.variants && product.variants.length > 0 && (
        <SizeSelector>
          <SizeLabel>Select Size</SizeLabel>
          <SizeOptions>
            {product.variants.map(variant => (
              <SizeButton
                key={variant._id || variant.size}
                $selected={selectedVariant?._id === variant._id || selectedVariant?.size === variant.size}
                onClick={() => handleVariantChange(variant)}
              >
                {formatSize(variant.size)}
                <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                  ${variant.price} CAD
                </div>
              </SizeButton>
            ))}
          </SizeOptions>
        </SizeSelector>
      )}
      
      {selectedVariant && (
        <>
          <PriceDisplay>${selectedVariant.price} CAD</PriceDisplay>
          <AddToCartButton onClick={handleAddToCart}>
            Add to Cart
          </AddToCartButton>
          {showSuccess && (
            <SuccessMessage>
              ✓ Added {formatSize(selectedVariant.size)} to cart!
            </SuccessMessage>
          )}
        </>
      )}
    </InfoWrapper>
  );
}