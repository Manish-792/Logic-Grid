import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { gsap } from 'gsap';

// Theme palette reads from CSS variables (supports light/dark toggle)
const ui = {
  bg: 'var(--bg)',
  header: 'var(--header)',
  panel: 'var(--panel)',
  border: 'var(--border)',
  accent: 'var(--accent)',
  text: 'var(--text)',
  muted: 'var(--muted)',
  danger: 'var(--danger)',
  warn: 'var(--warn)'
};

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isDark, setIsDark] = useState(true);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [showPreloader, setShowPreloader] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });

  const preloaderRef = useRef(null);
  const logoRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressFillRef = useRef(null);
  const mainContentRef = useRef(null);

  // Preloader Animation
  useEffect(() => {
    if (showPreloader && preloaderRef.current) {
      const tl = gsap.timeline();
      
      // Initial state
      gsap.set(preloaderRef.current, { opacity: 1 });
      gsap.set(logoRef.current, { opacity: 0, scale: 0.98 });
      gsap.set(progressFillRef.current, { width: '0%' });
      gsap.set(progressBarRef.current, { opacity: 0 });
      
      // Logo fade in and pulse
      tl.to(logoRef.current, { 
        opacity: 1, 
        duration: 0.6,
        ease: "power2.out"
      })
      .to(logoRef.current, {
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      })
      .to(logoRef.current, {
        scale: 0.98,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      }, "-=0.3");
      
      // Progress bar animation
      tl.to(progressBarRef.current, { 
        opacity: 1, 
        duration: 0.3 
      }, "-=0.6")
      .to(progressFillRef.current, {
        width: '100%',
        duration: 1.5,
        ease: "power2.inOut"
      }, "-=0.3");
      
      // Completion animation
      tl.to(progressBarRef.current, { 
        opacity: 0, 
        duration: 0.2 
      })
      .to(logoRef.current, {
        scale: 1.2,
        duration: 0.15,
        ease: "power2.out"
      })
      .to(logoRef.current, {
        scale: 1,
        duration: 0.15,
        ease: "power2.in"
      })
      .to(preloaderRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setShowPreloader(false);
          // Fade in main content
          gsap.fromTo(mainContentRef.current, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
          );
        }
      });
    }
  }, [showPreloader]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen" data-theme={isDark ? 'dark' : 'light'} style={{ backgroundColor: ui.bg, transition: 'background-color 300ms ease, color 300ms ease' }}>
      {/* Preloader */}
      {showPreloader && (
        <div 
          ref={preloaderRef}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: '#0A0A0A' }}
        >
          {/* LogicGrid Logo */}
          <div 
            ref={logoRef}
            className="mb-8"
          >
            <div className="font-bold" style={{ fontSize: '6rem', fontFamily: 'inherit' }}>
              <span style={{ color: '#22d3ee', textShadow: '0 0 20px #22d3ee, 0 0 40px #22d3ee' }}>LG</span>
              <span style={{ color: '#ffffff', textShadow: '0 0 10px #ffffff' }}> LogicGrid</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div 
            ref={progressBarRef}
            className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden"
            style={{ boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)' }}
          >
            <div 
              ref={progressFillRef}
              className="h-full rounded-full"
              style={{ 
                background: 'linear-gradient(90deg, #8b5cf6, #a855f7, #c084fc)',
                boxShadow: '0 0 20px #8b5cf6, 0 0 40px #8b5cf6'
              }}
            />
          </div>
        </div>
      )}
      
      {/* Google Font and component-scoped styles */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        :root, [data-theme='dark'] {
          --bg: #0b0f14;
          --header: #111827ee;
          --panel: rgba(17, 24, 39, 0.55);
          --border: #2a2f3a;
          --text: #e5e7eb;
          --muted: #9ca3af;
          --accent: #22c55e;
          --warn: #eab308;
          --danger: #ef4444;
          --neon: #22d3ee;
          --glass-blur: 12px;
        }
        [data-theme='light'] {
          --bg: #f6f7fb;
          --header: rgba(255,255,255,0.7);
          --panel: rgba(255,255,255,0.55);
          --border: #e5e7eb;
          --text: #0f172a;
          --muted: #475569;
          --accent: #16a34a;
          --warn: #ca8a04;
          --danger: #dc2626;
          --neon: #7c3aed;
        }
        .font-outfit { font-family: 'Outfit', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; }
        .glass { 
          background: var(--panel);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--border);
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        }
        .neon-btn, .neon-input { 
          border: 1px solid var(--border);
          box-shadow: 0 0 0px rgba(0,0,0,0), 0 0 0px var(--neon);
          transition: transform 220ms ease, box-shadow 220ms ease, background-color 220ms ease, color 220ms ease;
        }
        .neon-btn:hover { 
          transform: translateY(-1px) scale(1.03);
          box-shadow: 0 8px 20px rgba(0,0,0,0.3), 0 0 18px var(--neon);
        }
        .neon-btn:active { transform: translateY(0) scale(0.98) rotate(-0.5deg); }
        .neon-input:hover { box-shadow: 0 0 10px var(--neon); }
        .pulse-neon { animation: pulseNeon 2.2s ease-in-out infinite; }
        @keyframes pulseNeon { 0%,100% { box-shadow: 0 0 10px var(--neon);} 50% { box-shadow: 0 0 24px var(--neon);} }
        .card-hover { transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease; }
        .card-hover:hover { transform: translateY(-2px) scale(1.01); box-shadow: 0 14px 30px rgba(0,0,0,0.35); border-color: var(--neon); }
        .nav-anim a { position: relative; }
        .nav-anim a::after { content: ''; position: absolute; left: 0; bottom: -6px; width: 0; height: 2px; background: var(--neon); box-shadow: 0 0 10px var(--neon); transition: width 240ms ease; }
        .nav-anim a:hover::after { width: 100%; }
        .tag { padding: 0.25rem 0.6rem; border-radius: 9999px; font-weight: 600; letter-spacing: 0.3px; }
        .tag-sm { padding: 0.15rem 0.5rem; font-weight: 600; border-radius: 9999px; }
      `}</style>
      {/* Navigation Bar */}
      <nav ref={mainContentRef} className="navbar px-4 border-b glass nav-anim font-outfit" style={{ backgroundColor: ui.header, borderColor: ui.border, zIndex: 50, position: 'sticky', top: 0, height: '64px', paddingTop: '0', marginTop: '0', opacity: showPreloader ? 0 : 1 }}>
        <div className="flex-1 flex items-center h-full">
          <NavLink 
            to="/" 
            className="btn btn-ghost text-2xl neon-btn"
            style={{ color: ui.text, backgroundColor: 'transparent' }}
          >
            Problems
          </NavLink>
        </div>
        
        {/* Logo Section */}
        <div className="flex-1 flex justify-center items-center h-full">
          <div className="font-bold leading-none" style={{ fontSize: '2.5rem', color: 'inherit', fontFamily: 'inherit' }}>
            <span style={{ color: '#22d3ee' }}>LG</span>
            <span style={{ color: ui.text }}> LogicGrid</span>
          </div>
        </div>
        
        <div className="flex-1 flex justify-end items-center h-full">
          <div className="dropdown dropdown-end">
            <div 
              tabIndex={0} 
              className="btn btn-ghost neon-btn"
              style={{ color: ui.text }}
            >
              {user?.firstName}
            </div>
            <ul 
              className="mt-3 p-2 shadow menu menu-sm dropdown-content rounded-box w-52 border glass"
              style={{ backgroundColor: ui.header, borderColor: ui.border, zIndex: 1000 }}
            >
              <li>
                <button 
                  onClick={handleLogout}
                  className="neon-btn"
                  style={{ color: ui.text, backgroundColor: 'transparent' }}
                >
                  Logout
                </button>
              </li>
              {user.role=='admin'&&
                <li>
                  <NavLink 
                    to="/admin"
                    className="neon-btn"
                    style={{ color: ui.accent, backgroundColor: 'transparent' }}
                  >
                    Admin
                  </NavLink>
                </li>
              }
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-6 font-outfit">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 glass p-3 rounded-xl">
          {/* Status Filter */}
          <select 
            className="select select-sm border rounded-md neon-input"
            style={{ 
              backgroundColor: ui.header,
              borderColor: ui.border,
              color: ui.text
            }}
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          <select 
            className="select select-sm border rounded-md neon-input"
            style={{ 
              backgroundColor: ui.header,
              borderColor: ui.border,
              color: ui.text
            }}
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select 
            className="select select-sm border rounded-md neon-input"
            style={{ 
              backgroundColor: ui.header,
              borderColor: ui.border,
              color: ui.text
            }}
            value={filters.tag}
            onChange={(e) => setFilters({...filters, tag: e.target.value})}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

        {/* Problems List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProblems.map(problem => (
            <div 
              key={problem._id} 
              className="rounded-xl border glass card-hover"
              style={{ backgroundColor: ui.panel, borderColor: ui.border }}
            >
              <div className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold" style={{ color: ui.text }}>
                    <NavLink 
                      to={`/problem/${problem._id}`} 
                      className="hover:opacity-90 transition-opacity"
                      style={{ color: ui.text }}
                    >
                      {problem.title}
                    </NavLink>
                  </h2>
                  {solvedProblems.some(sp => sp._id === problem._id) && (
                    <div 
                      className="badge gap-2 neon-btn tag-sm"
                      style={{ 
                        backgroundColor: ui.accent,
                        color: '#0b0f15'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Solved
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-2 items-center">
                  <div 
                    className="badge neon-btn tag-sm"
                    style={{ 
                      backgroundColor: getDifficultyBadgeColor(problem.difficulty),
                      color: '#0b0f15'
                    }}
                  >
                    {problem.difficulty}
                  </div>
                  <div 
                    className="badge neon-btn tag-sm"
                    style={{ 
                      backgroundColor: ui.header,
                      color: ui.muted,
                      border: `1px solid ${ui.border}`
                    }}
                  >
                    {problem.tags}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return ui.accent;
    case 'medium': return ui.warn;
    case 'hard': return '#ef4444';
    default: return ui.text;
  }
};

export default Homepage;