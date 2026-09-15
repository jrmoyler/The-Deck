import { Link } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import { AppShell } from "@/components/app-shell";
import { SettingsPanel } from "@/components/settings-panel";
import { SuitMark } from "@/components/suit-mark";
import { Button } from "@/components/ui/button";
import { EXERCISE_META, SIZE_META, SUIT_META } from "@/lib/deck/catalog";
import { formatClock, formatDate, streakDays, weekVolume } from "@/lib/deck/format";
import { useDeckStore } from "@/lib/deck/store";
import { SUITS } from "@/lib/deck/types";

export function HomePage() {
  const history = useDeckStore((s) => s.history);
  const session = useDeckStore((s) => s.session);
  const settings = useDeckStore((s) => s.settings);
  const hydrated = useDeckStore((s) => s.hydrated);

  const latest = history[0];
  const streak = streakDays(history);
  const week = weekVolume(history);
  const weekTotal = week.reduce((sum, d) => sum + d.reps, 0);

  return (
    <AppShell>
      <div className="px-5 pt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-faint">Bodyweight</p>
        <h1 className="font-display text-[2.75rem] leading-none tracking-tight">The Deck</h1>
        <p className="mt-3 max-w-sm text-sm text-muted">
          Fifty-two cards. Four movements. The rank is the reps. Tap each one so the log stays honest.
        </p>

        {hydrated && session && session.phase !== "done" && (
          <Link
            to="/workout"
            className="mt-6 flex min-h-12 items-center justify-between rounded-[var(--radius-lg)] border border-border-strong bg-surface px-4"
          >
            <span className="text-sm">A deck is in progress</span>
            <span className="text-sm text-muted">Resume</span>
          </Link>
        )}

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Stat label="Streak" value={streak ? `${streak}d` : "—"} />
          <Stat label="This week" value={weekTotal ? String(weekTotal) : "—"} />
        </div>

        {hydrated && latest ? (
          <section className="mt-6 rounded-[var(--radius-xl)] border border-border bg-surface p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-faint">Last session</p>
            <p className="mt-2 font-display text-3xl tabular-nums">{latest.totalReps} reps</p>
            <p className="mt-1 text-sm text-muted">
              {formatClock(latest.durationSec)} · {latest.cardsCleared}/{latest.cardsTotal} cards ·{" "}
              {formatDate(latest.date)}
            </p>
            <div className="mt-5 h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={week} barCategoryGap={14}>
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#6d6a62", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="reps" fill="#f2eadb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        ) : (
          <section className="mt-6 rounded-[var(--radius-xl)] border border-border bg-surface p-5">
            <h2 className="font-display text-xl">How it works</h2>
            <ol className="mt-3 space-y-2 text-sm text-muted">
              <li>1. Shuffle a deck — full, half, or one suit.</li>
              <li>2. Flip a card. Do that many reps of the suit's movement.</li>
              <li>3. Tap to log each rep. Skip or finish a set if you need to.</li>
            </ol>
          </section>
        )}

        <section className="mt-6">
          <h2 className="font-display text-xl">This shuffle</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {SUITS.map((suit) => (
              <div
                key={suit}
                className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-surface px-3 py-3"
              >
                <SuitMark suit={suit} className="size-6" />
                <div>
                  <p className="text-xs text-faint">{SUIT_META[suit].label}</p>
                  <p className="text-sm font-medium">{EXERCISE_META[settings.mapping[suit]].label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 space-y-3">
          <Button asChild size="xl" className="w-full font-display tracking-wide">
            <Link to="/workout?deal=full">
              Full deck · {SIZE_META.full.cards} cards
            </Link>
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="secondary" size="lg" className="w-full">
              <Link to="/workout?deal=half">
                Half deck
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full">
              <Link to="/log">Open log</Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 mb-4">
          <SettingsPanel />
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">{label}</p>
      <p className="mt-1 font-display text-3xl tabular-nums leading-none">{value}</p>
    </div>
  );
}
