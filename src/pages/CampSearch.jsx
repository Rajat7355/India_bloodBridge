// src/pages/CampSearch.jsx
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import InteractiveMap from '../components/InteractiveMap';
import CampCard from '../components/CampCard';

export default function CampSearch({ currentUser }) {
  const [camps, setCamps] = useState([]);
  const [filteredCamps, setFilteredCamps] = useState([]);
  
  // Filters State
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCoords, setSelectedCoords] = useState(null); // { lat, lng, name }
  const [filterDate, setFilterDate] = useState('');
  
  // Autocomplete State
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Selection / Details State
  const [selectedCamp, setSelectedCamp] = useState(null);
  
  // Messaging
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load all camps
  const loadCamps = async () => {
    try {
      const allCamps = await dbService.getCamps();
      setCamps(allCamps);
    } catch (err) {
      console.error("Failed to load camps", err);
    }
  };

  useEffect(() => {
    loadCamps();
  }, []);

  // Haversine formula to compute distance in km
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Geocoding Autocomplete debounced search
  useEffect(() => {
    if (!searchLocation.trim() || searchLocation.length < 2) {
      setSuggestions([]);
      return;
    }

    // Skip autocomplete if the input matches our selected coordinates' name exactly
    if (selectedCoords && searchLocation === selectedCoords.name) {
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocation)}&countrycodes=in&limit=5`
        );
        const data = await response.json();
        const formatted = data.map(item => ({
          name: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }));
        setSuggestions(formatted);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Geocoding failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 450); // Debounce to follow Nominatim API guidelines

    return () => clearTimeout(delayDebounce);
  }, [searchLocation, selectedCoords]);

  // Filter logic
  useEffect(() => {
    let result = camps.filter(camp => camp.status === 'active');

    // 1. Filter by Geocoded Coordinates or text query
    if (selectedCoords) {
      // Calculate distance for each active camp and store it
      const campsWithDistance = result.map(camp => {
        const dist = getDistance(
          selectedCoords.lat, 
          selectedCoords.lng, 
          camp.coordinates.lat, 
          camp.coordinates.lng
        );
        return { ...camp, distance: dist };
      });

      // Sort by distance (closest first)
      campsWithDistance.sort((a, b) => a.distance - b.distance);
      result = campsWithDistance;
    } else if (searchLocation.trim()) {
      const query = searchLocation.trim().toLowerCase();
      result = result.filter(camp => 
        camp.city.toLowerCase().includes(query) ||
        camp.locationName.toLowerCase().includes(query) ||
        camp.title.toLowerCase().includes(query) ||
        camp.orgName.toLowerCase().includes(query)
      );
    }

    // 2. Filter by Date (camps on or after select date)
    if (filterDate) {
      result = result.filter(camp => camp.date >= filterDate);
    }

    setFilteredCamps(result);
    
    // Auto-select first camp in filtered list if not empty and current selection not in list
    if (result.length > 0) {
      if (!selectedCamp || !result.some(c => c.id === selectedCamp.id)) {
        setSelectedCamp(result[0]);
      }
    } else {
      setSelectedCamp(null);
    }
  }, [camps, searchLocation, selectedCoords, filterDate, selectedCamp]);

  // Get map center city dynamically
  const getCenterCity = () => {
    if (searchLocation.trim()) {
      const query = searchLocation.trim().toLowerCase();
      const knownCities = ['delhi', 'mumbai', 'bengaluru', 'chennai', 'kolkata'];
      const matchedCity = knownCities.find(city => query.includes(city) || city.includes(query));
      if (matchedCity) {
        return matchedCity.charAt(0).toUpperCase() + matchedCity.slice(1);
      }
    }
    if (selectedCamp) {
      return selectedCamp.city;
    }
    if (filteredCamps.length > 0) {
      return filteredCamps[0].city;
    }
    return currentUser?.city || 'Delhi';
  };

  // Handle Camp Registration
  const handleRegisterForCamp = async (campId) => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentUser) {
      setErrorMsg('Please log in or select a Donor persona from the Sandbox switcher at the top to register.');
      return;
    }

    if (currentUser.role !== 'donor') {
      setErrorMsg('Only donor accounts are authorized to register for donation camps.');
      return;
    }

    try {
      await dbService.registerForCamp(currentUser.id, campId);
      setSuccessMsg('Registration confirmed! Check-in details are saved to your profile.');
      
      // Reload states
      await loadCamps();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(''), 8000);
    }
  };

  // Helper to check registration state
  const checkUserStatus = (camp) => {
    if (!currentUser || currentUser.role !== 'donor') return { isReg: false, isDonated: false };
    
    const regRecord = camp.registeredDonors.find(d => d.donorId === currentUser.id);
    if (!regRecord) return { isReg: false, isDonated: false };
    
    return {
      isReg: true,
      isDonated: regRecord.status === 'donated'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 0' }}>
      
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '2rem', color: '#ffffff' }}>Search Donation Camps</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Find verified donation clinics near you and schedule your donation.</p>
      </div>

      {/* Global Banners */}
      {successMsg && (
        <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--color-success)', color: 'var(--color-success)', borderRadius: '8px', fontSize: '0.95rem' }} className="slide-up">
          🎉 {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', borderRadius: '8px', fontSize: '0.95rem' }} className="slide-up">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Search Filters Row */}
      <div className="glass-panel camp-search-filters" style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '2fr 1.2fr 0.8fr', gap: '1rem', alignItems: 'end' }}>
        <div className="form-group" style={{ marginBottom: 0, position: 'relative' }}>
          <label className="form-label">Location / City Search</label>
          <input 
            type="text"
            className="form-input"
            placeholder="Search city, area, or address..."
            value={searchLocation}
            onChange={(e) => {
              setSearchLocation(e.target.value);
              setSelectedCoords(null); // Clear selected coordinates as soon as text is modified
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
          />
          
          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && (isSearching || suggestions.length > 0) && (
            <div className="glass-panel" style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 100,
              marginTop: '0.5rem',
              maxHeight: '220px',
              overflowY: 'auto',
              background: 'rgba(29, 18, 20, 0.98)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              boxShadow: 'var(--shadow-glow-gold), var(--shadow-main)'
            }}>
              {isSearching && (
                <div style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="spinner" style={{
                    width: '12px',
                    height: '12px',
                    border: '2px solid var(--color-gold-accent)',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Searching locations...
                </div>
              )}
              
              {!isSearching && suggestions.map((s, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '0.6rem 0.85rem',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    borderBottom: idx < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    lineHeight: '1.4'
                  }}
                  className="suggestion-item"
                  onClick={() => {
                    const parts = s.name.split(',');
                    const cleanName = parts.slice(0, 3).join(',').trim();
                    setSearchLocation(cleanName);
                    setSelectedCoords({ lat: s.lat, lng: s.lng, name: cleanName });
                    setShowSuggestions(false);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(107, 20, 32, 0.4)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  📍 {s.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Min. Camp Date</label>
          <input 
            type="date" 
            className="form-input" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        <button 
          className="btn btn-secondary" 
          style={{ width: '100%', padding: '0.75rem' }}
          onClick={() => {
            setFilterDate('');
            setSearchLocation('');
            setSelectedCoords(null);
          }}
        >
          Reset
        </button>
      </div>

      {/* Main Map & Camp list Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="camp-search-grid">
        
        {/* Left Side: Map Discovery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: '#ffffff' }}>Map Discovery</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Click pins to select camps</span>
            </div>
            <span className="badge badge-active" style={{ fontSize: '0.75rem' }}>
              {filteredCamps.length} Camps Found
            </span>
          </div>

          <InteractiveMap 
            camps={filteredCamps} 
            selectedCamp={selectedCamp} 
            onSelectCamp={(camp) => setSelectedCamp(camp)}
            centerCity={getCenterCity()}
            centerCoords={selectedCoords}
          />

          {/* Expanded Selected Camp Info Card */}
          {selectedCamp && (
            <div className="glass-panel-maroon slide-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge badge-verified" style={{ marginBottom: '0.4rem' }}>Selected Camp</span>
                  <h2 style={{ color: '#ffffff', fontSize: '1.5rem' }}>{selectedCamp.title}</h2>
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-gold-accent)', fontWeight: 600 }}>
                  📍 {selectedCamp.city}
                </span>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '0.75rem', 
                fontSize: '0.9rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '0.75rem'
              }}>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem' }}>Organized By</span>
                  <strong>{selectedCamp.orgName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem' }}>Timings</span>
                  <strong>{selectedCamp.time}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem' }}>Exact Address</span>
                  <strong>{selectedCamp.locationName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem' }}>Camp Date</span>
                  <strong>{selectedCamp.date}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Blood Groups Welcomed</span>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    {selectedCamp.bloodGroupsNeeded.map(bg => (
                      <span key={bg} style={{ fontSize: '0.75rem', background: 'rgba(212,175,55,0.1)', color: 'var(--color-gold-accent)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 'bold' }}>
                        {bg}
                      </span>
                    ))}
                  </div>
                </div>

                {(() => {
                  const status = checkUserStatus(selectedCamp);
                  return (
                    <button 
                      className={`btn ${status.isReg || status.isDonated ? 'btn-secondary' : 'btn-primary'}`}
                      disabled={status.isReg || status.isDonated || (currentUser && currentUser.role !== 'donor')}
                      onClick={() => handleRegisterForCamp(selectedCamp.id)}
                      style={{ minWidth: '150px' }}
                    >
                      {status.isDonated ? '✅ Donated' : status.isReg ? '✓ Registered' : 'Register to Donate'}
                    </button>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: List of camps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '820px', overflowY: 'auto', paddingRight: '0.25rem' }}>
          <h3 style={{ color: '#ffffff' }}>Search Results</h3>
          
          {filteredCamps.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredCamps.map((camp) => {
                const status = checkUserStatus(camp);
                const isSelected = selectedCamp && selectedCamp.id === camp.id;
                
                return (
                  <div 
                    key={camp.id} 
                    style={{ 
                      border: isSelected ? '1px solid var(--color-gold-accent)' : 'none', 
                      borderRadius: 'var(--border-radius-md)',
                      boxShadow: isSelected ? 'var(--shadow-glow-gold)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CampCard 
                      camp={camp}
                      currentUser={currentUser}
                      onRegister={handleRegisterForCamp}
                      onSelectCamp={(c) => setSelectedCamp(c)}
                      isRegistered={status.isReg}
                      isDonated={status.isDonated}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>⛺</span>
              <p>No active donation camps match your search criteria.</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.5rem' }}>
                Try searching a different location or adjusting the camp date.
              </span>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .camp-search-filters {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .camp-search-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>

    </div>
  );
}
