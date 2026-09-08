export type ResumeFont =
  | "Times New Roman"
  | "Arial"
  | "Calibri"
  | "Cambria"
  | "Georgia";

export const DEFAULT_RESUME_FONT: ResumeFont =
  "Times New Roman";

export const RESUME_FONT_OPTIONS: ResumeFont[] = [
  "Times New Roman",
  "Arial",
  "Calibri",
  "Cambria",
  "Georgia",
];

export function getResumeFontStack(
  font: ResumeFont,
): string {
  const fontStacks: Record<ResumeFont, string> = {
    "Times New Roman":
      '"Times New Roman", Times, serif',

    Arial:
      'Arial, Helvetica, sans-serif',

    Calibri:
      'Calibri, "Segoe UI", Arial, sans-serif',

    Cambria:
      'Cambria, Georgia, "Times New Roman", serif',

    Georgia:
      'Georgia, "Times New Roman", serif',
  };

  return fontStacks[font];
}