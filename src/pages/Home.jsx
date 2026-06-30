import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Home() {
  // ----------------------------------------------------
  // React States for Interactive Elements
  // ----------------------------------------------------
  const [activeTab, setActiveTab] = useState('all');
  const [reserveOpen, setReserveOpen] = useState(false);
  
  // Style Quiz States
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  // Moodboard States
  const [mbPalette, setMbPalette] = useState('warm');
  const [mbMaterial, setMbMaterial] = useState('marble');
  const [mbRoom, setMbRoom] = useState('living');

  // Floating CTA visibility
  const [floatingCtaVisible, setFloatingCtaVisible] = useState(false);

  // Refs for sequential videos
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const canvasRef = useRef(null);

  // ----------------------------------------------------
  // Moodboard Result Logic
  // ----------------------------------------------------
  const moodboardDescriptions = {
    'warm-marble-living': { desc: 'A sun-drenched living space anchored by veined marble and burnished brass — radiating warmth without a word.', img: 0 },
    'warm-wood-living': { desc: 'Warm timber tones and wide-plank floors define a living space that feels grounded, tactile, and alive.', img: 1 },
    'cool-marble-bedroom': { desc: 'Cool marble surfaces meet linen drapes in a bedroom designed for deep, effortless rest.', img: 2 },
    'neutral-linen-dining': { desc: 'A neutral palette of linen, stone, and oak — a dining room where every meal becomes an occasion.', img: 0 },
  };

  const getMoodboardResult = () => {
    const key = `${mbPalette}-${mbMaterial}-${mbRoom}`;
    return moodboardDescriptions[key] || {
      desc: `A ${mbPalette} ${mbRoom} defined by ${mbMaterial} — crafted with restraint and lived-in warmth.`,
      img: 1
    };
  };

  const mbResult = getMoodboardResult();

  // ----------------------------------------------------
  // Style Quiz Logic
  // ----------------------------------------------------
  const quizProfiles = {
    'warm-serene': { name: 'The Warm Minimalist', desc: 'Spaces that breathe — clean lines softened by natural warmth, every material chosen with intention.', img: '/assets/photo/bg1.jpg' },
    'warm-bold': { name: 'The Warm Maximalist', desc: 'Richly layered interiors where texture, colour, and light create a world that feels unapologetically alive.', img: '/assets/photo/q1.jpg' },
    'cool-serene': { name: 'The Quiet Purist', desc: 'An austere elegance where cool tones and clean geometry speak louder than ornament ever could.', img: '/assets/photo/watch.jpg' },
    'cool-timeless': { name: 'The Architectural Mind', desc: 'Spaces defined by structure and light — where every proportion is deliberate and every surface intentional.', img: '/assets/photo/z1.jpg' },
    'tactile-intimate': { name: 'The Sensory Curator', desc: 'A world of touchable surfaces and intimate scale — every room a retreat that engages all five senses.', img: '/assets/photo/ethos-bg-rs.jpg' },
    'default': { name: 'The Timeless Visionary', desc: 'Your spaces transcend trend — refined, considered, and built to outlast the moment they were made.', img: '/assets/photo/ethos-bg.jpg' },
  };

  const handleQuizAnswer = (step, val) => {
    const updatedAnswers = { ...answers, [step]: val };
    setAnswers(updatedAnswers);

    if (step < 5) {
      setQuizStep(step + 1);
    } else {
      const light = updatedAnswers[1] || 'warm';
      const word = updatedAnswers[5] || 'timeless';
      const texture = updatedAnswers[2] || 'smooth';
      const profileKey = `${light}-${word}`;
      const profile = quizProfiles[profileKey] || quizProfiles[`${texture}-${word}`] || quizProfiles['default'];
      setQuizResult(profile);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setQuizStep(1);
    setQuizResult(null);
  };

  // ----------------------------------------------------
  // Smooth Scroll Helper
  // ----------------------------------------------------
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const offset = 76;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // ----------------------------------------------------
  // GSAP Animations and Canvas Render
  // ----------------------------------------------------
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.clearScrollMemory();

    let ctx = gsap.context(() => {
      // 1. Navigation Entrance
      gsap.fromTo("#main-nav",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.3 }
      );

      // 2. Hero Text & Scrolling indicator intro
      const scrollIndicator = document.querySelector('.hero-scroll-indicator');
      gsap.fromTo(".hero-text-bg",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 2, ease: 'power2.out', delay: 0.5 }
      );
      gsap.fromTo(".hero-details",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: 'power4.out', delay: 0.6 }
      );
      gsap.to(scrollIndicator, { opacity: 1, duration: 1, delay: 2, ease: 'power2.out' });

      // 3. Mouse Parallax for Hero
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const handleMouseMoveParallax = (e) => {
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        gsap.to(".layer-far", { x: dx * 12, y: dy * 12, duration: 1.2, ease: 'power2.out' });
        gsap.to(".layer-mid", { x: dx * 22, y: dy * 22, duration: 1.2, ease: 'power2.out' });
        gsap.to(".hero-text-bg", { x: dx * 8, y: dy * 8, duration: 1.4, ease: 'power2.out' });
      };
      document.addEventListener('mousemove', handleMouseMoveParallax);

      // 4. Hero Parallax Scroll
      gsap.timeline({
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })
      .to(".hero-details", { y: 80, autoAlpha: 0, ease: 'none' }, 0)
      .to(".hero-text-bg", { scale: 1.1, autoAlpha: 0, ease: 'none' }, 0)
      .to(scrollIndicator, { autoAlpha: 0, ease: 'none' }, 0);

      // 5. Signature Project Reveal ScrollTrigger
      const watch = document.querySelector('.product-reveal-watch-container');
      const details = document.querySelector('.product-reveal-details');
      const sigBgImg = document.querySelector('.product-reveal-bg-img');

      if (sigBgImg) {
        gsap.to(sigBgImg, {
          y: '-15%', ease: 'none',
          scrollTrigger: { trigger: '#signature', start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
      ScrollTrigger.create({
        trigger: '#signature', start: 'top 60%',
        onEnter: () => {
          gsap.to(watch, { y: 0, opacity: 1, rotation: 0, duration: 1.2, ease: 'power4.out' });
          gsap.to(details, { y: 0, opacity: 1, duration: 1.2, delay: 0.2, ease: 'power4.out' });
        }
      });

      // 6. Heritage Section scroll reveal
      const heritageBg = document.querySelector('.heritage-bg-img');
      if (heritageBg) {
        gsap.to(heritageBg, {
          scale: 1.1, y: '-5%', ease: 'none',
          scrollTrigger: { trigger: '#heritage', start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
      ScrollTrigger.create({
        trigger: '#heritage', start: 'top 60%',
        onEnter: () => {
          const els = document.querySelectorAll('.heritage-eyebrow, .heritage-title, .heritage-divider, .heritage-body, .heritage-link');
          gsap.fromTo(els, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power4.out' });
          const stats = document.querySelectorAll('.heritage-stat');
          stats.forEach((stat, i) => gsap.fromTo(stat, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: i * 0.15, ease: 'power4.out' }));
        }
      });

      // 7. Collection Active Tab animations
      ScrollTrigger.create({
        trigger: '#collection', start: 'top 70%',
        onEnter: () => {
          const activeMain = document.querySelector('.ethos-main.active');
          if (activeMain) {
            const headerEls = activeMain.querySelectorAll('.ethos-category, .ethos-alt-title, .ethos-alt-subtitle');
            gsap.fromTo(headerEls, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out' });
            const cards = activeMain.querySelectorAll('.project-card');
            gsap.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.2 });
          }
        }
      });

      // 8. Showcase Section scroll parallax
      const showBg = document.querySelector('.showcase-bg-img');
      if (showBg) {
        gsap.to(showBg, {
          scale: 1.08, ease: 'none',
          scrollTrigger: { trigger: '#showcase', start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
      const showEls = document.querySelectorAll('.showcase-eyebrow, .showcase-headline, .showcase-body, .showcase-ig-link');
      gsap.fromTo(showEls, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power4.out',
        scrollTrigger: { trigger: '#showcase', start: 'top 65%' }
      });

      // 9. Footer scroll animations
      const footerCols = document.querySelectorAll('.footer-brand-col, .footer-col');
      gsap.fromTo(footerCols, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: 'power4.out',
        scrollTrigger: { trigger: '.footer', start: 'top 75%' }
      });

      return () => {
        document.removeEventListener('mousemove', handleMouseMoveParallax);
      };
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      ctx.revert();
      clearTimeout(refreshTimer);
    };
  }, []);

  // ----------------------------------------------------
  // Collection Tab Trigger Animations (GSAP Crossfade)
  // ----------------------------------------------------
  const switchCollectionTab = (tabId) => {
    if (tabId === activeTab) return;
    const activeMain = document.querySelector('.ethos-main.active');
    const targetMain = document.querySelector(`.ethos-main.variant-${tabId}`);
    if (!activeMain || !targetMain) {
      setActiveTab(tabId);
      return;
    }

    gsap.timeline()
      .to(activeMain, { opacity: 0, duration: 0.35, ease: 'power2.in' })
      .call(() => {
        setActiveTab(tabId);
      })
      .fromTo(targetMain, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      .call(() => {
        const cards = targetMain.querySelectorAll('.project-card');
        gsap.fromTo(cards, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
      });
  };

  // ----------------------------------------------------
  // Canvas Dismantle Image Animator
  // ----------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imageSources = [
      '/assets/photo/bg1.jpg',
      '/assets/photo/q1.jpg',
      '/assets/photo/watch.jpg',
      '/assets/photo/z1.jpg',
      '/assets/photo/ethos-bg.jpg',
      '/assets/photo/ethos-bg-rs.jpg',
    ];
    const images = [];
    let imagesLoaded = 0;
    const frameObject = { frame: 0 };

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(frameObject.frame);
    };

    window.addEventListener('resize', setCanvasSize);

    function drawFrame(frameIndex) {
      if (images.length === 0) return;
      const totalFrames = 100;
      const imgIndex = Math.min(Math.floor((frameIndex / totalFrames) * (images.length - 1)), images.length - 1);
      const nextImgIndex = Math.min(imgIndex + 1, images.length - 1);
      const localProgress = ((frameIndex / totalFrames) * (images.length - 1)) % 1;
      const img = images[imgIndex];
      const nextImg = images[nextImgIndex];
      if (!img || !img.complete) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const aspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = canvas.width / canvas.height;
      let dW, dH, dX, dY;
      if (aspect > canvasAspect) { dH = canvas.height; dW = dH * aspect; dX = (canvas.width - dW) / 2; dY = 0; }
      else { dW = canvas.width; dH = dW / aspect; dX = 0; dY = (canvas.height - dH) / 2; }

      ctx.globalAlpha = 1;
      ctx.drawImage(img, dX, dY, dW, dH);

      if (nextImg && nextImg.complete && localProgress > 0.7) {
        const fadeAlpha = (localProgress - 0.7) / 0.3;
        const nA = nextImg.naturalWidth / nextImg.naturalHeight;
        let nW, nH, nX, nY;
        if (nA > canvasAspect) { nH = canvas.height; nW = nH * nA; nX = (canvas.width - nW) / 2; nY = 0; }
        else { nW = canvas.width; nH = nW / nA; nX = 0; nY = (canvas.height - nH) / 2; }
        ctx.globalAlpha = fadeAlpha;
        ctx.drawImage(nextImg, nX, nY, nW, nH);
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    imageSources.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imagesLoaded++;
        images[i] = img;
        if (imagesLoaded === imageSources.length) {
          setCanvasSize();
          initScrollTriggerAnim();
        }
      };
      img.onerror = () => {
        imagesLoaded++;
      };
    });

    let scrollTriggerInstance;

    function initScrollTriggerAnim() {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: '#craftsmanship',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          frameObject.frame = progress * 99;
          drawFrame(Math.round(frameObject.frame));
        }
      });

      // Text animations
      gsap.to(".dismantle-header", {
        x: '-120%', opacity: 0, ease: 'power2.in',
        scrollTrigger: { trigger: '#craftsmanship', start: 'top 10%', end: 'top -30%', scrub: 1 }
      });
      gsap.fromTo(".dismantle-overlay-text", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: '#craftsmanship', start: 'top 40%', end: 'top 20%', scrub: 1 }
      });
    }

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
    };
  }, []);

  // ----------------------------------------------------
  // Sequential video player initiation
  // ----------------------------------------------------
  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    const playVideo1 = () => {
      if (!video1 || !video2) return;
      video2.pause();
      video2.currentTime = 0;
      video2.style.opacity = '0';
      video1.currentTime = 0;
      video1.play().catch(() => {});
      video1.style.opacity = '1';
    };

    const playVideo2 = () => {
      if (!video1 || !video2) return;
      video1.pause();
      video1.currentTime = 0;
      video1.style.opacity = '0';
      video2.currentTime = 0;
      video2.play().catch(() => {});
      video2.style.opacity = '1';
    };

    if (video1) {
      video1.addEventListener('ended', playVideo2);
      // Play on start
      gsap.to(video1, {
        scale: 1.05, opacity: 1, duration: 2, ease: 'power2.out',
        onComplete: () => video1.play().catch(() => {})
      });
    }
    if (video2) {
      video2.addEventListener('ended', playVideo1);
      gsap.set(video2, { scale: 1.05 });
    }

    return () => {
      if (video1) video1.removeEventListener('ended', playVideo2);
      if (video2) video2.removeEventListener('ended', playVideo1);
    };
  }, []);

  // ----------------------------------------------------
  // Scroll and Nav tracking (Hide Nav on Scroll Down)
  // ----------------------------------------------------
  useEffect(() => {
    let lastScroll = 0;
    const handleScrollTracking = () => {
      const scroll = window.scrollY;
      const nav = document.getElementById('main-nav');
      if (!nav) return;

      if (scroll > lastScroll && scroll > 10) {
        gsap.to(nav, { y: -76, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      } else {
        gsap.to(nav, { y: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      }

      if (scroll > window.innerHeight * 0.8) {
        setFloatingCtaVisible(true);
      } else {
        setFloatingCtaVisible(false);
      }
      lastScroll = scroll;
    };

    window.addEventListener('scroll', handleScrollTracking);
    return () => window.removeEventListener('scroll', handleScrollTracking);
  }, []);

  // ----------------------------------------------------
  // Submit reservation form
  // ----------------------------------------------------
  const handleReservationSubmit = (e) => {
    e.preventDefault();
    const btn = document.querySelector('.form-submit-btn');
    if (!btn) return;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Request Sent ✓';
      btn.style.background = 'rgba(212,175,122,0.3)';
      btn.style.color = '#d4af7a';
      setTimeout(() => {
        setReserveOpen(false);
        // reset
        btn.textContent = 'Request Consultation';
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
      }, 2000);
    }, 1400);
  };

  return (
    <>

      {/* NAV */}
      <nav className="nav" id="main-nav">
        <div className="nav-logo-container">
          <a href="#" className="nav-logo-link" id="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="INTI Home">
            <img src="/assets/logo.png" alt="INTI Logo" className="nav-logo-img" />
          </a>
        </div>
        <div className="nav-links-right">
          <div class="nav-links">
            <a href="#signature" onClick={(e) => handleNavClick(e, 'signature')}>Signature</a>
            <a href="#heritage" onClick={(e) => handleNavClick(e, 'heritage')}>Heritage</a>
            <a href="#collection" onClick={(e) => handleNavClick(e, 'collection')}>Collection</a>
            <a href="#craftsmanship" onClick={(e) => handleNavClick(e, 'craftsmanship')}>Craftsmanship</a>
            <a href="#moodboard" onClick={(e) => handleNavClick(e, 'moodboard')}>Moodboard</a>
          </div>
          <button className="nav-cta open-reserve-modal" onClick={() => setReserveOpen(true)}>Book a Consultation</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <video ref={video1Ref} className="bg-video" id="hero-video-1" muted playsinline>
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <video ref={video2Ref} className="bg-video bg-video-2" id="hero-video-2" muted playsinline>
            <source src="/assets/video2.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-parallax-layer layer-far" data-speed="0.02"></div>
        <div className="hero-parallax-layer layer-mid" data-speed="0.05"></div>
        <div className="hero-content">
          <div className="hero-text-bg" aria-hidden="true">INTI</div>
          <div className="hero-details">
            <h1 className="hero-title">Interiors<br /><span className="accent">That Feel Alive</span></h1>
            <p className="hero-subtitle">Luxury interior design, crafted with editorial calm and human warmth.</p>
            <div className="hero-cta-group">
              <span className="limited-edition">Selected Projects</span>
              <button className="primary-btn open-quiz-modal" onClick={() => setQuizOpen(true)}>Discover Your Style</button>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-line"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* SIGNATURE REVEAL */}
      <section className="product-reveal" id="signature">
        <div className="product-reveal-bg">
          <img className="product-reveal-bg-img" src="/assets/photo/bg1.jpg" alt="INTI interior space" />
          <div className="product-reveal-overlay"></div>
        </div>
        <div className="product-reveal-content">
          <div className="product-reveal-text-bg" aria-hidden="true">PRECISION</div>
          <div className="product-reveal-watch-container">
            <img className="product-reveal-watch" src="/assets/photo/watch.jpg" alt="INTI design detail" />
          </div>
          <div className="product-reveal-details">
            <span className="edition-tag">Signature Project</span>
            <h2 class="product-reveal-title">Designed For<br /><span className="accent-gold">The Way You Live</span></h2>
            <p className="product-reveal-subtitle">Bespoke interiors shaped through spatial clarity, natural materiality, and refined detailing — every room designed to feel balanced, tactile, and timeless.</p>
            <div className="product-reveal-cta-group">
              <button className="secondary-btn open-reserve-modal" onClick={() => setReserveOpen(true)}>Begin Your Project</button>
            </div>
          </div>
        </div>
      </section>

      {/* HERITAGE */}
      <section className="heritage" id="heritage">
        <div className="heritage-bg">
          <img className="heritage-bg-img" src="/assets/photo/q1.jpg" alt="INTI studio space" />
          <div className="heritage-overlay"></div>
        </div>
        <div className="heritage-content">
          <div className="heritage-text">
            <p className="heritage-eyebrow">Est. 2017</p>
            <h2 className="heritage-title">A Studio<br />Built on <em>Vision</em></h2>
            <div className="heritage-divider"></div>
            <p className="heritage-body">INTI creates interiors that merge architecture, atmosphere, and lifestyle. Each project is guided by proportion, light, and a quiet sense of luxury.</p>
            <p className="heritage-body">From residences to hospitality spaces, the studio translates ideas into spaces that feel intimate, elegant, and deeply considered.</p>
            <button className="heritage-link open-reserve-modal" onClick={() => setReserveOpen(true)}>Discover Our Studio →</button>
          </div>
          <div className="heritage-stats">
            <div className="heritage-stat">
              <span className="stat-number">50+</span>
              <span class="stat-label">Completed Projects</span>
            </div>
            <div className="heritage-stat">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years of Collective Experience</span>
            </div>
            <div className="heritage-stat">
              <span className="stat-number">20+</span>
              <span className="stat-label">Material Libraries Curated</span>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="ethos" id="collection">
        <div className="ethos-header">
          <h2 className="ethos-section-title">THE COLLECTION</h2>
        </div>
        <div className="ethos-tabs-nav">
          <button className={`ethos-tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => switchCollectionTab('all')}>All</button>
          <button className={`ethos-tab-btn ${activeTab === 'office' ? 'active' : ''}`} onClick={() => switchCollectionTab('office')}>Office</button>
          <button className={`ethos-tab-btn ${activeTab === 'wellness' ? 'active' : ''}`} onClick={() => switchCollectionTab('wellness')}>Wellness</button>
        </div>
        <div className="ethos-slider-container">
          {/* ALL TAB */}
          <div className={`ethos-main variant-all ${activeTab === 'all' ? 'active' : ''}`} style={{ opacity: activeTab === 'all' ? 1 : 0 }}>
            <div className="ethos-tab-header">
              <div className="ethos-text-side">
                <p className="ethos-category">00 / Integrated Collection</p>
                <h2 className="ethos-alt-title">INTI PORTFOLIO</h2>
                <p className="ethos-alt-subtitle">A Complete Retrospective of Bespoke Spaces</p>
              </div>
            </div>
            <div className="ethos-cards-grid">
              <Link to="/project?id=hul-hosur-conf" className="project-card">
                <div className="project-card-img-wrap">
                  <img src="/assets/photo/project-1/img-4.jpg" alt="HUL Hosur - Conference Room" />
                </div>
                <div className="project-card-meta">
                  <span className="project-card-cat">Boardroom Case Study</span>
                </div>
                <h3 className="project-card-title">HUL Hosur - Conference Room</h3>
                <span className="project-card-link">View Case Study →</span>
              </Link>
              <Link to="/project?id=hul-hosur-fm" className="project-card">
                <div className="project-card-img-wrap">
                  <img src="/assets/photo/project-2/img-1.jpg" alt="HUL Hosur - FM Office Room" />
                </div>
                <div className="project-card-meta">
                  <span className="project-card-cat">Executive Office Case Study</span>
                </div>
                <h3 className="project-card-title">HUL Hosur - FM Office Room</h3>
                <span className="project-card-link">View Case Study →</span>
              </Link>
              <Link to="/project?id=ge-hosur-conf-2" className="project-card">
                <div className="project-card-img-wrap">
                  <img src="/assets/photo/project-6/img-1.jpg" alt="GE Hosur - Executive Boardroom" />
                </div>
                <div className="project-card-meta">
                  <span className="project-card-cat">Boardroom Case Study</span>
                </div>
                <h3 className="project-card-title">GE Hosur - Executive Boardroom</h3>
                <span className="project-card-link">View Case Study →</span>
              </Link>
              <Link to="/project?id=rb-hosur-conf" className="project-card">
                <div className="project-card-img-wrap">
                  <img src="/assets/photo/project-3/img-1.jpg" alt="RB Hosur - Executive Conference Room" />
                </div>
                <div className="project-card-meta">
                  <span className="project-card-cat">Conference Case Study</span>
                </div>
                <h3 class="project-card-title">RB Hosur - Executive Conference Room</h3>
                <span className="project-card-link">View Case Study →</span>
              </Link>
              <Link to="/project?id=hlrc-bangalore" className="project-card">
                <div className="project-card-img-wrap">
                  <img src="/assets/photo/project-5/img-1.jpg" alt="HLRC Bangalore - Research Lab" />
                </div>
                <div className="project-card-meta">
                  <span className="project-card-cat">Research Case Study</span>
                </div>
                <h3 className="project-card-title">HLRC Bangalore - Research Lab</h3>
                <span className="project-card-link">View Case Study →</span>
              </Link>
              <Link to="/project?id=rb-hosur-hygiene" className="project-card">
                <div className="project-card-img-wrap">
                  <img src="/assets/photo/project-4/img-1.jpg" alt="RB Hosur - Hygiene Station Entrance" />
                </div>
                <div className="project-card-meta">
                  <span className="project-card-cat">Entrance Case Study</span>
                </div>
                <h3 className="project-card-title">RB Hosur - Hygiene Station Entrance</h3>
                <span className="project-card-link">View Case Study →</span>
              </Link>
            </div>
          </div>

          {/* OFFICE TAB */}
          <div className={`ethos-main variant-office ${activeTab === 'office' ? 'active' : ''}`} style={{ opacity: activeTab === 'office' ? 1 : 0 }}>
            <div className="ethos-tab-header">
              <div className="ethos-text-side">
                <p className="ethos-category">01 / Corporate Office</p>
                <h2 className="ethos-alt-title">INTI WORKSPACE</h2>
                <p className="ethos-alt-subtitle">Precision, Acoustics, and Spatial Flow</p>
              </div>
            </div>
            <div className="ethos-cards-grid">
              <Link to="/project?id=hul-hosur-conf" className="project-card">
                <div className="project-card-img-wrap">
                  <img src="/assets/photo/project-1/img-4.jpg" alt="HUL Hosur - Conference Room" />
                </div>
                <div className="project-card-meta">
                  <span className="project-card-cat">Boardroom Case Study</span>
                </div>
                <h3 className="project-card-title">HUL Hosur - Conference Room</h3>
                <span className="project-card-link">View Case Study →</span>
              </Link>
              <Link to="/project?id=hul-hosur-fm" className="project-card">
                <div className="project-card-img-wrap">
                  <img src="/assets/photo/project-2/img-1.jpg" alt="HUL Hosur - FM Office Room" />
                </div>
                <div className="project-card-meta">
                  <span className="project-card-cat">Executive Office Case Study</span>
                </div>
                <h3 className="project-card-title">HUL Hosur - FM Office Room</h3>
                <span className="project-card-link">View Case Study →</span>
              </Link>
              <Link to="/project?id=ge-hosur-conf-2" className="project-card">
                <div className="project-card-img-wrap">
                  <img src="/assets/photo/project-6/img-1.jpg" alt="GE Hosur - Executive Boardroom" />
                </div>
                <div className="project-card-meta">
                  <span className="project-card-cat">Boardroom Case Study</span>
                </div>
                <h3 className="project-card-title">GE Hosur - Executive Boardroom</h3>
                <span className="project-card-link">View Case Study →</span>
              </Link>
              <Link to="/project?id=rb-hosur-conf" className="project-card">
                <div className="project-card-img-wrap">
                  <img src="/assets/photo/project-3/img-1.jpg" alt="RB Hosur - Executive Conference Room" />
                </div>
                <div className="project-card-meta">
                  <span className="project-card-cat">Conference Case Study</span>
                </div>
                <h3 className="project-card-title">RB Hosur - Executive Conference Room</h3>
                <span className="project-card-link">View Case Study →</span>
              </Link>
            </div>
          </div>

          {/* WELLNESS TAB */}
          <div className={`ethos-main variant-wellness ${activeTab === 'wellness' ? 'active' : ''}`} style={{ opacity: activeTab === 'wellness' ? 1 : 0 }}>
            <div className="ethos-tab-header">
              <div className="ethos-text-side">
                <p className="ethos-category">02 / Healthcare & Wellness</p>
                <h2 className="ethos-alt-title">INTI WELLNESS</h2>
                <p className="ethos-alt-subtitle">Hygienic Precision, Light, and Cleanliness</p>
              </div>
            </div>
            <div className="ethos-cards-grid">
              <Link to="/project?id=hlrc-bangalore" className="project-card">
                <div className="project-card-img-wrap">
                  <img src="/assets/photo/project-5/img-1.jpg" alt="HLRC Bangalore - Research Lab" />
                </div>
                <div className="project-card-meta">
                  <span className="project-card-cat">Research Case Study</span>
                </div>
                <h3 className="project-card-title">HLRC Bangalore - Research Lab</h3>
                <span className="project-card-link">View Case Study →</span>
              </Link>
              <Link to="/project?id=rb-hosur-hygiene" className="project-card">
                <div className="project-card-img-wrap">
                  <img src="/assets/photo/project-4/img-1.jpg" alt="RB Hosur - Hygiene Station Entrance" />
                </div>
                <div className="project-card-meta">
                  <span className="project-card-cat">Entrance Case Study</span>
                </div>
                <h3 className="project-card-title">RB Hosur - Hygiene Station Entrance</h3>
                <span className="project-card-link">View Case Study →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CRAFTSMANSHIP / CANVAS */}
      <section className="dismantle" id="craftsmanship">
        <div className="dismantle-container">
          <div className="dismantle-header">
            <h2 className="section-title">THE ARCHITECTURE OF <span className="accent">SPACE</span></h2>
            <p className="section-subtitle">Every project begins with spatial intent. Materials, joinery, illumination, and proportion are composed into a seamless experience.</p>
          </div>
          <div className="dismantle-canvas-wrap">
            <canvas ref={canvasRef} id="dismantle-canvas"></canvas>
            <div className="dismantle-overlay-text" aria-hidden="true">MATERIAL</div>
          </div>
        </div>
      </section>

      {/* MOODBOARD BUILDER */}
      <section className="moodboard-section" id="moodboard">
        <div className="mb-header">
          <p className="mb-eyebrow">Build Your Vision</p>
          <h2 className="mb-title">Your Space,<br /><em>Your Palette</em></h2>
          <p className="mb-subtitle">Select your preferences and we'll curate an INTI moodboard for you.</p>
        </div>
        <div className="mb-builder">
          <div className="mb-step" data-step="palette">
            <p className="mb-step-label">01 — Palette</p>
            <div className="mb-options">
              <button className={`mb-opt ${mbPalette === 'warm' ? 'active' : ''}`} onClick={() => setMbPalette('warm')}>
                <span className="mb-swatch" style={{ background: 'linear-gradient(135deg, #d4af7a, #c4956a, #8b6347)' }}></span>
                <span>Warm</span>
              </button>
              <button className={`mb-opt ${mbPalette === 'cool' ? 'active' : ''}`} onClick={() => setMbPalette('cool')}>
                <span className="mb-swatch" style={{ background: 'linear-gradient(135deg, #5bb3e4, #7ec8e3, #b8d8e8)' }}></span>
                <span>Cool</span>
              </button>
              <button className={`mb-opt ${mbPalette === 'neutral' ? 'active' : ''}`} onClick={() => setMbPalette('neutral')}>
                <span className="mb-swatch" style={{ background: 'linear-gradient(135deg, #c8c0b0, #e8e0d0, #f0ece4)' }}></span>
                <span>Neutral</span>
              </button>
            </div>
          </div>
          <div className="mb-step" data-step="material">
            <p className="mb-step-label">02 — Material</p>
            <div className="mb-options">
              <button className={`mb-opt ${mbMaterial === 'marble' ? 'active' : ''}`} onClick={() => setMbMaterial('marble')}>
                <span className="mb-icon">◈</span>
                <span>Marble</span>
              </button>
              <button className={`mb-opt ${mbMaterial === 'wood' ? 'active' : ''}`} onClick={() => setMbMaterial('wood')}>
                <span className="mb-icon">⬡</span>
                <span>Wood</span>
              </button>
              <button className={`mb-opt ${mbMaterial === 'linen' ? 'active' : ''}`} onClick={() => setMbMaterial('linen')}>
                <span className="mb-icon">◻</span>
                <span>Linen</span>
              </button>
            </div>
          </div>
          <div className="mb-step" data-step="room">
            <p className="mb-step-label">03 — Room</p>
            <div className="mb-options">
              <button className={`mb-opt ${mbRoom === 'living' ? 'active' : ''}`} onClick={() => setMbRoom('living')}>
                <span className="mb-icon">⌂</span>
                <span>Living</span>
              </button>
              <button className={`mb-opt ${mbRoom === 'bedroom' ? 'active' : ''}`} onClick={() => setMbRoom('bedroom')}>
                <span className="mb-icon">◡</span>
                <span>Bedroom</span>
              </button>
              <button className={`mb-opt ${mbRoom === 'dining' ? 'active' : ''}`} onClick={() => setMbRoom('dining')}>
                <span className="mb-icon">◎</span>
                <span>Dining</span>
              </button>
            </div>
          </div>
        </div>
        <div className="mb-result" id="mb-result">
          <div className="mb-result-images">
            <img className={`mb-img mb-img-1 ${mbResult.img === 0 ? 'active' : ''}`} src="/assets/photo/bg1.jpg" alt="Moodboard result" />
            <img className={`mb-img mb-img-2 ${mbResult.img === 1 ? 'active' : ''}`} src="/assets/photo/z1.jpg" alt="Moodboard result" />
            <img className={`mb-img mb-img-3 ${mbResult.img === 2 ? 'active' : ''}`} src="/assets/photo/q1.jpg" alt="Moodboard result" />
          </div>
          <div className="mb-result-text">
            <p className="mb-result-label" id="mb-result-label">
              {mbPalette.charAt(0).toUpperCase() + mbPalette.slice(1)} · {mbMaterial.charAt(0).toUpperCase() + mbMaterial.slice(1)} · {mbRoom.charAt(0).toUpperCase() + mbRoom.slice(1)}
            </p>
            <p className="mb-result-desc" id="mb-result-desc">{mbResult.desc}</p>
            <button className="mb-cta open-reserve-modal" onClick={() => setReserveOpen(true)}>Get This Look →</button>
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="showcase" id="showcase">
        <div className="showcase-visual">
          <img className="showcase-bg-img" src="/assets/photo/z1.jpg" alt="INTI signature space" />
          <div className="showcase-gradient"></div>
        </div>
        <div className="showcase-content-wrapper">
          <div className="showcase-text">
            <p className="showcase-eyebrow">Selected Work</p>
            <h2 className="showcase-headline">Spaces Beyond<br /><em>Ordinary.</em></h2>
            <p className="showcase-body">A composition of texture, light, and form — where every surface, shadow, and silhouette contributes to the story of the home.</p>
            <button className="showcase-ig-link open-reserve-modal" onClick={() => setReserveOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.5" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              Start a Conversation
            </button>
          </div>
          <div className="showcase-clients">
            <p class="clients-eyebrow">Corporate Partners</p>
            <h3 class="clients-title">Privileged Clients</h3>
            <div class="clients-list">
              <div class="client-name">Unilever / HUL</div>
              <div class="client-name">General Electricals (GE)</div>
              <div class="client-name">Kanthal</div>
              <div class="client-name">I Value</div>
              <div class="client-name">Reckitt and Benckiser (RB)</div>
              <div class="client-name">Pernod Ricard</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top-rule"></div>
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand-col">
              <div className="footer-logo">
                <img src="/assets/logo.png" alt="INTI Logo" class="footer-logo-img" />
              </div>
              <p className="footer-tagline">INTI Works — Spaces shaped with calm, precision, and timeless warmth.</p>
              <p className="footer-founder" style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', color: 'var(--color-gold)', marginTop: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Vijaya H. Reddy &mdash; Founder &amp; Principal Designer</p>
            </div>
            <div className="footer-col">
              <h5 className="footer-col-title">Services</h5>
              <ul>
                <li><a href="#collection" onClick={(e) => handleNavClick(e, 'collection')}>Office Design</a></li>
                <li><a href="#collection" onClick={(e) => handleNavClick(e, 'collection')}>Wellness Spaces</a></li>
                <li><a href="#heritage" onClick={(e) => handleNavClick(e, 'heritage')}>Space Planning</a></li>
                <li><a href="#moodboard" onClick={(e) => handleNavClick(e, 'moodboard')}>Material Curation</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5 className="footer-col-title">Studio</h5>
              <ul>
                <li><a href="#signature" onClick={(e) => handleNavClick(e, 'signature')}>Signature</a></li>
                <li><a href="#heritage" onClick={(e) => handleNavClick(e, 'heritage')}>Heritage</a></li>
                <li><a href="#collection" onClick={(e) => handleNavClick(e, 'collection')}>Collection</a></li>
                <li><a href="#craftsmanship" onClick={(e) => handleNavClick(e, 'craftsmanship')}>Craftsmanship</a></li>
                <li><a href="#moodboard" onClick={(e) => handleNavClick(e, 'moodboard')}>Moodboard</a></li>
              </ul>
            </div>
            <div className="footer-col footer-col-reserve">
              <h5 className="footer-col-title">Studio Location</h5>
              <p className="footer-col-desc" style={{ color: 'var(--color-white-60)', lineHeight: '1.6', marginBottom: '24px' }}>HSR Layout, Bangalore, India</p>
              <button className="footer-reserve-btn open-reserve-modal" onClick={() => setReserveOpen(true)}>Book a Consultation</button>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-legal-wrap">
              <p className="footer-legal">© 2026 INTI Works. All rights reserved.</p>
              <p className="footer-ops">Operating under Sri Vari Ventures and Sri Hari Enterprises.</p>
            </div>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING CTA */}
      <button className={`floating-cta open-reserve-modal ${floatingCtaVisible ? 'visible' : ''}`} id="floating-cta" onClick={() => setReserveOpen(true)} aria-label="Book a consultation">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        <span>Start Your Project</span>
      </button>

      {/* STYLE QUIZ MODAL */}
      <div className={`modal-overlay ${quizOpen ? 'active' : ''}`} id="quiz-modal" aria-hidden={!quizOpen} role="dialog">
        <div className="modal quiz-modal">
          <button className="modal-close" id="quiz-modal-close" onClick={() => setQuizOpen(false)} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4L16 16M16 4L4 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
          </button>
          <div className="quiz-wrap">
            {!quizResult ? (
              <>
                <div className="quiz-progress-bar"><div className="quiz-progress-fill" id="quiz-progress" style={{ width: `${(quizStep / 5) * 100}%` }}></div></div>
                <p className="quiz-step-counter" id="quiz-step-counter">{quizStep} / 5</p>

                {/* Q1 */}
                {quizStep === 1 && (
                  <div className="quiz-q active" data-q="1">
                    <h3 className="quiz-q-title">Which light feels like home?</h3>
                    <div className="quiz-opts quiz-opts-img">
                      <button className="quiz-opt-img" onClick={() => handleQuizAnswer(1, 'warm')}>
                        <img src="/assets/photo/bg1.jpg" alt="Warm golden light" />
                        <span>Warm & Golden</span>
                      </button>
                      <button className="quiz-opt-img" onClick={() => handleQuizAnswer(1, 'cool')}>
                        <img src="/assets/photo/watch.jpg" alt="Cool diffused light" />
                        <span>Cool & Diffused</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Q2 */}
                {quizStep === 2 && (
                  <div className="quiz-q active" data-q="2">
                    <h3 className="quiz-q-title">Pick the texture that calls to you.</h3>
                    <div className="quiz-opts quiz-opts-img">
                      <button className="quiz-opt-img" onClick={() => handleQuizAnswer(2, 'tactile')}>
                        <img src="/assets/photo/ethos-bg-rs.jpg" alt="Tactile texture" />
                        <span>Raw & Tactile</span>
                      </button>
                      <button className="quiz-opt-img" onClick={() => handleQuizAnswer(2, 'smooth')}>
                        <img src="/assets/photo/ethos-bg.jpg" alt="Smooth texture" />
                        <span>Refined & Smooth</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Q3 */}
                {quizStep === 3 && (
                  <div className="quiz-q active" data-q="3">
                    <h3 className="quiz-q-title">Your ideal evening at home?</h3>
                    <div className="quiz-opts quiz-opts-text">
                      <button className="quiz-opt-text" onClick={() => handleQuizAnswer(3, 'intimate')}>A single lamp, a book, silence.</button>
                      <button className="quiz-opt-text" onClick={() => handleQuizAnswer(3, 'social')}>Candlelit dinner with close friends.</button>
                      <button className="quiz-opt-text" onClick={() => handleQuizAnswer(3, 'open')}>Floor-to-ceiling windows, city glow.</button>
                    </div>
                  </div>
                )}

                {/* Q4 */}
                {quizStep === 4 && (
                  <div className="quiz-q active" data-q="4">
                    <h3 className="quiz-q-title">Which space feels most alive?</h3>
                    <div className="quiz-opts quiz-opts-img">
                      <button className="quiz-opt-img" onClick={() => handleQuizAnswer(4, 'minimal')}>
                        <img src="/assets/photo/z1.jpg" alt="Minimal space" />
                        <span>Still & Minimal</span>
                      </button>
                      <button className="quiz-opt-img" onClick={() => handleQuizAnswer(4, 'layered')}>
                        <img src="/assets/photo/q1.jpg" alt="Layered space" />
                        <span>Layered & Rich</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Q5 */}
                {quizStep === 5 && (
                  <div className="quiz-q active" data-q="5">
                    <h3 className="quiz-q-title">One word for your dream space.</h3>
                    <div className="quiz-opts quiz-opts-text">
                      <button className="quiz-opt-text" onClick={() => handleQuizAnswer(5, 'serene')}>Serene</button>
                      <button className="quiz-opt-text" onClick={() => handleQuizAnswer(5, 'bold')}>Bold</button>
                      <button className="quiz-opt-text" onClick={() => handleQuizAnswer(5, 'timeless')}>Timeless</button>
                      <button className="quiz-opt-text" onClick={() => handleQuizAnswer(5, 'intimate')}>Intimate</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="quiz-result" id="quiz-result" style={{ display: 'grid' }}>
                <div className="quiz-result-img">
                  <img id="quiz-result-img" src={quizResult.img} alt="Your INTI style" />
                </div>
                <div className="quiz-result-text">
                  <p className="quiz-result-label">Your INTI Style</p>
                  <h3 className="quiz-result-name" id="quiz-result-name">{quizResult.name}</h3>
                  <p className="quiz-result-desc" id="quiz-result-desc">{quizResult.desc}</p>
                  <div className="quiz-result-actions">
                    <button className="primary-btn open-reserve-modal" onClick={() => { setQuizOpen(false); setReserveOpen(true); }}>Book a Consultation</button>
                    <button className="secondary-btn" id="quiz-restart" onClick={resetQuiz}>Retake Quiz</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONSULTATION MODAL */}
      <div className={`modal-overlay ${reserveOpen ? 'active' : ''}`} id="reserve-modal" aria-hidden={!reserveOpen} role="dialog" aria-labelledby="modal-title">
        <div className="modal">
          <button className="modal-close" id="modal-close" onClick={() => setReserveOpen(false)} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4L16 16M16 4L4 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
          </button>
          <div className="modal-left">
            <img class="modal-watch-img" src="/assets/photo/z1.jpg" alt="INTI interior" />
            <div className="modal-left-overlay"></div>
            <div className="modal-left-text">
              <span className="modal-left-label">Private Studio</span>
              <p className="modal-left-quote">"Every great space begins with a conversation."</p>
            </div>
          </div>
          <div className="modal-right">
            <p className="modal-eyebrow">Private Consultation</p>
            <h2 className="modal-title" id="modal-title">Secure Your <em>Consultation</em></h2>
            <p className="modal-subtitle">Share your vision with us. Our team will reach out within 24 hours.</p>
            <form className="modal-form" id="reserve-form" onSubmit={handleReservationSubmit} name="reservation" method="POST" data-netlify="true">
              <input type="hidden" name="form-name" value="reservation" />
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first-name">First Name</label>
                  <input type="text" id="first-name" name="first-name" placeholder="First name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="last-name">Last Name</label>
                  <input type="text" id="last-name" name="last-name" placeholder="Last name" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone / WhatsApp</label>
                <input type="tel" id="phone" name="phone" placeholder="+91 xxxxx xxxxx" />
              </div>
              <div className="form-group">
                <label htmlFor="project-type">Project Type</label>
                <select id="project-type" name="project-type">
                  <option value="">Select a project type</option>
                  <option value="office">Office Workspace</option>
                  <option value="wellness">Healthcare & Wellness</option>
                  <option value="other">Other Space</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Tell Us About Your Vision</label>
                <textarea id="message" name="message" placeholder="Describe your space, aspirations, and timeline..." rows="4"></textarea>
              </div>
              <button type="submit" class="form-submit-btn">Request Consultation</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
