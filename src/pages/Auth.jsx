// src/pages/Auth.jsx
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';

export default function Auth({ 
  view = 'login', 
  setView = () => {}, 
  setCurrentUser, 
  setActivePage 
}) {
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Donor Signup States
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPassword, setDonorPassword] = useState('');
  const [donorContact, setDonorContact] = useState('');
  const [donorBlood, setDonorBlood] = useState('O+');
  const [donorCity, setDonorCity] = useState('Delhi');
  const [donorRef, setDonorRef] = useState('');
  const [donorError, setDonorError] = useState('');

  // Org Signup States
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgPassword, setOrgPassword] = useState('');
  const [orgContact, setOrgContact] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [orgDocName, setOrgDocName] = useState('');
  const [orgError, setOrgError] = useState('');

  // Read URL query params for auto-filling referral codes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      setDonorRef(refCode.toUpperCase());
      if (view === 'login') {
        setView('register-donor');
      }
    }
  }, [view]);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const user = await dbService.login(loginEmail, loginPassword);
      setCurrentUser(user);
      
      // Route based on role
      if (user.role === 'admin') setActivePage('admin');
      else if (user.role === 'org') setActivePage('org-dashboard');
      else setActivePage('donor-dashboard');
    } catch (err) {
      setLoginError(err.message);
    }
  };

  // Handle Donor Sign Up Submit
  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    setDonorError('');

    try {
      const user = await dbService.registerDonor(
        donorName,
        donorEmail,
        donorPassword,
        donorContact,
        donorBlood,
        donorCity,
        donorRef
      );
      setCurrentUser(user);
      setActivePage('donor-dashboard');
    } catch (err) {
      setDonorError(err.message);
    }
  };

  // Handle Org Sign Up Submit
  const handleOrgSubmit = async (e) => {
    e.preventDefault();
    setOrgError('');

    if (!orgDocName) {
      setOrgError('Please select a registration certificate document for verification.');
      return;
    }

    try {
      const user = await dbService.registerOrg(
        orgName,
        orgEmail,
        orgPassword,
        orgContact,
        orgAddress,
        orgDocName
      );
      setCurrentUser(user);
      setActivePage('org-dashboard');
    } catch (err) {
      setOrgError(err.message);
    }
  };

  const bloodTypesList = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const citiesList = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata'];

  return (
    <div style={{ padding: '3rem 0', maxWidth: '480px', width: '100%', margin: '0 auto' }} className="slide-up">
      
      {/* 1. LOGIN SCREEN */}
      {view === 'login' && (
        <form onSubmit={handleLoginSubmit} className="glass-panel-maroon" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#ffffff', textAlign: 'center' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '-0.5rem' }}>
            Log in to manage donation bookings, certificates, and alerts.
          </p>

          {loginError && (
            <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', borderRadius: '6px', fontSize: '0.85rem' }}>
              {loginError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="name@email.com" 
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-gold" style={{ marginTop: '0.5rem' }}>
            Sign In
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
            Don't have an account?{' '}
            <button type="button" onClick={() => setView('register-choice')} style={{ background: 'none', border: 'none', color: 'var(--color-gold-accent)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
              Sign Up
            </button>
          </div>
        </form>
      )}

      {/* 2. REGISTRATION CHOICE SCREEN */}
      {view === 'register-choice' && (
        <div className="glass-panel-maroon" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#ffffff' }}>Create Account</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '-0.5rem' }}>
            Select your profile type to register on India BloodBridge.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {/* Donor Signup Box */}
            <div 
              onClick={() => setView('register-donor')}
              style={{
                border: '1px solid rgba(255, 255, 255, 0.05)',
                background: 'rgba(0,0,0,0.15)',
                padding: '1.25rem',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
              className="heart-beat-hover"
            >
              <h4 style={{ color: 'var(--color-gold-accent)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>🩸 Individual Blood Donor</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Book donation spots, download certificates, track referral chain bonus points, and redeem emergencies.
              </p>
            </div>

            {/* Org Signup Box */}
            <div 
              onClick={() => setView('register-org')}
              style={{
                border: '1px solid rgba(255, 255, 255, 0.05)',
                background: 'rgba(0,0,0,0.15)',
                padding: '1.25rem',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
            >
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>🏥 Verified Organization</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                NGOs, hospitals, and blood banks hosting donation clinics and issuing digital certificates.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
            Already have an account?{' '}
            <button type="button" onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: 'var(--color-gold-accent)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* 3. DONOR REGISTRATION FORM */}
      {view === 'register-donor' && (
        <form onSubmit={handleDonorSubmit} className="glass-panel-maroon" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--color-gold-accent)', textAlign: 'center' }}>Donor Signup</h2>
          
          {donorError && (
            <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', borderRadius: '6px', fontSize: '0.85rem' }}>
              {donorError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Amit Patel" 
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="amit@gmail.com" 
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Password" 
                value={donorPassword}
                onChange={(e) => setDonorPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. +91 98765 43210" 
                value={donorContact}
                onChange={(e) => setDonorContact(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select 
                className="form-select"
                value={donorBlood}
                onChange={(e) => setDonorBlood(e.target.value)}
              >
                {bloodTypesList.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">City location</label>
              <select 
                className="form-select"
                value={donorCity}
                onChange={(e) => setDonorCity(e.target.value)}
              >
                {citiesList.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Referral Code (Optional)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. PRIYA102" 
                value={donorRef}
                onChange={(e) => setDonorRef(e.target.value.toUpperCase())}
                style={{ textTransform: 'uppercase' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-gold" style={{ marginTop: '0.5rem' }}>
            Register Account
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            Already have an account?{' '}
            <button type="button" onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: 'var(--color-gold-accent)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
              Sign In
            </button>
          </div>
        </form>
      )}

      {/* 4. ORGANIZATION REGISTRATION FORM */}
      {view === 'register-org' && (
        <form onSubmit={handleOrgSubmit} className="glass-panel-maroon" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', textAlign: 'center' }}>Organization Signup</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '-0.75rem' }}>
            Awaiting Admin document verification before posting camps.
          </p>
          
          {orgError && (
            <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', borderRadius: '6px', fontSize: '0.85rem' }}>
              {orgError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Organization Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Indian Red Cross Society" 
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="delhi@redcross.org" 
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Password" 
                value={orgPassword}
                onChange={(e) => setOrgPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Number</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. +91 11 2371 6441" 
              value={orgContact}
              onChange={(e) => setOrgContact(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Clinic / Blood Bank HQ street details" 
              value={orgAddress}
              onChange={(e) => setOrgAddress(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Legal Registration Document (.pdf/.png)</label>
            <div style={{ 
              border: '1px dashed rgba(255,255,255,0.1)', 
              borderRadius: '6px', 
              padding: '1rem', 
              textAlign: 'center',
              background: 'rgba(0,0,0,0.2)',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: '0.25rem' }}>📁</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                {orgDocName ? `Selected: ${orgDocName}` : 'Click to Upload Document / Certificate'}
              </span>
              <input 
                type="file" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setOrgDocName(file.name);
                }}
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-gold" style={{ marginTop: '0.5rem' }}>
            Register Organization
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            Already have an account?{' '}
            <button type="button" onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: 'var(--color-gold-accent)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
              Sign In
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
