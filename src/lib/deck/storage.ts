import { DEFAULT_SETTINGS } from "./catalog";
import type { ActiveWorkout, ChatMessage, Settings, WorkoutStats } from "./types";

const HISTORY_KEY = "the-deck:history:v2";
const SETTINGS_KEY = "the-deck:settings:v2";
const SESSION_KEY = "the-deck:session:v2";
const CHAT_KEY = "the-deck:chat:v2";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private mode — keep the session in memory.
  }
}

export function loadHistory(): WorkoutStats[] {
  const rows = readJson<WorkoutStats[]>(HISTORY_KEY, []);
  return Array.isArray(rows) ? rows : [];
}

export function saveWorkout(stats: WorkoutStats): WorkoutStats[] {
  const history = [stats, ...loadHistory().filter((row) => row.id !== stats.id)].slice(0, 80);
  writeJson(HISTORY_KEY, history);
  return history;
}

export function deleteWorkout(id: string): WorkoutStats[] {
  const history = loadHistory().filter((row) => row.id !== id);
  writeJson(HISTORY_KEY, history);
  return history;
}

export function loadSettings(): Settings {
  const stored = readJson<Partial<Settings> | null>(SETTINGS_KEY, null);
  if (!stored) return DEFAULT_SETTINGS;
  return {
    mapping: { ...DEFAULT_SETTINGS.mapping, ...stored.mapping },
    scoring: stored.scoring ?? DEFAULT_SETTINGS.scoring,
    restSeconds: stored.restSeconds ?? DEFAULT_SETTINGS.restSeconds,
    voice: stored.voice ?? DEFAULT_SETTINGS.voice,
  };
}

export function saveSettings(settings: Settings) {
  writeJson(SETTINGS_KEY, settings);
}

export function loadSession(): ActiveWorkout | null {
  return readJson<ActiveWorkout | null>(SESSION_KEY, null);
}

export function saveSession(workout: ActiveWorkout | null) {
  if (!workout) {
    if (canUseStorage()) window.localStorage.removeItem(SESSION_KEY);
    return;
  }
  writeJson(SESSION_KEY, workout);
}

export function loadChat(): ChatMessage[] {
  const rows = readJson<ChatMessage[]>(CHAT_KEY, []);
  return Array.isArray(rows) ? rows : [];
}

export function saveChat(messages: ChatMessage[]) {
  writeJson(CHAT_KEY, messages.slice(-40));
}

export function clearChat() {
  if (canUseStorage()) window.localStorage.removeItem(CHAT_KEY);
}
