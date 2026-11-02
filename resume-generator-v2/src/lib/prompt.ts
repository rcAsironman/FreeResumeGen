import type { JDAnalysis, ProfileSettings, Resume } from "@/types/resume";
import { companyId } from "./jd";
import { reviewEmploymentDates } from "./timeline";
import { confirmedMetricEvidence, type AchievementEvidence } from "./achievements";

import { matchRequirement } from "./requirement-match";
import { buildDraftPlan, candidateKey, type WorkEvidence } from "./work-evidence";

export const OUTPUT_CONTRACT = {
  personalInfo: { fullName: "", professionalTitle: "", email: "", phone: "", location: "", portfolio: "optional" },
  professionalSummary: { bullets: [""] },
  technicalSkills: { categories: [{ name: "", skills: [""] }] },
  experience: [{ id: "", company: "", role: "", location: "", startDate: "", endDate: "", description: "optional", projectName: "optional", responsibilityGroups: [{ heading: "", startIndex: 0 }], responsibilities: [""], environment: [""] }],
  projects: [{ id: "", name: "", description: "", technologies: [""], highlights: [""] }],
  education: [{ id: "", institution: "", degree: "", location: "optional", graduationDate: "optional" }],
  certifications: [{ id: "", name: "", issuer: "optional", year: "optional" }],
};

export type ConfirmedWorkStatement = { companyId: string; companyName: string; section: string; text: string };

export function scopePriorStatements(statements: ConfirmedWorkStatement[], analysis: JDAnalysis) {
  return statements.filter(statement => ["responsibility", "skill", "project", "project description"].includes(statement.section)
    && analysis.requirements.some(requirement => matchRequirement(requirement.text, statement.text).supported));
}

export function isDraftGenerationReady(analysis: JDAnalysis | null, profile: ProfileSettings) {
  return Boolean(analysis && profile.companies.length > 0);
}

export function findResumeMetaLanguage(resume: Resume) {
  const forbidden = [
    /\bproposed\s+(?:profile|experience|resume|summary|role)\b/i,
    /\b[a-z]+(?:[- ]year)\s+experience requirement\b/i,
    /\bexperience requirement\b/i,
    /\btargeting\s+(?:the\s+)?(?:role|job|jd)\b/i,
    /\bcandidate review\b/i,
    /\b(?:needs?|requires?)\s+(?:candidate\s+)?confirmation\b/i,
    /\bunverified\s+(?:suggestion|claim|experience)\b/i,
  ];
  const matches: string[] = [];
  const visit = (value: unknown, path: string) => {
    if (typeof value === "string") {
      if (forbidden.some((pattern) => pattern.test(value))) matches.push(path);
      return;
    }
    if (Array.isArray(value)) { value.forEach((child, index) => visit(child, `${path}[${index}]`)); return; }
    if (value && typeof value === "object") Object.entries(value).forEach(([key, child]) => visit(child, path ? `${path}.${key}` : key));
  };
  visit(resume, "");
  return matches;
}

export function buildPrompt(jd: string, analysis: JDAnalysis, profile: ProfileSettings, confirmedStatements: ConfirmedWorkStatement[] = [], today = new Date(), achievementEvidence: AchievementEvidence[] = [], evidenceRecords: WorkEvidence[] = []) {
  const timeline = reviewEmploymentDates(profile.companies, today);
  const prior = (evidenceRecords.length ? [] : scopePriorStatements(confirmedStatements, analysis)).map((statement, index): WorkEvidence => ({
    id: `prior:${index}`, candidateKey: candidateKey(profile.personalInfo), employerId: statement.companyId,
    section: statement.section, text: statement.text, status: "confirmed",
    source: { kind: "legacy-confirmation", reference: "saved candidate confirmation" }, competencyTags: [],
  }));
  const plan = buildDraftPlan(profile, analysis, [...prior, ...evidenceRecords]);
  const immutableMetadata = {
    personalInfo: profile.personalInfo, education: profile.education, certifications: profile.certifications.filter(item => item.verificationStatus === "confirmed").map(({ id, name, issuer, year }) => ({ id, name, issuer, year })),
    companies: profile.companies.map(company => ({ id: companyId(company), name: company.companyName, client: company.clientName, location: company.location, industry: company.industry, officialTitle: company.jobTitle, startDate: company.startDate, endDate: company.isCurrent ? "Present" : company.endDate })),
    experience: { totalMonths: timeline.totalMonths, years: timeline.years, remainingMonths: timeline.remainingMonths, overlaps: timeline.overlaps, requiredYears: analysis.experienceYears, gapYears: analysis.experienceYears === null ? null : Math.max(0, analysis.experienceYears - timeline.totalMonths / 12) },
  };
  return `Act as a senior resume writer for the CURRENT job description. Return one complete resume JSON. This request is self-contained: ignore earlier JDs, resumes, generated titles, and conversation examples.

CURRENT REQUEST IS SELF-CONTAINED
Full-Time and C2C are employment profiles, not technical specialties. There is no default profession or stack. Derive the equivalent hands-on dimensions from their actual requirements, including non-software professions. The current JD determines the target headline, priority skills, and draft suggestions. It is never evidence that work happened.

THREE SEPARATE CATEGORIES
A. Immutable candidate metadata below: preserve identity, employer names, client/location, actual dates, official job titles, education, and verified certifications exactly. Do not add employers or reorder them. Never compress dates, extend experience, or manufacture seniority to meet the JD. Reported experience is the union of actual employment periods, not their sum. A requirement gap must remain a gap.
B. Relevant verified employment evidence: use each fact only for its employer. Preserve contribution level and projects. Classify facts as directly relevant, transferable, or unrelated; unrelated history must not dominate. Previous generated titles never supply official titles. No source fact may be moved between employers.
C. JD-driven draft suggestions: use the employer-specific drafting briefs for uncovered requirements to propose technically specific descriptions for review. These are proposed claims, not evidence. Every new statement is unconfirmed in application state until individually reviewed. Do not invent actual projects, production systems, technologies used, seniority, incidents, or results. If a requested skill has no evidence, it remains a missing qualification; a suggestion cannot be presented as verified history.

WRITING AND TITLES
- A changed headline alone is not a tailored resume. Match summary priorities, relevant skills, responsibilities, and technical depth to this JD.
- Set personalInfo.professionalTitle to the exact cleaned target role from CURRENT JD ANALYSIS. If it says Target role not specified, infer a concise functional headline from this JD's actual duties only; never infer it from candidate history or a default technology.
- Preserve every nonempty official employer title exactly. If blank, suggest a concise functional title consistent with documented work and the JD; keep it unconfirmed. If evidence does not support that profession, do not disguise it with the requested title. The app reports the mismatch.
- Write 4–6 distinct summary bullets and substantive employer responsibilities: action + component/technology + implementation or troubleshooting detail + purpose + supported outcome where available. Use natural verbs, no generic filler or copied JD sentences. No repeated responsibility across employers. Vary scope only according to documented contribution and seniority.
- Use the most recent relevant evidence first. Preserve actual employer industry and context. Do not invent client/project names or transplant domain experience. Projects must come from documented employer project facts.
- Generate coherent, role-specific suggestions for uncovered requirements using the drafting briefs, not a technology-specific prompt. A blank evidence section is a reason for review, not a license to claim expertise.
- Every string inside the returned "resume" object is resume copy intended to appear on the page. Do not write 'proposed profile', 'targeting a role', 'experience requirement', or workflow commentary in the resume. Review metadata belongs to the application. Omit LinkedIn. Keep email as a plain address.

ACHIEVEMENTS
- Use actual numerical results only from confirmedAchievementEvidence for the same employer. Include relevant measured results in substantive responsibility bullets; calculate reductions as (before-after)/before*100 and increases as (after-before)/before*100 only for comparable units and nonzero baselines.
- Otherwise use a technically specific qualitative outcome without invented scale, percentages, uptime, volumes, or savings.
- Optional brainstorming: when useful, include 2–4 role-relevant synthetic illustrations per employer ONLY as paired strings: [SYNTHETIC EXAMPLE] illustrative quantified sentence [QUALITATIVE] supported qualitative replacement. The importer separates syntheticAchievementDraft metadata and displays ONLY the qualitative replacement in the factual resume. Synthetic numbers cannot be verified through general confirmation or exported as facts. Never use these markers in other sections.

SILENT QUALITY CHECK
Match each JD requirement against each employer's recorded facts. Evaluate title, mandatory and preferred skills separately, summary relevance, employer-specific responsibilities, implementation depth, project evidence, education, certifications, and experience gap. One shared keyword is not proof. Missing qualifications stay missing. Never turn a discussion, observation, or limited contribution into ownership or implementation. No guaranteed ATS score. Review all role-specific draft suggestions as unconfirmed.
Return only JSON matching the exact schema below, no wrapper or new fields, no markdown fences. Preserve responsibilityGroups, responsibilities, environment, projects, education, certifications. If no projects are supported, use [].

EXACT EXISTING RESUME JSON SHAPE
${JSON.stringify(OUTPUT_CONTRACT, null, 2)}

JOB DESCRIPTION
${jd.trim()}

CURRENT JD ANALYSIS
${JSON.stringify(analysis, null, 2)}

IMMUTABLE CANDIDATE METADATA
${JSON.stringify(immutableMetadata, null, 2)}

EMPLOYER-SPECIFIC EVIDENCE AND UNCONFIRMED DRAFTING BRIEFS
${JSON.stringify(plan, null, 2)}

CONFIRMED ACHIEVEMENT EVIDENCE
${JSON.stringify(confirmedMetricEvidence(achievementEvidence.filter(item => item.status === "verified")), null, 2)}`;
}
