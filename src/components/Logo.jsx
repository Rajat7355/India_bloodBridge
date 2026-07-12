// src/components/Logo.jsx
import React from 'react';

export default function Logo({ size = 120, showText = true, textVertical = false, light = true, dropFromTop = false }) {
  const brandMaroon = '#c23b34';
  const brandGold = '#d4af37';
  const titleColor = light ? '#ffffff' : '#8c1d24';
  const taglineColor = light ? 'rgba(212, 175, 55, 0.9)' : '#a38c82';

  return (
    <div
      className="logo-container heart-beat-hover"
      style={{
        display: 'inline-flex',
        flexDirection: textVertical ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: textVertical ? '0.55rem' : '0.85rem',
        cursor: 'pointer'
      }}
    >
      <svg
        className={dropFromTop ? 'hero-main-drop' : undefined}
        width={size}
        height={size * 1.15}
        viewBox="0 0 100 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 4px 14px rgba(194, 59, 52, 0.35))' }}
      >
        <path
          d="M 50,8 C 50,8 82,46 82,68 A 32,32 0 1,1 18,68 C 18,46 50,8 50,8 Z"
          fill={brandMaroon}
        />
        <line x1="24" y1="64" x2="76" y2="64" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="44" x2="38" y2="64" stroke="#ffffff" strokeWidth="2" />
        <circle cx="38" cy="44" r="2" fill="#ffffff" />
        <line x1="62" y1="44" x2="62" y2="64" stroke="#ffffff" strokeWidth="2" />
        <circle cx="62" cy="44" r="2" fill="#ffffff" />
        <path d="M 24,64 Q 38,44 50,53 Q 62,44 76,64" stroke="#ffffff" strokeWidth="1.75" fill="none" />
        <path d="M 24,64 Q 50,44 76,64" stroke="#ffffff" strokeWidth="1.75" fill="none" />
        <g stroke={brandGold} strokeWidth="3" fill="none">
          <circle cx="36" cy="94" r="9" />
          <circle cx="64" cy="94" r="9" />
          <circle cx="50" cy="94" r="9" />
        </g>
      </svg>

      {showText && (
        <div
          className={dropFromTop ? 'hero-main-drop-text' : undefined}
          style={{ display: 'flex', flexDirection: 'column', alignItems: textVertical ? 'center' : 'flex-start' }}
        >
          <span
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 700,
              fontSize: size > 70 ? 'clamp(1.6rem, 4vw, 2.35rem)' : '1.15rem',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: titleColor
            }}
          >
            India <span style={{ color: brandGold }}>BloodBridge</span>
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: size > 70 ? '0.85rem' : '0.65rem',
              letterSpacing: '0.06em',
              fontWeight: 500,
              color: taglineColor,
              marginTop: '6px'
            }}
          >
            एक चेन, अनगिनत जिंदगियां
          </span>
        </div>
      )}
    </div>
  );
}
