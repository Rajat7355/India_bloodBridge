// src/components/Verification.jsx
import React, { useState } from 'react';
import { dbService } from '../services/db';

export default function Verification() {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    const cleanId = certId.trim().toUpperCase();
    if (!cleanId) return;

    try {
      const cert = await dbService.getCertificate(cleanId);
      setResult(cert || null);
    } catch (err) {
      console.error(err);
      setResult(null);
    }
    setSearched(true);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="glass-panel-maroon" style={{ padding: '2rem', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--color-gold-accent)', marginBottom: '0.5rem' }}>
          Verify Donor Certificate
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Enter a Certificate ID to verify the authenticity of a blood donation credential instantly.
        </p>
      </div>

      <form onSubmit={handleVerify} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="e.g. IBB-20260315-AMIT" 
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
          style={{ textTransform: 'uppercase', flex: 1 }}
          required
        />
        <button type="submit" className="btn btn-gold">
          Verify ID
        </button>
      </form>

      {searched && (
        <div className="slide-up">
          {result ? (
            <div style={{
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid var(--color-success)',
              borderRadius: '8px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>✅</span>
                <h4 style={{ color: 'var(--color-success)', fontSize: '1.1rem' }}>Verifiable Donation Confirmed</h4>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '0.75rem 1.5rem', 
                fontSize: '0.9rem',
                borderTop: '1px solid rgba(34, 197, 94, 0.2)',
                paddingTop: '0.75rem',
                marginTop: '0.25rem'
              }}>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Donor Name</span>
                  <strong>{result.donorName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Units Donated</span>
                  <strong>{result.units} Unit (Whole Blood)</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Donation Date</span>
                  <strong>{formatDate(result.date)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Organization</span>
                  <strong>{result.orgName}</strong>
                </div>
              </div>
              
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'right', marginTop: '0.25rem' }}>
                Verified via India BloodBridge Trust Registry
              </div>
            </div>
          ) : (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid var(--color-danger)',
              borderRadius: '8px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '1.25rem' }}>❌</span>
              <div>
                <h4 style={{ color: 'var(--color-danger)', fontSize: '1rem', marginBottom: '0.15rem' }}>Invalid Certificate ID</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  No donation record found matching ID "{certId}". Please verify the characters and try again.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
