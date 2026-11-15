"use client";

import { useState } from "react";
import { addProject } from "@/lib/storage";
import { PROJECT_COLORS, type Project } from "@/lib/types";

export function Projects({ projects }: { projects: Project[] }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // stop the browser from reloading the page
    const err = addProject(name, color);
    setError(err);
    if (!err) setName("");
  }

  return (
    <section className="card">
      <h2 className="heading">Projects</h2>

      {projects.length > 0 && (
        <ul className="mb-4 flex flex-wrap gap-2">
          {projects.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-sm dark:border-zinc-700"
            >
              <span className="size-3 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          className="input flex-1"
          placeholder="New project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex gap-1.5" role="radiogroup" aria-label="Project color">
          {PROJECT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={c === color}
              aria-label={c}
              onClick={() => setColor(c)}
              className={`size-6 rounded-full ${c === color ? "ring-2 ring-offset-2 ring-zinc-900 dark:ring-zinc-100 dark:ring-offset-zinc-900" : ""}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <button type="submit" className="btn">
          Add
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  );
}
