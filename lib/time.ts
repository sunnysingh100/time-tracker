/** 3725000 ms -> "1:02:05" */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${hours}:${pad(minutes)}:${pad(seconds)}`;
}

/** -> "14:05" in the user's local time zone */
export function formatClock(ms: number): string {
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** -> "Sun, Nov 15" */
export function formatDay(ms: number): string {
  return new Date(ms).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Today's date as "YYYY-MM-DD" (the format <input type="date"> uses), local time. */
export function todayInputValue(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** ("2026-11-15", "09:30") -> ms, interpreted in local time. NaN if invalid. */
export function parseLocalDateTime(date: string, time: string): number {
  if (!date || !time) return NaN;
  return new Date(`${date}T${time}`).getTime();
}
