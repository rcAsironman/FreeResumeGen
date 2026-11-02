import type { MasterResume } from "@/types/resume";
import { FULL_TIME_MASTER_FILES, type EmploymentType } from "@/types/employment-type";
import type { ResumeProfile } from "@/types/resume-profile";

export function sourceMatchesEmploymentType(profile: ResumeProfile, file: string, source: MasterResume, employmentType: EmploymentType) {
  const degrees = source.education.map((item) => item.degree);
  const hasBachelor = degrees.some((degree) => /\bbachelor(?:'s|’s)?\b/i.test(degree));
  const hasMasters = degrees.some((degree) => /\bmaster(?:'s|’s)?\b/i.test(degree));
  if (employmentType === "full-time") return FULL_TIME_MASTER_FILES[profile] === file && hasMasters;
  return hasBachelor && !hasMasters;
}

export function sourcePreservationIssues(generated: MasterResume, source: MasterResume, employmentType: EmploymentType, expectedExperience: MasterResume["experience"]) {
  const issues: string[] = [];
  const contactKeys = ["fullName", "email", "phone", "location"] as const;
  for (const key of contactKeys) {
    if (generated.personalInfo[key] !== source.personalInfo[key]) issues.push(`Keep personalInfo.${key} exactly as it appears in the selected source.`);
  }
  if (generated.experience.length !== expectedExperience.length || expectedExperience.some((item, index) => {
    const output = generated.experience[index];
    return !output || output.id !== item.id || output.company !== item.company || output.location !== item.location || output.startDate !== item.startDate || output.endDate !== item.endDate;
  })) issues.push("Keep every source employer, ID, location, order, and source or explicitly proposed date unchanged.");
  if (generated.education.length !== source.education.length || source.education.some((item, index) => {
    const output = generated.education[index];
    return !output || output.id !== item.id || output.institution !== item.institution || output.degree !== item.degree || output.location !== item.location || output.graduationDate !== item.graduationDate;
  })) {
    issues.push(employmentType === "c2c" ? "Keep the selected C2C source's bachelor's education unchanged; do not add a master's degree." : "Keep the configured full-time source's master's education unchanged.");
  }
  if (generated.certifications.length !== source.certifications.length || source.certifications.some((item, index) => {
    const output = generated.certifications[index];
    return !output || output.id !== item.id || output.name !== item.name || output.issuer !== item.issuer || output.year !== item.year;
  })) issues.push("Keep certifications exactly as listed in the selected source.");
  if (generated.projects.length !== source.projects.length || source.projects.some((item, index) => generated.projects[index]?.id !== item.id || generated.projects[index]?.name !== item.name)) issues.push("Keep the source projects and their IDs/names; do not add or remove projects.");
  return issues;
}
