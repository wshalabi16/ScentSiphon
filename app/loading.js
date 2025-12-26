export default function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p className="loading-text">Loading...</p>

      <style dangerouslySetInnerHTML={{__html: `
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          padding: 40px 20px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #1a1a1a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          margin-top: 20px;
          font-family: var(--font-inter), sans-serif;
          color: #666;
          font-size: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}