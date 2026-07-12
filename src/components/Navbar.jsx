// src/components/Navbar.jsx
import React, { useState } from 'react';
import Logo from './Logo';
import { dbService } from '../services/db';

export default function Navbar({ 
  currentUser, 
  setCurrentUser, 
  activePage, 
  setActivePage 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick switch logins for testing
  const switchUser = async (email) => {
    try {
      const user = await dbService.login(email, 'password123');
      setCurrentUser(user);
      setMobileMenuOpen(false);
      // Auto redirect to appropriate page
      if (user.role === 'admin') setActivePage('admin');
      else if (user.role === 'org') setActivePage('org-dashboard');
      else setActivePage('donor-dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('home');
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'camps', label: 'Find Camps' },
    { id: 'emergencies', label: 'Emergency Board' }
  ];

  // Add role-based links
  if (currentUser) {
    if (currentUser.role === 'admin') {
      navItems.push({ id: 'admin', label: 'Admin Portal' });
    } else if (currentUser.role === 'org') {
      navItems.push({ id: 'org-dashboard', label: 'Org Dashboard' });
    } else {
      navItems.push({ id: 'donor-dashboard', label: 'Donor Dashboard' });
    }
  }

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. STICKY EVALUATOR PERSONA SWITCHER */}
      {currentUser && currentUser.role === 'org' && (
        <div style={{
          background: '#0d0708', // Flat near-black/dark charcoal shade distinct from maroon
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '0.3rem 1rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          zIndex: 1001,
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)'
        }}>
          <span style={{ 
            fontSize: '0.7rem', 
            fontWeight: 700, 
            color: 'var(--color-gold-accent)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            marginRight: '0.4rem'
          }}>
            🧪 Sandbox Switcher:
          </span>
          
          <button 
            onClick={() => switchUser('admin@bloodbridge.in')}
            className={`sandbox-btn ${currentUser?.id === 'admin-1' ? 'active' : ''}`}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            Admin (Dr. Rajeev)
          </button>

          <button 
            onClick={() => switchUser('delhi@redcross.org')}
            className={`sandbox-btn ${currentUser?.id === 'org-redcross' ? 'active' : ''}`}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            Org (Red Cross)
          </button>

          <button 
            onClick={() => switchUser('contact@lifelinengo.org')}
            className={`sandbox-btn ${currentUser?.id === 'org-lifeline' ? 'active' : ''}`}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eab308', display: 'inline-block' }} />
            Org (Lifeline - Pending)
          </button>

          <button 
            onClick={() => switchUser('amit@gmail.com')}
            className={`sandbox-btn ${currentUser?.id === 'donor-amit' ? 'active' : ''}`}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            Donor (Amit - Eligible)
          </button>

          <button 
            onClick={() => switchUser('priya@gmail.com')}
            className={`sandbox-btn ${currentUser?.id === 'donor-priya' ? 'active' : ''}`}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            Donor (Priya - Ineligible)
          </button>

          <button 
            onClick={handleLogout}
            className={`sandbox-btn ${!currentUser ? 'active' : ''}`}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9ca3af', display: 'inline-block' }} />
            Guest/Logout
          </button>
        </div>
      )}

      {/* 2. CORE HEADER */}
      <header className="glass-panel" style={{
        borderRadius: 0,
        borderWidth: '0 0 1px 0',
        padding: '0.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(29, 18, 20, 0.95)'
      }}>
        {/* Brand Logo */}
        <div onClick={() => setActivePage('home')}>
          <Logo size={42} />
        </div>

        {/* Desktop Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activePage === item.id ? 'var(--color-gold-accent)' : 'var(--color-text-primary)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: '0.5rem 0',
                borderBottom: activePage === item.id ? '2px solid var(--color-gold-accent)' : '2px solid transparent'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Login States */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentUser.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-gold-accent)', textTransform: 'capitalize' }}>
                  {currentUser.role} {currentUser.role === 'donor' && `(${currentUser.points} pts)`}
                </span>
              </div>
              <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => setActivePage('login')}
              >
                Log In
              </button>
              <button 
                className="btn btn-primary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => setActivePage('register-choice')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button 
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'none' // Controlled in CSS or quick style
          }}
        >
          ☰
        </button>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="glass-panel" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--color-maroon-card)',
          borderWidth: '0 0 1px 0',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
        }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setMobileMenuOpen(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: activePage === item.id ? 'var(--color-gold-accent)' : '#fff',
                padding: '0.5rem 0',
                textAlign: 'left',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
              <div style={{ fontSize: '0.9rem' }}>
                Signed in as: <strong>{currentUser.name}</strong> ({currentUser.role})
              </div>
              <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => { setActivePage('login'); setMobileMenuOpen(false); }}>Log In</button>
              <button className="btn btn-primary" onClick={() => { setActivePage('register-choice'); setMobileMenuOpen(false); }}>Sign Up</button>
            </div>
          )}
        </div>
      )}

      {/* Basic style overlay to handle responsive layout */}
      <style>{`
        .sandbox-btn {
          background: rgba(255, 255, 255, 0.03);
          color: #fceee9;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .sandbox-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--color-gold-accent);
          color: #ffffff;
          transform: translateY(-0.5px);
        }
        .sandbox-btn.active {
          background: var(--color-gold-accent) !important;
          color: var(--color-maroon-dark) !important;
          border-color: var(--color-gold-accent) !important;
        }
        .sandbox-btn.active:hover {
          background: var(--color-gold-hover) !important;
          transform: none;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>

    </div>
  );
}
