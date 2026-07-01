import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

import { Welcome } from './components/Welcome';
import { BandPairing } from './components/BandPairing';
import { Onboarding } from './components/Onboarding';
import { AIGenerating } from './components/AIGenerating';
import { WorkoutSession } from './components/WorkoutSession';
import { PostWorkout } from './components/PostWorkout';

import type { Screen, UserProfile, Exercise, BandData, WorkoutStats } from './types';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [band, setBand] = useState<BandData | null>(null);
  const [stats, setStats] = useState<WorkoutStats | null>(null);

  const handleBandConnect = useCallback((b: BandData) => {
    setBand(b);
    setScreen('onboarding');
  }, []);

  const handleBandSkip = useCallback(() => {
    setBand(null);
    setScreen('onboarding');
  }, []);

  const handleOnboardingComplete = useCallback((p: UserProfile) => {
    setProfile(p);
    setScreen('ai-generating');
  }, []);

  const handleWorkoutReady = useCallback((exs: Exercise[]) => {
    setExercises(exs);
    setScreen('workout');
  }, []);

  const handleWorkoutComplete = useCallback((s: WorkoutStats) => {
    setStats(s);
    setScreen('post-workout');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#07070f' }}>
      {screen === 'welcome' && (
        <Welcome onStart={() => setScreen('band-pairing')} />
      )}
      {screen === 'band-pairing' && (
        <BandPairing onConnect={handleBandConnect} onSkip={handleBandSkip} />
      )}
      {screen === 'onboarding' && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      {screen === 'ai-generating' && profile && (
        <AIGenerating profile={profile} onReady={handleWorkoutReady} />
      )}
      {screen === 'workout' && exercises.length > 0 && (
        <WorkoutSession exercises={exercises} band={band} onComplete={handleWorkoutComplete} />
      )}
      {screen === 'post-workout' && stats && profile && (
        <PostWorkout stats={stats} userName={profile.name} />
      )}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
