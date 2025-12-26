'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useEffect } from 'react';

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px 20px;
  text-align: center;
  font-family: var(--font-inter), sans-serif;
`;

const ErrorTitle = styled.h1`
  font-family: var(--font-playfair), serif;
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: #dc2626;
`;

const ErrorMessage = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 32px;
  max-width: 600px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button`
  background-color: #1a1a1a;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #000;
  }
`;

const CartLink = styled(Link)`
  background-color: #fff;
  color: #1a1a1a;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  border: 2px solid #1a1a1a;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const WarningBox = styled.div`
  margin-top: 24px;
  padding: 20px;
  background-color: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  max-width: 600px;
  text-align: left;

  h3 {
    color: #92400e;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 8px;
  }

  p {
    color: #78350f;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const ErrorDetails = styled.details`
  margin-top: 24px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  max-width: 800px;
  text-align: left;

  summary {
    cursor: pointer;
    font-weight: 600;
    color: #666;
    user-select: none;
  }

  pre {
    margin-top: 12px;
    padding: 12px;
    background-color: #fff;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.85rem;
    color: #dc2626;
  }
`;

export default function CheckoutError({ error, reset }) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Checkout page error:', error);
  }, [error]);

  return (
    <ErrorWrapper>
      <ErrorTitle>Checkout Error</ErrorTitle>
      <ErrorMessage>
        We encountered an issue processing your checkout. Your cart is safe and no payment has been charged.
      </ErrorMessage>
      <ButtonGroup>
        <Button onClick={() => reset()}>
          Try Again
        </Button>
        <CartLink href="/cart">
          Return to Cart
        </CartLink>
      </ButtonGroup>
      <WarningBox>
        <h3>Important:</h3>
        <p>
          If you were in the middle of a payment, please check your email for confirmation before retrying.
          You will NOT be charged twice - our system prevents duplicate payments.
        </p>
      </WarningBox>
      {process.env.NODE_ENV === 'development' && (
        <ErrorDetails>
          <summary>Error Details (Development Only)</summary>
          <pre>{error?.message || 'Unknown error'}</pre>
        </ErrorDetails>
      )}
    </ErrorWrapper>
  );
}