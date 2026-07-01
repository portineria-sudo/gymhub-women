import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { UserProfile, Goal, Level, CyclePhase, EnergyLevel, Duration } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<Goal | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [cyclePhase, setCyclePhase] = useState<CyclePhase | null>(null);
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [duration, setDuration] = useState<Duration | null>(null);

  const goals: { key: Goal; emoji: string; label: string; desc: string }[] = [
    { key: 'strength', emoji: '💪', label: 'Build Strength', desc: 'Tone & sculpt your body' },
    { key: 'fat-loss', emoji: '🔥', label: 'Fat Loss', desc: 'Burn calories efficiently' },
    { key: 'endurance', emoji: '⚡', label: 'Endurance', desc: 'Boost stamina & energy' },
  ];

  const levels: { key: Level; emoji: string; label: string }[] = [
    { key: 'beginner', emoji: '🌱', label: 'Beginner' },
    { key: 'intermediate', emoji: '🌿', label: 'Intermediate' },
    { key: 'advanced', emoji: '🌳', label: 'Advanced' },
  ];

  const phases: { key: CyclePhase; emoji: string; label: string; desc: string }[] = [
    { key: 'follicular', emoji: '🌸', label: 'Follicular', desc: 'High energy phase' },
    { key: 'ovulation', emoji: '⭐', label: 'Ovulation', desc: 'Peak performance' },
    { key: 'luteal', emoji: '🌙', label: 'Luteal', desc: 'Moderate intensity' },
    { key: 'menstrual', emoji: '💙', label: 'Menstrual', desc: 'Rest & gentle movement' },
  ];

  const canNext = () => {
    if (step === 0) return name.trim().length > 0 && goal !== null;
    if (step === 1) return level !== null && cyclePhase !== null;
    if (step === 2) return energy !== null && duration !== null;
    return false;
  };

  const handleNext = () => {
    if (step < 2) { setStep(step + 1); return; }
    onComplete({
      name: name.trim(),
      goal: goal!,
      level: level!,
      cyclePhase: cyclePhase!,
      energy: energy!,
      duration: duration!,
    });
  };

  return (
    <div className="relative min-h-screen bg-dark flex flex-col px-5 py-8 overflow-hidden">
      <div className="orb orb-1" style={{ opacity: 0.3 }} />

      {/* Step pills */}
      <div className="flex gap-2 mb-8 relative z-10 px-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`step-pill ${i === step ? 'active' : i < step ? 'done' : ''}`} />
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 relative z-10">
        {step === 0 && (
          <div className="slide-up">
            <div className="neon-badge mb-4">Step 1 of 3</div>
            <h2 className="text-2xl font-bold text-main mb-1">Hey, I am your</h2>
            <h2 className="text-2xl font-bold gradient-text mb-6">AI Coach 💗</h2>

            {/* Name input */}
            <div className="mb-6">
              <label className="text-muted text-xs font-semibold uppercase tracking-widest mb-2 block">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full rounded-xl px-4 py-3 text-main font-medium text-base outline-none transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: name ? '1px solid var(--pink)' : '1px solid var(--border-subtle)',
                  boxShadow: name ? '0 0 12px var(--pink-glow)' : 'none',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {/* Goal selection */}
            <div className="mb-4">
              <label className="text-muted text-xs font-semibold uppercase tracking-widest mb-3 block">Your Goal</label>
              <div className="flex flex-col gap-3">
                {goals.map((g) => (
                  <div key={g.key} className={`select-card flex items-center gap-3 ${goal === g.key ? 'selected' : ''}`}
                    onClick={() => setGoal(g.key)}>
                    <span style={{ fontSize: '1.5rem' }}>{g.emoji}</span>
                    <div>
                      <div className="text-main font-semibold text-sm">{g.label}</div>
                      <div className="text-muted text-xs">{g.desc}</div>
                    </div>
                    {goal === g.key && <div className="ml-auto text-pink">✓</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="slide-up">
            <div className="neon-badge mb-4">Step 2 of 3</div>
            <h2 className="text-2xl font-bold text-main mb-1">Tell me about</h2>
            <h2 className="text-2xl font-bold gradient-text mb-6">Your Body 🌸</h2>

            <div className="mb-6">
              <label className="text-muted text-xs font-semibold uppercase tracking-widest mb-3 block">Fitness Level</label>
              <div className="flex gap-3">
                {levels.map((l) => (
                  <div key={l.key} className={`select-card flex-1 text-center ${level === l.key ? 'selected' : ''}`}
                    onClick={() => setLevel(l.key)}>
                    <div style={{ fontSize: '1.4rem' }} className="mb-1">{l.emoji}</div>
                    <div className="text-main text-xs font-semibold">{l.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-muted text-xs font-semibold uppercase tracking-widest mb-3 block">Cycle Phase</label>
              <div className="grid grid-cols-2 gap-3">
                {phases.map((p) => (
                  <div key={p.key} className={`select-card text-center ${cyclePhase === p.key ? 'selected' : ''}`}
                    onClick={() => setCyclePhase(p.key)}>
                    <div style={{ fontSize: '1.4rem' }} className="mb-1">{p.emoji}</div>
                    <div className="text-main text-xs font-semibold">{p.label}</div>
                    <div className="text-muted" style={{ fontSize: '0.65rem' }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="slide-up">
            <div className="neon-badge mb-4">Step 3 of 3</div>
            <h2 className="text-2xl font-bold text-main mb-1">How are you</h2>
            <h2 className="text-2xl font-bold gradient-text mb-6">Feeling today? ⚡</h2>

            <div className="mb-6">
              <label className="text-muted text-xs font-semibold uppercase tracking-widest mb-3 block">Energy Level</label>
              <div className="flex gap-2">
                {([1, 2, 3, 4, 5] as EnergyLevel[]).map((e) => {
                  const emojis = ['😴', '😐', '🙂', '😊', '🔥'];
                  return (
                    <div key={e} className={`select-card flex-1 text-center py-4 ${energy === e ? 'selected' : ''}`}
                      onClick={() => setEnergy(e)}>
                      <div style={{ fontSize: '1.4rem' }}>{emojis[e - 1]}</div>
                      <div className="text-muted text-xs mt-1">{e}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-muted text-xs font-semibold uppercase tracking-widest mb-3 block">Session Duration</label>
              <div className="grid grid-cols-4 gap-3">
                {([20, 30, 45, 60] as Duration[]).map((d) => (
                  <div key={d} className={`select-card text-center py-4 ${duration === d ? 'selected' : ''}`}
                    onClick={() => setDuration(d)}>
                    <div className="text-main font-bold text-lg">{d}</div>
                    <div className="text-muted text-xs">min</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="relative z-10 flex gap-3 pt-4">
        {step > 0 && (
          <button className="btn-ghost-pink flex items-center gap-2 px-6" onClick={() => setStep(step - 1)}>
            <ChevronLeft size={16} /> Back
          </button>
        )}
        <button className="btn-neon flex-1 flex items-center justify-center gap-2"
          onClick={handleNext}
          disabled={!canNext()}
          style={{ opacity: canNext() ? 1 : 0.4, cursor: canNext() ? 'pointer' : 'not-allowed' }}>
          {step < 2 ? <>Next <ChevronRight size={16} /></> : <>Generate My Workout ✨</>}
        </button>
      </div>
    </div>
  );
};
