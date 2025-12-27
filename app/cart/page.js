"use client";

import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import Header from "@/components/Header";
import Center from "@/components/Center";
import ColumnsWrapper from "@/components/ColumnsWrapper";
import WhiteBox from "@/components/WhiteBox";
import styled from "styled-components";
import Table from "@/components/Table";
import axios from "axios";
import Link from "next/link";
import { formatSize } from "@/lib/formatters";
import { calculateShipping, isFreeShipping, amountNeededForFreeShipping } from "@/lib/shipping";

const ProductInfoCell = styled.td`
  padding: 16px 8px;
  border-bottom: 1px solid #f0f0f0;
`;

const ProductImageBox = styled.div`
  width: 80px;
  height: 80px;
  padding: 10px;
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #fafafa;
  cursor: pointer;
  transition: all 0.2s;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  &:hover {
    border-color: #1a1a1a;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

const ProductDetails = styled.div`
  margin-left: 12px;
`;

const BrandName = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-weight: 400;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProductTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const VariantInfo = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const QuantityLabel = styled.span`
  padding: 0 8px;
  font-weight: 500;
  display: inline-block;
  min-width: 30px;
  text-align: center;
`;

const QuantityButton = styled.button`
  border: 1px solid #e5e5e5;
  background-color: white;
  border-radius: 5px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
    border-color: #d0d0d0;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-family: var(--font-inter), sans-serif;

  h2 {
    font-family: var(--font-playfair), serif;
    font-size: 2rem;
    margin-bottom: 10px;
    color: #1a1a1a;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
`;

const MobileCartItem = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    background: white;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    border: 1px solid #f0f0f0;
  }
`;

const MobileProductInfo = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

const MobileProductDetails = styled.div`
  flex: 1;
`;

const MobileActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

const MobilePrice = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const TableWrapper = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const CartTitle = styled.h2`
  font-family: var(--font-playfair), serif;
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const CheckoutButton = styled.button`
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
`;

const StockIssueWarning = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  font-family: var(--font-inter), sans-serif;
  font-size: 0.9rem;
  color: #991b1b;
  line-height: 1.5;
`;

const StockWarning = styled.div`
  font-size: 0.8rem;
  color: ${props => props.$severity === 'critical' ? '#dc2626' : '#f59e0b'};
  font-weight: 600;
  margin-top: 4px;
  font-family: var(--font-inter), sans-serif;
`;

const OutOfStockBadge = styled.div`
  font-size: 0.75rem;
  color: #dc2626;
  background-color: #fee2e2;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  font-weight: 600;
  margin-top: 4px;
`;

const RemoveButton = styled.button`
  border: none;
  background: none;
  color: #dc2626;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 1.2rem;
  transition: all 0.2s;
  border-radius: 4px;

  &:hover {
    background-color: #fee2e2;
  }
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 400px;
  width: 100%;
  font-family: var(--font-inter), sans-serif;
`;

const ModalTitle = styled.h3`
  font-family: var(--font-playfair), serif;
  font-size: 1.5rem;
  margin: 0 0 15px 0;
  color: #1a1a1a;
`;

const ModalMessage = styled.p`
  margin: 0 0 25px 0;
  color: #666;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: var(--font-inter), sans-serif;

  &.cancel {
    background-color: #f5f5f5;
    color: #666;

    &:hover {
      background-color: #e5e5e5;
    }
  }

  &.confirm {
    background-color: #dc2626;
    color: white;

    &:hover {
      background-color: #b91c1c;
    }
  }
`;

// ✅ NEW: Free shipping badge
const FreeShippingBadge = styled.div`
  background-color: #22c55e;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
`;

const LoadingSkeleton = styled.div`
  padding: 30px 0;
`;

const SkeletonItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const SkeletonBox = styled.div`
  background-color: #f0f0f0;
  border-radius: ${props => props.$radius || '8px'};
  width: ${props => props.$width || '100px'};
  height: ${props => props.$height || '20px'};
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, cartLoaded } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [confirmRemoval, setConfirmRemoval] = useState(null);

  useEffect(() => {
    if (cartProducts.length > 0) {
      const productIds = [...new Set(cartProducts.map(item => item.productId))];

      axios.post('/api/cart', { ids: productIds })
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error('Failed to load cart products:', error);
          // Keep existing products in state on error to avoid blank cart
        });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  function moreOfThisProduct(productId, variantId) {
    const cartItem = cartProducts.find(item =>
      item.productId === productId && item.variantId === variantId
    );
    if (cartItem) {
      // Check stock before allowing increase
      const product = products.find(p => p._id === productId);
      const variant = product?.variants?.find(v => v._id === variantId);
      const currentStock = variant?.stock || 0;

      // Count current quantity in cart
      const currentQuantity = cartProducts.filter(item =>
        item.productId === productId && item.variantId === variantId
      ).length;

      // Prevent adding if at or over stock limit
      if (currentQuantity >= currentStock) {
        return; // Don't add more
      }

      addProduct(productId, { size: cartItem.size, price: cartItem.price, _id: variantId });
    }
  }

  function lessOfThisProduct(productId, variantId) {
    // Count how many of this item are in cart
    const currentQuantity = cartProducts.filter(item =>
      item.productId === productId && item.variantId === variantId
    ).length;

    // If this is the last one, show confirmation
    if (currentQuantity === 1) {
      const product = products.find(p => p._id === productId);
      const brandName = product?.category?.name || '';
      const productTitle = product?.title || '';
      const variant = product?.variants?.find(v => v._id === variantId);
      const fullName = brandName ? `${brandName} ${productTitle}` : productTitle;
      const sizeInfo = variant?.size ? ` (${formatSize(variant.size)})` : '';

      setConfirmRemoval({
        productId,
        variantId,
        name: `${fullName}${sizeInfo}`,
        action: 'single'
      });
    } else {
      // Just remove one
      removeProduct(productId, variantId);
    }
  }

  function removeAllOfProduct(productId, variantId) {
    const product = products.find(p => p._id === productId);
    const brandName = product?.category?.name || '';
    const productTitle = product?.title || '';
    const variant = product?.variants?.find(v => v._id === variantId);
    const fullName = brandName ? `${brandName} ${productTitle}` : productTitle;
    const sizeInfo = variant?.size ? ` (${formatSize(variant.size)})` : '';

    const quantity = cartProducts.filter(item =>
      item.productId === productId && item.variantId === variantId
    ).length;

    setConfirmRemoval({
      productId,
      variantId,
      name: `${fullName}${sizeInfo}`,
      quantity,
      action: 'all'
    });
  }

  function confirmRemoveProduct() {
    if (!confirmRemoval) return;

    const { productId, variantId, action } = confirmRemoval;

    if (action === 'all') {
      // Remove all instances
      const itemsToRemove = cartProducts.filter(item =>
        item.productId === productId && item.variantId === variantId
      );
      itemsToRemove.forEach(() => {
        removeProduct(productId, variantId);
      });
    } else {
      // Remove single instance
      removeProduct(productId, variantId);
    }

    setConfirmRemoval(null);
  }

  function cancelRemoveProduct() {
    setConfirmRemoval(null);
  }


  const groupedCart = {};
  cartProducts.forEach(item => {
    const key = `${item.productId}-${item.variantId}`;
    if (!groupedCart[key]) {
      groupedCart[key] = {
        productId: item.productId,
        variantId: item.variantId,
        size: item.size,
        price: item.price,
        quantity: 0
      };
    }
    groupedCart[key].quantity++;
  });

  // Sort grouped cart entries by: brand → product title → size
  const sortedGroupedCart = Object.entries(groupedCart).sort(([keyA, itemA], [keyB, itemB]) => {
    const productA = products.find(p => p._id === itemA.productId);
    const productB = products.find(p => p._id === itemB.productId);

    if (!productA || !productB) return 0;

    const brandA = productA.category?.name || '';
    const brandB = productB.category?.name || '';
    const titleA = productA.title || '';
    const titleB = productB.title || '';

    // Sort by brand first
    if (brandA !== brandB) {
      return brandA.localeCompare(brandB);
    }

    // Then by product title
    if (titleA !== titleB) {
      return titleA.localeCompare(titleB);
    }

    // Finally by size (numeric comparison)
    const sizeA = parseFloat(itemA.size) || 0;
    const sizeB = parseFloat(itemB.size) || 0;
    return sizeA - sizeB;
  });

  // ✅ Calculate subtotal
  let subtotal = 0;
  sortedGroupedCart.forEach(([, item]) => {
    subtotal += item.quantity * item.price;
  });

  // ✅ Calculate shipping using helper functions
  const shippingCost = calculateShipping(subtotal);
  const qualifiesForFreeShipping = isFreeShipping(subtotal);

  // ✅ Calculate total (subtotal + shipping)
  const total = subtotal + shippingCost;

  // ✅ Check for stock issues
  const hasStockIssues = sortedGroupedCart.some(([, item]) => {
    const product = products.find(p => p._id === item.productId);
    if (!product) return false;
    const variant = product.variants?.find(v => v._id === item.variantId);
    const currentStock = variant?.stock || 0;
    return currentStock === 0 || currentStock < item.quantity;
  });

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <WhiteBox>
            <CartTitle>Cart</CartTitle>

            {!cartLoaded && (
              <LoadingSkeleton>
                {[1, 2, 3].map((i) => (
                  <SkeletonItem key={i}>
                    <SkeletonBox $width="80px" $height="80px" />
                    <div style={{ flex: 1 }}>
                      <SkeletonBox $width="150px" $height="16px" style={{ marginBottom: '8px' }} />
                      <SkeletonBox $width="100px" $height="14px" />
                    </div>
                    <SkeletonBox $width="60px" $height="20px" />
                  </SkeletonItem>
                ))}
              </LoadingSkeleton>
            )}

            {cartLoaded && !cartProducts?.length && (
              <EmptyCart>
                <h2>Your cart is empty</h2>
                <p>Add some products to get started</p>
              </EmptyCart>
            )}

            {sortedGroupedCart.length > 0 && (
              <>
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedGroupedCart.map(([key, item]) => {
                        const product = products.find(p => p._id === item.productId);
                        if (!product) return null;
                        const brandName = product.category?.name || '';
                        const productTitle = product.title || '';
                        const fullName = brandName ? `${brandName} ${productTitle}` : productTitle;

                        // Find variant to check stock
                        const variant = product.variants?.find(v => v._id === item.variantId);
                        const currentStock = variant?.stock || 0;
                        const isOutOfStock = currentStock === 0;
                        const isLowStock = currentStock > 0 && currentStock <= 5;
                        const hasInsufficientStock = currentStock < item.quantity;

                        return (
                          <tr key={key}>
                            <ProductInfoCell>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Link href={`/product/${item.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                  <ProductImageBox>
                                    <img src={product.images[0]} alt={fullName} />
                                  </ProductImageBox>
                                </Link>
                                <ProductDetails>
                                  {brandName && <BrandName>{brandName}</BrandName>}
                                  <ProductTitle>{productTitle}</ProductTitle>
                                  {item.size && (
                                    <VariantInfo>Size: {formatSize(item.size)}</VariantInfo>
                                  )}
                                  {isOutOfStock && (
                                    <OutOfStockBadge>Out of Stock</OutOfStockBadge>
                                  )}
                                  {!isOutOfStock && hasInsufficientStock && (
                                    <StockWarning $severity="critical">
                                      Only {currentStock} available
                                    </StockWarning>
                                  )}
                                  {!isOutOfStock && !hasInsufficientStock && isLowStock && (
                                    <StockWarning $severity="warning">
                                      Only {currentStock} left
                                    </StockWarning>
                                  )}
                                </ProductDetails>
                              </div>
                            </ProductInfoCell>
                            <td>
                              <QuantityButton onClick={() => lessOfThisProduct(item.productId, item.variantId)}>
                                -
                              </QuantityButton>
                              <QuantityLabel>
                                {item.quantity}
                              </QuantityLabel>
                              <QuantityButton
                                onClick={() => moreOfThisProduct(item.productId, item.variantId)}
                                disabled={item.quantity >= currentStock}
                                style={{
                                  opacity: item.quantity >= currentStock ? 0.5 : 1,
                                  cursor: item.quantity >= currentStock ? 'not-allowed' : 'pointer'
                                }}
                              >
                                +
                              </QuantityButton>
                            </td>
                            <td>
                              ${(item.quantity * item.price).toFixed(2)}
                            </td>
                            <td>
                              <RemoveButton
                                onClick={() => removeAllOfProduct(item.productId, item.variantId)}
                                title="Remove all from cart"
                              >
                                🗑️
                              </RemoveButton>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </TableWrapper>

                {sortedGroupedCart.map(([key, item]) => {
                  const product = products.find(p => p._id === item.productId);
                  if (!product) return null;
                  const brandName = product.category?.name || '';
                  const productTitle = product.title || '';
                  const fullName = brandName ? `${brandName} ${productTitle}` : productTitle;

                  // Find variant to check stock (mobile)
                  const variant = product.variants?.find(v => v._id === item.variantId);
                  const currentStock = variant?.stock || 0;
                  const isOutOfStock = currentStock === 0;
                  const isLowStock = currentStock > 0 && currentStock <= 5;
                  const hasInsufficientStock = currentStock < item.quantity;

                  return (
                    <MobileCartItem key={key}>
                      <MobileProductInfo>
                        <Link href={`/product/${item.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <ProductImageBox>
                            <img src={product.images[0]} alt={fullName} />
                          </ProductImageBox>
                        </Link>
                        <MobileProductDetails>
                          {brandName && <BrandName>{brandName}</BrandName>}
                          <ProductTitle>{productTitle}</ProductTitle>
                          {item.size && (
                            <VariantInfo>Size: {formatSize(item.size)}</VariantInfo>
                          )}
                          {isOutOfStock && (
                            <OutOfStockBadge>Out of Stock</OutOfStockBadge>
                          )}
                          {!isOutOfStock && hasInsufficientStock && (
                            <StockWarning $severity="critical">
                              Only {currentStock} available
                            </StockWarning>
                          )}
                          {!isOutOfStock && !hasInsufficientStock && isLowStock && (
                            <StockWarning $severity="warning">
                              Only {currentStock} left
                            </StockWarning>
                          )}
                        </MobileProductDetails>
                      </MobileProductInfo>
                      <MobileActions>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div>
                            <QuantityButton onClick={() => lessOfThisProduct(item.productId, item.variantId)}>
                              -
                            </QuantityButton>
                            <QuantityLabel>
                              {item.quantity}
                            </QuantityLabel>
                            <QuantityButton
                              onClick={() => moreOfThisProduct(item.productId, item.variantId)}
                              disabled={item.quantity >= currentStock}
                              style={{
                                opacity: item.quantity >= currentStock ? 0.5 : 1,
                                cursor: item.quantity >= currentStock ? 'not-allowed' : 'pointer'
                              }}
                            >
                              +
                            </QuantityButton>
                          </div>
                          <RemoveButton
                            onClick={() => removeAllOfProduct(item.productId, item.variantId)}
                            title="Remove all from cart"
                          >
                            🗑️
                          </RemoveButton>
                        </div>
                        <MobilePrice>
                          ${(item.quantity * item.price).toFixed(2)}
                        </MobilePrice>
                      </MobileActions>
                    </MobileCartItem>
                  );
                })}
              </>
            )}
          </WhiteBox>
          
          {!!cartProducts?.length && (
            <WhiteBox>
              <h2 style={{ 
                fontFamily: 'var(--font-playfair), serif',
                fontSize: '1.5rem',
                marginTop: 0,
                marginBottom: '20px'
              }}>Order Summary</h2>
              <div style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '1.2rem',
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                {/* ✅ Subtotal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: '600' }}>${subtotal.toFixed(2)}</span>
                </div>
                
                {/* ✅ Shipping */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Shipping:</span>
                  <span style={{ fontWeight: '600' }}>
                    {qualifiesForFreeShipping ? (
                      <FreeShippingBadge>FREE</FreeShippingBadge>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                {/* ✅ Free shipping progress */}
                {!qualifiesForFreeShipping && (
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px' }}>
                    Add ${amountNeededForFreeShipping(subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}
                
                {/* ✅ Total */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '2px solid #1a1a1a',
                  fontSize: '1.3rem'
                }}>
                  <span><strong>Total:</strong></span>
                  <span style={{ fontWeight: '700' }}>${total.toFixed(2)} CAD</span>
                </div>
              </div>
              {hasStockIssues && (
                <StockIssueWarning>
                  <strong>Cannot proceed to checkout</strong>
                  <br />
                  Some items in your cart are out of stock or exceed available quantity. Please adjust your cart to continue.
                </StockIssueWarning>
              )}
              {hasStockIssues ? (
                <CheckoutButton disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                  Proceed to Checkout
                </CheckoutButton>
              ) : (
                <Link href="/checkout" style={{ textDecoration: 'none' }}>
                  <CheckoutButton>
                    Proceed to Checkout
                  </CheckoutButton>
                </Link>
              )}
            </WhiteBox>
          )}
        </ColumnsWrapper>
      </Center>

      {confirmRemoval && (
        <ConfirmationModal onClick={cancelRemoveProduct}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Remove from cart?</ModalTitle>
            <ModalMessage>
              {confirmRemoval.action === 'all' ? (
                <>
                  Are you sure you want to remove all <strong>{confirmRemoval.quantity}</strong> units of <strong>{confirmRemoval.name}</strong> from your cart?
                </>
              ) : (
                <>
                  Are you sure you want to remove <strong>{confirmRemoval.name}</strong> from your cart?
                </>
              )}
            </ModalMessage>
            <ModalButtons>
              <ModalButton className="cancel" onClick={cancelRemoveProduct}>
                Cancel
              </ModalButton>
              <ModalButton className="confirm" onClick={confirmRemoveProduct}>
                Remove
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ConfirmationModal>
      )}
    </>
  );
}