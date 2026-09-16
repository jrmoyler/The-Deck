import { create } from "zustand";
import { DEFAULT_SETTINGS } from "./catalog";
import {
  deleteWorkout as deleteWorkoutRow,
  loadChat,
  loadHistory,
  loadSession,
  loadSettings,
  saveChat,
  saveSession,
  saveSettings as persistSettings,
  saveWorkout as persistWorkout,
} from "./storage";
import {
  advanceRest,
  completeSet,
  createWorkout,
  logRep,
  maybeAdvanceRest,
  pauseWorkout,
  resumeWorkout,
  skipCard,
  summarize,
} from "./session";
import type { ActiveWorkout, ChatMessage, Settings, WorkoutConfig, WorkoutStats } from "./types";

interface DeckState {
  hydrated: boolean;
  settings: Settings;
  history: WorkoutStats[];
  session: ActiveWorkout | null;
  lastFinished: WorkoutStats | null;
  chat: ChatMessage[];
  hydrate: () => void;
  updateSettings: (patch: Partial<Settings> | { mapping: Settings["mapping"] }) => void;
  startWorkout: (size: WorkoutConfig["size"]) => ActiveWorkout;
  tick: (now?: number) => void;
  logOne: () => void;
  finishSet: () => void;
  skip: () => void;
  skipRest: () => void;
  pause: () => void;
  resume: () => void;
  endAndSave: () => WorkoutStats | null;
  discard: () => void;
  clearFinished: () => void;
  removeWorkout: (id: string) => void;
  pushChat: (msg: ChatMessage) => void;
  replaceChat: (id: string, text: string) => void;
  resetChat: () => void;
}

function persist(session: ActiveWorkout | null) {
  saveSession(session);
}

function commit(session: ActiveWorkout, history: WorkoutStats[]) {
  const stats = summarize(session);
  persist(null);
  if (stats.totalReps <= 0 && stats.cardsCleared + stats.cardsSkipped === 0) {
    return { session: null, lastFinished: null as WorkoutStats | null, history };
  }
  return { session: null, lastFinished: stats, history: persistWorkout(stats) };
}

export const useDeckStore = create<DeckState>((set, get) => ({
  hydrated: false,
  settings: DEFAULT_SETTINGS,
  history: [],
  session: null,
  lastFinished: null,
  chat: [],

  hydrate: () => {
    if (get().hydrated) return;
    set({
      hydrated: true,
      settings: loadSettings(),
      history: loadHistory(),
      session: loadSession(),
      chat: loadChat(),
    });
  },

  updateSettings: (patch) => {
    const settings = { ...get().settings, ...patch };
    persistSettings(settings);
    set({ settings });
  },

  startWorkout: (size) => {
    const session = createWorkout({ ...get().settings, size });
    persist(session);
    set({ session, lastFinished: null });
    return session;
  },

  tick: (now = Date.now()) => {
    const session = get().session;
    if (!session) return;
    const next = maybeAdvanceRest(session, now);
    if (next !== session) {
      persist(next);
      set({ session: next });
    }
  },

  logOne: () => {
    const session = get().session;
    if (!session) return;
    const next = logRep(session);
    if (next.phase === "done") set(commit(next, get().history));
    else {
      persist(next);
      set({ session: next });
    }
  },

  finishSet: () => {
    const session = get().session;
    if (!session) return;
    const next = completeSet(session);
    if (next.phase === "done") set(commit(next, get().history));
    else {
      persist(next);
      set({ session: next });
    }
  },

  skip: () => {
    const session = get().session;
    if (!session) return;
    const next = skipCard(session);
    if (next.phase === "done") set(commit(next, get().history));
    else {
      persist(next);
      set({ session: next });
    }
  },

  skipRest: () => {
    const session = get().session;
    if (!session) return;
    const next = advanceRest(session);
    persist(next);
    set({ session: next });
  },

  pause: () => {
    const session = get().session;
    if (!session) return;
    const next = pauseWorkout(session);
    persist(next);
    set({ session: next });
  },

  resume: () => {
    const session = get().session;
    if (!session) return;
    const next = resumeWorkout(session);
    persist(next);
    set({ session: next });
  },

  endAndSave: () => {
    const session = get().session;
    if (!session) return get().lastFinished;
    const result = commit(session, get().history);
    set(result);
    return result.lastFinished;
  },

  discard: () => {
    persist(null);
    set({ session: null, lastFinished: null });
  },

  clearFinished: () => set({ lastFinished: null }),

  removeWorkout: (id) => {
    const history = deleteWorkoutRow(id);
    set({ history });
  },

  pushChat: (msg) => {
    const chat = [...get().chat, msg].slice(-40);
    saveChat(chat);
    set({ chat });
  },

  replaceChat: (id, text) => {
    const chat = get().chat.map((msg) => (msg.id === id ? { ...msg, text } : msg));
    saveChat(chat);
    set({ chat });
  },

  resetChat: () => {
    saveChat([]);
    set({ chat: [] });
  },
}));
