"use client";

import { useState } from "react";
import { addEntry } from "@/lib/storage";
import { parseLocalDateTime, todayInputValue } from "@/lib/time";
import type { Project } from "@/lib/types";
import { ProjectSelect } from "./ProjectSelect";

export function ManualEntry({ projects }: { projects: Project[] }) {
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [date, setDate] = useState(todayInputValue);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = addEntry(
      description,
      projectId,
      parseLocalDateTime(date, startTime),
      parseLocalDateTime(date, endTime),
    );
    setError(err);
    if (!err) {
      // Keep the date and project: you often add several entries for one day.
      setDescription("");
      setStartTime("");
      setEndTime("");
    }
  }

  return (
    <section className="card">
      <h2 className="heading">Add past entry</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="input flex-1"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <ProjectSelect projects={projects} value={projectId} onChange={setProjectId} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            aria-label="Date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="time"
            aria-label="Start time"
            className="input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <span className="text-zinc-500">to</span>
          <input
            type="time"
            aria-label="End time"
            className="input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <button type="submit" className="btn sm:ml-auto">
            Add entry
          </button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  );
}
