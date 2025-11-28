"use client";
import Center from "./Center";
import styled from 'styled-components';
import Button from "./Button";

const BG = styled.div`
    background-color: #f7f7f7;
    color: #333;
    padding: 80px 0;
`;  

const Title = styled.h1`
    font-family: var(--font-playfair), serif;
    font-weight: 600;
    font-size: 3rem;
    margin: 0 0 10px 0;
    color: #1a1a1a;
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
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    
    img {
        max-width: 100%;
        max-height: 400px;
        object-fit: contain;
    }
`;

export default function Featured() {
    return(
        <BG>
            <Center>
                <ColumnsWrapper>
                    <div>
                        <Title>Dior Homme Intense</Title>
                        <Description>
                            Experience the iconic scent of Dior Homme Intense - 
                            a sophisticated blend of iris, lavender, and pear. 
                            Available in convenient decant sizes perfect for 
                            trying before committing to a full bottle.
                        </Description>
                        <Button>View Product</Button>
                    </div>
                    <ImageWrapper>
                        <img 
                            src="https://scent-siphon-admin.s3.amazonaws.com/1764237386207.jpg" 
                            alt="Dior Homme Intense Perfume" 
                        />
                    </ImageWrapper>
                </ColumnsWrapper>
            </Center>  
        </BG>
    );
}