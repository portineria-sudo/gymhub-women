import React, { useState, useEffect } from 'react';
import { Heart, Flame, Clock, Zap, Star, MapPin, Car, Gift, ChevronRight, Dumbbell } from 'lucide-react';
import type { WorkoutStats, TaxiDriver } from '../types';

interface PostWorkoutProps {
  stats: WorkoutStats;
  userName: string;
}

type TaxiState = 'idle' | 'searching' | 'found' | 'arriving' | 'arrived';

const DRIVERS: TaxiDriver[] = [
  { name: 'Aisha Al-Mansoori', car: 'Tesla Model 3', plate: 'D·54321', eta: 4, rating: 4.97, avatar: '👩' },
  { name: 'Fatima Al-Zahra', car: 'BMW 5 Series', plate: 'D·78234', eta: 6, rating: 4.92, avatar: '👩‍🦱' },
  { name: 'Sara Al-Rashid', car: 'Mercedes C-Class', plate: 'D·93012', eta: 3, rating: 4.99, avatar: '🧕' },
];

const GYMHUB_LOCATIONS = [
  { name: 'GymHub Marina', area: 'Dubai Marina', distance: '1.2 km', capsules: 8 },
  { name: 'GymHub JBR', area: 'Jumeirah Beach', distance: '2.1 km', capsules: 6 },
  { name: 'GymHub DIFC', area: 'DIFC — Downtown', distance: '3.4 km', capsules: 10 },
];

function computeScore(stats: WorkoutStats): number {
  const repScore = Math.min(50, (stats.totalReps / 60) * 50);
  const hrScore = Math.min(30, stats.avgHeartRate > 100 ? 30 : (stats.avgHeartRate / 100) * 30);
  const calScore = Math.min(20, (stats.caloriesBurned / 200) * 20);
  return Math.round(repScore + hrScore + calScore);
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

export const PostWorkout: React.FC<PostWorkoutProps> = ({ stats, userName }) => {
  const [score, setScore] = useState(0);
  const [targetScore] = useState(computeScore(stats));
  const [taxiState, setTaxiState] = useState<TaxiState>('idle');
  const [driver, setDriver] = useState<TaxiDriver | null>(null);
  const [etaCountdown, setEtaCountdown] = useState(0);
  const [selectedLocation] = useState(GYMHUB_LOCATIONS[0]);
  const [showLocations, setShowLocations] = useState(false);
  const [activeLocation, setActiveLocation] = useState(GYMHUB_LOCATIONS[0]);

  // Animate score
  useEffect(() => {
    let current = 0;
    const iv = setInterval(() => {
      current = Math.min(targetScore, current + 2);
      setScore(current);
      if (current >= targetScore) clearInterval(iv);
    }, 30);
    return () => clearInterval(iv);
  }, [targetScore]);

  // ETA countdown
  useEffect(() => {
    if (taxiState === 'arriving' && etaCountdown > 0) {
      const t = setTimeout(() => setEtaCountdown((e) => e - 1), 1000);
      return () => clearTimeout(t);
    }
    if (taxiState === 'arriving' && etaCountdown === 0) {
      setTaxiState('arrived');
    }
  }, [taxiState, etaCountdown]);

  const bookTaxi = () => {
    setTaxiState('searching');
    setTimeout(() => {
      const d = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
      setDriver(d);
      setTaxiState('found');
      setTimeout(() => {
        setEtaCountdown(d.eta * 60);
        setTaxiState('arriving');
      }, 2500);
    }, 3000);
  };

  // SVG score ring
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const scoreEmoji = score >= 80 ? '🔥' : score >= 60 ? '💪' : score >= 40 ? '👍' : '🌱';
  const scoreLabel = score >= 80 ? 'CRUSHING IT!' : score >= 60 ? 'GREAT WORK!' : score >= 40 ? 'GOOD SESSION' : 'KEEP GOING!';

  return (
    <div className="relative min-h-screen bg-dark flex flex-col px-5 py-8 overflow-hidden">
      <div className="orb orb-2" style={{ opacity: 0.35 }} />

      {/* Header */}
      <div className="text-center mb-6 relative z-10 slide-up">
        <div className="neon-badge mb-3">Workout Complete</div>
        <h2 className="text-2xl font-bold text-main">
          Amazing, <span className="gradient-text-2">{userName}</span>! 💗
        </h2>
        <p className="text-muted text-sm mt-1">You absolutely crushed that session</p>
      </div>

      {/* Score ring */}
      <div className="flex justify-center mb-6 relative z-10">
        <div className="relative" style={{ width: 150, height: 150 }}>
          <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="75" cy="75" r={radius} fill="none" strokeWidth="8" stroke="var(--border-subtle)" />
            <circle cx="75" cy="75" r={radius} fill="none" strokeWidth="8"
              stroke="url(#scoreGrad)" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset} className="score-circle" />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff1a72" />
                <stop offset="100%" stopColor="#9b00ff" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div style={{ fontSize: '1.8rem' }}>{scoreEmoji}</div>
            <div className="font-black text-main" style={{ fontSize: '1.8rem', lineHeight: 1 }}>{score}</div>
            <div className="text-muted text-xs">/ 100</div>
          </div>
        </div>
      </div>

      <div className="text-center mb-6 relative z-10">
        <div className="gradient-text font-black text-xl tracking-widest">{scoreLabel}</div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
        {[
          { icon: <Clock size={18} className="text-pink" />, value: formatTime(stats.durationSeconds), label: 'Duration' },
          { icon: <Flame size={18} className="text-pink" />, value: `${Math.round(stats.caloriesBurned)} kcal`, label: 'Burned' },
          { icon: <Heart size={18} className="text-pink hr-pulse" />, value: `${stats.avgHeartRate} BPM`, label: 'Avg Heart Rate' },
          { icon: <Zap size={18} className="text-pink" />, value: `${stats.totalReps}`, label: 'Total Reps' },
        ].map((s) => (
          <div key={s.label} className="glass-card px-4 py-4 flex items-center gap-3">
            {s.icon}
            <div>
              <div className="text-main font-bold text-base leading-tight">{s.value}</div>
              <div className="text-muted text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════
           FREE FIRST CLASS + TAXI CTA — HERO BLOCK
          ═══════════════════════════════════════════ */}
      <div className="relative z-10 mb-4">
        <div className="glow-line mb-6" />

        {/* Capsule image banner */}
        <div className="relative rounded-2xl overflow-hidden mb-4"
          style={{ border: '1px solid rgba(255,26,114,0.4)', boxShadow: '0 0 32px rgba(255,26,114,0.2)' }}>
          <img src="./capsule.png" alt="GymHub Capsule"
            style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
          {/* Dark overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,0,20,0.9) 0%, rgba(10,0,20,0.2) 60%, transparent 100%)' }} />
          {/* FREE badge */}
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'linear-gradient(135deg, #ff1a72, #9b00ff)',
            borderRadius: 99, padding: '4px 14px',
            fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.15em', color: '#fff',
            boxShadow: '0 0 18px rgba(255,26,114,0.7)'
          }}>✦ FREE</div>
          {/* Bottom text */}
          <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff', letterSpacing: '0.05em', lineHeight: 1.2 }}>
              FIRST CLASS AT GYMHUB
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>
              Train with real AI-powered capsule equipment · Women Only
            </div>
          </div>
        </div>

        {/* Features row */}
        <div className="flex gap-2 mb-4">
          {[
            { icon: '🤖', text: 'AI Coach + Real Equipment' },
            { icon: '🔒', text: 'Private Capsule' },
            { icon: '💗', text: 'Women Only' },
          ].map((f) => (
            <div key={f.text} className="flex-1 glass-card px-2 py-2 text-center"
              style={{ border: '1px solid rgba(255,26,114,0.15)' }}>
              <div style={{ fontSize: '1rem' }}>{f.icon}</div>
              <div className="text-muted" style={{ fontSize: '0.6rem', lineHeight: 1.3, marginTop: 2 }}>{f.text}</div>
            </div>
          ))}
        </div>

        {/* Taxi booking section */}
        {taxiState === 'idle' && (
          <div className="slide-up">
            {/* Location selector */}
            <button
              className="w-full flex items-center gap-3 mb-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(255,26,114,0.06)', border: '1px solid rgba(255,26,114,0.2)' }}
              onClick={() => setShowLocations(!showLocations)}>
              <MapPin size={16} className="text-pink flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="text-main text-sm font-semibold">{activeLocation.name}</div>
                <div className="text-muted text-xs">{activeLocation.area} · {activeLocation.distance} away · {activeLocation.capsules} capsules</div>
              </div>
              <ChevronRight size={16} className="text-muted" style={{ transform: showLocations ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {showLocations && (
              <div className="glass-card mb-3 overflow-hidden"
                style={{ border: '1px solid rgba(255,26,114,0.2)' }}>
                {GYMHUB_LOCATIONS.map((loc, i) => (
                  <button key={loc.name}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    style={{ borderBottom: i < GYMHUB_LOCATIONS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      background: activeLocation.name === loc.name ? 'rgba(255,26,114,0.1)' : 'transparent' }}
                    onClick={() => { setActiveLocation(loc); setShowLocations(false); }}>
                    <div className="flex-shrink-0 text-pink">
                      {activeLocation.name === loc.name ? '✦' : '○'}
                    </div>
                    <div className="flex-1">
                      <div className="text-main text-sm font-semibold">{loc.name}</div>
                      <div className="text-muted text-xs">{loc.area} · {loc.distance} · {loc.capsules} capsules available</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Main CTA button */}
            <button className="btn-neon w-full py-4 relative overflow-hidden" onClick={bookTaxi}
              style={{ background: 'linear-gradient(135deg, #ff1a72 0%, #9b00ff 100%)', fontSize: '0.95rem', fontWeight: 900, letterSpacing: '0.08em' }}>
              <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Gift size={20} />
                BOOK FREE CLASS + FREE TAXI
              </span>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)', pointerEvents: 'none' }} />
            </button>

            {/* Sub-labels */}
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Car size={11} className="text-muted" />
                <span className="text-muted" style={{ fontSize: '0.65rem' }}>Free Dubai taxi included</span>
              </div>
              <div className="text-muted" style={{ fontSize: '0.65rem' }}>·</div>
              <div className="flex items-center gap-1">
                <Dumbbell size={11} className="text-muted" />
                <span className="text-muted" style={{ fontSize: '0.65rem' }}>Real capsule equipment</span>
              </div>
              <div className="text-muted" style={{ fontSize: '0.65rem' }}>·</div>
              <div className="flex items-center gap-1">
                <span className="text-muted" style={{ fontSize: '0.65rem' }}>No credit card needed</span>
              </div>
            </div>
          </div>
        )}

        {taxiState === 'searching' && (
          <div className="text-center fade-in">
            <div className="text-main font-semibold mb-2">Finding your driver...</div>
            <div className="text-muted text-xs mb-4">Booking your free class at <span className="text-pink">{activeLocation.name}</span></div>
            <div className="taxi-radar mx-auto mb-4" style={{ width: 80, height: 80 }}>
              <div className="taxi-radar-ring" style={{ width: 48, height: 48 }} />
              <div className="taxi-radar-ring" style={{ width: 48, height: 48 }} />
              <div className="taxi-radar-ring" style={{ width: 48, height: 48 }} />
              <div className="glass-card flex items-center justify-center relative z-10"
                style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(255,26,114,0.5)' }}>
                <Car size={20} className="text-pink" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-muted text-sm">
              <span className="loading loading-dots loading-sm text-pink" />
              <span>Scanning drivers near you...</span>
            </div>
          </div>
        )}

        {(taxiState === 'found' || taxiState === 'arriving' || taxiState === 'arrived') && driver && (
          <div className="slide-up">
            {/* Confirmation banner */}
            <div className="rounded-xl px-4 py-3 mb-3 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, rgba(255,26,114,0.15), rgba(155,0,255,0.15))', border: '1px solid rgba(255,26,114,0.3)' }}>
              <Gift size={18} className="text-pink flex-shrink-0" />
              <div>
                <div className="text-main text-sm font-bold">First class booked — FREE! 🎉</div>
                <div className="text-muted text-xs">En route to <span className="text-pink">{activeLocation.name}</span> · {activeLocation.area}</div>
              </div>
            </div>

            {taxiState === 'arrived' && (
              <div className="text-center mb-3 fade-in">
                <div style={{ fontSize: '2rem' }}>🎉</div>
                <div className="font-black text-main text-lg gradient-text">YOUR DRIVER IS HERE!</div>
                <div className="text-muted text-xs mt-1">Enjoy your free class at {activeLocation.name}, {userName}! 💗</div>
              </div>
            )}

            <div className="glass-card p-4" style={{ border: '1px solid rgba(255,26,114,0.25)' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 flex items-center justify-center"
                  style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,26,114,0.15)', border: '1px solid rgba(255,26,114,0.3)', fontSize: '1.8rem' }}>
                  {driver.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-main font-bold">{driver.name}</div>
                  <div className="text-muted text-xs">{driver.car}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={11} style={{ color: '#f59e0b' }} />
                    <span className="text-muted text-xs">{driver.rating}</span>
                    <span className="text-muted text-xs ml-2">· {driver.plate}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-black text-xl text-main">
                    {taxiState === 'arrived' ? '✓' :
                     taxiState === 'arriving'
                       ? `${Math.floor(etaCountdown / 60)}:${String(etaCountdown % 60).padStart(2, '0')}`
                       : `${driver.eta} min`}
                  </div>
                  <div className="text-muted text-xs">{taxiState === 'arrived' ? 'Arrived!' : 'ETA'}</div>
                </div>
              </div>

              {/* Destination bar */}
              <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: 'rgba(255,26,114,0.08)', border: '1px solid rgba(255,26,114,0.15)' }}>
                <MapPin size={14} className="text-pink" />
                <div className="flex-1">
                  <span className="text-main text-xs font-semibold">{activeLocation.name}</span>
                  <span className="text-muted text-xs"> · {activeLocation.area}, Dubai</span>
                </div>
                <div className="neon-badge" style={{ fontSize: '0.6rem', padding: '2px 8px' }}>FREE</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Social share */}
      <div className="relative z-10 text-center mt-2">
        <div className="text-muted text-xs mb-3">Share your achievement</div>
        <div className="flex gap-3 justify-center">
          <button className="btn-ghost-pink text-xs px-4 py-2">📸 Instagram Story</button>
          <button className="btn-ghost-pink text-xs px-4 py-2">🏅 Share Score</button>
        </div>
      </div>

      <div className="glow-line w-full absolute bottom-0 left-0" />
    </div>
  );
};
