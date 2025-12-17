"use client";
import styled from "styled-components";

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const ImageButton = styled.div`
  border: 1px solid #f0f0f0;
  height: 80px;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  &:hover {
    border-color: #1a1a1a;
  }
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

export default function ProductImages({images}){
  return(
    <>
      <Image src={images?.[0]} alt="Product" />
      <ImagesGrid>
        {images?.map((image, index) => (
          <ImageButton key={index}>
            <img src={image} alt={`Product view ${index + 1}`} />
          </ImageButton>
        ))}
      </ImagesGrid>
    </>
  );
}