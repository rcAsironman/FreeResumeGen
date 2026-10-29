import type { JDAnalysis, ProfileSettings, Resume } from "@/types/resume";
import { companyId, projectId } from "./jd";
import { proposeJDTimeline, reviewEmploymentDates } from "./timeline";
import { confirmedMetricEvidence, type AchievementEvidence } from "./achievements";

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

export function buildPrompt(jd: string, analysis: JDAnalysis, profile: ProfileSettings, confirmedStatements: ConfirmedWorkStatement[] = [], today = new Date(), achievementEvidence: AchievementEvidence[] = []) {
  const timeline = reviewEmploymentDates(profile.companies, today);
  const proposedTimeline = analysis.experienceYears !== null
    ? proposeJDTimeline(profile.companies, analysis, profile.preferences.maxExperienceYears, today)
    : null;
  const proposedById = new Map((proposedTimeline?.entries ?? []).map((entry) => [entry.id, entry]));
  const proposedIds = proposedTimeline ? new Set(proposedById.keys()) : null;
  const companies = profile.companies.filter((company) => !proposedIds || proposedIds.has(companyId(company))).map((company) => ({
    id: companyId(company),
    ...company,
    startDate: proposedById.get(companyId(company))?.proposedStartDate ?? company.startDate,
    endDate: proposedById.get(companyId(company))?.proposedEndDate ?? (company.isCurrent ? "Present" : company.endDate),
    projects: [...company.projects].map((project, index) => ({ ...project, id: projectId(company, project, index) })).sort((a, b) => {
      const score = (project: typeof a) => {
        const info = `${project.name} ${project.industry} ${project.context}`.toLowerCase();
        const domainMatch = analysis.industry !== "Not explicitly stated" && `${company.industry} ${project.industry}`.toLowerCase().includes(analysis.industry.toLowerCase()) ? 5 : 0;
        const roleMatch = analysis.targetRole.toLowerCase().split(/\W+/).filter((term) => term.length > 3 && info.includes(term)).length;
        return domainMatch + roleMatch;
      };
      return score(b) - score(a);
    }),
  }));
  const candidate = {
    profileType: profile.profileType,
    personalInfo: profile.personalInfo,
    education: profile.education,
    certifications: profile.certifications,
    resumeTimeline: proposedTimeline
      ? { totalYears: proposedTimeline.targetYears, dateSchedule: proposedTimeline.entries.map((entry) => ({ id: entry.id, companyName: entry.companyName, startDate: entry.proposedStartDate, endDate: entry.proposedEndDate })) }
      : { totalYears: timeline.years + timeline.remainingMonths / 12, dateSchedule: companies.map((company) => ({ id: company.id, companyName: company.companyName, startDate: company.startDate, endDate: company.endDate })) },
    companies,
    previouslyConfirmedStatements: confirmedStatements,
    confirmedAchievementEvidence: confirmedMetricEvidence(achievementEvidence),
    preferences: { summaryBullets: Math.max(4, Math.min(6, profile.preferences.summaryBullets)), latestCompanyBullets: profile.preferences.latestCompanyBullets, otherCompanyBullets: profile.preferences.otherCompanyBullets },
  };
  return `Act as a senior technical recruiter and resume writer. Write a polished resume for the role named in the job description (JD). The JD determines the headline and content priorities. The selected profile supplies the candidate's identity, education, certifications, employers, official titles, locations, and source work history.

OUTPUT BOUNDARY — HIGHEST PRIORITY
- Every string inside the returned JSON is resume copy intended to appear on the page. Never include instructions, analysis, explanations, application workflow, review status, eligibility commentary, or a description of what this resume is trying to do in any JSON value.
- Write in natural, direct resume language. Do not describe the candidate as applying, targeting a role, satisfying a hiring requirement, or being a generated profile. Do not mention that a claim needs review or confirmation. Do not restate the JD's minimum experience as a hiring requirement. If stating years in the summary, use only the duration represented by resumeTimeline.totalYears and write it as the candidate's experience.
- Professional summary bullets must summarize the candidate's relevant capabilities and work. They must not describe the JD, the resume, the generation process, or the job's requirements. The headline already names the target role.
- The application separately tracks which generated claims await candidate review. This tracking has no effect on the wording or style of the resume.

RESUME WRITING RULES
- Match the current JD's role, seniority, domain, skills, and responsibilities. Do not assume a default specialty. Set personalInfo.professionalTitle to the cleaned JD target role, preserving meaningful seniority and specialization.
- Build a role-specific technical evidence map from the JD before writing. Select only the dimensions relevant to this job family. For software development, consider coding, frameworks, APIs, databases, testing, debugging, deployment, and production support. For data roles, consider ingestion, transformations, pipelines, data models, quality, warehouses, and scheduling. For platform/SRE/DevOps roles, consider architecture, configuration, automation, observability, security, incidents, capacity, and reliability. For other job families, derive the equivalent hands-on dimensions from their actual requirements; do not force unrelated categories into the resume.
- Before drafting, silently build an employer-by-employer evidence map: source facts, named technologies, project context, candidate contribution, delivery/testing/operations facts, and JD requirements they support. Keep every fact attached to its source employer. Use confirmed facts first and prioritize the most relevant evidence for the JD.
- Match each JD requirement against each employer's recorded facts, projects, and confirmed candidate statements. Rewrite supported facts clearly and specifically without changing their meaning, contribution level, or employer association. If source work facts are sparse or absent, create technically specific, role-relevant draft options for candidate review rather than generic filler. These are proposed claims, not evidence: the app must keep them unconfirmed and exclude them from final exports until the candidate confirms them. Never turn a discussion, observation, or limited contribution into ownership or implementation.
- Write responsibilities with natural variation using this quality pattern when facts permit: action + named technology/component + concrete implementation or troubleshooting detail + system/business purpose + verified outcome, if available. A missing outcome is acceptable; do not invent one. Use the closest truthful level of contribution and avoid empty statements that could apply to any engineer. Do not force every sentence into the same formula or repeat identical opening verbs.
- QUANTIFIED ACHIEVEMENTS: Add a numeric result only when it appears in confirmedAchievementEvidence for that same employer and metric. When matching evidence is supplied, incorporate each supported result into the closest relevant responsibility for that employer; do not silently omit relevant verified measurements or place one in a different role. Use a measured result only once; do not repeat the same improvement across multiple bullets or employers. Never invent percentages, latency, throughput, scale, reliability, savings, revenue, test coverage, or time saved. Treat status "candidate-estimated" as approximate and word it accordingly; treat status "verified" as a candidate-attested measurement, not independently audited. Keep metric type, value, unit, period, before/after values, and source context accurate. Do not transfer an employer's metric to another employer or reuse the same result across roles. When no measurement is supplied, write a concrete qualitative accomplishment only when its method and result are supported; otherwise describe the supported implementation without claiming an outcome. The app's Strengthen Achievements review identifies relevant missing measures and lets the candidate confirm evidence; do not add metric questions or evidence metadata to resume JSON.
- Give the latest employer the strongest JD-relevant, specific implementation evidence. Use earlier employers for their own distinct work and believable scope. Use the configured bullet preferences as a guide, not a quota: prefer 6–10 substantive bullets for a detailed recent role and 4–7 for earlier roles when the supplied evidence supports them. Never pad a role with generic claims to hit a count; sparse employer data must remain clearly unconfirmed in application review.
- Keep suggestions grounded and plausible for the employer's dates, industry, and role seniority. A JD technology in a review statement is a claim to verify, never evidence that the candidate used it. Do not invent named projects, unique systems, incidents, outcomes, metrics, scale, or certifications. Do not transfer a confirmed technology or responsibility from one employer to another without supporting context for that employer.
- Use exact technology names when they are supplied or included for review. Do not dilute them into labels such as "Java development concepts," "cloud-native concepts," "CI/CD concepts," "familiar with," or "knowledge of." Avoid low-agency filler verbs such as "participated," "assisted," or "collaborated" unless the actual work was limited to that contribution. Do not claim certifications, proficiency, or years that are not in the profile or date schedule. Add a technology to a company Environment list only if that employer's facts or candidate-confirmed statements establish its use there.
- Keep each configured official employer title exactly as supplied. If none is configured, use a concise functional role aligned to the JD; the application will mark it for review, and it must not be presented as the employer's official HR title.
- Use exactly the employer IDs, names, clients, and locations supplied in the selected profile. Do not add employers, projects, degrees, institutions, graduation dates, certifications, or contact details. Keep projects and technologies associated with their source employer. Never move a fact between employers.
- When resumeTimeline.dateSchedule contains a company, use that company's startDate and endDate exactly. These are the dates to display in the resume; do not substitute dates found elsewhere in the input. When no numeric experience duration appears in the JD, use the configured employment dates in the company records.
- Generate one experience entry for each company in the selected profile data. Use its stable ID, exact name, configured official title (or functional title if blank), location, and scheduled dates. Keep employers in the order supplied. Do not add, remove, rename, or reorder employers. Make entries employer-specific: use only that employer's work facts, projects, technologies, domain context, and confirmed statements. Do not repeat a responsibility across employers unless the source independently supports it for each.
- Make bullets detailed, natural, varied, and action-oriented. Avoid generic filler and repeated bullets. Do not copy the JD verbatim. Do not invent percentages, numeric outcomes, uptime, volumes, savings, scale, or measured achievements. If no supported result is available, describe the action without adding an outcome.
- Write 4–6 professional summary bullets, even if the settings request a higher count. Make each specific to the role and supplied experience window. Each bullet must add a distinct supported or clearly reviewable technical qualification, hands-on activity, system responsibility, or domain detail; remove repeated claims and broad statements that could describe any applicant. Put the strongest JD-matched technical evidence first.
- For each employer, make responsibilities distinct and technically substantive at the level appropriate to that role. A recruiter should be able to identify the technology, the candidate's action, and the component or engineering problem in each bullet. Do not fill the requested bullet count with repetitive meeting, coordination, or generic application-maintenance statements.
- Project evidence pass: inspect every supplied project record for business purpose, application/system context, architecture, technologies, candidate contribution, integrations/APIs, testing, deployment, problems solved, and verified outcome. Use those details to make relevant employer bullets concrete. Populate top-level projects only from project records and preserve their IDs, names, and employer association. Do not duplicate the same detail in both sections unless each use serves a different purpose. An industry label or employer name alone is not project evidence; when project facts are absent, keep projects empty and do not invent a production project.
- Technical depth pass: for each role-relevant bullet, check for a concrete action, named technology/method, implementation detail, and application purpose. Consider testing, architecture, debugging, performance, and operations only where this JD and the employer evidence make them relevant. Identify weak bullets for the app's quality report; do not manufacture missing details to improve a score.
- Cross-check technicalSkills, professionalSummary, experience, projects, and each employer's source facts. Keep skills that are genuinely documented even if a particular bullet does not repeat them. Flag resume skills with no supporting employer or candidate-confirmed evidence in the app's review report; do not silently portray a JD-only keyword as verified experience. Preserve exact technology versions only when evidence supplies them.
- Populate each Environment list only with technologies actually recorded or candidate-confirmed for that employer, deduplicated and not copied across companies. If none are documented, return an empty list; never substitute an industry label for a technical stack.
- Do not automatically copy a profession checklist into the resume. Derive relevant technical dimensions from this JD, then include only employer-supported facts or draft options explicitly marked unconfirmed by the application. Never add a named tool just because the JD asks for it.
- For Kafka/SRE roles, distinguish consumer lag from under-replicated partitions. Mention Terraform provisioning, partition reassignment, Kafka commands, GitLab deployments, or incident outcomes only when supported by supplied work facts. For migration roles, describe AWS MSK only when supplied facts confirm whether the candidate assessed, designed, tested, implemented, or cut over a migration. Never turn a plan into a completed production migration.
- Omit LinkedIn. Keep email a plain address without slashes, backslashes, mailto, or Markdown. Use no interview-preparation text, questions, or filler.

EXPERIENCE WINDOW
${analysis.experienceYears ? `The JD specifies ${analysis.experienceYears} years. The supplied resumeTimeline represents exactly ${proposedTimeline?.targetYears ?? analysis.experienceYears} years, capped by the selected profile's maximum. Use every date in resumeTimeline.dateSchedule exactly.` : "The JD gives no numeric experience duration. Keep the configured source employment dates exactly as supplied."}

RECRUITER QUALITY PASS — perform this silently before returning JSON
- Confirm the headline names the JD role and the top summary points immediately show role-specific technical depth.
- Check that skills use concrete technology names, not "concepts" or vague familiarity labels.
- Check that every responsibility states a distinct action and technical scope; when supported facts are thin, make each generated review statement specific to this role and employer context rather than generic office collaboration.
- Check that no responsibility is generic, duplicated across employers, inflated beyond the recorded contribution, or presented as confirmed when it is only a draft option. Check that environments contain technical tools only, and project claims map to configured project records.
- Check for weak phrases such as "participated in activities," "familiar with concepts," "worked in an environment," and "helped with development." Do not merely replace the verb: preserve the real level of contribution and request candidate evidence when the actual implementation is unknown.
- Remove repeated, low-agency, placeholder, self-descriptive, or job-requirement language. Ensure the professional summary and responsibilities read like resume copy, not a description of the applicant or the JD.
- Preserve the exact output schema, candidate details, employer names, scheduled dates, and education. Do not invent results to improve the score.
- Keep the resume in recruiter-readable order and natural prose. The application formats the page; do not insert layout instructions or markdown into resume values.

RETURN REQUIREMENTS
- Return only valid JSON in the exact output shape below. No Markdown fences, commentary, ATS score, explanations, or status fields.
- Keep every root key and nesting exactly as shown; do not add fields. Optional properties may be omitted.
- Include the education and certifications supplied in the selected profile. Populate technicalSkills with accurately reviewable, role-relevant skills; do not present missing JD requirements as experience the candidate has performed. Keep environment tied to supplied work facts.
- Populate top-level projects only from project records in company settings. Preserve project names, employer association, facts, and technologies; do not invent project descriptions or highlights.

EXACT EXISTING RESUME JSON SHAPE
${JSON.stringify(OUTPUT_CONTRACT, null, 2)}

JOB DESCRIPTION
${jd.trim()}

LOCAL JD ANALYSIS
${JSON.stringify(analysis, null, 2)}

SELECTED ${profile.profileType.toUpperCase()} COMPANY METADATA AND CANDIDATE INFORMATION
${JSON.stringify(candidate, null, 2)}`;
}
