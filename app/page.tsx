import { Tracker } from "@/components/Tracker";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Time Tracker</h1>
      <Tracker />
    </main>
  );
}
