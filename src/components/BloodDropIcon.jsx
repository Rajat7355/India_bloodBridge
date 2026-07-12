// Transparent blood-drop icon (no background) for falling animation
import React from 'react';

export default function BloodDropIcon({ size = 48, className = '', style = {} }) {
  const brandMaroon = '#c23b34';
  const brandGold = '#d4af37';

  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', ...style }}
      aria-hidden="true"
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
  );
}
