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
`;

const Description = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 30px 0;
`;

const SizeSelector = styled.div`
  margin-bottom: 30px;
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
`;

const SizeButton = styled.button`
  padding: 12px 24px;
  border: 2px solid ${props => 
    props.$outOfStock ? '#e5e7eb' :
    props.$selected ? '#1a1a1a' : '#e5e5e5'
  };
  background-color: ${props => 
    props.$outOfStock ? '#f9fafb' :
    props.$selected ? '#1a1a1a' : 'white'
  };
  color: ${props => 
    props.$outOfStock ? '#9ca3af' :
    props.$selected ? 'white' : '#1a1a1a'
  };
  border-radius: 8px;
  cursor: ${props => props.$outOfStock ? 'not-allowed' : 'pointer'};
  font-family: var(--font-inter), sans-serif;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.95rem;
  opacity: ${props => props.$outOfStock ? 0.6 : 1};
  
  &:hover {
    border-color: ${props => !props.$outOfStock && '#1a1a1a'};
    background-color: ${props => 
      props.$outOfStock ? '#f9fafb' :
      props.$selected ? '#000' : '#f5f5f5'
    };
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const VariantPrice = styled.div`
  font-size: 0.85rem;
  margin-top: 4px;
`;

const StockWarning = styled.div`
  font-size: 0.75rem;
  margin-top: 2px;
  color: #f59e0b;
  font-weight: 600;
`;

const OutOfStockBadge = styled.div`
  font-size: 0.85rem;
  color: #dc2626;
  font-weight: 600;
`;

const PriceDisplay = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 30px;
`;

const AddToCartButton = styled.button`
  width: 100%;
  background-color: ${props => props.disabled ? '#9ca3af' : '#1a1a1a'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  font-family: var(--font-inter), sans-serif;
  
  &:hover {
    background-color: ${props => props.disabled ? '#9ca3af' : '#000'};
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
  
  // Select first available variant (with stock > 0), or first variant if all out
  const firstAvailableVariant = product.variants?.find(v => v.stock > 0) || product.variants?.[0];
  const [selectedVariant, setSelectedVariant] = useState(firstAvailableVariant || null);
  const [showSuccess, setShowSuccess] = useState(false);

  function formatSize(size) {
    if (!size) return '';
    if (typeof size === 'string' && size.toLowerCase().includes('ml')) {
      return size;
    }
    return `${size} ml`;
  }

  function handleVariantChange(variant) {
    // Don't allow selecting out of stock variants
    if (variant.stock === 0) return;
    
    setSelectedVariant(variant);
    setShowSuccess(false);
  }

  function handleAddToCart() {
    if (!selectedVariant || selectedVariant.stock === 0) return;
    
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

  const isOutOfStock = selectedVariant?.stock === 0;

  return (
    <InfoWrapper>
      {brandName && <BrandName>{brandName}</BrandName>}
      <Title>{productTitle}</Title>
      <Description>{product.description || `this is ${fullName}`}</Description>
      
      {product.variants && product.variants.length > 0 && (
        <SizeSelector>
          <SizeLabel>Select Size</SizeLabel>
          <SizeOptions>
            {product.variants.map(variant => {
              const variantOutOfStock = variant.stock === 0;
              const isSelected = selectedVariant?._id === variant._id || 
                                 selectedVariant?.size === variant.size;
              const isLowStock = variant.stock > 0 && variant.stock <= 5;
              
              return (
                <SizeButton
                  key={variant._id || variant.size}
                  $selected={isSelected}
                  $outOfStock={variantOutOfStock}
                  onClick={() => handleVariantChange(variant)}
                  disabled={variantOutOfStock}
                >
                  {formatSize(variant.size)}
                  {variantOutOfStock ? (
                    <OutOfStockBadge>Out of Stock</OutOfStockBadge>
                  ) : (
                    <VariantPrice>
                      ${variant.price} CAD
                      {isLowStock && (
                        <StockWarning>Only {variant.stock} left!</StockWarning>
                      )}
                    </VariantPrice>
                  )}
                </SizeButton>
              );
            })}
          </SizeOptions>
        </SizeSelector>
      )}
      
      {selectedVariant && (
        <>
          <PriceDisplay>${selectedVariant.price} CAD</PriceDisplay>
          <AddToCartButton 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </AddToCartButton>
          {showSuccess && !isOutOfStock && (
            <SuccessMessage>
              ✓ Added {formatSize(selectedVariant.size)} to cart!
            </SuccessMessage>
          )}
        </>
      )}
    </InfoWrapper>
  );
}