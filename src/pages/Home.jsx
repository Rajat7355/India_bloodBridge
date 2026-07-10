// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import Verification from '../components/Verification';
import { dbService } from '../services/db';
import founderPhoto from '../assets/founder.png';

export default function Home({ currentUser, setActivePage }) {
  const [activeCamps, setActiveCamps] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [contrastMode, setContrastMode] = useState('light-cream');
  const [hoveredBtn, setHoveredBtn] = useState(null);

  // Load active camps
  useEffect(() => {
    const allCamps = dbService.getCamps().filter(c => c.status === 'active');
    setActiveCamps(allCamps);
  }, []);

  // Slide rotation for live camp highlights
  useEffect(() => {
    if (activeCamps.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeCamps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeCamps]);

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % activeCamps.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + activeCamps.length) % activeCamps.length);
  };

  const cardStyles = contrastMode === 'light-cream' ? {
    background: '#FAF6F0',
    color: '#2C1B1D',
    border: '1px solid #E5D5C5',
    boxShadow: '0 10px 30px rgba(44, 27, 29, 0.1)',
    pillBg: '#E8F0FE',
    pillColor: '#1E3A8A',
    pillBorder: '1px solid #D2E3FC',
    titleColor: '#3A1417',
    descColor: '#5C4A4B',
    btnPrimaryBg: '#C23B34',
    btnPrimaryColor: '#FFFFFF',
    btnSecondaryBg: '#FFFFFF',
    btnSecondaryBorder: '2px solid #1E3A8A',
    btnSecondaryColor: '#1E3A8A'
  } : {
    background: 'linear-gradient(135deg, #2D1418 0%, #150A0B 100%)',
    color: '#FCEEE9',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5), var(--shadow-glow-maroon)',
    pillBg: 'rgba(212, 175, 55, 0.1)',
    pillColor: '#d4af37',
    pillBorder: '1px solid rgba(212, 175, 55, 0.3)',
    titleColor: '#FFFFFF',
    descColor: '#C7B4B3',
    btnPrimaryBg: '#d4af37',
    btnPrimaryColor: '#120a0b',
    btnSecondaryBg: 'rgba(255,255,255,0.05)',
    btnSecondaryBorder: '1px solid rgba(255,255,255,0.2)',
    btnSecondaryColor: '#ffffff'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '5rem' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(107, 20, 32, 0.15) 0%, rgba(18, 10, 11, 0) 100%)',
        padding: '5rem 2rem 4rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <Logo size={140} showText={true} textVertical={true} />
        
        {/* Hindi Motivational Card with Background Contrast Switch */}
        <div style={{
          maxWidth: '850px',
          width: '100%',
          marginTop: '1.5rem',
          padding: '2.5rem 2.5rem 3rem 2.5rem',
          borderRadius: '16px',
          background: cardStyles.background,
          border: cardStyles.border,
          boxShadow: cardStyles.boxShadow,
          textAlign: 'left',
          position: 'relative',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* Contrast Mode Toggle Switch */}
          <div style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: contrastMode === 'light-cream' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            color: cardStyles.descColor,
            border: cardStyles.pillBorder
          }}>
            <span style={{ fontSize: '0.75rem' }}>Contrast background:</span>
            <button 
              type="button"
              onClick={() => setContrastMode(prev => prev === 'light-cream' ? 'dark-glow' : 'light-cream')}
              style={{
                padding: '0.25rem 0.6rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                border: 'none',
                background: contrastMode === 'light-cream' ? '#120a0b' : '#FAF6F0',
                color: contrastMode === 'light-cream' ? '#ffffff' : '#120a0b',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }}
            >
              {contrastMode === 'light-cream' ? 'Dark Glow' : 'Light Cream'}
            </button>
          </div>

          {/* Pill Badge */}
          <div style={{ marginTop: '0.5rem' }}>
            <span style={{
              display: 'inline-block',
              background: cardStyles.pillBg,
              color: cardStyles.pillColor,
              border: cardStyles.pillBorder,
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.3s ease'
            }}>
              🇮🇳 भारत का पहला ब्लड डोनेशन चेन नेटवर्क
            </span>
          </div>

          {/* Motivational Headline */}
          <h1 style={{
            fontSize: '2.4rem',
            color: cardStyles.titleColor,
            fontWeight: '800',
            lineHeight: '1.3',
            fontFamily: 'var(--font-display)',
            margin: 0,
            transition: 'color 0.3s ease'
          }}>
            हर बूंद एक <span style={{ color: '#C23B34', fontWeight: '800', borderBottom: '2.5px solid #C23B34', paddingBottom: '2px' }}>चेन</span> बनाती है,<br />
            हर चेन एक जान बचाती है
          </h1>

          {/* Description Paragraph */}
          <p style={{
            fontSize: '1.05rem',
            color: cardStyles.descColor,
            lineHeight: '1.75',
            margin: 0,
            transition: 'color 0.3s ease',
            maxWidth: '760px'
          }}>
            India BloodBridge रजिस्टर्ड संस्थाओं के ब्लड डोनेशन कैंप को आपके पास लाता है — लोकेशन से खोजें, डोनेट करें, तुरंत डिजिटल सर्टिफिकेट पाएं, और अपने रेफरल से एक बढ़ती हुई चेन बनाएं जो इमरजेंसी में काम आए।
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            {!currentUser ? (
              <>
                <button 
                  onClick={() => setActivePage('register-org')}
                  onMouseEnter={() => setHoveredBtn('org')}
                  onMouseLeave={() => setHoveredBtn(null)}
                  style={{ 
                    background: cardStyles.btnPrimaryBg, 
                    color: cardStyles.btnPrimaryColor,
                    border: 'none',
                    fontWeight: '700',
                    padding: '0.85rem 1.75rem',
                    fontSize: '0.95rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: contrastMode === 'light-cream' ? '0 4px 12px rgba(194, 59, 52, 0.25)' : '0 0 15px rgba(212, 175, 55, 0.2)',
                    transform: hoveredBtn === 'org' ? 'translateY(-2px)' : 'translateY(0)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  संस्था रजिस्ट्रेशन शुरू करें
                </button>
                <button 
                  onClick={() => setActivePage('register-donor')}
                  onMouseEnter={() => setHoveredBtn('donor')}
                  onMouseLeave={() => setHoveredBtn(null)}
                  style={{ 
                    background: hoveredBtn === 'donor' ? (contrastMode === 'light-cream' ? '#f0eae1' : 'rgba(255, 255, 255, 0.1)') : cardStyles.btnSecondaryBg, 
                    border: cardStyles.btnSecondaryBorder, 
                    color: cardStyles.btnSecondaryColor,
                    fontWeight: '700',
                    padding: '0.85rem 1.75rem',
                    fontSize: '0.95rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transform: hoveredBtn === 'donor' ? 'translateY(-2px)' : 'translateY(0)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  डोनर बनें
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  if (currentUser.role === 'admin') setActivePage('admin');
                  else if (currentUser.role === 'org') setActivePage('org-dashboard');
                  else setActivePage('donor-dashboard');
                }}
                onMouseEnter={() => setHoveredBtn('dash')}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{ 
                  background: cardStyles.btnPrimaryBg, 
                  color: cardStyles.btnPrimaryColor,
                  border: 'none',
                  fontWeight: '700',
                  padding: '0.85rem 1.75rem',
                  fontSize: '0.95rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transform: hoveredBtn === 'dash' ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                ⚙️ डैशबोर्ड पर जाएं (Go to Dashboard)
              </button>
            )}
            <button 
              onClick={() => setActivePage('camps')}
              onMouseEnter={() => setHoveredBtn('search')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{ 
                background: 'transparent', 
                border: hoveredBtn === 'search' ? `1.5px solid ${cardStyles.titleColor}` : cardStyles.btnSecondaryBorder,
                color: hoveredBtn === 'search' ? cardStyles.titleColor : cardStyles.descColor,
                fontWeight: '700',
                padding: '0.85rem 1.75rem',
                fontSize: '0.95rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transform: hoveredBtn === 'search' ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              🔍 कैंप खोजें (Search Camps)
            </button>
          </div>
        </div>
      </section>

      {/* 2. LIVE CAMP HIGHLIGHTS CAROUSEL */}
      {activeCamps.length > 0 && (
        <section style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span className="badge badge-verified" style={{ marginBottom: '0.5rem' }}>Live Feed</span>
            <h2 style={{ fontSize: '1.8rem', color: '#ffffff' }}>Active Donation Camps</h2>
          </div>

          <div className="glass-panel-maroon pulse-glow-card" style={{
            position: 'relative',
            padding: '2.5rem',
            overflow: 'hidden',
            minHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1rem'
          }}>
            {/* Carousel Controls */}
            {activeCamps.length > 1 && (
              <>
                <button 
                  onClick={handlePrevSlide}
                  style={{
                    position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', 
                    width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  ‹
                </button>
                <button 
                  onClick={handleNextSlide}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', 
                    width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  ›
                </button>
              </>
            )}

            {/* Camp Slide content */}
            <div className="slide-up" key={currentSlide} style={{ width: '85%' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <span className="badge badge-verified">✓ Verified Org</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gold-accent)' }}>• {activeCamps[currentSlide].city}</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.5rem' }}>{activeCamps[currentSlide].title}</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                Host: <strong>{activeCamps[currentSlide].orgName}</strong>
              </p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                📍 {activeCamps[currentSlide].locationName} | 📅 {activeCamps[currentSlide].date}
              </p>
            </div>
            
            {/* Dots */}
            {activeCamps.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {activeCamps.map((_, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: idx === currentSlide ? 'var(--color-gold-accent)' : 'rgba(255,255,255,0.2)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. HOW IT WORKS GRID */}
      <section style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '0 1.5rem' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2.5rem', color: '#ffffff' }}>
          Building the Bridge of Life
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="how-it-works-grid">
          {/* Donors Box */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ color: 'var(--color-gold-accent)', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🩸 For Individual Donors
            </h3>
            <ul style={{ color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1.25rem' }}>
              <li><strong>Discover Nearby Camps:</strong> Search verified blood drives on an interactive map.</li>
              <li><strong>Secure Certificates:</strong> Claim unique, verifiable certificates immediately after donation.</li>
              <li><strong>Medical Gap Lockout:</strong> Enforces standard 3-month waits to protect donor health.</li>
              <li><strong>Earn Reward Points:</strong> Get 5 points for donating. Save points to request premium emergency priority.</li>
            </ul>
            <button className="btn btn-secondary" style={{ marginTop: 'auto' }} onClick={() => setActivePage('camps')}>
              Find Camps Near Me
            </button>
          </div>

          {/* Organizations Box */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ color: 'var(--color-gold-accent)', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🏥 For Blood Banks & NGOs
            </h3>
            <ul style={{ color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1.25rem' }}>
              <li><strong>Legal Registration:</strong> Upload registration documentation for Admin verification.</li>
              <li><strong>Create Camps:</strong> Pin locations on the map, set timings, and list blood needs.</li>
              <li><strong>Confirm Visits:</strong> Review registered donors at camp and mark donations to issue instant credentials.</li>
              <li><strong>Verified Badge:</strong> Earn the "Verified by BloodBridge" status to build trust with donors.</li>
            </ul>
            <button className="btn btn-secondary" style={{ marginTop: 'auto' }} onClick={() => setActivePage('register-choice')}>
              Register Organization
            </button>
          </div>
        </div>
      </section>

      {/* 4. POINTS & REFERRAL SYSTEM EXPLAINER */}
      <section style={{
        background: 'rgba(107, 20, 32, 0.1)',
        borderY: '1px solid rgba(107, 20, 32, 0.2)',
        padding: '4rem 2rem'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              The Referral Chain Rules
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Growing a reliable blood network through mutual reward.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }} className="points-cards-grid">
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '2rem' }}>🎁</div>
              <h4 style={{ color: 'var(--color-gold-accent)' }}>+5 Points / Donation</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Every confirmed unit donated adds 5 points. Wait 3 months before you can donate again.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '2rem' }}>🔗</div>
              <h4 style={{ color: 'var(--color-gold-accent)' }}>+2 Points / Referral</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Bring friends using your referral code. Once they complete a donation, you earn 2 bonus points.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '2rem' }}>🚨</div>
              <h4 style={{ color: 'var(--color-gold-accent)' }}>20 Points Priority Redemption</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Redeem 20 points during family emergency requests to prioritize your matching profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFICATION SYSTEM SECTION */}
      <section style={{ maxWidth: '750px', width: '100%', margin: '0 auto', padding: '0 1.5rem' }}>
        <Verification />
      </section>

      {/* 6. FOUNDER & ABOUT SECTION */}
      <section style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* About Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.2fr', gap: '3rem', alignItems: 'center' }} className="about-grid">
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '160px', 
              height: '160px', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              border: '4px solid var(--color-gold-accent)',
              margin: '0 auto 1rem auto',
              background: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
              boxShadow: 'var(--shadow-glow-gold)'
            }}>
              🇮🇳
            </div>
            <h4 style={{ fontSize: '1.25rem', color: '#ffffff', fontFamily: 'var(--font-display)' }}>Our Mission</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-gold-accent)', fontWeight: 600 }}>Cooperative Trust</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '2rem', color: '#ffffff' }}>About India BloodBridge</h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              India BloodBridge was conceived to address the severe fragmented nature of voluntary blood donations across India. Instead of relying on unverified broadcasts or rushing to hospital basements in emergencies, we build a bridge of absolute trust.
            </p>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              By verifying clinical organizations, tracking precise medical gap intervals, and rewarding cooperative social chains, we make sure that blood donation is sustainable, secure, and rewarding.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(107, 20, 32, 0.4), transparent)' }} />

        {/* Founder Card Section */}
        <div className="glass-panel-maroon pulse-glow-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ color: 'var(--color-gold-accent)', fontSize: '1.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            👨‍💻 Founder's Note & Profile
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 3fr', gap: '2.5rem', alignItems: 'start' }} className="founder-card-grid">
            
            {/* Left: Founder Photo & Links */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '1.5rem', 
              textAlign: 'center'
            }}>
              <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid var(--color-gold-accent)',
                boxShadow: 'var(--shadow-glow-gold)',
                background: 'rgba(0,0,0,0.2)'
              }}>
                <img 
                  src={founderPhoto} 
                  alt="Rajat Keshari" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
                <h4 style={{ color: '#ffffff', fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Rajat Keshari</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                  Creator & Full-Stack Developer
                </span>
                <a href="mailto:60rajatkeshri@gmail.com" style={{ fontSize: '0.8rem', color: 'var(--color-gold-accent)', textDecoration: 'none', margin: 0 }} className="social-link">
                  ✉️ 60rajatkeshri@gmail.com
                </a>
              </div>

              {/* Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem', width: '100%', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.85rem' }}>
                  <a href="https://rajat-porfile.netlify.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold-accent)', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', fontWeight: 500 }} className="social-link">
                    Portfolio
                  </a>
                  <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                  <a href="https://www.linkedin.com/in/rajat-kumar-keshari-201524218/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold-accent)', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', fontWeight: 500 }} className="social-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>
                  <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                  <a href="https://github.com/samm-developer" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold-accent)', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', fontWeight: 500 }} className="social-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                </div>
                <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.85rem' }}>
                  <a href="https://www.facebook.com/share/1DBFwr417f/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold-accent)', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', fontWeight: 500 }} className="social-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                    Facebook
                  </a>
                  <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                  <a href="https://www.instagram.com/kesharirajatkumar?igsh=MTRjaGFrbTdiZjlsdw==" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold-accent)', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', fontWeight: 500 }} className="social-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </a>
                  <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                  <a href="https://wa.me/917355904515" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold-accent)', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', fontWeight: 500 }} className="social-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.637-1.03-5.115-2.903-6.989-1.873-1.873-4.36-2.903-6.996-2.904-5.44 0-9.866 4.42-9.869 9.865-.001 1.8.486 3.553 1.412 5.158l-.993 3.626 3.71-.973zm11.314-7.447c-.29-.145-1.719-.848-1.984-.944-.266-.097-.46-.145-.653.145-.193.29-.747.944-.916 1.137-.168.193-.337.218-.627.073-.29-.145-1.226-.452-2.335-1.442-.864-.771-1.447-1.724-1.616-2.014-.169-.29-.018-.447.127-.591.131-.13.29-.338.435-.507.145-.169.193-.29.29-.483.097-.193.048-.363-.024-.507-.072-.145-.653-1.573-.895-2.152-.236-.569-.497-.49-.653-.498-.157-.008-.337-.01-.518-.01-.18 0-.476.068-.724.338-.249.271-.95.928-.95 2.264 0 1.337.973 2.628 1.108 2.81.135.18 1.916 2.926 4.641 4.103.648.28 1.153.448 1.547.573.651.207 1.243.178 1.711.108.522-.078 1.719-.702 1.961-1.381.242-.678.242-1.26.169-1.381-.073-.12-.27-.193-.56-.338z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Details & Narrative */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Chips / Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: 'var(--color-gold-accent)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontWeight: 600 }}>
                  🎓 M.Tech (CS) — NIT Jalandhar (Present)
                </span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: 'var(--color-gold-accent)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontWeight: 600 }}>
                  🎓 B.Tech (CS) — B.I.E.T Jhansi
                </span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(107,20,32,0.2)', border: '1px solid rgba(107,20,32,0.3)', color: '#ffd700', padding: '0.35rem 0.75rem', borderRadius: '6px', fontWeight: 600 }}>
                  💼 25+ Projects Hosted for Multiple Organizations
                </span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(107,20,32,0.2)', border: '1px solid rgba(107,20,32,0.3)', color: '#ffd700', padding: '0.35rem 0.75rem', borderRadius: '6px', fontWeight: 600 }}>
                  🚀 Experienced Freelance Full-Stack Engineer
                </span>
              </div>

              {/* Divider */}
              <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, rgba(255,255,255,0.06), transparent)' }} />

              {/* Narrative Bio */}
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '720px' }}>
                <p style={{ margin: 0 }}>
                  As an experienced freelance full-stack software engineer, I have successfully designed, built, and hosted over <strong>25+ web applications and custom software systems</strong> for multiple organizations. My expertise spans creating database-driven platforms, designing robust backend server architectures, and crafting responsive user interfaces that solve real-world problems.
                </p>
                
                <p style={{ margin: 0 }}>
                  Deploying and scaling production systems for clients has taught me the absolute importance of transactional reliability and data validation. I built <strong>India BloodBridge</strong> using these same professional industry standards to streamline peer-to-peer blood donation coordination, implementing rigid gap-validation logic for donation eligibility and optimizing emergency match sorting algorithms.
                </p>
              </div>

              {/* Divider */}
              <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, rgba(255,255,255,0.06), transparent)' }} />

              {/* Pull-quote */}
              <div style={{ 
                fontStyle: 'italic', 
                borderLeft: '4px solid var(--color-gold-accent)', 
                padding: '0.75rem 1.25rem', 
                color: 'var(--color-text-primary)',
                background: 'rgba(212, 175, 55, 0.02)',
                borderRadius: '0 8px 8px 0',
                maxWidth: '720px',
                lineHeight: 1.6,
                margin: 0
              }}>
                "By connecting verified medical organizations with individual donors through robust transactional code, we can replace chaotic panic broadcasts with a network of cooperative, structured hope."
              </div>

            </div>

          </div>
        </div>

      </section>

      <style>{`
        .social-link {
          transition: all 0.2s ease-in-out;
        }
        .social-link:hover {
          color: var(--color-gold-hover) !important;
          text-decoration: underline !important;
          transform: translateY(-1.5px);
        }
        @media (max-width: 768px) {
          .how-it-works-grid, .points-cards-grid, .about-grid, .founder-card-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>

    </div>
  );
}
