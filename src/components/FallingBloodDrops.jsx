// src/components/FallingBloodDrops.jsx
import React, { useMemo } from 'react';
import BloodDropIcon from './BloodDropIcon';

const LOGO_DROP_COUNT = 36;
const MINI_DROP_COUNT = 72;

function seededRandom(seed) {
  const x = Math.sin(seed * 9999.1337) * 10000;
  return x - Math.floor(x);
}

function makeLogoDrops(count) {
  return Array.from({ length: count }, (_, i) => {
    const r1 = seededRandom(i + 1);
    const r2 = seededRandom(i + 11);
    const r3 = seededRandom(i + 23);
    const r4 = seededRandom(i + 37);

    return {
      id: `logo-${i}`,
      type: 'logo',
      left: `${r1 * 98}%`,
      size: 18 + Math.floor(r2 * 5) * 10,
      duration: 4 + r3 * 7,
      delay: r4 * 8,
      drift: (r2 > 0.5 ? 1 : -1) * (12 + Math.floor(r3 * 40)),
      opacity: 0.25 + r4 * 0.45,
      anim: ['dropFall', 'dropFallWobble', 'dropFallFast'][i % 3]
    };
  });
}

function makeMiniDrops(count) {
  return Array.from({ length: count }, (_, i) => {
    const r1 = seededRandom(i + 101);
    const r2 = seededRandom(i + 211);
    const r3 = seededRandom(i + 311);
    const r4 = seededRandom(i + 401);

    return {
      id: `mini-${i}`,
      type: 'mini',
      left: `${r1 * 100}%`,
      size: 4 + Math.floor(r2 * 4) * 2,
      duration: 2.5 + r3 * 5,
      delay: r4 * 6,
      drift: (r2 > 0.5 ? 1 : -1) * (6 + Math.floor(r3 * 24)),
      opacity: 0.2 + r4 * 0.5,
      anim: ['dropFallFast', 'dropFall', 'dropFallWobble'][i % 3],
      hue: 0 + Math.floor(r1 * 18)
    };
  });
}

export default function FallingBloodDrops() {
  const logoDrops = useMemo(() => makeLogoDrops(LOGO_DROP_COUNT), []);
  const miniDrops = useMemo(() => makeMiniDrops(MINI_DROP_COUNT), []);

  return (
    <div className="falling-drops-layer" aria-hidden="true">
      <div className="falling-drops-glow" />

      {miniDrops.map((drop) => (
        <div
          key={drop.id}
          className={`falling-drop falling-drop-mini falling-drop-${drop.anim}`}
          style={{
            left: drop.left,
            width: drop.size,
            height: drop.size * 1.35,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
            '--drop-drift': `${drop.drift}px`,
            '--drop-opacity': drop.opacity,
            '--drop-hue': drop.hue
          }}
        />
      ))}

      {logoDrops.map((drop) => (
        <div
          key={drop.id}
          className={`falling-drop falling-drop-logo falling-drop-${drop.anim}`}
          style={{
            left: drop.left,
            width: drop.size,
            height: drop.size * 1.15,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
            '--drop-drift': `${drop.drift}px`,
            '--drop-opacity': drop.opacity
          }}
        >
          <BloodDropIcon size={drop.size} />
        </div>
      ))}
    </div>
  );
}
