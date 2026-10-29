import test from "node:test";
import assert from "node:assert/strict";
import { inflateRawSync } from "node:zlib";
import { jsPDF } from "jspdf";
import { analyzeJD } from "@/lib/jd";
import { buildPrompt } from "@/lib/prompt";
import { resumeSchema } from "@/lib/contracts";
import { emptyProfile, type Resume } from "@/types/resume";
import { createResumeDocx } from "@/lib/docx-export";
import { buildResumePrintBlocks } from "@/lib/resume-print";
import {
  achievementCoverage,
  applyAchievementStatement,
  buildMetricOpportunities,
  calculatePercentChange,
  composeAchievementBullet,
  evidenceForAchievement,
  findPerformanceMeasurements,
  findUnsupportedMetricClaims,
  isEvidenceReady,
  mergeMetricOpportunities,
  repeatedMetricFindings,
  type AchievementEvidence,
} from "@/lib/achievements";

function makeResume(bullets: string[] = ["Optimized PostgreSQL query execution time."]): Resume {
  return {
    personalInfo: { fullName: "Taylor Example", professionalTitle: "Data Engineer", email: "taylor@example.com", phone: "555-0100", location: "" },
    professionalSummary: { bullets: ["Data Engineer with relevant experience."] },
    technicalSkills: { categories: [{ name: "Data", skills: ["SQL"] }] },
    experience: [{ id: "acme", company: "Acme", role: "Data Engineer", location: "Remote", startDate: "Jan 2024", endDate: "Present", responsibilities: bullets, environment: ["PostgreSQL"] }],
    projects: [], education: [], certifications: [],
  };
}

function evidenceFor(bullet: string, patch: Partial<AchievementEvidence> = {}): AchievementEvidence {
  return {
    id: "metric-acme-1", employerId: "acme", employer: "Acme", resumePath: "experience.0.responsibilities.0", originalBullet: bullet,
    resumeTextSnapshot: bullet, metricType: "query execution time", direction: "decrease", resultValue: "35", resultUnit: "%",
    beforeValue: "800", afterValue: "520", measurementUnit: "ms", measurementPeriod: "Q2 2025", source: "PostgreSQL query performance report", status: "verified", ...patch,
  };
}

function javaBackendResume17(): Resume {
  const fidelity = [
    "Developed Java 17 and Spring Boot microservices for financial application workflows, implementing RESTful endpoints, service-layer business logic, and request validation.",
    "Designed REST API contracts for backend service integrations, defining request and response models, HTTP status handling, and consistent application error responses.",
    "Implemented PostgreSQL persistence operations for transactional application data, developing SQL queries and repository methods for record retrieval and updates.",
    "Integrated Apache Kafka messaging with Spring Boot services, implementing producer and consumer logic for asynchronous application workflows.",
    "Developed Google Cloud Pub/Sub publisher and subscriber integration components to support event-driven communication between cloud-hosted services.",
    "Configured backend applications for Google Cloud Platform deployment, managing environment-specific application properties and external service connectivity.",
    "Containerized Java applications using Docker, creating runtime configurations and packaging executable application artifacts into container images.",
    "Implemented GitHub Actions CI/CD workflows for Java application builds, automated test execution, and Docker image packaging.",
    "Developed Python data-processing routines for structured data validation and SQL-based extraction, preparing datasets for analytical queries in BigQuery.",
    "Investigated backend application failures using Java exception traces, API responses, PostgreSQL queries, and Kafka message-processing behavior to isolate integration and application defects.",
  ];
  const pineLabs = [
    "Developed Java 11 and Spring Boot backend services for financial technology applications, implementing RESTful endpoints and business logic for transaction-related workflows.",
    "Implemented request validation and exception-handling logic for transaction APIs, processing invalid payloads and downstream service error conditions.",
    "Developed PostgreSQL queries and persistence-layer methods for transaction records, implementing filtering, pagination, and database update operations.",
    "Built backend integration components for communication between application services, handling request mapping, response processing, and service-level error conditions.",
    "Implemented Apache Kafka producer and consumer components to support asynchronous processing of transaction-related application events.",
    "Created Java unit tests for service-layer business rules and API validation, covering successful execution, invalid inputs, and exception scenarios.",
    "Debugged backend application defects by tracing Java execution paths, reviewing SQL queries, and analyzing application logs to identify processing and database integration issues.",
  ];
  const job = (id: string, company: string, location: string, startDate: string, endDate: string, responsibilities: string[]) => ({ id, company, role: "Java Backend Developer", location, startDate, endDate, responsibilities, environment: [] });
  return { ...makeResume(), experience: [job("fidelity-investments", "Fidelity Investments", "Westlake, Texas, USA (Remote)", "Nov 2024", "Present", fidelity), job("pine-labs", "Pine Labs", "Bengaluru, Karnataka, India", "Nov 2022", "Oct 2024", pineLabs)] };
}

function readZipEntry(file: Buffer, requestedPath: string) {
  for (let position = 0; position < file.length - 46; position++) {
    if (file.readUInt32LE(position) !== 0x02014b50) continue;
    const method = file.readUInt16LE(position + 10);
    const compressedSize = file.readUInt32LE(position + 20);
    const nameLength = file.readUInt16LE(position + 28);
    const extraLength = file.readUInt16LE(position + 30);
    const commentLength = file.readUInt16LE(position + 32);
    const localOffset = file.readUInt32LE(position + 42);
    const name = file.toString("utf8", position + 46, position + 46 + nameLength);
    if (name === requestedPath) {
      const localNameLength = file.readUInt16LE(localOffset + 26);
      const localExtraLength = file.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = file.subarray(dataStart, dataStart + compressedSize);
      return method === 0 ? compressed.toString("utf8") : inflateRawSync(compressed).toString("utf8");
    }
    position += 46 + nameLength + extraLength + commentLength - 1;
  }
  return "";
}

test("calculates latency reduction and throughput increase with correct direction and rounding", () => {
  const latency = calculatePercentChange({ before: "800", after: "520", beforeUnit: "ms", direction: "decrease" });
  assert.deepEqual(latency, { ok: true, result: { value: 35, unit: "%", trend: "decrease", favorable: true } });
  const throughput = calculatePercentChange({ before: 1000, after: 1400, beforeUnit: "requests/sec", direction: "increase" });
  assert.deepEqual(throughput, { ok: true, result: { value: 40, unit: "%", trend: "increase", favorable: true } });
  const fractional = calculatePercentChange({ before: 3, after: 2, beforeUnit: "widgets", direction: "decrease" });
  assert.equal(fractional.ok && fractional.result.value, 33.3);
  assert.equal(fractional.ok && fractional.result.favorable, true);
});

test("calculates CI/CD preparation time reduction from before-and-after measurements", () => {
  const result = calculatePercentChange({ before: "90", after: "54", beforeUnit: "minutes", afterUnit: "minutes", direction: "decrease" });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.result.value, 40);
    assert.equal(result.result.trend, "decrease");
    assert.equal(result.result.favorable, true);
  }
});

test("rejects missing, zero, negative, incompatible, and directionally worsening baselines", () => {
  assert.deepEqual(calculatePercentChange({ before: "", after: 1, beforeUnit: "ms", direction: "decrease" }), { ok: false, error: "invalid-number" });
  assert.deepEqual(calculatePercentChange({ before: 0, after: 1, beforeUnit: "ms", direction: "decrease" }), { ok: false, error: "zero-baseline" });
  assert.deepEqual(calculatePercentChange({ before: -2, after: 1, beforeUnit: "ms", direction: "increase" }), { ok: false, error: "negative-value" });
  assert.deepEqual(calculatePercentChange({ before: 1, after: 2, beforeUnit: "ms", afterUnit: "seconds", direction: "decrease" }), { ok: false, error: "unit-mismatch" });
  const worseLatency = calculatePercentChange({ before: 100, after: 120, beforeUnit: "ms", direction: "decrease" });
  assert.equal(worseLatency.ok && worseLatency.result.favorable, false);
});

test("preserves explicitly supplied custom units and scans measurable achievement claims without treating language versions as metrics", () => {
  const customUnit = calculatePercentChange({ before: 20, after: 15, beforeUnit: "records-batch", direction: "decrease" });
  assert.equal(customUnit.ok && customUnit.result.value, 25);
  assert.deepEqual(findPerformanceMeasurements("Built Java 17 services and reduced API latency by 35% from 800 ms to 520 ms." ).map((item) => [item.value, item.unit]), [[35, "%"], [800, "ms"], [520, "ms"]]);
  assert.deepEqual(findPerformanceMeasurements("Implemented Java 17 and Spring Boot 3 services."), []);
});

test("builds role-aware opportunities and retains confirmed evidence only for unchanged employer bullets", () => {
  const resume = makeResume(["Reviewed API behavior.", "Monitored Kafka consumer lag."]);
  resume.experience[0]!.responsibilities[1] = "Monitored Kafka consumer lag.";
  const kafka = analyzeJD("Role: Kafka Platform Engineer\nRequired skills: Kafka, consumer lag\nResponsibilities: Improve streaming reliability");
  const opportunities = buildMetricOpportunities(resume, kafka);
  assert.match(opportunities[0]!.metricType, /consumer lag|API response time|Kafka message throughput/i);
  assert.match(opportunities[1]!.metricType, /Kafka consumer lag/i);
  const initial = mergeMetricOpportunities([], resume, kafka);
  const confirmed = { ...initial[0]!, status: "verified" as const, resultValue: "12", resultUnit: "%", source: "Monitoring report", measurementPeriod: "June 2025" };
  const retained = mergeMetricOpportunities([confirmed], resume, kafka);
  assert.equal(retained.find((item) => item.id === confirmed.id)?.status, "verified");
  const revised = makeResume(["Reviewed a new API workflow."]);
  const afterRevision = mergeMetricOpportunities(retained, revised, kafka);
  assert.equal(afterRevision.some((item) => item.id === confirmed.id && item.status === "verified"), true, "historical confirmed evidence is retained separately");
  assert.equal(afterRevision.find((item) => item.id !== confirmed.id)?.status, "suggested");
});

test("suggests role-relevant measurements across software, Kafka, DevOps, data, cloud, frontend, QA, and enterprise platforms", () => {
  const cases = [
    ["Java Backend Developer", "Improved REST API response time", "API response time"],
    ["Kafka Administrator", "Reduced Kafka consumer lag", "Kafka consumer lag"],
    ["SRE Engineer", "Resolved production incidents", "incident resolution time"],
    ["DevOps Engineer", "Automated CI/CD deployment workflows", "deployment or build time"],
    ["Data Engineer", "Optimized ETL pipeline runtime", "data pipeline runtime or data processing"],
    ["Python Data Engineer", "Built Python ETL pipelines", "data processing or query runtime"],
    [".NET Backend Developer", "Built ASP.NET Core REST APIs", "API response time"],
    ["Cloud Engineer", "Reduced cloud operating cost", "cloud operating cost"],
    ["Frontend Engineer", "Improved page load performance", "page load or render time"],
    ["QA Automation Engineer", "Reduced regression testing time", "automated test execution time"],
    ["Salesforce Developer", "Automated Salesforce workflows", "workflow processing time"],
    ["SAP Developer", "Automated SAP workflows", "workflow processing time"],
  ];
  for (const [role, responsibility, expected] of cases) {
    const resume = makeResume([responsibility]);
    const jd = `Role: ${role}\nResponsibilities: ${responsibility}`;
    const metric = buildMetricOpportunities(resume, analyzeJD(jd))[0]!;
    assert.match(metric.metricType.toLocaleLowerCase(), new RegExp(expected.toLocaleLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(" or ", "|")));
    assert.equal(metric.hasExistingNumber, false);
    assert.match(metric.question, /Can you document|What source supports/);
  }
});

test("Java Backend test resume with 10 Fidelity and 7 Pine Labs bullets shows specific metric gaps without inventing results", () => {
  const resume = javaBackendResume17();
  const analysis = analyzeJD("Role: Java Backend Developer\nRequired Skills: Java, Spring Boot, PostgreSQL, Kafka, GitHub Actions, Python, BigQuery\nResponsibilities: Build APIs, process data, and maintain production services.");
  const coverage = achievementCoverage(resume, [], analysis);
  assert.equal(coverage.totalExperienceBullets, 17);
  assert.equal(coverage.quantifiedAchievementCount, 0);
  assert.equal(coverage.verifiedAchievementCount, 0);
  assert.equal(coverage.estimatedAchievementCount, 0);
  assert.equal(coverage.unsupportedNumericalClaims, 0);
  assert.equal(coverage.zeroQuantifiedAchievements, true);
  assert.deepEqual(coverage.employers.map(({ employer, totalExperienceBullets, quantifiedAchievementCount, verifiedAchievementCount }) => ({ employer, totalExperienceBullets, quantifiedAchievementCount, verifiedAchievementCount })), [
    { employer: "Fidelity Investments", totalExperienceBullets: 10, quantifiedAchievementCount: 0, verifiedAchievementCount: 0 },
    { employer: "Pine Labs", totalExperienceBullets: 7, quantifiedAchievementCount: 0, verifiedAchievementCount: 0 },
  ]);
  assert.ok(coverage.employers.every((employer) => employer.missingMetricOpportunities > 0));
  assert.equal(coverage.employers.reduce((total, employer) => total + employer.missingMetricOpportunities, 0), coverage.missingMetricOpportunities);
  const opportunities = buildMetricOpportunities(resume, analysis);
  assert.equal(coverage.missingMetricOpportunities, opportunities.length);
  assert.ok(opportunities.length > 0 && opportunities.length < 17, "metric questions are limited to directly measurable responsibilities");
  assert.equal(new Set(opportunities.map((item) => `${item.employerId}|${item.metricType}`)).size, opportunities.length, "only one best-matching opportunity per employer and metric is shown");
  const namedOpportunities = opportunities.map((item) => item.metricType).join(" | ");
  assert.match(namedOpportunities, /API response time/i);
  assert.match(namedOpportunities, /database query execution time/i);
  assert.match(namedOpportunities, /Kafka message throughput/i);
  assert.match(namedOpportunities, /deployment or build time/i);
  assert.match(namedOpportunities, /BigQuery query execution time/i);
  assert.equal(resume.experience.flatMap((job) => job.responsibilities).some((bullet) => /\d\s*%/.test(bullet)), false);
});

test("a candidate-verified metric applies to the matching employer bullet and passes the unchanged resume contract", () => {
  const resume = makeResume(["Optimized PostgreSQL queries for backend data retrieval."]);
  const analysis = analyzeJD("Role: Java Backend Developer\nRequired skills: PostgreSQL, Spring Boot\nResponsibilities: Optimize backend query performance.");
  const opportunity = buildMetricOpportunities(resume, analysis)[0]!;
  const evidence: AchievementEvidence = {
    ...opportunity, resultValue: "", resultUnit: "%", beforeValue: "800", afterValue: "520", measurementUnit: "ms",
    measurementPeriod: "Q2 2025", source: "PostgreSQL query performance report", status: "verified",
  };
  const statement = composeAchievementBullet(evidence, evidenceForAchievement(evidence));
  const updated = applyAchievementStatement(resume, evidence, statement);
  assert.ok(updated);
  assert.match(updated.experience[0]!.responsibilities[0]!, /reducing database query execution time by 35%/);
  const confirmedEvidence = { ...evidence, resumeTextSnapshot: statement };
  assert.equal(findUnsupportedMetricClaims(updated, [confirmedEvidence]).length, 0);
  assert.equal(achievementCoverage(updated, [confirmedEvidence], analysis).verifiedAchievementCount, 1);
  assert.equal(resumeSchema.safeParse(updated).success, true);
  assert.equal(Object.hasOwn(updated, "achievementEvidence"), false);
});

test("confirmed achievement bullets survive the DOCX and PDF export content paths", async () => {
  const resume = makeResume(["Optimized PostgreSQL queries, reducing database query execution time by 35% (from 800 ms to 520 ms) over Q2 2025."]);
  const achievement = resume.experience[0]!.responsibilities[0]!;
  const docx = await createResumeDocx(resume, emptyProfile("full-time"));
  const documentXml = readZipEntry(Buffer.from(await docx.arrayBuffer()), "word/document.xml");
  assert.match(documentXml, /reducing database query execution time by 35%/);

  const pdf = new jsPDF({ unit: "pt", format: "letter" });
  let y = 48;
  for (const block of buildResumePrintBlocks(resume)) {
    if (!block.text || block.kind === "space") continue;
    pdf.text(block.text, 44, y);
    y += 14;
    if (y > 720) { pdf.addPage(); y = 48; }
  }
  const pdfText = pdf.output();
  assert.match(pdfText, /reducing database query execution time by 35%/);
  assert.match(pdfText, /from 800 ms to 520 ms/);
  assert.match(achievement, /35%/);
});

test("requires candidate status, a numeric value, period, and measurement source before evidence is ready", () => {
  const bullet = "Built a Java API.";
  const base = evidenceFor(bullet, { status: "suggested", beforeValue: "", afterValue: "", measurementUnit: "", resultValue: "35" });
  assert.equal(isEvidenceReady(base), false);
  assert.equal(isEvidenceReady({ ...base, status: "verified", source: "", measurementPeriod: "Q2 2025" }), false);
  assert.equal(isEvidenceReady({ ...base, status: "candidate-estimated", source: "Release report", measurementPeriod: "Q2 2025" }), true);
});

test("appends calculated achievements naturally and marks candidate estimates as approximate", () => {
  const bullet = "Optimized PostgreSQL queries for backend data retrieval";
  const metric = evidenceFor(bullet, { status: "candidate-estimated", metricType: "query execution time" });
  const measured = evidenceForAchievement(metric);
  assert.equal(measured.resultValue, "35");
  assert.equal(composeAchievementBullet(metric, measured), "Optimized PostgreSQL queries for backend data retrieval, reducing query execution time by approximately 35% (from 800 ms to 520 ms) over Q2 2025.");
});

test("unsupported numeric claims are gated, candidate evidence supports only its matching employer statement, and repeated values are flagged", () => {
  const bullet = "Optimized query execution time by 35% (from 800 ms to 520 ms) over Q2 2025.";
  const resume = makeResume([bullet]);
  assert.equal(findUnsupportedMetricClaims(resume, []).length, 1);
  assert.equal(findUnsupportedMetricClaims(resume, [evidenceFor(bullet)]).length, 0);
  assert.equal(findUnsupportedMetricClaims(resume, [evidenceFor(bullet, { employerId: "other-company" })]).length, 1);
  const repeated = makeResume(["Reduced API response time by 35%."]);
  repeated.experience.push({ ...repeated.experience[0]!, id: "other", company: "Other", responsibilities: ["Reduced API response time by 35%."] });
  assert.equal(repeatedMetricFindings(repeated).length, 1);
  const sameEmployerRepeat = makeResume(["Reduced API response time by 35%.", "Improved endpoint latency by 35%."]);
  assert.equal(repeatedMetricFindings(sameEmployerRepeat).length, 1);
});

test("achievement evidence feeds the universal prompt only when candidate-attested and leaves the resume JSON schema unchanged", () => {
  const profile = emptyProfile("full-time");
  profile.companies = [{ id: "acme", companyName: "Acme", clientName: "", industry: "Technology", location: "Remote", jobTitle: "Data Engineer", startDate: "Jan 2024", endDate: "Present", isCurrent: true, technologies: ["PostgreSQL"], responsibilities: ["Optimized database query execution."], projects: [] }];
  const jd = "Role: Data Engineer\nRequired skills: PostgreSQL\nResponsibilities: Optimize query performance";
  const analysis = analyzeJD(jd);
  const resume = makeResume();
  const metric = evidenceFor(resume.experience[0]!.responsibilities[0]!);
  const prompt = buildPrompt(jd, analysis, profile, [], new Date(2026, 9, 29), [metric, { ...metric, id: "suggested", status: "suggested" }]);
  assert.match(prompt, /QUANTIFIED ACHIEVEMENTS/);
  assert.match(prompt, /incorporate each supported result into the closest relevant responsibility/);
  assert.match(prompt, /confirmedAchievementEvidence/);
  assert.equal((prompt.match(/PostgreSQL query performance report/g) ?? []).length, 1);
  assert.equal(resumeSchema.safeParse(resume).success, true);
  assert.equal(Object.hasOwn(resume, "achievementEvidence"), false);
});
