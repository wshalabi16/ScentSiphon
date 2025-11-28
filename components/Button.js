"use client";
import styled, { css } from "styled-components";

const StyledButton = styled.button`
  border: 0;
  padding: 10px 24px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-family: var(--font-inter), sans-serif;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  
  /* Default: White button */
  ${props => !props.primary && !props.outline && css`
    background-color: white;
    color: #222;
    
    &:hover {
      background-color: #f0f0f0;
    }
  `}
  
  /* Primary: Black button */
  ${props => props.primary && css`
    background-color: #222;
    color: white;
    
    &:hover {
      background-color: #000;
    }
  `}
  
  /* Outline: Transparent with border */
  ${props => props.outline && css`
    background-color: transparent;
    color: white;
    border: 1px solid white;
    
    &:hover {
      background-color: rgba(255,255,255,0.1);
    }
  `}
  
  /* Size variants */
  ${props => props.size === 'l' && css`
    font-size: 17px;
    padding: 12px 28px;
  `}
`;

export default function Button({ children, ...rest }) {
  return <StyledButton {...rest}>{children}</StyledButton>;
}