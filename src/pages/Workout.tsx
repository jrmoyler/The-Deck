import { useNavigate, useSearchParams } from "react-router-dom";
import { Pause, Play, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PlayingCard } from "@/components/playing-card";
import { Button } from "@/components/ui/button";
import { EXERCISE_META, SIZE_META } from "@/lib/deck/catalog";
import { announce, debrief } from "@/lib/deck/debrief";
import { buildDeck, expectedVolume } from "@/lib/deck/deck";
import { exerciseLabel, formatClock, sizeLabel } from "@/lib/deck/format";
import { currentCard, elapsedMs } from "@/lib/deck/session";
import { useDeckStore } from "@/lib/deck/store";
import type { DeckSize } from "@/lib/deck/types";
import { SUITS } from "@/lib/deck/types";
import { hush, speak } from "@/lib/deck/voice";

const DEALS: DeckSize[] = ["full", "half", "hearts", "diamonds", "spades", "clubs"];

function parseDeal(value: unknown): DeckSize | undefined {
  return typeof value === "string" && (DEALS as string[]).includes(value)
    ? (value as DeckSize)
    : undefined;
}

export function WorkoutPage() {
  const [params] = useSearchParams();
  const deal = parseDeal(params.get("deal"));
  const navigate = useNavigate();
  const hydrated = useDeckStore((s) => s.hydrated);
  const session = useDeckStore((s) => s.session);
  const lastFinished = useDeckStore((s) => s.lastFinished);
  const history = useDeckStore((s) => s.history);
  const startWorkout = useDeckStore((s) => s.startWorkout);
  const tick = useDeckStore((s) => s.tick);
  const logOne = useDeckStore((s) => s.logOne);
  const finishSet = useDeckStore((s) => s.finishSet);
  const skip = useDeckStore((s) => s.skip);
  const skipRest = useDeckStore((s) => s.skipRest);
  const pause = useDeckStore((s) => s.pause);
  const resume = useDeckStore((s) => s.resume);
  const endAndSave = useDeckStore((s) => s.endAndSave);
  const discard = useDeckStore((s) => s.discard);
  const clearFinished = useDeckStore((s) => s.clearFinished);

  const [now, setNow] = useState(() => Date.now());
  const [confirmEnd, setConfirmEnd] = useState(false);
  const lastAnnounced = useRef<string | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      tick(t);
    }, 250);
    return () => window.clearInterval(id);
  }, [tick]);

  useEffect(() => () => hush(), []);

  const card = session ? currentCard(session) : null;

  useEffect(() => {
    if (!session || session.phase !== "work" || !card || !session.config.voice) return;
    if (lastAnnounced.current === card.id) return;
    lastAnnounced.current = card.id;
    speak(announce(card.value, card.exercise));
  }, [session, card]);

  const start = (size: DeckSize) => {
    lastAnnounced.current = null;
    startWorkout(size);
  };

  if (!hydrated) {
    return <AppShell hideNav><div className="min-h-dvh" /></AppShell>;
  }

  if (lastFinished && !session) {
    const previous = history.find((row) => row.id !== lastFinished.id) ?? null;
    return (
      <AppShell>
        <div className="px-5 pt-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-faint">Session over</p>
          <h1 className="mt-2 font-display text-4xl leading-none">
            {lastFinished.completed ? "Deck cleared" : "Stopped early"}
          </h1>
          <p className="mt-5 font-display text-5xl tabular-nums">{lastFinished.totalReps}</p>
          <p className="text-sm text-muted">reps · {formatClock(lastFinished.durationSec)}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted">{debrief(lastFinished, previous)}</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {Object.entries(lastFinished.repsByExercise).map(([id, n]) => (
              <div key={id} className="rounded-[var(--radius-md)] border border-border bg-surface px-3 py-3">
                <p className="text-xs text-faint">{exerciseLabel(id as never)}</p>
                <p className="font-display text-2xl tabular-nums">{n ?? 0}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-3">
            <Button size="xl" className="w-full font-display" onClick={() => navigate("/log")}>
              Open log
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => clearFinished()}>
              New shuffle
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!session) {
    return (
      <AppShell>
        <Setup deal={deal} onStart={start} />
      </AppShell>
    );
  }

  const elapsed = Math.round(elapsedMs(session, now) / 1000);
  const restLeft = session.restUntil ? Math.max(0, Math.ceil((session.restUntil - now) / 1000)) : 0;
  const progress = session.results.length;
  const total = session.deck.length;
  const remaining = card ? Math.max(0, card.value - session.repsLogged) : 0;
  const paused = Boolean(session.pausedAt);

  return (
    <AppShell hideNav>
      <div className="flex min-h-dvh flex-col px-5 pt-5">
        <header className="flex items-center justify-between">
          <button
            type="button"
            className="flex size-12 items-center justify-center rounded-[var(--radius-md)] text-muted hover:text-fg"
            onClick={() => setConfirmEnd(true)}
            aria-label="End workout"
          >
            <X className="size-5" />
          </button>
          <div className="text-center">
            <p className="font-mono text-lg tabular-nums">{formatClock(elapsed)}</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-faint">
              {progress}/{total} cards
            </p>
          </div>
          <button
            type="button"
            className="flex size-12 items-center justify-center rounded-[var(--radius-md)] text-muted hover:text-fg"
            onClick={() => (paused ? resume() : pause())}
            aria-label={paused ? "Resume" : "Pause"}
          >
            {paused ? <Play className="size-5" /> : <Pause className="size-5" />}
          </button>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center py-6">
          <PlayingCard card={card} flipped={session.phase === "work" || session.phase === "rest"} />

          {session.phase === "work" && card && (
            <>
              <p className="mt-6 max-w-sm text-center text-sm text-muted">
                {EXERCISE_META[card.exercise].cue}
              </p>
              <p className="mt-4 font-display text-6xl tabular-nums leading-none">
                {session.repsLogged}
                <span className="text-3xl text-faint">/{card.value}</span>
              </p>
            </>
          )}

          {session.phase === "rest" && (
            <div className="mt-8 text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-faint">Rest</p>
              <p className="font-display text-6xl tabular-nums leading-none">{restLeft}</p>
              <p className="mt-2 text-sm text-muted">
                Next: {card ? `${card.value} ${exerciseLabel(card.exercise)}` : "done"}
              </p>
            </div>
          )}
        </div>

        {paused && (
          <div className="mb-4 rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-3 text-center text-sm text-muted">
            Paused. Time is not counting.
          </div>
        )}

        {confirmEnd && (
          <div className="mb-4 rounded-[var(--radius-lg)] border border-border bg-surface p-4">
            <p className="text-sm">End this deck? Logged reps will be saved.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setConfirmEnd(false)}>
                Keep going
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setConfirmEnd(false);
                  const stats = endAndSave();
                  if (stats) toast(`Saved · ${stats.totalReps} reps`);
                  else {
                    discard();
                    toast("No reps to save");
                  }
                }}
              >
                End and save
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {session.phase === "work" && (
            <>
              <Button
                size="xl"
                className="w-full font-display text-xl"
                disabled={paused}
                onClick={() => logOne()}
              >
                Log rep{remaining ? ` · ${remaining} left` : ""}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" disabled={paused} onClick={() => finishSet()}>
                  Complete set
                </Button>
                <Button variant="secondary" disabled={paused} onClick={() => skip()}>
                  Skip card
                </Button>
              </div>
            </>
          )}
          {session.phase === "rest" && (
            <Button size="xl" className="w-full font-display" onClick={() => skipRest()}>
              Draw next
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Setup({ deal, onStart }: { deal?: DeckSize; onStart: (size: DeckSize) => void }) {
  const settings = useDeckStore((s) => s.settings);
  const preview = useMemo(() => {
    const size = deal ?? "full";
    const deck = buildDeck({
      size,
      scoring: settings.scoring,
      mapping: settings.mapping,
      rng: () => 0.2,
    });
    return { volume: expectedVolume(deck) };
  }, [deal, settings]);

  return (
    <div className="px-5 pt-10">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-faint">Shuffle</p>
      <h1 className="mt-2 font-display text-4xl leading-none">Start a deck</h1>
      <p className="mt-3 text-sm text-muted">
        No camera. No guessed form score. You tap a rep when you do a rep.
      </p>

      <div className="mt-8 space-y-3">
        {(["full", "half"] as const).map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onStart(size)}
            className="flex w-full items-center justify-between rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-4 text-left hover:bg-surface-2"
          >
            <span>
              <span className="block font-display text-xl">{SIZE_META[size].label}</span>
              <span className="text-sm text-muted">{SIZE_META[size].blurb}</span>
            </span>
            <span className="font-mono text-sm text-faint">{SIZE_META[size].cards}</span>
          </button>
        ))}
      </div>

      <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.18em] text-faint">Single suit</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {SUITS.map((suit) => (
          <button
            key={suit}
            type="button"
            onClick={() => onStart(suit)}
            className="rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-4 text-left hover:bg-surface-2"
          >
            <span className="block font-display text-lg">{SIZE_META[suit].label}</span>
            <span className="text-sm text-muted">{SIZE_META[suit].cards} cards</span>
          </button>
        ))}
      </div>

      {deal && (
        <div className="mt-8">
          <Button size="xl" className="w-full font-display" onClick={() => onStart(deal)}>
            Deal {sizeLabel(deal)} · ~{preview.volume} reps
          </Button>
        </div>
      )}
    </div>
  );
}
