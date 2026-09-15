import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { localCoachReply } from "@/lib/deck/coach";
import { useDeckStore } from "@/lib/deck/store";

const STARTERS = [
  "How should I scale push-ups?",
  "Burpees wreck me by card ten.",
  "What's a sane weekly plan?",
  "My wrists hurt on push-ups.",
];

export function CoachPage() {
  const chat = useDeckStore((s) => s.chat);
  const pushChat = useDeckStore((s) => s.pushChat);
  const resetChat = useDeckStore((s) => s.resetChat);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, busy]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const userMsg = { id: crypto.randomUUID(), role: "user" as const, text: trimmed, at: Date.now() };
    pushChat(userMsg);
    setInput("");
    setBusy(true);

    const history = [...chat, userMsg].map((m) => ({
      role: m.role,
      text: m.text,
    }));

    const reply = localCoachReply(trimmed, history.map((m) => m.text).join(" "));
    pushChat({ id: crypto.randomUUID(), role: "coach", text: reply, at: Date.now() });
    setBusy(false);
  };

  return (
    <AppShell>
      <div className="flex min-h-[calc(100dvh-5.5rem)] flex-col px-5 pt-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-faint">Advice</p>
            <h1 className="font-display text-4xl leading-none">Coach</h1>
          </div>
          {chat.length > 0 && (
            <button type="button" className="text-sm text-muted" onClick={() => resetChat()}>
              Clear
            </button>
          )}
        </div>
        <p className="mt-3 text-sm text-muted">
          Form, scaling, and how to get through a deck. Answers work even when the network doesn't.
        </p>

        <div className="mt-6 flex-1 space-y-3">
          {chat.length === 0 && (
            <div className="grid grid-cols-1 gap-2">
              {STARTERS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-left text-sm hover:bg-surface-2"
                  onClick={() => void send(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          {chat.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[85%] rounded-[var(--radius-lg)] px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "ml-auto bg-accent text-accent-fg"
                  : "bg-surface text-fg border border-border"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {busy && (
            <div className="w-fit rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-3 text-sm text-muted">
              Thinking
            </div>
          )}
          <div ref={bottom} />
        </div>

        <form
          className="sticky bottom-20 mt-4 flex gap-2 bg-bg py-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a movement"
            className="h-12 flex-1 rounded-[var(--radius-md)] border border-border bg-surface px-4 text-sm text-fg placeholder:text-faint"
          />
          <Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label="Send">
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
