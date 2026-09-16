import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { debrief } from "@/lib/deck/debrief";
import { exerciseLabel, formatClock, formatDate, sizeLabel } from "@/lib/deck/format";
import { useDeckStore } from "@/lib/deck/store";
import type { WorkoutStats } from "@/lib/deck/types";

export function LogPage() {
  const history = useDeckStore((s) => s.history);
  const removeWorkout = useDeckStore((s) => s.removeWorkout);
  const [openId, setOpenId] = useState<string | null>(history[0]?.id ?? null);

  const selected = history.find((row) => row.id === openId) ?? history[0] ?? null;
  const previous = useMemo(() => {
    if (!selected) return null;
    const idx = history.findIndex((row) => row.id === selected.id);
    return history[idx + 1] ?? null;
  }, [history, selected]);

  const totals = history.reduce(
    (acc, row) => {
      acc.reps += row.totalReps;
      acc.sessions += 1;
      return acc;
    },
    { reps: 0, sessions: 0 },
  );

  return (
    <AppShell>
      <div className="px-5 pt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-faint">History</p>
        <h1 className="font-display text-4xl leading-none">Log</h1>
        <p className="mt-3 text-sm text-muted">
          {totals.sessions
            ? `${totals.sessions} session${totals.sessions === 1 ? "" : "s"} · ${totals.reps} reps`
            : "Finished decks land here. Nothing is uploaded."}
        </p>

        {!selected ? (
          <div className="mt-10 rounded-[var(--radius-xl)] border border-dashed border-border-strong px-5 py-12 text-center">
            <p className="font-display text-2xl">No sessions yet</p>
            <p className="mt-2 text-sm text-muted">Complete a card and this page will have something to show.</p>
          </div>
        ) : (
          <>
            <SessionDetail
              stats={selected}
              previous={previous}
              onDelete={() => {
                removeWorkout(selected.id);
                setOpenId(null);
              }}
            />
            <ul className="mt-6 space-y-2 pb-6">
              {history.map((row) => {
                const active = row.id === selected.id;
                return (
                  <li key={row.id}>
                    <button
                      type="button"
                      onClick={() => setOpenId(row.id)}
                      className={`flex min-h-14 w-full items-center justify-between rounded-[var(--radius-lg)] border px-4 text-left ${
                        active ? "border-border-strong bg-surface-2" : "border-border bg-surface"
                      }`}
                    >
                      <span>
                        <span className="block text-sm">{formatDate(row.date)}</span>
                        <span className="text-xs text-faint">
                          {sizeLabel(row.size)} · {row.cardsCleared}/{row.cardsTotal} cards
                        </span>
                      </span>
                      <span className="font-mono text-sm tabular-nums">{row.totalReps}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </AppShell>
  );
}

function SessionDetail({
  stats,
  previous,
  onDelete,
}: {
  stats: WorkoutStats;
  previous: WorkoutStats | null;
  onDelete: () => void;
}) {
  return (
    <section className="mt-6 rounded-[var(--radius-xl)] border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.16em] text-faint">{formatDate(stats.date)}</p>
          <p className="mt-2 font-display text-4xl leading-none tabular-nums">{stats.totalReps}</p>
          <p className="mt-2 text-sm text-muted">
            {formatClock(stats.durationSec)} · {stats.completed ? "finished" : "partial"}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0" aria-label="Delete session" onClick={onDelete}>
          <Trash2 className="size-4" />
        </Button>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted">{debrief(stats, previous)}</p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {Object.entries(stats.repsByExercise).map(([id, n]) => (
          <div key={id} className="rounded-[var(--radius-sm)] bg-bg px-3 py-2">
            <p className="text-[11px] text-faint">{exerciseLabel(id as never)}</p>
            <p className="font-mono text-sm tabular-nums">{n ?? 0}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
