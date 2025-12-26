import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | ScentSiphon',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
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
        fontSize: '6rem',
        marginBottom: 0,
        color: '#1a1a1a',
        fontWeight: 700
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: '1.5rem',
        marginBottom: '16px',
        color: '#1a1a1a',
        fontWeight: 600
      }}>
        Page Not Found
      </h2>
      <p style={{
        color: '#666',
        fontSize: '1rem',
        marginBottom: '32px',
        maxWidth: '500px'
      }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>
      <Link href="/" style={{
        display: 'inline-block',
        backgroundColor: '#1a1a1a',
        color: 'white',
        padding: '12px 32px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'background-color 0.2s'
      }}>
        Return to Homepage
      </Link>
    </div>
  );
}