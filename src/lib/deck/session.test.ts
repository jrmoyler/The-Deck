import { describe, expect, it } from "vitest";
import { buildDeck, rankValue } from "./deck";
import { completeSet, createWorkout, logRep, skipCard, summarize } from "./session";
import { DEFAULT_SETTINGS } from "./catalog";

describe("rankValue", () => {
  it("uses standard face and ace values", () => {
    expect(rankValue("10", "standard")).toBe(10);
    expect(rankValue("J", "standard")).toBe(10);
    expect(rankValue("A", "standard")).toBe(11);
    expect(rankValue("A", "heavy")).toBe(14);
    expect(rankValue("K", "ranked")).toBe(13);
  });
});

describe("buildDeck", () => {
  it("builds 52, 26, or 13 cards", () => {
    const rng = () => 0.3;
    expect(buildDeck({ size: "full", scoring: "standard", rng })).toHaveLength(52);
    expect(buildDeck({ size: "half", scoring: "standard", rng })).toHaveLength(26);
    expect(buildDeck({ size: "hearts", scoring: "standard", rng })).toHaveLength(13);
  });
});

describe("session", () => {
  it("counts every logged rep including the last card", () => {
    const workout = createWorkout({ ...DEFAULT_SETTINGS, size: "hearts" }, 1_000);
    const first = workout.deck[0]!;
    let next = workout;
    for (let i = 0; i < first.value; i += 1) next = logRep(next, 1_000);
    expect(next.results).toHaveLength(1);
    expect(next.results[0]?.logged).toBe(first.value);
    expect(next.index).toBe(1);
  });

  it("complete set logs the full target", () => {
    const workout = createWorkout({ ...DEFAULT_SETTINGS, size: "clubs", restSeconds: 0 }, 1_000);
    const first = workout.deck[0]!;
    const next = completeSet(workout, 1_000);
    expect(next.results[0]?.logged).toBe(first.value);
    expect(next.results[0]?.skipped).toBe(false);
  });

  it("skip keeps partial reps and marks skipped", () => {
    let workout = createWorkout({ ...DEFAULT_SETTINGS, size: "spades", restSeconds: 0 }, 1_000);
    workout = logRep(workout, 1_000);
    workout = skipCard(workout, 1_000);
    expect(workout.results[0]?.skipped).toBe(true);
    expect(workout.results[0]?.logged).toBe(1);
    const stats = summarize(workout, 2_000);
    expect(stats.totalReps).toBe(1);
    expect(stats.cardsSkipped).toBe(1);
  });
});
