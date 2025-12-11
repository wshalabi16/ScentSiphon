"use client";
import styled from "styled-components";
import { buttonStyles } from "./ButtonStyles";

const StyledButton = styled.button`
  ${buttonStyles}
`;

export default function Button({ children, primary, outline, size, ...rest }) {
  return (
    <StyledButton 
      $primary={primary} 
      $outline={outline} 
      $size={size} 
      {...rest}
    >
      {children}
    </StyledButton>
  );
}