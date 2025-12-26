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
  color: #1a1a1a;
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

const HomeLink = styled(Link)`
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

const InfoBox = styled.div`
  margin-top: 24px;
  padding: 16px;
  background-color: #fef3c7;
  border-radius: 8px;
  max-width: 600px;
  color: #92400e;
  font-size: 0.95rem;
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

export default function CartError({ error, reset }) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Cart page error:', error);
  }, [error]);

  return (
    <ErrorWrapper>
      <ErrorTitle>Cart Error</ErrorTitle>
      <ErrorMessage>
        We encountered an issue loading your cart. Don't worry - your items are saved locally and should be restored when you try again.
      </ErrorMessage>
      <ButtonGroup>
        <Button onClick={() => reset()}>
          Reload Cart
        </Button>
        <HomeLink href="/">
          Continue Shopping
        </HomeLink>
      </ButtonGroup>
      <InfoBox>
        💡 Your cart is stored in your browser. If the problem persists, try clearing your browser cache or contact support.
      </InfoBox>
      {process.env.NODE_ENV === 'development' && (
        <ErrorDetails>
          <summary>Error Details (Development Only)</summary>
          <pre>{error?.message || 'Unknown error'}</pre>
        </ErrorDetails>
      )}
    </ErrorWrapper>
  );
}