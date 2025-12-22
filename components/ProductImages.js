"use client";
import { useState } from "react";
import styled from "styled-components";

const ImageGalleryWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const BigImageWrapper = styled.div`
  background-color: #fafafa;
  border-radius: 12px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    padding: 20px;
    min-height: 300px;
  }

  @media (max-width: 480px) {
    padding: 15px;
    min-height: 250px;
  }
`;

const BigImage = styled.img`
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;

  @media (max-width: 768px) {
    max-height: 400px;
  }

  @media (max-width: 480px) {
    max-height: 300px;
  }
`;

const ImageButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const ImageButton = styled.div`
  border: 2px solid ${props => props.$active ? '#1a1a1a' : '#e5e5e5'};
  width: 80px;
  height: 80px;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$active ? '#fafafa' : 'white'};

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  &:hover {
    border-color: #1a1a1a;
    background-color: #fafafa;
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    padding: 6px;
  }
`;

export default function ProductImages({images}) {
  const [activeImage, setActiveImage] = useState(images?.[0]);
  
  return (
    <ImageGalleryWrapper>
      <BigImageWrapper>
        <BigImage src={activeImage} alt="" />
      </BigImageWrapper>
      <ImageButtons>
        {images?.map(image => (
          <ImageButton 
            key={image} 
            $active={image === activeImage}
            onClick={() => setActiveImage(image)}
          >
            <img src={image} alt="" />
          </ImageButton>
        ))}
      </ImageButtons>
    </ImageGalleryWrapper>
  );
}