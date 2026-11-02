import type { JDAnalysis, ProfileSettings, Resume } from "@/types/resume";
import { companyId } from "./jd";
import { concepts, matchRequirement } from "./requirement-match";

export type WorkEvidence = {
  id: string; candidateKey: string; employerId: string; section: string; text: string;
  status: "confirmed" | "unconfirmed" | "rejected";
  source: { kind: "company-settings" | "candidate-confirmation" | "legacy-confirmation"; reference: string; originatingJD?: string; confirmedAt?: string };
  competencyTags: string[];
};
export const normalizeFact = (text: string) => text.trim().toLowerCase().replace(/\s+/g, " ");
export const candidateKey = (info: ProfileSettings["personalInfo"] | Resume["personalInfo"]) => `${normalizeFact(info.fullName)}|${normalizeFact(info.email)}`;
export function profileEvidence(profile: ProfileSettings): WorkEvidence[] {
  return profile.companies.flatMap(company => {
    const employerId = companyId(company);
    const records = [
      ...company.responsibilities.map(text => ({ section: "responsibility", text })),
      ...company.technologies.map(text => ({ section: "skill", text })),
      ...company.projects.flatMap(project => [
        { section: "project", text: project.name }, { section: "project", text: project.context },
        ...project.responsibilities.map(text => ({ section: "responsibility", text })),
        ...project.technologies.map(text => ({ section: "skill", text })),
      ]),
    ].filter(record => record.text.trim());
    return records.map((record, index) => ({ ...record, id: `settings:${employerId}:${index}`, candidateKey: candidateKey(profile.personalInfo), employerId, status: "confirmed" as const, source: { kind: "company-settings" as const, reference: `${profile.profileType}/${employerId}` }, competencyTags: concepts(record.text) }));
  });
}
export function migrateLegacyEvidence(profile: ProfileSettings, memory: Record<string, string>): WorkEvidence[] {
  return Object.entries(memory).flatMap(([key, text]) => {
    const [type, section, employerId] = key.split("|");
    if (type !== profile.profileType || !profile.companies.some(company => companyId(company) === employerId)) return [];
    // Old storage keys identify a profile/employer, not a person. Preserve the
    // historical confirmation without silently assigning it to a new candidate.
    return [{ id: `legacy:${key}`, candidateKey: `legacy-unassigned:${profile.profileType}`, employerId, section, text, status: "confirmed" as const, source: { kind: "legacy-confirmation" as const, reference: key }, competencyTags: concepts(text) }];
  });
}
export function relevantEvidence(records: WorkEvidence[], analysis: JDAnalysis) {
  const requirements = analysis.requirements;
  return records.filter(record => record.status === "confirmed" && ["responsibility", "skill", "project", "project description"].includes(record.section))
    .map(record => ({ record, matches: requirements.map(requirement => ({ requirement: requirement.text, ...matchRequirement(requirement.text, record.text) })).filter(match => match.supported) }))
    .filter(item => item.matches.length > 0);
}
export function buildDraftPlan(profile: ProfileSettings, analysis: JDAnalysis, extra: WorkEvidence[] = []) {
  const records = [...profileEvidence(profile), ...extra.filter(record => record.candidateKey === candidateKey(profile.personalInfo))];
  const relevant = relevantEvidence(records, analysis);
  return profile.companies.map((company, index) => {
    const employerId = companyId(company);
    const facts = relevant.filter(item => item.record.employerId === employerId);
    const uncovered = analysis.requirements.filter(requirement => !facts.some(item => item.matches.some(match => match.requirement === requirement.text)));
    return {
      employerId, companyName: company.companyName, industry: company.industry,
      officialTitle: company.jobTitle, functionalTitlePolicy: company.jobTitle ? "Preserve official title exactly" : "Suggest a functional title only if work evidence supports it; otherwise flag a profession mismatch",
      relevantVerifiedEvidence: facts,
      documentedProjects: company.projects.filter(project => analysis.requirements.some(requirement => matchRequirement(requirement.text, `${project.context} ${project.technologies.join(" ")} ${project.responsibilities.join(" ")}`).supported)),
      // A brief is a drafting instruction, never an assertion that the work occurred.
      unconfirmedDraftBriefs: uncovered.map((requirement, rank) => ({ requirement: requirement.text, kind: requirement.kind, status: "unconfirmed", emphasis: (rank + index) % 3, instruction: `Draft an employer-specific review option addressing ${requirement.text}. Use only documented context; do not invent projects, tools used, seniority, or results.` })),
      unrelatedEvidenceCount: records.filter(record => record.employerId === employerId).length - facts.length,
    };
  });
}
