import Link from 'next/link';

export default function ProductsNotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: 'var(--font-inter), sans-serif'
    }}>
      <h1 style={{
        fontFamily: 'var(--font-playfair), serif',
        fontSize: '2.5rem',
        marginBottom: '16px',
        color: '#1a1a1a'
      }}>
        Products Not Available
      </h1>
      <p style={{
        color: '#666',
        fontSize: '1.1rem',
        marginBottom: '32px',
        maxWidth: '600px'
      }}>
        We couldn't find the products you're looking for. Browse our homepage or try searching for something else.
      </p>
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link href="/products" style={{
          display: 'inline-block',
          backgroundColor: '#fff',
          color: '#1a1a1a',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 500,
          border: '2px solid #1a1a1a'
        }}>
          Browse All Products
        </Link>
        <Link href="/" style={{
          display: 'inline-block',
          backgroundColor: '#1a1a1a',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 500
        }}>
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}