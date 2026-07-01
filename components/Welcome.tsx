import React, { useEffect, useState } from 'react';

interface WelcomeProps {
  onStart: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 1800);
    return () => clearInterval(iv);
  }, []);

  const hr = 124 + Math.round(Math.sin(tick * 0.9) * 9);
  const perf = 91 + Math.round(Math.sin(tick * 0.6) * 4);
  const recovery = 80 + Math.round(Math.sin(tick * 0.4) * 5);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#07070f' }}>
      {/* ─── HERO IMAGE AREA ─── */}
      <div className="absolute inset-x-0 top-0 hero-image-area">
        <img
          src="./hero.png"
          alt="GymHub AI"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 15%',
          }}
        />
        {/* Bottom fade */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(7,7,15,0.55) 0%, rgba(7,7,15,0.05) 25%, rgba(7,7,15,0.55) 65%, rgba(7,7,15,1) 100%)',
        }} />
        {/* Scanlines */}
        <div className="scanlines absolute inset-0 pointer-events-none" />
        {/* Sweep line */}
        <div className="scan-sweep pointer-events-none" />
        {/* Subtle cyber grid */}
        <div className="cyber-grid absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        {/* ─── TOP BADGES ─── */}
        <div className="absolute top-5 inset-x-0 flex gap-2 justify-center px-4 z-20 fade-in">
          <span className="neon-badge" style={{ fontSize: '0.65rem' }}>🔥 AMD Hackathon 2026</span>
          <span className="neon-badge-purple" style={{ fontSize: '0.65rem' }}>⚡ Fireworks AI</span>
          <span className="neon-badge" style={{ fontSize: '0.65rem' }}>🏆 Track 3</span>
        </div>

        {/* ─── FLOATING HUD LEFT ─── */}
        <div className="absolute left-3 top-16 flex flex-col gap-2 z-20 slide-up" style={{ animationDelay: '0.25s' }}>
          <div className="hud-panel">
            <div className="hud-label">AI COACH</div>
            <div className="hud-value" style={{ color: '#4ade80' }}>ACTIVE</div>
          </div>
          <div className="hud-panel">
            <div className="hud-label">PERFORMANCE</div>
            <div className="hud-value gradient-text">{perf}%</div>
          </div>
          <div className="hud-panel">
            <div className="hud-label">CALORIES</div>
            <div className="hud-value text-pink">647 kcal</div>
          </div>
        </div>

        {/* ─── FLOATING HUD RIGHT ─── */}
        <div className="absolute right-3 top-16 flex flex-col gap-2 z-20 slide-up" style={{ animationDelay: '0.45s' }}>
          <div className="hud-panel">
            <div className="hud-label">HEART RATE</div>
            <div className="hud-value text-pink">{hr} <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>BPM</span></div>
          </div>
          <div className="hud-panel">
            <div className="hud-label">RECOVERY</div>
            <div className="hud-value gradient-text">{recovery}%</div>
          </div>
          <div className="hud-panel">
            <div className="hud-label">STATUS</div>
            <div className="hud-value" style={{ color: '#4ade80' }}>OPTIMAL</div>
          </div>
        </div>
      </div>

      {/* ─── CONTENT BELOW IMAGE ─── */}
      <div className="relative z-10 flex flex-col items-center px-6 pb-10" style={{ paddingTop: '54vh' }}>

        {/* Main title */}
        <div className="text-center mb-3 slide-up">
          <h1
            className="glitch font-black gradient-text"
            style={{ fontSize: 'clamp(3.2rem, 13vw, 7rem)', lineHeight: 0.88, letterSpacing: '-0.03em' }}
          >
            GYMHUB
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div style={{ height: 1, width: 36, background: 'linear-gradient(90deg, transparent, var(--pink))' }} />
            <span className="font-bold tracking-[0.35em] text-sm text-pink">WOMEN</span>
            <div style={{ height: 1, width: 36, background: 'linear-gradient(90deg, var(--pink), transparent)' }} />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-center text-muted text-sm max-w-xs leading-relaxed mb-7 fade-in" style={{ animationDelay: '0.3s' }}>
          Your personal AI coach that{' '}
          <span className="text-pink font-semibold">learns you</span>, syncs with your smart band,
          and adapts every session to your body.
        </p>

        {/* Stats row */}
        <div className="flex gap-3 mb-8 flex-wrap justify-center slide-up" style={{ animationDelay: '0.4s' }}>
          {[
            { value: '450+', label: 'Waitlist' },
            { value: '94%', label: 'Retention' },
            { value: '4.9★', label: 'Rating' },
            { value: '15.8K', label: 'Followers' },
          ].map((stat) => (
            <div key={stat.label} className="hud-stat-card text-center">
              <div className="gradient-text font-black text-lg leading-tight">{stat.value}</div>
              <div className="text-muted" style={{ fontSize: '0.7rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="btn-neon text-base mb-6 neon-pulse-border slide-up"
          style={{ paddingLeft: '3rem', paddingRight: '3rem', paddingTop: '1rem', paddingBottom: '1rem', animationDelay: '0.5s' }}
          onClick={onStart}
        >
          ✦ Start Your Journey
        </button>

        {/* Dubai tag */}
        <div className="flex items-center gap-2 text-muted fade-in" style={{ fontSize: '0.7rem', animationDelay: '0.6s' }}>
          <span>🇦🇪 Dubai, UAE</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>Private AI-Powered Capsule Gyms</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>Women Only</span>
        </div>
      </div>

      <div className="glow-line w-full absolute bottom-0 left-0" />
    </div>
  );
};
