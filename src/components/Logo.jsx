// src/components/Logo.jsx
import React from 'react';

export default function Logo({ size = 120, showText = true, textVertical = false }) {
  // Brand color scheme from the user-provided image
  const brandMaroon = '#b12f2f'; // Droplet red
  const brandTextMaroon = '#8c1d24'; // Text maroon
  const brandGold = '#c8a245'; // Gold rings
  
  return (
    <div 
      className="logo-container heart-beat-hover" 
      style={{ 
        display: 'inline-flex', 
        flexDirection: textVertical ? 'column' : 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: textVertical ? '0.5rem' : '1rem',
        cursor: 'pointer'
      }}
    >
      <svg 
        width={size} 
        height={size * 1.15} 
        viewBox="0 0 100 115" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35))' }}
      >
        {/* 1. Droplet (Deep Maroon Red) */}
        <path 
          d="M 50,8 C 50,8 82,46 82,68 A 32,32 0 1,1 18,68 C 18,46 50,8 50,8 Z" 
          fill={brandMaroon} 
        />

        {/* 2. White Suspension Bridge Silhouette Inside Droplet */}
        {/* Straight road deck */}
        <line x1="24" y1="64" x2="76" y2="64" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Two vertical towers with circular caps */}
        <line x1="38" y1="44" x2="38" y2="64" stroke="#ffffff" strokeWidth="2" />
        <circle cx="38" cy="44" r="2" fill="#ffffff" />

        <line x1="62" y1="44" x2="62" y2="64" stroke="#ffffff" strokeWidth="2" />
        <circle cx="62" cy="44" r="2" fill="#ffffff" />

        {/* Outer suspension arches passing through the towers */}
        <path d="M 24,64 Q 38,44 50,53 Q 62,44 76,64" stroke="#ffffff" strokeWidth="1.75" fill="none" />
        <path d="M 24,64 Q 50,44 76,64" stroke="#ffffff" strokeWidth="1.75" fill="none" />

        {/* 3. Three Interlocking Gold Rings Below */}
        <g stroke={brandGold} strokeWidth="3" fill="none">
          {/* Left Ring */}
          <circle cx="36" cy="94" r="9" />
          {/* Right Ring */}
          <circle cx="64" cy="94" r="9" />
          {/* Middle Ring (drawn on top to show interlock) */}
          <circle cx="50" cy="94" r="9" />
        </g>
      </svg>
      
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: textVertical ? 'center' : 'flex-start' }}>
          <span 
            style={{ 
              fontFamily: 'Georgia, serif', // Serif font matches the image's logo style
              fontWeight: 'bold', 
              fontSize: size > 70 ? '1.65rem' : '1.2rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: brandTextMaroon
            }}
          >
            India BloodBridge
          </span>
          <span 
            style={{ 
              fontFamily: 'var(--font-body)', 
              fontSize: size > 70 ? '0.8rem' : '0.65rem',
              letterSpacing: '0.04em',
              fontWeight: 500,
              color: '#a38c82',
              marginTop: '4px'
            }}
          >
            एक चेन, अनगिनत जिंदगियां
          </span>
        </div>
      )}
    </div>
  );
}
