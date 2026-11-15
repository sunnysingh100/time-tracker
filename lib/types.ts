// All times are stored as milliseconds since 1970 (what Date.now() returns).
// Numbers survive JSON.stringify/parse; Date objects don't.

export type Project = {
  id: string;
  name: string;
  color: string;
};

export type TimeEntry = {
  id: string;
  description: string;
  projectId: string | null;
  start: number;
  end: number;
  // No `duration` field on purpose: it's always end - start (see SPEC.md).
};

export type RunningTimer = {
  description: string;
  projectId: string | null;
  start: number;
};

export type AppData = {
  projects: Project[];
  entries: TimeEntry[];
  running: RunningTimer | null;
};

export const PROJECT_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
];
