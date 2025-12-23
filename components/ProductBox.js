import styled from "styled-components";
import Link from "next/link";

const ProductWrapper = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    transform: translateY(-4px);
    border-color: #e0e0e0;
  }
`;

const ProductImageBox = styled(Link)`
  display: block;
  background-color: #fafafa;
  padding: 30px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  text-decoration: none;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 200px;
    padding: 20px;
  }

  @media (max-width: 480px) {
    height: 180px;
    padding: 15px;
  }
`;

const ProductInfoBox = styled.div`
  padding: 20px;
  padding-bottom: 30px;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    padding: 16px;
    padding-bottom: 24px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    padding-bottom: 20px;
  }
`;

const BrandName = styled(Link)`
  font-family: var(--font-inter), sans-serif;
  font-weight: 400;
  font-size: 0.85rem;
  color: #666;
  display: block;
  text-decoration: none;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    color: #1a1a1a;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const ProductTitle = styled(Link)`
  font-family: var(--font-inter), sans-serif;
  font-weight: 500;
  font-size: 1rem;
  margin: 0 0 12px 0;
  color: #1a1a1a;
  display: block;
  text-decoration: none;
  line-height: 1.4;

  &:hover {
    color: #666;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 0 0 8px 0;
  }
`;

const PriceRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
`;

const PriceLabel = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-size: 0.85rem;
  color: #999;
`;

const Price = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  color: #1a1a1a;
`;

const ViewButton = styled(Link)`
  display: block;
  width: 100%;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  text-decoration: none;
  font-family: var(--font-inter), sans-serif;
  box-sizing: border-box;

  &:hover {
    background-color: #000;
  }
`;

const StockBadge = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 8px;
  font-family: var(--font-inter), sans-serif;
  background-color: ${props => props.$type === 'out' ? '#fee2e2' : '#fef3c7'};
  color: ${props => props.$type === 'out' ? '#dc2626' : '#f59e0b'};
`;

export default function ProductBox({ product }) {
  const lowestPrice = product.variants && product.variants.length > 0
    ? Math.min(...product.variants.map(v => v.price))
    : product.price;

  const brandName = product.category?.name || '';
  const productTitle = product.title || '';

  // Check stock status
  const hasVariants = product.variants && product.variants.length > 0;
  let allOutOfStock = false;
  let hasLowStock = false;

  if (hasVariants) {
    allOutOfStock = product.variants.every(v => (v.stock || 0) === 0);
    hasLowStock = !allOutOfStock && product.variants.some(v => {
      const stock = v.stock || 0;
      return stock > 0 && stock <= 5;
    });
  }

  return (
    <ProductWrapper>
      <ProductImageBox href={`/product/${product._id}`}>
        <img src={product.images?.[0]} alt={`${brandName} ${productTitle}`} />
      </ProductImageBox>
      <ProductInfoBox>
        {brandName && (
          <BrandName href={`/product/${product._id}`}>
            {brandName}
          </BrandName>
        )}
        <ProductTitle href={`/product/${product._id}`}>
          {productTitle}
        </ProductTitle>
        {allOutOfStock && (
          <StockBadge $type="out">Out of Stock</StockBadge>
        )}
        {!allOutOfStock && hasLowStock && (
          <StockBadge $type="low">Low Stock</StockBadge>
        )}
        <PriceRow>
          <PriceLabel>Starting from</PriceLabel>
          <Price>${lowestPrice}</Price>
        </PriceRow>
        <ViewButton href={`/product/${product._id}`}>
          View
        </ViewButton>
      </ProductInfoBox>
    </ProductWrapper>
  );
}