import type { ProfileSettings, Resume } from "@/types/resume";
import { companyId } from "./jd";
import { candidateKey, normalizeFact, profileEvidence, type WorkEvidence } from "./work-evidence";
import { findPerformanceMeasurements, findUnsupportedMetricClaims, type AchievementEvidence } from "./achievements";

export type ReviewStatement = { path: string; employerId: string; section: string; text: string; confirmed: boolean; conflict?: string; numeric: boolean };
export function reviewResume(resume: Resume, profile: ProfileSettings, confirmations: WorkEvidence[], metrics: AchievementEvidence[] = []) {
  const identity = candidateKey(resume.personalInfo);
  const sameCandidate = identity === candidateKey(profile.personalInfo);
  const history = sameCandidate ? profileEvidence(profile) : [];
  const records = [...history, ...confirmations.filter(record => record.candidateKey === identity && record.status === "confirmed")];
  const metricErrors = new Set(findUnsupportedMetricClaims(resume, metrics.filter(item => item.status === "verified")).map(item => item.path));
  const statements: ReviewStatement[] = [];
  function add(path: string, section: string, text: string | undefined, employerId = "global", sourceText?: string, conflict?: string) {
    if (!text?.trim()) return;
    const numeric = findPerformanceMeasurements(text).length > 0;
    const metricSupported = path.includes(".responsibilities.") && !metricErrors.has(path);
    const sourceConfirmed = sourceText !== undefined && normalizeFact(sourceText) === normalizeFact(text);
    const confirmed = !conflict && (!numeric || metricSupported) && (sourceConfirmed || records.some(record => record.employerId === employerId && normalizeFact(record.text) === normalizeFact(text) && (record.section === section || record.source.kind === "company-settings")));
    statements.push({ path, section, employerId, text, confirmed, conflict, numeric: numeric && !metricSupported });
  }
  for (const [field, text] of Object.entries(resume.personalInfo)) add(`personalInfo.${field}`, field === "professionalTitle" ? "headline" : "identity", text, "global", sameCandidate && field !== "professionalTitle" ? profile.personalInfo[field as keyof ProfileSettings["personalInfo"]] : undefined);
  resume.professionalSummary.bullets.forEach((text, i) => add(`professionalSummary.bullets.${i}`, "summary", text));
  resume.technicalSkills.categories.forEach((category, i) => {
    if (findPerformanceMeasurements(category.name).length) add(`technicalSkills.categories.${i}.name`, "skill category", category.name);
    category.skills.forEach((text, j) => add(`technicalSkills.categories.${i}.skills.${j}`, "skill", text, "global", history.some(record => record.section === "skill" && normalizeFact(record.text) === normalizeFact(text)) ? text : undefined));
  });
  resume.experience.forEach((job, i) => {
    const company = sameCandidate ? profile.companies.find(item => companyId(item) === job.id) : undefined;
    const prefix = `experience.${i}`;
    const metadata = { company: company?.companyName, location: company?.location, role: company?.jobTitle || undefined, startDate: company?.startDate, endDate: company ? company.isCurrent ? "Present" : company.endDate : undefined };
    for (const [field, actual] of Object.entries(metadata)) {
      const text = job[field as keyof typeof metadata];
      add(`${prefix}.${field}`, field === "role" ? "role" : "employment metadata", text, job.id, actual,
        actual !== undefined && text !== actual ? `Recorded ${field}: ${actual}. Edit the draft to preserve actual history.` : undefined);
    }
    add(`${prefix}.projectName`, "project", job.projectName, job.id);
    add(`${prefix}.description`, "project description", job.description, job.id);
    job.responsibilities.forEach((text, j) => add(`${prefix}.responsibilities.${j}`, "responsibility", text, job.id));
    job.responsibilityGroups?.forEach((group, j) => add(`${prefix}.responsibilityGroups.${j}.heading`, "responsibility group", group.heading, job.id));
    job.environment.forEach((text, j) => add(`${prefix}.environment.${j}`, "skill", text, job.id));
  });
  resume.projects.forEach((project, i) => {
    add(`projects.${i}.name`, "project", project.name);
    add(`projects.${i}.description`, "project description", project.description);
    project.technologies.forEach((text, j) => add(`projects.${i}.technologies.${j}`, "skill", text));
    project.highlights.forEach((text, j) => add(`projects.${i}.highlights.${j}`, "responsibility", text));
  });
  for (const group of ["education", "certifications"] as const) resume[group].forEach((item, i) => {
    const configured = sameCandidate ? profile[group].find(source => source.id === item.id && (group !== "certifications" || (source as ProfileSettings["certifications"][number]).verificationStatus === "confirmed")) : undefined;
    for (const [field, text] of Object.entries(item)) if (field !== "id") add(`${group}.${i}.${field}`, group, text, "global", configured ? (configured as unknown as Record<string, string>)[field] : undefined);
  });
  const pending = statements.filter(statement => !statement.confirmed);
  return { statements, pending, canExport: pending.length === 0, unsupportedNumbers: statements.filter(statement => statement.numeric), conflicts: statements.filter(statement => statement.conflict) };
}
export function confirmStatement(statement: ReviewStatement, resume: Resume, jd: string, now = new Date()): WorkEvidence {
  if (statement.numeric || statement.conflict) throw new Error("Resolve the recorded-history conflict or supply measured evidence before confirming this statement.");
  return { id: `${candidateKey(resume.personalInfo)}|${statement.employerId}|${statement.section}|${normalizeFact(statement.text)}`, candidateKey: candidateKey(resume.personalInfo), employerId: statement.employerId, section: statement.section, text: statement.text, status: "confirmed", source: { kind: "candidate-confirmation", reference: statement.path, originatingJD: jd, confirmedAt: now.toISOString() }, competencyTags: [] };
}
export function assertApplicationReady(resume: Resume, profile: ProfileSettings, evidence: WorkEvidence[], metrics: AchievementEvidence[]) {
  const review = reviewResume(resume, profile, evidence, metrics);
  if (!review.canExport) throw new Error(`${review.pending.length} statements need review. Unsupported numbers require measured evidence; general confirmation cannot verify them.`);
  return resume;
}
