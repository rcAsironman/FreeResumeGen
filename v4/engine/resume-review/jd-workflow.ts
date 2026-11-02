import type { JobAnalysis } from "@/types/job-analysis";
import type { MasterResume } from "@/types/resume";
import type { EmploymentType } from "@/types/employment-type";
import { careerDuration } from "@/engine/resume-review/content-review";
import { technologyTenureGaps } from "@/engine/resume-review/tenure";
import { cleanRoleTitle } from "@/engine/resume-review/role-title";

/** Extract overall tenure only; a product-specific duration is not career tenure. */
export function overallExperience(jd: string): number | null {
  const candidates: { years: number; rank: number }[] = [];
  let optionalSection = false;
  for (const raw of jd.replace(/[–—]/g, "-").split(/[\n;]+/)) {
    const line = raw.replace(/^[#*\s-]+/, "").trim();
    if (/^(preferred(?: qualifications| skills)?|nice to have|optional)\s*:?$/i.test(line)) { optionalSection = true; continue; }
    if (/^(required(?: qualifications| skills)?|minimum qualifications|requirements|experience required)\s*:?$/i.test(line)) { optionalSection = false; continue; }
    if (optionalSection || /\b(preferred|nice to have|optional|not required)\b/i.test(line)) continue;
    const match = line.match(/\b(\d+(?:\.\d+)?)\s*\+?\s*(?:-\s*\d+(?:\.\d+)?)?\s*(?:years?|yrs?)\b/i);
    if (!match) continue;
    const years = Number(match[1]);
    if (years <= 0 || years > 50) continue;
    const after = line.slice(match.index! + match[0].length).replace(/^\s*(of\s+)?(proven\s+|professional\s+|relevant\s+|hands-on\s+)?experience\s*/i, "");
    const overall = /\b(total|overall|professional|relevant)\b/i.test(line) || /\b(?:as (?:a |an )?|in )(?:software (?:engineering|development)|software engineer|full.?stack|backend|frontend|IT|information technology)\b/i.test(after) || /\bas (?:a |an )?[\w .+#/-]{0,45}(?:developer|engineer|architect|administrator|analyst|consultant)\b/i.test(after) || /\b(?:software (?:development|engineering)|data engineering|cloud engineering|platform engineering|site reliability engineering|full[- ]stack development) experience\b/i.test(line);
    const generic = /^(?:minimum\s+|at least\s+|experience(?: required)?\s*:?\s*)?\d[^\n]*years?\s*(?:of\s+)?experience[.\s]*$/i.test(line) || /^\d[^\n]*years?[+\s.]*$/i.test(line);
    const labeled = /^experience(?: required)?\s*:\s*\d+(?:\.\d+)?\+?\s*(?:-\s*\d+)?\s*(?:years?|yrs?)[.\s]*$/i.test(line);
    if (overall || generic || labeled) candidates.push({ years, rank: overall ? 2 : 1 });
  }
  candidates.sort((a,b) => b.rank-a.rank || b.years-a.years);
  return candidates[0]?.years ?? null;
}

export function resolveTarget(jd: string, mode: EmploymentType, gc: boolean) {
  if (mode === "c2c" && gc) return { years: 12, reason: "C2C + GC: your selected 12-year proposed timeline" };
  const years = overallExperience(jd);
  return { years, reason: years === null ? "No clear overall experience requirement; keeping source dates" : `JD overall experience: ${years} years (proposed timeline)` };
}

/** Local extraction is a preview aid, never a replacement for the full JD in the prompt. */
export function analyzeLocally(jd: string): JobAnalysis {
  const lines = jd.split(/\r?\n/).map(l => l.replace(/^[#*\s-]+/, "").trim()).filter(Boolean);
  const labeled = lines.find(l => /^(job title|role|position|title)\s*:/i.test(l));
  const candidate = labeled?.replace(/^[^:]+:\s*/, "") || lines.find(l => /\b(developer|engineer|architect|administrator|analyst|consultant|designer|manager|scientist)\b/i.test(l) && l.length < 120) || "";
  const targetRole = cleanRoleTitle(candidate);
  const keys = ["programmingLanguages","backendTechnologies","frontendTechnologies","frameworks","libraries","cloudPlatforms","cloudServices","databases","dataTechnologies","messagingTechnologies","devOpsTools","cicdTools","containerTechnologies","infrastructureTools","testingTools","monitoringTools","securityTechnologies","operatingSystems","developmentTools","architectureConcepts","architecturalPatterns","designPatterns","allTechnicalSkills"];
  const analysis = Object.fromEntries(keys.map(key => [key, []])) as unknown as JobAnalysis;
  analysis.targetRole = targetRole;
  // Preserve unknown products too: requirements are extracted from the JD, not a fixed stack catalog.
  analysis.allTechnicalSkills = extractRequirements(jd);
  return analysis;
}

// Vocabulary assists prose extraction; labeled unknown tools are also retained.
const terms = ["Azure Databricks","Databricks","Scala","PySpark","Spark","SQL","ETL/ELT","Delta Lake","Unity Catalog","Auto Loader","Lakehouse architecture","Medallion architecture","serverless","DataFrame","notebooks","cluster configuration","cluster sizing","job orchestration","Structured Streaming","data warehouse","Azure","AKS","DevOps","Docker","Kubernetes","Java","Python","Salesforce","Apex","SOQL","Lightning Web Components","Spring Boot","Kafka","MongoDB","PostgreSQL","React",".NET","C#","SAP","ABAP","Terraform","Ansible","AWS","GCP","Informatica","Tableau"];
const aliases: Record<string,string> = {"Auto Loader":"auto\\s*loader","DataFrame":"data\\s*frames?","ETL/ELT":"etl(?:\\s*[/&]\\s*elt)?|elt","cluster configuration":"clusters?\\s+configuration","cluster sizing":"(?:clusters?\\s+(?:configuration\\s+and\\s+)?)sizing","data warehouse":"data\\s*warehous(?:e|ing)","PostgreSQL":"postgres(?:ql)?"};
export function hasTerm(text: string, term: string) {
  const expression = aliases[term] || term.replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/\s+/g,"\\s+");
  return new RegExp(`(?:^|[^a-z0-9])(?:${expression})(?=$|[^a-z0-9])`,"i").test(text);
}
export function extractRequirements(jd: string): string[] {
  const lines=jd.split(/\r?\n/).map(l=>l.replace(/^[#*\s-]+/,"").trim()).filter(l=>!/@|https?:|^location\s*:|not required|no experience (?:with|in)/i.test(l));
  const text=lines.join("\n");
  const explicit=lines.flatMap(l=>/^(skills|technologies|tools|frameworks|languages|platforms|databases|core skills)\s*:/i.test(l)?l.replace(/^[^:]+:/,"").split(/[,;]+/).map(v=>v.trim()).filter(Boolean):[]);
  return [...new Set([...terms.filter(t=>hasTerm(text,t)),...explicit])];
}

export type DraftFinding = { kind: "metric" | "duplicate" | "role" | "coverage"; company?: string; text: string; supported?: boolean };
export const numericOutcome = /\b\d+(?:\.\d+)?\s*(?:%|percent\b|milliseconds?\b|ms\b|seconds?\b|minutes?\b|hours?\b|requests\b|transactions\b|records\b|users\b|million\b)/i;
function words(text: string) { return new Set(text.toLowerCase().replace(/[^a-z0-9+#.]+/g," ").split(/\s+/).filter(w => w.length > 2)); }
export function reviewDraft(resume: MasterResume, source: MasterResume, jd: string, targetYears: number | null = null): DraftFinding[] {
  const findings: DraftFinding[] = [];
  const seen: { text: string; words: Set<string> }[] = [];
  for (const employer of resume.experience) {
    const original = source.experience.find(e => e.id === employer.id && e.company === employer.company);
    let count = 0;
    for (const text of employer.responsibilities) {
      if (numericOutcome.test(text)) {
        count++;
        findings.push({kind:"metric", company:employer.company, text, supported:original?.responsibilities.includes(text) ?? false});
      }
      const set = words(text);
      if (set.size >= 8 && seen.some(other => [...set].filter(w => other.words.has(w)).length / new Set([...set,...other.words]).size > .72)) findings.push({kind:"duplicate",company:employer.company,text});
      seen.push({ text, words:set });
    }
    if (count > 3) findings.push({kind:"coverage",company:employer.company,text:`${count} quantified bullets: review the 2–3 per employer target. No bullets were removed.`});
    if (count === 0) findings.push({kind:"coverage",company:employer.company,text:"No quantified achievements. Use recorded measurements or clearly tracked editable draft examples for relevant technical outcomes."});
  }
  const analysis = analyzeLocally(jd);
  const duration = careerDuration(resume.experience);
  if (targetYears !== null && duration && duration.totalMonths !== Math.round(targetYears * 12)) findings.push({kind:"coverage",text:`Selected target is ${targetYears} years, but imported dates total ${duration.years} years ${duration.remainingMonths} months. Dates have not been silently changed.`});
  const summaryYears = resume.professionalSummary.bullets[0]?.match(/\b(\d+)\+?\s*years?\b/i);
  if (summaryYears && duration && Number(summaryYears[1]) !== duration.years) findings.push({kind:"coverage",text:`Opening summary says ${summaryYears[1]} years; imported employment dates total ${duration.years} years ${duration.remainingMonths} months. Reconcile before use.`});
  const specialty = [...words(analysis.targetRole)].filter(w => !/^(senior|junior|lead|principal|staff|associate|software|engineer|developer|architect|administrator|analyst|consultant|manager|full|stack|backend|frontend|with|and)$/.test(w));
  const duties = words(resume.experience.flatMap(e => e.responsibilities).join(" "));
  for (const word of specialty) if (!duties.has(word)) findings.push({kind:"role",text:`Target specialization '${word}' is not demonstrated in employer responsibilities. A matching headline alone does not establish role alignment.`});
  const titleTokens=(s:string)=>cleanRoleTitle(s).toLowerCase().replace(/\band\b/g," ").replace(/[^a-z0-9+#.]+/g," ").trim().split(/\s+/).sort().join(" ");
  if (analysis.targetRole && titleTokens(resume.personalInfo.professionalTitle || "") !== titleTokens(analysis.targetRole)) findings.push({kind:"role",text:`JD headline is ${analysis.targetRole}; imported headline is ${resume.personalInfo.professionalTitle || "missing"}. Review scope and wording.`});
  const body = [...resume.professionalSummary.bullets,...resume.technicalSkills.categories.flatMap(c=>c.skills),...resume.experience.flatMap(e=>e.responsibilities)].join(" ");
  const responsibilities=resume.experience.flatMap(e=>e.responsibilities).join(" ");
  if(/full[- ]stack/i.test(resume.personalInfo.professionalTitle || "")) {
    const frontend=/\b(?:react|angular|vue|blazor|frontend|front-end|user interface|html|css|javascript|typescript)\b/i.test(responsibilities);
    const backend=/\b(?:backend|back-end|spring|django|flask|asp\.net|node\.?js|server-side|rest(?:ful)?|web api|microservices?)\b/i.test(responsibilities);
    if(!frontend || !backend)findings.push({kind:"role",text:"Full-Stack headline needs both frontend and backend responsibility context. Review the headline or add supported work; do not invent missing experience."});
  }
  for (const term of analysis.allTechnicalSkills) {
    if (!hasTerm(body,term)) findings.push({kind:"coverage",text:`JD term not found: ${term}. Draft relevant content for review; do not treat it as verified history.`});
    else if (!hasTerm(responsibilities,term)) findings.push({kind:"coverage",text:`Skills-only requirement: ${term} lacks responsibility context.`});
  }
  for(const gap of technologyTenureGaps(resume,jd))findings.push({kind:"coverage",text:gap.text});
  for(const skill of resume.technicalSkills.categories.flatMap(c=>c.skills))if(!hasTerm(responsibilities,skill))findings.push({kind:"coverage",text:`Listed skill '${skill}' has no exact or recognized-alias responsibility match. Check its supporting work context; wording differences may cause false positives.`});
  for(const text of [...resume.professionalSummary.bullets,...resume.experience.flatMap(e=>e.responsibilities)])if(/\b(?:concepts|familiarity|exposure|working knowledge)\b/i.test(text))findings.push({kind:"coverage",text:`Vague proficiency wording: ${text} Replace with a concrete implementation where supported.`});
  for (const employer of resume.experience) for(const text of employer.responsibilities) if (/\billustrative\b|\bsynthetic\b|\bhypothetical\b|\bproposed\b/i.test(text)) findings.push({kind:"coverage",company:employer.company,text:"Draft-label wording inside a responsibility: keep review status in the app, not resume sentences."});
  return findings;
}
