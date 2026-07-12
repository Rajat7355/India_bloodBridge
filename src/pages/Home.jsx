// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import Verification from '../components/Verification';
import { dbService } from '../services/db';
import founderPhoto from '../assets/founder.png';

export default function Home({ currentUser, setActivePage }) {
  const [activeCamps, setActiveCamps] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const allCamps = await dbService.getCamps();
        setActiveCamps(allCamps.filter(c => c.status === 'active'));
      } catch (err) {
        console.error('Failed to fetch active camps', err);
      }
    };
    fetchCamps();
  }, []);

  useEffect(() => {
    if (activeCamps.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeCamps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeCamps]);

  const goDashboard = () => {
    if (!currentUser) {
      setActivePage('register-donor');
      return;
    }
    if (currentUser.role === 'admin') setActivePage('admin');
    else if (currentUser.role === 'org') setActivePage('org-dashboard');
    else setActivePage('donor-dashboard');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingBottom: '4rem' }}>

      {/* HERO — falling blood drops + motivation card (screenshot layout) */}
      <section
        className="full-bleed"
        style={{
          position: 'relative',
          minHeight: 'min(92vh, 900px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '3rem 1.5rem 4rem',
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(194,59,52,0.22) 0%, transparent 55%),' +
            'linear-gradient(180deg, #12080a 0%, #0a0506 100%)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, marginBottom: '1.75rem' }}>
          <Logo size={100} showText textVertical dropFromTop />
        </div>

        <div className="hero-motivation-card hero-animate-delay">
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="hero-motivation-badge">
              🇮🇳 भारत का पहला ब्लड डोनेशन चेन नेटवर्क
            </span>
          </div>

          <h1 className="hero-motivation-title" style={{ marginBottom: '1.25rem' }}>
            हर बूंद एक <span className="highlight-chain">चेन</span> बनाती है,<br />
            हर चेन एक जान बचाती है
          </h1>

          <p className="hero-motivation-desc" style={{ marginBottom: '1.75rem' }}>
            India BloodBridge रजिस्टर्ड संस्थाओं के ब्लड डोनेशन कैंप को आपके पास लाता है — लोकेशन से खोजें, डोनेट करें, तुरंत डिजिटल सर्टिफिकेट पाएं, और अपने रेफरल से एक बढ़ती हुई चेन बनाएं जो इमरजेंसी में काम आए।
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {!currentUser ? (
              <>
                <button
                  type="button"
                  className="hero-btn-org"
                  onClick={() => setActivePage('register-org')}
                  onMouseEnter={() => setHoveredBtn('org')}
                  onMouseLeave={() => setHoveredBtn(null)}
                  style={{ transform: hoveredBtn === 'org' ? 'translateY(-2px)' : 'none' }}
                >
                  संस्था रजिस्ट्रेशन शुरू करें
                </button>
                <button
                  type="button"
                  className="hero-btn-donor"
                  onClick={() => setActivePage('register-donor')}
                  onMouseEnter={() => setHoveredBtn('donor')}
                  onMouseLeave={() => setHoveredBtn(null)}
                  style={{ transform: hoveredBtn === 'donor' ? 'translateY(-2px)' : 'none' }}
                >
                  डोनर बनें
                </button>
              </>
            ) : (
              <button
                type="button"
                className="hero-btn-org"
                onClick={goDashboard}
              >
                ⚙️ डैशबोर्ड पर जाएं (Go to Dashboard)
              </button>
            )}
            <button
              type="button"
              className="hero-btn-donor"
              onClick={() => setActivePage('camps')}
              onMouseEnter={() => setHoveredBtn('search')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                transform: hoveredBtn === 'search' ? 'translateY(-2px)' : 'none'
              }}
            >
              🔍 कैंप खोजें (Search Camps)
            </button>
          </div>
        </div>
      </section>

      {/* Live camps */}
      {activeCamps.length > 0 && (
        <section className="page-shell" style={{ paddingTop: '3.5rem', paddingBottom: '1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span className="badge badge-verified" style={{ marginBottom: '0.5rem' }}>Live Feed</span>
            <h2 style={{ fontSize: '1.85rem', color: '#ffffff', marginTop: '0.5rem' }}>Active Donation Camps</h2>
          </div>

          <div
            className="glass-panel-maroon pulse-glow-card"
            style={{
              position: 'relative',
              padding: '2.25rem',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              gap: '0.75rem',
              maxWidth: 780,
              margin: '0 auto'
            }}
          >
            {activeCamps.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous camp"
                  onClick={() => setCurrentSlide(p => (p - 1 + activeCamps.length) % activeCamps.length)}
                  style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem'
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next camp"
                  onClick={() => setCurrentSlide(p => (p + 1) % activeCamps.length)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem'
                  }}
                >
                  ›
                </button>
              </>
            )}

            <div className="slide-up" key={currentSlide} style={{ width: '85%' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <span className="badge badge-verified">Verified Org</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gold-accent)' }}>· {activeCamps[currentSlide].city}</span>
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.4rem' }}>{activeCamps[currentSlide].title}</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                Host: <strong>{activeCamps[currentSlide].orgName}</strong>
              </p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {activeCamps[currentSlide].locationName} · {activeCamps[currentSlide].date}
              </p>
            </div>

            {activeCamps.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                {activeCamps.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      width: 8, height: 8, borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer',
                      background: idx === currentSlide ? 'var(--color-gold-accent)' : 'rgba(255,255,255,0.2)'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Workflow */}
      <section className="page-shell" style={{ paddingTop: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
          <span className="badge badge-verified">How it works</span>
          <h2 style={{ fontSize: '2rem', color: '#ffffff', margin: '0.6rem 0 0.5rem' }}>Four steps to donate</h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: 520, margin: '0 auto', fontSize: '0.95rem' }}>
            Register, book a camp, donate, and receive a verifiable digital certificate with reward points.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }} className="stepper-grid">
          {[
            { n: 1, title: 'Donor profile', body: 'Sign up with blood type and city. Get your personal referral code.' },
            { n: 2, title: 'Book a camp', body: 'Search verified drives nearby and reserve your donation slot.' },
            { n: 3, title: 'Donate & confirm', body: 'Visit the camp. The org confirms donation on their dashboard.' },
            { n: 4, title: 'Certificate', body: 'Earn 5 points and download your digital certificate instantly.' }
          ].map((step) => (
            <div
              key={step.n}
              className={step.n % 2 === 0 ? 'glass-panel-gold' : 'glass-panel-maroon'}
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                position: 'relative',
                borderTop: `3px solid ${step.n % 2 === 0 ? 'var(--color-gold-accent)' : 'var(--color-maroon-primary)'}`,
                minHeight: 180
              }}
            >
              <div
                style={{
                  position: 'absolute', top: -14, left: '1.25rem', width: 28, height: 28,
                  borderRadius: '50%',
                  background: step.n % 2 === 0 ? 'var(--color-gold-accent)' : 'var(--color-maroon-primary)',
                  color: step.n % 2 === 0 ? 'var(--color-maroon-dark)' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem'
                }}
              >
                {step.n}
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 700, marginTop: '0.85rem' }}>{step.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Audiences */}
      <section className="page-shell" style={{ paddingTop: '4rem' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem', color: '#ffffff' }}>
          Building the Bridge of Life
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="how-it-works-grid">
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ color: 'var(--color-gold-accent)', fontSize: '1.3rem' }}>For donors</h3>
            <ul style={{ color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingLeft: '1.15rem' }}>
              <li>Discover verified camps on an interactive map</li>
              <li>Claim digital certificates after each donation</li>
              <li>3-month medical gap protects your health</li>
              <li>Earn points — redeem for emergency priority</li>
            </ul>
            <button type="button" className="btn btn-secondary" style={{ marginTop: 'auto' }} onClick={() => setActivePage('camps')}>
              Find Camps Near Me
            </button>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ color: 'var(--color-gold-accent)', fontSize: '1.3rem' }}>For blood banks & NGOs</h3>
            <ul style={{ color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingLeft: '1.15rem' }}>
              <li>Upload registration docs for admin verification</li>
              <li>Create camps with location, timing, and blood needs</li>
              <li>Confirm donors and issue certificates in one click</li>
              <li>Earn the Verified by BloodBridge badge</li>
            </ul>
            <button type="button" className="btn btn-secondary" style={{ marginTop: 'auto' }} onClick={() => setActivePage('register-choice')}>
              Register Organization
            </button>
          </div>
        </div>
      </section>

      {/* Points */}
      <section
        className="full-bleed"
        style={{
          marginTop: '4rem',
          padding: '3.5rem 1.5rem',
          background: 'linear-gradient(180deg, rgba(142,31,47,0.12), transparent)'
        }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.4rem' }}>Referral chain rules</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Grow a reliable network through mutual reward.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }} className="points-cards-grid">
            {[
              { t: '+5 / donation', d: 'Every confirmed unit adds 5 points. Wait 3 months before donating again.' },
              { t: '+2 / referral', d: 'When someone you referred completes a donation, you earn 2 bonus points.' },
              { t: '20 pts priority', d: 'Redeem 20 points on emergency requests for priority matching.' }
            ].map((item) => (
              <div key={item.t} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--color-gold-accent)', marginBottom: '0.5rem' }}>{item.t}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell" style={{ paddingTop: '3rem', maxWidth: 750 }}>
        <Verification />
      </section>

      {/* About + founder */}
      <section className="page-shell" style={{ paddingTop: '3.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.2fr', gap: '2.5rem', alignItems: 'center' }} className="about-grid">
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 140, height: 140, borderRadius: '50%', margin: '0 auto 1rem',
                border: '3px solid var(--color-gold-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(194,59,52,0.15)', fontSize: '3rem',
                boxShadow: 'var(--shadow-glow-gold)'
              }}
            >
              <span aria-hidden>🩸</span>
            </div>
            <h4 style={{ fontSize: '1.2rem', color: '#ffffff', fontFamily: 'var(--font-display)' }}>Our Mission</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-gold-accent)', fontWeight: 600 }}>Cooperative Trust</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h2 style={{ fontSize: '1.9rem', color: '#ffffff' }}>About India BloodBridge</h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.65, fontSize: '0.95rem' }}>
              India BloodBridge connects verified clinical organizations with individual donors — replacing panic broadcasts with structured, trustworthy coordination across cities.
            </p>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.65, fontSize: '0.95rem' }}>
              Medical gap intervals, referral rewards, and instant certificates keep voluntary donation sustainable and secure.
            </p>
          </div>
        </div>

        <div className="glass-panel-maroon" style={{ padding: '2.25rem' }}>
          <h3 style={{ color: 'var(--color-gold-accent)', fontSize: '1.4rem', fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>
            Founder
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 3fr', gap: '2rem', alignItems: 'start' }} className="founder-card-grid">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
              <div
                style={{
                  width: 150, height: 150, borderRadius: '50%', overflow: 'hidden',
                  border: '3px solid var(--color-gold-accent)', boxShadow: 'var(--shadow-glow-gold)'
                }}
              >
                <img src={founderPhoto} alt="Rajat Keshari" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '1.2rem', margin: 0 }}>Rajat Keshari</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Creator & Full-Stack Developer
                </span>
              </div>
              <a href="mailto:60rajatkeshri@gmail.com" style={{ fontSize: '0.8rem', color: 'var(--color-gold-accent)', textDecoration: 'none' }} className="social-link">
                60rajatkeshri@gmail.com
              </a>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.85rem' }}>
                <a href="https://rajat-porfile.netlify.app" target="_blank" rel="noopener noreferrer" className="social-link" style={{ color: 'var(--color-gold-accent)', textDecoration: 'none' }}>Portfolio</a>
                <a href="https://www.linkedin.com/in/rajat-kumar-keshari-201524218/" target="_blank" rel="noopener noreferrer" className="social-link" style={{ color: 'var(--color-gold-accent)', textDecoration: 'none' }}>LinkedIn</a>
                <a href="https://github.com/samm-developer" target="_blank" rel="noopener noreferrer" className="social-link" style={{ color: 'var(--color-gold-accent)', textDecoration: 'none' }}>GitHub</a>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['M.Tech (CS) — NIT Jalandhar', 'B.Tech (CS) — B.I.E.T Jhansi', '25+ hosted projects'].map((chip) => (
                  <span
                    key={chip}
                    style={{
                      fontSize: '0.72rem',
                      background: 'rgba(212,175,55,0.1)',
                      border: '1px solid rgba(212,175,55,0.25)',
                      color: 'var(--color-gold-accent)',
                      padding: '0.3rem 0.7rem',
                      borderRadius: 6,
                      fontWeight: 600
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.7, margin: 0 }}>
                India BloodBridge is built with production standards — transactional reliability, eligibility validation, and emergency match sorting — so donation coordination stays dependable when it matters most.
              </p>
              <blockquote
                style={{
                  margin: 0,
                  fontStyle: 'italic',
                  borderLeft: '4px solid var(--color-gold-accent)',
                  padding: '0.75rem 1.15rem',
                  color: 'var(--color-text-primary)',
                  background: 'rgba(212, 175, 55, 0.04)',
                  borderRadius: '0 8px 8px 0',
                  lineHeight: 1.6
                }}
              >
                Connecting verified organizations with donors through structured code replaces chaotic panic with cooperative hope.
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .social-link { transition: color 0.2s ease, transform 0.2s ease; }
        .social-link:hover { color: var(--color-gold-hover) !important; transform: translateY(-1px); }
        @media (max-width: 768px) {
          .how-it-works-grid, .points-cards-grid, .about-grid, .founder-card-grid, .stepper-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
