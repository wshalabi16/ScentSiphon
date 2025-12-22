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

const TotalRow = styled.tr`
  td {
    padding: 20px 8px 0;
    border-bottom: none;
    font-weight: 600;
    font-size: 1.1rem;
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

const MobileTotalSection = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    background: white;
    border-radius: 8px;
    padding: 16px;
    margin-top: 20px;
    border: 1px solid #f0f0f0;
    font-family: var(--font-inter), sans-serif;
  }
`;

const MobileTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-weight: 600;
  font-size: 1.2rem;
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

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (cartProducts.length > 0) {
      const productIds = [...new Set(cartProducts.map(item => item.productId))];

      axios.post('/api/cart', { ids: productIds })
        .then(response => {
          setProducts(response.data);
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
      addProduct(productId, { size: cartItem.size, price: cartItem.price, _id: variantId });
    }
  }

  function lessOfThisProduct(productId, variantId) {
    removeProduct(productId, variantId);
  }

  function formatSize(size) {
    if (!size) return '';
    if (typeof size === 'string' && size.toLowerCase().includes('ml')) {
      return size;
    }
    return `${size} ml`;
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

  let total = 0;
  sortedGroupedCart.forEach(([, item]) => {
    total += item.quantity * item.price;
  });

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <WhiteBox>
            <CartTitle>Cart</CartTitle>

            {!cartProducts?.length && (
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
                      </tr>
                    </thead>
                    <tbody>
                      {sortedGroupedCart.map(([key, item]) => {
                        const product = products.find(p => p._id === item.productId);
                        if (!product) return null;
                        const brandName = product.category?.name || '';
                        const productTitle = product.title || '';
                        const fullName = brandName ? `${brandName} ${productTitle}` : productTitle;

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
                              <QuantityButton onClick={() => moreOfThisProduct(item.productId, item.variantId)}>
                                +
                              </QuantityButton>
                            </td>
                            <td>
                              ${(item.quantity * item.price).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                      <TotalRow>
                        <td></td>
                        <td></td>
                        <td>${total.toFixed(2)} CAD</td>
                      </TotalRow>
                    </tbody>
                  </Table>
                </TableWrapper>

                {sortedGroupedCart.map(([key, item]) => {
                  const product = products.find(p => p._id === item.productId);
                  if (!product) return null;
                  const brandName = product.category?.name || '';
                  const productTitle = product.title || '';
                  const fullName = brandName ? `${brandName} ${productTitle}` : productTitle;

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
                        </MobileProductDetails>
                      </MobileProductInfo>
                      <MobileActions>
                        <div>
                          <QuantityButton onClick={() => lessOfThisProduct(item.productId, item.variantId)}>
                            -
                          </QuantityButton>
                          <QuantityLabel>
                            {item.quantity}
                          </QuantityLabel>
                          <QuantityButton onClick={() => moreOfThisProduct(item.productId, item.variantId)}>
                            +
                          </QuantityButton>
                        </div>
                        <MobilePrice>
                          ${(item.quantity * item.price).toFixed(2)}
                        </MobilePrice>
                      </MobileActions>
                    </MobileCartItem>
                  );
                })}

                <MobileTotalSection>
                  <MobileTotalRow>
                    <span>Total:</span>
                    <span>${total.toFixed(2)} CAD</span>
                  </MobileTotalRow>
                </MobileTotalSection>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: '600' }}>${total.toFixed(2)} CAD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
                  <span>Shipping:</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <Link href="/checkout" style={{ textDecoration: 'none' }}>
                <CheckoutButton>
                  Proceed to Checkout
                </CheckoutButton>
              </Link>
            </WhiteBox>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}