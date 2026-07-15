import React from 'react';
import { Link } from 'react-router-dom';

function Maintenance() {
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
        left: '20%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 100%)',
        right: '20%',
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
          Studio Status: Refining
        </p>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'calc(2.2rem + 1.8vw)',
          fontWeight: '300',
          lineHeight: '1.2',
          margin: '0 0 20px 0',
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        }}>
          Composing New <br /><em>Atmospheres</em>
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
          marginBottom: '32px',
          fontWeight: '300'
        }}>
          We are currently updating our digital catalog, adding newly finalized projects, and tuning database systems to enhance your virtual studio walkthrough. We will be back online momentarily.
        </p>

        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          padding: '16px 24px',
          borderRadius: '2px',
          marginBottom: '40px'
        }}>
          <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-accent)' }}>
            Estimated Downtime: <strong style={{ color: 'var(--color-gold)', fontWeight: '500' }}>Less than 1 hour</strong>
          </p>
        </div>

        <div>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--color-gold)',
            color: '#000',
            border: 'none',
            padding: '14px 32px',
            fontSize: '11px',
            fontFamily: 'var(--font-accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            textDecoration: 'none',
            borderRadius: '2px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'none';
          }}>
            Check Studio Status
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Maintenance;
