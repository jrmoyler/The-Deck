export enum Suit {
  HEARTS = 'HEARTS',
  DIAMONDS = 'DIAMONDS',
  SPADES = 'SPADES',
  CLUBS = 'CLUBS',
}

export enum ExerciseType {
  PUSHUPS = 'Push-Ups',
  DIPS = 'Dips',
  CRUNCHES = 'Crunches',
  BURPEES = 'Burpees',
}

export interface Card {
  id: string;
  suit: Suit;
  rank: string; // 2, 3, ... J, Q, K, A
  value: number; // 2-15
  exercise: ExerciseType;
  color: string;
}

export interface WorkoutStats {
  id: string;
  date: number;
  totalReps: number;
  duration: number; // seconds
  repsByExercise: Record<ExerciseType, number>;
  cardsCompleted: number;
  averageFormScore: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
