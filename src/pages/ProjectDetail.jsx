import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ProjectDetail() {
  const location = useLocation();
  const [reserveOpen, setReserveOpen] = useState(false);

  // Dynamic projects database of the 6 real corporate projects
  const projects = {
    'hul-hosur-conf': {
      category: 'Corporate Office',
      title: 'HUL Hosur - Conference Room',
      subtitle: 'A premium architectural canvas engineered for collaborative productivity.',
      year: '2024',
      type: 'Corporate Boardroom',
      area: '120 sqm',
      materials: 'Oak Wood Veneers, Sound-Absorbing Acoustic Baffles, Dimmable LED Canopy',
      headline: 'A sophisticated boardroom design boosting collaboration and efficiency.',
      body1: 'Engineered with precision for Hindustan Unilever Limited in Hosur, this conference boardroom represents a masterclass in modern workspace ergonomics. The room features a custom-designed U-shaped conference table composed of natural oak wood veneers and integrated cable routing panels.',
      body2: 'The ceiling layout incorporates acoustic vertical baffles in a warm gold-yellow shade, paired with a floating central drywall canopy housing dimmable smart LED fixtures. The far end features a custom wood-framed display shelving unit, backlit to cast warm atmospheric illumination, merging functionality with high-end corporate hospitality design.',
      heroImg: '/assets/photo/project-1/img-4.jpg',
      gallery: [
        '/assets/photo/project-1/img-2.jpg',
        '/assets/photo/project-1/img-3.jpg',
        '/assets/photo/project-1/img-1.jpg',
        '/assets/photo/project-1/img-5.jpg',
        '/assets/photo/project-1/img-4.jpg'
      ],
      quote: '"The design perfectly balances aesthetic grandeur with corporate utility. It has completely transformed our executive meetings." - HUL Project Management',
      author: 'HUL Management Representative',
      prev: 'hlrc-bangalore',
      prevTitle: 'HLRC Bangalore - Research Lab',
      next: 'hul-hosur-fm',
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
      body1: 'Designed as a bespoke office for Hindustan Unilever Limited in Hosur, this executive facility management workspace showcases a harmonious balance between efficiency and comfort. A massive custom-built blonde oak desk provides ample working surface, sitting adjacent to a built-in library wall storage finished in soft teal-blue laminate and under-cabinet warm accent lights.',
      body2: 'To invite warmth and soften the office, the space integrates a plush teal fabric lounge sofa and matching glass coffee table. A decorative grid screen planter serves as a partition, dividing the primary workspace from the casual meeting zone. Rhythmic linear cove lights and minimalist square hanging fixtures complete the ceiling layout, casting even, glare-free illumination.',
      heroImg: '/assets/photo/project-2/img-1.jpg',
      gallery: [
        '/assets/photo/project-2/img-2.jpg',
        '/assets/photo/project-2/img-3.jpg',
        '/assets/photo/project-2/img-1.jpg',
        '/assets/photo/project-2/img-4.jpg',
        '/assets/photo/project-2/img-5.jpg'
      ],
      quote: '"The office design has created a perfect environment for executive focus and small collaborative sessions. The mix of materials is outstanding." - HUL Management',
      author: 'HUL FM Representative',
      prev: 'hul-hosur-conf',
      prevTitle: 'HUL Hosur - Conference Room',
      next: 'ge-hosur-conf-2',
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
      body1: 'Designed for General Electric (GE) in Hosur, this executive boardroom is built around collaboration and presentation dynamics. The ceiling features a massive floating wooden canopy in a warm walnut veneer, bordered by linear LED cove lighting and holding a series of modern rectangular pendant lights. A custom-built U-shaped wooden boardroom table seats up to 20 executives comfortably.',
      body2: 'The side walls feature a series of black-framed monochrome portraits, sitting above a clean white storage credenza with wooden tops. On the opposite wall, vertical oak acoustic panels frame a large projection screen, with whiteboard surfaces and integrated technology ports at the table for seamless digital collaboration.',
      heroImg: '/assets/photo/project-6/img-1.jpg',
      gallery: [
        '/assets/photo/project-6/img-2.jpg',
        '/assets/photo/project-6/img-3.jpg',
        '/assets/photo/project-6/img-4.jpg',
        '/assets/photo/project-6/img-5.jpg',
        '/assets/photo/project-6/img-1.jpg'
      ],
      quote: '"The spatial proportions and acoustics are perfect. The floating wooden canopy has created a striking visual identity." - GE Project Lead',
      author: 'GE Representative',
      prev: 'hul-hosur-fm',
      prevTitle: 'HUL Hosur - FM Office Room',
      next: 'rb-hosur-conf',
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
      body1: 'Designed for Reckitt Benckiser in Hosur, this executive meeting space combines high-end material selection with functional precision. The room is anchored by an executive desk finished in custom veined white marble. Behind the seating area, a feature wall composed of geometric stone-patterned rectangular tiles adds depth and structural character to the workspace.',
      body2: 'Adjacent to the meeting area, a custom matte-black steel grid shelf houses white boxes containing leafy indoor plants, creating a refreshing bio-centric design. White marble floors extend through the reception hall, which has glass partitions and low-profile circular workstations for team synergy.',
      heroImg: '/assets/photo/project-3/img-1.jpg',
      gallery: [
        '/assets/photo/project-3/img-2.jpg',
        '/assets/photo/project-3/img-3.jpg',
        '/assets/photo/project-3/img-1.jpg',
        '/assets/photo/project-3/img-4.jpg',
        '/assets/photo/project-3/img-5.jpg'
      ],
      quote: '"The spatial planning is extraordinary. It strikes the perfect balance between high-end corporate elegance and daily executive function." - RB Operations',
      author: 'RB Director of Facilities',
      prev: 'ge-hosur-conf-2',
      prevTitle: 'GE Hosur - Executive Boardroom',
      next: 'rb-hosur-hygiene',
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
      body1: 'Designed for Reckitt Benckiser in Hosur, this wellness corridor acts as a primary sanitation entrance. The space features a long, custom-built vanity counter in dark walnut cabinetry, topped by seamless white solid-surface sinks, backlit mirrors, and integrated touchless soap and water dispensers.',
      body2: 'On the facing wall, a clean canvas displays Reckitt Benckiser\'s core values ("Care", "Values", "Innovation", "Community", "Idea") on vibrantly colored acrylic panels. Matte black tracks cast spotlighting onto the corridor, highlighting the blonde travertine floor panels and creating an uplifting environment for returning staff.',
      heroImg: '/assets/photo/project-4/img-1.jpg',
      gallery: [
        '/assets/photo/project-4/img-2.jpg',
        '/assets/photo/project-4/img-3.jpg',
        '/assets/photo/project-4/img-4.jpg',
        '/assets/photo/project-4/img-5.jpg',
        '/assets/photo/project-4/img-1.jpg'
      ],
      quote: '"The sanitation corridor is both highly functional and visually striking. It communicates our core corporate values from the moment you walk in." - RB Management',
      author: 'RB HR Representative',
      prev: 'rb-hosur-conf',
      prevTitle: 'RB Hosur - Executive Conference Room',
      next: 'hlrc-bangalore',
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
      body1: 'Designed for the Hindustan Unilever Research Centre (HLRC) in Bangalore, this research lobby and corridor layout establishes a welcoming, light-filled focal space. The central waiting lounge features plush mustard-yellow and soft grey sofas under ceiling light panels, split by a central columns-style black library bookcase and wood veneer walls detailed with modern black tree-branch graphics.',
      body2: 'The adjacent corridor showcases a grand wooden staircase steps podium next to stairs, framed by custom metal wire sculptures of tea pluckers and rural farmers harvesting leaves against a delicate floral mural. Glass circular booths and modern wood-floored stations with world maps stating "Climate Resilient Agriculture is our Future" complete the research environment, making it a masterpiece of high-end corporate science design.',
      heroImg: '/assets/photo/project-5/img-1.jpg',
      gallery: [
        '/assets/photo/project-5/img-2.jpg',
        '/assets/photo/project-5/img-3.jpg',
        '/assets/photo/project-5/img-4.jpg',
        '/assets/photo/project-5/img-5.jpg',
        '/assets/photo/project-5/img-1.jpg'
      ],
      quote: '"The spatial configuration stimulates research and daily inspiration. It successfully brings the organic spirit of farming inside our research lab." - HLRC Bangalore Management',
      author: 'HLRC Project Director',
      prev: 'rb-hosur-hygiene',
      prevTitle: 'RB Hosur - Hygiene Station Entrance',
      next: 'hul-hosur-conf',
      nextTitle: 'HUL Hosur - Conference Room'
    }
  };

  // Get project ID from query params
  const query = new URLSearchParams(location.search);
  const projectId = query.get('id') || 'hul-hosur-conf';
  const data = projects[projectId] || projects['hul-hosur-conf'];

  // Update HTML document title reactively
  useEffect(() => {
    document.title = `${data.title} — INTI Studio`;
  }, [data.title]);

  // Handle header nav click back to home hash
  const handleNavClick = (e, targetId) => {
    // If we're on details page, we naturally let the link navigate to /#id
    // But since we use HashRouter, index path is /#/ and details path is /#/project?id=...
    // To navigate to home section, go to /#/<hash>
  };

  // GSAP Entrance Animations
  useLayoutEffect(() => {
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
  }, [projectId]); // re-run on project navigation transitions!

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
          <img id="project-hero-img" src={data.heroImg} alt={data.title} />
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
            <span class="spec-label">Project Type</span>
            <span className="spec-val" id="spec-type">{data.type}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Floor Area</span>
            <span className="spec-val" id="spec-area">{data.area}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Materials</span>
            <span className="spec-val" id="spec-materials">{data.materials}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Principal Designer</span>
            <span className="spec-val">Vijaya H. Reddy</span>
          </div>
        </div>
        <div className="detail-narrative-col">
          <h2 className="narrative-headline" id="narrative-headline">{data.headline}</h2>
          <p className="narrative-body" id="narrative-body-1">{data.body1}</p>
          <p className="narrative-body" id="narrative-body-2">{data.body2}</p>
        </div>
      </section>

      {/* GALLERY */}
      <section className="detail-gallery-section">
        <div className="detail-gallery-grid">
          <div className="gallery-item item-span-8">
            <img id="gallery-img-1" src={data.gallery[0]} alt="Details layout" />
          </div>
          <div className="gallery-item item-span-4">
            <img id="gallery-img-2" src={data.gallery[1]} alt="Details layout" />
          </div>
          <div className="gallery-item item-span-6">
            <img id="gallery-img-3" src={data.gallery[2]} alt="Details layout" />
          </div>
          <div className="gallery-item item-span-6">
            <img id="gallery-img-4" src={data.gallery[3]} alt="Details layout" />
          </div>
          <div className="gallery-item item-span-12">
            <img id="gallery-img-5" src={data.gallery[4]} alt="Details layout" />
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
        <Link to={`/project?id=${data.prev}`} className="detail-nav-btn" id="prev-project-btn">
          <span className="nav-btn-label">← Previous Case Study</span>
          <span className="nav-btn-title" id="prev-project-title">{data.prevTitle}</span>
        </Link>
        <Link to={`/project?id=${data.next}`} className="detail-nav-btn nav-btn-right" id="next-project-btn">
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
              <button type="submit" className="form-submit-btn">Request Consultation</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectDetail;
