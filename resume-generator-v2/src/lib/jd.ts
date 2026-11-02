import type { CompanySettings, JDAnalysis, JDRequirement } from "@/types/resume";

const splitLines = (text: string) => text.split(/\r?\n/).map((line) => line.trim().replace(/^(?:[-*•]\s*|\d+[.)]\s+)/, "")).filter(Boolean);
const keyTerms = (text: string) => [...new Set((text.match(/\b[A-Za-z][A-Za-z0-9+#./-]{1,}(?:\s+[A-Za-z][A-Za-z0-9+#./-]{1,}){0,2}\b/g) ?? []).map((x) => x.trim()).filter((x) => x.length > 2))];

export function cleanTargetRole(value: string) {
  return value
    .replace(/^(role|job title|position|title)\s*:\s*/i, "")
    .replace(/^[^\p{L}\p{N}.]*/u, "")
    .replace(/^(?:we['’]?re hiring|we are hiring|now hiring|now recruiting|we are recruiting|hiring)\s*[:\-–—]\s*/i, "")
    .replace(/^(role|job title|position|title|target role)\s*[:–-]\s*/i, "")
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

export function analyzeJD(jd: string): JDAnalysis {
  const lines = splitLines(jd);
  const rolePattern = /\b(engineer|developer|administrator|architect|analyst|manager|specialist|consultant|scientist|designer|lead|nurse|accountant|teacher|technician|counselor|lawyer|coordinator)\b/i;
  const labeledTitleLine = lines.find((line) => /^(role|job title|position|title|target role)\s*[:–-]/i.test(line));
  const titleLine = labeledTitleLine ?? lines.find((line) => line.length <= 120 && rolePattern.test(line)) ?? lines.find((line) => rolePattern.test(line));
  const explicitRole = titleLine ? cleanTargetRole(titleLine) : "";
  const targetRole = explicitRole || "Target role not specified";
  const expMatches = [...jd.matchAll(/(?:minimum\s+)?(\d+(?:\.\d+)?)(?:\s*(?:-|–|to)\s*\d+(?:\.\d+)?)?\s*\+?\s*(?:years?|yrs?)(?:\s+of\s+(?:hands-on\s+)?experience)?/gi)].map((m) => Number(m[1])).filter(Number.isFinite);
  const reqs: JDRequirement[] = [];
  const seen = new Set<string>();
  let section: "required" | "preferred" | "responsibility" | null = null;
  for (let line of lines) {
    const inline = line.match(/^(required(?: skills| qualifications)?|mandatory(?: skills)?|preferred(?: skills| qualifications)?|responsibilities|key responsibilities|languages|frameworks|platforms)\s*:\s*(.+)$/i);
    if (inline) {
      section = /^preferred/i.test(inline[1]) ? "preferred" : /responsibilities/i.test(inline[1]) ? "responsibility" : "required";
      line = inline[2];
    }
    if (/(?:^|\s)(?:required\s+skills?(?:\s*(?:&|and)\s*qualifications)?|requirements|required\s+qualifications|minimum\s+qualifications|basic\s+qualifications)\s*:?\s*$/i.test(line)) { section = "required"; continue; }
    if (/^(preferred skills|preferred qualifications|nice to have|desired qualifications)\b/i.test(line)) { section = "preferred"; continue; }
    if (/^(responsibilities|what you.ll do|key responsibilities|duties)\b/i.test(line)) { section = "responsibility"; continue; }
    if (line.length < 2 || /^(about us|overview|job description|qualifications|requirements|preferred|what you.ll do)\b/i.test(line)) continue;
    const norm = line.toLowerCase();
    const kind = /^(required|mandatory|must have)\s*:/i.test(line) ? "required" : /^(preferred|nice to have)\s*:/i.test(line) ? "preferred" : section ?? (/\b(required|must have|minimum|mandatory)\b/i.test(line) ? "required" : /\b(preferred|nice to have|desired|bonus)\b/i.test(line) ? "preferred" : /\b(experience with|proficiency|knowledge of|ability to|responsible for|develop|design|build|maintain|support|implement|manage|lead|collaborate|troubleshoot|monitor|optimize|automate)\b/i.test(line) ? "responsibility" : null);
    if (!kind || seen.has(norm)) continue;
    seen.add(norm); const category = /degree|bachelor|master|b\.tech|mca|education/i.test(line) ? "education"
      : /certif|licen[sc]/i.test(line) ? "certification"
      : /years?|yrs?/.test(line) && /experience/i.test(line) ? "experience"
      : /architect|design|scalab/i.test(line) ? "architecture"
      : /test|quality|debug/i.test(line) ? "testing"
      : /deploy|release|pipeline/i.test(line) ? "deployment"
      : /incident|monitor|operat|support/i.test(line) ? "operations"
      : kind === "responsibility" ? "responsibility" : "skill";
    const items = category === "skill" ? line.replace(/^(?:required|preferred|mandatory|languages?|frameworks?|platforms?|technologies|skills)\s*:\s*/i, "").split(/[,;]|\s+and\s+/i).map(x => x.trim()).filter(Boolean) : [line];
    for (const text of items) reqs.push({ text, kind, category, keywords: keyTerms(text).slice(0, 10) });
  }
  const industryMatch = jd.match(/\b(banking|financial services|payments|healthcare|automotive|aviation|insurance|retail|telecommunications|manufacturing|logistics|e-commerce|government|energy|education)\b/i);
  const seniorityMatch = targetRole.match(/\b(intern|junior|associate|mid[- ]level|senior|staff|principal|lead|architect|manager)\b/i);
  return { targetRole, seniority: seniorityMatch?.[0] ?? "As stated or implied by the JD", industry: industryMatch?.[0] ?? "Not explicitly stated", requirements: reqs, facets: {
    mandatory: reqs.filter(item => item.kind === "required").map(item => item.text),
    preferred: reqs.filter(item => item.kind === "preferred").map(item => item.text),
    languages: lines.filter(line => /^languages?|^programming/i.test(line)),
    frameworks: lines.filter(line => /^frameworks?/i.test(line)),
    platforms: lines.filter(line => /^platforms?/i.test(line)),
    architecture: reqs.filter(item => item.category === "architecture").map(item => item.text),
    testing: reqs.filter(item => item.category === "testing").map(item => item.text),
    deployment: reqs.filter(item => item.category === "deployment").map(item => item.text),
    operations: reqs.filter(item => item.category === "operations").map(item => item.text),
    development: reqs.filter(item => item.category === "responsibility").map(item => item.text),
    education: reqs.filter(item => item.category === "education").map(item => item.text),
    certifications: reqs.filter(item => item.category === "certification").map(item => item.text),
  }, experienceYears: expMatches.length ? Math.max(...expMatches) : null };
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
