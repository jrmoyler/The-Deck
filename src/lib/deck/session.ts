import { buildDeck } from "./deck";
import type { ActiveWorkout, CardResult, WorkoutConfig, WorkoutStats } from "./types";

export function createWorkout(config: WorkoutConfig, now = Date.now()): ActiveWorkout {
  const deck = buildDeck({
    size: config.size,
    scoring: config.scoring,
    mapping: config.mapping,
  });

  return {
    id: crypto.randomUUID(),
    config,
    deck,
    index: 0,
    repsLogged: 0,
    results: [],
    startedAt: now,
    pausedAt: null,
    pauseAccumMs: 0,
    restUntil: null,
    phase: "work",
  };
}

export function currentCard(workout: ActiveWorkout) {
  return workout.deck[workout.index] ?? null;
}

export function elapsedMs(workout: ActiveWorkout, now = Date.now()): number {
  const freezeAt = workout.pausedAt ?? now;
  return Math.max(0, freezeAt - workout.startedAt - workout.pauseAccumMs);
}

function finishCard(workout: ActiveWorkout, logged: number, skipped: boolean, now: number): ActiveWorkout {
  const card = currentCard(workout);
  if (!card) return { ...workout, phase: "done", restUntil: null };

  const result: CardResult = { card, logged, skipped };
  const results = [...workout.results, result];
  const nextIndex = workout.index + 1;

  if (nextIndex >= workout.deck.length) {
    return {
      ...workout,
      results,
      repsLogged: 0,
      index: nextIndex,
      phase: "done",
      restUntil: null,
      pausedAt: null,
    };
  }

  const rest = workout.config.restSeconds;
  if (rest > 0) {
    return {
      ...workout,
      results,
      repsLogged: 0,
      index: nextIndex,
      phase: "rest",
      restUntil: now + rest * 1000,
    };
  }

  return {
    ...workout,
    results,
    repsLogged: 0,
    index: nextIndex,
    phase: "work",
    restUntil: null,
  };
}

export function logRep(workout: ActiveWorkout, now = Date.now()): ActiveWorkout {
  if (workout.phase !== "work" || workout.pausedAt) return workout;
  const card = currentCard(workout);
  if (!card) return { ...workout, phase: "done" };
  const next = Math.min(card.value, workout.repsLogged + 1);
  if (next >= card.value) return finishCard(workout, card.value, false, now);
  return { ...workout, repsLogged: next };
}

export function completeSet(workout: ActiveWorkout, now = Date.now()): ActiveWorkout {
  if (workout.phase !== "work" || workout.pausedAt) return workout;
  const card = currentCard(workout);
  if (!card) return { ...workout, phase: "done" };
  return finishCard(workout, card.value, false, now);
}

export function skipCard(workout: ActiveWorkout, now = Date.now()): ActiveWorkout {
  if (workout.phase !== "work" || workout.pausedAt) return workout;
  const card = currentCard(workout);
  if (!card) return { ...workout, phase: "done" };
  return finishCard(workout, workout.repsLogged, true, now);
}

export function advanceRest(workout: ActiveWorkout, now = Date.now()): ActiveWorkout {
  if (workout.phase !== "rest") return workout;
  return { ...workout, phase: "work", restUntil: null, repsLogged: 0 };
}

export function maybeAdvanceRest(workout: ActiveWorkout, now = Date.now()): ActiveWorkout {
  if (workout.phase !== "rest" || workout.restUntil == null) return workout;
  if (now < workout.restUntil) return workout;
  return advanceRest(workout, now);
}

export function pauseWorkout(workout: ActiveWorkout, now = Date.now()): ActiveWorkout {
  if (workout.pausedAt || workout.phase === "done") return workout;
  return { ...workout, pausedAt: now };
}

export function resumeWorkout(workout: ActiveWorkout, now = Date.now()): ActiveWorkout {
  if (!workout.pausedAt) return workout;
  return {
    ...workout,
    pauseAccumMs: workout.pauseAccumMs + (now - workout.pausedAt),
    pausedAt: null,
    restUntil:
      workout.phase === "rest" && workout.restUntil
        ? workout.restUntil + (now - workout.pausedAt)
        : workout.restUntil,
  };
}

export function summarize(workout: ActiveWorkout, now = Date.now()): WorkoutStats {
  const repsByExercise: WorkoutStats["repsByExercise"] = {};
  for (const result of workout.results) {
    const key = result.card.exercise;
    repsByExercise[key] = (repsByExercise[key] ?? 0) + result.logged;
  }
  if (workout.phase === "work" && workout.repsLogged > 0) {
    const card = currentCard(workout);
    if (card) {
      repsByExercise[card.exercise] = (repsByExercise[card.exercise] ?? 0) + workout.repsLogged;
    }
  }

  const totalReps = Object.values(repsByExercise).reduce((sum, n) => sum + (n ?? 0), 0);
  const cardsSkipped = workout.results.filter((r) => r.skipped).length;
  const cardsCleared = workout.results.filter((r) => !r.skipped).length;

  return {
    id: workout.id,
    date: workout.startedAt,
    durationSec: Math.max(1, Math.round(elapsedMs(workout, now) / 1000)),
    totalReps,
    cardsCleared,
    cardsSkipped,
    cardsTotal: workout.deck.length,
    repsByExercise,
    size: workout.config.size,
    scoring: workout.config.scoring,
    completed: workout.phase === "done",
  };
}
