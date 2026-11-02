import test from "node:test";
import assert from "node:assert/strict";
import { analyzeJD } from "../src/lib/jd";
import { buildPrompt } from "../src/lib/prompt";
import { buildDraftPlan, profileEvidence, candidateKey, migrateLegacyEvidence } from "../src/lib/work-evidence";
import { analyzeCoverage } from "../src/lib/jd-coverage";
import { matchRequirement } from "../src/lib/requirement-match";
import { reviewResume, confirmStatement, assertApplicationReady } from "../src/lib/resume-review";
import { separateSyntheticAchievements, type AchievementEvidence } from "../src/lib/achievements";
import { emptyProfile, type Resume } from "../src/types/resume";
import { reviewEmploymentDates } from "../src/lib/timeline";

function fixture() {
  const profile = emptyProfile("c2c");
  profile.personalInfo = { fullName: "Test Candidate", email: "test@example.com", phone: "123", location: "Remote" };
  profile.companies = [{ id: "one", companyName: "Example", clientName: "", industry: "Healthcare", location: "Remote", jobTitle: "Platform Engineer", startDate: "Jan 2020", endDate: "Dec 2023", isCurrent: false, technologies: ["Kafka"], responsibilities: ["Administered Kafka brokers and configured partitions."], projects: [] }];
  const resume: Resume = { personalInfo: { ...profile.personalInfo, professionalTitle: "Salesforce Developer" }, professionalSummary: { bullets: ["Implemented Salesforce workflows."] }, technicalSkills: { categories: [{ name: "Skills", skills: ["Salesforce"] }] }, experience: [{ id: "one", company: "Example", location: "Remote", role: "Platform Engineer", startDate: "Jan 2020", endDate: "Dec 2023", responsibilities: ["Implemented Salesforce workflows."], environment: ["Salesforce"] }], projects: [], education: [], certifications: [] };
  return { profile, resume };
}

const jobs = [
  ["Salesforce Developer", "Salesforce, Apex, LWC", "Implement Salesforce workflows"],
  ["Java Full-Stack Engineer", "Java, Spring Boot, React", "Build Spring Boot REST APIs"],
  [".NET Developer", "C#, .NET, Entity Framework", "Build .NET REST APIs"],
  ["Python Backend Developer", "Python, FastAPI, PostgreSQL", "Develop Python REST APIs"],
  ["SAP Consultant", "SAP, ABAP", "Configure SAP modules"],
  ["Azure DevOps Engineer", "Azure, Terraform", "Deploy Azure infrastructure"],
  ["AWS Cloud Engineer", "AWS, CloudFormation", "Deploy AWS infrastructure"],
  ["Kafka Administrator", "Kafka, Confluent", "Administer Kafka brokers"],
  ["React Frontend Developer", "React, TypeScript", "Build React interfaces"],
  ["Data Engineer", "SQL, Spark", "Build Spark pipelines"],
  ["Accountant", "Bookkeeping, Reconciliation", "Prepare financial statements"],
];
for (const [role, tools, duty] of jobs) test(`universal draft plan: ${role}`, () => {
  const { profile } = fixture();
  const jd = `Job Title: ${role}\nRequired skills: ${tools}\nPreferred skills:\nCommunication\nResponsibilities\n${duty}\nMinimum 5 years experience`;
  const analysis = analyzeJD(jd);
  assert.equal(analysis.targetRole, role);
  const plan = buildDraftPlan(profile, analysis);
  assert.ok(plan[0].unconfirmedDraftBriefs.some(brief => brief.requirement.includes(tools.split(", ").at(-1)!)));
  assert.ok(plan[0].unconfirmedDraftBriefs.every(brief => brief.status === "unconfirmed"));
  assert.equal(plan[0].officialTitle, "Platform Engineer");
  if (!role.includes("Kafka")) assert.equal(plan[0].relevantVerifiedEvidence.length, 0);
  const prompt = buildPrompt(jd, analysis, profile);
  assert.ok(prompt.includes(duty));
  assert.ok(prompt.includes('"startDate": "Jan 2020"'));
  assert.ok(prompt.includes('"endDate": "Dec 2023"'));
  assert.ok(!prompt.includes("proposedStartDate"));
  if (!role.includes("Kafka")) assert.ok(!prompt.includes("Administered Kafka brokers and configured partitions."));
});

test("matching requires the whole task; synonyms do not create unrelated platform experience", () => {
  assert.ok(matchRequirement("Build PostgreSQL queries", "Developed Postgres queries").supported);
  assert.ok(!matchRequirement("Build Salesforce integrations", "Built Kafka integrations").supported);
  assert.ok(!matchRequirement("Salesforce", "No Salesforce experience").supported);
  assert.ok(!matchRequirement("Kafka cluster administration", "Built Kafka producers").supported);
});

test("source confirmations retain provenance and survive switching unrelated JDs", () => {
  const { profile } = fixture();
  const memory = { "c2c|responsibility|one|administered kafka brokers": "Administered Kafka brokers" };
  const migrated = migrateLegacyEvidence(profile, memory);
  assert.equal(migrated[0].status, "confirmed");
  assert.equal(migrated[0].source.kind, "legacy-confirmation");
  assert.equal(migrated[0].candidateKey, "legacy-unassigned:c2c");
  assert.equal(buildDraftPlan(profile, analyzeJD("Role: Salesforce Developer\nRequired: Salesforce"), migrated)[0].relevantVerifiedEvidence.length, 0);
  assert.ok(buildDraftPlan(profile, analyzeJD("Role: Kafka Administrator\nRequired: Kafka"), migrated.map(record => ({ ...record, candidateKey: candidateKey(profile.personalInfo) })))[0].relevantVerifiedEvidence.length > 0);
  assert.equal(migrated.length, 1);
});

test("coverage distinguishes visible JD terms from employer-supported experience", () => {
  const { profile, resume } = fixture();
  const report = analyzeCoverage(analyzeJD("Role: Salesforce Developer\nRequired: Salesforce, Apex"), resume, profile);
  assert.equal(report.titleAligned, true);
  assert.ok((report.keywordCoverage ?? 0) > 0);
  assert.equal(report.verifiedCoverage, 0);
  assert.equal(report.missingQualifications.length, 2);
  assert.ok(report.employerEvidence[0].unsupportedResponsibilities.length > 0);
});

test("dates and official title cannot be overridden by claim confirmation", () => {
  const { profile, resume } = fixture();
  resume.experience[0].startDate = "Jan 2010";
  resume.experience[0].role = "Salesforce Developer";
  const review = reviewResume(resume, profile, []);
  assert.equal(review.conflicts.length, 2);
  for (const item of review.conflicts) assert.throws(() => confirmStatement(item, resume, "jd"));
  assert.equal(profile.companies[0].startDate, "Jan 2020");
});

test("unconfirmed text cannot be exported; exact individual confirmations allow export and edits revoke it", () => {
  const { profile, resume } = fixture();
  assert.throws(() => assertApplicationReady(resume, profile, [], []));
  const approvals = reviewResume(resume, profile, []).pending.map(item => confirmStatement(item, resume, "Salesforce JD"));
  assert.doesNotThrow(() => assertApplicationReady(resume, profile, approvals, []));
  assert.ok(approvals.every(item => item.source.originatingJD === "Salesforce JD" && item.source.confirmedAt));
  resume.experience[0].responsibilities[0] += " and Apex integrations";
  assert.throws(() => assertApplicationReady(resume, profile, approvals, []));
});

test("synthetic percentages remain outside factual content and general confirmation never verifies numbers", () => {
  const { profile, resume } = fixture();
  resume.experience[0].responsibilities = ["[SYNTHETIC EXAMPLE] Reduced Salesforce processing time by 30%. [QUALITATIVE] Implemented Salesforce workflows."];
  const separated = separateSyntheticAchievements(resume);
  assert.equal(separated.synthetic.examples.length, 1);
  assert.ok(!JSON.stringify(separated.resume).includes("30%"));
  resume.experience[0].responsibilities = ["Reduced Salesforce processing time by 30%."];
  const review = reviewResume(resume, profile, []);
  const claim = review.pending.find(item => item.numeric)!;
  assert.ok(claim);
  assert.throws(() => confirmStatement(claim, resume, "jd"));
  const evidence: AchievementEvidence = { id: "measurement", employerId: "one", employer: "Example", resumePath: claim.path, originalBullet: claim.text, resumeTextSnapshot: claim.text, metricType: "processing time", direction: "decrease", resultValue: "30", resultUnit: "%", beforeValue: "", afterValue: "", measurementUnit: "", measurementPeriod: "Q1 2023", source: "Documented benchmark", status: "verified" };
  assert.equal(reviewResume(resume, profile, [], [evidence]).unsupportedNumbers.length, 0);
  assert.ok(reviewResume(resume, profile, [], [{ ...evidence, status: "suggested" }]).unsupportedNumbers.length > 0);
});

test("actual employment overlap is counted once and experience gaps are reported", () => {
  const { profile } = fixture();
  profile.companies.push({ ...profile.companies[0], id: "two", companyName: "Second", startDate: "Jan 2022", endDate: "Dec 2024" });
  assert.equal(reviewEmploymentDates(profile.companies).totalMonths, 60);
  const coverage = analyzeCoverage(analyzeJD("Role: Engineer\nMinimum 8 years experience"), null, profile);
  assert.equal(coverage.experienceGapYears, 3);
});

test("another candidate can import without inheriting the active candidate's confirmations", () => {
  const { profile, resume } = fixture();
  const approvals = reviewResume(resume, profile, []).pending.map(item => confirmStatement(item, resume, "jd"));
  resume.personalInfo.fullName = "Another Person";
  assert.throws(() => assertApplicationReady(resume, profile, approvals, []));
  assert.ok(reviewResume(resume, profile, approvals).pending.some(item => item.section === "identity"));
  assert.ok(profileEvidence(profile).every(record => record.source.kind === "company-settings"));
});

test("a confirmed headline or global summary cannot establish employer experience", () => {
  const { profile, resume } = fixture();
  const approvals = reviewResume(resume, profile, []).pending.filter(item => item.employerId === "global").map(item => confirmStatement(item, resume, "jd"));
  const report = analyzeCoverage(analyzeJD("Role: Salesforce Developer\nRequired: Salesforce"), resume, profile, approvals);
  assert.equal(report.verifiedCoverage, 0);
});

test("a badge catalog entry is not a verified certification", () => {
  const { profile, resume } = fixture();
  profile.certifications = [{ id: "cloud", name: "Cloud Certified", visible: true }];
  resume.certifications = [{ id: "cloud", name: "Cloud Certified" }];
  assert.ok(reviewResume(resume, profile, []).pending.some(item => item.section === "certifications"));
  profile.certifications[0].verificationStatus = "confirmed";
  assert.ok(!reviewResume(resume, profile, []).pending.some(item => item.section === "certifications"));
});
