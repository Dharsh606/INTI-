import React from 'react';
import { Link } from 'react-router-dom';

function Terms() {
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
          Terms &amp; Conditions
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
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing and browsing the digital studio space of INTI (located at <strong>https://inti.design</strong>), you agree to comply with and be bound by the following terms, conditions, and spatial liability disclosures.
            </p>
          </section>

          <section>
            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '400', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
              2. Design Disclosures & Renderings
            </h3>
            <p>
              All mockups, structural blueprints, and photorealistic spatial renderings displayed on this website are representations of architectural intents. Actual colors, textures, and fabric tones may vary slightly in physical application due to localized lighting conditions, raw material availability, and dynamic wood grain differences.
            </p>
          </section>

          <section>
            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '400', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
              3. Consultation Booking Commitments
            </h3>
            <p>
              Submitting a booking inquiry does not establish a contract of service. Booking coordination depends on spatial design availability. We reserve the right to decline project intakes that do not align with our studio capacity or architectural values.
            </p>
          </section>

          <section>
            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '400', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
              4. Intellectual Property
            </h3>
            <p>
              All photographs, digital floor plans, architectural layout drawings, logos, and custom copy elements displayed on this platform are the exclusive intellectual property of INTI. Reproduction, scraping, or distribution of these assets without written studio consent is strictly prohibited.
            </p>
          </section>

          <section style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Last updated: July 2026. For questions or support, contact the studio administration.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Terms;
