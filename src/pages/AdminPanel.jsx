// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [pendingOrgs, setPendingOrgs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const loadAdminData = async () => {
    try {
      // Load Stats
      const metrics = await dbService.getAdminStats();
      setStats(metrics);

      // Load Pending Orgs
      const pending = await dbService.getPendingOrganizations();
      setPendingOrgs(pending);

      // Load Activity Logs
      const logs = await dbService.getActivityLogs();
      setActivityLogs(logs);
    } catch (err) {
      console.error("Failed to load admin data", err);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleVerifyOrg = async (orgId, approve) => {
    try {
      await dbService.verifyOrganization(orgId, approve);
      setSuccessMsg(`Organization account has been successfully ${approve ? 'verified' : 'rejected'}.`);
      await loadAdminData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const formatTimestamp = (timeStr) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' ' + date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (!stats) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin Panel...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1.5rem 0' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '2rem', color: '#ffffff' }}>Admin Portal</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>System governance, organization approvals, and platform audits.</p>
      </div>

      {successMsg && (
        <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--color-success)', color: 'var(--color-success)', borderRadius: '8px' }} className="slide-up">
          ✓ {successMsg}
        </div>
      )}

      {/* KPI Stats Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }} className="admin-stats-grid">
        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.25rem' }}>👥</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Total Donors</span>
          <h3 style={{ color: '#ffffff', fontSize: '1.8rem', marginTop: '0.25rem' }}>{stats.totalDonors}</h3>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.25rem' }}>🏥</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Organizations</span>
          <h3 style={{ color: '#ffffff', fontSize: '1.8rem', marginTop: '0.25rem' }}>
            {stats.totalOrgs} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>({stats.verifiedOrgs} Verified)</span>
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.25rem' }}>🩸</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Units Donated</span>
          <h3 style={{ color: 'var(--color-gold-accent)', fontSize: '1.8rem', marginTop: '0.25rem' }}>{stats.totalUnitsDonated} Units</h3>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.25rem' }}>🚨</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Active Emergencies</span>
          <h3 style={{ color: '#ffffff', fontSize: '1.8rem', marginTop: '0.25rem' }}>{stats.activeEmergencies}</h3>
        </div>
      </div>

      {/* Main Grid: Approvals queue vs Activity logs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '2rem' }} className="admin-main-grid">
        
        {/* Left Side: NGO Approval Desk */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Organization Verification Queue</h2>
          
          {pendingOrgs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingOrgs.map((org) => (
                <div key={org.id} className="glass-panel-maroon" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ color: '#ffffff', fontSize: '1.2rem' }}>{org.name}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>📍 {org.address}</span>
                    </div>
                    <span className="badge badge-pending">Pending Review</span>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '0.75rem', 
                    fontSize: '0.85rem',
                    background: 'rgba(0,0,0,0.15)',
                    padding: '0.75rem',
                    borderRadius: '6px'
                  }}>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.7rem' }}>Contact Info</span>
                      <strong>{org.contact} | {org.email}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.7rem' }}>Registration Certificate</span>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert(`Simulated document view: Opening license file "${org.certificateUrl}"`); }} style={{ color: 'var(--color-gold-accent)', fontWeight: 600, textDecoration: 'underline' }}>
                        📄 {org.certificateUrl}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', border: '1px solid var(--color-danger)', color: 'var(--color-danger)' }}
                      onClick={() => handleVerifyOrg(org.id, false)}
                    >
                      Reject
                    </button>
                    <button 
                      className="btn btn-gold" 
                      style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem' }}
                      onClick={() => handleVerifyOrg(org.id, true)}
                    >
                      Approve & Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>✓</span>
              <p>All registered organizations are verified. No pending reviews.</p>
            </div>
          )}
        </div>

        {/* Right Side: Platform Live Audit Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>System Audit Ledger</h2>
          
          <div className="glass-panel" style={{ 
            padding: '1.5rem', 
            background: '#0a0506',
            border: '1px solid rgba(107, 20, 32, 0.25)', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            {activityLogs.map((log, index) => (
              <div 
                key={index}
                style={{
                  fontSize: '0.8rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                  paddingBottom: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  {log.text}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                  ⏳ {formatTimestamp(log.time)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .admin-main-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
        @media (max-width: 600px) {
          .admin-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
