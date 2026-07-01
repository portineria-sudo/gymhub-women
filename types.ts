export type Screen = 'welcome' | 'band-pairing' | 'onboarding' | 'ai-generating' | 'workout' | 'post-workout';

export type Goal = 'strength' | 'fat-loss' | 'endurance';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type CyclePhase = 'follicular' | 'ovulation' | 'luteal' | 'menstrual';
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;
export type Duration = 20 | 30 | 45 | 60;

export interface UserProfile {
  name: string;
  goal: Goal;
  level: Level;
  cyclePhase: CyclePhase;
  energy: EnergyLevel;
  duration: Duration;
}

export interface Exercise {
  id: string;
  name: string;
  targetReps: number;
  sets: number;
  restSeconds: number;
  icon: string;
  muscleGroup: string;
  currentReps: number;
  currentSet: number;
  completed: boolean;
}

export interface BandData {
  connected: boolean;
  battery: number;
  heartRate: number;
  repsThisSet: number;
  motionActive: boolean;
}

export interface WorkoutStats {
  durationSeconds: number;
  caloriesBurned: number;
  totalReps: number;
  avgHeartRate: number;
  exercisesCompleted: number;
}

export interface TaxiDriver {
  name: string;
  car: string;
  plate: string;
  eta: number;
  rating: number;
  avatar: string;
}
