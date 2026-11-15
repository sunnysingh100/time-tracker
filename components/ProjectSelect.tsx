import type { Project } from "@/lib/types";

type Props = {
  projects: Project[];
  value: string | null;
  onChange: (projectId: string | null) => void;
  disabled?: boolean;
};

export function ProjectSelect({ projects, value, onChange, disabled }: Props) {
  return (
    <select
      aria-label="Project"
      className="input"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={disabled}
    >
      <option value="">No project</option>
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
