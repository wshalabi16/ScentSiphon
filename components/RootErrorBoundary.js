'use client';

import { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  text-align: center;
  font-family: var(--font-inter), sans-serif;
  background-color: #f9fafb;
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

const HomeLink = styled(Link)`
  display: inline-block;
  background-color: #1a1a1a;
  color: white;
  padding: 12px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #000;
  }
`;

const ErrorDetails = styled.details`
  margin-top: 24px;
  padding: 16px;
  background-color: #fee2e2;
  border-radius: 8px;
  max-width: 800px;
  text-align: left;

  summary {
    cursor: pointer;
    font-weight: 600;
    color: #991b1b;
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
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Root Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorWrapper>
          <ErrorTitle>Something Went Wrong</ErrorTitle>
          <ErrorMessage>
            We encountered an unexpected error. Your cart data is safe. Please try refreshing the page or return to the homepage.
          </ErrorMessage>
          <HomeLink href="/">Return to Homepage</HomeLink>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <ErrorDetails>
              <summary>Error Details (Development Only)</summary>
              <pre>{this.state.error.toString()}</pre>
            </ErrorDetails>
          )}
        </ErrorWrapper>
      );
    }

    return this.props.children;
  }
}

export default RootErrorBoundary;