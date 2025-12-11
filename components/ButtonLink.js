"use client";
import styled from "styled-components";
import Link from "next/link";
import { buttonStyles } from "./ButtonStyles";

const StyledLink = styled(Link)`
  ${buttonStyles}
`;

export default function ButtonLink({ children, primary, outline, size, ...rest }) {
  return (
    <StyledLink 
      $primary={primary} 
      $outline={outline} 
      $size={size} 
      {...rest}
    >
      {children}
    </StyledLink>
  );
}