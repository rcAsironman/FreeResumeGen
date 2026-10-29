import type { DraftClaim, ProfileSettings, Resume } from "@/types/resume";
import { companyId } from "./jd";

const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
const memoryKeyFor = (profile: ProfileSettings, section: string, companyIdValue: string | undefined, text: string) => `${profile.profileType}|${section}|${companyIdValue ?? "global"}|${normalize(text)}`;

export function claimsFromResume(resume: Resume, profile: ProfileSettings, confirmed: Set<string>): DraftClaim[] {
  const claims: DraftClaim[] = [];
  const add = (path: string, section: string, text: string, companyIdValue?: string, reusable = true, sourceVerified = false) => {
    if (!text.trim()) return;
    const memoryKey = reusable ? memoryKeyFor(profile, section, companyIdValue, text) : "";
    claims.push({ id: path, path, section, companyId: companyIdValue, text, status: sourceVerified || Boolean(memoryKey && confirmed.has(memoryKey)) ? "confirmed" : "needs-confirmation", memoryKey });
  };
  add("personalInfo.professionalTitle", "headline", resume.personalInfo.professionalTitle, undefined, false);
  resume.professionalSummary.bullets.forEach((text, i) => add(`professionalSummary.bullets.${i}`, "summary", text, undefined, false));
  resume.technicalSkills.categories.forEach((category, i) => category.skills.forEach((text, j) => add(`technicalSkills.categories.${i}.skills.${j}`, "skill", text)));
  resume.experience.forEach((item, i) => {
    const source = profile.companies.find((company) => companyId(company) === item.id);
    const sourceEndDate = source?.isCurrent ? "Present" : source?.endDate;
    add(`experience.${i}.role`, "role", item.role, item.id, true, Boolean(source?.jobTitle.trim() && source.jobTitle.trim() === item.role.trim()));
    add(`experience.${i}.startDate`, "employment start date", item.startDate, item.id, true, Boolean(source && source.startDate === item.startDate));
    add(`experience.${i}.endDate`, "employment end date", item.endDate, item.id, true, Boolean(source && sourceEndDate === item.endDate));
    add(`experience.${i}.projectName`, "project title", item.projectName ?? "", item.id);
    add(`experience.${i}.description`, "project description", item.description ?? "", item.id);
    item.responsibilities.forEach((text, j) => add(`experience.${i}.responsibilities.${j}`, "responsibility", text, item.id));
    item.environment.forEach((text, j) => add(`experience.${i}.environment.${j}`, "skill", text, item.id));
  });
  resume.projects.forEach((item, i) => {
    add(`projects.${i}.name`, "project title", item.name, item.id, false);
    add(`projects.${i}.description`, "project description", item.description, item.id, false);
    item.technologies.forEach((text, j) => add(`projects.${i}.technologies.${j}`, "skill", text, item.id, false));
    item.highlights.forEach((text, j) => add(`projects.${i}.highlights.${j}`, "responsibility", text, item.id, false));
  });
  return claims;
}

function updatePath(target: unknown, path: string, value: string) {
  const copy = structuredClone(target) as Record<string, unknown>;
  const parts = path.split("."); let cursor: unknown = copy;
  for (const part of parts.slice(0, -1)) cursor = (cursor as Record<string, unknown>)[part];
  (cursor as Record<string, unknown>)[parts.at(-1)!] = value;
  return copy;
}

export function editClaim(resume: Resume, claims: DraftClaim[], profile: ProfileSettings, id: string, text: string) {
  const claim = claims.find((item) => item.id === id);
  if (!claim) return { resume, claims };
  const updatedResume = updatePath(resume, claim.path, text) as Resume;
  return { resume: updatedResume, claims: claims.map((item) => item.id === id ? { ...item, text, status: "needs-confirmation" as const, memoryKey: item.memoryKey ? memoryKeyFor(profile, item.section, item.companyId, text) : "" } : item) };
}

export function finalizeResume(draft: Resume, claims: DraftClaim[], profile: ProfileSettings): Resume {
  const approved = new Set(claims.filter((claim) => claim.status === "confirmed").map((claim) => claim.path));
  const output = structuredClone(draft);
  output.personalInfo.professionalTitle = approved.has("personalInfo.professionalTitle") ? draft.personalInfo.professionalTitle : "";
  output.professionalSummary.bullets = draft.professionalSummary.bullets.filter((_, i) => approved.has(`professionalSummary.bullets.${i}`));
  output.technicalSkills.categories = draft.technicalSkills.categories.map((category, i) => ({
    ...category,
    skills: category.skills.filter((_, j) => approved.has(`technicalSkills.categories.${i}.skills.${j}`)),
  })).filter((category) => category.skills.length > 0);
  output.experience = draft.experience.flatMap((item, i) => {
    const company = profile.companies.find((entry) => companyId(entry) === item.id);
    const actualTitle = company?.jobTitle.trim() ?? "";
    const role = approved.has(`experience.${i}.role`) ? item.role : actualTitle;
    // Treat a generated employment period as one decision. If either date is
    // rejected or left unconfirmed, keep the complete configured date pair.
    const proposedPeriodConfirmed = approved.has(`experience.${i}.startDate`) && approved.has(`experience.${i}.endDate`);
    const startDate = proposedPeriodConfirmed ? item.startDate : company?.startDate ?? "";
    const endDate = proposedPeriodConfirmed ? item.endDate : company ? (company.isCurrent ? "Present" : company.endDate) : "";
    const responsibilities = item.responsibilities.filter((_, j) => approved.has(`experience.${i}.responsibilities.${j}`));
    if (!role) return [];
    const projectName = approved.has(`experience.${i}.projectName`) ? item.projectName : company?.projects.find((project) => project.name === item.projectName)?.name;
    return [{
      ...item,
      role,
      startDate,
      endDate,
      projectName,
      description: approved.has(`experience.${i}.description`) ? item.description : undefined,
      responsibilities,
      environment: item.environment.filter((_, j) => approved.has(`experience.${i}.environment.${j}`)),
      responsibilityGroups: undefined,
    }];
  });
  output.projects = draft.projects.flatMap((item, i) => {
    const name = approved.has(`projects.${i}.name`) ? item.name : "";
    const description = approved.has(`projects.${i}.description`) ? item.description : "";
    const technologies = item.technologies.filter((_, j) => approved.has(`projects.${i}.technologies.${j}`));
    const highlights = item.highlights.filter((_, j) => approved.has(`projects.${i}.highlights.${j}`));
    return name && (description || highlights.length) ? [{ ...item, name, description, technologies, highlights }] : [];
  });
  return output;
}
