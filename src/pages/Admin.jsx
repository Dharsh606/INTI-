import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  supabase, 
  fetchHomepageContent, 
  fetchHeritageStats, 
  fetchAllProjects, 
  fetchConsultations,
  updateHomepageContent,
  updateHeritageStats,
  createProject,
  updateProject,
  deleteProject,
  deleteConsultation,
  uploadImage,
  fetchMaintenanceStatus,
  updateMaintenanceStatus
} from '../lib/supabase';

function Admin() {
  // Custom Toast state
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev.message === message ? { message: '', type: 'success' } : prev);
    }, 4000);
  };

  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Custom Confirmation Dialog state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const triggerConfirm = (title, message, onConfirmCallback) => {
    setConfirmModal({
      isOpen: true,
      title: title || 'Are you sure?',
      message: message || 'This action cannot be undone.',
      onConfirm: () => {
        onConfirmCallback();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Loading & Saving States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Data States
  const [homeData, setHomeData] = useState({
    hero_title: '',
    hero_subtitle: '',
    signature_title: '',
    signature_subtitle: '',
    signature_img: '',
    signature_watch_img: '',
    architecture_imgs: []
  });

  const [statsData, setStatsData] = useState({
    completed_projects: '',
    years_experience: '',
    materials_curated: '',
    heritage_body_1: '',
    heritage_body_2: '',
    heritage_img: '',
    founder_name: '',
    founder_role: '',
    founder_desc: '',
    founder_img: ''
  });

  const [projectsList, setProjectsList] = useState([]);
  const [consultationsList, setConsultationsList] = useState([]);

  // Editing Project State
  const [editingProject, setEditingProject] = useState(null); // null means list view, 'new' means adding new
  const [projectForm, setProjectForm] = useState({
    slug: '',
    title: '',
    subtitle: '',
    category: 'Office',
    year: '',
    type: '',
    area: '',
    materials: '',
    headline: '',
    body_1: '',
    body_2: '',
    hero_img: '',
    gallery_imgs: ['', '', '', '', ''],
    quote: '',
    author: ''
  });

  // Track file upload loadings
  const [uploadingImage, setUploadingImage] = useState(null); // 'signature', 'watch', 'heritage', 'hero', 'gallery_0', etc.

  // Dynamic saving & portal loader states
  const [savingState, setSavingState] = useState(false);
  const [savingText, setSavingText] = useState('');
  const [portalLoading, setPortalLoading] = useState(true);
  const [maintenanceActive, setMaintenanceActive] = useState(false);

  // ----------------------------------------------------
  // Authentication Listeners (Strict Session Policies)
  // ----------------------------------------------------
  useEffect(() => {
    // Prevent search indexing of the admin panel
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
      document.head.removeChild(meta);
    };
  }, []);

  // ----------------------------------------------------
  // 15-Minute Inactivity Tracker
  // ----------------------------------------------------
  useEffect(() => {
    if (!session) return;

    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      // 15 minutes = 15 * 60 * 1000 = 900,000 ms
      timeoutId = setTimeout(() => {
        showToast("Session expired due to inactivity. Logging out...", "error");
        setTimeout(async () => {
          await supabase.auth.signOut();
          window.location.hash = '#/';
        }, 1500);
      }, 15 * 60 * 1000);
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'click'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // init timer

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [session]);

  // Fetch all database records when authenticated
  useEffect(() => {
    if (session) {
      loadAllData();
    }
  }, [session]);

  // Portal Entry Loader Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setPortalLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const loadAllData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      // 1. Homepage Content
      try {
        const home = await fetchHomepageContent();
        if (home) {
          setHomeData({
            ...home,
            architecture_imgs: home.architecture_imgs || [
              '/assets/photo/bg1.jpg',
              '/assets/photo/q1.jpg',
              '/assets/photo/watch.jpg',
              '/assets/photo/z1.jpg',
              '/assets/photo/ethos-bg.jpg',
              '/assets/photo/ethos-bg-rs.jpg'
            ]
          });
        }
      } catch (err) {
        console.warn("Failed to load homepage content:", err.message);
      }

      // 2. Heritage Stats
      try {
        const stats = await fetchHeritageStats();
        if (stats) {
          setStatsData({
            completed_projects: stats.completed_projects || '',
            years_experience: stats.years_experience || '',
            materials_curated: stats.materials_curated || '',
            heritage_body_1: stats.heritage_body_1 || '',
            heritage_body_2: stats.heritage_body_2 || '',
            heritage_img: stats.heritage_img || '',
            founder_name: stats.founder_name || '',
            founder_role: stats.founder_role || '',
            founder_desc: stats.founder_desc || '',
            founder_img: stats.founder_img || '',
          });
        }
      } catch (err) {
        console.warn("Failed to load stats:", err.message);
      }

      // 3. Maintenance Status
      try {
        const status = await fetchMaintenanceStatus();
        setMaintenanceActive(status);
      } catch (err) {
        console.warn("Failed to load maintenance status:", err.message);
      }

      // 3. Projects list
      try {
        const projects = await fetchAllProjects();
        if (projects) setProjectsList(projects);
      } catch (err) {
        console.warn("Failed to load projects list:", err.message);
      }

      // 4. Booking requests
      try {
        const bookings = await fetchConsultations();
        if (bookings) setConsultationsList(bookings);
      } catch (err) {
        console.warn("Failed to load consultations:", err.message);
      }

    } catch (err) {
      console.error("General error in loadAllData: ", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Re-fetch data on Tab clicks to get new bookings/projects instantly
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setEditingProject(null);
    loadAllData(true); // silent update in background
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showToast("Access granted. Welcome to Admin Studio.");
    } catch (err) {
      setLoginError(err.message || "Failed to log in");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.hash = '#/'; // Strict redirect back to main website home
  };

  // ----------------------------------------------------
  // Image Upload Handlers
  // ----------------------------------------------------
  const handleImageFileChange = async (e, targetField, galleryIndex = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadKey = galleryIndex !== null ? `gallery_${galleryIndex}` : targetField;
    setUploadingImage(uploadKey);

    try {
      const publicUrl = await uploadImage(file);
      if (publicUrl) {
        if (galleryIndex !== null) {
          const updatedGallery = [...projectForm.gallery_imgs];
          updatedGallery[galleryIndex] = publicUrl;
          setProjectForm({ ...projectForm, gallery_imgs: updatedGallery });
        } else if (targetField === 'hero_img') {
          setProjectForm({ ...projectForm, hero_img: publicUrl });
        } else if (targetField.startsWith('signature_')) {
          setHomeData({ ...homeData, [targetField]: publicUrl });
        } else if (targetField === 'heritage_img' || targetField === 'founder_img') {
          setStatsData({ ...statsData, [targetField]: publicUrl });
        }
      }
      showToast("Image uploaded successfully!");
    } catch (err) {
      showToast("Image upload failed: " + err.message, "error");
    } finally {
      setUploadingImage(null);
    }
  };

  // Handle Architecture Canvas Image modification
  const handleCanvasImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(`canvas_${index}`);
    try {
      const publicUrl = await uploadImage(file);
      if (publicUrl) {
        const updatedCanvas = [...homeData.architecture_imgs];
        updatedCanvas[index] = publicUrl;
        setHomeData({ ...homeData, architecture_imgs: updatedCanvas });
        showToast(`Canvas Slot ${index + 1} updated successfully!`);
      }
    } catch (err) {
      showToast("Canvas image upload failed: " + err.message, "error");
    } finally {
      setUploadingImage(null);
    }
  };

  // ----------------------------------------------------
  // Save Handlers
  // ----------------------------------------------------
  const handleToggleMaintenance = async (e) => {
    const checked = e.target.checked;
    setSavingText("Configuring Maintenance Mode...");
    setSavingState(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await updateMaintenanceStatus(checked);
      setMaintenanceActive(checked);
      showToast(checked ? "Maintenance mode is now active!" : "Website is now live and public!", "success");
    } catch (err) {
      showToast("Failed to toggle maintenance mode: " + err.message, "error");
    } finally {
      setSavingState(false);
    }
  };

  const saveHomeContent = async (e) => {
    e.preventDefault();
    setSavingText("Recomposing landing page atmospheres...");
    setSavingState(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await updateHomepageContent(homeData);
      showToast("Homepage content and Canvas successfully saved!");
    } catch (err) {
      showToast("Failed to update homepage content: " + err.message, "error");
    } finally {
      setSavingState(false);
    }
  };

  const saveStatsContent = async (e) => {
    e.preventDefault();
    setSavingText("Updating studio record history...");
    setSavingState(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await updateHeritageStats(statsData);
      showToast("Heritage statistics updated successfully!");
    } catch (err) {
      showToast("Failed to update stats: " + err.message, "error");
    } finally {
      setSavingState(false);
    }
  };

  const saveProjectForm = async (e) => {
    e.preventDefault();
    setSavingText("Syncing case study coordinates with studio cloud database...");
    setSavingState(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const cleanGallery = projectForm.gallery_imgs.filter(img => img.trim() !== '');
      if (cleanGallery.length < 5) {
        while (cleanGallery.length < 5) cleanGallery.push('/assets/photo/ethos-bg.jpg');
      }

      const submission = {
        ...projectForm,
        gallery_imgs: cleanGallery
      };

      if (editingProject === 'new') {
        await createProject(submission);
        showToast("New project created successfully!");
      } else {
        await updateProject(editingProject, submission);
        showToast("Project case study updated successfully!");
      }
      setEditingProject(null);
      loadAllData(true);
    } catch (err) {
      showToast("Failed to save project: " + err.message, "error");
    } finally {
      setSavingState(false);
    }
  };

  const handleDeleteProject = async (projId) => {
    triggerConfirm(
      "Delete Case Study",
      "Are you sure you want to delete this case study? This action is permanent and cannot be undone.",
      async () => {
        setSavingText("Purging case study from database...");
        setSavingState(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          await deleteProject(projId);
          showToast("Project deleted from database.");
          loadAllData(true);
        } catch (err) {
          showToast("Failed to delete project: " + err.message, "error");
        } finally {
          setSavingState(false);
        }
      }
    );
  };

  const handleDeleteBooking = async (bookingId) => {
    triggerConfirm(
      "Delete Booking Inquiry",
      "Are you sure you want to delete this consultation booking? This will remove it from the logs.",
      async () => {
        try {
          await deleteConsultation(bookingId);
          showToast("Booking inquiry removed successfully.");
          loadAllData();
        } catch (err) {
          showToast("Failed to delete booking: " + err.message, "error");
        }
      }
    );
  };

  const startEditProject = (project) => {
    setEditingProject(project.id);
    setProjectForm({
      slug: project.slug,
      title: project.title,
      subtitle: project.subtitle,
      category: project.category,
      year: project.year,
      type: project.type,
      area: project.area,
      materials: project.materials,
      headline: project.headline,
      body_1: project.body_1,
      body_2: project.body_2,
      hero_img: project.hero_img,
      gallery_imgs: project.gallery_imgs || ['', '', '', '', ''],
      quote: project.quote,
      author: project.author
    });
  };

  const startNewProject = () => {
    setEditingProject('new');
    setProjectForm({
      slug: '',
      title: '',
      subtitle: '',
      category: 'Office',
      year: '2024',
      type: '',
      area: '',
      materials: '',
      headline: '',
      body_1: '',
      body_2: '',
      hero_img: '',
      gallery_imgs: ['', '', '', '', ''],
      quote: '',
      author: ''
    });
  };

  // ----------------------------------------------------
  // Login Render
  // ----------------------------------------------------
  if (portalLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        fontFamily: 'var(--font-sans)',
        textAlign: 'center'
      }}>
        <style>{`
          @keyframes compassRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{
          width: '60px',
          height: '60px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '1px dashed rgba(212,175,122,0.3)',
            borderRadius: '50%',
            animation: 'compassRotate 15s linear infinite'
          }} />
          <div style={{
            position: 'absolute',
            width: '70%',
            height: '70%',
            border: '1px solid var(--color-gold)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'compassRotate 2s linear infinite'
          }} />
          <span style={{ color: 'var(--color-gold)', fontSize: '14px' }}>◈</span>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-gold)', fontFamily: 'var(--font-accent)', marginBottom: '6px' }}>
            Authenticating Admin Session
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '300' }}>
            Securing Spatial Node...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b0b0b', padding: '24px' }}>
        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px', background: '#111', padding: '40px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="/assets/logo.png" alt="INTI" style={{ height: '24px', marginBottom: '16px' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#fff', fontWeight: '400' }}>Admin Studio Portal</h2>
          </div>

          {loginError && (
            <div style={{ padding: '12px', background: 'rgba(235, 87, 87, 0.1)', color: '#eb5757', borderRadius: '2px', fontSize: '13px', marginBottom: '20px', border: '1px solid rgba(235, 87, 87, 0.2)' }}>
              {loginError}
            </div>
          )}

          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@intiworks.com"
              style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '2px', color: '#fff', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '2px', color: '#fff', outline: 'none' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loginLoading}
            style={{ width: '100%', background: 'var(--color-gold)', color: '#000', border: 'none', padding: '14px', borderRadius: '2px', fontFamily: 'var(--font-accent)', fontWeight: '500', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', opacity: loginLoading ? 0.7 : 1 }}
          >
            {loginLoading ? 'Entering...' : 'Log In'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '12px', fontFamily: 'var(--font-accent)' }}>← Back to Website</Link>
          </div>
        </form>

        {/* Local Toast Overlay in case login failures trigger toast */}
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
            <button onClick={() => setToast({ message: '', type: 'success' })} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', paddingLeft: '12px' }}>✕</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0b0b', color: '#fff', fontFamily: 'var(--font-accent)' }}>
      {/* Top Navbar */}
      <header style={{ padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <img src="/assets/logo.png" alt="INTI" style={{ height: '18px' }} />
          <span style={{ fontSize: '11px', background: 'rgba(212,175,122,0.15)', color: 'var(--color-gold)', padding: '4px 8px', borderRadius: '2px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Console</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{session.user.email}</span>
          <button onClick={handleLogout} style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#fff', padding: '6px 12px', borderRadius: '2px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 65px)' }}>
        {/* Sidebar Nav */}
        <aside style={{ borderRight: '1px solid rgba(255,255,255,0.05)', padding: '30px 20px', background: '#0e0e0e' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => handleTabClick('dashboard')}
              style={{ textAlign: 'left', background: activeTab === 'dashboard' ? 'rgba(212,175,122,0.1)' : 'transparent', color: activeTab === 'dashboard' ? 'var(--color-gold)' : 'rgba(255,255,255,0.6)', border: 'none', padding: '12px 16px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: activeTab === 'dashboard' ? '500' : '300' }}
            >
              ◈ Studio Dashboard
            </button>
            <button 
              onClick={() => handleTabClick('home')}
              style={{ textAlign: 'left', background: activeTab === 'home' ? 'rgba(212,175,122,0.1)' : 'transparent', color: activeTab === 'home' ? 'var(--color-gold)' : 'rgba(255,255,255,0.6)', border: 'none', padding: '12px 16px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: activeTab === 'home' ? '500' : '300' }}
            >
              ◈ Homepage Content
            </button>
            <button 
              onClick={() => handleTabClick('stats')}
              style={{ textAlign: 'left', background: activeTab === 'stats' ? 'rgba(212,175,122,0.1)' : 'transparent', color: activeTab === 'stats' ? 'var(--color-gold)' : 'rgba(255,255,255,0.6)', border: 'none', padding: '12px 16px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: activeTab === 'stats' ? '500' : '300' }}
            >
              ◈ Heritage Statistics
            </button>
            <button 
              onClick={() => handleTabClick('projects')}
              style={{ textAlign: 'left', background: activeTab === 'projects' ? 'rgba(212,175,122,0.1)' : 'transparent', color: activeTab === 'projects' ? 'var(--color-gold)' : 'rgba(255,255,255,0.6)', border: 'none', padding: '12px 16px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: activeTab === 'projects' ? '500' : '300' }}
            >
              ◈ Case Studies (Projects)
            </button>
            <button 
              onClick={() => handleTabClick('bookings')}
              style={{ textAlign: 'left', background: activeTab === 'bookings' ? 'rgba(212,175,122,0.1)' : 'transparent', color: activeTab === 'bookings' ? 'var(--color-gold)' : 'rgba(255,255,255,0.6)', border: 'none', padding: '12px 16px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: activeTab === 'bookings' ? '500' : '300' }}
            >
              ◈ Consultations Log
            </button>
          </div>

          <div style={{ marginTop: '60px', padding: '16px', border: '1px solid rgba(212,175,122,0.1)', borderRadius: '4px', textAlign: 'center', background: 'rgba(212,175,122,0.02)' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', lineHeight: '1.4' }}>Need to inspect pages?</p>
            <Link to="/" target="_blank" style={{ fontSize: '12px', color: 'var(--color-gold)', textDecoration: 'none' }}>Open Website ↗</Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{ padding: '40px' }}>
          {loading ? (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}>LOADING STUDIO DATA...</span>
            </div>
          ) : (
            <>
              {/* TAB 0: STUDIO DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div>
                  <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: '400', marginBottom: '8px' }}>Studio Dashboard</h1>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '32px' }}>Welcome back. Here is an overview of your active design workspace stats and incoming booking requests.</p>

                  {/* Summary Stat Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #111 0%, #161616 100%)', border: '1px solid rgba(212,175,122,0.1)', padding: '24px', borderRadius: '4px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Total Bookings</span>
                      <span style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', color: '#fff', fontWeight: '300' }}>{consultationsList.length}</span>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, #111 0%, #161616 100%)', border: '1px solid rgba(212,175,122,0.1)', padding: '24px', borderRadius: '4px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Published Cases</span>
                      <span style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', color: '#fff', fontWeight: '300' }}>{projectsList.length}</span>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, #111 0%, #161616 100%)', border: '1px solid rgba(212,175,122,0.1)', padding: '24px', borderRadius: '4px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Years Experience</span>
                      <span style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', color: '#fff', fontWeight: '300' }}>{statsData.years_experience || '15+'}</span>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, #111 0%, #161616 100%)', border: '1px solid rgba(212,175,122,0.1)', padding: '24px', borderRadius: '4px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Completed Goal</span>
                      <span style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', color: '#fff', fontWeight: '300' }}>{statsData.completed_projects || '50+'}</span>
                    </div>
                  </div>

                  {/* Maintenance Mode Controller Panel */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, #131313 0%, #181818 100%)', 
                    border: '1px solid rgba(255,255,255,0.03)', 
                    borderRadius: '4px', 
                    padding: '24px', 
                    marginBottom: '40px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px'
                  }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span style={{ fontSize: '24px', color: maintenanceActive ? 'var(--color-gold)' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }}>
                        {maintenanceActive ? '🔒' : '🌐'}
                      </span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '14px', color: '#fff', fontWeight: '400', letterSpacing: '0.05em' }}>
                          Studio Maintenance Mode
                        </h4>
                        <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                          {maintenanceActive 
                            ? 'The public website is locked. Visitors see the maintenance screen. Admin portal is active.' 
                            : 'The public website is live. Visitors can explore the catalog and submit bookings.'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <label style={{ 
                      position: 'relative', 
                      display: 'inline-block', 
                      width: '56px', 
                      height: '28px', 
                      cursor: 'pointer' 
                    }}>
                      <input 
                        type="checkbox" 
                        checked={maintenanceActive}
                        onChange={handleToggleMaintenance}
                        style={{ opacity: 0, width: 0, height: 0 }} 
                      />
                      <span style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: maintenanceActive ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)',
                        transition: '0.4s',
                        borderRadius: '34px',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <span style={{
                          position: 'absolute',
                          height: '20px',
                          width: '20px',
                          left: '4px',
                          bottom: '3px',
                          backgroundColor: maintenanceActive ? '#000' : '#fff',
                          transition: '0.4s',
                          borderRadius: '50%',
                          transform: maintenanceActive ? 'translateX(26px)' : 'translateX(0)'
                        }} />
                      </span>
                    </label>
                  </div>

                  {/* Split Layout for Recents */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start' }}>
                    
                    {/* Left Column: Recent Bookings Cards */}
                    <div>
                      <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: '400', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Incoming Consultations</span>
                        <button onClick={() => handleTabClick('bookings')} style={{ background: 'transparent', border: 'none', color: 'var(--color-gold)', fontSize: '12px', cursor: 'pointer' }}>View Table ↗</button>
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {consultationsList.slice(0, 5).map((booking) => (
                          <div key={booking.id} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '2px', padding: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                              <div>
                                <h4 style={{ fontSize: '14px', color: '#fff', fontWeight: '500', margin: 0 }}>{booking.first_name} {booking.last_name}</h4>
                                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  Category: <strong style={{ color: 'var(--color-gold)' }}>{booking.project_type || '—'}</strong>
                                </span>
                              </div>
                              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                                {new Date(booking.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', margin: '0 0 16px 0', background: '#161616', padding: '12px', borderRadius: '2px', fontStyle: 'italic' }}>
                              "{booking.message || 'No custom message.'}"
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '10px' }}>
                              <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                                <a href={`mailto:${booking.email}`} style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>✉ {booking.email}</a>
                                {booking.phone && (
                                  <a href={`tel:${booking.phone}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>📞 {booking.phone}</a>
                                )}
                              </div>
                              <button 
                                onClick={() => handleDeleteBooking(booking.id)} 
                                style={{ background: 'transparent', border: '1px solid rgba(235, 87, 87, 0.2)', color: '#eb5757', padding: '4px 8px', borderRadius: '2px', fontSize: '10px', cursor: 'pointer', fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}

                        {consultationsList.length === 0 && (
                          <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '2px', color: 'rgba(255,255,255,0.4)' }}>
                            No inquiries received yet.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Case Studies Portfolio Summary */}
                    <div>
                      <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: '400', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Published Portfolio</span>
                        <button onClick={() => handleTabClick('projects')} style={{ background: 'transparent', border: 'none', color: 'var(--color-gold)', fontSize: '12px', cursor: 'pointer' }}>Manage ↗</button>
                      </h3>

                      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.03)', padding: '20px', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {projectsList.slice(0, 6).map((proj) => (
                          <div key={proj.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '12px' }}>
                            <img src={proj.hero_img || proj.heroImg} alt="" style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '2px' }} />
                            <div style={{ flex: 1 }}>
                              <h5 style={{ fontSize: '13px', color: '#fff', margin: '0 0 2px 0', fontWeight: '400' }}>{proj.title}</h5>
                              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{proj.category} | {proj.year}</span>
                            </div>
                            <span style={{ fontSize: '10px', background: 'rgba(212,175,122,0.1)', color: 'var(--color-gold)', padding: '2px 6px', borderRadius: '2px' }}>{proj.area}</span>
                          </div>
                        ))}
                      </div>

                      {/* Homepage Headline preview banner */}
                      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.03)', padding: '20px', borderRadius: '2px', marginTop: '30px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>Homepage Copy Headline</span>
                        <h4 style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px 0', fontWeight: '400' }}>{homeData.hero_title}</h4>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: '1.4' }}>{homeData.hero_subtitle}</p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 1: HOMEPAGE CONTENT */}
              {activeTab === 'home' && (
                <div>
                  <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: '400', marginBottom: '8px' }}>Homepage Copy</h1>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '32px' }}>Edit titles, subheadings, and backdrop visuals rendered on the main landing page.</p>

                  <form onSubmit={saveHomeContent} style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ background: '#111', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h3 style={{ fontSize: '14px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Hero Intro Section</h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Hero Title Text</label>
                        <input 
                          type="text" 
                          value={homeData.hero_title}
                          onChange={(e) => setHomeData({...homeData, hero_title: e.target.value})}
                          style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Hero Subtitle Paragraph</label>
                        <textarea 
                          rows="2"
                          value={homeData.hero_subtitle}
                          onChange={(e) => setHomeData({...homeData, hero_subtitle: e.target.value})}
                          style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none', lineHeight: '1.6' }}
                        />
                      </div>
                    </div>

                    {/* EDITABLE ARCHITECTURE OF SPACE CANVAS */}
                    <div style={{ background: '#111', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h3 style={{ fontSize: '14px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Architecture of Space Canvas (Exactly 6 Images)</h3>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '-10px' }}>Upload new image files to modify the dynamic scroll-to-dismantle canvas visual frames.</p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <div key={index} style={{ background: '#161616', padding: '16px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--color-gold)', fontWeight: 'bold' }}>Canvas Frame Slot {index + 1}</span>
                            {homeData.architecture_imgs[index] && (
                              <img src={homeData.architecture_imgs[index]} alt="" style={{ height: '70px', objectFit: 'cover', borderRadius: '2px' }} />
                            )}
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleCanvasImageChange(e, index)}
                              style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}
                            />
                            {uploadingImage === `canvas_${index}` && <span style={{ fontSize: '10px', color: 'var(--color-gold)' }}>Uploading image...</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ background: '#111', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h3 style={{ fontSize: '14px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Signature Reveal Section</h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Signature Section Title</label>
                        <input 
                          type="text" 
                          value={homeData.signature_title}
                          onChange={(e) => setHomeData({...homeData, signature_title: e.target.value})}
                          style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Signature Subtitle Text</label>
                        <textarea 
                          rows="3"
                          value={homeData.signature_subtitle}
                          onChange={(e) => setHomeData({...homeData, signature_subtitle: e.target.value})}
                          style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none', lineHeight: '1.6' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Signature Background Image</label>
                          {homeData.signature_img && <img src={homeData.signature_img} alt="Preview" style={{ height: '100px', objectFit: 'cover', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.05)' }} />}
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleImageFileChange(e, 'signature_img')}
                            style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}
                          />
                          {uploadingImage === 'signature_img' && <span style={{ fontSize: '11px', color: 'var(--color-gold)' }}>Uploading image to storage...</span>}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Signature Watch Detail Image</label>
                          {homeData.signature_watch_img && <img src={homeData.signature_watch_img} alt="Preview" style={{ height: '100px', objectFit: 'cover', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.05)' }} />}
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleImageFileChange(e, 'signature_watch_img')}
                            style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}
                          />
                          {uploadingImage === 'signature_watch_img' && <span style={{ fontSize: '11px', color: 'var(--color-gold)' }}>Uploading image to storage...</span>}
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={saving || uploadingImage}
                      style={{ background: 'var(--color-gold)', color: '#000', border: 'none', padding: '14px 28px', alignSelf: 'flex-start', borderRadius: '2px', fontFamily: 'var(--font-accent)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', opacity: (saving || uploadingImage) ? 0.7 : 1 }}
                    >
                      {saving ? 'Saving updates...' : 'Save Homepage changes'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: HERITAGE STATS */}
              {activeTab === 'stats' && (
                <div>
                  <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: '400', marginBottom: '8px' }}>Heritage & Stats</h1>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '32px' }}>Edit completed project count, years of experience, and historical text blocks.</p>

                  <form onSubmit={saveStatsContent} style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ background: '#111', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h3 style={{ fontSize: '14px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Core Stat Metrics</h3>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Completed Projects</label>
                          <input 
                            type="text" 
                            value={statsData.completed_projects}
                            onChange={(e) => setStatsData({...statsData, completed_projects: e.target.value})}
                            style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Years of Experience</label>
                          <input 
                            type="text" 
                            value={statsData.years_experience}
                            onChange={(e) => setStatsData({...statsData, years_experience: e.target.value})}
                            style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Material Libraries Curated</label>
                          <input 
                            type="text" 
                            value={statsData.materials_curated}
                            onChange={(e) => setStatsData({...statsData, materials_curated: e.target.value})}
                            style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ background: '#111', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h3 style={{ fontSize: '14px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Heritage Narrative</h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Heritage Paragraph 1</label>
                        <textarea 
                          rows="3"
                          value={statsData.heritage_body_1}
                          onChange={(e) => setStatsData({...statsData, heritage_body_1: e.target.value})}
                          style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none', lineHeight: '1.6' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Heritage Paragraph 2</label>
                        <textarea 
                          rows="3"
                          value={statsData.heritage_body_2}
                          onChange={(e) => setStatsData({...statsData, heritage_body_2: e.target.value})}
                          style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none', lineHeight: '1.6' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Heritage Background Image</label>
                        {statsData.heritage_img && <img src={statsData.heritage_img} alt="Preview" style={{ height: '120px', width: '240px', objectFit: 'cover', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.05)' }} />}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageFileChange(e, 'heritage_img')}
                          style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}
                        />
                        {uploadingImage === 'heritage_img' && <span style={{ fontSize: '11px', color: 'var(--color-gold)' }}>Uploading image to storage...</span>}
                      </div>
                    </div>

                    <div style={{ background: '#111', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h3 style={{ fontSize: '14px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Founder Profile Card</h3>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Founder Name</label>
                          <input 
                            type="text" 
                            value={statsData.founder_name}
                            onChange={(e) => setStatsData({...statsData, founder_name: e.target.value})}
                            style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Founder Role / Designation</label>
                          <input 
                            type="text" 
                            value={statsData.founder_role}
                            onChange={(e) => setStatsData({...statsData, founder_role: e.target.value})}
                            style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Founder Short Description</label>
                        <textarea 
                          rows="2"
                          value={statsData.founder_desc}
                          onChange={(e) => setStatsData({...statsData, founder_desc: e.target.value})}
                          style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none', lineHeight: '1.6' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Founder Portrait Image</label>
                        {statsData.founder_img && <img src={statsData.founder_img} alt="Founder Preview" style={{ height: '100px', width: '100px', objectFit: 'cover', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.05)' }} />}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageFileChange(e, 'founder_img')}
                          style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}
                        />
                        {uploadingImage === 'founder_img' && <span style={{ fontSize: '11px', color: 'var(--color-gold)' }}>Uploading portrait image to storage...</span>}
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={saving || uploadingImage}
                      style={{ background: 'var(--color-gold)', color: '#000', border: 'none', padding: '14px 28px', alignSelf: 'flex-start', borderRadius: '2px', fontFamily: 'var(--font-accent)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', opacity: (saving || uploadingImage) ? 0.7 : 1 }}
                    >
                      {saving ? 'Saving stats...' : 'Save stats changes'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: PROJECTS */}
              {activeTab === 'projects' && (
                <div>
                  {editingProject === null ? (
                    /* Project List View */
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: '400', marginBottom: '8px' }}>Project Portfolio</h1>
                          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Add, update, or remove dynamic case studies. New projects generate URLs and cards instantly.</p>
                        </div>
                        <button onClick={startNewProject} style={{ background: 'var(--color-gold)', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '2px', fontFamily: 'var(--font-accent)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>+ Add New Project</button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {projectsList.map((proj) => (
                          <div key={proj.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '20px 24px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '2px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                              <img src={proj.hero_img || proj.heroImg} alt="" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '2px' }} />
                              <div>
                                <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: '400', marginBottom: '4px' }}>{proj.title}</h3>
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                                  Category: <strong style={{ color: 'var(--color-gold)' }}>{proj.category}</strong> | Slug: <code style={{ background: '#1c1c1c', padding: '2px 6px', borderRadius: '2px', color: 'rgba(255,255,255,0.6)' }}>/project?id={proj.slug}</code>
                                </span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <button onClick={() => startEditProject(proj)} style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: '2px', fontSize: '12px', cursor: 'pointer' }}>Edit Details</button>
                              <button onClick={() => handleDeleteProject(proj.id)} style={{ background: 'transparent', border: '1px solid rgba(235, 87, 87, 0.3)', color: '#eb5757', padding: '8px 16px', borderRadius: '2px', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                            </div>
                          </div>
                        ))}

                        {projectsList.length === 0 && (
                          <div style={{ textAlign: 'center', padding: '60px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                            <p style={{ color: 'rgba(255,255,255,0.4)' }}>No projects found in database. Seed tables using the SQL editor script.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Project Add/Edit Form View */
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                        <button onClick={() => setEditingProject(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', padding: '6px 12px', borderRadius: '2px', fontSize: '12px', cursor: 'pointer' }}>← Back to Portfolio</button>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: '400' }}>
                          {editingProject === 'new' ? 'New Project Case Study' : 'Edit Project Details'}
                        </h2>
                      </div>

                      <form onSubmit={saveProjectForm} style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '900px' }}>
                        {/* 1. Core Meta */}
                        <div style={{ background: '#111', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <h3 style={{ fontSize: '13px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>1. Project Parameters</h3>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Project Title</label>
                              <input 
                                type="text" 
                                required
                                value={projectForm.title}
                                onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                                placeholder="HUL Hosur - Boardroom"
                                style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                              />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>URL ID (Slug) — lowercase, no spaces</label>
                              <input 
                                type="text" 
                                required
                                value={projectForm.slug}
                                onChange={(e) => setProjectForm({...projectForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                                placeholder="hul-hosur-boardroom"
                                style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Category</label>
                              <select 
                                value={projectForm.category}
                                onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                                style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                              >
                                <option value="Office">Office</option>
                                <option value="Wellness">Wellness</option>
                                <option value="Residential">Residential</option>
                                <option value="Hospitality">Hospitality</option>
                                <option value="Retail">Retail</option>
                                <option value="Institutional">Institutional</option>
                              </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Year Completed</label>
                              <input 
                                type="text" 
                                required
                                value={projectForm.year}
                                onChange={(e) => setProjectForm({...projectForm, year: e.target.value})}
                                style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                              />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Project Type Label</label>
                              <input 
                                type="text" 
                                required
                                value={projectForm.type}
                                onChange={(e) => setProjectForm({...projectForm, type: e.target.value})}
                                placeholder="Executive Boardroom"
                                style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                              />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Floor Area</label>
                              <input 
                                type="text" 
                                required
                                value={projectForm.area}
                                onChange={(e) => setProjectForm({...projectForm, area: e.target.value})}
                                placeholder="120 sqm"
                                style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Case Study Subtitle</label>
                            <input 
                              type="text" 
                              required
                              value={projectForm.subtitle}
                              onChange={(e) => setProjectForm({...projectForm, subtitle: e.target.value})}
                              placeholder="A premium architectural canvas engineered for collaborative productivity."
                              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Materials Used (Comma-separated list)</label>
                            <input 
                              type="text" 
                              required
                              value={projectForm.materials}
                              onChange={(e) => setProjectForm({...projectForm, materials: e.target.value})}
                              placeholder="Oak Veneer, Travertine slabs, LED profiles"
                              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                            />
                          </div>
                        </div>

                        {/* 2. Narrative Content */}
                        <div style={{ background: '#111', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <h3 style={{ fontSize: '13px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>2. Project Narrative</h3>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Narrative Headline</label>
                            <input 
                              type="text" 
                              required
                              value={projectForm.headline}
                              onChange={(e) => setProjectForm({...projectForm, headline: e.target.value})}
                              placeholder="A study of raw materials, spatial layout, and quiet restraint."
                              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Body Paragraph 1</label>
                            <textarea 
                              rows="4"
                              required
                              value={projectForm.body_1}
                              onChange={(e) => setProjectForm({...projectForm, body_1: e.target.value})}
                              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none', lineHeight: '1.6' }}
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Body Paragraph 2</label>
                            <textarea 
                              rows="4"
                              required
                              value={projectForm.body_2}
                              onChange={(e) => setProjectForm({...projectForm, body_2: e.target.value})}
                              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none', lineHeight: '1.6' }}
                            />
                          </div>
                        </div>

                        {/* 3. Image Uploads */}
                        <div style={{ background: '#111', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <h3 style={{ fontSize: '13px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>3. Images & Media</h3>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Hero Banner Image</label>
                            {projectForm.hero_img && <img src={projectForm.hero_img} alt="Hero" style={{ height: '140px', width: '320px', objectFit: 'cover', borderRadius: '2px' }} />}
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleImageFileChange(e, 'hero_img')}
                              style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}
                            />
                            {uploadingImage === 'hero_img' && <span style={{ fontSize: '11px', color: 'var(--color-gold)' }}>Uploading image to storage...</span>}
                          </div>

                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                            <h4 style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>Gallery Grid Images (Exactly 5 items required for structural grid)</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {[0, 1, 2, 3, 4].map((idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px', background: '#161616', padding: '16px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                  <span style={{ fontSize: '12px', color: 'var(--color-gold)', fontWeight: 'bold' }}>Slot {idx + 1}</span>
                                  {projectForm.gallery_imgs[idx] ? (
                                    <img src={projectForm.gallery_imgs[idx]} alt="" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '2px' }} />
                                  ) : (
                                    <div style={{ width: '80px', height: '50px', background: '#222', borderRadius: '2px', border: '1px dashed rgba(255,255,255,0.1)' }} />
                                  )}
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => handleImageFileChange(e, null, idx)}
                                    style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}
                                  />
                                  {uploadingImage === `gallery_${idx}` && <span style={{ fontSize: '11px', color: 'var(--color-gold)' }}>Uploading...</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 4. Client Testimonials */}
                        <div style={{ background: '#111', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <h3 style={{ fontSize: '13px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>4. Testimonial Quotes</h3>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Quote Text</label>
                            <textarea 
                              rows="3"
                              required
                              value={projectForm.quote}
                              onChange={(e) => setProjectForm({...projectForm, quote: e.target.value})}
                              placeholder="&quot;The spatial configuration has completely transformed how we operate...&quot;"
                              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none', lineHeight: '1.6' }}
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Quote Author / Client Designation</label>
                            <input 
                              type="text" 
                              required
                              value={projectForm.author}
                              onChange={(e) => setProjectForm({...projectForm, author: e.target.value})}
                              placeholder="HUL Director of Innovation"
                              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#fff', outline: 'none' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                          <button 
                            type="submit" 
                            disabled={saving || uploadingImage}
                            style={{ background: 'var(--color-gold)', color: '#000', border: 'none', padding: '14px 32px', borderRadius: '2px', fontFamily: 'var(--font-accent)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', opacity: (saving || uploadingImage) ? 0.7 : 1 }}
                          >
                            {saving ? 'Saving changes...' : 'Save Case Study'}
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setEditingProject(null)} 
                            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '14px 32px', borderRadius: '2px', fontFamily: 'var(--font-accent)', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CONSULTATIONS LOG */}
              {activeTab === 'bookings' && (
                <div>
                  <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: '400', marginBottom: '8px' }}>Consultations Log</h1>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '32px' }}>Review the history of booking and consultation requests submitted by website visitors.</p>

                  <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '2px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#181818', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <th style={{ padding: '16px 20px', color: 'var(--color-gold)', fontWeight: '500' }}>Date</th>
                          <th style={{ padding: '16px 20px', color: 'var(--color-gold)', fontWeight: '500' }}>Client Name</th>
                          <th style={{ padding: '16px 20px', color: 'var(--color-gold)', fontWeight: '500' }}>Email Address</th>
                          <th style={{ padding: '16px 20px', color: 'var(--color-gold)', fontWeight: '500' }}>Phone</th>
                          <th style={{ padding: '16px 20px', color: 'var(--color-gold)', fontWeight: '500' }}>Project Type</th>
                          <th style={{ padding: '16px 20px', color: 'var(--color-gold)', fontWeight: '500' }}>Vision Message</th>
                          <th style={{ padding: '16px 20px', color: 'var(--color-gold)', fontWeight: '500', textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consultationsList.map((item) => (
                          <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', verticalAlign: 'top' }}>
                            <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                              {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '16px 20px', fontWeight: '500' }}>{item.first_name} {item.last_name}</td>
                            <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.8)' }}>
                              <a href={`mailto:${item.email}`} style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>{item.email}</a>
                            </td>
                            <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{item.phone || '—'}</td>
                            <td style={{ padding: '16px 20px', textTransform: 'capitalize' }}>{item.project_type || '—'}</td>
                            <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5', minWidth: '250px' }}>{item.message || '—'}</td>
                            <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                              <button 
                                onClick={() => handleDeleteBooking(item.id)} 
                                style={{ background: 'transparent', border: '1px solid rgba(235, 87, 87, 0.3)', color: '#eb5757', padding: '6px 12px', borderRadius: '2px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}

                        {consultationsList.length === 0 && (
                          <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
                              No booking records found in database yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Custom Toast Overlay Notification */}
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

      {/* Premium Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999999,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <div style={{
            background: '#111',
            border: '1px solid var(--color-gold)',
            borderRadius: '4px',
            maxWidth: '440px',
            width: '100%',
            padding: '30px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            textAlign: 'center',
            position: 'relative'
          }}>
            <span style={{ fontSize: '24px', color: 'var(--color-gold)', display: 'block', marginBottom: '16px' }}>◈</span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: '400', margin: '0 0 12px 0', color: '#fff', letterSpacing: '0.02em' }}>
              {confirmModal.title}
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', margin: '0 0 28px 0' }}>
              {confirmModal.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button 
                onClick={confirmModal.onConfirm}
                style={{
                  background: 'var(--color-gold)',
                  color: '#000',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-accent)',
                  fontWeight: '500',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer'
                }}
              >
                Confirm Delete
              </button>
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '10px 24px',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-accent)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ADMIN TRANSACTION ANIMATION */}
      {savingState && (
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
              Database Syncing
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: '300' }}>
              {savingText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
