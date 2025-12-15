"use client";
import styled from "styled-components";

const StyledTable = styled.table`
  width: 100%;
  font-family: var(--font-inter), sans-serif;
  
  th {
    text-align: left;
    text-transform: uppercase;
    color: #666;
    font-weight: 600;
    font-size: 0.85rem;
    padding: 12px 8px;
    border-bottom: 2px solid #e5e5e5;
    letter-spacing: 0.5px;
  }
  
  td {
    padding: 16px 8px;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: middle;
  }
  
  tbody tr {
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #fafafa;
    }
  }
`;

export default function Table(props) {
  return <StyledTable {...props} />;
}