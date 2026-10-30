import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resumeSchema, profileSchema } from "../src/lib/contracts";
import { analyzeJD, cleanTargetRole, companyId, targetExperienceWindow } from "../src/lib/jd";
import { applyProposedTimelineDates, proposeJDTimeline, reviewEmploymentDates } from "../src/lib/timeline";
import { buildPrompt, findResumeMetaLanguage, findHeadlineOnlyMatch, isDraftGenerationReady, scopePriorStatements } from "../src/lib/prompt";
import { claimsFromResume, finalizeResume } from "../src/lib/claims";
import { createResumeDocx } from "../src/lib/docx-export";
import { matchExperienceToJD, scoreAlignment } from "../src/lib/alignment";
import { evaluateResumeStrength } from "../src/lib/resume-quality";
import { emptyProfile, type Resume } from "../src/types/resume";
import fullTimeSeed from "../data/settings/full-time.json";
import c2cSeed from "../data/settings/c2c.json";

const validResume: Resume = {
  personalInfo: { fullName: "Taylor Candidate", professionalTitle: "Cloud Engineer", email: "taylor@example.com", phone: "555-0100", location: "Remote" },
  professionalSummary: { bullets: ["Built and supported cloud services."] },
  technicalSkills: { categories: [{ name: "Cloud", skills: ["AWS"] }] },
  experience: [], projects: [], education: [], certifications: [],
};

test("C2C confirmation memory does not carry Kafka history or generated titles into Salesforce", () => {
  const base = { companyId: "att", companyName: "AT&T" };
  const statements = [
    { ...base, section: "role", text: "Senior Kafka Engineer" },
    { ...base, section: "responsibility", text: "Administered Kafka brokers." },
    { ...base, section: "responsibility", text: "Implemented Salesforce Apex case routing." },
  ];
  const analysis = analyzeJD("Role: Salesforce Developer\nSalesforce Apex required.");
  assert.deepEqual(scopePriorStatements(statements, analysis), [statements[2]]);
  assert.equal(statements.length, 3, "source memory is not deleted");
  const prompt = buildPrompt("Salesforce Developer", analysis, profileSchema.parse(c2cSeed), statements);
  assert.ok(!prompt.includes("Administered Kafka brokers."));
  assert.ok(!prompt.includes("Senior Kafka Engineer"));
  assert.ok(prompt.includes("Implemented Salesforce Apex case routing."));
  assert.ok(prompt.includes("CURRENT REQUEST IS SELF-CONTAINED"));
});

test("detects a Salesforce headline over Kafka responsibilities without treating historical titles as errors", () => {
  const resume = structuredClone(validResume);
  resume.personalInfo.professionalTitle = "Salesforce Developer";
  resume.experience = [{ id: "att", company: "AT&T", role: "Kafka Engineer", location: "", startDate: "2024", endDate: "Present", responsibilities: ["Administered Kafka brokers and consumer groups."], environment: ["Kafka"] }];
  const analysis = analyzeJD("Role: Salesforce Developer\nRequired: Salesforce, Apex, Lightning Web Components.");
  assert.match(findHeadlineOnlyMatch(resume, analysis) ?? "", /Role alignment warning/);
  resume.experience[0].responsibilities.push("Built Salesforce Apex integrations for customer case workflows.");
  assert.equal(findHeadlineOnlyMatch(resume, analysis), null);
  assert.equal(resume.experience[0].role, "Kafka Engineer");
});

test("both profile prompts explicitly prevent previous-role stack leakage", () => {
  const jd = "Role: Salesforce Developer\nRequired: Salesforce and Apex. 6 years experience.";
  for (const seed of [fullTimeSeed, c2cSeed]) {
    const prompt = buildPrompt(jd, analyzeJD(jd), profileSchema.parse(seed));
    assert.match(prompt, /employment profiles, not technical specialties/);
    assert.match(prompt, /directly relevant, transferable, or unrelated/);
    assert.match(prompt, /A changed headline alone is not a tailored resume/);
  }
});

test("resume contract accepts canonical shape and rejects additional root keys", () => {
  assert.equal(resumeSchema.safeParse(validResume).success, true);
  assert.equal(resumeSchema.safeParse({ ...validResume, atsScore: 97 }).success, false);
});

test("resume prompt excludes process language and importer flags leaked JD commentary", () => {
  const natural = { ...validResume, professionalSummary: { bullets: ["Java developer building backend services with Spring Boot."] } };
  const leaked = { ...validResume, professionalSummary: { bullets: ["Proposed profile for a Java Spring Boot GCP Developer role targeting financial services and banking applications, with a four-year experience requirement."] } };
  assert.deepEqual(findResumeMetaLanguage(natural), []);
  assert.deepEqual(findResumeMetaLanguage(leaked), ["professionalSummary.bullets[0]"]);
});

test("profile settings enforce two distinct profile kinds and capped experience", () => {
  const profile = emptyProfile("full-time");
  assert.equal(profileSchema.safeParse(profile).success, true);
  assert.equal(profileSchema.safeParse({ ...profile, profileType: "java" }).success, false);
  assert.equal(profileSchema.safeParse({ ...profile, preferences: { ...profile.preferences, maxExperienceYears: 9 } }).success, false);
  const c2c = emptyProfile("c2c");
  assert.equal(c2c.preferences.maxExperienceYears, 13);
  assert.equal(profileSchema.safeParse(c2c).success, true);
  assert.equal(profileSchema.safeParse({ ...c2c, preferences: { ...c2c.preferences, maxExperienceYears: 14 } }).success, false);
});

test("company settings retain separate employer details and verified work-history arrays", () => {
  const full = profileSchema.parse(fullTimeSeed);
  const c2c = profileSchema.parse(c2cSeed);
  assert.deepEqual(full.companies.map((item) => item.companyName), ["Fidelity Investments", "Pine Labs"]);
  assert.match(full.education[0]?.degree ?? "", /master/i);
  assert.deepEqual(c2c.companies.map((item) => item.companyName), ["AT&T", "Healthgrades", "FirstGroup America", "Outfront Media", "Nucleus Software"]);
  assert.match(c2c.education[0]?.degree ?? "", /bachelor/i);
  assert.notEqual(full.personalInfo.email, c2c.personalInfo.email);
  assert.deepEqual(full.companies[0]?.responsibilities, []);
  assert.deepEqual(full.companies[0]?.technologies, []);
  assert.deepEqual(c2c.companies[0]?.projects[0]?.responsibilities, []);
  const legacy = profileSchema.parse({ ...c2cSeed, companies: c2cSeed.companies.map((company) => ({ ...company, responsibilities: undefined, technologies: undefined, projects: company.projects.map((project) => ({ ...project, responsibilities: undefined, technologies: undefined })) })) });
  assert.deepEqual(legacy.companies[0]?.responsibilities, []);
  assert.deepEqual(legacy.companies[0]?.projects[0]?.technologies, []);
});

test("JD analysis extracts role, requirement bullets, and lower bound from a year range", () => {
  const analysis = analyzeJD("Job Title: Platform Engineer\nRequired Skills\n- AWS\n- Terraform\nResponsibilities\n- Automate infrastructure deployments\nExperience: 3-6 years");
  assert.equal(analysis.targetRole, "Platform Engineer");
  assert.equal(analysis.experienceYears, 3);
  assert.ok(analysis.requirements.some((item) => item.text === "AWS" && item.kind === "required"));
  assert.ok(analysis.requirements.some((item) => item.text === "Automate infrastructure deployments"));
});

test("JD role extraction removes hiring banners and location labels from the resume headline", () => {
  const analysis = analyzeJD("🚀 WE'RE HIRING: Data Integration Developer (Remote.\nRequired Skills\n- SQL\n- Python");
  assert.equal(analysis.targetRole, "Data Integration Developer");
  assert.equal(cleanTargetRole("Senior Data Engineer – Cloud Integrations"), "Senior Data Engineer – Cloud Integrations");
  assert.equal(cleanTargetRole("Full Stack Developer - Minneapolis, MN - Onsite Contract"), "Full Stack Developer");
});

test("JD analysis infers a usable role headline when the posting omits its title", () => {
  const jd = "Finance and banking background required\nExperience required 4 years\nMandatory Skills\nJava 8/11/17, Spring Boot, Microservices, GCP, BigQuery, Python, Kafka\nKey Responsibilities\nBuild APIs and deploy cloud-native applications. Build and enhance microservices using Java and Spring Boot. Develop data-intensive solutions leveraging BigQuery.";
  assert.equal(analyzeJD(jd).targetRole, "Java Backend Developer");
});

test("decorated qualification headings are not scored as JD requirements", () => {
  const analysis = analyzeJD("Role: Data Engineer\n🛠 Required Skills & Qualifications:\n- Build ETL pipelines with Informatica and SQL\nResponsibilities\n- Improve data quality and query performance");
  assert.ok(analysis.requirements.some((item) => item.text.includes("Informatica")));
  assert.ok(analysis.requirements.some((item) => item.text.includes("data quality")));
  assert.ok(analysis.requirements.every((item) => !/Required Skills\s*&\s*Qualifications/i.test(item.text)));
});

test("evidence alignment recognizes supported AWS and SQL and flags unsupported draft claims", () => {
  const analysis = analyzeJD("Role: Data Engineer\nRequired Skills\n- AWS\n- SQL");
  const profile = emptyProfile("full-time");
  profile.companies = [{ id: "fidelity", companyName: "Fidelity", clientName: "", industry: "Financial Services", location: "Remote", jobTitle: "Engineer", startDate: "Jan 2022", endDate: "Present", isCurrent: true, technologies: ["AWS", "SQL"], responsibilities: ["Built data pipelines on AWS and optimized SQL queries."], projects: [] }];
  const resume = { ...validResume, technicalSkills: { categories: [{ name: "Cloud and Data", skills: ["AWS", "SQL"] }] } };
  const supported = scoreAlignment(analysis, resume, profile);
  assert.ok(supported.checks.filter((item) => item.text === "AWS" || item.text === "SQL").every((item) => item.status === "supported"));
  const emptySource = emptyProfile("full-time");
  emptySource.companies = [{ ...profile.companies[0]!, technologies: [], responsibilities: [] }];
  const unsupported = scoreAlignment(analysis, resume, emptySource);
  assert.ok(unsupported.checks.filter((item) => item.text === "AWS" || item.text === "SQL").every((item) => item.status === "unsupported draft claim"));
  const unconfirmed = scoreAlignment(analysis, resume, profile, [], ["Developed AWS data pipelines and optimized SQL queries."]);
  assert.ok(unconfirmed.checks.filter((item) => item.text === "AWS" || item.text === "SQL").every((item) => item.status === "unconfirmed draft claim"));
  assert.ok(unconfirmed.unconfirmedClaims.length > 0);
});

test("ATS alignment reports role, skills, responsibilities, and JD experience", () => {
  const analysis = analyzeJD("Role: Data Integration Developer\nRequired Skills\n- SQL\nResponsibilities\n- Build ETL pipelines\nExperience: 4 years");
  const profile = emptyProfile("c2c");
  profile.companies = [{ id: "data-co", companyName: "Data Co", clientName: "", industry: "Technology", location: "Remote", jobTitle: "Data Developer", startDate: "Jan 2020", endDate: "Present", isCurrent: true, technologies: ["SQL", "ETL"], responsibilities: ["Built ETL pipelines with SQL."], projects: [] }];
  const resume: Resume = { ...validResume, personalInfo: { ...validResume.personalInfo, professionalTitle: "Data Integration Developer" }, technicalSkills: { categories: [{ name: "Data", skills: ["SQL", "ETL"] }] }, experience: [{ id: "data-co", company: "Data Co", role: "Data Developer", location: "Remote", startDate: "Jan 2020", endDate: "Present", responsibilities: ["Built ETL pipelines with SQL."], environment: ["SQL", "ETL"] }] };
  const alignment = scoreAlignment(analysis, resume, profile);
  assert.equal(alignment.breakdown.roleTitle, 100);
  assert.equal(alignment.breakdown.experience, 100);
  assert.equal(alignment.breakdown.skills, 100);
  assert.ok(alignment.checks.some((item) => item.text.startsWith("Target role title:")));
  assert.ok(alignment.checks.some((item) => item.text.startsWith("JD experience requirement:")));
});

test("JD experience matching separates recorded support from missing requirements", () => {
  const analysis = analyzeJD("Role: Kafka Platform Engineer\nRequired Skills\n- Kafka\n- Terraform\nResponsibilities\n- Monitor consumer lag and resolve incidents");
  const profile = emptyProfile("c2c");
  profile.companies = [{ id: "att", companyName: "AT&T", clientName: "", industry: "Telecommunications", location: "Atlanta", jobTitle: "Platform Engineer", startDate: "Jan 2020", endDate: "Present", isCurrent: true, technologies: ["Kafka"], responsibilities: ["Investigated consumer lag and resolved Kafka messaging incidents."], projects: [] }];
  const match = matchExperienceToJD(analysis, profile);
  assert.ok(match?.checks.find((item) => item.text === "Kafka")?.status === "supported");
  assert.ok(match?.checks.find((item) => item.text === "Terraform")?.status === "not documented");
});

test("JD timeline starts from the current month, spreads backward, and prioritizes matching industry", () => {
  const profile = emptyProfile("full-time");
  profile.companies = [
    { id: "telecom", companyName: "Telecom Co", clientName: "", industry: "Telecommunications", location: "Austin", jobTitle: "", startDate: "Jan 2018", endDate: "Dec 2023", isCurrent: false, technologies: [], responsibilities: [], projects: [] },
    { id: "bank", companyName: "Bank Co", clientName: "", industry: "Financial Services", location: "Chicago", jobTitle: "", startDate: "Jan 2010", endDate: "Dec 2017", isCurrent: false, technologies: [], responsibilities: [], projects: [] },
  ];
  const analysis = analyzeJD("Role: Banking Platform Engineer\nExperience: 8 years");
  const timeline = proposeJDTimeline(profile.companies, analysis, 8, new Date(2026, 9, 28));
  assert.equal(timeline.targetYears, 8);
  assert.deepEqual(timeline.entries.map((item) => item.companyName), ["Bank Co", "Telecom Co"]);
  assert.equal(timeline.entries[0].proposedEndDate, "Present");
  assert.equal(timeline.entries[0].industryMatch, true);
  const monthIndex = (value: string) => {
    const date = new Date(`${value === "Present" ? "Oct 2026" : value} 1`);
    return date.getFullYear() * 12 + date.getMonth();
  };
  assert.equal(monthIndex(timeline.entries[1].proposedEndDate) + 1, monthIndex(timeline.entries[0].proposedStartDate));
  assert.equal(profile.companies[1].startDate, "Jan 2010");
  assert.equal(profile.companies[1].endDate, "Dec 2017");
  assert.equal(targetExperienceWindow(analyzeJD("Role: Cloud Engineer\nMinimum 10 years experience"), 8), 8);
  assert.equal(targetExperienceWindow(analyzeJD("Role: Senior Kafka Engineer"), 13), 13);
  assert.equal(targetExperienceWindow(analyzeJD("Role: Senior Kafka Engineer\nExperience: 15 years"), 13), 13);
  assert.equal(targetExperienceWindow(analyzeJD("Role: Java Developer\nMinimum 4 years of experience"), 8), 4);
  const fourYearJD = analyzeJD("Role: Java Developer\nMinimum 4 years of experience");
  const fourYearTimeline = proposeJDTimeline(profile.companies, fourYearJD, 8, new Date(2026, 9, 29));
  assert.equal(fourYearTimeline.targetYears, 4);
  assert.equal(fourYearTimeline.entries.reduce((sum, entry) => sum + entry.durationMonths, 0), 48);
  assert.equal(fourYearTimeline.entries.filter((entry) => entry.proposedEndDate === "Present").length, 1);
  assert.equal(fourYearTimeline.entries.length, profile.companies.length);
  const importedOldDates: Resume = { ...validResume, experience: profile.companies.map((company) => ({ id: companyId(company), company: company.companyName, role: "Developer", location: company.location, startDate: company.startDate, endDate: company.isCurrent ? "Present" : company.endDate, responsibilities: [], environment: [] })) };
  const normalizedDates = applyProposedTimelineDates(importedOldDates, fourYearTimeline.entries);
  assert.equal(reviewEmploymentDates(normalizedDates.experience.map((job) => ({ ...profile.companies.find((company) => companyId(company) === job.id)!, startDate: job.startDate, endDate: job.endDate, isCurrent: job.endDate === "Present" })), new Date(2026, 9, 29)).totalMonths, 48);
  assert.equal(profile.companies[0]?.startDate, "Jan 2018");
  const noYearsJD = analyzeJD("Role: Cloud Engineer");
  const prompt = buildPrompt("Role: Cloud Engineer", noYearsJD, profile, [], new Date(2026, 9, 29));
  assert.match(prompt, /When no numeric experience duration appears in the JD, use the configured employment dates/);
  assert.match(prompt, /Match each JD requirement against each employer's recorded facts/);
  assert.match(prompt, /Every string inside the returned "resume" object is resume copy intended to appear on the page/);
  assert.match(prompt, /syntheticAchievementDraft/);
  const fourYearPrompt = buildPrompt("Role: Java Developer\nMinimum 4 years of experience", fourYearJD, profile, [], new Date(2026, 9, 29));
  assert.match(fourYearPrompt, /The supplied resumeTimeline represents exactly 4 years/);
  assert.match(fourYearPrompt, /Nov 2022/);
  assert.match(fourYearPrompt, /When resumeTimeline.dateSchedule contains a company, use that company's startDate and endDate exactly/);
  assert.doesNotMatch(fourYearPrompt, /Nov 2017/);
  assert.doesNotMatch(fourYearPrompt, /Proposed profile for a .* experience requirement/i);
  assert.match(fourYearPrompt, /Build a role-specific technical evidence map from the JD/);
  assert.match(fourYearPrompt, /These are proposed claims, not evidence/);
  assert.match(fourYearPrompt, /RECRUITER QUALITY PASS/);
  assert.match(fourYearPrompt, /Write 4–6 professional summary bullets/);
  assert.match(fourYearPrompt, /Populate each Environment list only with technologies actually recorded/);
});

test("draft generation is allowed when employers have metadata but no work facts", () => {
  const profile = emptyProfile("c2c");
  profile.companies = [{ id: "acme", companyName: "Acme", clientName: "", industry: "Technology", location: "Remote", jobTitle: "", startDate: "Jan 2020", endDate: "Present", isCurrent: true, technologies: [], responsibilities: [], projects: [] }];
  const analysis = analyzeJD("Role: Data Integration Developer\nRequired Skills\n- SQL\n- ETL");
  assert.equal(isDraftGenerationReady(analysis, profile), true);
  assert.equal(isDraftGenerationReady(null, profile), false);
  const prompt = buildPrompt("Role: Data Integration Developer\nRequired Skills\n- SQL\n- ETL", analysis, profile);
  assert.match(prompt, /If source work facts are sparse or absent, create technically specific, role-relevant draft options for candidate review/);
  assert.match(prompt, /Never turn a discussion, observation, or limited contribution into ownership or implementation/);
  assert.match(prompt, /When no numeric experience duration appears in the JD, use the configured employment dates/);
});

test("resume-strength estimate flags generic writing and scores a detailed role-specific draft", () => {
  const profile = emptyProfile("full-time");
  profile.companies = [{ id: "acme", companyName: "Acme", clientName: "", industry: "Technology", location: "Remote", jobTitle: "Developer", startDate: "Jan 2022", endDate: "Present", isCurrent: true, technologies: ["Java", "Spring Boot"], responsibilities: ["Built Java Spring Boot REST APIs."], projects: [{ id: "payments", name: "Payments API", industry: "Finance", clientName: "", context: "Payment processing service", technologies: ["Java", "Spring Boot"], responsibilities: ["Implemented REST endpoints and validation."] }] }];
  const analysis = analyzeJD("Role: Java Backend Developer\nRequired Skills\n- Java\n- Spring Boot\n- REST APIs");
  const generic = { ...validResume, experience: [{ id: "acme", company: "Acme", role: "Developer", location: "Remote", startDate: "Jan 2022", endDate: "Present", responsibilities: ["Participated in activities."], environment: ["Technology"] }] };
  const detailed: Resume = { ...validResume, professionalSummary: { bullets: ["Java backend engineer building Spring Boot APIs.", "Developed REST services for payment processing.", "Integrated relational data access with JPA.", "Debugged production API defects using structured logs."] }, technicalSkills: { categories: [{ name: "Backend", skills: ["Java", "Spring Boot", "REST APIs", "JPA"] }] }, experience: [{ id: "acme", company: "Acme", role: "Developer", location: "Remote", startDate: "Jan 2022", endDate: "Present", responsibilities: ["Built Java Spring Boot REST APIs with request validation and exception handling.", "Integrated JPA persistence for payment transaction data.", "Wrote JUnit tests for service and controller behavior."], environment: ["Java", "Spring Boot", "JPA", "JUnit"] }], projects: [{ id: "payments", name: "Payments API", description: "Payment processing service built with Spring Boot.", technologies: ["Java", "Spring Boot"], highlights: ["Implemented REST endpoints and request validation."] }] };
  const weakScore = evaluateResumeStrength(analysis, generic, profile)!;
  const strongScore = evaluateResumeStrength(analysis, detailed, profile)!;
  const noEvidenceProfile = structuredClone(profile);
  noEvidenceProfile.companies[0]!.technologies = [];
  noEvidenceProfile.companies[0]!.responsibilities = [];
  noEvidenceProfile.companies[0]!.projects = [];
  const keywordOnlyScore = evaluateResumeStrength(analysis, detailed, noEvidenceProfile)!;
  assert.ok(weakScore.findings.some((finding) => finding.includes("generic phrases")));
  assert.ok(strongScore.score > weakScore.score);
  assert.ok(strongScore.score > keywordOnlyScore.score, "JD keyword matches without employer evidence must be discounted");
  assert.equal(strongScore.dimensions.reduce((sum, item) => sum + item.weight, 0), 100);
});

test("universal prompt adapts its writing checklist to representative IT job families", () => {
  const cases = [
    ["Java Backend Developer", "Spring Boot REST API"],
    [".NET Developer", "Entity Framework Core"],
    ["Kafka Administrator", "consumer lag"],
    ["DevOps Engineer", "CI/CD pipeline"],
    ["Data Engineer", "ETL pipeline"],
    ["DataOps Engineer", "data quality"],
    ["Salesforce Developer", "Apex"],
    ["SAP Consultant", "SAP"],
    ["AWS Cloud Engineer", "AWS"],
    ["React Node.js Full Stack Developer", "React"],
  ];
  for (const [role, requirement] of cases) {
    const jd = `Role: ${role}\nRequired skills:\n- ${requirement}`;
    const analysis = analyzeJD(jd);
    const prompt = buildPrompt(jd, analysis, emptyProfile("full-time"));
    assert.ok(prompt.includes(role), `prompt lost target role ${role}`);
    assert.ok(prompt.includes(requirement), `prompt lost role requirement ${requirement}`);
    assert.match(prompt, /derive the equivalent hands-on dimensions from their actual requirements/);
    assert.match(prompt, /These are proposed claims, not evidence/);
  }
});

test("employment date review preserves entered dates and reports overlaps", () => {
  const companies = [
    { id: "one", companyName: "One", clientName: "", industry: "", location: "", jobTitle: "", startDate: "Jan 2020", endDate: "Present", isCurrent: true, technologies: [], responsibilities: [], projects: [] },
    { id: "two", companyName: "Two", clientName: "", industry: "", location: "", jobTitle: "", startDate: "Jan 2022", endDate: "Dec 2023", isCurrent: false, technologies: [], responsibilities: [], projects: [] },
  ];
  const review = reviewEmploymentDates(companies, new Date(2026, 9, 28));
  assert.deepEqual(review.overlaps, ["One overlaps Two"]);
  assert.equal(companies[0]?.startDate, "Jan 2020");
  assert.equal(companies[0]?.endDate, "Present");
  assert.equal(review.totalMonths, 82);
});

test("draft experience claims stay out of final resume until approved", () => {
  const profile = emptyProfile("full-time");
  profile.companies = [{ id: "bank", companyName: "Bank Co", clientName: "", industry: "Banking", location: "Chicago", jobTitle: "", startDate: "Jan 2012", endDate: "Dec 2020", isCurrent: false, technologies: ["Kafka"], responsibilities: ["Configured Kafka clusters."], projects: [] }];
  const draft: Resume = {
    ...validResume,
    personalInfo: { ...validResume.personalInfo, fullName: "Taylor Candidate", professionalTitle: "Banking Platform Engineer" },
    professionalSummary: { bullets: ["Built a banking event platform."] },
    technicalSkills: { categories: [{ name: "Platforms", skills: ["Kafka"] }] },
    experience: [{ id: "bank", company: "Bank Co", role: "Banking Platform Engineer", location: "Chicago", startDate: "Nov 2018", endDate: "Present", description: "Proposed event-streaming platform work.", projectName: "Banking Platform", responsibilities: ["Configured Kafka clusters."], environment: ["Kafka"] }],
  };
  const claims = claimsFromResume(draft, profile, new Set());
  assert.ok(claims.every((claim) => claim.status === "needs-confirmation"));
  const approved = claims.map((claim) => ({ ...claim, status: "confirmed" as const }));
  const final = finalizeResume(draft, approved, profile);
  assert.equal(final.experience[0]?.startDate, "Nov 2018");
  assert.equal(final.experience[0]?.responsibilities[0], "Configured Kafka clusters.");
  const pendingFinal = finalizeResume(draft, claims, profile);
  assert.equal(pendingFinal.experience.length, 0);
  assert.deepEqual(pendingFinal.professionalSummary.bullets, []);
  const partialDateApproval = claims.map((claim) => ({ ...claim, status: claim.path === "experience.0.role" ? "confirmed" as const : claim.path === "experience.0.startDate" ? "confirmed" as const : "rejected" as const }));
  const safeDateFallback = finalizeResume(draft, partialDateApproval, profile);
  assert.equal(safeDateFallback.experience[0]?.startDate, "Jan 2012");
  assert.equal(safeDateFallback.experience[0]?.endDate, "Dec 2020");
});

test("unchanged configured employer titles and dates remain source-confirmed", () => {
  const profile = emptyProfile("full-time");
  profile.companies = [{ id: "source-role", companyName: "Source Co", clientName: "", industry: "", location: "Remote", jobTitle: "Software Engineer", startDate: "Jan 2020", endDate: "Present", isCurrent: true, technologies: [], responsibilities: [], projects: [] }];
  const draft: Resume = { ...validResume, experience: [{ id: "source-role", company: "Source Co", role: "Software Engineer", location: "Remote", startDate: "Jan 2020", endDate: "Present", responsibilities: [], environment: [] }] };
  const claims = claimsFromResume(draft, profile, new Set());
  assert.equal(claims.find((claim) => claim.path === "experience.0.startDate")?.status, "confirmed");
  assert.equal(claims.find((claim) => claim.path === "experience.0.endDate")?.status, "confirmed");
  assert.equal(claims.find((claim) => claim.path === "experience.0.role")?.status, "confirmed");
});

test("fixed-format DOCX export embeds selected certification badge artwork", async () => {
  const profile = profileSchema.parse(fullTimeSeed);
  const badge = `data:image/png;base64,${readFileSync("public/certification-badges/aws-solutions-architect-associate.png").toString("base64")}`;
  profile.certifications.push({ id: "aws-saa", name: "AWS Certified Solutions Architect – Associate", issuer: "AWS", logo: badge, logoSize: 72, visible: true });
  const resume: Resume = { ...validResume, certifications: [{ id: "aws-saa", name: "AWS Certified Solutions Architect – Associate", issuer: "AWS" }] };
  const docx = await createResumeDocx(resume, profile);
  assert.ok(docx.size > 20_000);
});
