"use client";

import { useAppData } from "@/lib/storage";
import { EntryList } from "./EntryList";
import { ManualEntry } from "./ManualEntry";
import { Projects } from "./Projects";
import { Timer } from "./Timer";

export function Tracker() {
  const data = useAppData();

  // null = still on the server / first paint, before localStorage is readable.
  if (!data) {
    return <p className="text-zinc-500">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Timer projects={data.projects} running={data.running} />
      <EntryList entries={data.entries} projects={data.projects} />
      <ManualEntry projects={data.projects} />
      <Projects projects={data.projects} />
    </div>
  );
}
