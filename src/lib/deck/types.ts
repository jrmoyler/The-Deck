export const SUITS = ["hearts", "diamonds", "spades", "clubs"] as const;
export type Suit = (typeof SUITS)[number];

export const RANKS = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
] as const;
export type Rank = (typeof RANKS)[number];

export const EXERCISES = [
  "pushups",
  "squats",
  "situps",
  "burpees",
  "dips",
  "lunges",
  "mountainClimbers",
  "jumpingJacks",
] as const;
export type ExerciseId = (typeof EXERCISES)[number];

export type DeckSize = "full" | "half" | Suit;
export type Scoring = "standard" | "heavy" | "ranked";
export type RestSeconds = 0 | 15 | 30 | 45;

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number;
  exercise: ExerciseId;
}

export interface Settings {
  mapping: Record<Suit, ExerciseId>;
  scoring: Scoring;
  restSeconds: RestSeconds;
  voice: boolean;
}

export interface WorkoutConfig extends Settings {
  size: DeckSize;
}

export interface CardResult {
  card: Card;
  logged: number;
  skipped: boolean;
}

export type WorkoutPhase = "work" | "rest" | "done";

export interface ActiveWorkout {
  id: string;
  config: WorkoutConfig;
  deck: Card[];
  index: number;
  repsLogged: number;
  results: CardResult[];
  startedAt: number;
  pausedAt: number | null;
  pauseAccumMs: number;
  restUntil: number | null;
  phase: WorkoutPhase;
}

export interface WorkoutStats {
  id: string;
  date: number;
  durationSec: number;
  totalReps: number;
  cardsCleared: number;
  cardsSkipped: number;
  cardsTotal: number;
  repsByExercise: Partial<Record<ExerciseId, number>>;
  size: DeckSize;
  scoring: Scoring;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "coach";
  text: string;
  at: number;
}
