import React, { useEffect, useLayoutEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import Home from './pages/Home.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';

// Scroll to top on route change synchronously during layout phase
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

function App() {
  useEffect(() => {
    // 1. Custom Cursor Elements
    const cursor = document.getElementById('custom-cursor');
    const glow = document.querySelector('.cursor-glow');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);

    // Smooth cursor follower loop
    let frameId;
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      if (cursor) {
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      }
      frameId = requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // 2. Custom Cursor Hover Event Delegation
    const handleMouseOver = (e) => {
      const hoverTarget = e.target.closest('a, button, select, .mb-opt, .project-card, .gallery-item');
      if (hoverTarget) {
        gsap.to('.cursor-line-h', { width: 60, backgroundColor: 'rgba(197,168,128,0.9)', duration: 0.3, overwrite: 'auto' });
        gsap.to('.cursor-line-v', { height: 60, backgroundColor: 'rgba(197,168,128,0.9)', duration: 0.3, overwrite: 'auto' });
        gsap.to('.cursor-dot', { scale: 2, backgroundColor: '#ffffff', duration: 0.3, overwrite: 'auto' });
        if (cursor) cursor.classList.add('cursor-hover');
      }
    };

    const handleMouseOut = (e) => {
      const hoverTarget = e.target.closest('a, button, select, .mb-opt, .project-card, .gallery-item');
      if (hoverTarget) {
        gsap.to('.cursor-line-h', { width: 40, backgroundColor: 'rgba(212,175,122,0.4)', duration: 0.3, overwrite: 'auto' });
        gsap.to('.cursor-line-v', { height: 40, backgroundColor: 'rgba(212,175,122,0.4)', duration: 0.3, overwrite: 'auto' });
        gsap.to('.cursor-dot', { scale: 1, backgroundColor: 'var(--color-gold)', duration: 0.3, overwrite: 'auto' });
        if (cursor) cursor.classList.remove('cursor-hover');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // 3. Global Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    let lenisRafId;
    function raf(time) {
      lenis.raf(time);
      lenisRafId = requestAnimationFrame(raf);
    }
    lenisRafId = requestAnimationFrame(raf);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(lenisRafId);
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      {/* Global Custom Cursor Markup */}
      <div className="cursor-crosshair" id="custom-cursor">
        <div className="cursor-dot"></div>
        <div className="cursor-line-h"></div>
        <div className="cursor-line-v"></div>
      </div>
      <div className="cursor-glow" aria-hidden="true"></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project" element={<ProjectDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
