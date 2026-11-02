import type { JDAnalysis, ProfileSettings, Resume } from "@/types/resume";
import { matchRequirement, concepts } from "./requirement-match";
import { candidateKey, profileEvidence, type WorkEvidence } from "./work-evidence";
import { reviewEmploymentDates } from "./timeline";

export function analyzeCoverage(analysis: JDAnalysis, resume: Resume | null, profile: ProfileSettings, confirmations: WorkEvidence[] = [], today = new Date()) {
  const sameCandidate = !resume || candidateKey(resume.personalInfo) === candidateKey(profile.personalInfo);
  const key = candidateKey(resume?.personalInfo ?? profile.personalInfo);
  const evidence = [...(sameCandidate ? profileEvidence(profile) : []), ...confirmations.filter(record => record.candidateKey === key && record.status === "confirmed")];
  const metadata = sameCandidate ? [...profile.education.map(item => `${item.degree} ${item.institution}`), ...profile.certifications.filter(item => item.verificationStatus === "confirmed").map(item => item.name)] : [];
  const summary = resume?.professionalSummary.bullets.join(" ") ?? "";
  const experience = resume?.experience.flatMap(job => job.responsibilities).join(" ") ?? "";
  const body = resume ? [summary, experience, ...resume.technicalSkills.categories.flatMap(category => category.skills), ...resume.education.map(item => `${item.degree} ${item.institution}`), ...resume.certifications.map(item => item.name)].join(" ") : "";
  const checks = analysis.requirements.map(requirement => {
    const keyword = matchRequirement(requirement.text, body);
    const supportedBy = evidence.filter(record => record.employerId !== "global"
      && ["responsibility", "skill", "project", "project description"].includes(record.section)
      && matchRequirement(requirement.text, record.text).supported).map(record => record.employerId);
    const qualification = requirement.category === "education" || requirement.category === "certification";
    const verified = supportedBy.length > 0 || (qualification && [...metadata, ...evidence.filter(record => record.section === "education" || record.section === "certifications").map(record => record.text)].some(text => matchRequirement(requirement.text, text).supported));
    return { ...requirement, keywordCoverage: keyword.score, verified, supportedBy: [...new Set(supportedBy)], missingTerms: keyword.missing, summaryMatch: matchRequirement(requirement.text, summary).supported, experienceMatch: matchRequirement(requirement.text, experience).supported };
  });
  const weighted = (pick: (check: typeof checks[number]) => number) => {
    const weights = checks.map(check => check.kind === "required" ? 3 : check.kind === "preferred" ? 1 : 2);
    const total = weights.reduce((a, b) => a + b, 0);
    return total ? Math.round(checks.reduce((sum, check, i) => sum + pick(check) * weights[i], 0) * 100 / total) : null;
  };
  const actual = sameCandidate ? reviewEmploymentDates(profile.companies, today) : null;
  const employerEvidence = (resume?.experience ?? []).map(job => ({ employerId: job.id, company: job.company, relevantRequirements: checks.filter(check => check.supportedBy.includes(job.id)).map(check => check.text), unsupportedResponsibilities: job.responsibilities.filter(text => !evidence.some(record => record.employerId === job.id && record.text.trim().toLowerCase() === text.trim().toLowerCase())) }));
  return {
    keywordCoverage: weighted(check => check.keywordCoverage), verifiedCoverage: weighted(check => Number(check.verified)),
    titleAligned: Boolean(resume && resume.personalInfo.professionalTitle.trim().toLowerCase() === analysis.targetRole.trim().toLowerCase()),
    mandatorySkills: checks.filter(check => check.kind === "required" && check.category === "skill"),
    summaryRelevance: checks.filter(check => check.summaryMatch).length,
    experienceRelevance: checks.filter(check => check.experienceMatch).length,
    technicalDepth: (resume?.experience.flatMap(job => job.responsibilities) ?? []).filter(text => concepts(text).length >= 8 && /\b(using|through|with|by|for|to)\b/i.test(text)).length,
    projectEvidence: resume?.projects.map(project => ({ name: project.name, supported: sameCandidate && profile.companies.some(company => company.projects.some(source => source.name === project.name && source.context === project.description)) })) ?? [],
    employerEvidence, missingQualifications: checks.filter(check => !check.verified), checks,
    actualExperience: actual, experienceGapYears: actual && analysis.experienceYears !== null ? Math.max(0, analysis.experienceYears - actual.totalMonths / 12) : null,
    disclaimer: "Local concept and terminology coverage, not an employer ATS score. Alias and action matching is conservative; it does not independently verify employment or guarantee a match.",
  };
}
