"use client";

import { deleteEntry } from "@/lib/storage";
import { formatClock, formatDay, formatDuration } from "@/lib/time";
import type { Project, TimeEntry } from "@/lib/types";

type Props = {
  entries: TimeEntry[];
  projects: Project[];
};

export function EntryList({ entries, projects }: Props) {
  if (entries.length === 0) {
    return (
      <section className="card">
        <h2 className="heading">Entries</h2>
        <p className="text-sm text-zinc-500">No entries yet. Start a timer or add a past entry.</p>
      </section>
    );
  }

  // Newest first. Copy before sorting: .sort() mutates, and we must never
  // mutate data that came from the store.
  const sorted = [...entries].sort((a, b) => b.start - a.start);
  const projectById = new Map(projects.map((p) => [p.id, p]));

  return (
    <section className="card">
      <h2 className="heading">Entries</h2>
      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {sorted.map((entry) => {
          const project = entry.projectId ? projectById.get(entry.projectId) : undefined;
          return (
            <li key={entry.id} className="flex items-center gap-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate">{entry.description || "(no description)"}</p>
                <p className="flex flex-wrap items-center gap-x-3 text-sm text-zinc-500">
                  {project && (
                    <span className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: project.color }} />
                      {project.name}
                    </span>
                  )}
                  <span>
                    {formatDay(entry.start)} · {formatClock(entry.start)}–{formatClock(entry.end)}
                  </span>
                </p>
              </div>
              <span className="font-mono tabular-nums">{formatDuration(entry.end - entry.start)}</span>
              <button
                type="button"
                onClick={() => deleteEntry(entry.id)}
                className="text-sm text-zinc-400 hover:text-red-600"
                aria-label={`Delete entry ${entry.description}`}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
