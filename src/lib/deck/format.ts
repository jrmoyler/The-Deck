import { EXERCISE_META, SIZE_META } from "./catalog";
import type { DeckSize, ExerciseId, WorkoutStats } from "./types";

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatDate(ts: number): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(ts));
}

export function formatDay(ts: number): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(ts));
}

export function exerciseLabel(id: ExerciseId): string {
  return EXERCISE_META[id].label;
}

export function sizeLabel(size: DeckSize): string {
  return SIZE_META[size].label;
}

export function pace(stats: WorkoutStats): number {
  const minutes = Math.max(stats.durationSec / 60, 1 / 60);
  return stats.totalReps / minutes;
}

export function streakDays(history: WorkoutStats[], now = Date.now()): number {
  if (history.length === 0) return 0;
  const days = new Set(
    history.map((row) => {
      const d = new Date(row.date);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );

  let streak = 0;
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);

  for (;;) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (!days.has(key)) {
      if (streak === 0) {
        cursor.setDate(cursor.getDate() - 1);
        const yesterday = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
        if (!days.has(yesterday)) return 0;
        continue;
      }
      return streak;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
    if (streak > 400) return streak;
  }
}

export function weekVolume(history: WorkoutStats[], now = Date.now()): Array<{ day: string; reps: number }> {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());

  return days.map((day, index) => {
    const from = start.getTime() + index * 86400000;
    const to = from + 86400000;
    const reps = history
      .filter((row) => row.date >= from && row.date < to)
      .reduce((sum, row) => sum + row.totalReps, 0);
    return { day, reps };
  });
}
