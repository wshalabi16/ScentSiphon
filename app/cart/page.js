"use client";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import Header from "@/components/Header";
import Center from "@/components/Center";
import styled from "styled-components";
import Table from "@/components/Table";
import axios from "axios";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 40px;
  margin-top: 40px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Box = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #f0f0f0;
`;

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
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
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

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', { ids: cartProducts })
        .then(response => {
          setProducts(response.data);
        });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find(p => p._id === productId)?.price || 0;
    total += price;
  }

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
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
            
            {products?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt={product.title} />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <QuantityButton onClick={() => lessOfThisProduct(product._id)}>
                          -
                        </QuantityButton>
                        <QuantityLabel>
                          {cartProducts.filter(id => id === product._id).length}
                        </QuantityLabel>
                        <QuantityButton onClick={() => moreOfThisProduct(product._id)}>
                          +
                        </QuantityButton>
                      </td>
                      <td>
                        ${cartProducts.filter(id => id === product._id).length * product.price}
                      </td>
                    </tr>
                  ))}
                  <TotalRow>
                    <td></td>
                    <td></td>
                    <td>${total}</td>
                  </TotalRow>
                </tbody>
              </Table>
            )}
          </Box>
          
          {!!cartProducts?.length && (
            <Box>
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
                  <span style={{ fontWeight: '600' }}>${total}</span>
                </div>
              </div>
              <p style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '0.9rem',
                color: '#666',
                marginBottom: '20px'
              }}>
                Checkout and payment coming soon with Stripe integration.
              </p>
            </Box>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}