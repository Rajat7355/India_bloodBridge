// src/components/CampCard.jsx
import React from 'react';

export default function CampCard({ 
  camp, 
  currentUser, 
  onRegister, 
  onSelectCamp,
  isRegistered = false,
  isDonated = false
}) {
  const isCampClosed = camp.status === 'closed';

  // Format date nicely
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`glass-panel ${isCampClosed ? 'badge-closed' : 'glass-panel-maroon'} slide-up`} style={{ 
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      transition: 'all 0.3s ease',
      borderLeft: isDonated 
        ? '4px solid var(--color-success)' 
        : isRegistered 
          ? '4px solid var(--color-gold-accent)' 
          : '1px solid rgba(107, 20, 32, 0.3)'
    }}>
      {/* Title & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>{camp.title}</h3>
        <div>
          {isDonated ? (
            <span className="badge" style={{ background: 'rgba(34, 197, 94, 0.2)', color: 'var(--color-success)', border: '1px solid var(--color-success)' }}>Donated</span>
          ) : isRegistered ? (
            <span className="badge badge-verified">Registered</span>
          ) : isCampClosed ? (
            <span className="badge badge-closed">Closed</span>
          ) : (
            <span className="badge badge-active">Active</span>
          )}
        </div>
      </div>

      {/* Organization info & badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>By: <strong>{camp.orgName}</strong></span>
        {/* We assume pre-seeded orgs are verified. We check simple mock verification */}
        {camp.orgId !== 'org-lifeline' && (
          <span className="badge badge-verified" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
            ✓ Verified
          </span>
        )}
      </div>

      {/* Camp timing details */}
      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div>📅 {formatDate(camp.date)}</div>
        <div>🕒 {camp.time}</div>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          📍 {camp.locationName} {camp.distance !== undefined && `(${camp.distance.toFixed(1)} km away)`}
        </div>
      </div>

      {/* Blood Groups Needed */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
        {camp.bloodGroupsNeeded.map((bg) => (
          <span 
            key={bg} 
            style={{ 
              background: 'rgba(107, 20, 32, 0.25)', 
              border: '1px solid rgba(107, 20, 32, 0.4)', 
              color: '#fcd34d',
              padding: '0.15rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}
          >
            {bg}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button 
          className="btn btn-secondary" 
          style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
          onClick={() => onSelectCamp(camp)}
        >
          Inspect
        </button>

        {!isCampClosed && (
          <button
            className={`btn ${isRegistered || isDonated ? 'btn-secondary' : 'btn-primary'}`}
            style={{ flex: 2, padding: '0.5rem', fontSize: '0.85rem' }}
            disabled={isRegistered || isDonated || (currentUser && currentUser.role !== 'donor')}
            onClick={() => onRegister(camp.id)}
          >
            {isDonated ? 'Completed' : isRegistered ? 'Registered' : 'Register Now'}
          </button>
        )}
      </div>
      
      {currentUser && currentUser.role !== 'donor' && !isCampClosed && (
        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          * Logged in as {currentUser.role}. Donor accounts only.
        </span>
      )}
    </div>
  );
}
