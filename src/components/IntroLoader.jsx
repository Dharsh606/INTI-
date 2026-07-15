import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

function IntroLoader({ onComplete }) {
  const containerRef = useRef(null);
  const letterRefs = useRef([]);
  const gridRef = useRef(null);
  const counterRef = useRef(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // 1. Percentage counter animation (0.00% to 100.00%)
    const counterObj = { val: 0 };
    const timeline = gsap.timeline({
      onComplete: () => {
        // 4. Split and slide-open doors animation on complete
        const lines = gridRef.current.querySelectorAll('.grid-line-draw');
        gsap.timeline({
          onComplete: onComplete
        })
        .to(lines, {
          scaleX: 0,
          scaleY: 0,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power4.inOut'
        })
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power3.inOut'
        }, '-=0.4');
      }
    });

    timeline.to(counterObj, {
      val: 100,
      duration: 3.2,
      ease: 'power2.out',
      onUpdate: () => {
        setPercent(counterObj.val.toFixed(2));
      }
    });

    // 2. Letter stagger spacing and glow animation
    timeline.fromTo(
      letterRefs.current,
      { opacity: 0, y: 15, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, stagger: 0.2, ease: 'power3.out' },
      0.2
    );

    // Letter spacing expansion
    timeline.to(
      letterRefs.current,
      { letterSpacing: '0.6em', duration: 2.2, ease: 'power2.out' },
      0.8
    );

    // 3. Architectural grid line drawing animations
    const horizontalLines = gridRef.current.querySelectorAll('.grid-h-line');
    const verticalLines = gridRef.current.querySelectorAll('.grid-v-line');

    gsap.fromTo(
      horizontalLines,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.8, ease: 'power3.inOut', stagger: 0.15 },
      0.1
    );

    gsap.fromTo(
      verticalLines,
      { scaleY: 0 },
      { scaleY: 1, duration: 1.8, ease: 'power3.inOut', stagger: 0.15 },
      0.1
    );

    return () => {
      timeline.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0a0a0a',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
        pointerEvents: 'all'
      }}
    >
      {/* Golden Architectural Grid */}
      <div 
        ref={gridRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none'
        }}
      >
        {/* Horizontal grid lines */}
        <div className="grid-h-line grid-line-draw" style={{ position: 'absolute', top: '25%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(212,175,122,0.06)', transformOrigin: 'left' }} />
        <div className="grid-h-line grid-line-draw" style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(212,175,122,0.08)', transformOrigin: 'center' }} />
        <div className="grid-h-line grid-line-draw" style={{ position: 'absolute', top: '75%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(212,175,122,0.06)', transformOrigin: 'right' }} />

        {/* Vertical grid lines */}
        <div className="grid-v-line grid-line-draw" style={{ position: 'absolute', left: '25%', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(212,175,122,0.06)', transformOrigin: 'top' }} />
        <div className="grid-v-line grid-line-draw" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(212,175,122,0.08)', transformOrigin: 'center' }} />
        <div className="grid-v-line grid-line-draw" style={{ position: 'absolute', left: '75%', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(212,175,122,0.06)', transformOrigin: 'bottom' }} />
      </div>

      {/* Loading elements container */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
        
        {/* Central Monogram */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {['I', 'N', 'T', 'Î'].map((char, index) => (
            <span
              key={index}
              ref={(el) => (letterRefs.current[index] = el)}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '48px',
                fontWeight: '300',
                color: 'var(--color-gold)',
                textShadow: '0 0 20px rgba(212,175,122,0.3)',
                display: 'inline-block',
                margin: '0 0.1em',
                position: 'relative'
              }}
            >
              {char === 'Î' ? (
                <>
                  I
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%) scaleX(1.3)',
                    fontSize: '10px',
                    color: 'var(--color-gold)',
                    textShadow: 'none'
                  }}>▲</span>
                </>
              ) : char}
            </span>
          ))}
        </div>

        {/* Dynamic Percentage Coordinates */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span 
            ref={counterRef}
            style={{
              fontFamily: 'var(--font-accent)',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.15em'
            }}
          >
            {percent}%
          </span>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-accent)' }}>
            Aligning Spatial Coordinates
          </span>
        </div>
      </div>
    </div>
  );
}

export default IntroLoader;
