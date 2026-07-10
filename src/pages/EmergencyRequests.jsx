// src/pages/EmergencyRequests.jsx
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';

export default function EmergencyRequests({ currentUser, onUpdateUser }) {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [matchedDonors, setMatchedDonors] = useState([]);
  const [broadcastLog, setBroadcastLog] = useState([]);
  const [broadcasting, setBroadcasting] = useState(false);

  // Form states
  const [formBloodGroup, setFormBloodGroup] = useState('O+');
  const [formLocation, setFormLocation] = useState('');
  const [formCity, setFormCity] = useState('Delhi');
  const [formUrgency, setFormUrgency] = useState('Critical');
  const [formUnits, setFormUnits] = useState('1');
  const [formContact, setFormContact] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [redeemPoints, setRedeemPoints] = useState(false);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const bloodTypesList = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Load emergency requests
  const loadRequests = () => {
    const list = dbService.getEmergencyRequests();
    // Sort so priority is at top, then date
    const sorted = [...list].sort((a, b) => {
      if (a.redeemedPriority && !b.redeemedPriority) return -1;
      if (!a.redeemedPriority && b.redeemedPriority) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setRequests(sorted);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Update matched donors when request selection changes
  useEffect(() => {
    if (!selectedRequest) {
      setMatchedDonors([]);
      setBroadcastLog([]);
      return;
    }

    // Get matching donors from database service (filters compatibility + city + eligibility, sorts by points)
    const matches = dbService.getMatchingDonors(selectedRequest.bloodGroup, selectedRequest.city);
    setMatchedDonors(matches);
    setBroadcastLog([]);
  }, [selectedRequest]);

  // Handle Post Request Submit
  const handlePostRequest = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!currentUser) {
      setFormError('Please log in or switch to a persona from the Sandbox switcher to post a request.');
      return;
    }

    try {
      const cityCoords = dbService.getCityCoords(formCity);
      
      dbService.postEmergencyRequest(
        currentUser.id,
        formBloodGroup,
        formLocation,
        formCity,
        cityCoords.lat,
        cityCoords.lng,
        formUrgency,
        formUnits,
        formContact,
        formDescription,
        redeemPoints
      );

      setFormSuccess('Emergency blood request published successfully!');
      
      // Clear forms
      setFormLocation('');
      setFormContact('');
      setFormDescription('');
      setRedeemPoints(false);

      // Trigger user update if points changed
      if (onUpdateUser) {
        onUpdateUser();
      }

      // Reload
      loadRequests();
      setTimeout(() => setFormSuccess(''), 4000);
    } catch (err) {
      setFormError(err.message);
    }
  };

  // Simulate Broadcast notification to matching donors
  const handleSendBroadcast = () => {
    if (matchedDonors.length === 0) return;
    
    setBroadcasting(true);
    setBroadcastLog(['Initializing matching network broadcast...']);

    // Simulate logs staggered
    setTimeout(() => {
      setBroadcastLog(prev => [...prev, `Found ${matchedDonors.length} compatible nearby eligible donors.`]);
    }, 600);

    matchedDonors.forEach((donor, index) => {
      setTimeout(() => {
        setBroadcastLog(prev => [
          ...prev, 
          `🟢 Alert dispatched to ${donor.name} (${donor.bloodGroup}, Points: ${donor.points}) via SMS/WhatsApp.`
        ]);
        if (index === matchedDonors.length - 1) {
          setTimeout(() => {
            setBroadcastLog(prev => [...prev, '✓ Network broadcast complete. Matching donors notified in order of points priority.']);
            setBroadcasting(false);
          }, 500);
        }
      }, 1000 + index * 600);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1.5rem 0' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '2rem', color: '#ffffff' }}>Emergency Blood Request Hub</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Post critical blood requirements or browse active postings to coordinate donor matching.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="emergency-grid">
        
        {/* Left column: Active list & Match center */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Active Postings segment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Active Emergency Board</h2>
            
            {requests.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {requests.map((req) => (
                  <div 
                    key={req.id} 
                    className="glass-panel"
                    style={{ 
                      padding: '1.25rem', 
                      cursor: 'pointer', 
                      transition: 'all 0.3s ease',
                      border: selectedRequest?.id === req.id 
                        ? '1px solid var(--color-gold-accent)' 
                        : req.redeemedPriority 
                          ? '1px solid rgba(212,175,55,0.4)'
                          : '1px solid rgba(255,255,255,0.05)',
                      boxShadow: selectedRequest?.id === req.id ? 'var(--shadow-glow-gold)' : 'none',
                      background: req.redeemedPriority ? 'linear-gradient(135deg, var(--color-maroon-card) 0%, rgba(38, 26, 12, 0.95) 100%)' : 'var(--color-maroon-card)'
                    }}
                    onClick={() => setSelectedRequest(req)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ 
                          background: 'rgba(107, 20, 32, 0.4)', 
                          color: '#ffffff', 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '4px',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          border: '1px solid var(--color-maroon-primary)'
                        }}>
                          {req.bloodGroup}
                        </span>
                        <h4 style={{ color: '#ffffff', fontSize: '1.05rem' }}>{req.locationName}</h4>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {req.redeemedPriority && (
                          <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>⭐ Priority</span>
                        )}
                        <span className="badge" style={{ 
                          background: req.urgency === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                          color: req.urgency === 'Critical' ? 'var(--color-danger)' : 'var(--color-warning)',
                          border: `1px solid ${req.urgency === 'Critical' ? 'var(--color-danger)' : 'var(--color-warning)'}`,
                          fontSize: '0.65rem'
                        }}>
                          {req.urgency}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                      <span>Units Needed: <strong>{req.unitsNeeded} Unit(s)</strong> | City: {req.city}</span>
                      <span style={{ color: 'var(--color-gold-accent)', fontWeight: 600 }}>Match Donors ➔</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                No active emergency blood requests.
              </div>
            )}
          </div>

          {/* Donor Matchmaking Center */}
          {selectedRequest && (
            <div className="glass-panel-maroon slide-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span className="badge badge-verified" style={{ marginBottom: '0.4rem' }}>Donor Match Center</span>
                  <h3 style={{ color: '#ffffff' }}>Matching Donors for {selectedRequest.bloodGroup} in {selectedRequest.city}</h3>
                </div>
                <button 
                  className="btn btn-gold" 
                  disabled={matchedDonors.length === 0 || broadcasting}
                  onClick={handleSendBroadcast}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  📢 Broadcast Alerts
                </button>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                System automatically lists compatible donors (Universal O- matches included) who are currently eligible (not in 3-month waiting gap), **sorted by points balance** (highest points prioritized).
              </div>

              {matchedDonors.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {matchedDonors.map((donor, idx) => (
                    <div 
                      key={donor.id}
                      style={{
                        background: 'rgba(0,0,0,0.15)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '6px',
                        padding: '0.6rem 1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>#{idx + 1}</span>
                        <div>
                          <strong>{donor.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginLeft: '0.5rem' }}>
                            ({donor.bloodGroup} • {donor.city})
                          </span>
                        </div>
                      </div>

                      <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                        🏆 {donor.points} Points
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  No compatible matching donors found in {selectedRequest.city} at this time.
                </div>
              )}

              {/* Simulated Notification Logs */}
              {broadcastLog.length > 0 && (
                <div className="glass-panel" style={{ 
                  padding: '1rem', 
                  background: '#0e0708', 
                  fontFamily: 'monospace', 
                  fontSize: '0.8rem', 
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  border: '1px solid rgba(107, 20, 32, 0.3)'
                }}>
                  {broadcastLog.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column: Post Request Form */}
        <div>
          <form onSubmit={handlePostRequest} className="glass-panel-maroon" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-gold-accent)' }}>Post Emergency Request</h2>
            
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Blood Group Needed</label>
                <select 
                  className="form-select"
                  value={formBloodGroup}
                  onChange={(e) => setFormBloodGroup(e.target.value)}
                >
                  {bloodTypesList.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Units Required</label>
                <input 
                  type="number" 
                  className="form-input" 
                  min="1" 
                  max="10"
                  value={formUnits}
                  onChange={(e) => setFormUnits(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Urgency Level</label>
                <select 
                  className="form-select"
                  value={formUrgency}
                  onChange={(e) => setFormUrgency(e.target.value)}
                >
                  <option value="Critical">Critical (Immediate)</option>
                  <option value="Medium">Medium (Within 24 Hours)</option>
                  <option value="Low">Low (Scheduled Support)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">City Location</label>
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
            </div>

            <div className="form-group">
              <label className="form-label">Hospital Address Details</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. ICU Wing, Max Hospital, Saket" 
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Contact Phone</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. +91 98765 43210" 
                value={formContact}
                onChange={(e) => setFormContact(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Patient Status / Notes</label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                placeholder="Details of emergency case (accident, surgery, etc.)"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                required
              />
            </div>

            {/* Redeeming points checkbox */}
            {currentUser && currentUser.role === 'donor' && (
              <div 
                style={{ 
                  background: 'rgba(212,175,55,0.05)', 
                  border: '1px solid rgba(212,175,55,0.2)', 
                  borderRadius: '6px', 
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}
                onClick={() => setRedeemPoints(!redeemPoints)}
              >
                <input 
                  type="checkbox" 
                  checked={redeemPoints}
                  onChange={() => {}} // Controlled by wrapper click
                  style={{ marginTop: '3px', cursor: 'pointer' }}
                />
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-gold-accent)' }}>
                    Redeem 20 Points for Fast Priority
                  </span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.15rem' }}>
                    Deducts 20 points from your balance ({currentUser.points} pts available). Places a ⭐ tag on your request and alerts matches immediately.
                  </p>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-gold" style={{ marginTop: '0.5rem' }}>
              Publish Emergency Alert
            </button>
          </form>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .emergency-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>

    </div>
  );
}
