import type { MasterResume } from "@/types/resume";
/** Score the actual edited content, omitting contact fields from external submissions. */
export function resumeScoringText(resume: MasterResume): string {
  const lines = [resume.personalInfo.professionalTitle, "Professional Summary", ...resume.professionalSummary.bullets,
    "Technical Skills", ...resume.technicalSkills.categories.map(c => `${c.name}: ${c.skills.join(", ")}`),
    "Professional Experience", ...resume.experience.flatMap(e => [e.company, e.role, `${e.startDate} - ${e.endDate}`, e.description ?? "", e.projectName ?? "", ...e.responsibilities, `Environment: ${e.environment.join(", ")}`]),
    "Projects", ...resume.projects.flatMap(p => [p.name, p.description, ...p.highlights, p.technologies.join(", ")]),
    "Education", ...resume.education.map(e => `${e.degree}, ${e.institution}, ${e.graduationDate ?? ""}`),
    "Certifications", ...resume.certifications.map(c => `${c.name}, ${c.issuer ?? ""}, ${c.year ?? ""}`)];
  let text = lines.filter(Boolean).join("\n");
  for (const value of [resume.personalInfo.fullName, resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.portfolio, resume.personalInfo.linkedIn]) {
    if (value?.trim()) text = text.split(value).join("");
  }
  return text.trim();
}
export function keywordCoverage(text: string, keywords: string[]) {
  const unique = Array.from(new Map(keywords.map(k => [k.trim().toLowerCase(), k.trim()])).values()).filter(Boolean);
  const normalized = text.toLowerCase().replace(/[\u2010-\u2015]/g, "-");
  const matched: string[] = [], missing: string[] = [];
  for (const term of unique) {
    const escaped = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
    (new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9+#])`, "i").test(normalized) ? matched : missing).push(term);
  }
  return { matched, missing, score: unique.length ? Math.round(100 * matched.length / unique.length) : null };
}
