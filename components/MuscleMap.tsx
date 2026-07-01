import React, { useEffect, useState } from 'react';

interface MuscleMapProps {
  muscleGroup: string;
  size?: number;
  animate?: boolean;
}

// Map muscle group names to region IDs
function getRegions(muscleGroup: string): string[] {
  const mg = muscleGroup.toLowerCase();
  if (mg.includes('glut')) return ['glutes', 'hips'];
  if (mg.includes('hamstring')) return ['hamstrings'];
  if (mg.includes('quad')) return ['quads'];
  if (mg.includes('core') || mg.includes('abs')) return ['abs', 'core'];
  if (mg.includes('back') || mg.includes('lat')) return ['upperback', 'lowerback'];
  if (mg.includes('chest')) return ['chest'];
  if (mg.includes('shoulder') || mg.includes('delt')) return ['shoulderL', 'shoulderR'];
  if (mg.includes('bicep') || mg.includes('arm')) return ['upperarmL', 'upperarmR'];
  if (mg.includes('tricep')) return ['upperarmL', 'upperarmR'];
  if (mg.includes('calf') || mg.includes('calves')) return ['calfL', 'calfR'];
  if (mg.includes('inner') || mg.includes('adduct') || mg.includes('thigh')) return ['quads', 'hamstrings'];
  if (mg.includes('hip')) return ['hips', 'glutes'];
  if (mg.includes('full') || mg.includes('total')) return ['chest', 'abs', 'quads', 'glutes'];
  // Default
  return ['abs'];
}

const BODY_REGIONS: Record<string, { d: string; cx: number; cy: number }> = {
  head:       { d: '', cx: 40, cy: 13 },
  neck:       { d: 'M36,23 L44,23 L43,30 L37,30 Z', cx: 40, cy: 26 },
  chest:      { d: 'M23,31 Q40,28 57,31 L55,52 Q40,54 25,52 Z', cx: 40, cy: 42 },
  shoulderL:  { d: 'M9,31 Q18,28 23,31 L22,50 Q16,52 10,48 Z', cx: 16, cy: 40 },
  shoulderR:  { d: 'M57,31 Q62,28 71,31 L70,48 Q64,52 58,50 Z', cx: 64, cy: 40 },
  upperarmL:  { d: 'M10,50 L20,50 L19,68 L9,66 Z', cx: 14, cy: 58 },
  upperarmR:  { d: 'M60,50 L70,50 L71,66 L61,68 Z', cx: 66, cy: 58 },
  forearmL:   { d: 'M10,68 L19,68 L18,84 L11,82 Z', cx: 14, cy: 76 },
  forearmR:   { d: 'M61,68 L70,68 L69,82 L62,84 Z', cx: 65, cy: 76 },
  abs:        { d: 'M25,52 Q40,54 55,52 L54,72 Q40,74 26,72 Z', cx: 40, cy: 62 },
  core:       { d: 'M26,72 Q40,74 54,72 L53,82 Q40,84 27,82 Z', cx: 40, cy: 77 },
  hips:       { d: 'M24,82 Q40,86 56,82 L57,95 Q40,98 23,95 Z', cx: 40, cy: 89 },
  glutes:     { d: 'M24,82 Q40,86 56,82 L57,97 Q40,100 23,97 Z', cx: 40, cy: 89 },
  quads:      { d: 'M24,97 L38,97 L37,122 L23,120 Z M42,97 L56,97 L57,120 L43,122 Z', cx: 40, cy: 109 },
  hamstrings: { d: 'M24,97 L38,97 L37,122 L23,120 Z M42,97 L56,97 L57,120 L43,122 Z', cx: 40, cy: 109 },
  calfL:      { d: 'M24,122 L37,122 L36,142 L25,140 Z', cx: 30, cy: 132 },
  calfR:      { d: 'M43,122 L56,122 L55,140 L44,142 Z', cx: 50, cy: 132 },
  upperback:  { d: 'M23,31 Q40,28 57,31 L55,52 Q40,54 25,52 Z', cx: 40, cy: 42 },
  lowerback:  { d: 'M25,52 Q40,54 55,52 L54,72 Q40,74 26,72 Z', cx: 40, cy: 62 },
};

const BODY_OUTLINE = `
  M40,3 m-8,0 a8,8 0 1,1 16,0 a8,8 0 1,1 -16,0
  M36,21 L44,21 L45,30 L35,30 Z
  M23,30 Q40,26 57,30 L58,54 Q40,56 22,54 Z
  M9,30 Q18,26 23,30 L22,54 Q15,56 8,50 Z
  M57,30 Q62,26 71,30 L72,50 Q65,56 58,54 Z
  M9,50 L21,50 L20,68 L8,66 Z
  M59,50 L71,50 L72,66 L60,68 Z
  M9,66 L20,66 L19,84 L10,82 Z
  M60,66 L71,66 L70,82 L61,84 Z
  M22,54 Q40,56 58,54 L57,74 Q40,76 23,74 Z
  M23,74 Q40,76 57,74 L58,84 Q40,87 22,84 Z
  M22,84 Q40,88 58,84 L59,98 Q40,101 21,98 Z
  M22,98 L37,98 L36,124 L21,122 Z
  M43,98 L58,98 L59,122 L44,124 Z
  M22,122 L36,122 L35,144 L23,142 Z
  M44,122 L58,122 L57,142 L45,144 Z
`;

export const MuscleMap: React.FC<MuscleMapProps> = ({ muscleGroup, size = 80, animate = true }) => {
  const [pulse, setPulse] = useState(true);
  const activeRegions = getRegions(muscleGroup);

  useEffect(() => {
    if (!animate) return;
    const iv = setInterval(() => setPulse((p) => !p), 900);
    return () => clearInterval(iv);
  }, [animate]);

  const scale = size / 80;
  const h = 150 * scale;

  return (
    <div style={{ width: size, height: h, position: 'relative', flexShrink: 0 }}>
      <svg
        viewBox="0 0 80 150"
        width={size}
        height={h}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id={`glow-${muscleGroup.replace(/\s/g, '')}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="muscleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff1a72" stopOpacity="1" />
            <stop offset="100%" stopColor="#9b00ff" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Body outline — all regions subtle grey */}
        {Object.entries(BODY_REGIONS).map(([id, region]) => {
          if (id === 'head') return null;
          const isActive = activeRegions.includes(id);
          return (
            <path
              key={id}
              d={region.d}
              fill={isActive
                ? (pulse ? 'rgba(255,26,114,0.35)' : 'rgba(255,26,114,0.55)')
                : 'rgba(255,255,255,0.05)'}
              stroke={isActive ? '#ff1a72' : 'rgba(255,255,255,0.15)'}
              strokeWidth={isActive ? 1.5 : 0.8}
              style={{
                transition: 'fill 0.4s ease, stroke 0.4s ease',
                filter: isActive ? `url(#glow-${muscleGroup.replace(/\s/g, '')})` : 'none',
              }}
            />
          );
        })}

        {/* Head */}
        <circle
          cx="40" cy="13" r="9"
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.8"
        />

        {/* Scan line animation */}
        {animate && (
          <rect
            x="0" y="0" width="80" height="2"
            fill="rgba(255,26,114,0.25)"
            style={{
              animation: 'scanBody 2.5s linear infinite',
            }}
          />
        )}

        {/* Active region label dot */}
        {activeRegions.slice(0, 1).map((id) => {
          const r = BODY_REGIONS[id];
          if (!r || id === 'head') return null;
          return (
            <circle
              key={`dot-${id}`}
              cx={r.cx} cy={r.cy} r="3"
              fill="#ff1a72"
              style={{
                filter: 'drop-shadow(0 0 4px #ff1a72)',
                opacity: pulse ? 1 : 0.5,
                transition: 'opacity 0.4s',
              }}
            />
          );
        })}
      </svg>

      {/* Scan line keyframe via style tag */}
      <style>{`
        @keyframes scanBody {
          0%   { transform: translateY(0px);   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(150px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
