import type { CompanySettings, JDAnalysis, ProfileSettings, Resume } from "@/types/resume";
import { companyId } from "@/lib/jd";
import { reviewEmploymentDates } from "@/lib/timeline";

type EvidenceRecord = { companyName: string; text: string };
export type ConfirmedEvidence = { companyId: string; section: string; text: string };
type RequirementCheck = JDAnalysis["requirements"][number] & {
  status: "supported" | "partial" | "not documented" | "supported but missing from draft" | "unsupported draft claim" | "unconfirmed draft claim";
  matchedTerms: string[];
  unsupportedTerms: string[];
  supportedBy: string[];
  rationale: string;
};

const ignored = new Set([
  "the", "and", "for", "with", "from", "into", "using", "use", "used", "work", "working", "experience", "years", "year", "ability", "strong", "understanding", "knowledge", "proficiency", "required", "preferred", "responsible", "responsibilities", "including", "such", "that", "this", "their", "your", "have", "has", "will", "must", "can", "able", "plus", "related", "across", "support", "supporting", "team", "teams", "environment", "environments", "application", "applications", "system", "systems", "solution", "solutions", "develop", "developing", "design", "designing", "build", "building", "maintain", "maintaining", "manage", "managing", "implement", "implementing", "ensure", "provide", "perform", "including", "etc",
]);

function normalized(value: string) {
  return value.toLocaleLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9+#.]+/g, " ").replace(/\s+/g, " ").trim();
}

function meaningfulTerms(requirement: JDAnalysis["requirements"][number]) {
  const terms = new Set<string>();
  for (const candidate of [...requirement.keywords, requirement.text]) {
    const phrase = normalized(candidate);
    if (phrase && phrase.split(" ").some((word) => word.length > 2 && !ignored.has(word))) terms.add(phrase);
    for (const word of phrase.split(" ")) if (word.length > 2 && !ignored.has(word)) terms.add(word);
  }
  return [...terms].filter((term) => term.length > 2 || /^(aws|sql|api|gcp|etl|elt|c#|c\+\+|\.net|ci cd|rest|k8s)$/i.test(term));
}

function hasTerm(text: string, term: string) {
  const source = ` ${normalized(text)} `;
  const target = ` ${normalized(term)} `;
  return target.trim().length > 2 && source.includes(target);
}

export function companyEvidence(company: CompanySettings): string[] {
  return [
    ...company.responsibilities,
    ...company.technologies,
    ...company.projects.flatMap((project) => [
      project.context,
      ...project.responsibilities,
      ...project.technologies,
    ]),
  ].map((item) => item.trim()).filter(Boolean);
}

function recordsFromProfile(profile: ProfileSettings, confirmed: ConfirmedEvidence[] = []): EvidenceRecord[] {
  const configured = profile.companies.flatMap((company) => companyEvidence(company).map((text) => ({ companyName: company.companyName, text })));
  const confirmedWork = confirmed.flatMap((fact) => {
    if (!["responsibility", "project description", "skill"].includes(fact.section)) return [];
    const company = profile.companies.find((item) => companyId(item) === fact.companyId || item.companyName === fact.companyId);
    return company ? [{ companyName: company.companyName, text: fact.text }] : [];
  });
  return [...configured, ...confirmedWork];
}

function supportedRequirements(analysis: JDAnalysis, profile: ProfileSettings, confirmed: ConfirmedEvidence[] = []) {
  const records = recordsFromProfile(profile, confirmed);
  return analysis.requirements.map((requirement) => {
    const terms = meaningfulTerms(requirement);
    const matchedTerms = terms.filter((term) => records.some((record) => hasTerm(record.text, term)));
    const matched = new Set(records.filter((record) => matchedTerms.some((term) => hasTerm(record.text, term))).map((record) => record.companyName));
    const ratio = terms.length ? matchedTerms.length / terms.length : 0;
    return { requirement, terms, matchedTerms, supportedBy: [...matched], ratio };
  });
}

const weight = (kind: string) => kind === "required" ? 3 : kind === "responsibility" ? 2 : 1;

export function matchExperienceToJD(analysis: JDAnalysis | null, profile: ProfileSettings, confirmed: ConfirmedEvidence[] = []) {
  if (!analysis) return null;
  const checks: RequirementCheck[] = supportedRequirements(analysis, profile, confirmed).map(({ requirement, matchedTerms, supportedBy, ratio }) => {
    const status = ratio >= 0.5 ? "supported" : ratio > 0 ? "partial" : "not documented";
    const rationale = status === "supported"
      ? `Supported by recorded work history at ${supportedBy.join(", ")}.`
      : status === "partial"
        ? `Some related terms appear in recorded work history at ${supportedBy.join(", ")}; verify the exact task and tool before claiming full experience.`
        : "No matching work evidence is recorded in this profile. The resume prompt will not invent this experience.";
    return { ...requirement, status, matchedTerms, unsupportedTerms: [], supportedBy, rationale };
  });
  const total = checks.reduce((sum, item) => sum + weight(item.kind), 0);
  const achieved = checks.reduce((sum, item) => sum + weight(item.kind) * (item.status === "supported" ? 1 : item.status === "partial" ? 0.5 : 0), 0);
  return {
    score: total ? Math.round(100 * achieved / total) : 0,
    checks,
    disclaimer: "Evidence coverage compares JD language with facts entered in your profile. It is a local estimate, not an employer ATS score or a prediction of hiring.",
  };
}

export function scoreAlignment(analysis: JDAnalysis, resume: Resume | null, profile: ProfileSettings, confirmed: ConfirmedEvidence[] = [], unconfirmedStatements: string[] = [], today = new Date()) {
  const draftText = resume ? JSON.stringify({
    professionalSummary: resume.professionalSummary,
    technicalSkills: resume.technicalSkills,
    experience: resume.experience.map((item) => ({ description: item.description, projectName: item.projectName, responsibilities: item.responsibilities, environment: item.environment })),
    projects: resume.projects,
  }).toLocaleLowerCase() : "";
  const sourceRecords = recordsFromProfile(profile, confirmed);
  const checks: RequirementCheck[] = supportedRequirements(analysis, profile, confirmed).map(({ requirement, terms, matchedTerms, supportedBy, ratio }) => {
    const draftTerms = terms.filter((term) => hasTerm(draftText, term));
    const unsupportedTerms = draftTerms.filter((term) => !sourceRecords.some((record) => hasTerm(record.text, term)));
    const unconfirmedTerms = draftTerms.filter((term) => unconfirmedStatements.some((text) => hasTerm(text, term)));
    const draftRatio = terms.length ? draftTerms.length / terms.length : 0;
    const sourceStatus = ratio >= 0.5 ? "supported" : ratio > 0 ? "partial" : "not documented";
    let status: RequirementCheck["status"];
    let rationale: string;
    if (!resume) {
      status = sourceStatus;
      rationale = sourceStatus === "not documented" ? "No matching evidence is recorded in the profile." : `Profile evidence found at ${supportedBy.join(", ")}; generate a draft to check whether it is represented.`;
    } else if (unsupportedTerms.length > 0) {
      status = "unsupported draft claim";
      rationale = `Draft terms not found in recorded work history: ${unsupportedTerms.slice(0, 8).join(", ")}. Verify each term or remove unsupported claims.`;
    } else if (unconfirmedTerms.length > 0) {
      status = "unconfirmed draft claim";
      rationale = `Draft coverage depends on statements awaiting your review: ${unconfirmedTerms.slice(0, 8).join(", ")}. Confirm the statement before treating this requirement as covered.`;
    } else if (ratio >= 0.5 && draftRatio >= 0.35) {
      status = "supported";
      rationale = `Present in the draft and supported by profile evidence at ${supportedBy.join(", ")}.`;
    } else if (ratio >= 0.25) {
      status = "supported but missing from draft";
      rationale = `Related profile evidence exists at ${supportedBy.join(", ")}, but the draft does not cover it clearly.`;
    } else if (draftRatio > 0) {
      status = "unsupported draft claim";
      rationale = "Some JD language appears in the draft, but it is not supported by recorded work history. Verify it or remove it.";
    } else {
      status = "not documented";
      rationale = "This requirement is not demonstrated in the recorded profile or resume draft.";
    }
    return { ...requirement, status, matchedTerms, unsupportedTerms, supportedBy, rationale };
  });
  const normalizeTitle = (value: string) => normalized(value).replace(/\s+/g, " ").trim();
  const titleMatches = Boolean(resume && normalizeTitle(resume.personalInfo.professionalTitle) === normalizeTitle(analysis.targetRole));
  const titleCheck: RequirementCheck = {
    text: `Target role title: ${analysis.targetRole}`, kind: "required", keywords: [analysis.targetRole],
    status: !resume ? "not documented" : titleMatches ? "supported" : "unsupported draft claim",
    matchedTerms: titleMatches ? [analysis.targetRole] : [], unsupportedTerms: [], supportedBy: [],
    rationale: !resume ? "Load the latest draft to check headline alignment." : titleMatches ? "Resume headline matches the role extracted from the current JD." : `Resume headline does not match the current JD target: ${analysis.targetRole}.`,
  };
  checks.unshift(titleCheck);
  const resumePeriods = resume
    ? resume.experience.flatMap((job) => {
      const source = profile.companies.find((company) => companyId(company) === job.id);
      return source ? [{ ...source, startDate: job.startDate, endDate: job.endDate, isCurrent: /^(present|current|now)$/i.test(job.endDate) }] : [];
    })
    : profile.companies;
  const experience = reviewEmploymentDates(resumePeriods, today);
  const sourceYears = experience.totalMonths / 12;
  const experienceStatus: RequirementCheck["status"] = !analysis.experienceYears
    ? "not documented"
    : !experience.totalMonths ? "not documented"
      : sourceYears >= analysis.experienceYears ? "supported" : "partial";
  if (analysis.experienceYears) checks.push({
    text: `JD experience requirement: ${analysis.experienceYears}+ years`, kind: "required", keywords: [`${analysis.experienceYears} years`],
    status: experienceStatus, matchedTerms: experienceStatus === "supported" ? [`${sourceYears.toFixed(1)} years in ${resume ? "the proposed resume dates" : "configured dates"}`] : [], unsupportedTerms: [], supportedBy: [],
    rationale: !experience.totalMonths ? "No parseable employment dates are configured." : `${resume ? "Proposed resume" : "Configured source"} non-overlapping employment coverage is ${experience.years} years and ${experience.remainingMonths} months.`,
  });
  const weightedScore = (items: RequirementCheck[]) => {
    const total = items.reduce((sum, item) => sum + weight(item.kind), 0);
    const achieved = items.reduce((sum, item) => sum + weight(item.kind) * (item.status === "supported" ? 1 : item.status === "partial" || item.status === "supported but missing from draft" ? 0.5 : 0), 0);
    return total ? Math.round(100 * achieved / total) : null;
  };
  const score = weightedScore(checks) ?? 0;
  const breakdown = {
    roleTitle: titleCheck.status === "supported" ? 100 : 0,
    skills: weightedScore(checks.filter((item) => item.kind !== "responsibility" && item !== titleCheck && !item.text.startsWith("JD experience requirement"))),
    responsibilities: weightedScore(checks.filter((item) => item.kind === "responsibility")),
    experience: analysis.experienceYears ? Math.round(Math.min(1, sourceYears / analysis.experienceYears) * 100) : null,
  };
  return {
    score,
    breakdown,
    missingKeywords: checks.filter((item) => item.status === "not documented" || item.status === "supported but missing from draft").map((item) => item.text),
    unsupportedClaims: checks.filter((item) => item.status === "unsupported draft claim").map((item) => item.text),
    unconfirmedClaims: checks.filter((item) => item.status === "unconfirmed draft claim").map((item) => item.text),
    checks,
    disclaimer: "Estimated JD alignment based on the current JD, latest loaded draft, and configured employment evidence. Unsupported and unconfirmed content is flagged. This is not an employer ATS score or hiring prediction.",
  };
}
