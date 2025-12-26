"use client";
import styled from 'styled-components';
import Link from "next/link";
import Center from "@/components/Center";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext"; 

const StyledHeader = styled.header`
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;

  @media (max-width: 480px) {
    padding: 15px 0;
  }
`;

const Logo = styled(Link)`
  font-family: var(--font-playfair), serif;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: none;

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Nav = styled.nav`
  font-family: var(--font-inter), sans-serif;
  display: flex;
  gap: 30px;
  font-size: 15px;

  a {
    color: #666;
    text-decoration: none;
    font-weight: 400;
    transition: color 0.2s;

    &:hover {
      color: #000;
    }
  }

  @media (max-width: 768px) {
    gap: 20px;
  }

  @media (max-width: 480px) {
    gap: 15px;
    font-size: 0.9rem;
  }
`;

export default function Header() {
  const { cartProducts } = useContext(CartContext);

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href="/">Scent Siphon</Logo>
          <Nav>
            {/* <Link href="/categories">Categories</Link> */}
            <Link href="/products">All Products</Link>
            <Link href="/cart">Cart ({cartProducts?.length || 0})</Link>  
          </Nav>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}