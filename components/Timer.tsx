"use client";

import { useEffect, useState } from "react";
import { startTimer, stopTimer } from "@/lib/storage";
import { formatDuration } from "@/lib/time";
import type { Project, RunningTimer } from "@/lib/types";
import { ProjectSelect } from "./ProjectSelect";

type Props = {
  projects: Project[];
  running: RunningTimer | null;
};

export function Timer({ projects, running }: Props) {
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);

  function handleStart(e: React.FormEvent) {
    e.preventDefault();
    startTimer(description, projectId);
    setDescription("");
    setProjectId(null);
  }

  if (running) {
    const project = projects.find((p) => p.id === running.projectId);
    return (
      <section className="card">
        <h2 className="heading">Timer</h2>
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{running.description || "(no description)"}</p>
            {project && (
              <p className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: project.color }} />
                {project.name}
              </p>
            )}
          </div>
          <Elapsed start={running.start} />
          <button type="button" className="btn bg-red-600 hover:bg-red-700" onClick={stopTimer}>
            Stop
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <h2 className="heading">Timer</h2>
      <form onSubmit={handleStart} className="flex flex-col gap-3 sm:flex-row">
        <input
          className="input flex-1"
          placeholder="What are you working on?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <ProjectSelect projects={projects} value={projectId} onChange={setProjectId} />
        <button type="submit" className="btn bg-green-600 hover:bg-green-700">
          Start
        </button>
      </form>
    </section>
  );
}

/**
 * The elapsed time is NOT stored anywhere. We store only the start time and
 * recompute "now - start" every second. That's why a refresh doesn't lose it.
 */
function Elapsed({ start }: { start: number }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id); // stop ticking when the timer is stopped
  }, []);

  return <span className="font-mono text-2xl tabular-nums">{formatDuration(now - start)}</span>;
}
