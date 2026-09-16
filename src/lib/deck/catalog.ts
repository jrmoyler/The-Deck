import type { DeckSize, ExerciseId, Scoring, Settings, Suit } from "./types";
import { EXERCISES } from "./types";

export { EXERCISES };

export const EXERCISE_META: Record<
  ExerciseId,
  { label: string; cue: string; regression: string }
> = {
  pushups: {
    label: "Push-ups",
    cue: "Hands under shoulders. Body in one line. Chest just off the floor.",
    regression: "Drop to your knees, or elevate your hands on a bench.",
  },
  squats: {
    label: "Squats",
    cue: "Sit the hips back. Knees track the toes. Stand up hard.",
    regression: "Sit to a chair and stand. Keep the feet planted.",
  },
  situps: {
    label: "Sit-ups",
    cue: "Feet down. Ribs toward thighs. Hands at the temples — don't yank the neck.",
    regression: "Crunches, or a dead bug if your back complains.",
  },
  burpees: {
    label: "Burpees",
    cue: "Hands down, plank, chest down, stand, jump. Breathe at the top.",
    regression: "Step back instead of jumping. Skip the jump at the top.",
  },
  dips: {
    label: "Dips",
    cue: "Hands on a stable chair. Lower until the upper arms are near parallel. Don't shrug.",
    regression: "Keep the feet closer, or do bench dips with bent knees.",
  },
  lunges: {
    label: "Lunges",
    cue: "Long step. Back knee toward the floor. Front knee stacked over the mid-foot.",
    regression: "Reverse lunges, or split squats holding a chair.",
  },
  mountainClimbers: {
    label: "Mountain climbers",
    cue: "Strong plank. Drive the knees. Count one rep each time a knee comes forward.",
    regression: "Slow the pace, or elevate the hands.",
  },
  jumpingJacks: {
    label: "Jumping jacks",
    cue: "Soft landings. Arms reach overhead. Stay tall.",
    regression: "Step one foot out at a time. Skip the jump.",
  },
};

export const SUIT_META: Record<Suit, { label: string; pip: string; red: boolean }> = {
  hearts: { label: "Hearts", pip: "♥", red: true },
  diamonds: { label: "Diamonds", pip: "♦", red: true },
  spades: { label: "Spades", pip: "♠", red: false },
  clubs: { label: "Clubs", pip: "♣", red: false },
};

export const DEFAULT_MAPPING: Record<Suit, ExerciseId> = {
  hearts: "pushups",
  diamonds: "squats",
  spades: "situps",
  clubs: "burpees",
};

export const DEFAULT_SETTINGS: Settings = {
  mapping: DEFAULT_MAPPING,
  scoring: "standard",
  restSeconds: 15,
  voice: false,
};

export const SCORING_META: Record<Scoring, { label: string; detail: string }> = {
  standard: { label: "Standard", detail: "Face cards 10, ace 11" },
  heavy: { label: "Heavy", detail: "Face cards 10, ace 14" },
  ranked: { label: "Ranked", detail: "J 11, Q 12, K 13, ace 14" },
};

export const SIZE_META: Record<DeckSize, { label: string; cards: number; blurb: string }> = {
  full: { label: "Full deck", cards: 52, blurb: "Every card. The real session." },
  half: { label: "Half deck", cards: 26, blurb: "Shorter. Same shuffle." },
  hearts: { label: "Hearts only", cards: 13, blurb: "One suit, one movement." },
  diamonds: { label: "Diamonds only", cards: 13, blurb: "One suit, one movement." },
  spades: { label: "Spades only", cards: 13, blurb: "One suit, one movement." },
  clubs: { label: "Clubs only", cards: 13, blurb: "One suit, one movement." },
};

export const REST_OPTIONS: Array<{ value: Settings["restSeconds"]; label: string }> = [
  { value: 0, label: "No rest" },
  { value: 15, label: "15 seconds" },
  { value: 30, label: "30 seconds" },
  { value: 45, label: "45 seconds" },
];
