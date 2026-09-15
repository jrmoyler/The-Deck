import { EXERCISES, EXERCISE_META, REST_OPTIONS, SCORING_META, SUIT_META } from "@/lib/deck/catalog";
import { useDeckStore } from "@/lib/deck/store";
import type { ExerciseId, Suit } from "@/lib/deck/types";
import { SUITS } from "@/lib/deck/types";
import { SuitMark } from "./suit-mark";

export function SettingsPanel() {
  const settings = useDeckStore((s) => s.settings);
  const updateSettings = useDeckStore((s) => s.updateSettings);

  return (
    <section className="space-y-6 rounded-[var(--radius-xl)] border border-border bg-surface p-5">
      <div>
        <h2 className="font-display text-xl">Suits</h2>
        <p className="mt-1 text-sm text-muted">Each suit is one movement. Change it if you need to.</p>
      </div>
      <div className="space-y-3">
        {SUITS.map((suit: Suit) => (
          <label key={suit} className="flex items-center gap-3">
            <SuitMark suit={suit} className="size-5 shrink-0" />
            <span className="w-20 text-sm text-muted">{SUIT_META[suit].label}</span>
            <select
              className="h-11 flex-1 rounded-[var(--radius-sm)] border border-border bg-bg px-3 text-sm text-fg"
              value={settings.mapping[suit]}
              onChange={(e) =>
                updateSettings({
                  mapping: { ...settings.mapping, [suit]: e.target.value as ExerciseId },
                })
              }
            >
              {EXERCISES.map((id) => (
                <option key={id} value={id}>
                  {EXERCISE_META[id].label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Scoring</span>
          <select
            className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg px-3 text-sm text-fg"
            value={settings.scoring}
            onChange={(e) => updateSettings({ scoring: e.target.value as typeof settings.scoring })}
          >
            {Object.entries(SCORING_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Rest</span>
          <select
            className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg px-3 text-sm text-fg"
            value={settings.restSeconds}
            onChange={(e) =>
              updateSettings({ restSeconds: Number(e.target.value) as typeof settings.restSeconds })
            }
          >
            {REST_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex min-h-11 items-center justify-between gap-4">
        <span className="text-sm">Speak each card</span>
        <input
          type="checkbox"
          checked={settings.voice}
          onChange={(e) => updateSettings({ voice: e.target.checked })}
          className="size-5 accent-[#f2eadb]"
        />
      </label>
      <p className="text-xs text-faint">{SCORING_META[settings.scoring].detail}.</p>
    </section>
  );
}
