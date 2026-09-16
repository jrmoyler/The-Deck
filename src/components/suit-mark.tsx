import type { Suit } from "@/lib/deck/types";
import { cn } from "@/lib/utils";

export function SuitMark({
  suit,
  className,
}: {
  suit: Suit;
  className?: string;
}) {
  const red = suit === "hearts" || suit === "diamonds";
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(red ? "text-crimson" : "text-current", className)}
      aria-hidden="true"
    >
      {suit === "hearts" && (
        <path
          fill="currentColor"
          d="M12 21.2 10.4 19.75C5.4 15.2 2 12.15 2 8.6 2 5.7 4.25 3.5 7.15 3.5c1.7 0 3.35.8 4.4 2.05C12.6 4.3 14.25 3.5 15.95 3.5 18.85 3.5 21.1 5.7 21.1 8.6c0 3.55-3.4 6.6-8.4 11.15L12 21.2z"
        />
      )}
      {suit === "diamonds" && (
        <path fill="currentColor" d="M12 2.4 21.3 12 12 21.6 2.7 12z" />
      )}
      {suit === "spades" && (
        <>
          <path
            fill="currentColor"
            d="M12 2.3C12 2.3 3.6 10.1 3.6 14.15 3.6 16.85 5.7 18.8 8.2 18.8c1.35 0 2.5-.6 3.8-2.15 1.3 1.55 2.45 2.15 3.8 2.15 2.5 0 4.6-1.95 4.6-4.65C20.4 10.1 12 2.3 12 2.3z"
          />
          <path fill="currentColor" d="M10.2 17.6 12 22.2 13.8 17.6 12 16.4z" />
        </>
      )}
      {suit === "clubs" && (
        <>
          <circle fill="currentColor" cx="12" cy="6.6" r="4.05" />
          <circle fill="currentColor" cx="7.05" cy="12.35" r="4.05" />
          <circle fill="currentColor" cx="16.95" cy="12.35" r="4.05" />
          <path fill="currentColor" d="M10.4 14.2h3.2L14.4 21.8H9.6z" />
        </>
      )}
    </svg>
  );
}
