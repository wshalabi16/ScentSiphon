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
      // Extract unique product IDs (handle both old and new cart format)
      const productIds = [...new Set(cartProducts.map(item => 
        typeof item === 'string' ? item : item.productId
      ))];
      
      axios.post('/api/cart', { ids: productIds })
        .then(response => {
          setProducts(response.data);
        });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  function moreOfThisProduct(productId, variantId = null) {
    if (variantId) {
      // Find the variant info from cart
      const cartItem = cartProducts.find(item => 
        typeof item === 'object' && item.productId === productId && item.variantId === variantId
      );
      if (cartItem) {
        addProduct(productId, { size: cartItem.size, price: cartItem.price, _id: variantId });
      }
    } else {
      addProduct(productId);
    }
  }

  function lessOfThisProduct(productId, variantId = null) {
    removeProduct(productId, variantId);
  }

  // Helper function to format size display
  function formatSize(size) {
    if (!size) return '';
    // If size already has "ml", return as is
    if (typeof size === 'string' && size.toLowerCase().includes('ml')) {
      return size;
    }
    // Otherwise add "ml"
    return `${size} ml`;
  }

  // Group cart items by productId + variantId
  const groupedCart = {};
  cartProducts.forEach(item => {
    if (typeof item === 'string') {
      // Old system - just product ID
      const key = item;
      if (!groupedCart[key]) {
        groupedCart[key] = { productId: item, variantId: null, quantity: 0, price: 0 };
      }
      groupedCart[key].quantity++;
    } else {
      // New system - with variant
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
    }
  });

  let total = 0;
  Object.values(groupedCart).forEach(item => {
    if (item.variantId) {
      // New system - use price from cart item
      total += item.quantity * item.price;
    } else {
      // Old system - use price from product
      const product = products.find(p => p._id === item.productId);
      total += item.quantity * (product?.price || 0);
    }
  });

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <WhiteBox>
            <h2 style={{ 
              fontFamily: 'var(--font-playfair), serif',
              fontSize: '2rem',
              marginTop: 0,
              marginBottom: '20px'
            }}>Cart</h2>
            
            {!cartProducts?.length && (
              <EmptyCart>
                <h2>Your cart is empty</h2>
                <p>Add some products to get started</p>
              </EmptyCart>
            )}
            
            {Object.keys(groupedCart).length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedCart).map(([key, item]) => {
                    const product = products.find(p => p._id === item.productId);
                    if (!product) return null;
                    
                    const itemPrice = item.variantId ? item.price : product.price;
                    
                    return (
                      <tr key={key}>
                        <ProductInfoCell>
                          <Link href={`/product/${item.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ProductImageBox>
                              <img src={product.images[0]} alt={product.title} />
                            </ProductImageBox>
                          </Link>
                          <div>
                            <ProductTitle>{product.title}</ProductTitle>
                            {item.size && (
                              <VariantInfo>Size: {formatSize(item.size)}</VariantInfo>
                            )}
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
                          ${(item.quantity * itemPrice).toFixed(2)}
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