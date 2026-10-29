import type { CompanySettings, JDAnalysis, JDRequirement } from "@/types/resume";

const splitLines = (text: string) => text.split(/\r?\n/).map((line) => line.trim().replace(/^[-*•\d.)\s]+/, "")).filter(Boolean);
const keyTerms = (text: string) => [...new Set((text.match(/\b[A-Za-z][A-Za-z0-9+#./-]{1,}(?:\s+[A-Za-z][A-Za-z0-9+#./-]{1,}){0,2}\b/g) ?? []).map((x) => x.trim()).filter((x) => x.length > 2))];

export function cleanTargetRole(value: string) {
  return value
    .replace(/^(role|job title|position|title)\s*:\s*/i, "")
    .replace(/^[^\p{L}\p{N}]*/u, "")
    .replace(/^(?:we['’]?re hiring|we are hiring|now hiring|now recruiting|we are recruiting|hiring)\s*[:\-–—]\s*/i, "")
    .replace(/^(role|job title|position|title|target role)\s*:\s*/i, "")
    .replace(/\s*\((?:remote|hybrid|on[ -]?site|contract(?:or)?|full[ -]?time|part[ -]?time|location)\b.*$/i, "")
    .replace(/\s*(?:\||[-–—])\s*(?:remote|hybrid|on[ -]?site|contract(?:or)?|full[ -]?time|part[ -]?time|Minneapolis|Chandler|Columbus|O'Fallon)\b.*$/i, "")
    .replace(/\s*(?:\||[-–—])\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}\b.*$/, "")
    .replace(/\s*\([^)]*,\s*[A-Z]{2}\).*$/, "")
    .replace(/,\s*(?:remote|hybrid|on[ -]?site|contract(?:or)?|full[ -]?time|part[ -]?time)\b.*$/i, "")
    .replace(/,\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}\b.*$/, "")
    .replace(/\s*,?\s*[A-Z]{2}\s*$/, "")
    .replace(/[\s.,:;|]+$/, "")
    .trim();
}

function inferTargetRole(jd: string) {
  const text = jd.toLocaleLowerCase();
  const has = (pattern: RegExp) => pattern.test(text);
  if (has(/salesforce/) && has(/\b(apex|lightning|lwc|visualforce)\b/)) return "Salesforce Developer";
  if (has(/\bsap\b/)) return has(/\b(consultant|functional|configuration|implementation)\b/) ? "SAP Consultant" : "SAP Developer";
  if (has(/\bkafka\b/) && has(/\b(kafka administrator|kafka administration|administer(?:ed|ing)? kafka|manage(?:d|ment|ing)? kafka|configure(?:d|s|ing)? kafka|kafka cluster administration|kafka broker configuration|confluent platform administration)\b/)) return "Kafka Administrator";
  if (has(/\b(dataops|data ops)\b/)) return "DataOps Engineer";
  if (has(/\bjava\b/) && has(/\b(spring|microservices|rest api|backend|back-end)\b/)) return "Java Backend Developer";
  if (has(/\b(informatica|etl|elt|data warehouse|data lake|bigquery|snowflake|databricks)\b/) && has(/\b(data|pipeline|warehouse|integration)\b/)) return "Data Engineer";
  if (has(/\b(devops|ci\/cd|continuous delivery)\b/)) return "DevOps Engineer";
  if (has(/\b(sre|site reliability|incident response|service reliability)\b/)) return "Site Reliability Engineer";
  if (has(/\b(react|angular|vue)\b/) && has(/\b(frontend|front-end|user interface|ui)\b/)) return "Frontend Developer";
  if (has(/\b(react|angular|vue)\b/) && has(/\b(node(?:\.js)?|express|backend|back-end)\b/)) return "Full Stack Developer";
  if (has(/\b(react|angular|vue)\b/)) return "Frontend Developer";
  if (has(/\bnode(?:\.js)?\b/) && has(/\b(api|backend|back-end)\b/)) return "Node.js Backend Developer";
  if (has(/\b(\.net|dotnet|c#)\b/)) return ".NET Developer";
  if (has(/\bkafka\b/)) return "Kafka Engineer";
  if (has(/\b(java|python|javascript|typescript)\b/)) return `${has(/\bjava\b/) ? "Java" : has(/\bpython\b/) ? "Python" : has(/\btypescript\b/) ? "TypeScript" : "JavaScript"} Developer`;
  if (has(/\b(aws|amazon web services)\b/)) return "AWS Cloud Engineer";
  if (has(/\b(azure|microsoft cloud)\b/)) return "Azure Cloud Engineer";
  if (has(/\b(gcp|google cloud)\b/)) return "Google Cloud Engineer";
  if (has(/\b(selenium|playwright|cypress|qa automation|test automation)\b/)) return "QA Automation Engineer";
  return null;
}

export function analyzeJD(jd: string): JDAnalysis {
  const lines = splitLines(jd);
  const rolePattern = /\b(engineer|developer|administrator|architect|analyst|manager|specialist|consultant|scientist|designer|lead)\b/i;
  const labeledTitleLine = lines.find((line) => /^(role|job title|position|title|target role)\s*:/i.test(line));
  const titleLine = labeledTitleLine ?? lines.find((line) => line.length <= 120 && rolePattern.test(line)) ?? lines.find((line) => rolePattern.test(line));
  const explicitRole = titleLine ? cleanTargetRole(titleLine) : "";
  const targetRole = explicitRole || inferTargetRole(jd) || "Role inferred from job description";
  const expMatches = [...jd.matchAll(/(?:minimum\s+)?(\d+(?:\.\d+)?)(?:\s*(?:-|–|to)\s*\d+(?:\.\d+)?)?\s*\+?\s*(?:years?|yrs?)(?:\s+of\s+(?:hands-on\s+)?experience)?/gi)].map((m) => Number(m[1])).filter(Number.isFinite);
  const reqs: JDRequirement[] = [];
  const seen = new Set<string>();
  let section: "required" | "preferred" | "responsibility" | null = null;
  for (const line of lines) {
    if (/(?:^|\s)(?:required\s+skills?(?:\s*(?:&|and)\s*qualifications)?|requirements|required\s+qualifications|minimum\s+qualifications|basic\s+qualifications)\s*:?\s*$/i.test(line)) { section = "required"; continue; }
    if (/^(preferred skills|preferred qualifications|nice to have|desired qualifications)\b/i.test(line)) { section = "preferred"; continue; }
    if (/^(responsibilities|what you.ll do|key responsibilities|duties)\b/i.test(line)) { section = "responsibility"; continue; }
    if (line.length < 2 || /^(about us|overview|job description|qualifications|requirements|preferred|what you.ll do)\b/i.test(line)) continue;
    const norm = line.toLowerCase();
    const kind = section ?? (/\b(required|must have|minimum|mandatory)\b/i.test(line) ? "required" : /\b(preferred|nice to have|desired|bonus)\b/i.test(line) ? "preferred" : /\b(experience with|proficiency|knowledge of|ability to|responsible for|develop|design|build|maintain|support|implement|manage|lead|collaborate|troubleshoot|monitor|optimize|automate)\b/i.test(line) ? "responsibility" : null);
    if (!kind || seen.has(norm)) continue;
    seen.add(norm); reqs.push({ text: line, kind, keywords: keyTerms(line).slice(0, 10) });
  }
  const industryMatch = jd.match(/\b(banking|financial services|payments|healthcare|automotive|aviation|insurance|retail|telecommunications|manufacturing|logistics|e-commerce|government|energy|education)\b/i);
  const seniorityMatch = targetRole.match(/\b(intern|junior|associate|mid[- ]level|senior|staff|principal|lead|architect|manager)\b/i);
  return { targetRole, seniority: seniorityMatch?.[0] ?? "As stated or implied by the JD", industry: industryMatch?.[0] ?? "Not explicitly stated", requirements: reqs.slice(0, 70), experienceYears: expMatches.length ? Math.max(...expMatches) : null };
}

export function companyId(company: CompanySettings) {
  const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "company";
  return company.id || `${slug(company.companyName)}${company.startDate ? `-${slug(company.startDate)}` : ""}`;
}

export function projectId(company: CompanySettings, project: CompanySettings["projects"][number], index: number) {
  const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `project-${index + 1}`;
  return project.id || `${companyId(company)}-${slug}`;
}

export function targetExperienceWindow(analysis: JDAnalysis, configuredMax: number) {
  const cappedMax = Math.max(1, Math.min(13, configuredMax));
  // An explicit JD duration is the proposed resume window, capped by the profile.
  // This only drives a proposed resume timeline; it never edits saved source dates.
  if (analysis.experienceYears !== null) return Math.min(cappedMax, analysis.experienceYears);
  const inferred = /\b(intern|junior|entry[- ]level)\b/i.test(`${analysis.targetRole} ${analysis.seniority}`) ? 2
    : /\b(mid[- ]level|associate)\b/i.test(`${analysis.targetRole} ${analysis.seniority}`) ? 5
      : cappedMax;
  return Math.min(cappedMax, inferred);
}
