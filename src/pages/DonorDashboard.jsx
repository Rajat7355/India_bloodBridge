// src/pages/DonorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import Certificate from '../components/Certificate';

export default function DonorDashboard({ currentUser, onUpdateUser, setActivePage }) {
  const [dbUser, setDbUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  // Reload donor stats and related details
  useEffect(() => {
    if (!currentUser) return;
    const loadDonorData = async () => {
      try {
        const user = await dbService.getUser(currentUser.id);
        setDbUser(user);
        
        // Get certificates
        const certs = await dbService.getCertificatesForDonor(currentUser.id);
        setCertificates(certs);

        // Get referral chain
        const chain = await dbService.getReferralChain(currentUser.id);
        setReferrals(chain);

        // Get active registrations
        const allCamps = await dbService.getCamps();
        const userCamps = allCamps.filter(camp => 
          camp.registeredDonors.some(d => d.donorId === currentUser.id)
        );
        setRegistrations(userCamps);
      } catch (err) {
        console.error("Failed to load donor dashboard data", err);
      }
    };
    loadDonorData();
  }, [currentUser]);

  if (!dbUser) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Donor Dashboard...</div>;
  }

  // Calculate eligibility
  const checkEligibility = () => {
    if (!dbUser.lastDonationDate) return { eligible: true, message: 'You are eligible to donate!' };
    
    const lastDon = new Date(dbUser.lastDonationDate);
    const nextEligible = new Date(lastDon);
    nextEligible.setMonth(nextEligible.getMonth() + 3);
    
    const today = new Date();
    const diffTime = nextEligible - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (today >= nextEligible) {
      return { eligible: true, message: 'You are eligible to donate!' };
    } else {
      return { 
        eligible: false, 
        message: `Ineligible. Wait period ends in ${diffDays} days.`,
        dateStr: nextEligible.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
        daysLeft: diffDays
      };
    }
  };

  const eligibility = checkEligibility();

  const handleCopyCode = () => {
    const referralLink = `${window.location.origin}?ref=${dbUser.referralCode}`;
    navigator.clipboard.writeText(dbUser.referralCode);
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1.5rem 0' }}>
      
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '2rem', color: '#ffffff' }}>Donor Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Welcome back, {dbUser.name}. Thank you for being a part of the network.</p>
      </div>

      {/* Stats Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }} className="donor-stats-row">
        {/* Points Balance Card */}
        <div className="glass-panel-gold" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem' }}>🏆</span>
          <h3 style={{ color: 'var(--color-gold-accent)', fontSize: '1.8rem' }}>{dbUser.points} Points</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Each donation earns 5 points. Referrals earn 2. Redeem 20 points for emergency priority matching.
          </p>
        </div>

        {/* Eligibility Card */}
        <div className={`glass-panel ${eligibility.eligible ? 'glass-panel-maroon' : ''}`} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '0.5rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            background: eligibility.eligible ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `2px solid ${eligibility.eligible ? 'var(--color-success)' : 'var(--color-danger)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            {eligibility.eligible ? '🩸' : '⏳'}
          </div>
          <h3 style={{ color: '#ffffff', fontSize: '1.15rem' }}>Donation Eligibility</h3>
          <p style={{ fontSize: '0.85rem', color: eligibility.eligible ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
            {eligibility.message}
          </p>
          {!eligibility.eligible && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Eligible on: {eligibility.dateStr}
            </span>
          )}
        </div>

        {/* Referral Code Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>🔗</span>
          <h3 style={{ color: '#ffffff', fontSize: '1.15rem' }}>Your Referral Code</h3>
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '200px', marginTop: '0.25rem' }}>
            <input 
              type="text" 
              className="form-input" 
              readOnly 
              value={dbUser.referralCode}
              style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px', background: 'rgba(0,0,0,0.2)', padding: '0.4rem' }}
            />
            <button className="btn btn-gold" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={handleCopyCode}>
              {copySuccess || 'Copy'}
            </button>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            Earn 2 bonus points when friends register with your code and complete their first donation.
          </span>
        </div>
      </div>

      {/* Active Camp Registrations / Upcoming Donations */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(212, 175, 55, 0.25)', boxShadow: 'var(--shadow-glow-gold)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🗓️ Your Upcoming Blood Donations (रक्तदान पंजीकरण)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.15rem' }}>
              Camps you are currently registered to attend. Visit the location on the specified date to donate.
            </p>
          </div>
          <span className="badge badge-verified" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--color-gold-accent)', border: '1px solid rgba(212,175,55,0.3)' }}>
            {registrations.length} Slots Booked
          </span>
        </div>

        {registrations.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {registrations.map(camp => {
                const userReg = camp.registeredDonors.find(d => d.donorId === currentUser.id);
                const isDonated = userReg?.status === 'donated';
                
                return (
                  <div 
                    key={camp.id} 
                    className={isDonated ? "glass-panel-maroon" : "glass-panel"} 
                    style={{ 
                      padding: '1.25rem', 
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      borderLeft: isDonated ? '4px solid var(--color-success)' : '4px solid var(--color-gold-accent)'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>{camp.title}</h3>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        🏥 Host: <strong>{camp.orgName}</strong>
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        📍 Location: {camp.locationName} ({camp.city})
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', textAlign: 'right' }}>
                      <span className="badge" style={{ 
                        background: isDonated ? 'rgba(34, 197, 94, 0.1)' : 'rgba(212, 175, 55, 0.1)', 
                        color: isDonated ? 'var(--color-success)' : 'var(--color-gold-accent)', 
                        border: `1px solid ${isDonated ? 'var(--color-success)' : 'var(--color-gold-accent)'}`,
                        fontSize: '0.7rem'
                      }}>
                        {isDonated ? '✅ Donated & Confirmed' : '⏳ Awaiting Camp Visit'}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>
                        📅 {camp.date} | ⏰ {camp.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step-by-Step Info Box */}
            <div style={{ 
              background: 'rgba(212, 175, 55, 0.05)', 
              border: '1px solid rgba(212, 175, 55, 0.25)', 
              borderRadius: '8px', 
              padding: '1.25rem', 
              fontSize: '0.88rem', 
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6
            }}>
              💡 <strong>हाउ टू डोनेट (Donation instructions):</strong><br />
              1. Visit the camp location on the scheduled date and time.<br />
              2. Give your name/contact at the registration desk.<br />
              3. After donating, **the camp coordinator (NGO) will confirm your visit on their dashboard.**<br />
              4. Once confirmed, you will instantly earn **+5 points** and your digital certificate will appear below!
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.08)' }}>
            🔔 You are not registered for any upcoming camps. 
            <button 
              onClick={() => setActivePage('camps')}
              style={{ background: 'none', border: 'none', color: 'var(--color-gold-accent)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', marginLeft: '0.35rem', padding: 0 }}
            >
              Browse & Register for a Camp
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Certificates and Referral Tree */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="donor-dashboard-grid">
        
        {/* Left Side: Certificates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>Your Donation Certificates</h2>
          
          {certificates.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="cert-grid">
              {certificates.map((cert) => (
                <div 
                  key={cert.id}
                  className="glass-panel-maroon"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedCertificate(cert)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.5rem' }}>📜</span>
                    <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>Verified</span>
                  </div>
                  <div>
                    <h4 style={{ color: '#ffffff', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cert.campTitle}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Host: {cert.orgName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    <span>📅 {cert.date}</span>
                    <span style={{ color: 'var(--color-gold-accent)', fontWeight: 600 }}>Inspect ➔</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>📭</span>
              <p>You haven't completed any blood donations yet.</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setActivePage('camps')}>
                Find a Donation Camp
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Referral Chain Tree */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>Your Referral Chain</h2>
          
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Total Friends Invited:</span>
              <strong style={{ color: 'var(--color-gold-accent)', fontSize: '1.1rem' }}>{referrals.length}</strong>
            </div>

            {referrals.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Invited Friends Status
                </span>
                
                {/* Visual Referral Tree Nodes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {referrals.map((ref) => (
                    <div 
                      key={ref.referredId}
                      style={{
                        background: 'rgba(0,0,0,0.15)',
                        border: ref.status === 'completed' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: ref.status === 'completed' ? 'var(--color-success)' : 'var(--color-warning)'
                        }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{ref.referredName}</span>
                      </div>
                      
                      <div>
                        {ref.status === 'completed' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.1rem' }}>
                            <span className="badge" style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-success)', fontSize: '0.65rem', border: '1px solid var(--color-success)' }}>Donated</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--color-gold-accent)' }}>+2 pts earned</span>
                          </div>
                        ) : (
                          <span className="badge" style={{ background: 'rgba(234, 179, 8, 0.1)', color: 'var(--color-warning)', fontSize: '0.65rem', border: '1px solid var(--color-warning)' }}>Pending Donation</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                No referrals yet. Share your code to start growing your chain!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Certificate Modal Overlay */}
      {selectedCertificate && (
        <Certificate 
          certificate={selectedCertificate} 
          onClose={() => setSelectedCertificate(null)} 
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .donor-stats-row, .donor-dashboard-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .cert-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
