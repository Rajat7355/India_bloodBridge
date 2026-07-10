// src/components/Certificate.jsx
import React from 'react';
import Logo from './Logo';

export default function Certificate({ certificate, onClose }) {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(10, 5, 6, 0.9)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '2rem 1rem',
      overflowY: 'auto'
    }}>
      <div className="glass-panel-gold slide-up" style={{
        maxWidth: '850px',
        width: '100%',
        position: 'relative',
        padding: '2rem',
        margin: '0 auto'
      }}>
        {/* Close Button */}
        <button 
          className="btn btn-secondary" 
          style={{ 
            position: 'absolute', 
            top: '1rem', 
            right: '1rem', 
            padding: '0.4rem 0.8rem',
            fontSize: '0.8rem',
            zIndex: 10
          }}
          onClick={onClose}
        >
          ✕ Close
        </button>
 
        {/* Certificate Container */}
        <div className="certificate-print-area" style={{
          background: '#faf6f0',
          color: '#1a0d0f',
          padding: '2.5rem',
          borderRadius: '8px',
          border: '12px double var(--color-maroon-primary)',
          boxShadow: 'inset 0 0 40px rgba(107, 20, 32, 0.08)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.25rem'
        }}>
          {/* Decorative Corner Ornaments */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', width: '30px', height: '30px', borderLeft: '3px solid var(--color-gold-accent)', borderTop: '3px solid var(--color-gold-accent)' }} />
          <div style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', borderRight: '3px solid var(--color-gold-accent)', borderTop: '3px solid var(--color-gold-accent)' }} />
          <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '30px', height: '30px', borderLeft: '3px solid var(--color-gold-accent)', borderBottom: '3px solid var(--color-gold-accent)' }} />
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '30px', height: '30px', borderRight: '3px solid var(--color-gold-accent)', borderBottom: '3px solid var(--color-gold-accent)' }} />
 
          {/* Logo / Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <Logo size={55} showText={false} />
            <h4 style={{ 
              fontFamily: 'var(--font-display)', 
              fontWeight: 800, 
              color: 'var(--color-maroon-primary)', 
              letterSpacing: '0.1em',
              fontSize: '1rem',
              marginTop: '5px'
            }}>
              INDIA BLOODBRIDGE
            </h4>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8c7877', fontWeight: 600 }}>
              एक चेन, अनगिनत जिंदगियां
            </span>
          </div>
 
          <div style={{ width: '80%', height: '1px', background: 'linear-gradient(to right, transparent, var(--color-gold-accent), transparent)', margin: '0.25rem 0' }} />
 
          {/* Certificate Title */}
          <h1 className="certificate-title" style={{ 
            fontFamily: 'var(--font-display)', 
            fontWeight: 800, 
            fontSize: '2.2rem', 
            color: 'var(--color-maroon-primary)',
            letterSpacing: '0.04em',
            margin: '0.5rem 0'
          }}>
            Certificate of Appreciation
          </h1>
 
          <p style={{ fontSize: '0.95rem', fontStyle: 'italic', color: '#5c4d4d', margin: 0 }}>
            This is proudly presented to
          </p>
 
          <h2 className="certificate-donor-name" style={{ 
            fontFamily: 'var(--font-display)', 
            fontWeight: 700, 
            fontSize: '1.9rem', 
            color: '#1a0d0f', 
            borderBottom: '2px solid #800020',
            paddingBottom: '0.25rem',
            minWidth: '280px',
            margin: 0
          }}>
            {certificate.donorName}
          </h2>
 
          <p style={{ fontSize: '1rem', color: '#3c2c2d', maxWidth: '620px', lineHeight: 1.6, margin: 0 }}>
            for selflessly donating <strong>1 Unit</strong> of life-saving blood at the<br />
            <strong style={{ color: 'var(--color-maroon-primary)' }}>{certificate.campTitle}</strong> organized by<br />
            <strong>{certificate.orgName}</strong> on <strong style={{ textDecoration: 'underline' }}>{formatDate(certificate.date)}</strong>.
          </p>
 
          <p style={{ fontSize: '0.85rem', color: '#5c4d4d', maxWidth: '500px', margin: 0 }}>
            Your noble gesture is instrumental in building a stronger community donation bridge, keeping the referral chain of hope alive, and saving valuable human lives.
          </p>
 
          {/* Signatures & Seal Grid */}
          <div className="certificate-signatures" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            alignItems: 'center', 
            width: '100%', 
            marginTop: '1.5rem',
            gap: '1rem'
          }}>
            {/* Signature 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.1rem', color: '#4a151b' }}>
                Rajeev Sharma
              </span>
              <div style={{ width: '120px', height: '1px', background: '#ccc' }} />
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#7a6b6c', fontWeight: 600 }}>
                Director, India BloodBridge
              </span>
            </div>
 
            {/* Seal */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '75px',
                height: '75px',
                border: '3px double #d4af37',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(212, 175, 55, 0.05)',
                position: 'relative'
              }}>
                <svg width="45" height="45" viewBox="0 0 100 100" fill="none" stroke="#d4af37" strokeWidth="4">
                  <circle cx="36" cy="56" r="14" />
                  <circle cx="64" cy="56" r="14" />
                  <circle cx="50" cy="56" r="14" />
                </svg>
                <div style={{ 
                  position: 'absolute', 
                  fontSize: '0.45rem', 
                  textTransform: 'uppercase', 
                  color: '#d4af37', 
                  fontWeight: 800,
                  width: '100%',
                  textAlign: 'center',
                  top: '12px'
                }}>
                  Official Seal
                </div>
              </div>
            </div>
 
            {/* Signature 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.1rem', color: '#4a151b' }}>
                {certificate.orgName.split(' ')[0]} Head
              </span>
              <div style={{ width: '120px', height: '1px', background: '#ccc' }} />
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#7a6b6c', fontWeight: 600 }}>
                Camp Coordinator
              </span>
            </div>
          </div>
 
          {/* Certificate Verification Code */}
          <div style={{ 
            marginTop: '1.25rem',
            background: 'rgba(107, 20, 32, 0.05)', 
            border: '1px dashed rgba(107, 20, 32, 0.2)',
            borderRadius: '6px',
            padding: '0.4rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8rem'
          }}>
            <span style={{ color: '#666', fontWeight: 500 }}>Certificate Verification ID:</span>
            <strong style={{ color: 'var(--color-maroon-primary)', letterSpacing: '0.05em' }}>{certificate.id}</strong>
          </div>
        </div>
 
        {/* Certificate Export Actions */}
        <div style={{
          marginTop: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close Preview
          </button>
          <button className="btn btn-gold" onClick={handlePrint}>
            🖨️ Print / Download PDF
          </button>
        </div>
      </div>
 
      <style>{`
        @media (max-width: 600px) {
          .certificate-print-area {
            padding: 1.5rem 1rem !important;
            border-width: 6px !important;
            gap: 1rem !important;
          }
          .certificate-title {
            font-size: 1.6rem !important;
          }
          .certificate-donor-name {
            font-size: 1.3rem !important;
            min-width: 100% !important;
          }
          .certificate-signatures {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
