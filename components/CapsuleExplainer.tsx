import React, { useState, useEffect } from 'react';

interface Props {
  onClose: () => void;
  onBookTaxi: () => void;
}

const EQUIPMENT = [
  {
    icon: '🪞',
    title: 'INSTAGRAM SELFIE MIRROR',
    color: '#ff1a72',
    glow: '255,26,114',
    badge: '📸 SELFIE READY',
    img: './selfie_mirror.png',
    desc: 'Full-height 220cm LED ring-light mirror — studio-quality lighting built in. Capture your progress, post your glow-up, flex on Instagram. Every angle perfect. Every shot iconic. The only gym mirror where YOU are the main character.',
    features: ['Ring-light LEDs', 'Full-height 220cm', 'Story-mode width', 'Instagram ready'],
  },
  {
    icon: '🤖',
    title: 'AI BODY SCULPT COACH',
    color: '#c400ff',
    glow: '196,0,255',
    badge: '⚡ LIVE AI',
    img: './ai_coach_screen.png',
    desc: 'Your personal AI trainer scans your body in 3 minutes, models your muscle imbalances, and generates a 100% personalised session. Every rep tracked live. It doesn\'t just coach you — it sculpts you, predicts your transformation, and evolves with you.',
    features: ['3-min body scan', 'Real-time form AI', 'Cycle-aware plans', '4-week prediction'],
  },
  {
    icon: '🏋️',
    title: 'SMART GYM EQUIPMENT',
    color: '#ff1a72',
    glow: '255,26,114',
    badge: '💪 SMART SENSORS',
    img: './smart_gym.png',
    desc: 'Dumbbells 2–20kg, TRX suspension, resistance bands, adjustable bench, cable machine. Every piece embedded with smart sensors — AI tracks weight, reps and tempo automatically. No logging. Just lift.',
    features: ['Dumbbells 2–20kg', 'TRX + cable', 'Auto rep tracking', 'Smart load adjust'],
  },
  {
    icon: '🚿',
    title: 'LUXURY RAIN SHOWER',
    color: '#c400ff',
    glow: '196,0,255',
    badge: '🌧 PREMIUM SPA',
    img: './luxury_shower.png',
    desc: 'Integrated rain shower cabin with instant hot water, built-in hair dryer, fresh towel and personal locker. Leave in 5 minutes — fresh, confident, glowing. No waiting. No sharing. No strangers. Your spa, yours alone.',
    features: ['Rain shower head', 'Instant hot water', 'Hair dryer built-in', 'Fresh towel always'],
  },
  {
    icon: '📺',
    title: '27" AI TOUCHSCREEN',
    color: '#ff1a72',
    glow: '255,26,114',
    badge: '🖥 LIVE SESSION',
    img: './ai_coach_screen.png',
    desc: '27-inch 4K wall-mounted AI screen runs your full session. Animated exercise demos, rep counters, rest timers, heart rate zones. Swipe to skip, tap to modify intensity. Your AI coach speaks, guides, and motivates in real-time. Never workout alone again.',
    features: ['27" 4K display', 'Animated demos', 'Heart rate zones', 'Voice coaching'],
  },
  {
    icon: '🔒',
    title: 'TOTAL PRIVACY POD',
    color: '#c400ff',
    glow: '196,0,255',
    badge: '🛡 CAMERA-FREE',
    img: './capsule_interior.png',
    desc: '2m × 2m × 2.5m sealed pod. Door locks from inside. Zero cameras. Climate-controlled at 22°C. Noise-isolated. This is YOUR space — no eyes, no judgment, no men. Train at 100% intensity, 100% safe. The world\'s most private gym.',
    features: ['Biometric lock', 'Zero cameras', 'Climate 22°C', 'Noise isolation'],
  },
];

const YOGA_SESSIONS = [
  { icon: '🧘', label: 'Morning Flow', sub: 'Daily 07:00 – 08:00' },
  { icon: '🌙', label: 'Evening Restore', sub: 'Daily 19:00 – 20:00' },
  { icon: '🔥', label: 'Power Vinyasa', sub: 'Tue & Thu 18:00' },
  { icon: '🇮🇹', label: 'Italian Mindset', sub: "Angela's signature style" },
];

export const CapsuleExplainer: React.FC<Props> = ({ onClose, onBookTaxi }) => {
  const [activeEq, setActiveEq] = useState(0);
  const [yogaBooked, setYogaBooked] = useState(false);
  const [yogaAnimating, setYogaAnimating] = useState(false);
  const [scanY, setScanY] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});

  useEffect(() => { const iv = setInterval(() => setScanY(y => (y + 1.5) % 100), 30); return () => clearInterval(iv); }, []);
  useEffect(() => {
    const iv = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 120);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(iv);
  }, []);

  const bookYoga = () => {
    setYogaAnimating(true);
    setTimeout(() => { setYogaBooked(true); setYogaAnimating(false); }, 1600);
  };

  const eq = EQUIPMENT[activeEq];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#080014',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto', overflowX: 'hidden',
    }}>
      {/* Scanlines overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,26,114,0.012) 3px, rgba(255,26,114,0.012) 4px)',
      }} />
      {/* Grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,26,114,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,26,114,0.035) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 480, margin: '0 auto', paddingBottom: 60 }}>

        {/* ── TOP BAR ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'rgba(8,0,20,0.97)',
          borderBottom: '1px solid rgba(255,26,114,0.2)',
          position: 'sticky', top: 0, zIndex: 10,
          backdropFilter: 'blur(16px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'linear-gradient(135deg, #ff1a72, #c400ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', boxShadow: '0 0 16px rgba(255,26,114,0.55)',
            }}>💗</div>
            <div>
              <div style={{ fontSize: '0.52rem', color: '#ff1a72', fontWeight: 900, letterSpacing: '0.18em' }}>GYMHUB WOMEN</div>
              <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 900, letterSpacing: '0.03em' }}>Inside the Capsule</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,26,114,0.3)',
            background: 'rgba(255,26,114,0.08)', color: '#ff6eb4',
            fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        {/* ── HERO IMAGE — Dubai Capsule ── */}
        <div style={{ position: 'relative', width: '100%', height: 300, overflow: 'hidden' }}>
          <img
            src="./img_dubai.png"
            onError={(e) => { (e.target as HTMLImageElement).src = '/capsule.png'; }}
            alt="GymHub Capsule Dubai"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: glitchActive ? 'hue-rotate(15deg) saturate(1.8) brightness(1.05)' : 'none',
              transition: 'filter 0.05s',
            }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(8,0,20,0.05) 0%, rgba(8,0,20,0.0) 35%, rgba(8,0,20,0.9) 100%)',
          }} />
          {/* Scanning line */}
          <div style={{
            position: 'absolute', left: 0, right: 0, top: `${scanY}%`, height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(255,26,114,0.85) 30%, rgba(255,255,255,0.95) 50%, rgba(255,26,114,0.85) 70%, transparent)',
            boxShadow: '0 0 10px rgba(255,26,114,0.7)',
          }} />
          {/* Corner brackets */}
          {[
            { top: 12, left: 12, borderTop: '2px solid #ff1a72', borderLeft: '2px solid #ff1a72' },
            { top: 12, right: 12, borderTop: '2px solid #ff1a72', borderRight: '2px solid #ff1a72' },
            { bottom: 40, left: 12, borderBottom: '2px solid #ff1a72', borderLeft: '2px solid #ff1a72' },
            { bottom: 40, right: 12, borderBottom: '2px solid #ff1a72', borderRight: '2px solid #ff1a72' },
          ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 24, height: 24, ...s }} />)}
          {/* AI SCAN badge */}
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,26,114,0.45)',
            borderRadius: 20, padding: '3px 10px',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff1a72', animation: 'blink 1s infinite' }} />
            <span style={{ fontSize: '0.55rem', fontWeight: 900, color: '#ff6eb4', letterSpacing: '0.1em' }}>AI SCAN ACTIVE</span>
          </div>
          {/* Women Only badge */}
          <div style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(196,0,255,0.28)', border: '1px solid rgba(196,0,255,0.5)',
            borderRadius: 20, padding: '3px 10px',
          }}>
            <span style={{ fontSize: '0.55rem', fontWeight: 900, color: '#e580ff', letterSpacing: '0.1em' }}>💗 WOMEN ONLY</span>
          </div>
          {/* Bottom headline */}
          <div style={{ position: 'absolute', bottom: 20, left: 16, right: 16 }}>
            <div style={{
              fontSize: '1.6rem', fontWeight: 900, color: '#fff', lineHeight: 1.1,
              textShadow: '0 0 40px rgba(255,26,114,0.9)',
              fontStyle: glitchActive ? 'italic' : 'normal',
            }}>
              YOUR PRIVATE<br />
              <span style={{ color: '#ff1a72' }}>AI FITNESS CAPSULE</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,200,230,0.75)', marginTop: 5 }}>
              2m × 2m × 2.5m · Dubai, UAE · 0 Competitors · 450+ Waitlist
            </div>
          </div>
        </div>

        {/* ── AI INTRO ── */}
        <div style={{
          margin: '16px 16px 0',
          padding: '16px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(255,26,114,0.12), rgba(196,0,255,0.07))',
          border: '1px solid rgba(255,26,114,0.22)',
          boxShadow: '0 0 40px rgba(255,26,114,0.08)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.55rem', color: '#ff1a72', fontWeight: 900, letterSpacing: '0.22em', marginBottom: 6 }}>◆ AI-POWERED EXPERIENCE ◆</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff', lineHeight: 1.35, marginBottom: 8 }}>
            The world's first private AI gym capsule<br />
            <span style={{ color: '#ff6eb4' }}>designed exclusively for women</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(210,180,230,0.72)', lineHeight: 1.65 }}>
            Book via app. Unlock with phone. Train with AI.<br />
            Shower. Leave glowing. No waiting. No men. No judgment.
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {['🔒 Private', '🤖 AI Coach', '🪞 Selfie Mirror', '🚿 Shower', '📸 Insta Ready'].map(f => (
              <span key={f} style={{
                padding: '3px 10px', borderRadius: 20, fontSize: '0.57rem', fontWeight: 700,
                background: 'rgba(255,26,114,0.09)', border: '1px solid rgba(255,26,114,0.22)', color: '#ff9ec8',
              }}>{f}</span>
            ))}
          </div>
        </div>

        {/* ── EQUIPMENT CAROUSEL ── */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ fontSize: '0.58rem', fontWeight: 900, color: '#ff1a72', letterSpacing: '0.18em', marginBottom: 12 }}>
            ◆ 6 SYSTEMS — ONE PERFECT POD
          </div>

          {/* Icon tabs */}
          <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
            {EQUIPMENT.map((e, i) => (
              <button key={i} onClick={() => setActiveEq(i)} style={{
                flexShrink: 0, width: 60, height: 62, borderRadius: 14, cursor: 'pointer',
                border: activeEq === i ? `2px solid ${e.color}` : '1.5px solid rgba(255,255,255,0.07)',
                background: activeEq === i
                  ? `radial-gradient(circle, rgba(${e.glow},0.22), rgba(8,0,20,0.95))`
                  : 'rgba(255,255,255,0.025)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
                boxShadow: activeEq === i ? `0 0 20px rgba(${e.glow},0.4)` : 'none',
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: '1.4rem' }}>{e.icon}</span>
                <span style={{
                  fontSize: '0.37rem', fontWeight: 900, letterSpacing: '0.04em',
                  color: activeEq === i ? e.color : 'rgba(200,160,220,0.35)',
                  textAlign: 'center', lineHeight: 1.2, paddingInline: 3,
                }}>{e.title.split(' ').slice(0, 2).join('\n')}</span>
              </button>
            ))}
          </div>

          {/* Active card with AI IMAGE */}
          <div style={{
            borderRadius: 18,
            background: `linear-gradient(160deg, rgba(${eq.glow},0.14) 0%, rgba(8,0,20,0.97) 100%)`,
            border: `1.5px solid rgba(${eq.glow},0.32)`,
            boxShadow: `0 0 50px rgba(${eq.glow},0.18), inset 0 0 30px rgba(${eq.glow},0.03)`,
            overflow: 'hidden',
            marginTop: 10,
            transition: 'all 0.3s',
          }}>
            {/* AI-generated image for this system */}
            <div style={{ position: 'relative', width: '100%', height: 200, overflow: 'hidden' }}>
              <img
                key={activeEq}
                src={eq.img}
                alt={eq.title}
                onLoad={() => setImgLoaded(prev => ({ ...prev, [activeEq]: true }))}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  opacity: imgLoaded[activeEq] ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                }}
              />
              {/* Image gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(180deg, transparent 40%, rgba(8,0,20,0.85) 100%)`,
              }} />
              {/* HUD corners */}
              {[
                { top: 8, left: 8, borderTop: `1.5px solid ${eq.color}`, borderLeft: `1.5px solid ${eq.color}` },
                { top: 8, right: 8, borderTop: `1.5px solid ${eq.color}`, borderRight: `1.5px solid ${eq.color}` },
                { bottom: 8, left: 8, borderBottom: `1.5px solid ${eq.color}`, borderLeft: `1.5px solid ${eq.color}` },
                { bottom: 8, right: 8, borderBottom: `1.5px solid ${eq.color}`, borderRight: `1.5px solid ${eq.color}` },
              ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 16, height: 16, ...s }} />)}
              {/* System label */}
              <div style={{
                position: 'absolute', top: 10, left: 10,
                background: 'rgba(0,0,0,0.65)', border: `1px solid rgba(${eq.glow},0.4)`,
                borderRadius: 8, padding: '3px 8px',
                fontSize: '0.52rem', fontWeight: 900, color: eq.color, letterSpacing: '0.1em',
              }}>SYSTEM {String(activeEq + 1).padStart(2, '0')}</div>
              {/* Badge */}
              <div style={{
                position: 'absolute', top: 10, right: 10,
                background: `rgba(${eq.glow},0.22)`, border: `1px solid rgba(${eq.glow},0.4)`,
                borderRadius: 8, padding: '3px 8px',
                fontSize: '0.52rem', fontWeight: 900, color: eq.color, letterSpacing: '0.06em',
              }}>{eq.badge}</div>
              {/* Title overlay */}
              <div style={{
                position: 'absolute', bottom: 12, left: 14,
                fontSize: '1rem', fontWeight: 900, color: '#fff',
                textShadow: `0 0 20px rgba(${eq.glow},0.8)`,
                letterSpacing: '0.02em',
              }}>{eq.title}</div>
            </div>

            {/* Text content */}
            <div style={{ padding: '14px 16px 16px' }}>
              <div style={{
                fontSize: '0.71rem', color: 'rgba(225,195,245,0.88)', lineHeight: 1.68,
                marginBottom: 14,
                borderLeft: `2px solid rgba(${eq.glow},0.4)`,
                paddingLeft: 12,
              }}>
                {eq.desc}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {eq.features.map(f => (
                  <span key={f} style={{
                    padding: '4px 12px', borderRadius: 20,
                    background: `rgba(${eq.glow},0.08)`,
                    border: `1px solid rgba(${eq.glow},0.25)`,
                    fontSize: '0.6rem', fontWeight: 700, color: eq.color,
                  }}>✓ {f}</span>
                ))}
              </div>

              {/* Nav dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
                {EQUIPMENT.map((e, i) => (
                  <div key={i} onClick={() => setActiveEq(i)} style={{
                    width: i === activeEq ? 20 : 6, height: 6, borderRadius: 3, cursor: 'pointer',
                    background: i === activeEq ? eq.color : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.3s',
                    boxShadow: i === activeEq ? `0 0 8px rgba(${eq.glow},0.5)` : 'none',
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Prev / Next */}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {[
              ['← PREV', () => setActiveEq(Math.max(0, activeEq - 1)), activeEq === 0],
              ['NEXT →', () => setActiveEq(Math.min(EQUIPMENT.length - 1, activeEq + 1)), activeEq === EQUIPMENT.length - 1],
            ].map(([label, action, disabled]: any) => (
              <button key={label} onClick={action} disabled={disabled} style={{
                flex: 1, padding: '10px', borderRadius: 10, cursor: disabled ? 'default' : 'pointer',
                border: '1px solid rgba(255,26,114,0.18)',
                background: 'rgba(255,26,114,0.04)',
                color: disabled ? 'rgba(255,255,255,0.12)' : '#ff6eb4',
                fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em',
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* ── AI BODY COACH — HOW IT WORKS ── */}
        <div style={{
          margin: '20px 16px 0',
          borderRadius: 18,
          overflow: 'hidden',
          border: '1.5px solid rgba(196,0,255,0.28)',
          boxShadow: '0 0 40px rgba(196,0,255,0.12)',
        }}>
          {/* Section image */}
          <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
            <img src="./ai_coach_screen.png" alt="AI Coach" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(8,0,20,0.2) 0%, rgba(8,0,20,0.75) 100%)',
            }} />
            <div style={{ position: 'absolute', bottom: 14, left: 16 }}>
              <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#c400ff', letterSpacing: '0.18em' }}>⚡ AI TECHNOLOGY</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#fff' }}>How The AI Coach Works</div>
            </div>
          </div>
          {/* Steps */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(196,0,255,0.1), rgba(8,0,20,0.98))',
            padding: '16px',
          }}>
            {[
              { step: '01', text: 'Step inside → 27" screen activates → AI scans posture in 3 minutes', icon: '📡' },
              { step: '02', text: 'AI models your body: muscle imbalances, strength gaps, menstrual phase awareness', icon: '🧬' },
              { step: '03', text: 'Generates 100% personalised session — right exercises, right load, right tempo', icon: '⚡' },
              { step: '04', text: 'Tracks every rep via smart sensors — adjusts load live if form breaks down', icon: '🎯' },
              { step: '05', text: 'Post-workout: predicts body transformation in 4 weeks to keep you obsessed', icon: '🔮' },
            ].map(s => (
              <div key={s.step} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 11 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(196,0,255,0.14)',
                  border: '1px solid rgba(196,0,255,0.32)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem',
                }}>{s.icon}</div>
                <div>
                  <span style={{ fontSize: '0.54rem', color: '#c400ff', fontWeight: 900 }}>STEP {s.step} · </span>
                  <span style={{ fontSize: '0.68rem', color: 'rgba(220,190,240,0.82)', lineHeight: 1.55 }}>{s.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── YOGA BONUS — ANGELA ── */}
        <div style={{
          margin: '16px 16px 0',
          borderRadius: 18,
          overflow: 'hidden',
          border: yogaBooked ? '1.5px solid rgba(255,180,255,0.5)' : '1.5px solid rgba(255,26,114,0.25)',
          boxShadow: yogaBooked ? '0 0 50px rgba(196,0,255,0.3)' : '0 0 20px rgba(255,26,114,0.1)',
          transition: 'all 0.6s',
        }}>
          {/* Yoga hero image */}
          <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
            <img src="./yoga_angela.png" alt="Angela Yoga Coach" style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: yogaBooked ? 'saturate(1.3) brightness(1.05)' : 'saturate(1.1)',
              transition: 'filter 0.6s',
            }} />
            {/* HUD scan overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(8,0,20,0.1) 0%, rgba(8,0,20,0.75) 100%)',
            }} />
            {/* Italy flag badge */}
            <div style={{
              position: 'absolute', top: 12, left: 14,
              background: 'rgba(8,0,20,0.85)',
              border: '1px solid rgba(255,26,114,0.4)',
              borderRadius: 20, padding: '4px 10px',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: '1rem' }}>🇮🇹</span>
              <span style={{ fontSize: '0.55rem', fontWeight: 900, color: '#ff6eb4', letterSpacing: '0.12em' }}>FROM ITALY</span>
            </div>
            {/* LIVE badge */}
            <div style={{
              position: 'absolute', top: 12, right: 14,
              background: yogaBooked ? 'rgba(196,0,255,0.7)' : 'rgba(255,26,114,0.25)',
              border: '1px solid rgba(255,26,114,0.5)',
              borderRadius: 20, padding: '4px 10px',
              fontSize: '0.52rem', fontWeight: 900, color: '#fff', letterSpacing: '0.15em',
              animation: 'blink 2s infinite',
            }}>
              {yogaBooked ? '✅ BOOKED' : '🧘 YOGA BONUS'}
            </div>
            {/* Bottom overlay */}
            <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
              <div style={{ fontSize: '0.52rem', fontWeight: 900, color: '#ff6eb4', letterSpacing: '0.18em', marginBottom: 3 }}>
                🌸 EXCLUSIVE YOGA BONUS
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
                {yogaBooked ? '✨ Lesson booked! Angela will guide you.' : 'First YOGA lesson FREE with Angela'}
              </div>
              <div style={{ fontSize: '0.58rem', color: 'rgba(255,200,230,0.75)', marginTop: 4 }}>
                🇮🇹 Italian certified coach · Vinyasa & Restorative · Inside your GymHub capsule
              </div>
            </div>
          </div>

          {/* Angela bio + sessions */}
          <div style={{
            padding: '14px 14px 4px',
            background: yogaBooked ? 'rgba(60,0,40,0.7)' : 'rgba(8,0,20,0.97)',
            transition: 'background 0.6s',
          }}>
            {/* Angela card */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,26,114,0.07)',
              border: '1px solid rgba(255,26,114,0.2)',
              borderRadius: 14, padding: '12px 14px', marginBottom: 10,
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff1a72, #c400ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', flexShrink: 0,
                boxShadow: '0 0 18px rgba(255,26,114,0.5)',
              }}>🧘‍♀️</div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#ff6eb4' }}>Angela L.</div>
                <div style={{ fontSize: '0.56rem', color: 'rgba(220,180,240,0.85)', marginTop: 2 }}>
                  🇮🇹 Certified Yoga Instructor · Venezia, Italy
                </div>
                <div style={{ fontSize: '0.52rem', color: 'rgba(180,140,200,0.65)', marginTop: 2 }}>
                  RYT-500 · 8 years teaching · Specialised in women's wellness
                </div>
              </div>
            </div>

            {/* Session types */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              {YOGA_SESSIONS.map(s => (
                <div key={s.label} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: yogaBooked ? 'rgba(196,0,255,0.08)' : 'rgba(255,26,114,0.04)',
                  border: yogaBooked ? '1px solid rgba(196,0,255,0.25)' : '1px solid rgba(255,26,114,0.12)',
                  borderRadius: 10, padding: '8px 10px',
                  transition: 'all 0.4s',
                }}>
                  <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#ff6eb4' }}>{s.label}</div>
                    <div style={{ fontSize: '0.5rem', color: 'rgba(220,160,200,0.55)' }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Book button or confirmed */}
            {yogaBooked ? (
              <div style={{
                textAlign: 'center', padding: '14px 0',
                fontSize: '0.7rem', fontWeight: 900, color: '#ff6eb4',
                letterSpacing: '0.06em', animation: 'textPulse 2s infinite',
              }}>
                💗 Angela is expecting you — see you on the mat!
              </div>
            ) : (
              <button onClick={bookYoga} disabled={yogaAnimating} style={{
                width: '100%', padding: '13px', borderRadius: 14, cursor: yogaAnimating ? 'default' : 'pointer',
                border: '1.5px solid rgba(255,26,114,0.5)',
                background: yogaAnimating
                  ? 'rgba(255,26,114,0.15)'
                  : 'linear-gradient(135deg, rgba(255,26,114,0.25), rgba(196,0,255,0.18))',
                color: '#ff6eb4', fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.1em',
                animation: yogaAnimating ? 'blink 0.4s infinite' : 'none',
                marginBottom: 14,
                boxShadow: '0 0 20px rgba(255,26,114,0.15)',
              }}>
                {yogaAnimating ? '🧘 BOOKING WITH ANGELA…' : '🎁 BOOK FREE YOGA LESSON WITH ANGELA'}
              </button>
            )}
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ margin: '16px 16px 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { val: '0', unit: 'COMPETITORS', icon: '🏆', glow: '255,26,114' },
            { val: '450+', unit: 'WAITLIST', icon: '💗', glow: '196,0,255' },
            { val: 'AED 3.2K', unit: 'AVG LTV', icon: '💰', glow: '255,26,114' },
          ].map(s => (
            <div key={s.unit} style={{
              borderRadius: 12, padding: '14px 8px', textAlign: 'center',
              background: `rgba(${s.glow},0.07)`,
              border: `1px solid rgba(${s.glow},0.18)`,
              boxShadow: `0 0 20px rgba(${s.glow},0.08)`,
            }}>
              <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: `rgb(${s.glow})`, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: '0.48rem', color: 'rgba(200,170,220,0.45)', fontWeight: 700, letterSpacing: '0.05em', marginTop: 4 }}>{s.unit}</div>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{ padding: '20px 16px 0' }}>
          <button onClick={onBookTaxi} style={{
            width: '100%', padding: '19px', borderRadius: 16, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #ff1a72 0%, #c400ff 100%)',
            boxShadow: '0 0 50px rgba(255,26,114,0.5), 0 4px 24px rgba(0,0,0,0.4)',
            fontSize: '0.9rem', fontWeight: 900, color: '#fff',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <span style={{ fontSize: '1.2rem' }}>🎁</span>
            <span>First Class FREE + Free Taxi 🚗</span>
          </button>
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.58rem', color: 'rgba(200,170,220,0.38)' }}>
            No card required · 30 min session · Women only · Dubai
          </div>
        </div>

      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes textPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
};
