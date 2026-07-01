import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Flame, Clock, Zap, AlertTriangle, CheckCircle, ChevronRight, Brain } from 'lucide-react';
import type { Exercise, BandData, WorkoutStats } from '../types';
import { MuscleMap } from './MuscleMap';
import { ExerciseDemo } from './ExerciseDemo';
import { CapsuleExplainer } from './CapsuleExplainer';

interface WorkoutSessionProps {
  exercises: Exercise[];
  band: BandData | null;
  onComplete: (stats: WorkoutStats) => void;
}

type Phase = 'active' | 'resting' | 'set-complete' | 'exercise-complete' | 'done';

const WORKOUT_NAMES = ['POWER SCULPT', 'BURN & BUILD', 'NEURAL DRIVE', 'PEAK FORM'];

export const WorkoutSession: React.FC<WorkoutSessionProps> = ({ exercises: initialExercises, band, onComplete }) => {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentReps, setCurrentReps] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<Phase>('active');
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [heartRate, setHeartRate] = useState(band ? 68 : 72);
  const [calories, setCalories] = useState(0);
  const [totalReps, setTotalReps] = useState(0);
  const [restCountdown, setRestCountdown] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [repPop, setRepPop] = useState(false);
  const [allHR, setAllHR] = useState<number[]>([68]);
  const [workoutName] = useState(WORKOUT_NAMES[Math.floor(Math.random() * WORKOUT_NAMES.length)]);

  // ── Capsule explainer ──
  const [showCapsule, setShowCapsule] = useState(false);

  // ── Taxi booking state ──
  type TaxiState = 'idle' | 'searching' | 'found' | 'arriving' | 'arrived';
  const [taxiState, setTaxiState] = useState<TaxiState>('idle');
  const [taxiDriver, setTaxiDriver] = useState<{ name: string; car: string; plate: string; eta: number; rating: number; avatar: string } | null>(null);
  const [taxiEta, setTaxiEta] = useState(0);

  const DRIVERS = [
    { name: 'Aisha Al-Mansoori', car: 'Tesla Model 3', plate: 'D·54321', eta: 4, rating: 4.97, avatar: '👩' },
    { name: 'Fatima Al-Zahra', car: 'BMW 5 Series', plate: 'D·78234', eta: 6, rating: 4.92, avatar: '👩‍🦱' },
    { name: 'Sara Al-Rashid', car: 'Mercedes C-Class', plate: 'D·93012', eta: 3, rating: 4.99, avatar: '🧕' },
  ];

  const bookFreeTaxi = () => {
    setTaxiState('searching');
    setTimeout(() => {
      const d = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
      setTaxiDriver(d);
      setTaxiState('found');
      setTimeout(() => {
        setTaxiEta(d.eta * 60);
        setTaxiState('arriving');
      }, 2500);
    }, 3000);
  };

  // ETA countdown
  useEffect(() => {
    if (taxiState === 'arriving' && taxiEta > 0) {
      const t = setTimeout(() => setTaxiEta(e => e - 1), 1000);
      return () => clearTimeout(t);
    }
    if (taxiState === 'arriving' && taxiEta === 0) setTaxiState('arrived');
  }, [taxiState, taxiEta]);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alertShownRef = useRef(false);

  const currentExercise = exercises[currentIdx];
  const totalSets = currentExercise?.sets || 3;
  const overallProgress = Math.round(((currentIdx + (currentSet - 1) / totalSets) / exercises.length) * 100);

  // Session clock
  useEffect(() => {
    const iv = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  // HR & calories simulation
  useEffect(() => {
    const iv = setInterval(() => {
      if (phase === 'active') {
        const change = Math.round((Math.random() - 0.4) * 6);
        const newHR = Math.max(85, Math.min(175, heartRate + change));
        setHeartRate(newHR);
        setAllHR((prev) => [...prev, newHR]);
        setCalories((c) => c + 0.18);
      } else if (phase === 'resting') {
        const newHR = Math.max(68, heartRate - 3);
        setHeartRate(newHR);
      }
    }, 1200);
    return () => clearInterval(iv);
  }, [phase, heartRate]);

  // Band auto-rep
  useEffect(() => {
    if (!band?.connected || phase !== 'active') return;
    const iv = setInterval(() => {
      if (Math.random() > 0.35) addRep();
    }, 3000);
    return () => clearInterval(iv);
  }, [band, phase, currentReps, currentExercise]); // eslint-disable-line

  const resetIdleTimer = useCallback(() => {
    alertShownRef.current = false;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (band?.connected && phase === 'active') {
      idleTimerRef.current = setTimeout(() => {
        if (!alertShownRef.current) {
          alertShownRef.current = true;
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3500);
        }
      }, 10000);
    }
  }, [band, phase]);

  useEffect(() => {
    resetIdleTimer();
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [resetIdleTimer]);

  const addRep = useCallback(() => {
    if (phase !== 'active') return;
    resetIdleTimer();
    setRepPop(true);
    setTimeout(() => setRepPop(false), 280);
    setCurrentReps((prev) => {
      const next = prev + 1;
      setTotalReps((t) => t + 1);
      if (next >= currentExercise.targetReps) {
        setTimeout(() => {
          if (currentSet >= totalSets) {
            setExercises((exs) => exs.map((e, i) => i === currentIdx ? { ...e, completed: true } : e));
            setPhase('exercise-complete');
          } else {
            setPhase('set-complete');
            setRestCountdown(currentExercise.restSeconds);
          }
        }, 400);
      }
      return next;
    });
  }, [phase, currentExercise, currentIdx, currentSet, totalSets, resetIdleTimer]);

  useEffect(() => {
    if (phase !== 'set-complete' && phase !== 'resting') return;
    if (restCountdown <= 0) {
      setCurrentSet((s) => s + 1);
      setCurrentReps(0);
      setPhase('active');
      return;
    }
    const t = setTimeout(() => setRestCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, restCountdown]);

  useEffect(() => {
    if (phase === 'set-complete') setPhase('resting');
  }, [phase]);

  const goNextExercise = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= exercises.length) {
      setPhase('done');
      const avgHR = allHR.length ? Math.round(allHR.reduce((a, b) => a + b, 0) / allHR.length) : 0;
      setTimeout(() => onComplete({
        durationSeconds: sessionSeconds,
        caloriesBurned: Math.round(calories),
        totalReps,
        avgHeartRate: avgHR,
        exercisesCompleted: exercises.length,
      }), 1200);
    } else {
      setCurrentIdx(nextIdx);
      setCurrentReps(0);
      setCurrentSet(1);
      setPhase('active');
    }
  };

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (!currentExercise) return null;

  const repProgress = Math.min(100, (currentReps / currentExercise.targetReps) * 100);
  const isBandConnected = band?.connected;

  // SVG overall progress ring
  const ringR = 20;
  const ringC = 2 * Math.PI * ringR;
  const ringOffset = ringC - (overallProgress / 100) * ringC;

  // HR zone color
  const hrColor = heartRate > 150 ? '#ff1a72' : heartRate > 120 ? '#ff5fa0' : '#c084fc';

  return (
    <>
    {showCapsule && (
      <CapsuleExplainer
        onClose={() => setShowCapsule(false)}
        onBookTaxi={() => { setShowCapsule(false); bookFreeTaxi(); }}
      />
    )}
    <div className="relative min-h-screen bg-dark flex flex-col px-4 py-5 overflow-hidden">
      {/* ─── BAND ALERT ─── */}
      {showAlert && (
        <div className="fixed inset-x-4 top-4 z-50 slide-up">
          <div className="glass-card-pink p-4 flex items-center gap-3 band-alert"
            style={{ border: '1px solid rgba(255,100,0,0.5)', boxShadow: '0 0 30px rgba(255,100,0,0.4)' }}>
            <AlertTriangle size={22} style={{ color: '#ff6400', flexShrink: 0 }} />
            <div>
              <div className="text-main font-bold text-sm">Movement not detected!</div>
              <div className="text-muted text-xs">Your band says you stopped — keep going! 💪</div>
            </div>
          </div>
        </div>
      )}

      {/* ─── WORKOUT BANNER (hero image strip) ─── */}
      <div className="workout-banner relative z-10 mb-4">
        <img src="./hero.png" alt="workout" className="workout-banner-img" />
        <div className="workout-banner-overlay" />
        <div className="workout-banner-content">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted" style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                AI-Generated Session
              </div>
              <div className="font-black text-main" style={{ fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                {workoutName}
              </div>
            </div>
            {/* Progress ring + % */}
            <div className="flex items-center gap-2">
              <svg width="52" height="52">
                <circle cx="26" cy="26" r={ringR} fill="none" strokeWidth="3" stroke="rgba(255,255,255,0.1)" />
                <circle cx="26" cy="26" r={ringR} fill="none" strokeWidth="3"
                  stroke="url(#ringGrad)" strokeLinecap="round"
                  strokeDasharray={ringC} strokeDashoffset={ringOffset}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '26px 26px', transition: 'stroke-dashoffset 0.6s ease-out' }} />
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff1a72" />
                    <stop offset="100%" stopColor="#9b00ff" />
                  </linearGradient>
                </defs>
                <text x="26" y="31" textAnchor="middle" fill="#f0f0f8" style={{ fontSize: '0.6rem', fontWeight: 800 }}>
                  {overallProgress}%
                </text>
              </svg>
            </div>
          </div>
          {/* Bottom row */}
          <div className="flex items-center gap-2">
            <div className="neon-badge" style={{ fontSize: '0.58rem', padding: '2px 10px' }}>
              Exercise {currentIdx + 1}/{exercises.length}
            </div>
            {isBandConnected && (
              <div className="neon-badge-purple" style={{ fontSize: '0.58rem', padding: '2px 10px' }}>
                📡 Band Connected
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── HUD METRICS ROW ─── */}
      <div className="flex gap-2 mb-4 relative z-10">
        {/* Timer */}
        <div className="metric-hud flex flex-col items-center">
          <Clock size={13} className="text-pink mb-1" />
          <div className="metric-hud-value font-mono">{formatTime(sessionSeconds)}</div>
          <div className="metric-hud-label">Time</div>
        </div>

        {/* Heart Rate */}
        <div className="metric-hud flex flex-col items-center" style={{ border: `1px solid ${hrColor}44` }}>
          <Heart size={13} className="hr-pulse mb-1" style={{ color: hrColor }} />
          <div className="metric-hud-value" style={{ color: hrColor }}>{heartRate}</div>
          <div className="metric-hud-label">BPM</div>
        </div>

        {/* Calories */}
        <div className="metric-hud flex flex-col items-center">
          <Flame size={13} className="text-pink mb-1" />
          <div className="metric-hud-value">{Math.round(calories)}</div>
          <div className="metric-hud-label">kcal</div>
        </div>

        {/* Set progress */}
        <div className="metric-hud flex flex-col items-center">
          <Zap size={13} className="text-pink mb-1" />
          <div className="metric-hud-value">{currentSet}/{totalSets}</div>
          <div className="metric-hud-label">Set</div>
        </div>
      </div>

      {/* ─── MAIN EXERCISE CARD ─── */}
      <div className={`glass-card-pink p-5 mb-4 relative z-10 text-center ${phase === 'done' ? 'fade-in' : ''}`}
        style={{ boxShadow: '0 0 30px rgba(255,26,114,0.12), inset 0 0 30px rgba(255,26,114,0.03)' }}>
        {phase === 'done' ? (
          <div className="fade-in">
            <div style={{ fontSize: '3rem' }} className="mb-2">🎉</div>
            <div className="gradient-text font-bold text-xl">Workout Complete!</div>
            <div className="text-muted text-sm mt-1">Amazing job! Loading results...</div>
          </div>
        ) : phase === 'exercise-complete' ? (
          <div className="fade-in text-center">
            <CheckCircle size={40} style={{ color: '#22c55e', margin: '0 auto 8px' }} />
            <div className="font-bold text-main text-lg mb-1">{currentExercise.name} Done! ✓</div>
            <div className="text-muted text-sm mb-4">All {totalSets} sets completed</div>
            <button className="btn-neon" onClick={goNextExercise}>
              {currentIdx + 1 < exercises.length ? <>Next Exercise <ChevronRight size={16} /></> : 'Finish Workout 🎉'}
            </button>
          </div>
        ) : phase === 'resting' ? (
          <div className="fade-in text-center">
            <div className="text-muted text-xs uppercase tracking-widest mb-2">Rest Time</div>
            <div className="gradient-text font-black" style={{ fontSize: '4.5rem', lineHeight: 1 }}>{restCountdown}</div>
            <div className="text-muted text-sm mt-1">seconds</div>
            <div className="text-main text-sm mt-3 font-medium">Set {currentSet} of {totalSets} complete 💗</div>
            <div className="mt-2 text-muted text-xs">Next: {currentExercise.name} — Set {currentSet + 1}</div>
          </div>
        ) : (
          <>
            {/* Exercise name + muscle map */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-left" style={{ flex: 1 }}>
                <div className="font-black text-main leading-tight" style={{ fontSize: '1.1rem' }}>
                  {currentExercise.name}
                </div>
                <div style={{
                  display: 'inline-block',
                  fontSize: '0.6rem',
                  padding: '2px 8px',
                  borderRadius: 20,
                  marginTop: 4,
                  background: 'rgba(255,26,114,0.15)',
                  color: '#ff6eb4',
                  border: '1px solid rgba(255,26,114,0.3)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  🎯 {currentExercise.muscleGroup}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <MuscleMap muscleGroup={currentExercise.muscleGroup} size={52} animate={true} />
                <div style={{ fontSize: '0.5rem', color: 'rgba(255,110,180,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  AI SCAN
                </div>
              </div>
            </div>

            {/* AI EXERCISE DEMO */}
            <div className="mb-4" style={{ maxWidth: 220, margin: '0 auto 16px' }}>
              <ExerciseDemo
                exerciseName={currentExercise.name}
                muscleGroup={currentExercise.muscleGroup}
                isActive={phase === 'active'}
              />
            </div>

            {/* Set dots */}
            <div className="flex gap-1.5 mb-1">
              {Array.from({ length: totalSets }).map((_, i) => (
                <div key={i} className="flex-1 rounded-full" style={{
                  height: 4,
                  background: i < currentSet - 1
                    ? 'var(--pink)'
                    : i === currentSet - 1
                    ? 'linear-gradient(90deg,#ff1a72,#9b00ff)'
                    : 'var(--border-subtle)',
                  boxShadow: i === currentSet - 1 ? '0 0 8px var(--pink-glow)' : 'none',
                }} />
              ))}
            </div>
            <div className="text-muted text-xs mb-4">Set {currentSet} of {totalSets}</div>

            {/* BIG REP COUNTER */}
            <div
              className={`font-black mb-1 gradient-text ${repPop ? 'rep-pop' : ''}`}
              style={{
                fontSize: '5.5rem',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                filter: 'drop-shadow(0 0 20px rgba(255,26,114,0.35))',
              }}
            >
              {currentReps}
            </div>
            <div className="text-muted text-sm mb-4">
              of <span className="text-main font-bold">{currentExercise.targetReps}</span> reps
            </div>

            {/* Progress bar */}
            <div className="w-full rounded-full overflow-hidden mb-5" style={{ height: 7, background: 'var(--border-subtle)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${repProgress}%`,
                  background: 'linear-gradient(90deg, #ff1a72, #9b00ff)',
                  boxShadow: repProgress > 0 ? '0 0 10px rgba(255,26,114,0.5)' : 'none',
                }}
              />
            </div>

            {/* Rep button */}
            <button
              className="btn-neon w-full flex items-center justify-center gap-2 py-4 text-base"
              onClick={addRep}
            >
              <Zap size={18} />
              {isBandConnected ? 'Band counting — tap if needed' : 'TAP FOR EACH REP'}
            </button>

            {/* Skip button */}
            <button
              onClick={() => {
                setExercises((exs) => exs.map((e, i) => i === currentIdx ? { ...e, completed: true } : e));
                goNextExercise();
              }}
              style={{
                width: '100%',
                marginTop: 10,
                padding: '10px 0',
                borderRadius: 12,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(200,180,220,0.5)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(255,26,114,0.35)', e.currentTarget.style.color = '#ff6eb4')}
              onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)', e.currentTarget.style.color = 'rgba(200,180,220,0.5)')}
            >
              <ChevronRight size={14} />
              SKIP EXERCISE
            </button>
          </>
        )}
      </div>

      {/* ─── AI EXERCISE LIST ─── */}
      <div className="relative z-10 flex flex-col gap-2 overflow-y-auto pb-2" style={{ maxHeight: 220 }}>
        <div className="flex items-center gap-2 mb-1">
          <Brain size={12} style={{ color: '#ff1a72' }} />
          <span className="text-muted" style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>AI Workout Queue</span>
        </div>
        {exercises.map((ex, i) => {
          const isActive = i === currentIdx && phase !== 'done';
          const isDone = ex.completed;
          return (
            <div
              key={ex.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                borderRadius: 12,
                padding: '8px 10px',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(255,26,114,0.18), rgba(155,0,255,0.12))'
                  : isDone
                  ? 'rgba(34,197,94,0.06)'
                  : 'rgba(255,255,255,0.03)',
                border: isActive
                  ? '1px solid rgba(255,26,114,0.45)'
                  : isDone
                  ? '1px solid rgba(34,197,94,0.25)'
                  : '1px solid rgba(255,255,255,0.07)',
                boxShadow: isActive ? '0 0 18px rgba(255,26,114,0.15)' : 'none',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Active glow sweep */}
              {isActive && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,26,114,0.06) 50%, transparent 100%)',
                  animation: 'sweepGlow 2s linear infinite',
                  pointerEvents: 'none',
                }} />
              )}

              {/* Mini Demo or Muscle Map */}
              {isActive ? (
                <div style={{ width: 52, flexShrink: 0 }}>
                  <ExerciseDemo exerciseName={ex.name} muscleGroup={ex.muscleGroup} isActive={true} />
                </div>
              ) : (
                <MuscleMap muscleGroup={ex.muscleGroup} size={38} animate={false} />
              )}

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: isActive ? '#ff6eb4' : isDone ? '#86efac' : '#e8e0f0',
                  letterSpacing: '0.01em',
                  marginBottom: 2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {ex.name}
                </div>
                <div style={{ fontSize: '0.62rem', color: 'rgba(200,180,220,0.55)' }}>
                  {ex.targetReps} reps × {ex.sets} sets
                </div>
                <div style={{
                  display: 'inline-block',
                  fontSize: '0.55rem',
                  padding: '1px 6px',
                  borderRadius: 20,
                  marginTop: 3,
                  background: isActive ? 'rgba(255,26,114,0.2)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#ff6eb4' : 'rgba(200,180,220,0.5)',
                  border: `1px solid ${isActive ? 'rgba(255,26,114,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  {ex.muscleGroup}
                </div>
              </div>

              {/* Status badge */}
              <div style={{ flexShrink: 0 }}>
                {isDone ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 3,
                    fontSize: '0.6rem', color: '#22c55e', fontWeight: 700,
                  }}>
                    <CheckCircle size={13} style={{ color: '#22c55e' }} />
                  </div>
                ) : isActive ? (
                  <div style={{
                    fontSize: '0.58rem', color: '#ff1a72', fontWeight: 800,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    textShadow: '0 0 8px rgba(255,26,114,0.8)',
                    animation: 'textPulse 1.4s ease-in-out infinite',
                  }}>
                    NOW
                  </div>
                ) : (
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', color: 'rgba(200,180,220,0.4)', fontWeight: 700,
                  }}>
                    {i + 1}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* ─── GYMHUB CAPSULE CARD ─── */}
      <div className="relative z-10 mt-5 mb-2">
        <div style={{
          borderRadius: 20,
          overflow: 'hidden',
          border: '1.5px solid rgba(255,26,114,0.45)',
          boxShadow: '0 0 40px rgba(255,26,114,0.18), 0 0 80px rgba(155,0,255,0.10)',
          position: 'relative',
        }}>
          {/* Large capsule image — tap to open explainer */}
          <div onClick={() => setShowCapsule(true)} style={{ position: 'relative', width: '100%', height: 200, overflow: 'hidden', cursor: 'pointer' }}>
            <img
              src="./capsule.png"
              alt="GymHub Capsule"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Dark gradient overlay bottom */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(10,0,20,0.05) 0%, rgba(10,0,20,0.85) 100%)',
            }} />
            {/* Pink scanline overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,26,114,0.03) 4px)',
              pointerEvents: 'none',
            }} />
            {/* TOP-LEFT: LIVE badge */}
            <div style={{
              position: 'absolute', top: 10, left: 10,
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,26,114,0.4)', borderRadius: 20,
              padding: '3px 10px',
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff1a72', boxShadow: '0 0 6px #ff1a72', animation: 'textPulse 1.2s infinite' }} />
              <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#ff6eb4', letterSpacing: '0.1em', textTransform: 'uppercase' }}>GymHub Capsule</span>
            </div>
            {/* TOP-RIGHT: Women Only */}
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: 'linear-gradient(135deg, rgba(255,26,114,0.25), rgba(155,0,255,0.2))',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,26,114,0.35)', borderRadius: 20,
              padding: '3px 10px',
              fontSize: '0.55rem', fontWeight: 800, color: '#ff6eb4', letterSpacing: '0.08em',
            }}>💗 WOMEN ONLY</div>
            {/* BOTTOM overlay text */}
            <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff', lineHeight: 1.2, textShadow: '0 0 20px rgba(255,26,114,0.8)' }}>
                Want REAL Equipment?
              </div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,200,230,0.85)', marginTop: 3 }}>
                Private pod · AI machines · Shower included
              </div>
            </div>
            {/* TAP TO EXPLORE tag */}
            <div style={{
              position: 'absolute', bottom: 10, right: 12,
              background: 'rgba(255,26,114,0.18)', backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,26,114,0.4)', borderRadius: 20,
              padding: '3px 10px',
              fontSize: '0.55rem', fontWeight: 900, color: '#ff6eb4', letterSpacing: '0.08em',
            }}>↗ SEE INSIDE</div>
          </div>

          {/* Bottom info + CTA */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(20,0,40,0.97), rgba(10,0,25,0.97))',
            padding: '12px 14px',
          }}>
            {/* Feature pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {[
                { icon: '🏋️', label: 'AI Gym Machines' },
                { icon: '🚿', label: 'Private Shower' },
                { icon: '🔒', label: 'Locked Pod' },
                { icon: '🤖', label: 'AI Coach Live' },
              ].map(f => (
                <div key={f.label} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: '0.55rem', fontWeight: 700,
                  padding: '3px 9px', borderRadius: 20,
                  background: 'rgba(255,26,114,0.08)',
                  border: '1px solid rgba(255,26,114,0.22)',
                  color: '#ff9ed0',
                }}>
                  <span>{f.icon}</span><span>{f.label}</span>
                </div>
              ))}
            </div>

            {/* Free offer / taxi booking */}
            {taxiState === 'idle' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#ff6eb4', letterSpacing: '0.04em' }}>
                    🎁 First Class — FREE
                  </div>
                  <div style={{ fontSize: '0.58rem', color: 'rgba(200,170,220,0.65)', marginTop: 2 }}>
                    + free taxi to nearest capsule 🚗
                  </div>
                </div>
                <button onClick={bookFreeTaxi} style={{
                  padding: '9px 18px', borderRadius: 30, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #ff1a72, #9b00ff)',
                  boxShadow: '0 0 20px rgba(255,26,114,0.5)',
                  fontSize: '0.65rem', fontWeight: 900, color: '#fff',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  Book Free →
                </button>
              </div>
            )}

            {taxiState === 'searching' && (
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>🔍</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ff6eb4', letterSpacing: '0.08em' }}>
                  FINDING YOUR DRIVER...
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 8 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#ff1a72',
                      animation: `textPulse 1s ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {(taxiState === 'found' || taxiState === 'arriving' || taxiState === 'arrived') && taxiDriver && (
              <div style={{
                borderRadius: 12,
                background: taxiState === 'arrived'
                  ? 'linear-gradient(135deg, rgba(0,200,100,0.12), rgba(0,255,150,0.06))'
                  : 'linear-gradient(135deg, rgba(255,26,114,0.10), rgba(155,0,255,0.08))',
                border: taxiState === 'arrived'
                  ? '1px solid rgba(0,200,100,0.35)'
                  : '1px solid rgba(255,26,114,0.25)',
                padding: '10px 12px',
              }}>
                {/* Driver row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'rgba(255,26,114,0.15)',
                    border: '1.5px solid rgba(255,26,114,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', flexShrink: 0,
                  }}>{taxiDriver.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#fff' }}>{taxiDriver.name}</div>
                    <div style={{ fontSize: '0.58rem', color: 'rgba(200,170,220,0.7)' }}>{taxiDriver.car} · {taxiDriver.plate}</div>
                    <div style={{ fontSize: '0.58rem', color: '#ffd700' }}>⭐ {taxiDriver.rating}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {taxiState === 'arrived' ? (
                      <div style={{ fontSize: '1.2rem' }}>✅</div>
                    ) : taxiState === 'arriving' ? (
                      <>
                        <div style={{ fontSize: '1.1rem' }}>🚗</div>
                        <div style={{ fontSize: '0.62rem', fontWeight: 900, color: '#ff6eb4' }}>
                          {Math.floor(taxiEta / 60)}m {taxiEta % 60}s
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: '1.1rem', animation: 'textPulse 1s infinite' }}>🚗</div>
                    )}
                  </div>
                </div>

                {/* Status bar */}
                <div style={{
                  textAlign: 'center', padding: '5px 10px', borderRadius: 20,
                  background: taxiState === 'arrived'
                    ? 'rgba(0,200,100,0.15)' : 'rgba(255,26,114,0.10)',
                  border: taxiState === 'arrived'
                    ? '1px solid rgba(0,200,100,0.3)' : '1px solid rgba(255,26,114,0.2)',
                  fontSize: '0.62rem', fontWeight: 800,
                  color: taxiState === 'arrived' ? '#00e87a' : '#ff6eb4',
                  letterSpacing: '0.06em',
                }}>
                  {taxiState === 'found' && '🎉 DRIVER CONFIRMED — HEADING YOUR WAY'}
                  {taxiState === 'arriving' && `🚗 EN ROUTE · GymHub Marina · ${Math.ceil(taxiEta / 60)} min away`}
                  {taxiState === 'arrived' && '✅ DRIVER ARRIVED — YOUR FREE CLASS AWAITS! 💗'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sweepGlow {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes textPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>

      <div className="glow-line w-full absolute bottom-0 left-0" />
    </div>
    </>
  );
};
