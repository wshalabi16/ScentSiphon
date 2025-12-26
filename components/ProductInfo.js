"use client";
import { useContext, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { CartContext } from "./CartContext";
import { formatSize } from "@/lib/formatters";

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

const VariantPrice = styled.span`
  font-size: 0.85rem;
  margin-top: 4px;
  display: block;
`;

const StockWarning = styled.span`
  font-size: 0.75rem;
  margin-top: 2px;
  color: #f59e0b;
  font-weight: 600;
  display: block;
`;

const OutOfStockBadge = styled.span`
  font-size: 0.85rem;
  color: #dc2626;
  display: block;
  font-weight: 600;
`;

const PriceDisplay = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 30px;
`;

const QuantitySelector = styled.div`
  margin-bottom: 20px;
`;

const QuantityLabel = styled.div`
  font-weight: 500;
  margin-bottom: 12px;
  color: #1a1a1a;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid #e5e5e5;
  background-color: white;
  color: #1a1a1a;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-family: var(--font-inter), sans-serif;
  font-weight: 600;
  font-size: 1.2rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.disabled ? 0.4 : 1};

  &:hover {
    border-color: ${props => !props.disabled && '#1a1a1a'};
    background-color: ${props => !props.disabled && '#f5f5f5'};
  }
`;

const QuantityDisplay = styled.div`
  min-width: 60px;
  text-align: center;
  font-weight: 500;
  font-size: 1.1rem;
  color: #1a1a1a;
`;

const AddToCartButton = styled.button`
  width: 100%;
  background-color: ${props =>
    props.$success ? '#16a34a' :
    props.disabled ? '#9ca3af' : '#1a1a1a'
  };
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  font-family: var(--font-inter), sans-serif;

  &:hover {
    background-color: ${props =>
      props.$success ? '#16a34a' :
      props.disabled ? '#9ca3af' : '#000'
    };
  }
`;

export default function ProductInfo({ product }) {
  const { addProduct } = useContext(CartContext);

  // Select first available variant (with stock > 0), or first variant if all out
  const firstAvailableVariant = product.variants?.find(v => v.stock > 0) || product.variants?.[0];
  const [selectedVariant, setSelectedVariant] = useState(firstAvailableVariant || null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  // Reset quantity when variant changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant]);

  function handleVariantChange(variant) {
    // Don't allow selecting out of stock variants
    if (variant.stock === 0) return;

    setSelectedVariant(variant);
    setShowSuccess(false);

    // Clear any existing timeout
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
  }

  function handleQuantityChange(delta) {
    const newQuantity = quantity + delta;
    const maxStock = selectedVariant?.stock || 0;

    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  }

  function handleAddToCart() {
    if (!selectedVariant || selectedVariant.stock === 0) return;

    // Add the product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addProduct(product._id, selectedVariant);
    }

    setShowSuccess(true);

    // Clear any existing timeout
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }

    // Set new timeout and store reference
    successTimeoutRef.current = setTimeout(() => {
      setShowSuccess(false);
      successTimeoutRef.current = null;
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
      
      {selectedVariant ? (
        <>
          <PriceDisplay>${selectedVariant.price} CAD</PriceDisplay>

          {!isOutOfStock && (
            <QuantitySelector>
              <QuantityLabel>Quantity</QuantityLabel>
              <QuantityControls>
                <QuantityButton
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </QuantityButton>
                <QuantityDisplay>{quantity}</QuantityDisplay>
                <QuantityButton
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= selectedVariant.stock}
                  aria-label="Increase quantity"
                >
                  +
                </QuantityButton>
              </QuantityControls>
            </QuantitySelector>
          )}

          <AddToCartButton
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            $success={showSuccess}
          >
            {showSuccess
              ? `✓ Added ${quantity > 1 ? `${quantity}x ` : ''}to Cart!`
              : isOutOfStock
                ? 'Out of Stock'
                : 'Add to Cart'
            }
          </AddToCartButton>
        </>
      ) : (
        <PriceDisplay>
          {product.price ? `$${product.price} CAD` : 'Price unavailable'}
        </PriceDisplay>
      )}
    </InfoWrapper>
  );
}