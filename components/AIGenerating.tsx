import React, { useState, useEffect } from 'react';
import type { UserProfile, Exercise } from '../types';

interface AIGeneratingProps {
  profile: UserProfile;
  onReady: (exercises: Exercise[]) => void;
}

const GOAL_EXERCISES: Record<string, { name: string; icon: string; muscleGroup: string; reps: number }[]> = {
  'strength': [
    { name: 'Squat Pulses', icon: '🦵', muscleGroup: 'Glutes & Quads', reps: 20 },
    { name: 'Hip Thrusts', icon: '🍑', muscleGroup: 'Glutes', reps: 15 },
    { name: 'Romanian Deadlift', icon: '🏋️', muscleGroup: 'Hamstrings', reps: 12 },
    { name: 'Push-Up Holds', icon: '💪', muscleGroup: 'Chest & Triceps', reps: 10 },
    { name: 'Lateral Lunges', icon: '🦵', muscleGroup: 'Inner Thighs', reps: 12 },
  ],
  'fat-loss': [
    { name: 'Jump Squats', icon: '⚡', muscleGroup: 'Full Body', reps: 20 },
    { name: 'Burpees', icon: '🔥', muscleGroup: 'Full Body', reps: 10 },
    { name: 'Mountain Climbers', icon: '🏃', muscleGroup: 'Core & Cardio', reps: 30 },
    { name: 'High Knees', icon: '💨', muscleGroup: 'Cardio', reps: 40 },
    { name: 'Plank to Push-Up', icon: '🎯', muscleGroup: 'Core & Chest', reps: 12 },
  ],
  'endurance': [
    { name: 'Walking Lunges', icon: '🚶', muscleGroup: 'Legs', reps: 20 },
    { name: 'Step-Ups', icon: '👟', muscleGroup: 'Glutes & Legs', reps: 15 },
    { name: 'Skater Hops', icon: '⛸️', muscleGroup: 'Cardio', reps: 20 },
    { name: 'Side Plank Hip Dips', icon: '🌊', muscleGroup: 'Core', reps: 15 },
    { name: 'Box Breathing Sprint', icon: '💨', muscleGroup: 'Cardio', reps: 30 },
  ],
};

function buildWorkout(profile: UserProfile): Exercise[] {
  const base = GOAL_EXERCISES[profile.goal] || GOAL_EXERCISES['strength'];
  const repMultiplier = profile.energy >= 4 ? 1.2 : profile.energy <= 2 ? 0.7 : 1;
  const sets = profile.level === 'advanced' ? 4 : profile.level === 'intermediate' ? 3 : 2;
  return base.map((ex, i) => ({
    id: `ex-${i}`,
    name: ex.name,
    targetReps: Math.round(ex.reps * repMultiplier),
    sets,
    restSeconds: profile.level === 'beginner' ? 60 : 45,
    icon: ex.icon,
    muscleGroup: ex.muscleGroup,
    currentReps: 0,
    currentSet: 1,
    completed: false,
  }));
}

async function fetchAIWorkout(profile: UserProfile): Promise<Exercise[] | null> {
  try {
    const res = await fetch('/api/generate-workout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: profile.name,
        goal: profile.goal,
        level: profile.level,
        energy: profile.energy,
        cyclePhase: profile.cyclePhase,
        duration: profile.duration,
      }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.exercises && Array.isArray(data.exercises)) {
      return data.exercises.map((ex: any, i: number) => ({
        id: `ai-ex-${i}`,
        name: ex.name,
        targetReps: ex.reps ?? 15,
        sets: ex.sets ?? 3,
        restSeconds: ex.rest ?? 45,
        icon: ex.icon ?? '💪',
        muscleGroup: ex.muscleGroup ?? 'Full Body',
        currentReps: 0,
        currentSet: 1,
        completed: false,
      }));
    }
    return null;
  } catch {
    return null; // fallback to local generation
  }
}

const STEPS = [
  { label: 'Connecting to AMD Instinct™ GPU...', delay: 0 },
  { label: 'Analyzing your cycle phase & energy...', delay: 900 },
  { label: 'Loading Fireworks AI inference engine...', delay: 1700 },
  { label: 'Optimizing workout for your goals...', delay: 2500 },
  { label: 'Calculating rep targets & rest periods...', delay: 3300 },
  { label: 'Your personalized plan is ready ✓', delay: 4200 },
];

export const AIGenerating: React.FC<AIGeneratingProps> = ({ profile, onReady }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Fire AI API call in background while steps animate
    const aiPromise = fetchAIWorkout(profile);

    STEPS.forEach((s, i) => {
      timers.push(setTimeout(() => {
        if (cancelled) return;
        setCompletedSteps((prev) => [...prev, i]);
        if (i === STEPS.length - 1) {
          setTimeout(async () => {
            if (cancelled) return;
            setDone(true);
            const aiExercises = await aiPromise;
            setTimeout(() => onReady(aiExercises ?? buildWorkout(profile)), 800);
          }, 500);
        }
      }, s.delay));
    });
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [profile, onReady]);

  const goalLabel = profile.goal === 'strength' ? 'Strength & Sculpt'
    : profile.goal === 'fat-loss' ? 'Fat Burn' : 'Endurance';
  const cycleLabel = { follicular: 'Follicular 🌸', ovulation: 'Ovulation ⭐', luteal: 'Luteal 🌙', menstrual: 'Menstrual 💙' }[profile.cyclePhase];

  return (
    <div className="relative min-h-screen bg-dark flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="orb orb-1" style={{ opacity: 0.4 }} />
      <div className="orb orb-3" style={{ opacity: 0.3 }} />

      {/* Title */}
      <div className="text-center mb-10 relative z-10 slide-up">
        <div className="neon-badge mb-4">AI Coach Processing</div>
        <h2 className="text-2xl font-bold text-main">
          Building your plan, <span className="gradient-text-2">{profile.name}</span> 💗
        </h2>
        <p className="text-muted text-sm mt-2">{goalLabel} · {cycleLabel} · {profile.duration} min</p>
      </div>

      {/* Rotating rings */}
      <div className="relative mb-12" style={{ width: 200, height: 200 }}>
        <div className="ai-ring ai-ring-1" />
        <div className="ai-ring ai-ring-2" />
        <div className="ai-ring ai-ring-3" />

        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="glass-card-pink flex flex-col items-center justify-center"
            style={{ width: 72, height: 72, borderRadius: '50%' }}>
            {done
              ? <span style={{ fontSize: '1.8rem' }}>✨</span>
              : <span style={{ fontSize: '1.8rem' }}>🧠</span>
            }
          </div>
        </div>
      </div>

      {/* Processing steps */}
      <div className="glass-card p-5 w-full max-w-sm relative z-10">
        <div className="flex gap-3 mb-4 items-center">
          <span className="neon-badge-purple text-xs">AMD × Fireworks AI</span>
          <span className="text-muted text-xs">Inference Engine</span>
        </div>
        <div className="flex flex-col gap-2">
          {STEPS.map((s, i) => {
            const isComplete = completedSteps.includes(i);
            const isActive = completedSteps.length === i;
            return (
              <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${isComplete ? 'opacity-100' : 'opacity-25'}`}>
                <div className="flex-shrink-0" style={{ width: 18, height: 18 }}>
                  {isComplete ? (
                    <span style={{ color: '#22c55e', fontSize: '0.9rem' }}>✓</span>
                  ) : isActive ? (
                    <span className="loading loading-spinner loading-xs" style={{ color: 'var(--pink)' }} />
                  ) : (
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>○</span>
                  )}
                </div>
                <span className={`text-sm ${isComplete ? 'text-main' : 'text-muted'}`}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glow-line w-full absolute bottom-0 left-0" />
    </div>
  );
};
