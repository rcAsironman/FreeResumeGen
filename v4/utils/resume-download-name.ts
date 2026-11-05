export function dailyResumeFolder(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (type: string) => parts.find((entry) => entry.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}_resumes`;
}

export const RESUME_FILENAME_LIMIT = 100;

export function parseResumeFileStem(value: unknown): string | undefined {
  if (value === undefined || (typeof value === "string" && !value.trim())) return undefined;
  if (typeof value !== "string") throw new Error("Enter a valid resume filename.");
  const stem = value.trim().replace(/\.(pdf|docx|json)$/i, "").trim();
  if (stem.length > RESUME_FILENAME_LIMIT || !/^[\p{L}\p{N}_ -]+$/u.test(stem)) {
    throw new Error("Use up to 100 characters: letters, numbers, spaces, hyphens, or underscores.");
  }
  if (/^(con|prn|aux|nul|com[0-9¹²³]|lpt[0-9¹²³])$/i.test(stem)) {
    throw new Error("Choose a different filename. Windows reserves this name.");
  }
  return stem;
}

export function resumeFileStem(fullName: string, index: number, customStem?: string): string {
  if (customStem) return index === 0 ? customStem : `${customStem}_${index + 1}`;
  const clean = (value: string) => value.normalize("NFKD").replace(/[^A-Za-z0-9]/g, "");
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = clean(parts[0] ?? "").toLowerCase() || "candidate";
  const family = clean(parts.length > 1 ? parts.at(-1)! : "") || "Resume";
  if (index === 0) return `${first}_resume`;
  if (index === 1) return `${first}-resume`;
  const length = index - 1;
  if (length <= family.length) {
    let prefix = family.slice(0, length).toLowerCase();
    if (length !== 2) prefix = prefix[0].toUpperCase() + prefix.slice(1);
    return `${first}_${prefix}_resume`;
  }
  return `${first}_${family[0].toUpperCase() + family.slice(1).toLowerCase()}_resume_${length - family.length + 1}`;
}

