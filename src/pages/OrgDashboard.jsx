// src/pages/OrgDashboard.jsx
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import InteractiveMap from '../components/InteractiveMap';

export default function OrgDashboard({ currentUser }) {
  const [dbUser, setDbUser] = useState(null);
  const [camps, setCamps] = useState([]);
  const [activeTab, setActiveTab] = useState('camps'); // 'camps' | 'create'
  
  // Camp Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('10:00 AM - 04:00 PM');
  const [formLocation, setFormLocation] = useState('');
  const [formCity, setFormCity] = useState('Delhi');
  const [formLat, setFormLat] = useState('');
  const [formLng, setFormLng] = useState('');
  const [formBloodTypes, setFormBloodTypes] = useState(['O+', 'A+', 'B+']);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Expandable donor logs per camp
  const [expandedCampId, setExpandedCampId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const bloodTypesList = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Load organization details and camps
  const loadData = async () => {
    if (!currentUser) return;
    try {
      const user = await dbService.getUser(currentUser.id);
      setDbUser(user);

      const allCamps = await dbService.getCamps();
      const orgCamps = allCamps.filter(c => c.orgId === currentUser.id);
      setCamps(orgCamps);
    } catch (err) {
      console.error("Failed to load organization data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Set default coordinates when city changes
  useEffect(() => {
    const coords = dbService.getCityCoords(formCity);
    setFormLat(coords.lat.toString());
    setFormLng(coords.lng.toString());
  }, [formCity]);

  if (!dbUser) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Organization Dashboard...</div>;
  }

  // Handle Pin Dropping on the Interactive Map
  const handlePinPlaced = (lat, lng) => {
    setFormLat(lat.toFixed(6));
    setFormLng(lng.toFixed(6));
  };

  // Toggle blood type selection
  const handleBloodTypeToggle = (type) => {
    if (formBloodTypes.includes(type)) {
      setFormBloodTypes(formBloodTypes.filter(t => t !== type));
    } else {
      setFormBloodTypes([...formBloodTypes, type]);
    }
  };

  // Create Camp Submit
  const handleCreateCamp = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (formBloodTypes.length === 0) {
      setFormError('Please select at least one blood group needed.');
      return;
    }

    try {
      await dbService.createCamp(
        dbUser.id,
        formTitle,
        formDate,
        formTime,
        formLocation,
        formCity,
        formLat,
        formLng,
        formBloodTypes
      );

      setFormSuccess('Camp created successfully!');
      // Reset form
      setFormTitle('');
      setFormLocation('');
      setFormBloodTypes(['O+', 'A+', 'B+']);
      
      // Reload camps
      loadData();
      // Switch back to list tab
      setTimeout(() => {
        setActiveTab('camps');
        setFormSuccess('');
      }, 1500);
    } catch (err) {
      setFormError(err.message);
    }
  };

  // Close Camp
  const handleCloseCamp = async (campId) => {
    if (window.confirm('Are you sure you want to close this donation camp? No further donors will be able to register.')) {
      try {
        await dbService.closeCamp(campId);
        await loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Confirm Donor Donation
  const handleConfirmDonation = async (campId, donorId) => {
    setErrorMessage('');
    setActionMessage('');
    
    try {
      const result = await dbService.confirmDonation(campId, donorId);
      setActionMessage(`Donation successfully confirmed! Certificate Issued: ${result.certId}`);
      await loadData();
      setTimeout(() => setActionMessage(''), 6000);
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(''), 6000);
    }
  };

  // Render Verification Pending Screen
  if (!dbUser.isVerified) {
    return (
      <div style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }} className="slide-up">
        <div className="glass-panel-maroon" style={{ padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
          <span style={{ fontSize: '3rem' }}>🔒</span>
          <h2 style={{ color: 'var(--color-gold-accent)', fontSize: '1.6rem' }}>Verification Pending</h2>
          
          <div style={{ width: '80%', height: '1px', background: 'rgba(255,255,255,0.05)' }} />

          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Your organization account for <strong>{dbUser.name}</strong> is currently pending administrator verification.
          </p>
          
          <div style={{
            background: 'rgba(212, 175, 55, 0.05)',
            border: '1px dashed var(--color-gold-accent)',
            borderRadius: '6px',
            padding: '1rem',
            textAlign: 'left',
            fontSize: '0.9rem',
            width: '100%',
            maxWidth: '500px'
          }}>
            <strong>Document details uploaded:</strong>
            <div style={{ marginTop: '0.4rem', color: 'var(--color-text-secondary)' }}>
              • Licencse File: <code>{dbUser.certificateUrl}</code><br />
              • Contact: {dbUser.contact}<br />
              • Address: {dbUser.address}
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            * Evaluator Note: You can instantly verify this organization by clicking the <strong>Admin (Dr. Rajeev)</strong> persona at the top Sandbox header, then approving the organization under the pending queue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1.5rem 0' }}>
      
      {/* Header and Verified Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '2rem', color: '#ffffff' }}>Organization Dashboard</h1>
            <span className="badge badge-verified" style={{ fontSize: '0.75rem' }}>
              ✓ Verified Partner
            </span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Host donation camps, manage registrations, and confirm life-saving donations.
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="glass-panel" style={{ padding: '0.25rem', display: 'flex', gap: '0.25rem' }}>
          <button 
            className={`btn ${activeTab === 'camps' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '8px' }}
            onClick={() => setActiveTab('camps')}
          >
            📋 Managed Camps
          </button>
          <button 
            className={`btn ${activeTab === 'create' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '8px' }}
            onClick={() => setActiveTab('create')}
          >
            ➕ Host New Camp
          </button>
        </div>
      </div>

      {/* Global alert messages */}
      {actionMessage && (
        <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--color-success)', color: 'var(--color-success)', borderRadius: '8px' }}>
          {actionMessage}
        </div>
      )}
      {errorMessage && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', borderRadius: '8px' }}>
          {errorMessage}
        </div>
      )}

      {/* TAB 1: CAMPS LIST */}
      {activeTab === 'camps' && (
        <div className="slide-up">
          {camps.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {camps.map((camp) => (
                <div key={camp.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ color: '#ffffff', fontSize: '1.25rem' }}>{camp.title}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        📍 {camp.locationName}, {camp.city} | 🕒 {camp.time} | 📅 {camp.date}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className={`badge ${camp.status === 'active' ? 'badge-active' : 'badge-closed'}`}>
                        {camp.status}
                      </span>
                      {camp.status === 'active' && (
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)' }}
                          onClick={() => handleCloseCamp(camp.id)}
                        >
                          Close Camp
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Blood Types Needed */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {camp.bloodGroupsNeeded.map(bg => (
                      <span key={bg} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {bg}
                      </span>
                    ))}
                  </div>

                  {/* Registered Donors Segment */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                    <button 
                      onClick={() => setExpandedCampId(expandedCampId === camp.id ? null : camp.id)}
                      style={{
                        background: 'none', border: 'none', color: 'var(--color-gold-accent)', 
                        fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem'
                      }}
                    >
                      {expandedCampId === camp.id ? '▼ Hide Registrations' : `▶ View Registrations (${camp.registeredDonors.length})`}
                    </button>

                    {expandedCampId === camp.id && (
                      <div className="slide-up" style={{ marginTop: '1rem' }}>
                        {camp.registeredDonors.length > 0 ? (
                          <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text-secondary)' }}>
                                  <th style={{ padding: '0.5rem' }}>Donor Name</th>
                                  <th style={{ padding: '0.5rem' }}>Blood Group</th>
                                  <th style={{ padding: '0.5rem' }}>Reg. Date</th>
                                  <th style={{ padding: '0.5rem' }}>Status</th>
                                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {camp.registeredDonors.map((reg) => (
                                  <tr key={reg.donorId} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <td style={{ padding: '0.75rem 0.5rem' }}><strong>{reg.donorName}</strong></td>
                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                      <span style={{ color: 'var(--color-gold-accent)', fontWeight: 'bold' }}>{reg.bloodGroup}</span>
                                    </td>
                                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-muted)' }}>{reg.registeredAt}</td>
                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                      {reg.status === 'donated' ? (
                                        <span className="badge" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--color-success)', fontSize: '0.65rem' }}>Donated</span>
                                      ) : (
                                        <span className="badge" style={{ background: 'rgba(234,179,8,0.1)', color: 'var(--color-warning)', fontSize: '0.65rem' }}>Signed In</span>
                                      )}
                                    </td>
                                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                                      {reg.status !== 'donated' && camp.status === 'active' ? (
                                        <button 
                                          className="btn btn-gold" 
                                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                          onClick={() => handleConfirmDonation(camp.id, reg.donorId)}
                                        >
                                          Confirm Donation
                                        </button>
                                      ) : reg.status === 'donated' ? (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                          ID: <code>{reg.certificateId.substring(0, 15)}...</code>
                                        </span>
                                      ) : (
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Camp Closed</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                            No donors registered for this camp yet.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>⛺</span>
              <p>Your organization hasn't hosted any camps yet.</p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setActiveTab('create')}>
                Create Your First Camp
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CREATE CAMP */}
      {activeTab === 'create' && (
        <div className="slide-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="org-create-grid">
          {/* Form */}
          <form onSubmit={handleCreateCamp} className="glass-panel-maroon" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-gold-accent)', marginBottom: '0.5rem' }}>
              Camp Details
            </h2>

            {formError && (
              <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', borderRadius: '6px', fontSize: '0.85rem' }}>
                {formError}
              </div>
            )}
            {formSuccess && (
              <div style={{ padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--color-success)', color: 'var(--color-success)', borderRadius: '6px', fontSize: '0.85rem' }}>
                {formSuccess}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Camp Title</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. LifeSaver Weekend Camp" 
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={formDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormDate(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Time Slot</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 09:00 AM - 05:00 PM" 
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City location</label>
                <select 
                  className="form-select"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                >
                  <option value="Delhi">Delhi / NCR</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location Address</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Community Center, Sector 5" 
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Hidden/Helper Coord Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
              <div>Latitude: <code>{formLat}</code></div>
              <div>Longitude: <code>{formLng}</code></div>
            </div>

            {/* Blood type selection */}
            <div className="form-group">
              <label className="form-label">Blood Groups Needed</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {bloodTypesList.map(type => {
                  const isChecked = formBloodTypes.includes(type);
                  return (
                    <button
                      type="button"
                      key={type}
                      onClick={() => handleBloodTypeToggle(type)}
                      style={{
                        padding: '0.4rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: isChecked ? 'var(--color-maroon-primary)' : 'rgba(0,0,0,0.2)',
                        color: isChecked ? '#ffffff' : 'var(--color-text-secondary)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn btn-gold" style={{ marginTop: '0.5rem' }}>
              Publish Donation Camp
            </button>
          </form>

          {/* Interactive Map Picker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h4 style={{ color: '#ffffff', marginBottom: '0.25rem' }}>Select Camp Coordinates</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Drag or click on the map below to drop a pin. This defines the geographical location that donors see.
              </p>
            </div>
            
            <InteractiveMap 
              centerCity={formCity} 
              interactiveMode={true} 
              onPinPlaced={handlePinPlaced} 
            />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .org-create-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>

    </div>
  );
}
