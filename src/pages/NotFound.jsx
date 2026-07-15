import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(212,175,122,0.04) 0%, rgba(0,0,0,0) 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }} />

      {/* Decorative vertical lines */}
      <div style={{
        position: 'absolute',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 100%)',
        left: '15%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 100%)',
        right: '15%',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
        <p style={{
          fontFamily: 'var(--font-accent)',
          fontSize: '11px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--color-gold)',
          marginBottom: '24px'
        }}>
          Error Code 404
        </p>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'calc(2rem + 2vw)',
          fontWeight: '300',
          lineHeight: '1.2',
          margin: '0 0 20px 0',
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        }}>
          Space Not Found
        </h1>

        <div style={{
          width: '40px',
          height: '1px',
          backgroundColor: 'rgba(212,175,122,0.3)',
          margin: '0 auto 24px auto'
        }} />

        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '15px',
          lineHeight: '1.7',
          marginBottom: '40px',
          fontWeight: '300'
        }}>
          The coordinates or layout you requested do not exist in our spatial records. The section might have been moved, deleted, or never drafted.
        </p>

        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          background: 'transparent',
          border: '1px solid var(--color-gold)',
          color: 'var(--color-gold)',
          padding: '14px 28px',
          fontSize: '11px',
          fontFamily: 'var(--font-accent)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          textDecoration: 'none',
          borderRadius: '2px',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-gold)';
          e.currentTarget.style.color = '#000';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--color-gold)';
        }}>
          Return to Studio &rarr;
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
