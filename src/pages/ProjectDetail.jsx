import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchProjectBySlug, submitConsultation } from '../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

function ProjectDetail() {
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev.message === message ? { message: '', type: 'success' } : prev);
    }, 4000);
  };

  const location = useLocation();
  const [reserveOpen, setReserveOpen] = useState(false);

  // Local fallback project dictionary
  const localProjects = {
    'hul-hosur-conf': {
      category: 'Corporate Office',
      title: 'HUL Hosur - Conference Room',
      subtitle: 'A premium architectural canvas engineered for collaborative productivity.',
      year: '2024',
      type: 'Corporate Boardroom',
      area: '120 sqm',
      materials: 'Oak Wood Veneers, Sound-Absorbing Acoustic Baffles, Dimmable LED Canopy',
      headline: 'A sophisticated boardroom design boosting collaboration and efficiency.',
      body_1: 'Engineered with precision for Hindustan Unilever Limited in Hosur, this conference boardroom represents a masterclass in modern workspace ergonomics. The room features a custom-designed U-shaped conference table composed of natural oak wood veneers and integrated cable routing panels.',
      body_2: 'The ceiling layout incorporates acoustic vertical baffles in a warm gold-yellow shade, paired with a floating central drywall canopy housing dimmable smart LED fixtures. The far end features a custom wood-framed display shelving unit, backlit to cast warm atmospheric illumination, merging functionality with high-end corporate hospitality design.',
      hero_img: '/assets/photo/project-1/img-4.jpg',
      gallery_imgs: [
        '/assets/photo/project-1/img-2.jpg',
        '/assets/photo/project-1/img-3.jpg',
        '/assets/photo/project-1/img-1.jpg',
        '/assets/photo/project-1/img-5.jpg',
        '/assets/photo/project-1/img-4.jpg'
      ],
      quote: '"The design perfectly balances aesthetic grandeur with corporate utility. It has completely transformed our executive meetings."',
      author: 'HUL Management Representative',
      prevSlug: 'hlrc-bangalore',
      prevTitle: 'HLRC Bangalore - Research Lab',
      nextSlug: 'hul-hosur-fm',
      nextTitle: 'HUL Hosur - FM Office Room'
    },
    'hul-hosur-fm': {
      category: 'Corporate Office',
      title: 'HUL Hosur - FM Office Room',
      subtitle: 'A balance of functional executive ergonomics and soothing contemporary tones.',
      year: '2024',
      type: 'Executive Facility Management (FM) Office',
      area: '75 sqm',
      materials: 'Teal and Oak Millwork, Textured Wall Panels, Integrated Planters, Custom Linear Lighting',
      headline: 'Creating a workspace that nurtures leadership and focus.',
      body_1: 'Designed as a bespoke office for Hindustan Unilever Limited in Hosur, this executive facility management workspace showcases a harmonious balance between efficiency and comfort. A massive custom-built blonde oak desk provides ample working surface, sitting adjacent to a built-in library wall storage finished in soft teal-blue laminate and under-cabinet warm accent lights.',
      body_2: 'To invite warmth and soften the office, the space integrates a plush teal fabric lounge sofa and matching glass coffee table. A decorative grid screen planter serves as a partition, dividing the primary workspace from the casual meeting zone. Rhythmic linear cove lights and minimalist square hanging fixtures complete the ceiling layout, casting even, glare-free illumination.',
      hero_img: '/assets/photo/project-2/img-1.jpg',
      gallery_imgs: [
        '/assets/photo/project-2/img-2.jpg',
        '/assets/photo/project-2/img-3.jpg',
        '/assets/photo/project-2/img-1.jpg',
        '/assets/photo/project-2/img-4.jpg',
        '/assets/photo/project-2/img-5.jpg'
      ],
      quote: '"The office design has created a perfect environment for executive focus and small collaborative sessions. The mix of materials is outstanding."',
      author: 'HUL FM Representative',
      prevSlug: 'hul-hosur-conf',
      prevTitle: 'HUL Hosur - Conference Room',
      nextSlug: 'ge-hosur-conf-2',
      nextTitle: 'GE Hosur - Executive Boardroom'
    },
    'ge-hosur-conf-2': {
      category: 'Corporate Office',
      title: 'GE Hosur - Executive Boardroom',
      subtitle: 'An expansive boardroom defined by structured wood canopies, ambient light, and acoustic integrity.',
      year: '2024',
      type: 'Executive Boardroom & Conference Facility',
      area: '150 sqm',
      materials: 'Veneered Ceiling Canopies, Custom U-Shaped Desking, Acoustic Wall Framing, Integrated Projector & Louvers',
      headline: 'A masterclass in acoustic geometry and corporate leadership.',
      body_1: 'Designed for General Electric (GE) in Hosur, this executive boardroom is built around collaboration and presentation dynamics. The ceiling features a massive floating wooden canopy in a warm walnut veneer, bordered by linear LED cove lighting and holding a series of modern rectangular pendant lights. A custom-built U-shaped wooden boardroom table seats up to 20 executives comfortably.',
      body_2: 'The side walls feature a series of black-framed monochrome portraits, sitting above a clean white storage credenza with wooden tops. On the opposite wall, vertical oak acoustic panels frame a large projection screen, with whiteboard surfaces and integrated technology ports at the table for seamless digital collaboration.',
      hero_img: '/assets/photo/project-6/img-1.jpg',
      gallery_imgs: [
        '/assets/photo/project-6/img-2.jpg',
        '/assets/photo/project-6/img-3.jpg',
        '/assets/photo/project-6/img-4.jpg',
        '/assets/photo/project-6/img-5.jpg',
        '/assets/photo/project-6/img-1.jpg'
      ],
      quote: '"The spatial proportions and acoustics are perfect. The floating wooden canopy has created a striking visual identity."',
      author: 'GE Representative',
      prevSlug: 'hul-hosur-fm',
      prevTitle: 'HUL Hosur - FM Office Room',
      nextSlug: 'rb-hosur-conf',
      nextTitle: 'RB Hosur - Executive Conference Room'
    },
    'rb-hosur-conf': {
      category: 'Corporate Office',
      title: 'RB Hosur - Executive Conference Room',
      subtitle: 'An executive spatial layout crafted with rich marble finishes and structural symmetry.',
      year: '2024',
      type: 'Executive Office & Meeting Room',
      area: '80 sqm',
      materials: 'Veined White Marble, Geometric Wall Panels, Matt Black Desk Accessories, Ergonomic Seating',
      headline: 'A study of rhythmic wall panelling, rich stone textures, and executive authority.',
      body_1: 'Designed for Reckitt Benckiser in Hosur, this executive meeting space combines high-end material selection with functional precision. The room is anchored by an executive desk finished in custom veined white marble. Behind the seating area, a feature wall composed of geometric stone-patterned rectangular tiles adds depth and structural character to the workspace.',
      body_2: 'Adjacent to the meeting area, a custom matte-black steel grid shelf houses white boxes containing leafy indoor plants, creating a refreshing bio-centric design. White marble floors extend through the reception hall, which has glass partitions and low-profile circular workstations for team synergy.',
      hero_img: '/assets/photo/project-3/img-1.jpg',
      gallery_imgs: [
        '/assets/photo/project-3/img-2.jpg',
        '/assets/photo/project-3/img-3.jpg',
        '/assets/photo/project-3/img-1.jpg',
        '/assets/photo/project-3/img-4.jpg',
        '/assets/photo/project-3/img-5.jpg'
      ],
      quote: '"The spatial planning is extraordinary. It strikes the perfect balance between high-end corporate elegance and daily executive function."',
      author: 'RB Director of Facilities',
      prevSlug: 'ge-hosur-conf-2',
      prevTitle: 'GE Hosur - Executive Boardroom',
      nextSlug: 'rb-hosur-hygiene',
      nextTitle: 'RB Hosur - Hygiene Station Entrance'
    },
    'rb-hosur-hygiene': {
      category: 'Healthcare & Wellness',
      title: 'RB Hosur - Hygiene Station Entrance',
      subtitle: 'A clean, welcoming threshold built with corporate values and hygienic precision.',
      year: '2024',
      type: 'Hygienic Sanitation Entrance',
      area: '90 sqm',
      materials: 'Blonde Travertine Floors, Walnut Vanity Cabinets, Integrated Handwashing Counters, Wall Poster Display Panels',
      headline: 'Creating a safe, modern, and inspiring entry experience.',
      body_1: 'Designed for Reckitt Benckiser in Hosur, this wellness corridor acts as a primary sanitation entrance. The space features a long, custom-built vanity counter in dark walnut cabinetry, topped by seamless white solid-surface sinks, backlit mirrors, and integrated touchless soap and water dispensers.',
      body_2: 'On the facing wall, a clean canvas displays Reckitt Benckiser\'s core values ("Care", "Values", "Innovation", "Community", "Idea") on vibrantly colored acrylic panels. Matte black tracks cast spotlighting onto the corridor, highlighting the blonde travertine floor panels and creating an uplifting environment for returning staff.',
      hero_img: '/assets/photo/project-4/img-1.jpg',
      gallery_imgs: [
        '/assets/photo/project-4/img-2.jpg',
        '/assets/photo/project-4/img-3.jpg',
        '/assets/photo/project-4/img-4.jpg',
        '/assets/photo/project-4/img-5.jpg',
        '/assets/photo/project-4/img-1.jpg'
      ],
      quote: '"The sanitation corridor is both highly functional and visually striking. It communicates our core corporate values from the moment you walk in."',
      author: 'RB HR Representative',
      prevSlug: 'rb-hosur-conf',
      prevTitle: 'RB Hosur - Executive Conference Room',
      nextSlug: 'hlrc-bangalore',
      nextTitle: 'HLRC Bangalore - Research Lab'
    },
    'hlrc-bangalore': {
      category: 'Healthcare & Wellness',
      title: 'HLRC Bangalore - Research Lab',
      subtitle: 'An inspiring research canvas bridging nature-inspired walls with dynamic glass pods.',
      year: '2024',
      type: 'Hindustan Unilever Research Centre & Lab',
      area: '210 sqm',
      materials: 'Wood Laminates with Branch Graphics, OSB Particleboard Panels, Metal Wall Sculptures, Glass Pods',
      headline: 'A research environment boosting spatial discovery and organic flow.',
      body_1: 'Designed for the Hindustan Unilever Research Centre (HLRC) in Bangalore, this research lobby and corridor layout establishes a welcoming, light-filled focal space. The central waiting lounge features plush mustard-yellow and soft grey sofas under ceiling light panels, split by a central columns-style black library bookcase and wood veneer walls detailed with modern black tree-branch graphics.',
      body_2: 'The adjacent corridor showcases a grand wooden staircase steps podium next to stairs, framed by custom metal wire sculptures of tea pluckers and rural farmers harvesting leaves against a delicate floral mural. Glass circular booths and modern wood-floored stations with world maps stating "Climate Resilient Agriculture is our Future" complete the research environment, making it a masterpiece of high-end corporate science design.',
      hero_img: '/assets/photo/project-5/img-1.jpg',
      gallery_imgs: [
        '/assets/photo/project-5/img-2.jpg',
        '/assets/photo/project-5/img-3.jpg',
        '/assets/photo/project-5/img-4.jpg',
        '/assets/photo/project-5/img-5.jpg',
        '/assets/photo/project-5/img-1.jpg'
      ],
      quote: '"The spatial configuration stimulates research and daily inspiration. It successfully brings the organic spirit of farming inside our research lab."',
      author: 'HLRC Project Director',
      prevSlug: 'rb-hosur-hygiene',
      prevTitle: 'RB Hosur - Hygiene Station Entrance',
      nextSlug: 'hul-hosur-conf',
      nextTitle: 'HUL Hosur - Conference Room'
    }
  };

  // Get project ID from query params
  const query = new URLSearchParams(location.search);
  const projectId = query.get('id') || 'hul-hosur-conf';

  // Dynamic project details state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [phoneVal, setPhoneVal] = useState('');

  const formatPhone = (val) => {
    const cleaned = val.replace(/\D/g, '');
    const limited = cleaned.substring(0, 10);
    if (limited.length > 5) {
      return `${limited.substring(0, 5)} ${limited.substring(5)}`;
    }
    return limited;
  };

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const dbProject = await fetchProjectBySlug(projectId);
        if (dbProject) {
          setData(dbProject);
        } else {
          setData(localProjects[projectId] || localProjects['hul-hosur-conf']);
        }
      } catch (err) {
        console.warn("Could not fetch project from Supabase database. Falling back to local static values: ", err.message);
        setData(localProjects[projectId] || localProjects['hul-hosur-conf']);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [projectId]);

  // Update HTML document title reactively
  useEffect(() => {
    if (data) {
      document.title = `${data.title} — INTI Studio`;
    }
  }, [data]);

  // GSAP Entrance Animations
  useLayoutEffect(() => {
    if (!data) return;

    window.scrollTo(0, 0);
    ScrollTrigger.clearScrollMemory();

    let ctx = gsap.context(() => {
      // Nav animation
      gsap.fromTo("#main-nav",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.3 }
      );

      // Hero Content Reveal
      gsap.fromTo('.detail-hero-content', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.4, ease: 'power4.out', delay: 0.3 }
      );

      // Spec items reveal
      gsap.fromTo('.detail-spec-col > div', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.6 }
      );

      // Narrative reveal
      gsap.fromTo('.detail-narrative-col > *', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.8 }
      );
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      ctx.revert();
      clearTimeout(refreshTimer);
    };
  }, [projectId, data]); // re-run on project navigation transitions!

  // Hide nav on scroll down
  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const scroll = window.scrollY;
      const nav = document.getElementById('main-nav');
      if (!nav) return;

      if (scroll > lastScroll && scroll > 10) {
        gsap.to(nav, { y: -76, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      } else {
        gsap.to(nav, { y: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      }
      lastScroll = scroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Submit reservation form
  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    const btn = document.querySelector('.form-submit-btn');
    if (!btn) return;
    setSubmittingForm(true);

    const formData = {
      firstName: e.target['first-name'].value,
      lastName: e.target['last-name'].value,
      email: e.target['email'].value,
      phone: e.target['phone'].value,
      projectType: e.target['project-type'].value,
      message: e.target['message'].value,
    };

    try {
      // 2.5s Loading Animation Delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      await submitConsultation(formData);
      setSubmittingForm(false);
      showToast("Your consultation request has been submitted successfully!");
      btn.textContent = 'Request Sent ✓';
      btn.style.background = 'rgba(212,175,122,0.3)';
      btn.style.color = '#d4af7a';
      setTimeout(() => {
        setReserveOpen(false);
        btn.textContent = 'Request Consultation';
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
        e.target.reset();
      }, 2000);
    } catch (err) {
      setSubmittingForm(false);
      showToast("Submission failed: " + err.message, 'error');
      btn.textContent = 'Request Consultation';
      btn.disabled = false;
    }
  };

  if (loading || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b0b0b', color: '#fff' }}>
        <span style={{ fontSize: '14px', letterSpacing: '0.15em', fontFamily: 'var(--font-accent)', color: 'rgba(255,255,255,0.4)' }}>RETRIEVING CASE STUDY...</span>
      </div>
    );
  }

  return (
    <>
      {/* NAV */}
      <nav className="nav" id="main-nav">
        <div className="nav-logo-container">
          <Link to="/" className="nav-logo-link" id="nav-logo" aria-label="INTI Home">
            <img src="/assets/logo.png" alt="INTI Logo" className="nav-logo-img" />
          </Link>
        </div>
        <div className="nav-links-right">
          <div className="nav-links">
            <Link to="/#signature">Signature</Link>
            <Link to="/#heritage">Heritage</Link>
            <Link to="/#collection">Collection</Link>
            <Link to="/#craftsmanship">Craftsmanship</Link>
            <Link to="/#moodboard">Moodboard</Link>
          </div>
          <button className="nav-cta open-reserve-modal" onClick={() => setReserveOpen(true)}>Book a Consultation</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="project-detail-hero" id="detail-hero">
        <div className="detail-hero-bg">
          <img id="project-hero-img" src={data.hero_img || data.heroImg} alt={data.title} />
        </div>
        <div className="detail-hero-overlay"></div>
        <div className="detail-hero-content">
          <span className="detail-category" id="project-category">{data.category}</span>
          <h1 className="detail-title" id="project-title">{data.title}</h1>
          <p className="detail-subtitle" id="project-subtitle">{data.subtitle}</p>
        </div>
      </section>

      {/* INFO & NARRATIVE */}
      <section className="detail-intro-section">
        <div className="detail-spec-col">
          <div className="spec-item">
            <span className="spec-label">Year Completed</span>
            <span className="spec-val" id="spec-year">{data.year}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Project Type</span>
            <span className="spec-val" id="spec-type">{data.type}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Floor Area</span>
            <span className="spec-val" id="spec-area">{data.area}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Materials Used</span>
            <span className="spec-val" id="spec-materials">{data.materials}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Principal Designer</span>
            <span className="spec-val">Vijaya H. Reddy</span>
          </div>
        </div>
        <div className="detail-narrative-col">
          <h2 className="narrative-headline" id="narrative-headline">{data.headline}</h2>
          <p className="narrative-body" id="narrative-body-1">{data.body_1 || data.body1}</p>
          <p className="narrative-body" id="narrative-body-2">{data.body_2 || data.body2}</p>
        </div>
      </section>

      {/* GALLERY */}
      <section className="detail-gallery-section">
        <div className="detail-gallery-grid">
          <div className="gallery-item item-span-8">
            <img id="gallery-img-1" src={data.gallery_imgs ? data.gallery_imgs[0] : data.gallery[0]} alt="Details layout" />
          </div>
          <div className="gallery-item item-span-4">
            <img id="gallery-img-2" src={data.gallery_imgs ? data.gallery_imgs[1] : data.gallery[1]} alt="Details layout" />
          </div>
          <div className="gallery-item item-span-6">
            <img id="gallery-img-3" src={data.gallery_imgs ? data.gallery_imgs[2] : data.gallery[2]} alt="Details layout" />
          </div>
          <div className="gallery-item item-span-6">
            <img id="gallery-img-4" src={data.gallery_imgs ? data.gallery_imgs[3] : data.gallery[3]} alt="Details layout" />
          </div>
          <div className="gallery-item item-span-12">
            <img id="gallery-img-5" src={data.gallery_imgs ? data.gallery_imgs[4] : data.gallery[4]} alt="Details layout" />
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="detail-quote-section">
        <div className="quote-wrap">
          <p className="quote-text" id="quote-text">{data.quote}</p>
          <span className="quote-author" id="quote-author">{data.author}</span>
        </div>
      </section>

      {/* FOOTER NAV */}
      <footer className="detail-nav-footer">
        <Link to={`/project?id=${data.prevSlug}`} className="detail-nav-btn" id="prev-project-btn">
          <span className="nav-btn-label">← Previous Case Study</span>
          <span className="nav-btn-title" id="prev-project-title">{data.prevTitle}</span>
        </Link>
        <Link to={`/project?id=${data.nextSlug}`} className="detail-nav-btn nav-btn-right" id="next-project-btn">
          <span className="nav-btn-label">Next Case Study →</span>
          <span className="nav-btn-title" id="next-project-title">{data.nextTitle}</span>
        </Link>
      </footer>

      {/* CONSULTATION MODAL */}
      <div className={`modal-overlay ${reserveOpen ? 'active' : ''}`} id="reserve-modal" aria-hidden={!reserveOpen} role="dialog" aria-labelledby="modal-title">
        <div className="modal">
          <button className="modal-close" id="modal-close" onClick={() => setReserveOpen(false)} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4L16 16M16 4L4 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
          </button>
          <div className="modal-left">
            <img className="modal-watch-img" src="/assets/photo/z1.jpg" alt="INTI interior" />
            <div className="modal-left-overlay"></div>
            <div className="modal-left-text">
              <span className="modal-left-label">Private Studio</span>
              <p className="modal-left-quote">"Every great space begins with a conversation."</p>
            </div>
          </div>
          <div className="modal-right" data-lenis-prevent>
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
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={phoneVal}
                  onChange={(e) => setPhoneVal(formatPhone(e.target.value))}
                  placeholder="xxxxx xxxxx" 
                  required
                />
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
              <button type="submit" className="form-submit-btn">Request Consultation</button>
            </form>
          </div>
        </div>
      </div>
      {/* Toast Notification */}
      {toast.message && (
        <div style={{
          position: 'fixed',
          top: '30px',
          right: '30px',
          zIndex: 99999,
          background: '#161616',
          border: toast.type === 'error' ? '1px solid rgba(235,87,87,0.3)' : '1px solid var(--color-gold)',
          borderRadius: '4px',
          padding: '16px 24px',
          color: '#fff',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontFamily: 'var(--font-accent)',
          fontSize: '13px',
          letterSpacing: '0.05em',
          animation: 'toastFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <span style={{ color: toast.type === 'error' ? '#eb5757' : 'var(--color-gold)', fontWeight: 'bold' }}>◈</span>
          <span>{toast.message}</span>
          <button 
            onClick={() => setToast({ message: '', type: 'success' })}
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', paddingLeft: '12px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* FORM TRANSMISSION ANIMATION */}
      {submittingForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(10,10,10,0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px'
        }}>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <div className="saving-spinner" style={{
            width: '40px',
            height: '40px',
            border: '2px solid rgba(212,175,122,0.1)',
            borderTop: '2px solid var(--color-gold)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ textAlign: 'center', padding: '0 24px' }}>
            <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold)', fontFamily: 'var(--font-accent)', marginBottom: '6px' }}>
              Transmitting Vision
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: '300' }}>
              Connecting with INTI design database...
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectDetail;
