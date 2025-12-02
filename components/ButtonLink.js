"use client";
import styled from "styled-components";
import Link from "next/link";
import { buttonStyles } from "./ButtonStyles"; 

const StyledLink = styled(Link)`
  ${buttonStyles}  
`;

export default function ButtonLink({ children, ...rest }) {
  return <StyledLink {...rest}>{children}</StyledLink>;
}