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

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 1rem;
  font-family: var(--font-inter), sans-serif;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
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
  
  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

export default function CheckoutPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);

  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  async function goToPayment() {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/checkout', {
        name,
        email,
        city,
        postalCode,
        streetAddress,
        country,
        cartProducts,
      });
      
      if (response.data.url) {
        window.location = response.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find(p => p._id === productId)?.price || 0;
    total += price;
  }

  if (isSuccess) {
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
                marginBottom: '10px',
                color: '#1a1a1a'
              }}>Thanks for your order!</h2>
              <p style={{
                fontFamily: 'var(--font-inter), sans-serif',
                color: '#666'
              }}>We will email you when your order will be sent.</p>
            </WhiteBox>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }

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
                    <td>${total} CAD</td>
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
              }}>Order Information</h2>
              
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={ev => setName(ev.target.value)}
              />
              
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={ev => setEmail(ev.target.value)}
              />
              
              <CityHolder>
                <Input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={ev => setCity(ev.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={ev => setPostalCode(ev.target.value)}
                />
              </CityHolder>
              
              <Input
                type="text"
                placeholder="Street Address"
                value={streetAddress}
                onChange={ev => setStreetAddress(ev.target.value)}
              />
              
              <Input
                type="text"
                placeholder="Country"
                value={country}
                onChange={ev => setCountry(ev.target.value)}
              />
              
              <CheckoutButton
                onClick={goToPayment}
                disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Continue to payment'}
              </CheckoutButton>
            </WhiteBox>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}