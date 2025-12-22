"use client";
import Center from "./Center";
import styled from 'styled-components';
import ButtonLink from "./ButtonLink";

const BG = styled.div`
    background-color: #faf9f7;
    color: #333;
    padding: 80px 0;

    @media (max-width: 768px) {
        padding: 40px 0;
    }

    @media (max-width: 480px) {
        padding: 30px 0;
    }
`;

const Title = styled.h1`
    font-family: var(--font-playfair), serif;
    font-weight: 600;
    font-size: 3rem;
    margin: 0 0 10px 0;
    color: #1a1a1a;
    letter-spacing: -0.5px;

    @media (max-width: 768px) {
        font-size: 1.8rem;
    }

    @media (max-width: 480px) {
        font-size: 1.5rem;
    }
`;

const Description = styled.p`
    font-family: var(--font-inter), sans-serif;
    color: #666;
    font-size: 1rem;
    line-height: 1.6;
    margin: 10px 0 20px 0;

    @media (max-width: 768px) {
        font-size: 0.9rem;
    }
`;

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 30px;
    }
`;

const TextContent = styled.div`
    @media (max-width: 768px) {
        order: 2;
    }
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

    @media (max-width: 768px) {
        padding: 20px;
        order: 1;

        img {
            max-height: 300px;
        }
    }

    @media (max-width: 480px) {
        padding: 15px;

        img {
            max-height: 250px;
        }
    }
`;

export default function Featured({ product }) {
  // Don't render if no product
  if (!product) {
    return null;
  }

  // Build full product name from category + title
  const brandName = product.category?.name || '';
  const productTitle = product.title || '';
  const fullName = brandName ? `${brandName} ${productTitle}` : productTitle;

  return (
    <BG>
      <Center>
        <ColumnsWrapper>
          <TextContent>
            <Title>{fullName}</Title>
            <Description>{product.description || `Discover the luxury of ${fullName}`}</Description>
            <ButtonLink href={'/product/' + product._id} primary>View Product</ButtonLink>
          </TextContent>
          <ImageWrapper>
            <img
              src={product.images?.[0]}
              alt={fullName}
            />
          </ImageWrapper>
        </ColumnsWrapper>
      </Center>
    </BG>
  );
}