export const RESUME_LAYOUTS = ["fixed-resume", "architect-resume", "data-center"] as const;
export type ResumeLayout = typeof RESUME_LAYOUTS[number];
export const DEFAULT_RESUME_LAYOUT: ResumeLayout = "fixed-resume";
export const RESUME_LAYOUT_OPTIONS = [
  { id: "data-center", label: "Data Center — single-page reference" },
  { id: "fixed-resume", label: "Original format (default)" },
  { id: "architect-resume", label: "Aditya reference format" },
] as const;
