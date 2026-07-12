// src/App.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CampSearch from './pages/CampSearch';
import EmergencyRequests from './pages/EmergencyRequests';
import DonorDashboard from './pages/DonorDashboard';
import OrgDashboard from './pages/OrgDashboard';
import AdminPanel from './pages/AdminPanel';
import Auth from './pages/Auth';
import { dbService } from './services/db';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState('home');

  // Load session from storage if it exists (for sandbox switches)
  useEffect(() => {
    const restoreSession = async () => {
      const session = localStorage.getItem('india_bloodbridge_session');
      if (session) {
        try {
          const user = JSON.parse(session);
          // Refresh from DB to verify fresh records
          const freshUser = await dbService.getUser(user.id);
          if (freshUser) {
            setCurrentUser(freshUser);
          }
        } catch (err) {
          console.error("Session restore failed", err);
        }
      }
    };
    restoreSession();
  }, []);

  // Save session when user changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('india_bloodbridge_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('india_bloodbridge_session');
    }
  }, [currentUser]);

  // Synchronize User profile stats (e.g. points redemptions)
  const handleUpdateUser = async () => {
    if (!currentUser) return;
    try {
      const freshUser = await dbService.getUser(currentUser.id);
      if (freshUser) {
        setCurrentUser(freshUser);
      }
    } catch (err) {
      console.error("User update failed", err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Dynamic Header & Switcher */}
      <Navbar 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser} 
        activePage={activePage} 
        setActivePage={setActivePage} 
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {activePage === 'home' && (
          <Home currentUser={currentUser} setActivePage={setActivePage} />
        )}
        
        {activePage === 'camps' && (
          <CampSearch currentUser={currentUser} />
        )}
        
        {activePage === 'emergencies' && (
          <EmergencyRequests 
            currentUser={currentUser} 
            onUpdateUser={handleUpdateUser} 
          />
        )}
        
        {activePage === 'donor-dashboard' && (
          <DonorDashboard 
            currentUser={currentUser} 
            onUpdateUser={handleUpdateUser} 
            setActivePage={setActivePage}
          />
        )}
        
        {activePage === 'org-dashboard' && (
          <OrgDashboard currentUser={currentUser} />
        )}
        
        {activePage === 'admin' && (
          <AdminPanel />
        )}

        {(activePage === 'login' || 
          activePage === 'register-choice' || 
          activePage === 'register-donor' || 
          activePage === 'register-org') && (
          <Auth 
            view={activePage} 
            setView={setActivePage} 
            setCurrentUser={setCurrentUser} 
            setActivePage={setActivePage} 
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="glass-panel" style={{
        borderRadius: 0,
        borderWidth: '1px 0 0 0',
        padding: '2.5rem 1.5rem',
        marginTop: '5rem',
        background: 'rgba(29, 18, 20, 0.98)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
          <strong style={{ fontFamily: 'Georgia, serif', color: '#ffffff', fontSize: '1.25rem' }}>
            India <span style={{ color: 'var(--color-gold-accent)' }}>BloodBridge</span>
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            एक चेन, अनगिनत जिंदगियां
          </span>
        </div>
        
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', maxWidth: '500px', lineHeight: 1.5 }}>
          India BloodBridge is a trusted peer-to-peer blood supply coordinator. We do not charge fees, store medical bags, or direct transactions. Verified by Ministry Health compliance schemas.
        </p>

        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', width: '80%' }}>
          © 2026 India BloodBridge. Designed under national cooperative licensing structures.
        </div>
      </footer>
    </div>
  );
}
