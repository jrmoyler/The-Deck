import { WorkoutStats } from '../types';

const STORAGE_KEY = 'the_deck_workout_history';

export const saveWorkout = (stats: WorkoutStats): void => {
  const history = getWorkoutHistory();
  const updatedHistory = [stats, ...history];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
};

export const getWorkoutHistory = (): WorkoutStats[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse workout history', e);
    return [];
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
