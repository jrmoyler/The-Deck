import { DEFAULT_MAPPING } from "./catalog";
import type { Card, DeckSize, ExerciseId, Rank, Scoring, Suit } from "./types";
import { RANKS, SUITS } from "./types";

export function rankValue(rank: Rank, scoring: Scoring): number {
  const numeric = Number(rank);
  if (!Number.isNaN(numeric)) return numeric;
  if (scoring === "standard") {
    if (rank === "A") return 11;
    return 10;
  }
  if (scoring === "heavy") {
    if (rank === "A") return 14;
    return 10;
  }
  if (rank === "J") return 11;
  if (rank === "Q") return 12;
  if (rank === "K") return 13;
  return 14;
}

export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [next[i], next[j]] = [next[j]!, next[i]!];
  }
  return next;
}

export function buildDeck(options: {
  size: DeckSize;
  scoring: Scoring;
  mapping?: Record<Suit, ExerciseId>;
  rng?: () => number;
}): Card[] {
  const mapping = options.mapping ?? DEFAULT_MAPPING;
  const suits: Suit[] =
    options.size === "full" || options.size === "half" ? [...SUITS] : [options.size];

  const cards: Card[] = [];
  for (const suit of suits) {
    for (const rank of RANKS) {
      cards.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value: rankValue(rank, options.scoring),
        exercise: mapping[suit],
      });
    }
  }

  const shuffled = shuffle(cards, options.rng);
  if (options.size === "half") return shuffled.slice(0, 26);
  return shuffled;
}

export function expectedVolume(deck: Card[]): number {
  return deck.reduce((sum, card) => sum + card.value, 0);
}
