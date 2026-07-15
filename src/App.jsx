import React, { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import Home from './pages/Home.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Admin from './pages/Admin.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import NotFound from './pages/NotFound.jsx';
import Maintenance from './pages/Maintenance.jsx';

// Toggle this variable to true to place the entire public site under maintenance.
// Keep it as false for normal operation. The /admin panel remains active either way.
const UNDER_MAINTENANCE = true;

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

    // 3. Global Lenis Smooth Scroll (Destroyed on /admin, Created elsewhere)
    let lenis = null;
    let lenisRafId = null;

    const initLenis = () => {
      if (lenis) return;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        syncTouch: false,
        infinite: false,
      });

      function raf(time) {
        if (lenis) {
          lenis.raf(time);
          lenisRafId = requestAnimationFrame(raf);
        }
      }
      lenisRafId = requestAnimationFrame(raf);
    };

    const destroyLenis = () => {
      if (lenisRafId) cancelAnimationFrame(lenisRafId);
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
    };

    const handleRouteScroll = () => {
      const isSearchAdmin = window.location.hash.includes('/admin') || window.location.pathname.includes('/admin');
      if (isSearchAdmin) {
        destroyLenis();
      } else {
        initLenis();
      }
    };

    window.addEventListener('hashchange', handleRouteScroll);
    handleRouteScroll(); // Initial check

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('hashchange', handleRouteScroll);
      cancelAnimationFrame(frameId);
      destroyLenis();
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
        <Route path="/" element={UNDER_MAINTENANCE ? <Maintenance /> : <Home />} />
        <Route path="/project" element={UNDER_MAINTENANCE ? <Maintenance /> : <ProjectDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/privacy" element={UNDER_MAINTENANCE ? <Maintenance /> : <Privacy />} />
        <Route path="/terms" element={UNDER_MAINTENANCE ? <Maintenance /> : <Terms />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="*" element={UNDER_MAINTENANCE ? <Maintenance /> : <NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
