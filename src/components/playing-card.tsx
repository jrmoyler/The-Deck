import { SUIT_META } from "@/lib/deck/catalog";
import { exerciseLabel } from "@/lib/deck/format";
import type { Card } from "@/lib/deck/types";
import { cn } from "@/lib/utils";
import { SuitMark } from "./suit-mark";

function Corner({ card, flip }: { card: Card; flip?: boolean }) {
  const red = SUIT_META[card.suit].red;
  return (
    <div
      className={cn(
        "flex flex-col items-center leading-none",
        red ? "text-crimson" : "text-ink",
        flip && "rotate-180",
      )}
    >
      <span className="font-display text-[1.35rem] font-semibold tracking-tight">{card.rank}</span>
      <SuitMark suit={card.suit} className="mt-0.5 size-3.5" />
    </div>
  );
}

function CardBack() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[18px] border border-border-strong bg-surface shadow-[var(--shadow-card)]">
      <div className="card-back-pattern absolute inset-0" />
      <div className="absolute inset-3 rounded-[12px] border border-border" />
      <div className="relative flex h-full flex-col items-center justify-center gap-3">
        <SuitMark suit="spades" className="size-8 text-muted" />
        <p className="font-display text-lg tracking-[0.28em] text-muted">THE DECK</p>
      </div>
    </div>
  );
}

function CardFront({ card }: { card: Card }) {
  return (
    <div className="absolute inset-0 rounded-[18px] border border-[#d8cdb6] bg-accent text-accent-fg shadow-[var(--shadow-card)]">
      <div className="flex h-full flex-col justify-between p-3.5">
        <div className="flex justify-between">
          <Corner card={card} />
          <Corner card={card} />
        </div>
        <div className="flex flex-col items-center text-center">
          <SuitMark suit={card.suit} className="mb-3 size-16" />
          <p className="font-display text-[2.35rem] font-semibold leading-none tracking-tight tabular-nums">
            {card.value}
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.22em] text-faint">reps</p>
          <p className="mt-3 font-display text-xl leading-tight">{exerciseLabel(card.exercise)}</p>
        </div>
        <div className="flex justify-between">
          <Corner card={card} flip />
          <Corner card={card} flip />
        </div>
      </div>
    </div>
  );
}

export function PlayingCard({
  card,
  flipped = true,
  className,
}: {
  card?: Card | null;
  flipped?: boolean;
  className?: string;
}) {
  const showFront = Boolean(flipped && card);
  return (
    <div className={cn("relative w-[min(72vw,260px)] aspect-[2.5/3.5]", className)}>
      {showFront && card ? <CardFront card={card} /> : <CardBack />}
    </div>
  );
}
