"use client";
import styled from "styled-components";
import { buttonStyles } from "./ButtonStyles"; 

const StyledButton = styled.button`
  ${buttonStyles} 
`;

export default function Button({ children, ...rest }) {
  return <StyledButton {...rest}>{children}</StyledButton>;
}