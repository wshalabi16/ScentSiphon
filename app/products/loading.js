export default function ProductsLoading() {
  return (
    <div className="products-loading-wrapper">
      <h1 className="products-loading-title">All Products</h1>
      <div className="products-loading-grid">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-image" />
            <div className="skeleton-text" />
            <div className="skeleton-text skeleton-text-short" />
            <div className="skeleton-price" />
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .products-loading-wrapper {
          padding: 40px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .products-loading-title {
          font-family: var(--font-playfair), serif;
          font-size: 2rem;
          margin-bottom: 32px;
          text-align: center;
          color: #1a1a1a;
        }

        .products-loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }

        .skeleton-card {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .skeleton-image {
          width: 100%;
          height: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .skeleton-text {
          height: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .skeleton-text-short {
          width: 80%;
        }

        .skeleton-price {
          height: 16px;
          width: 60%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          margin-top: 12px;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}} />
    </div>
  );
}