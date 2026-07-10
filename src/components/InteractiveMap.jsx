// src/components/InteractiveMap.jsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom SVG Maroon Marker Icon
const createCustomIcon = (isSelected = false) => {
  const color = isSelected ? 'var(--color-gold-accent)' : 'var(--color-maroon-primary)';
  const innerColor = isSelected ? 'var(--color-maroon-dark)' : '#ffffff';
  
  const svgHtml = `
    <svg width="32" height="38" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.16 0 0 7.16 0 16C0 25.6 16 38 16 38C16 38 32 25.6 32 16C32 7.16 24.84 0 16 0ZM16 22C12.69 22 10 19.31 10 16C10 12.69 12.69 10 16 10C19.31 10 22 12.69 22 16C22 19.31 19.31 22 16 22Z" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="16" cy="16" r="4" fill="${innerColor}" />
    </svg>
  `;
  
  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-marker',
    iconSize: [32, 38],
    iconAnchor: [16, 38],
    popupAnchor: [0, -35]
  });
};

export default function InteractiveMap({ 
  camps = [], 
  selectedCamp = null, 
  onSelectCamp = () => {}, 
  centerCity = 'Delhi', 
  centerCoords = null, // Custom coordinates to center on
  interactiveMode = false, // If true, user can click to place a pin (for creating camp)
  onPinPlaced = () => {} 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const userPinRef = useRef(null);
  const [mapError, setMapError] = useState(false);
  const [placedPin, setPlacedPin] = useState(null);

  // Pre-seeded coordinates for center locations
  const cityCoords = {
    'Delhi': [28.6139, 77.2090],
    'Mumbai': [19.0760, 72.8777],
    'Bengaluru': [12.9716, 77.5946],
    'Chennai': [13.0827, 80.2707],
    'Kolkata': [22.5726, 88.3639]
  };

  const center = centerCoords 
    ? (Array.isArray(centerCoords) ? centerCoords : [parseFloat(centerCoords.lat), parseFloat(centerCoords.lng)])
    : (cityCoords[centerCity] || cityCoords['Delhi']);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      // Create Map
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false
      }).setView(center, 12);

      // Dark Mode Tile Server (CartoDB Dark Matter matches our aesthetic perfectly)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      // Create Group for Camp Markers
      const markersGroup = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = markersGroup;

      // Handle Pin Placing in interactive mode
      if (interactiveMode) {
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          
          if (userPinRef.current) {
            map.removeLayer(userPinRef.current);
          }

          const pin = L.marker([lat, lng], {
            icon: createCustomIcon(true),
            draggable: true
          }).addTo(map);

          userPinRef.current = pin;
          setPlacedPin({ lat, lng });
          onPinPlaced(lat, lng);

          pin.on('dragend', () => {
            const pos = pin.getLatLng();
            setPlacedPin({ lat: pos.lat, lng: pos.lng });
            onPinPlaced(pos.lat, pos.lng);
          });
        });
      }

      return () => {
        map.remove();
        mapInstanceRef.current = null;
      };
    } catch (err) {
      console.warn("Leaflet Map init failed. Falling back to CSS Vector Map.", err);
      setMapError(true);
    }
  }, [centerCity, centerCoords, interactiveMode]);

  // Update Markers when Camps list or Selected Camp changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;

    if (!map || !markersGroup || mapError) return;

    // Clear existing markers
    markersGroup.clearLayers();

    camps.forEach((camp) => {
      if (!camp.coordinates || !camp.coordinates.lat) return;

      const isSelected = selectedCamp && selectedCamp.id === camp.id;
      const marker = L.marker([camp.coordinates.lat, camp.coordinates.lng], {
        icon: createCustomIcon(isSelected)
      });

      // Marker click event
      marker.on('click', () => {
        onSelectCamp(camp);
      });

      // Popup content
      const popupContent = `
        <div style="color: #ffffff; font-family: var(--font-body); padding: 5px;">
          <h4 style="margin: 0 0 5px 0; color: var(--color-gold-accent); font-family: var(--font-display);">${camp.title}</h4>
          <p style="margin: 0; font-size: 0.8rem; color: #c7b4b3;">${camp.orgName}</p>
          <p style="margin: 3px 0 0 0; font-size: 0.75rem; color: #8c7877;">📅 ${camp.date} | 🕒 ${camp.time}</p>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: false,
        className: 'dark-leaflet-popup'
      });

      marker.addTo(markersGroup);

      if (isSelected) {
        map.setView([camp.coordinates.lat, camp.coordinates.lng], 13);
        marker.openPopup();
      }
    });
  }, [camps, selectedCamp, mapError]);

  // Center transition on city or coordinate changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && !mapError) {
      map.panTo(center);
    }
  }, [centerCity, centerCoords]);

  // CSS styled Vector Map Fallback Component (if Leaflet fails or maps fail to load)
  if (mapError) {
    return (
      <div className="custom-vector-map glass-panel-maroon" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ color: 'var(--color-gold-accent)' }}>Interactive Location Grid</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Offline/Fallback Interactive Vector Grid for {centerCity}
            </span>
          </div>
          {interactiveMode && (
            <div style={{ fontSize: '0.8rem', background: 'rgba(212,175,55,0.1)', color: 'var(--color-gold-accent)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
              Click Grid to Set Pin
            </div>
          )}
        </div>

        {/* Fallback Vector Grid */}
        <div style={{ flex: 1, position: 'relative', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden', background: '#0e0708' }}>
          <svg width="100%" height="100%" viewBox="0 0 1000 600" style={{ cursor: interactiveMode ? 'crosshair' : 'default' }}
            onClick={(e) => {
              if (!interactiveMode) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 1000;
              const y = ((e.clientY - rect.top) / rect.height) * 600;
              
              // Map vector coordinates to simulated lat/lng offset from city center
              const latOffset = (300 - y) / 1000;
              const lngOffset = (x - 500) / 1000;
              const pinLat = center[0] + latOffset;
              const pinLng = center[1] + lngOffset;

              setPlacedPin({ lat: pinLat, lng: pinLng, x, y });
              onPinPlaced(pinLat, pinLng);
            }}
          >
            {/* Grid Pattern */}
            <defs>
              <pattern id="fallbackGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(107, 20, 32, 0.12)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#fallbackGrid)" />
            
            {/* Concentric rings to look futuristic */}
            <circle cx="500" cy="300" r="100" fill="none" stroke="rgba(107, 20, 32, 0.08)" />
            <circle cx="500" cy="300" r="200" fill="none" stroke="rgba(107, 20, 32, 0.05)" />
            <circle cx="500" cy="300" r="300" fill="none" stroke="rgba(107, 20, 32, 0.03)" />
            
            {/* Center Reference (City Core) */}
            <circle cx="500" cy="300" r="6" fill="var(--color-maroon-accent)" opacity="0.6" />
            <text x="510" y="304" fill="var(--color-text-secondary)" fontSize="12" fontWeight="500">{centerCity} Center</text>

            {/* Render Camp Pins on Vector Grid */}
            {camps.map((camp) => {
              // Calculate relative positions based on latitude delta
              const latDiff = camp.coordinates.lat - center[0];
              const lngDiff = camp.coordinates.lng - center[1];
              
              // Scale coordinates to fit visual vector map (center is 500, 300)
              const cx = 500 + lngDiff * 1000;
              const cy = 300 - latDiff * 1000;

              const isSelected = selectedCamp && selectedCamp.id === camp.id;

              return (
                <g 
                  key={camp.id} 
                  className="map-marker"
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCamp(camp);
                  }}
                >
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={isSelected ? 16 : 10} 
                    fill={isSelected ? 'var(--color-gold-accent)' : 'var(--color-maroon-primary)'} 
                    stroke="#ffffff" 
                    strokeWidth="1.5"
                    className={isSelected ? 'pulse-glow-card' : ''}
                  />
                  {isSelected && (
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r="25" 
                      fill="none" 
                      stroke="var(--color-gold-accent)" 
                      strokeWidth="1" 
                      opacity="0.5"
                    />
                  )}
                  <text x={cx + 15} y={cy + 4} fill={isSelected ? 'var(--color-gold-accent)' : 'var(--color-text-primary)'} fontSize="11" fontWeight="bold">
                    {camp.title.substring(0, 15)}...
                  </text>
                </g>
              );
            })}

            {/* Placed Pin in interactive mode */}
            {interactiveMode && placedPin && (
              <g>
                {/* Convert lat/lng to screen coords if drag-clicked or raw coordinate calculation */}
                {(() => {
                  const x = placedPin.x || (500 + (placedPin.lng - center[1]) * 1000);
                  const y = placedPin.y || (300 - (placedPin.lat - center[0]) * 1000);
                  return (
                    <g>
                      <circle cx={x} cy={y} r="12" fill="var(--color-gold-accent)" stroke="#ffffff" strokeWidth="2" />
                      <line x1={x} y1={y} x2={x} y2={y - 12} stroke="var(--color-gold-accent)" strokeWidth="2" />
                      <text x={x + 15} y={y - 5} fill="var(--color-gold-accent)" fontSize="12" fontWeight="bold">Pinned Location</text>
                    </g>
                  );
                })()}
              </g>
            )}
          </svg>

          {/* Simple Vector Info overlay */}
          {selectedCamp && (
            <div className="glass-panel-maroon" style={{ position: 'absolute', bottom: '15px', left: '15px', right: '15px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h5 style={{ color: 'var(--color-gold-accent)' }}>{selectedCamp.title}</h5>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  📍 {selectedCamp.locationName}
                </span>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => onSelectCamp(selectedCamp)}
              >
                Inspect Camp
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '100%', borderRadius: 'var(--border-radius-md)' }} 
      />
      {interactiveMode && !placedPin && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '50px',
          background: 'rgba(18,10,11,0.85)',
          border: '1px solid var(--color-maroon-primary)',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '0.8rem',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          🎯 Click on the map to drop a donation camp pin
        </div>
      )}
    </div>
  );
}
