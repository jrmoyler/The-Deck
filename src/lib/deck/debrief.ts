import { EXERCISE_META } from "./catalog";
import { exerciseLabel, formatClock, pace } from "./format";
import type { ExerciseId, WorkoutStats } from "./types";

function topExercise(stats: WorkoutStats): ExerciseId | null {
  let best: ExerciseId | null = null;
  let max = 0;
  for (const [key, value] of Object.entries(stats.repsByExercise)) {
    if ((value ?? 0) > max) {
      max = value ?? 0;
      best = key as ExerciseId;
    }
  }
  return best;
}

export function debrief(stats: WorkoutStats, previous?: WorkoutStats | null): string {
  const minutes = formatClock(stats.durationSec);
  const lead = topExercise(stats);
  const leadLabel = lead ? EXERCISE_META[lead].label.toLowerCase() : "work";
  const rate = Math.round(pace(stats));

  if (stats.totalReps === 0) {
    return "Nothing logged that round. Start the next deck when you're ready — the count only moves when you tap a rep.";
  }

  const lines: string[] = [];

  if (stats.completed) {
    lines.push(
      `Full pass: ${stats.cardsCleared} cards cleared${stats.cardsSkipped ? `, ${stats.cardsSkipped} skipped` : ""} in ${minutes}. ${stats.totalReps} reps, about ${rate} a minute.`,
    );
  } else {
    lines.push(
      `Stopped at ${stats.cardsCleared + stats.cardsSkipped} of ${stats.cardsTotal} cards. ${stats.totalReps} reps in ${minutes} still count.`,
    );
  }

  if (lead) {
    const n = stats.repsByExercise[lead] ?? 0;
    lines.push(`${exerciseLabel(lead)} led the volume at ${n} reps.`);
  }

  if (previous && previous.totalReps > 0) {
    const delta = stats.totalReps - previous.totalReps;
    if (delta > 8) lines.push(`That's ${delta} more reps than the previous session.`);
    else if (delta < -8) lines.push(`Quieter than last time by ${Math.abs(delta)} reps. That's allowed.`);
    else lines.push(`Right in range of the last session.`);
  } else {
    lines.push(`Keep the mapping honest, tap every rep, and the log stays true.`);
  }

  if (lead === "burpees" && (stats.repsByExercise.burpees ?? 0) > 40) {
    lines.push(`The clubs add up. If the jump starts to fade, step the feet back and keep moving.`);
  }

  return lines.join(" ");
}

export function announce(cardValue: number, exercise: ExerciseId): string {
  return `${cardValue} ${EXERCISE_META[exercise].label}`;
}
