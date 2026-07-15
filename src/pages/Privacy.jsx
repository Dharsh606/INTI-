import React from 'react';
import { Link } from 'react-router-dom';

function Privacy() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#fff',
      fontFamily: 'var(--font-sans)',
      padding: '120px 24px 80px 24px',
      position: 'relative'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100px',
        padding: '0 80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        zIndex: 10
      }} className="legal-nav">
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/assets/logo.png" alt="INTI Logo" style={{ height: '32px' }} />
        </Link>
        <Link to="/" style={{
          color: 'var(--color-gold)',
          textDecoration: 'none',
          fontSize: '11px',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-accent)',
          letterSpacing: '0.1em'
        }}>
          &larr; Back to Studio
        </Link>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <p style={{
          fontFamily: 'var(--font-accent)',
          fontSize: '11px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--color-gold)',
          marginBottom: '16px'
        }}>
          Legal Documentation
        </p>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'calc(2.2rem + 1vw)',
          fontWeight: '300',
          lineHeight: '1.2',
          margin: '0 0 40px 0',
          letterSpacing: '0.02em'
        }}>
          Privacy Policy
        </h1>

        <div style={{
          width: '100%',
          height: '1px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          marginBottom: '40px'
        }} />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          fontSize: '14px',
          lineHeight: '1.8',
          color: 'rgba(255,255,255,0.6)',
          fontWeight: '300'
        }}>
          <section>
            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '400', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
              1. Overview
            </h3>
            <p>
              INTI ("we," "our," or "us") takes the protection of your digital privacy seriously. This Privacy Policy details how we gather, process, store, and safeguard the information you provide voluntarily when interacting with our online studio space located at <strong>https://inti.design</strong>.
            </p>
          </section>

          <section>
            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '400', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
              2. Information We Collect
            </h3>
            <p>
              We only collect personal information that you explicitly submit through our digital forms (e.g. Booking and Consultation Inquiry Forms). This includes:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              <li>Contact coordinates: Your first name, last name, phone number, and email address.</li>
              <li>Project details: Target type of spatial fit-out (e.g. Corporate Office, Residential Villa) and details regarding your aesthetic vision.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '400', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
              3. Purpose of Processing
            </h3>
            <p>
              The information submitted is processed solely to fulfill your requests:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              <li>To evaluate project scopes and coordinate physical consultations.</li>
              <li>To update site features or communicate administrative updates directly relevant to active project pipelines.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '400', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
              4. Data Protection & Isolation
            </h3>
            <p>
              All submissions are stored securely in encrypted databases hosted via Supabase. We do not Sell, Rent, or distribute your private contact info to any third-party marketing services. Access to your contact logs is restricted to authorized INTI studio administrators only.
            </p>
          </section>

          <section>
            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '400', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
              5. Your Choices & Rights
            </h3>
            <p>
              You have the right to request deletion of your booking history from our logs at any time. To request data removal, please contact the studio coordinators.
            </p>
          </section>

          <section style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Last updated: July 2026. For inquiries, reach out directly via our official consultation channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
