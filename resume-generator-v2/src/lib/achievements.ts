import type { JDAnalysis, Resume } from "@/types/resume";

export type MetricReviewStatus = "suggested" | "verified" | "candidate-estimated" | "rejected";
export type MetricDirection = "decrease" | "increase";

/** Kept in browser review state, never added to Resume JSON. */
export type AchievementEvidence = {
  id: string;
  employerId: string;
  employer: string;
  resumePath: string;
  originalBullet: string;
  resumeTextSnapshot?: string;
  proposedStatement?: string;
  metricType: string;
  direction: MetricDirection;
  resultValue: string;
  resultUnit: string;
  beforeValue: string;
  afterValue: string;
  measurementUnit: string;
  measurementPeriod: string;
  source: string;
  status: MetricReviewStatus;
};

export type MetricOpportunity = Pick<AchievementEvidence, "id" | "employerId" | "employer" | "resumePath" | "originalBullet" | "metricType" | "direction"> & {
  hasExistingNumber: boolean;
  question: string;
};

export type MetricCalculation = {
  value: number;
  unit: "%";
  trend: "increase" | "decrease" | "unchanged";
  favorable: boolean;
};

export type MetricCalculationError = "invalid-number" | "zero-baseline" | "negative-value" | "unit-mismatch" | "missing-unit";
export type AchievementCoverage = {
  totalExperienceBullets: number;
  quantifiedAchievementCount: number;
  verifiedAchievementCount: number;
  estimatedAchievementCount: number;
  missingMetricOpportunities: number;
  unsupportedNumericalClaims: number;
  zeroQuantifiedAchievements: boolean;
  employers: {
    employerId: string;
    employer: string;
    totalExperienceBullets: number;
    quantifiedAchievementCount: number;
    verifiedAchievementCount: number;
    estimatedAchievementCount: number;
    missingMetricOpportunities: number;
    unsupportedNumericalClaims: number;
  }[];
};

const metricNumber = String.raw`\d[\d,]*(?:\.\d+)?`;

function norm(value: string) { return value.toLocaleLowerCase().replace(/[^a-z0-9%$/.]+/g, " ").replace(/\s+/g, " ").trim(); }
function normalizeUnit(value: string) {
  const cleaned = norm(value);
  if (["percent", "percentage", "%"].includes(cleaned)) return "%";
  if (["millisecond", "milliseconds", "msec", "msecs"].includes(cleaned)) return "ms";
  if (["second", "seconds", "sec", "secs"].includes(cleaned)) return "s";
  if (["minute", "minutes", "min", "mins"].includes(cleaned)) return "min";
  if (["hour", "hours", "hr", "hrs"].includes(cleaned)) return "h";
  if (["kilobyte", "kilobytes"].includes(cleaned)) return "kb";
  if (["megabyte", "megabytes"].includes(cleaned)) return "mb";
  if (["gigabyte", "gigabytes"].includes(cleaned)) return "gb";
  if (["terabyte", "terabytes"].includes(cleaned)) return "tb";
  return cleaned;
}
function numberToken(value: string) { return Number(value.replace(/[$,%\s,]/g, "")); }
function roundOne(value: number) { return Math.round((value + Number.EPSILON) * 10) / 10; }

export function findPerformanceMeasurements(text: string) {
  const found: { value: number; unit: string; raw: string }[] = [];
  const patterns: { regex: RegExp; unit: (match: RegExpMatchArray) => string }[] = [
    { regex: new RegExp(String.raw`\$\s*(${metricNumber})`, "gi"), unit: () => "USD" },
    { regex: new RegExp(String.raw`\b(${metricNumber})\s*(%|percent(?:age)?)(?:\b|(?=[^a-z]))`, "gi"), unit: () => "%" },
    { regex: new RegExp(String.raw`\b(${metricNumber})\s*(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|hours?|hrs?|days?|weeks?)(?![a-z])`, "gi"), unit: (m) => normalizeUnit(m[2]) },
    { regex: new RegExp(String.raw`\b(${metricNumber})\s*(requests?|req|messages?|msgs|events?|transactions?|records?)\s*(?:\/\s*(second|sec|s|minute|min|m|hour|hr|h|day|d)|per\s+(second|minute|hour|day))`, "gi"), unit: (m) => `${normalizeUnit(m[2])}/${normalizeUnit(m[3] ?? m[4])}` },
    { regex: new RegExp(String.raw`\b(${metricNumber})\s*(mb|gb|tb)\b`, "gi"), unit: (m) => normalizeUnit(m[2]) },
    { regex: new RegExp(String.raw`\b(${metricNumber})\s*(incidents?|defects?|deployments?|records?|users?|transactions?|requests?|messages?|events?|topics?|partitions?|accounts?|files?|rows?)\b`, "gi"), unit: (m) => normalizeUnit(m[2]) },
  ];
  const matches: { start: number; end: number; value: number; unit: string; raw: string }[] = [];
  for (const { regex, unit } of patterns) {
    for (const match of text.matchAll(regex)) {
      if (match.index === undefined) continue;
      const value = numberToken(match[1]);
      if (!Number.isFinite(value)) continue;
      matches.push({ start: match.index, end: match.index + match[0].length, value, unit: unit(match), raw: match[0].trim() });
    }
  }
  // Prefer the most specific match (e.g. 1,200 messages/s over 1,200 messages).
  matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
  const selected: typeof matches = [];
  for (const candidate of matches) {
    const overlaps = selected.some((other) => candidate.start < other.end && candidate.end > other.start);
    if (overlaps) continue;
    selected.push(candidate);
    found.push({ value: candidate.value, unit: candidate.unit, raw: candidate.raw });
  }
  return found;
}

export function calculatePercentChange(input: {
  before: string | number;
  after: string | number;
  beforeUnit: string;
  afterUnit?: string;
  direction: MetricDirection;
}): { ok: true; result: MetricCalculation } | { ok: false; error: MetricCalculationError } {
  if ((typeof input.before === "string" && !input.before.trim()) || (typeof input.after === "string" && !input.after.trim())) return { ok: false, error: "invalid-number" };
  const before = typeof input.before === "number" ? input.before : numberToken(input.before);
  const after = typeof input.after === "number" ? input.after : numberToken(input.after);
  if (!Number.isFinite(before) || !Number.isFinite(after)) return { ok: false, error: "invalid-number" };
  if (before < 0 || after < 0) return { ok: false, error: "negative-value" };
  if (before === 0) return { ok: false, error: "zero-baseline" };
  const beforeUnit = input.beforeUnit.trim();
  const afterUnit = (input.afterUnit ?? beforeUnit).trim();
  if (!beforeUnit || !afterUnit) return { ok: false, error: "missing-unit" };
  if (normalizeUnit(beforeUnit) !== normalizeUnit(afterUnit)) return { ok: false, error: "unit-mismatch" };
  const delta = (after - before) / before * 100;
  const trend = delta === 0 ? "unchanged" : delta < 0 ? "decrease" : "increase";
  return { ok: true, result: { value: roundOne(Math.abs(delta)), unit: "%", trend, favorable: trend === input.direction } };
}

function recommendedMetric(bullet: string): { metricType: string; direction: MetricDirection } | null {
  const text = bullet.toLocaleLowerCase();
  const rules: [RegExp, string, MetricDirection][] = [
    [/kafka.{0,60}(consumer lag|lag)|consumer lag|lagging consumer/, "Kafka consumer lag", "decrease"],
    [/under.replicated|isr|replication/, "under-replicated partitions or recovery time", "decrease"],
    [/kafka|confluent/, "Kafka message throughput", "increase"],
    [/throughput|requests?\s*\/\s*s|messages?\s*\/\s*s|events?\s*\/\s*s/, "message or request throughput", "increase"],
    [/bigquery/, "BigQuery query execution time", "decrease"],
    [/postgres|sql|database|query|hibernate|jpa/, "database query execution time", "decrease"],
    [/github actions|jenkins|gitlab|ci\/cd|deployment pipeline|build pipeline/, "deployment or build time", "decrease"],
    [/python|data pipeline|etl|elt|bigquery/, "data processing or query runtime", "decrease"],
    [/spring boot|restful? api|web api|microservice|api latency|response time/, "API response time", "decrease"],
    [/incident|mttr|recovery time/, "incident resolution time", "decrease"],
    [/availability|uptime|reliability/, "service availability", "increase"],
    [/api|latency|response time|backend|microservice/, "API response time", "decrease"],
    [/etl|elt|pipeline|ingestion/, "data pipeline runtime or ingestion latency", "decrease"],
    [/data quality|defect|validation/, "data quality defects", "decrease"],
    [/deploy|ci\/cd|build|release|automation/, "deployment or build time", "decrease"],
    [/cost|cloud spend|resource utilization/, "cloud operating cost", "decrease"],
    [/provision|terraform|infrastructure as code/, "infrastructure provisioning time", "decrease"],
    [/page load|render|bundle|frontend|front.end|react|angular/, "page load or render time", "decrease"],
    [/test|qa|sdet|regression/, "automated test execution time", "decrease"],
    [/coverage|accessibility/, "test coverage or accessibility score", "increase"],
    [/salesforce|sap|workflow|manual effort|automation/, "workflow processing time or manual effort", "decrease"],
  ];
  const match = rules.find(([pattern]) => pattern.test(text));
  return match ? { metricType: match[1], direction: match[2] } : null;
}

export function buildMetricOpportunities(resume: Resume, analysis: JDAnalysis): MetricOpportunity[] {
  const candidates = resume.experience.flatMap((job, employerIndex) => job.responsibilities.flatMap((text, bulletIndex) => {
    // Classify from the responsibility itself, never the JD's full keyword set or job title.
    // Irrelevant duties should not get forced metric questions.
    const recommendation = recommendedMetric(text);
    if (!recommendation) return [];
    const path = `experience.${employerIndex}.responsibilities.${bulletIndex}`;
    const id = evidenceId(job.id, text);
    const hasExistingNumber = findPerformanceMeasurements(text).length > 0;
    return {
      id, employerId: job.id, employer: job.company, resumePath: path, originalBullet: text,
      ...recommendation, hasExistingNumber,
      question: hasExistingNumber
        ? `What source supports the stated ${recommendation.metricType} result for this ${analysis.targetRole} work?`
        : `Can you document a before/after measure for ${recommendation.metricType} in this ${analysis.targetRole} responsibility? Leave it qualitative if you do not have a defensible measurement.`,
    };
  }));
  const specificity = (item: MetricOpportunity) => {
    const text = item.originalBullet.toLocaleLowerCase();
    const signals: Record<string, RegExp[]> = {
      "API response time": [/latency|response time|response latency/, /spring boot|restful|rest api/, /microservice|backend/],
      "database query execution time": [/query|sql|execution plan|index/, /postgres|oracle|bigquery|database/],
      "BigQuery query execution time": [/query|sql|execution/, /bigquery/],
      "Kafka consumer lag": [/consumer lag|lagging consumer/, /consumer|offset/],
      "Kafka message throughput": [/throughput|messages? per|event rate/, /producer|consumer/, /kafka|confluent/],
      "deployment or build time": [/github actions|ci\/cd|build workflow/, /deployment|release|build/, /docker|jenkins|gitlab/],
      "data processing or query runtime": [/python|bigquery|data processing/, /dataset|query|etl|pipeline/],
      "data pipeline runtime or ingestion latency": [/pipeline|etl|elt|ingestion/, /runtime|processing|data/],
      "automated test execution time": [/test execution|regression|automated test/, /junit|pytest|automation/],
      "test coverage or accessibility score": [/coverage|accessibility/],
      "incident resolution time": [/incident|root cause|recovery|resolution/],
      "service availability": [/availability|uptime|reliability/],
      "cloud operating cost": [/cost|cloud spend|resource utilization/],
      "infrastructure provisioning time": [/provision|terraform|infrastructure as code/],
      "page load or render time": [/page load|render|bundle size|frontend/],
      "workflow processing time or manual effort": [/workflow|manual effort|automation/],
    };
    return (signals[item.metricType] ?? [new RegExp(item.metricType.split(/\s+/).join("|"), "i")]).reduce((score, pattern) => score + (pattern.test(text) ? 1 : 0), 0);
  };
  const bestByEmployerMetric = new Map<string, MetricOpportunity>();
  for (const candidate of candidates) {
    const key = `${candidate.employerId}|${candidate.metricType}`;
    const current = bestByEmployerMetric.get(key);
    if (!current || specificity(candidate) > specificity(current)) bestByEmployerMetric.set(key, candidate);
  }
  return candidates.filter((candidate) => bestByEmployerMetric.get(`${candidate.employerId}|${candidate.metricType}`)?.id === candidate.id);
}

export function achievementCoverage(resume: Resume, evidence: AchievementEvidence[], analysis: JDAnalysis): AchievementCoverage {
  const bullets = resume.experience.flatMap((job, employerIndex) => job.responsibilities.map((text, bulletIndex) => ({ job, text, path: `experience.${employerIndex}.responsibilities.${bulletIndex}` })));
  const unsupported = findUnsupportedMetricClaims(resume, evidence);
  const unsupportedPaths = new Set(unsupported.map((item) => item.path));
  const quantified = bullets.filter(({ text }) => findPerformanceMeasurements(text).length > 0);
  const hasEvidence = (jobId: string, text: string, path: string, status: "verified" | "candidate-estimated") => {
    if (status === "verified" && unsupportedPaths.has(path)) return false;
    return evidence.some((item) => item.employerId === jobId && item.status === status && isEvidenceReady(item) && (item.resumeTextSnapshot === text || (status === "verified" && norm(text).includes(norm(item.metricType)))));
  };
  const verified = quantified.filter(({ job, text, path }) => hasEvidence(job.id, text, path, "verified"));
  const estimated = quantified.filter(({ job, text, path }) => hasEvidence(job.id, text, path, "candidate-estimated"));
  const opportunities = buildMetricOpportunities(resume, analysis).filter((item) => !item.hasExistingNumber);
  return {
    totalExperienceBullets: bullets.length,
    quantifiedAchievementCount: quantified.length,
    verifiedAchievementCount: verified.length,
    estimatedAchievementCount: estimated.length,
    missingMetricOpportunities: opportunities.length,
    unsupportedNumericalClaims: unsupported.reduce((total, item) => total + item.measurements.length, 0),
    zeroQuantifiedAchievements: quantified.length === 0,
    employers: resume.experience.map((job, employerIndex) => {
      const employerBullets = bullets.filter((bullet) => bullet.job.id === job.id);
      const employerQuantified = quantified.filter((bullet) => bullet.job.id === job.id);
      const employerOpportunities = opportunities.filter((opportunity) => opportunity.employerId === job.id);
      const employerPathPrefix = `experience.${employerIndex}.responsibilities.`;
      const employerUnsupported = unsupported.filter((item) => item.path.startsWith(employerPathPrefix));
      return {
        employerId: job.id,
        employer: job.company,
        totalExperienceBullets: employerBullets.length,
        quantifiedAchievementCount: employerQuantified.length,
        verifiedAchievementCount: employerQuantified.filter((bullet) => hasEvidence(job.id, bullet.text, bullet.path, "verified")).length,
        estimatedAchievementCount: employerQuantified.filter((bullet) => hasEvidence(job.id, bullet.text, bullet.path, "candidate-estimated")).length,
        missingMetricOpportunities: employerOpportunities.length,
        unsupportedNumericalClaims: employerUnsupported.reduce((total, item) => total + item.measurements.length, 0),
      };
    }),
  };
}

/** Apply only a candidate-attested, ready metric to the exact experience bullet being reviewed. */
export function applyAchievementStatement(resume: Resume, item: AchievementEvidence, statement: string): Resume | null {
  if (!isEvidenceReady(item) || !statement.trim()) return null;
  const path = item.resumePath.match(/^experience\.(\d+)\.responsibilities\.(\d+)$/);
  if (!path) return null;
  const employerIndex = Number(path[1]);
  const bulletIndex = Number(path[2]);
  const job = resume.experience[employerIndex];
  if (!job || job.id !== item.employerId || !job.responsibilities[bulletIndex]) return null;
  const responsibilities = [...job.responsibilities];
  responsibilities[bulletIndex] = statement.trim();
  const experience = [...resume.experience];
  experience[employerIndex] = { ...job, responsibilities };
  return { ...resume, experience };
}

export function evidenceId(employerId: string, bullet: string) {
  let hash = 2166136261;
  const source = `${employerId}|${norm(bullet)}`;
  for (let i = 0; i < source.length; i++) hash = Math.imul(hash ^ source.charCodeAt(i), 16777619);
  return `metric-${(hash >>> 0).toString(16)}`;
}

export function mergeMetricOpportunities(previous: AchievementEvidence[], resume: Resume, analysis: JDAnalysis): AchievementEvidence[] {
  const current = buildMetricOpportunities(resume, analysis).map((item) => {
    const saved = previous.find((entry) => entry.id === item.id && entry.originalBullet === item.originalBullet);
    const firstMeasure = findPerformanceMeasurements(item.originalBullet)[0];
    return saved ?? { ...item, resultValue: firstMeasure ? String(firstMeasure.value) : "", resultUnit: firstMeasure?.unit ?? "%", beforeValue: "", afterValue: "", measurementUnit: "", measurementPeriod: "", source: "", status: "suggested" as const };
  });
  const existingIds = new Set(current.map((item) => item.id));
  const historical = previous.filter((item) => !existingIds.has(item.id));
  return [...historical, ...current];
}

export function evidenceForAchievement(input: AchievementEvidence): { resultValue: string; resultUnit: string; beforeValue: string; afterValue: string; measurementUnit: string; error?: MetricCalculationError } {
  if (input.beforeValue.trim() || input.afterValue.trim()) {
    const result = calculatePercentChange({ before: input.beforeValue, after: input.afterValue, beforeUnit: input.measurementUnit, direction: input.direction });
    if (!result.ok) return { resultValue: "", resultUnit: "%", beforeValue: input.beforeValue, afterValue: input.afterValue, measurementUnit: input.measurementUnit, error: result.error };
    if (!result.result.favorable || result.result.trend === "unchanged") return { resultValue: "", resultUnit: "%", beforeValue: input.beforeValue, afterValue: input.afterValue, measurementUnit: input.measurementUnit, error: "invalid-number" };
    return { resultValue: String(result.result.value), resultUnit: result.result.unit, beforeValue: input.beforeValue, afterValue: input.afterValue, measurementUnit: input.measurementUnit };
  }
  return { resultValue: input.resultValue.trim(), resultUnit: input.resultUnit.trim(), beforeValue: "", afterValue: "", measurementUnit: "" };
}

export function composeAchievementBullet(input: AchievementEvidence, result: ReturnType<typeof evidenceForAchievement>) {
  const number = Number(result.resultValue);
  if (!Number.isFinite(number) || number <= 0 || !result.resultUnit || !input.source.trim() || !input.measurementPeriod.trim()) return "";
  const confidence = input.status === "candidate-estimated" ? "approximately " : "";
  const detail = result.beforeValue && result.afterValue
    ? ` (from ${result.beforeValue} ${result.measurementUnit} to ${result.afterValue} ${result.measurementUnit})`
    : "";
  const measured = input.direction === "decrease" ? `reducing ${input.metricType}` : `increasing ${input.metricType}`;
  const clean = input.originalBullet.trim().replace(/[.;,]+$/, "");
  const resultText = result.resultUnit === "%" ? `by ${confidence}${number}%` : `${confidence}${number} ${result.resultUnit}`;
  const resultClause = result.resultUnit === "%" ? `${measured} ${resultText}` : `${measured} to ${resultText}`;
  return `${clean}, ${resultClause}${detail} over ${input.measurementPeriod.trim()}.`;
}

export function isEvidenceReady(input: AchievementEvidence) {
  const result = evidenceForAchievement(input);
  return (input.status === "verified" || input.status === "candidate-estimated")
    && Number.isFinite(Number(result.resultValue)) && Number(result.resultValue) > 0
    && Boolean(result.resultUnit.trim() && input.metricType.trim() && input.measurementPeriod.trim() && input.source.trim());
}

export function findUnsupportedMetricClaims(resume: Resume, evidence: AchievementEvidence[]) {
  return resume.experience.flatMap((job, employerIndex) => job.responsibilities.flatMap((text, bulletIndex) => {
    const measurements = findPerformanceMeasurements(text);
    if (!measurements.length) return [];
    const path = `experience.${employerIndex}.responsibilities.${bulletIndex}`;
    const supporting = evidence.filter((item) => item.employerId === job.id && (item.status === "verified" || item.status === "candidate-estimated") && isEvidenceReady(item));
    const supported = measurements.every((measurement) => supporting.some((item) => {
      const result = evidenceForAchievement(item);
      const values = [
        { value: Number(result.resultValue), unit: norm(result.resultUnit) },
        ...(result.beforeValue && result.measurementUnit ? [{ value: numberToken(result.beforeValue), unit: norm(result.measurementUnit) }] : []),
        ...(result.afterValue && result.measurementUnit ? [{ value: numberToken(result.afterValue), unit: norm(result.measurementUnit) }] : []),
      ];
      const hasMetricWords = norm(text).includes(norm(item.metricType)) || item.resumeTextSnapshot === text;
      return hasMetricWords && values.some((value) => value.value === measurement.value && (measurement.unit === "count" || value.unit === normalizeUnit(measurement.unit) || value.unit === ""));
    }));
    return supported ? [] : [{ path, employer: job.company, text, measurements }];
  }));
}

export function repeatedMetricFindings(resume: Resume) {
  const values = new Map<string, { count: number; employers: Set<string> }>();
  for (const job of resume.experience) for (const text of job.responsibilities) for (const measurement of findPerformanceMeasurements(text)) {
    const key = `${measurement.value}|${norm(measurement.unit)}`;
    const record = values.get(key) ?? { count: 0, employers: new Set<string>() };
    record.count++;
    record.employers.add(job.company);
    values.set(key, record);
  }
  return [...values.entries()].filter(([, record]) => record.count > 1).map(([metric, record]) => `${metric.replace("|", " ")} appears in ${record.count} bullets${record.employers.size > 1 ? ` across ${[...record.employers].join(", ")}` : ` under ${[...record.employers][0]}`}; verify the result is not duplicated.`);
}

export function confirmedMetricEvidence(evidence: AchievementEvidence[]) {
  return evidence.filter((item) => (item.status === "verified" || item.status === "candidate-estimated") && isEvidenceReady(item)).map((item) => ({
    employerId: item.employerId,
    employer: item.employer,
    sourceBullet: item.originalBullet,
    metric: item.metricType,
    direction: item.direction,
    value: evidenceForAchievement(item).resultValue,
    unit: evidenceForAchievement(item).resultUnit,
    before: item.beforeValue || undefined,
    after: item.afterValue || undefined,
    measurementUnit: item.measurementUnit || undefined,
    period: item.measurementPeriod,
    source: item.source,
    status: item.status,
  }));
}
