"use client";
import Center from "./Center";
import styled from 'styled-components';
import ButtonLink from "./ButtonLink";

const BG = styled.div`
    background-color: #faf9f7;  
    color: #333;
    padding: 80px 0;
`;  

const Title = styled.h1`
    font-family: var(--font-playfair), serif;
    font-weight: 600;
    font-size: 3rem;
    margin: 0 0 10px 0;
    color: #1a1a1a;
    letter-spacing: -0.5px; 
`; 

const Description = styled.p`
    font-family: var(--font-inter), sans-serif;
    color: #666;
    font-size: 1rem;
    line-height: 1.6;
    margin: 10px 0 20px 0;
`;

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
`;

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);  
    border: 1px solid #f0f0f0;  
    
    img {
        max-width: 100%;
        max-height: 400px;
        object-fit: contain;
    }
`;

export default function Featured({ product }) {
  return (
    <BG>
      <Center>
        <ColumnsWrapper>
          <div>
            <Title>{product.title}</Title>
            <Description>{product.description}</Description>
            <ButtonLink href={'/products/' + product._id} primary>View Product</ButtonLink>
          </div>
          <ImageWrapper>
            <img 
              src={product.images?.[0]} 
              alt={product.title} 
            />
          </ImageWrapper>
        </ColumnsWrapper>
      </Center>  
    </BG>
  );
}