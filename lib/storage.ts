import { useSyncExternalStore } from "react";
import type { AppData, TimeEntry } from "./types";

const STORAGE_KEY = "time-tracker:v1";
const EMPTY: AppData = { projects: [], entries: [], running: null };

// ---------------------------------------------------------------------------
// The store
//
// localStorage lives outside React, so we treat it as an "external store" and
// connect it with useSyncExternalStore. Components re-render whenever we call
// notify(). On the server there is no localStorage, so the hook returns null
// there and the UI shows a loading state until the browser takes over.
// ---------------------------------------------------------------------------

const listeners = new Set<() => void>();

// React requires getSnapshot to return the *same object* when nothing changed,
// otherwise it re-renders forever. So we cache the parsed data and only
// re-parse when the raw string in localStorage is different.
let cachedRaw: string | null | undefined;
let cachedData: AppData = EMPTY;

function read(): AppData {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedData; // storage blocked (e.g. some private modes)
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedData = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
    } catch {
      cachedData = EMPTY; // corrupted data: start fresh rather than crash
    }
  }
  return cachedData;
}

function write(next: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked: the change can't be saved. Good enough for v1;
    // a real app would show the user an error here.
    console.error("Could not save to localStorage");
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // The "storage" event fires when ANOTHER tab changes localStorage,
  // so two open tabs stay in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Returns the app data, or null while rendering on the server. */
export function useAppData(): AppData | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

// ---------------------------------------------------------------------------
// Actions: the only way the UI changes data. Each returns an error message
// string when the input is invalid, or null on success.
// ---------------------------------------------------------------------------

function newId() {
  return crypto.randomUUID();
}

export function addProject(name: string, color: string): string | null {
  const data = read();
  const trimmed = name.trim();
  if (!trimmed) return "Project name is required.";
  const taken = data.projects.some(
    (p) => p.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (taken) return `A project named "${trimmed}" already exists.`;
  write({
    ...data,
    projects: [...data.projects, { id: newId(), name: trimmed, color }],
  });
  return null;
}

export function startTimer(description: string, projectId: string | null) {
  const data = read();
  if (data.running) return "A timer is already running.";
  write({
    ...data,
    running: { description: description.trim(), projectId, start: Date.now() },
  });
  return null;
}

export function stopTimer(): string | null {
  const data = read();
  if (!data.running) return "No timer is running.";
  const entry: TimeEntry = { id: newId(), ...data.running, end: Date.now() };
  write({ ...data, entries: [...data.entries, entry], running: null });
  return null;
}

export function addEntry(
  description: string,
  projectId: string | null,
  start: number,
  end: number,
): string | null {
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return "Please fill in the date, start time and end time.";
  }
  if (end <= start) return "End time must be after start time.";
  const data = read();
  const entry: TimeEntry = {
    id: newId(),
    description: description.trim(),
    projectId,
    start,
    end,
  };
  write({ ...data, entries: [...data.entries, entry] });
  return null;
}

export function deleteEntry(id: string) {
  const data = read();
  write({ ...data, entries: data.entries.filter((e) => e.id !== id) });
}
