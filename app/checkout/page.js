"use client";

import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import Header from "@/components/Header";
import Center from "@/components/Center";
import styled from "styled-components";
import axios from "axios";

const PageWrapper = styled.div`
  max-width: 600px;
  margin: 40px auto;
  
  @media (max-width: 768px) {
    margin: 20px auto;
    padding: 0 20px;
  }
`;

const Box = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #f0f0f0;
  margin-bottom: 20px;
`;

const OrderSummaryBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #e0e0e0;
  }
`;

const SummaryLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ItemCount = styled.div`
  background-color: #f5f5f5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-family: var(--font-inter), sans-serif;
  color: #1a1a1a;
`;

const SummaryText = styled.div`
  font-family: var(--font-inter), sans-serif;
  color: #666;
  font-size: 0.95rem;
`;

const TotalAmount = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
`;

const ExpandedItems = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-family: var(--font-inter), sans-serif;
`;

const ItemInfo = styled.div`
  flex: 1;
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

const ItemName = styled.div`
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 2px;
`;

const ItemSize = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const ItemPrice = styled.div`
  font-weight: 500;
  color: #1a1a1a;
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

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 1rem;
  font-family: var(--font-inter), sans-serif;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
`;

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const ProvincePostalRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 18px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-inter), sans-serif;
  margin-top: 10px;
  
  &:hover {
    background-color: #000;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  &:disabled {
    background-color: #999;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessBox = styled(Box)`
  text-align: center;
  padding: 60px 30px;
`;

const InfoSection = styled.div`
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const InfoLabel = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-size: 1rem;
  color: #1a1a1a;
  font-weight: 500;
`;

const Title = styled.h1`
  font-family: var(--font-playfair), serif;
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #1a1a1a;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 16px;
  }
`;

const SectionTitle = styled.h2`
  font-family: var(--font-playfair), serif;
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 16px;
  }
`;

const SuccessTitle = styled.h2`
  font-family: var(--font-playfair), serif;
  font-size: 2.5rem;
  margin: 0 0 20px 0;
  color: #1a1a1a;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const ErrorBox = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  font-family: var(--font-inter), sans-serif;
`;

const ErrorTitle = styled.h3`
  color: #dc2626;
  font-size: 1.1rem;
  margin: 0 0 10px 0;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  color: #991b1b;
  margin: 0 0 15px 0;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const ErrorDetails = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
  font-size: 0.9rem;
`;

const ErrorRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #fee2e2;

  &:last-child {
    border-bottom: none;
  }
`;

const ErrorLabel = styled.span`
  color: #666;
  font-weight: 500;
`;

const ErrorValue = styled.span`
  color: #1a1a1a;
  font-weight: 600;
`;

const CloseErrorButton = styled.button`
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-inter), sans-serif;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b91c1c;
  }
`;

const CANADIAN_PROVINCES = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'YT', label: 'Yukon' }
];

export default function CheckoutPage() {
  const { cartProducts, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [showItems, setShowItems] = useState(false);
  const [country, setCountry] = useState('Canada');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cartProducts.length > 0) {
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

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      
      const savedOrderData = localStorage.getItem('lastOrder');
      if (savedOrderData) {
        setOrderData(JSON.parse(savedOrderData));
        localStorage.removeItem('lastOrder');
      }
      
      clearCart();
    }
  }, []);

  function formatSize(size) {
    if (!size) return '';
    if (typeof size === 'string' && size.toLowerCase().includes('ml')) {
      return size;
    }
    return `${size} ml`;
  }

  function getProvinceName(code) {
    const province = CANADIAN_PROVINCES.find(p => p.value === code);
    return province ? province.label : code;
  }

  const groupedCart = {};
  cartProducts.forEach(item => {
    if (typeof item === 'string') {
      const key = item;
      if (!groupedCart[key]) {
        groupedCart[key] = { productId: item, variantId: null, quantity: 0, price: 0 };
      }
      groupedCart[key].quantity++;
    } else {
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
  let itemCount = 0;
  Object.values(groupedCart).forEach(item => {
    itemCount += item.quantity;
    if (item.variantId) {
      total += item.quantity * item.price;
    } else {
      const product = products.find(p => p._id === item.productId);
      total += item.quantity * (product?.price || 0);
    }
  });

  async function goToPayment() {
    setIsLoading(true);
    try {
      const name = `${firstName} ${lastName}`.trim();
      
      const orderDataToSave = {
        items: Object.entries(groupedCart).map(([key, item]) => {
          const product = products.find(p => p._id === item.productId);
          return {
            product: product,
            size: item.size,
            quantity: item.quantity,
            price: item.variantId ? item.price : product?.price
          };
        }),
        total,
        shippingInfo: {
          name,
          email,
          streetAddress: addressLine2 ? `${streetAddress}, ${addressLine2}` : streetAddress,
          city,
          province: getProvinceName(province),
          postalCode,
          country
        }
      };
      localStorage.setItem('lastOrder', JSON.stringify(orderDataToSave));
      
      const response = await axios.post('/api/checkout', {
        name,
        email,
        city,
        province,
        postalCode,
        streetAddress,
        addressLine2,
        country,
        phone,
        cartProducts,
      });
      
      if (response.data.url) {
        window.location = response.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setIsLoading(false);

      // Handle stock errors specifically
      if (error.response?.data?.error === 'insufficient_stock') {
        const stockError = error.response.data;
        setError({
          type: 'stock',
          message: stockError.message,
          productName: stockError.productName,
          variantSize: stockError.variantSize,
          availableStock: stockError.availableStock,
          requestedQuantity: stockError.requestedQuantity
        });
      } else {
        // Generic error
        setError({
          type: 'generic',
          message: error.response?.data?.error || 'Something went wrong. Please try again.'
        });
      }
    }
  }

  if (isSuccess && orderData) {
    return (
      <>
        <Header />
        <Center>
          <PageWrapper>
            <SuccessBox>
              <SuccessTitle>Thank you!</SuccessTitle>
              <p style={{
                fontFamily: 'var(--font-inter), sans-serif',
                color: '#666',
                fontSize: '1.1rem',
                marginBottom: '40px'
              }}>Your order has been confirmed.</p>
              
              <div style={{ textAlign: 'left' }}>
                <h3 style={{
                  fontFamily: 'var(--font-playfair), serif',
                  fontSize: '1.3rem',
                  marginBottom: '20px',
                  color: '#1a1a1a'
                }}>Order Summary</h3>
                
                {orderData.items.map((item, index) => {
                  const brandName = item.product.category?.name || '';
                  const productTitle = item.product.title || '';
                  
                  return (
                    <ItemRow key={index}>
                      <ItemInfo>
                        {brandName && <BrandName>{brandName}</BrandName>}
                        <ItemName>
                          {productTitle} {item.size && `(${formatSize(item.size)})`}
                        </ItemName>
                        <ItemSize>Quantity: {item.quantity}</ItemSize>
                      </ItemInfo>
                      <ItemPrice>${(item.quantity * item.price).toFixed(2)}</ItemPrice>
                    </ItemRow>
                  );
                })}
                
                <ItemRow style={{ 
                  marginTop: '20px', 
                  paddingTop: '20px', 
                  borderTop: '2px solid #1a1a1a',
                  fontSize: '1.2rem'
                }}>
                  <ItemInfo>
                    <ItemName>Total</ItemName>
                  </ItemInfo>
                  <ItemPrice>${orderData.total.toFixed(2)} CAD</ItemPrice>
                </ItemRow>
                
                <div style={{ marginTop: '40px' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontSize: '1.3rem',
                    marginBottom: '20px',
                    color: '#1a1a1a'
                  }}>Shipping Information</h3>
                  
                  <InfoSection>
                    <InfoLabel>Name</InfoLabel>
                    <InfoValue>{orderData.shippingInfo.name}</InfoValue>
                  </InfoSection>
                  
                  <InfoSection>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>{orderData.shippingInfo.email}</InfoValue>
                  </InfoSection>
                  
                  <InfoSection>
                    <InfoLabel>Shipping Address</InfoLabel>
                    <InfoValue>
                      {orderData.shippingInfo.streetAddress}<br />
                      {orderData.shippingInfo.city}, {orderData.shippingInfo.province} {orderData.shippingInfo.postalCode}<br />
                      {orderData.shippingInfo.country}
                    </InfoValue>
                  </InfoSection>
                </div>
              </div>
            </SuccessBox>
          </PageWrapper>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <PageWrapper>
          <Title>Checkout</Title>
          
          <OrderSummaryBox onClick={() => setShowItems(!showItems)}>
            <SummaryLeft>
              <ItemCount>{itemCount}</ItemCount>
              <SummaryText>
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your order
              </SummaryText>
            </SummaryLeft>
            <TotalAmount>${total.toFixed(2)}</TotalAmount>
          </OrderSummaryBox>

          {error && (
            <ErrorBox>
              {error.type === 'stock' ? (
                <>
                  <ErrorTitle>⚠️ Insufficient Stock</ErrorTitle>
                  <ErrorMessage>{error.message}</ErrorMessage>
                  <ErrorDetails>
                    <ErrorRow>
                      <ErrorLabel>Product:</ErrorLabel>
                      <ErrorValue>{error.productName} ({error.variantSize})</ErrorValue>
                    </ErrorRow>
                    <ErrorRow>
                      <ErrorLabel>You requested:</ErrorLabel>
                      <ErrorValue>{error.requestedQuantity} units</ErrorValue>
                    </ErrorRow>
                    <ErrorRow>
                      <ErrorLabel>Available stock:</ErrorLabel>
                      <ErrorValue>{error.availableStock} units</ErrorValue>
                    </ErrorRow>
                  </ErrorDetails>
                  <div style={{ marginTop: '15px', textAlign: 'right' }}>
                    <CloseErrorButton onClick={() => setError(null)}>
                      Got it
                    </CloseErrorButton>
                  </div>
                </>
              ) : (
                <>
                  <ErrorTitle>⚠️ Checkout Error</ErrorTitle>
                  <ErrorMessage>{error.message}</ErrorMessage>
                  <div style={{ marginTop: '15px', textAlign: 'right' }}>
                    <CloseErrorButton onClick={() => setError(null)}>
                      Close
                    </CloseErrorButton>
                  </div>
                </>
              )}
            </ErrorBox>
          )}

          {showItems && (
            <Box>
              <ExpandedItems>
                {Object.entries(groupedCart).map(([key, item]) => {
                  const product = products.find(p => p._id === item.productId);
                  if (!product) return null;
                  const itemPrice = item.variantId ? item.price : product.price;
                  
                  const brandName = product.category?.name || '';
                  const productTitle = product.title || '';
                  
                  return (
                    <ItemRow key={key}>
                      <ItemInfo>
                        {brandName && <BrandName>{brandName}</BrandName>}
                        <ItemName>{productTitle}</ItemName>
                        {item.size && <ItemSize>Size: {formatSize(item.size)}</ItemSize>}
                        <ItemSize>Qty: {item.quantity}</ItemSize>
                      </ItemInfo>
                      <ItemPrice>${(item.quantity * itemPrice).toFixed(2)}</ItemPrice>
                    </ItemRow>
                  );
                })}
              </ExpandedItems>
            </Box>
          )}
          
          <Box>
            <SectionTitle>Shipping Information</SectionTitle>
            
            <Select value={country} onChange={ev => setCountry(ev.target.value)} disabled>
              <option value="Canada">Canada</option>
            </Select>
            
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={ev => setEmail(ev.target.value)}
            />
            
            <NameRow>
              <Input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={ev => setFirstName(ev.target.value)}
              />
              <Input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={ev => setLastName(ev.target.value)}
              />
            </NameRow>
            
            <Input
              type="text"
              placeholder="Address"
              value={streetAddress}
              onChange={ev => setStreetAddress(ev.target.value)}
            />
            
            <Input
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              value={addressLine2}
              onChange={ev => setAddressLine2(ev.target.value)}
            />
            
            <Input
              type="text"
              placeholder="City"
              value={city}
              onChange={ev => setCity(ev.target.value)}
            />
            
            <ProvincePostalRow>
              <Select
                value={province}
                onChange={ev => setProvince(ev.target.value)}
              >
                <option value="">Province</option>
                {CANADIAN_PROVINCES.map(prov => (
                  <option key={prov.value} value={prov.value}>
                    {prov.label}
                  </option>
                ))}
              </Select>
              <Input
                type="text"
                placeholder="Postal code"
                value={postalCode}
                onChange={ev => setPostalCode(ev.target.value)}
              />
            </ProvincePostalRow>
            
            <CheckoutButton
              onClick={goToPayment}
              disabled={isLoading}>
              {isLoading ? 'Processing...' : `Pay $${total.toFixed(2)} CAD`}
            </CheckoutButton>
          </Box>
        </PageWrapper>
      </Center>
    </>
  );
}