import React, { useEffect, useState } from 'react';

interface ExerciseDemoProps {
  exerciseName: string;
  muscleGroup: string;
  isActive: boolean;
}

// ─── keyframe injection ───────────────────────────────────────────────────────
const KEYFRAMES = `
@keyframes squat-body { 0%,100%{transform:translateY(0)} 50%{transform:translateY(18px)} }
@keyframes squat-arm  { 0%,100%{transform:rotate(-20deg)} 50%{transform:rotate(30deg)} }
@keyframes squat-knee { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(40deg)} }

@keyframes lunge-front { 0%,100%{transform:translateX(0) translateY(0)} 50%{transform:translateX(14px) translateY(10px)} }
@keyframes lunge-back  { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-30deg)} }

@keyframes hip-body    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px) rotate(-8deg)} }
@keyframes hip-leg     { 0%,100%{transform:rotate(50deg)} 50%{transform:rotate(10deg)} }

@keyframes pushup-body { 0%,100%{transform:translateY(0)} 50%{transform:translateY(12px)} }
@keyframes pushup-arm  { 0%,100%{transform:rotate(-30deg)} 50%{transform:rotate(10deg)} }

@keyframes press-arm   { 0%,100%{transform:translateY(0) rotate(10deg)} 50%{transform:translateY(-22px) rotate(-10deg)} }
@keyframes press-body  { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.04)} }

@keyframes curl-arm    { 0%,100%{transform:rotate(30deg) } 50%{transform:rotate(-70deg)} }

@keyframes plank-arm   { 0%,100%{opacity:1} 50%{opacity:0.6} }
@keyframes plank-core  { 0%,100%{fill:rgba(255,26,114,0.2)} 50%{fill:rgba(255,26,114,0.55)} }

@keyframes deadlift-body { 0%,100%{transform:rotate(0deg) translateY(0)} 40%{transform:rotate(40deg) translateY(8px)} }
@keyframes deadlift-arm  { 0%,100%{transform:rotate(5deg)} 40%{transform:rotate(40deg)} }

@keyframes mountain-l  { 0%,100%{transform:translateX(0) translateY(0)} 50%{transform:translateX(10px) translateY(-10px)} }
@keyframes mountain-r  { 0%,50%{transform:translateX(0) translateY(0)} 100%{transform:translateX(-10px) translateY(-10px)} }

@keyframes jump-body   { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-18px)} }
@keyframes jump-leg    { 0%,100%{transform:rotate(0deg)} 40%{transform:rotate(30deg)} }
@keyframes jump-arm    { 0%,100%{transform:rotate(0deg)} 40%{transform:rotate(-80deg)} }

@keyframes row-body    { 0%,100%{transform:rotate(35deg)} }
@keyframes row-arm     { 0%,100%{transform:rotate(10deg)} 50%{transform:rotate(-40deg)} }

@keyframes calf-body   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
@keyframes calf-heel   { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-30deg)} }

@keyframes crunch-body { 0%,100%{transform:rotate(0deg) translateY(0)} 50%{transform:rotate(-30deg) translateY(-8px)} }

@keyframes tricep-body { 0%,100%{transform:translateY(0)} 50%{transform:translateY(14px)} }

@keyframes scan-line   { 0%{transform:translateY(-100%)} 100%{transform:translateY(300%)} }
@keyframes pulse-dot   { 0%,100%{opacity:1;r:3} 50%{opacity:0.3;r:5} }
@keyframes hud-fade    { 0%,100%{opacity:1} 50%{opacity:0.5} }
@keyframes rec-blink   { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes corner-glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
`;

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const el = document.createElement('style');
  el.textContent = KEYFRAMES;
  document.head.appendChild(el);
}

// ─── figure components ────────────────────────────────────────────────────────

const Head: React.FC<{ cx?: number; cy?: number }> = ({ cx = 50, cy = 14 }) => (
  <circle cx={cx} cy={cy} r={7} fill="none" stroke="#ff6eb4" strokeWidth="2.5" />
);

// ─── SQUAT ────────────────────────────────────────────────────────────────────
const SquatFigure: React.FC = () => (
  <g>
    <Head />
    {/* torso */}
    <line x1="50" y1="21" x2="50" y2="50" stroke="#ff6eb4" strokeWidth="2.5"
      style={{ animation: 'squat-body 1.2s ease-in-out infinite', transformOrigin: '50px 21px' }} />
    {/* arms */}
    <line x1="50" y1="28" x2="35" y2="40" stroke="#c084fc" strokeWidth="2"
      style={{ animation: 'squat-arm 1.2s ease-in-out infinite', transformOrigin: '50px 28px' }} />
    <line x1="50" y1="28" x2="65" y2="40" stroke="#c084fc" strokeWidth="2"
      style={{ animation: 'squat-arm 1.2s ease-in-out infinite reverse', transformOrigin: '50px 28px' }} />
    {/* legs */}
    <line x1="50" y1="50" x2="38" y2="70" stroke="#ff6eb4" strokeWidth="2.5"
      style={{ animation: 'squat-knee 1.2s ease-in-out infinite', transformOrigin: '50px 50px' }} />
    <line x1="38" y1="70" x2="35" y2="88" stroke="#ff6eb4" strokeWidth="2.5"
      style={{ animation: 'squat-knee 1.2s ease-in-out infinite reverse', transformOrigin: '38px 70px' }} />
    <line x1="50" y1="50" x2="62" y2="70" stroke="#ff6eb4" strokeWidth="2.5"
      style={{ animation: 'squat-knee 1.2s ease-in-out infinite reverse', transformOrigin: '50px 50px' }} />
    <line x1="62" y1="70" x2="65" y2="88" stroke="#ff6eb4" strokeWidth="2.5"
      style={{ animation: 'squat-knee 1.2s ease-in-out infinite', transformOrigin: '62px 70px' }} />
    {/* glow dots at knees */}
    <circle cx="38" cy="70" r="3" fill="#ff6eb4" opacity="0.7" style={{ animation: 'pulse-dot 1.2s infinite' }} />
    <circle cx="62" cy="70" r="3" fill="#ff6eb4" opacity="0.7" style={{ animation: 'pulse-dot 1.2s 0.3s infinite' }} />
  </g>
);

// ─── LUNGE ────────────────────────────────────────────────────────────────────
const LungeFigure: React.FC = () => (
  <g style={{ animation: 'lunge-front 1.4s ease-in-out infinite', transformOrigin: '50px 50px' }}>
    <Head />
    <line x1="50" y1="21" x2="50" y2="52" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="50" y1="30" x2="36" y2="45" stroke="#c084fc" strokeWidth="2" />
    <line x1="50" y1="30" x2="64" y2="38" stroke="#c084fc" strokeWidth="2" />
    {/* front leg bent */}
    <line x1="50" y1="52" x2="63" y2="70" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="63" y1="70" x2="68" y2="88" stroke="#ff6eb4" strokeWidth="2.5" />
    {/* back leg */}
    <line x1="50" y1="52" x2="38" y2="65" stroke="#ff6eb4" strokeWidth="2.5"
      style={{ animation: 'lunge-back 1.4s ease-in-out infinite', transformOrigin: '50px 52px' }} />
    <line x1="38" y1="65" x2="34" y2="88" stroke="#ff6eb4" strokeWidth="2.5" />
    <circle cx="63" cy="70" r="3" fill="#ff6eb4" opacity="0.7" style={{ animation: 'pulse-dot 1.4s infinite' }} />
  </g>
);

// ─── HIP THRUST / GLUTE BRIDGE ────────────────────────────────────────────────
const HipThrustFigure: React.FC = () => (
  <g>
    {/* ground */}
    <line x1="20" y1="88" x2="80" y2="88" stroke="rgba(255,110,180,0.3)" strokeWidth="1" />
    {/* shoulders on ground */}
    <circle cx="30" cy="80" r="7" fill="none" stroke="#ff6eb4" strokeWidth="2.5" />
    {/* torso lifting */}
    <g style={{ animation: 'hip-body 1.3s ease-in-out infinite', transformOrigin: '30px 80px' }}>
      <line x1="30" y1="80" x2="55" y2="68" stroke="#ff6eb4" strokeWidth="2.5" />
      {/* hip */}
      <circle cx="55" cy="68" r="3" fill="#ff6eb4" opacity="0.8" style={{ animation: 'pulse-dot 1.3s infinite' }} />
    </g>
    {/* legs */}
    <g style={{ animation: 'hip-leg 1.3s ease-in-out infinite', transformOrigin: '55px 68px' }}>
      <line x1="55" y1="68" x2="62" y2="88" stroke="#ff6eb4" strokeWidth="2.5" />
    </g>
    <g style={{ animation: 'hip-leg 1.3s ease-in-out infinite 0.1s', transformOrigin: '55px 68px' }}>
      <line x1="55" y1="68" x2="70" y2="88" stroke="#ff6eb4" strokeWidth="2.5" />
    </g>
    {/* arms */}
    <line x1="30" y1="75" x2="20" y2="85" stroke="#c084fc" strokeWidth="2" />
    <line x1="30" y1="75" x2="42" y2="85" stroke="#c084fc" strokeWidth="2" />
  </g>
);

// ─── PUSH-UP ──────────────────────────────────────────────────────────────────
const PushupFigure: React.FC = () => (
  <g>
    <line x1="20" y1="88" x2="80" y2="88" stroke="rgba(255,110,180,0.3)" strokeWidth="1" />
    <g style={{ animation: 'pushup-body 1.2s ease-in-out infinite', transformOrigin: '50px 70px' }}>
      {/* body plank */}
      <line x1="25" y1="78" x2="70" y2="62" stroke="#ff6eb4" strokeWidth="2.5" />
      {/* head */}
      <circle cx="72" cy="56" r="7" fill="none" stroke="#ff6eb4" strokeWidth="2.5" />
      {/* feet */}
      <line x1="25" y1="78" x2="22" y2="88" stroke="#ff6eb4" strokeWidth="2.5" />
    </g>
    {/* arms */}
    <g style={{ animation: 'pushup-arm 1.2s ease-in-out infinite', transformOrigin: '55px 68px' }}>
      <line x1="55" y1="68" x2="42" y2="80" stroke="#c084fc" strokeWidth="2" />
      <line x1="55" y1="68" x2="58" y2="82" stroke="#c084fc" strokeWidth="2" />
    </g>
    <circle cx="42" cy="80" r="3" fill="#c084fc" opacity="0.7" style={{ animation: 'pulse-dot 1.2s infinite' }} />
    <circle cx="58" cy="82" r="3" fill="#c084fc" opacity="0.7" style={{ animation: 'pulse-dot 1.2s 0.2s infinite' }} />
  </g>
);

// ─── SHOULDER PRESS ───────────────────────────────────────────────────────────
const ShoulderPressFigure: React.FC = () => (
  <g>
    <Head />
    <line x1="50" y1="21" x2="50" y2="52" stroke="#ff6eb4" strokeWidth="2.5"
      style={{ animation: 'press-body 1.2s ease-in-out infinite', transformOrigin: '50px 36px' }} />
    {/* arms raising */}
    <g style={{ animation: 'press-arm 1.2s ease-in-out infinite', transformOrigin: '50px 28px' }}>
      <line x1="50" y1="28" x2="30" y2="22" stroke="#c084fc" strokeWidth="2.5" />
      <line x1="30" y1="22" x2="26" y2="10" stroke="#c084fc" strokeWidth="2.5" />
    </g>
    <g style={{ animation: 'press-arm 1.2s ease-in-out infinite reverse', transformOrigin: '50px 28px' }}>
      <line x1="50" y1="28" x2="70" y2="22" stroke="#c084fc" strokeWidth="2.5" />
      <line x1="70" y1="22" x2="74" y2="10" stroke="#c084fc" strokeWidth="2.5" />
    </g>
    {/* weight bar */}
    <line x1="22" y1="9" x2="78" y2="9" stroke="#ff6eb4" strokeWidth="3"
      style={{ animation: 'press-arm 1.2s ease-in-out infinite', transformOrigin: '50px 9px' }} />
    {/* legs */}
    <line x1="50" y1="52" x2="42" y2="78" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="42" y1="78" x2="40" y2="90" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="50" y1="52" x2="58" y2="78" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="58" y1="78" x2="60" y2="90" stroke="#ff6eb4" strokeWidth="2.5" />
  </g>
);

// ─── BICEP CURL ───────────────────────────────────────────────────────────────
const BicepCurlFigure: React.FC = () => (
  <g>
    <Head />
    <line x1="50" y1="21" x2="50" y2="52" stroke="#ff6eb4" strokeWidth="2.5" />
    {/* static arm */}
    <line x1="50" y1="28" x2="34" y2="38" stroke="#c084fc" strokeWidth="2" />
    {/* curling arm */}
    <g style={{ animation: 'curl-arm 1.0s ease-in-out infinite', transformOrigin: '50px 28px' }}>
      <line x1="50" y1="28" x2="66" y2="38" stroke="#c084fc" strokeWidth="2.5" />
      <line x1="66" y1="38" x2="62" y2="55" stroke="#c084fc" strokeWidth="2.5" />
      {/* dumbbell */}
      <rect x="58" y="55" width="10" height="4" rx="2" fill="#ff6eb4" opacity="0.8" />
    </g>
    <line x1="50" y1="52" x2="42" y2="78" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="42" y1="78" x2="40" y2="90" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="50" y1="52" x2="58" y2="78" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="58" y1="78" x2="60" y2="90" stroke="#ff6eb4" strokeWidth="2.5" />
    <circle cx="66" cy="38" r="3" fill="#ff6eb4" opacity="0.7" style={{ animation: 'pulse-dot 1.0s infinite' }} />
  </g>
);

// ─── PLANK ────────────────────────────────────────────────────────────────────
const PlankFigure: React.FC = () => (
  <g>
    <line x1="15" y1="88" x2="85" y2="88" stroke="rgba(255,110,180,0.3)" strokeWidth="1" />
    {/* body */}
    <line x1="22" y1="72" x2="72" y2="60" stroke="#ff6eb4" strokeWidth="3" style={{ animation: 'plank-arm 2s infinite' }} />
    {/* head */}
    <circle cx="76" cy="54" r="7" fill="none" stroke="#ff6eb4" strokeWidth="2.5" />
    {/* arms */}
    <line x1="36" y1="68" x2="32" y2="80" stroke="#c084fc" strokeWidth="2.5" style={{ animation: 'plank-arm 2s infinite 0.3s' }} />
    <line x1="50" y1="64" x2="48" y2="76" stroke="#c084fc" strokeWidth="2.5" style={{ animation: 'plank-arm 2s infinite 0.6s' }} />
    {/* feet */}
    <line x1="22" y1="72" x2="18" y2="84" stroke="#ff6eb4" strokeWidth="2.5" />
    {/* core glow */}
    <ellipse cx="47" cy="66" rx="12" ry="5" style={{ animation: 'plank-core 2s infinite', transformOrigin: '47px 66px' }} transform="rotate(-15 47 66)" />
  </g>
);

// ─── DEADLIFT ─────────────────────────────────────────────────────────────────
const DeadliftFigure: React.FC = () => (
  <g>
    <line x1="20" y1="90" x2="80" y2="90" stroke="rgba(255,110,180,0.3)" strokeWidth="1" />
    <g style={{ animation: 'deadlift-body 1.8s ease-in-out infinite', transformOrigin: '50px 65px' }}>
      <Head cx={50} cy={14} />
      <line x1="50" y1="21" x2="50" y2="52" stroke="#ff6eb4" strokeWidth="2.5" />
      {/* arms down to bar */}
      <g style={{ animation: 'deadlift-arm 1.8s ease-in-out infinite', transformOrigin: '50px 30px' }}>
        <line x1="50" y1="30" x2="32" y2="50" stroke="#c084fc" strokeWidth="2" />
        <line x1="50" y1="30" x2="68" y2="50" stroke="#c084fc" strokeWidth="2" />
      </g>
    </g>
    {/* legs */}
    <line x1="50" y1="52" x2="40" y2="78" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="40" y1="78" x2="38" y2="90" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="50" y1="52" x2="60" y2="78" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="60" y1="78" x2="62" y2="90" stroke="#ff6eb4" strokeWidth="2.5" />
    {/* barbell */}
    <line x1="22" y1="83" x2="78" y2="83" stroke="#ff6eb4" strokeWidth="3" />
    <rect x="18" y="80" width="6" height="6" rx="1" fill="#ff6eb4" opacity="0.6" />
    <rect x="76" y="80" width="6" height="6" rx="1" fill="#ff6eb4" opacity="0.6" />
  </g>
);

// ─── MOUNTAIN CLIMBER ─────────────────────────────────────────────────────────
const MountainClimberFigure: React.FC = () => (
  <g>
    <line x1="15" y1="88" x2="85" y2="88" stroke="rgba(255,110,180,0.3)" strokeWidth="1" />
    {/* plank body */}
    <circle cx="76" cy="42" r="7" fill="none" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="76" y1="49" x2="30" y2="68" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="30" y1="68" x2="24" y2="80" stroke="#ff6eb4" strokeWidth="2.5" />
    {/* arms */}
    <line x1="55" y1="60" x2="46" y2="72" stroke="#c084fc" strokeWidth="2" />
    <line x1="40" y1="64" x2="34" y2="76" stroke="#c084fc" strokeWidth="2" />
    {/* alternating legs */}
    <g style={{ animation: 'mountain-l 0.7s ease-in-out infinite', transformOrigin: '30px 68px' }}>
      <line x1="30" y1="68" x2="42" y2="82" stroke="#ff6eb4" strokeWidth="2.5" />
    </g>
    <g style={{ animation: 'mountain-r 0.7s ease-in-out infinite', transformOrigin: '30px 68px' }}>
      <line x1="30" y1="68" x2="18" y2="82" stroke="#ff6eb4" strokeWidth="2.5" />
    </g>
    <circle cx="42" cy="72" r="3" fill="#ff6eb4" opacity="0.7" style={{ animation: 'pulse-dot 0.7s infinite' }} />
  </g>
);

// ─── JUMP / JUMPING JACKS ─────────────────────────────────────────────────────
const JumpFigure: React.FC = () => (
  <g style={{ animation: 'jump-body 0.8s ease-in-out infinite', transformOrigin: '50px 55px' }}>
    <Head />
    <line x1="50" y1="21" x2="50" y2="52" stroke="#ff6eb4" strokeWidth="2.5" />
    <g style={{ animation: 'jump-arm 0.8s ease-in-out infinite', transformOrigin: '50px 28px' }}>
      <line x1="50" y1="28" x2="32" y2="22" stroke="#c084fc" strokeWidth="2" />
    </g>
    <g style={{ animation: 'jump-arm 0.8s ease-in-out infinite reverse', transformOrigin: '50px 28px' }}>
      <line x1="50" y1="28" x2="68" y2="22" stroke="#c084fc" strokeWidth="2" />
    </g>
    <g style={{ animation: 'jump-leg 0.8s ease-in-out infinite', transformOrigin: '50px 52px' }}>
      <line x1="50" y1="52" x2="36" y2="72" stroke="#ff6eb4" strokeWidth="2.5" />
      <line x1="36" y1="72" x2="32" y2="88" stroke="#ff6eb4" strokeWidth="2.5" />
    </g>
    <g style={{ animation: 'jump-leg 0.8s ease-in-out infinite reverse', transformOrigin: '50px 52px' }}>
      <line x1="50" y1="52" x2="64" y2="72" stroke="#ff6eb4" strokeWidth="2.5" />
      <line x1="64" y1="72" x2="68" y2="88" stroke="#ff6eb4" strokeWidth="2.5" />
    </g>
  </g>
);

// ─── ROW ──────────────────────────────────────────────────────────────────────
const RowFigure: React.FC = () => (
  <g>
    <line x1="15" y1="88" x2="85" y2="88" stroke="rgba(255,110,180,0.3)" strokeWidth="1" />
    <g style={{ transform: 'rotate(35deg)', transformOrigin: '50px 60px' }}>
      <Head cx={62} cy={38} />
      <line x1="62" y1="45" x2="38" y2="58" stroke="#ff6eb4" strokeWidth="2.5" />
      {/* pulling arm */}
      <g style={{ animation: 'row-arm 1.2s ease-in-out infinite', transformOrigin: '52px 50px' }}>
        <line x1="52" y1="50" x2="62" y2="38" stroke="#c084fc" strokeWidth="2.5" />
        <line x1="52" y1="50" x2="38" y2="62" stroke="#c084fc" strokeWidth="2.5" />
      </g>
    </g>
    <line x1="42" y1="74" x2="38" y2="88" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="55" y1="70" x2="54" y2="88" stroke="#ff6eb4" strokeWidth="2.5" />
    <circle cx="38" cy="62" r="3" fill="#ff6eb4" opacity="0.7" style={{ animation: 'pulse-dot 1.2s infinite' }} />
  </g>
);

// ─── CALF RAISE ───────────────────────────────────────────────────────────────
const CalfRaiseFigure: React.FC = () => (
  <g style={{ animation: 'calf-body 1.0s ease-in-out infinite', transformOrigin: '50px 50px' }}>
    <Head />
    <line x1="50" y1="21" x2="50" y2="52" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="50" y1="28" x2="36" y2="40" stroke="#c084fc" strokeWidth="2" />
    <line x1="50" y1="28" x2="64" y2="40" stroke="#c084fc" strokeWidth="2" />
    <line x1="50" y1="52" x2="42" y2="72" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="50" y1="52" x2="58" y2="72" stroke="#ff6eb4" strokeWidth="2.5" />
    {/* heels lifting */}
    <g style={{ animation: 'calf-heel 1.0s ease-in-out infinite', transformOrigin: '42px 72px' }}>
      <line x1="42" y1="72" x2="40" y2="90" stroke="#ff6eb4" strokeWidth="2.5" />
    </g>
    <g style={{ animation: 'calf-heel 1.0s ease-in-out infinite 0.1s', transformOrigin: '58px 72px' }}>
      <line x1="58" y1="72" x2="60" y2="90" stroke="#ff6eb4" strokeWidth="2.5" />
    </g>
    <circle cx="40" cy="88" r="3" fill="#ff6eb4" opacity="0.7" style={{ animation: 'pulse-dot 1.0s infinite' }} />
    <circle cx="60" cy="88" r="3" fill="#ff6eb4" opacity="0.7" style={{ animation: 'pulse-dot 1.0s 0.2s infinite' }} />
  </g>
);

// ─── CRUNCH / AB ──────────────────────────────────────────────────────────────
const CrunchFigure: React.FC = () => (
  <g>
    <line x1="15" y1="88" x2="85" y2="88" stroke="rgba(255,110,180,0.3)" strokeWidth="1" />
    {/* legs on ground */}
    <line x1="40" y1="80" x2="55" y2="70" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="55" y1="70" x2="65" y2="82" stroke="#ff6eb4" strokeWidth="2.5" />
    <line x1="65" y1="82" x2="68" y2="88" stroke="#ff6eb4" strokeWidth="2.5" />
    {/* torso crunching */}
    <g style={{ animation: 'crunch-body 1.2s ease-in-out infinite', transformOrigin: '40px 80px' }}>
      <line x1="40" y1="80" x2="28" y2="62" stroke="#ff6eb4" strokeWidth="2.5" />
      <circle cx="24" cy="55" r="7" fill="none" stroke="#ff6eb4" strokeWidth="2.5" />
      {/* arms reaching */}
      <line x1="34" y1="71" x2="50" y2="62" stroke="#c084fc" strokeWidth="2" />
    </g>
    {/* core glow */}
    <ellipse cx="40" cy="76" rx="8" ry="5" style={{ animation: 'plank-core 1.2s infinite' }} />
  </g>
);

// ─── TRICEP DIP ───────────────────────────────────────────────────────────────
const TricepDipFigure: React.FC = () => (
  <g>
    {/* bench */}
    <rect x="18" y="54" width="64" height="5" rx="2" fill="rgba(255,110,180,0.2)" stroke="rgba(255,110,180,0.4)" strokeWidth="1" />
    <g style={{ animation: 'tricep-body 1.1s ease-in-out infinite', transformOrigin: '50px 59px' }}>
      <Head cx={50} cy={34} />
      <line x1="50" y1="41" x2="50" y2="59" stroke="#ff6eb4" strokeWidth="2.5" />
      {/* arms on bench */}
      <line x1="50" y1="48" x2="30" y2="54" stroke="#c084fc" strokeWidth="2.5" />
      <line x1="50" y1="48" x2="70" y2="54" stroke="#c084fc" strokeWidth="2.5" />
      {/* legs out */}
      <line x1="50" y1="59" x2="34" y2="74" stroke="#ff6eb4" strokeWidth="2.5" />
      <line x1="34" y1="74" x2="28" y2="88" stroke="#ff6eb4" strokeWidth="2.5" />
      <line x1="50" y1="59" x2="66" y2="74" stroke="#ff6eb4" strokeWidth="2.5" />
      <line x1="66" y1="74" x2="72" y2="88" stroke="#ff6eb4" strokeWidth="2.5" />
    </g>
    <circle cx="30" cy="54" r="3" fill="#c084fc" opacity="0.7" style={{ animation: 'pulse-dot 1.1s infinite' }} />
    <circle cx="70" cy="54" r="3" fill="#c084fc" opacity="0.7" style={{ animation: 'pulse-dot 1.1s 0.3s infinite' }} />
  </g>
);

// ─── FIGURE SELECTOR ──────────────────────────────────────────────────────────
function getFigure(name: string, muscle: string): React.ReactNode {
  const n = name.toLowerCase();
  const m = muscle.toLowerCase();

  if (n.includes('squat') || n.includes('goblet')) return <SquatFigure />;
  if (n.includes('lunge') || n.includes('step')) return <LungeFigure />;
  if (n.includes('hip') || n.includes('glute bridge') || n.includes('thrust')) return <HipThrustFigure />;
  if (n.includes('push') || n.includes('press') && m.includes('chest')) return <PushupFigure />;
  if (n.includes('shoulder') || n.includes('overhead') || n.includes('press')) return <ShoulderPressFigure />;
  if (n.includes('curl') || n.includes('bicep')) return <BicepCurlFigure />;
  if (n.includes('plank') || n.includes('hold')) return <PlankFigure />;
  if (n.includes('deadlift') || n.includes('rdl')) return <DeadliftFigure />;
  if (n.includes('mountain') || n.includes('climber')) return <MountainClimberFigure />;
  if (n.includes('jump') || n.includes('jack') || n.includes('burpee')) return <JumpFigure />;
  if (n.includes('row') || m.includes('back')) return <RowFigure />;
  if (n.includes('calf') || n.includes('raise') && m.includes('calf')) return <CalfRaiseFigure />;
  if (n.includes('crunch') || n.includes('sit') || m.includes('core') || m.includes('abs')) return <CrunchFigure />;
  if (n.includes('tricep') || n.includes('dip') || n.includes('extension')) return <TricepDipFigure />;

  // fallback by muscle
  if (m.includes('glute') || m.includes('hamstring')) return <HipThrustFigure />;
  if (m.includes('quad') || m.includes('leg')) return <SquatFigure />;
  if (m.includes('shoulder') || m.includes('delt')) return <ShoulderPressFigure />;
  if (m.includes('arm') || m.includes('bicep')) return <BicepCurlFigure />;
  if (m.includes('core') || m.includes('ab')) return <PlankFigure />;
  return <SquatFigure />;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export const ExerciseDemo: React.FC<ExerciseDemoProps> = ({ exerciseName, muscleGroup, isActive }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => { injectStyles(); }, []);

  // frame counter for HUD blink
  useEffect(() => {
    if (!isActive) return;
    const iv = setInterval(() => setFrame((f) => f + 1), 80);
    return () => clearInterval(iv);
  }, [isActive]);

  const figure = getFigure(exerciseName, muscleGroup);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      background: 'linear-gradient(135deg, rgba(10,0,20,0.95) 0%, rgba(30,0,50,0.95) 100%)',
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(255,26,114,0.4)',
      boxShadow: isActive ? '0 0 20px rgba(255,26,114,0.25), inset 0 0 40px rgba(255,26,114,0.05)' : 'none',
      paddingBottom: '75%',
    }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>

        {/* HUD top bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '4px 8px',
          background: 'rgba(255,26,114,0.1)',
          borderBottom: '1px solid rgba(255,26,114,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: isActive ? '#ff1a72' : '#666',
              animation: isActive ? 'rec-blink 1s infinite' : 'none',
            }} />
            <span style={{ fontSize: '0.5rem', color: '#ff6eb4', letterSpacing: '0.15em', fontWeight: 700 }}>
              {isActive ? 'AI MOTION CAPTURE' : 'DEMO'}
            </span>
          </div>
          <span style={{ fontSize: '0.45rem', color: 'rgba(255,110,180,0.6)', letterSpacing: '0.1em' }}>
            GYMHUB·AI
          </span>
        </div>

        {/* SVG figure area */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 100 100" width="80%" height="80%" style={{ overflow: 'visible' }}>
            {/* grid */}
            <defs>
              <pattern id={`grid-${exerciseName}`} width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,26,114,0.08)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill={`url(#grid-${exerciseName})`} />
            {figure}
            {/* scanning line */}
            {isActive && (
              <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(255,110,180,0.35)" strokeWidth="1.5"
                style={{ animation: 'scan-line 2s linear infinite' }} />
            )}
          </svg>

          {/* corner decorations */}
          {['tl','tr','bl','br'].map(pos => (
            <div key={pos} style={{
              position: 'absolute',
              width: 10, height: 10,
              [pos.includes('t') ? 'top' : 'bottom']: 4,
              [pos.includes('l') ? 'left' : 'right']: 4,
              borderTop: pos.includes('t') ? '2px solid rgba(255,110,180,0.5)' : 'none',
              borderBottom: pos.includes('b') ? '2px solid rgba(255,110,180,0.5)' : 'none',
              borderLeft: pos.includes('l') ? '2px solid rgba(255,110,180,0.5)' : 'none',
              borderRight: pos.includes('r') ? '2px solid rgba(255,110,180,0.5)' : 'none',
              animation: 'corner-glow 2s infinite',
            }} />
          ))}
        </div>

        {/* bottom label */}
        <div style={{
          padding: '3px 8px 5px',
          background: 'rgba(0,0,0,0.4)',
          borderTop: '1px solid rgba(255,26,114,0.15)',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '0.55rem', color: '#ff6eb4',
            letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700,
          }}>
            {exerciseName}
          </div>
          <div style={{ fontSize: '0.45rem', color: 'rgba(255,110,180,0.5)', marginTop: 1 }}>
            TARGET: {muscleGroup.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
