import { EXERCISE_META } from "./catalog";
import type { ExerciseId } from "./types";

const NOTES: Array<{ keys: string[]; answer: string }> = [
  {
    keys: ["push-up", "pushup", "push up", "wrist"],
    answer:
      "For push-ups: hands under the shoulders, slightly turned out if the wrists complain. Body in one piece from head to heels. Lower until the chest is about a fist off the floor. If you stall, elevate the hands or drop to your knees — same line, fewer joints complaining. Don't flare the elbows to 90°; keep them about 45° from the ribs.",
  },
  {
    keys: ["squat", "knee", "knees"],
    answer:
      "For squats: sit the hips back and down, keep the heels down, let the knees track over the toes. Depth is as low as you can hold a quiet back. If the knees feel noisy, shorten the range and hold a doorframe. You don't need to go ATG on a deck session.",
  },
  {
    keys: ["sit-up", "situp", "sit up", "crunch", "neck", "spine", "back"],
    answer:
      "For sit-ups: hands at the temples, not yanking the head. Exhale as the ribs come toward the thighs. If your low back feels it more than your abs, switch to crunches or dead bugs for that suit and keep the session moving. Quality beats a sloppy full sit-up.",
  },
  {
    keys: ["burpee", "gassed", "card 10", "breathing"],
    answer:
      "Burpees are the clubs for a reason. Step the feet back instead of jumping. Skip the jump at the top. Breathe at standing. If a card is 10+, break it into two or three mini-sets and use the rest you set. Slow burpees still count.",
  },
  {
    keys: ["dip", "shoulder", "shoulders"],
    answer:
      "Dips only if you have a stable chair or bars. Keep the shoulders down and back; don't shrug into the neck. Lower to a range that doesn't pinch the front of the shoulder. If it pinches, remap diamonds to squats or push-ups until it doesn't.",
  },
  {
    keys: ["lunge"],
    answer:
      "Lunges: long step, front heel down, back knee toward the floor. Reverse lunges are kinder on the knees. Hold a chair if balance is the limiter. Alternate legs inside the same card so one side doesn't eat the whole count.",
  },
  {
    keys: ["scale", "regression", "can't", "beginner", "modify"],
    answer:
      "Scale the movement, not the honesty of the count. Push-ups to knees or a counter. Burpees to step-back. Sit-ups to crunches. Squats to a chair. Log the reps you actually did. A finished half deck with clean reps beats a abandoned full deck.",
  },
  {
    keys: ["week", "plan", "often", "program", "schedule"],
    answer:
      "Three decks a week is plenty for most people: one full, two half, with a day between. If you're still sore, do a single-suit hearts or diamonds day. Don't chase a 52-card personal record every session — keep one easy.",
  },
  {
    keys: ["ace", "volume", "how many", "reps", "total"],
    answer:
      "Standard scoring is face cards at 10 and aces at 11 — about 380 reps on a full deck. Heavy bumps the ace to 14. Ranked uses J 11 / Q 12 / K 13 / A 14. Start standard. If a full deck is too much, run a half deck; it is the same workout, cut in two.",
  },
  {
    keys: ["rest", "between"],
    answer:
      "Fifteen seconds between cards is enough if the cards are small. Take 30 if clubs keep stacking. Skip rest only when the cards are 5 or under. The rest timer is a suggestion — draw the next card when you can do it clean.",
  },
  {
    keys: ["wrist", "wrists", "pain"],
    answer:
      "Wrist pain on push-ups is common. Turn the hands out slightly, use fists or parallettes, or elevate the hands. Don't push through a sharp wrist. Remap hearts for a week if you need to.",
  },
  {
    keys: ["form", "technique"],
    answer:
      "One cue per card is enough. Push-ups: one line. Squats: heels down. Sit-ups: don't pull the neck. Burpees: plank before you jump. If form breaks, scale the next few cards rather than grinding junk reps.",
  },
];

function fallback(question: string): string {
  const lower = question.toLowerCase();
  for (const note of NOTES) {
    if (note.keys.some((key) => lower.includes(key))) return note.answer;
  }
  return "Keep it simple: one card, one movement, honest reps. Scale the exercise if you need to, rest when the cards get ugly, and finish the deck you started — or save a partial and come back. Ask me about a specific movement if you want a cue.";
}

export function localCoachReply(question: string, historyText?: string): string {
  const combined = `${historyText ?? ""} ${question}`;
  return fallback(combined);
}

export function exerciseHelp(id: ExerciseId): string {
  const meta = EXERCISE_META[id];
  return `${meta.label}: ${meta.cue} If you need a scale: ${meta.regression}`;
}
