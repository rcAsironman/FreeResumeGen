export function dailyResumeFolder(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (type: string) => parts.find((entry) => entry.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}_resumes`;
}

export function resumeFileStem(fullName: string, index: number): string {
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

