import type { Resume } from "@/types/resume";

export type ResumePrintBlock = { text: string; kind: "name" | "title" | "contact" | "heading" | "job" | "role" | "bullet" | "body" | "space"; keepWithNext?: boolean };

/** Shared text model used by the PDF renderer and tested for export completeness. */
export function buildResumePrintBlocks(resume: Resume): ResumePrintBlock[] {
  const blocks: ResumePrintBlock[] = [
    { text: resume.personalInfo.fullName.toUpperCase(), kind: "name", keepWithNext: true },
    { text: resume.personalInfo.professionalTitle, kind: "title", keepWithNext: true },
    { text: [resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.location].filter(Boolean).join(" | "), kind: "contact" },
    { text: "", kind: "space" },
    { text: "PROFESSIONAL SUMMARY", kind: "heading", keepWithNext: true },
    ...resume.professionalSummary.bullets.map((text) => ({ text, kind: "bullet" as const })),
    { text: "", kind: "space" },
    { text: "TECHNICAL SKILLS", kind: "heading", keepWithNext: true },
    ...resume.technicalSkills.categories.map((category) => ({ text: `${category.name}: ${category.skills.join(", ")}`, kind: "body" as const })),
    { text: "", kind: "space" },
    { text: "PROFESSIONAL EXPERIENCE", kind: "heading", keepWithNext: true },
  ];
  for (const item of resume.experience) {
    blocks.push({ text: `${item.company}${item.location ? `, ${item.location}` : ""}     ${item.startDate} – ${item.endDate}`, kind: "job", keepWithNext: true });
    blocks.push({ text: item.role, kind: "role", keepWithNext: item.responsibilities.length > 0 });
    blocks.push(...item.responsibilities.map((text) => ({ text, kind: "bullet" as const })));
    if (item.environment.length) blocks.push({ text: `Environment: ${item.environment.join(", ")}.`, kind: "body" });
    blocks.push({ text: "", kind: "space" });
  }
  if (resume.education.length) blocks.push({ text: "EDUCATION", kind: "heading", keepWithNext: true }, ...resume.education.map((item) => ({ text: `${item.degree} from ${item.institution}${item.location ? `, ${item.location}` : ""}${item.graduationDate ? ` in ${item.graduationDate}` : ""}.`, kind: "bullet" as const })));
  if (resume.certifications.length) blocks.push({ text: "CERTIFICATIONS", kind: "heading", keepWithNext: true }, ...resume.certifications.map((item) => ({ text: `${item.name}${item.issuer ? ` — ${item.issuer}` : ""}${item.year ? ` (${item.year})` : ""}`, kind: "bullet" as const })));
  return blocks;
}
