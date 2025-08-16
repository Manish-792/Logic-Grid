import React, { useState } from 'react';
import { Plus, Edit, Trash2, Home, RefreshCw, Zap,Video } from 'lucide-react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';

function Admin() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: '#eae244',
      bgColor: '#8b861d',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: '#dfdb9a',
      bgColor: '#8b861d',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: '#eae244',
      bgColor: '#8b861d',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Problem',
      description: 'Upload And Delete Videos',
      icon: Video,
      color: '#dfdb9a',
      bgColor: '#8b861d',
      route: '/admin/video'
    }
  ];

  return (
    <div className="min-h-screen font-outfit" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Scoped theme styles */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        :root { --bg:#0b0f14; --header:#111827ee; --panel:rgba(17,24,39,.55); --border:#2a2f3a; --text:#e5e7eb; --muted:#9ca3af; --accent:#22c55e; --neon:#22d3ee; --glass-blur:12px; }
        .font-outfit{ font-family:'Outfit', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
        .glass{ background:var(--panel); backdrop-filter:blur(var(--glass-blur)); -webkit-backdrop-filter:blur(var(--glass-blur)); border:1px solid var(--border); box-shadow:0 10px 30px rgba(0,0,0,.25) }
        .neon-btn{ border:1px solid var(--border); transition: transform .22s ease, box-shadow .22s ease, background-color .22s ease, color .22s ease; }
        .neon-btn:hover{ transform: translateY(-1px) scale(1.03); box-shadow: 0 8px 20px rgba(0,0,0,.3), 0 0 18px var(--neon) }
        .nav-anim a { position: relative; }
        .nav-anim a::after { content: ''; position: absolute; left: 0; bottom: -6px; width: 0; height: 2px; background: var(--neon); box-shadow: 0 0 10px var(--neon); transition: width 240ms ease; }
        .nav-anim a:hover::after { width: 100%; }
      `}</style>
      
      {/* Navigation Bar */}
      <nav className="navbar px-4 border-b glass nav-anim font-outfit" style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', zIndex: 50, position: 'sticky', top: 0, height: '64px', paddingTop: '0', marginTop: '0' }}>
        <div className="flex-1 flex items-center h-full">
          <NavLink 
            to="/" 
            className="btn btn-ghost text-2xl neon-btn"
            style={{ color: 'var(--text)', backgroundColor: 'transparent' }}
          >
            Problems
          </NavLink>
        </div>
        
        {/* Logo Section */}
        <div className="flex-1 flex justify-center items-center h-full">
          <div className="font-bold leading-none" style={{ fontSize: '2.5rem', color: 'inherit', fontFamily: 'inherit' }}>
            <span style={{ color: '#22d3ee' }}>LG</span>
            <span style={{ color: 'var(--text)' }}> LogicGrid</span>
          </div>
        </div>
        
        <div className="flex-1 flex justify-end items-center h-full">
          <div className="dropdown dropdown-end">
            <div 
              tabIndex={0} 
              className="btn btn-ghost neon-btn"
              style={{ color: 'var(--text)' }}
            >
              {user?.firstName}
            </div>
            <ul 
              className="mt-3 p-2 shadow menu menu-sm dropdown-content rounded-box w-52 border glass"
              style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', zIndex: 1000 }}
            >
              <li>
                <button 
                  onClick={handleLogout}
                  className="neon-btn"
                  style={{ color: 'var(--text)', backgroundColor: 'transparent' }}
                >
                  Logout
                </button>
              </li>
              {user?.role=='admin'&&
                <li>
                  <NavLink 
                    to="/admin"
                    className="neon-btn"
                    style={{ color: 'var(--accent)', backgroundColor: 'transparent' }}
                  >
                    Admin
                  </NavLink>
                </li>
              }
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ color: 'var(--text)' }}
          >
            Admin Panel
          </h1>
          <p 
            className="text-lg"
            style={{ color: 'var(--muted)' }}
          >
            Manage coding problems on your platform
          </p>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="card glass hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}
              >
                <div className="card-body items-center text-center p-8">
                  {/* Icon */}
                  <div 
                    className="p-4 rounded-full mb-4"
                    style={{ backgroundColor: option.bgColor }}
                  >
                    <IconComponent 
                      size={32} 
                      style={{ color: option.color }}
                    />
                  </div>
                  
                  {/* Title */}
                  <h2 
                    className="card-title text-xl mb-2"
                    style={{ color: 'var(--text)' }}
                  >
                    {option.title}
                  </h2>
                  
                  {/* Description */}
                  <p 
                    className="mb-6"
                    style={{ color: 'var(--muted)' }}
                  >
                    {option.description}
                  </p>
                  
                  {/* Action Button */}
                  <div className="card-actions">
                    <div className="card-actions">
                    <NavLink 
                      to={option.route}
                      className="btn btn-wide font-semibold transition-all duration-200 hover:scale-105 neon-btn"
                      style={{ backgroundColor: 'var(--accent)', color: '#0b0f15', border: 'none' }}
                    >
                      {option.title}
                    </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Admin;