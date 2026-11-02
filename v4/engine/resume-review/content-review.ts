import type { MasterResume } from "@/types/resume";

export function careerDuration(experience: MasterResume["experience"], now = new Date()) {
  if (!experience.length) return null;
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", year: "numeric", month: "numeric" }).formatToParts(now);
  const current = Number(parts.find(p => p.type === "year")?.value) * 12 + Number(parts.find(p => p.type === "month")?.value) - 1;
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  function parse(value: string, end: boolean): number | null {
    if (/^(present|current|now)$/i.test(value.trim())) return current;
    const match = value.trim().match(/^([a-z]+)\s+(\d{4})$/i);
    if (!match) return null;
    const month = months.indexOf(match[1].slice(0, 3).toLowerCase());
    return month < 0 ? null : Number(match[2]) * 12 + month + (end ? 1 : 0);
  }
  const intervals: number[][] = [];
  for (const e of experience) {
    const start = parse(e.startDate, false), end = parse(e.endDate, true);
    if (start === null || end === null || start > end || start > current) return null;
    intervals.push([start, Math.min(end, current)]);
  }
  intervals.sort((a,b) => a[0]-b[0]);
  let total = 0, start = -1, end = -1;
  for (const [a,b] of intervals) { if (start < 0) { start=a; end=b; } else if (a<=end) end=Math.max(end,b); else { total+=end-start; start=a; end=b; } }
  if (start>=0) total+=end-start;
  return { years: Math.floor(total/12), remainingMonths: total%12, totalMonths: total };
}

export interface ResumeIssue { code: string; severity: "error" | "warning"; path: string; message: string }
export function reviewResumeContent(resume: MasterResume): ResumeIssue[] {
  const issues: ResumeIssue[] = [];
  const texts: { path: string; text: string }[] = [];
  function walk(value: unknown, path: string) {
    if (typeof value === "string") texts.push({ path, text: value });
    else if (Array.isArray(value)) value.forEach((v,i) => walk(v, `${path}.${i}`));
    else if (value && typeof value === "object") Object.entries(value).forEach(([k,v]) => walk(v, path ? `${path}.${k}` : k));
  }
  walk(resume, "");
  const meta = /\b(?:JD[- ]aligned draft|JD[- ]adapted draft|drafted specialization|drafted (?:backend|development) focus|senior[- ]level draft scope|candidate[- ]requested draft|not verified employment evidence)\b/i;
  for (const {path,text} of texts) if (meta.test(text)) issues.push({code:"draft-language",severity:"error",path,message:`Remove prompt/review wording from ${path}; write resume content only.`});
  const repeated = new Map<string,string>();
  for (const {path,text} of texts.filter(t => /professionalSummary.bullets|responsibilities\.\d+$/.test(t.path))) {
    const key=text.toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
    if(repeated.has(key))issues.push({code:"duplicate-bullet",severity:"warning",path,message:`This bullet repeats ${repeated.get(key)}. Give it distinct work context or remove it.`});else repeated.set(key,path);
  }
  const skills = new Map<string,string>();
  resume.technicalSkills.categories.forEach((c,i) => c.skills.forEach((skill,j) => {const key=skill.trim().toLowerCase();const p=`technicalSkills.categories.${i}.skills.${j}`;if(skills.has(key))issues.push({code:"duplicate-skill",severity:"warning",path:p,message:`${skill} is already listed; consolidate duplicate skill categories.`});else skills.set(key,p);}));
  if(resume.professionalSummary.bullets.filter(b=>/\b(?:development focus|technical emphasis|engineering focus|software quality focus|draft scope)\b/i.test(b)).length>=3)issues.push({code:"formulaic-summary",severity:"warning",path:"professionalSummary",message:"Rewrite repeated focus/emphasis statements as distinct direct capability statements."});
  const duties=resume.experience.flatMap(e=>e.responsibilities).join(" ");
  const skillsText=resume.technicalSkills.categories.flatMap(c=>c.skills).join(" ");
  if(/on[- ]call/i.test(skillsText)&&!/on[- ]call/i.test(duties))issues.push({code:"skills-only-oncall",severity:"warning",path:"technicalSkills",message:"On-call is listed as a skill but not demonstrated in responsibilities. Confirm it and add the actual duty, or remove the claim."});
  return issues;
}
