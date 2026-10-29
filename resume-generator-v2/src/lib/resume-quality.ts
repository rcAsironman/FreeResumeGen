import type { JDAnalysis, ProfileSettings, Resume } from "@/types/resume";
import { companyId } from "@/lib/jd";
import { findPerformanceMeasurements, findUnsupportedMetricClaims, repeatedMetricFindings, type AchievementEvidence } from "@/lib/achievements";

export type StrengthDimension = { name: string; score: number; weight: number; reason: string };
export type BulletQualityFinding = { path: string; employer: string; text: string; issues: string[] };
export type SkillEvidenceFinding = { skill: string; locations: string[] };
export type ResumeStrength = {
  score: number;
  dimensions: StrengthDimension[];
  findings: string[];
  bulletFindings: BulletQualityFinding[];
  unsupportedSkills: SkillEvidenceFinding[];
  achievementMetrics: { evidencedClaims: number; estimatedClaims: number; unsupportedClaims: number; repeatedResults: string[] };
  disclaimer: string;
};

const weakLanguage = /\b(participated in (?:activities|software engineering activities)|contributed to (?:discussions|technical discussions)|familiar with concepts|knowledge of technologies|worked in an environment|assisted with routine activities|supported communication|collaborated with (?:colleagues|engineering colleagues)|helped with development|involved in projects|supported routine application maintenance)\b/i;
const action = /\b(built|developed|implemented|designed|configured|integrated|automated|optimized|debugged|resolved|administered|migrated|deployed|tested|created|maintained|refactored|analyzed|monitored|tuned|orchestrated|secured|validated|modeled|transformed|provisioned|reviewed|led|wrote|reduced|improved|enabled|established|troubleshot|investigated|operated)\b/i;
const technical = /\b(java|spring|\.net|c#|python|node(?:\.js)?|typescript|javascript|react|angular|sql|postgres(?:ql)?|oracle|mysql|kafka|confluent|aws|azure|gcp|kubernetes|docker|terraform|ansible|jenkins|gitlab|github actions|rest|api|microservices|etl|elt|informatica|tableau|salesforce|sap|oauth|tls|linux|prometheus|grafana|hadoop|spark|snowflake|databricks|selenium|playwright|junit|pytest|hibernate|blazor|kofax|tungsten)\b/i;
const implementationDetail = /\b(api|endpoint|broker|topic|partition|consumer|schema|pipeline|workflow|query|service|microservice|database|table|index|deployment|container|cluster|alert|dashboard|test suite|unit test|integration test|validation|authentication|authorization|batch|stream|replication|incident|root cause|configuration|infrastructure as code|etl|elt|model|transformation|connector|job|component|module|application|exception|transaction|dependency injection|retry|logging|monitoring|build|release|deployment|data quality)\b/i;
const purpose = /\b(to|for|so that|enabling|supporting|improving|preventing|reducing|ensuring|allowing|providing)\b/i;
const testingOps = /\b(test(?:ing|s)?|junit|mockito|pytest|playwright|selenium|debug(?:ging)?|troubleshoot(?:ing)?|root cause|incident|performance|latency|throughput|architecture|resilien(?:t|ce)|monitor(?:ing)?|alert(?:ing)?|observability|capacity|security|reliability|data quality|validation|deployment|rollback|availability|recovery|profil(?:ing|er)|query plan|integration test)\b/i;
const stopWords = new Set(["the", "and", "for", "with", "from", "into", "using", "used", "this", "that", "their", "across", "where", "when", "then", "have", "has", "was", "were", "will", "can", "built", "developed", "implemented", "designed", "configured", "integrated", "automated", "optimized", "debugged", "resolved", "administered", "deployed", "tested", "created", "maintained", "refactored", "analyzed", "monitored", "tuned", "supported", "worked", "system", "application", "applications", "services", "service", "project", "projects", "engineering", "software", "technical"]);
const rolePractice: [RegExp, RegExp][] = [
  [/java|backend|software engineer|full.stack/i, /\b(junit|mockito|unit test|integration test|api test|debug|exception|transaction|query optimization|performance|logging|security|resilien|architecture)\b/i],
  [/kafka|streaming|messaging/i, /\b(consumer lag|isr|replication|partition|reassignment|monitor|incident|capacity|security|tls|sasl|schema registry|connect|throughput|availability|r.c.a)\b/i],
  [/devops|sre|platform engineer/i, /\b(ci\/cd|pipeline|infrastructure as code|terraform|ansible|monitor|alert|incident|rollback|capacity|availability|security|automation|recovery)\b/i],
  [/data engineer|dataops|etl|analytics engineer/i, /\b(etl|elt|data quality|validation|orchestrat|transformation|data model|warehouse|pipeline|query performance|testing|monitor)\b/i],
  [/\.net|c#|asp\.net/i, /\b(xunit|nunit|entity framework|dependency injection|web api|debug|exception|sql|performance|security|integration test)\b/i],
  [/cloud|aws|azure|gcp/i, /\b(iam|network|terraform|infrastructure|monitor|alert|availability|security|backup|recovery|cost|deployment)\b/i],
  [/salesforce|crm developer/i, /\b(apex test|lightning|flow|integration|security|deployment|debug|governor limits|api)\b/i],
  [/sap|erp consultant/i, /\b(configuration|integration|testing|migration|authorization|transport|incident|module|process)\b/i],
  [/react|node|frontend|full.stack/i, /\b(component test|unit test|integration test|accessibility|performance|api|debug|state management|deployment|monitor)\b/i],
];

function clamp(value: number) { return Math.max(0, Math.min(100, Math.round(value))); }
function normalize(value: string) { return value.toLocaleLowerCase().replace(/[^a-z0-9+#.]+/g, " ").replace(/\s+/g, " ").trim(); }
function uniqueRatio(values: string[]) {
  if (!values.length) return 0;
  const normalized = values.map(normalize);
  return new Set(normalized).size / normalized.length;
}
function sourceText(profile: ProfileSettings, confirmedFacts: { companyId: string; text: string }[], id?: string) {
  return profile.companies.filter((company) => !id || companyId(company) === id).flatMap((company) => [
    ...company.technologies,
    ...company.responsibilities,
    ...company.projects.flatMap((project) => [project.name, project.context, ...project.technologies, ...project.responsibilities]),
    ...confirmedFacts.filter((fact) => fact.companyId === companyId(company)).map((fact) => fact.text),
  ]).filter(Boolean).join(" ").toLocaleLowerCase();
}
function relevantPractices(role: string) {
  const practice = rolePractice.find(([pattern]) => pattern.test(role))?.[1] ?? /\b(test|debug|performance|architecture|monitor|security|deployment|reliability|validation|incident)\w*\b/i;
  return [...new Set((role.match(/[A-Za-z.#+]+/g) ?? []))].length ? practice : /$^/;
}

export function evaluateResumeStrength(analysis: JDAnalysis, resume: Resume | null, profile: ProfileSettings, confirmedFacts: { companyId: string; text: string }[] = [], achievementEvidence: AchievementEvidence[] = []): ResumeStrength | null {
  if (!resume) return null;
  const responsibilities = resume.experience.flatMap((item) => item.responsibilities.map((text, index) => ({ text, employer: item.company, employerId: item.id, path: `experience.${item.id}.responsibilities.${index}` })));
  const summary = resume.professionalSummary.bullets;
  const skills = resume.technicalSkills.categories.flatMap((category) => category.skills.map((skill) => ({ skill, category: category.name })));
  const allText = [...summary, ...skills.map((item) => item.skill), ...responsibilities.map((item) => item.text), ...resume.projects.flatMap((project) => [project.description, ...project.highlights, ...project.technologies])].filter(Boolean);
  const allDraft = allText.join(" ").toLocaleLowerCase();
  const sourceByEmployer = new Map(profile.companies.map((company) => [companyId(company), sourceText(profile, confirmedFacts, companyId(company))]));
  const confirmedGlobal = confirmedFacts.map((fact) => fact.text).join(" ").toLocaleLowerCase();
  const bulletFindings: BulletQualityFinding[] = [];
  let actionAndTechnologyBullets = 0;
  let detailedBullets = 0;
  let purposeBullets = 0;
  let traceableCount = 0;
  responsibilities.forEach((bullet) => {
    const issues: string[] = [];
    if (!action.test(bullet.text)) issues.push("Start with a clear action that reflects the candidate's actual contribution.");
    if (!technical.test(bullet.text)) issues.push("Name the specific technology or engineering method when the source supports it.");
    if (action.test(bullet.text) && technical.test(bullet.text)) actionAndTechnologyBullets++;
    if (implementationDetail.test(bullet.text)) detailedBullets++;
    else issues.push("Add a concrete implementation, component, or troubleshooting detail.");
    if (purpose.test(bullet.text)) purposeBullets++;
    else issues.push("State the system or business purpose when it is known.");
    if (weakLanguage.test(bullet.text)) issues.push("Replace generic wording while preserving the real contribution level.");
    const source = sourceByEmployer.get(bullet.employerId) ?? "";
    const terms = [...new Set((normalize(bullet.text).match(/[a-z0-9+#.]{3,}/g) ?? []).filter((term) => !stopWords.has(term)))];
    const meaningful = terms.filter((term) => term.length > 3 || /^(sql|api|etl|elt|gcp|aws|c#)$/i.test(term));
    const matched = meaningful.filter((term) => source.includes(term));
    if (meaningful.length && matched.length / meaningful.length >= 0.2) traceableCount++;
    else issues.push("The employer-specific source history does not yet substantiate enough of this statement; confirm or edit its details.");
    if (issues.length) bulletFindings.push({ path: bullet.path, employer: bullet.employer, text: bullet.text, issues });
  });

  const requirementTerms = [...new Set(analysis.requirements.flatMap((item) => [...item.keywords, item.text]).flatMap((value) => normalize(value).split(" ")).filter((term) => term.length > 2 && !stopWords.has(term)))];
  const covered = requirementTerms.filter((term) => allDraft.includes(term)).length;
  const supportedTerms = requirementTerms.filter((term) => confirmedGlobal.includes(term) || [...sourceByEmployer.values()].some((source) => source.includes(term))).length;
  const requirementCoverage = requirementTerms.length ? covered / requirementTerms.length : 0;
  const sourceCoverage = requirementTerms.length ? supportedTerms / requirementTerms.length : 0;

  const sourceProjects = profile.companies.flatMap((company) => company.projects.map((project) => ({ company, project }))).filter(({ project }) => Boolean(project.context.trim() || project.technologies.length || project.responsibilities.length));
  const draftProjects = resume.projects.filter((project) => Boolean(project.description.trim() || project.highlights.length));
  const mappedDraftProjects = draftProjects.filter((project) => sourceProjects.some(({ company, project: source }) => project.id === source.id || (project.name === source.name && resume.experience.some((job) => job.id === companyId(company)))));
  const projectCoverage = sourceProjects.length ? mappedDraftProjects.length / sourceProjects.length : sourceProjects.length === 0 && resume.projects.length === 0 ? 55 : 25;
  const projectContextScore = sourceProjects.length ? clamp(projectCoverage * 100) : projectCoverage;

  const rolePracticePattern = relevantPractices(analysis.targetRole);
  const sourcePractice = [...sourceByEmployer.values()].join(" ");
  const resumePractice = `${allDraft} ${sourcePractice}`;
  const practiceTerms = [...new Set((sourcePractice.match(new RegExp(rolePracticePattern.source, "gi")) ?? []).map(normalize))];
  const practiceCoverage = practiceTerms.length ? practiceTerms.filter((term) => resumePractice.includes(term)).length / practiceTerms.length : (testingOps.test(allDraft) && testingOps.test(sourcePractice) ? 75 : testingOps.test(allDraft) ? 35 : 20);

  const unsupportedSkills: SkillEvidenceFinding[] = skills.flatMap(({ skill }) => {
    const normalizedSkill = normalize(skill);
    const locations = profile.companies.filter((company) => sourceByEmployer.get(companyId(company))?.includes(normalizedSkill)).map((company) => company.companyName);
    const hasCandidateConfirmedEvidence = confirmedFacts.some((fact) => normalize(fact.text).includes(normalizedSkill));
    return locations.length || hasCandidateConfirmedEvidence ? [] : [{ skill, locations: ["Listed in Technical Skills only"] }];
  });

  const employersWithBullets = resume.experience.filter((job) => job.responsibilities.length);
  const sourceRichEmployers = employersWithBullets.filter((job) => (sourceByEmployer.get(job.id) ?? "").trim().length > 0).length;
  const distinctEmployerBullets = responsibilities.length ? responsibilities.filter((bullet) => {
    const peers = responsibilities.filter((other) => other.employerId !== bullet.employerId);
    const terms = new Set(normalize(bullet.text).split(" ").filter((term) => term.length > 4 && !stopWords.has(term)));
    return !peers.some((other) => {
      const otherTerms = new Set(normalize(other.text).split(" "));
      return [...terms].filter((term) => otherTerms.has(term)).length / Math.max(1, terms.size) > 0.8;
    });
  }).length / responsibilities.length : 0;
  const employerDifferentiation = employersWithBullets.length ? (sourceRichEmployers / employersWithBullets.length * 0.65 + distinctEmployerBullets * 0.35) : 0;
  const summaryCount = summary.length;
  const summaryCountScore = summaryCount >= 4 && summaryCount <= 5 ? 100 : summaryCount === 6 ? 80 : Math.max(0, 100 - Math.abs(summaryCount - 5) * 20);
  const duplicateRate = 1 - uniqueRatio(responsibilities.map((item) => item.text));
  const genericCount = allText.filter((item) => weakLanguage.test(item)).length;
  const clarityScore = clamp((summaryCountScore * 0.4 + (1 - Math.min(1, duplicateRate)) * 35 + (1 - Math.min(1, genericCount / Math.max(1, allText.length))) * 25));
  const evidenceScore = responsibilities.length ? traceableCount / responsibilities.length : 0;
  const depthScore = responsibilities.length ? (actionAndTechnologyBullets / responsibilities.length * 0.45 + detailedBullets / responsibilities.length * 0.4 + purposeBullets / responsibilities.length * 0.15) : 0;
  const quantifiedBullets = responsibilities.filter((bullet) => findPerformanceMeasurements(bullet.text).length > 0);
  const unsupportedMetricPaths = new Set(findUnsupportedMetricClaims(resume, achievementEvidence).map((item) => item.path));
  const evidencedMetrics = quantifiedBullets.filter((bullet) => !unsupportedMetricPaths.has(bullet.path));
  const repeatedResults = repeatedMetricFindings(resume);
  const metricScore = responsibilities.length ? clamp(evidencedMetrics.length / responsibilities.length * 100) : 0;
  const activeBulletText = new Set(responsibilities.map((item) => item.text));
  const estimatedClaims = achievementEvidence.filter((item) => item.status === "candidate-estimated" && item.resumeTextSnapshot && activeBulletText.has(item.resumeTextSnapshot)).length;

  const dimensions: StrengthDimension[] = [
    { name: "Technical implementation depth", weight: 22, score: clamp(depthScore * 100), reason: `${actionAndTechnologyBullets} of ${responsibilities.length} bullets use an action and named technology; ${detailedBullets} include implementation detail; ${purposeBullets} explain system purpose.` },
    { name: "JD relevance", weight: 18, score: clamp(requirementCoverage * (0.55 + sourceCoverage * 0.45) * 100), reason: `${covered} of ${requirementTerms.length} JD terms appear in the draft; only ${supportedTerms} have source-history evidence.` },
    { name: "Project and business context", weight: 13, score: projectContextScore, reason: sourceProjects.length ? `${mappedDraftProjects.length} of ${sourceProjects.length} documented company projects are represented in the resume.` : "No confirmed project details are configured. Add real project context to support project-specific statements." },
    { name: "Evidence of hands-on work", weight: 13, score: clamp(evidenceScore * 100), reason: `${traceableCount} of ${responsibilities.length} responsibility bullets map to employer-specific source facts or candidate-confirmed statements.` },
    { name: "Testing, architecture, and operations", weight: 9, score: clamp(practiceCoverage * 100), reason: practiceTerms.length ? `The draft reflects ${Math.round(practiceCoverage * 100)}% of relevant testing, design, and operational practices present in source evidence.` : "Role-relevant testing, debugging, architecture, and operational evidence is limited in the configured work history." },
    { name: "Employer differentiation", weight: 9, score: clamp(employerDifferentiation * 100), reason: `${sourceRichEmployers} of ${employersWithBullets.length} employers with bullets have recorded work facts; repeated cross-employer content lowers this score.` },
    { name: "Readability and clarity", weight: 6, score: clarityScore, reason: `${genericCount} generic-language flags; ${summaryCount} summary bullets; ${Math.round(duplicateRate * 100)}% repeated responsibility wording.` },
    { name: "Achievement evidence", weight: 10, score: metricScore, reason: `${evidencedMetrics.length} of ${responsibilities.length} responsibility bullets contain a numeric outcome supported by candidate-attested evidence; ${estimatedClaims} evidence record(s) are estimates. Unsupported numbers do not earn credit.` },
  ];
  const score = clamp(dimensions.reduce((total, item) => total + item.score * item.weight, 0) / 100);
  const findings: string[] = [];
  if (genericCount) findings.push(`Replace or remove generic phrases in ${genericCount} resume statement(s), preserving the actual contribution level.`);
  if (bulletFindings.length) findings.push(`${bulletFindings.length} responsibility bullet(s) need review for action, implementation detail, purpose, or employer-specific evidence.`);
  if (unsupportedSkills.length) findings.push(`${unsupportedSkills.length} technical skill(s) appear only in the skills list and need supporting work evidence or removal.`);
  const unsupportedMetricCount = findUnsupportedMetricClaims(resume, achievementEvidence).length;
  if (unsupportedMetricCount) findings.push(`${unsupportedMetricCount} numeric achievement claim(s) need a measurement value, period, source, and candidate attestation before final export.`);
  if (repeatedResults.length) findings.push(...repeatedResults);
  if (sourceProjects.length && mappedDraftProjects.length < sourceProjects.length) findings.push("Add documented project context to the relevant employer experience or project section; do not invent project names or outcomes.");
  if (!sourceProjects.length) findings.push("No project facts are configured. Add real project context in Company Settings before expecting project-specific detail.");
  if (sourceRichEmployers < employersWithBullets.length) findings.push("Some employer sections have no source work facts. Their generated statements remain proposals and require candidate review.");
  if (requirementTerms.length && requirementCoverage < 0.5) findings.push("The draft covers less than half of the distinct JD terms; strengthen only items supported by actual work.");
  if (duplicateRate > 0.2) findings.push("Differentiate responsibilities by employer; repeated wording weakens the evidence that the work history is distinct.");
  return {
    score,
    dimensions,
    findings,
    bulletFindings,
    unsupportedSkills,
    achievementMetrics: { evidencedClaims: evidencedMetrics.length, estimatedClaims, unsupportedClaims: unsupportedMetricCount, repeatedResults },
    disclaimer: "Internal resume-strength estimate based on draft detail and configured work history. It does not verify claims, predict hiring, or represent an employer ATS score; confirm every proposed statement before final export.",
  };
}
