import type { CompanySettings, JDAnalysis } from "@/types/resume";
import type { Resume } from "@/types/resume";
import { targetExperienceWindow, companyId } from "@/lib/jd";

const industryAliases: Record<string, string[]> = {
  banking: ["bank", "banking", "financial services", "financial software", "fintech", "payments", "investment"],
  automotive: ["automotive", "automobile", "vehicle", "mobility"],
  healthcare: ["healthcare", "health care", "medical", "health"],
  insurance: ["insurance", "insurer"],
  retail: ["retail", "e-commerce", "ecommerce"],
  telecommunications: ["telecommunications", "telecom", "communications"],
  logistics: ["logistics", "transportation", "supply chain", "shipping"],
  aviation: ["aviation", "aerospace", "airline"],
  manufacturing: ["manufacturing", "industrial"],
  media: ["media", "advertising", "entertainment"],
};

function industryMatches(company: CompanySettings, jdIndustry: string) {
  if (jdIndustry === "Not explicitly stated") return false;
  const jd = jdIndustry.toLowerCase();
  const normalized = Object.entries(industryAliases).find(([, values]) => values.some((value) => jd.includes(value)))?.[0];
  const terms = industryAliases[normalized ?? ""] ?? [jd];
  const source = `${company.industry} ${company.projects.map((project) => project.industry).join(" ")}`.toLowerCase();
  return terms.some((term) => source.includes(term));
}

function formatMonth(monthIndex: number) {
  const date = new Date(Math.floor(monthIndex / 12), monthIndex % 12, 1);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function dateToMonth(value: string, isEnd: boolean, presentMonth: number): number | null {
  const text = value.trim();
  if (!text) return null;
  if (/^(present|current|now)$/i.test(text)) return presentMonth;
  const iso = text.match(/^(\d{4})[-/](\d{1,2})$/);
  if (iso) return Number(iso[1]) * 12 + Number(iso[2]) - 1;
  const named = text.match(/^(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+(\d{4})$/i);
  if (named) {
    const month = new Date(`${named[1]} 1, ${named[2]}`).getMonth();
    return Number(named[2]) * 12 + month;
  }
  const year = text.match(/^(\d{4})$/);
  if (year) return Number(year[1]) * 12 + (isEnd ? 11 : 0);
  return null;
}

export function reviewEmploymentDates(companies: CompanySettings[], today = new Date()) {
  const presentMonth = today.getFullYear() * 12 + today.getMonth();
  const periods = companies.flatMap((company) => {
    const start = dateToMonth(company.startDate, false, presentMonth);
    const end = dateToMonth(company.isCurrent ? "Present" : company.endDate, true, presentMonth);
    return start === null || end === null || start > end ? [] : [{ company, start, end }];
  });
  const overlaps: string[] = [];
  for (let i = 0; i < periods.length; i++) for (let j = i + 1; j < periods.length; j++) {
    const a = periods[i]!; const b = periods[j]!;
    if (a.start <= b.end && b.start <= a.end) overlaps.push(`${a.company.companyName} overlaps ${b.company.companyName}`);
  }
  const merged: { start: number; end: number }[] = [];
  for (const period of [...periods].sort((a, b) => a.start - b.start)) {
    const last = merged.at(-1);
    if (last && period.start <= last.end + 1) last.end = Math.max(last.end, period.end);
    else merged.push({ start: period.start, end: period.end });
  }
  const totalMonths = merged.reduce((sum, period) => sum + period.end - period.start + 1, 0);
  return { totalMonths, years: Math.floor(totalMonths / 12), remainingMonths: totalMonths % 12, overlaps, validPeriods: periods.length };
}

export function proposeJDTimeline(companies: CompanySettings[], analysis: JDAnalysis, configuredMax: number, today = new Date()) {
  const targetYears = targetExperienceWindow(analysis, configuredMax);
  if (!companies.length) return { targetYears, industry: analysis.industry, companyLimit: 0, entries: [] as { id: string; companyName: string; sourceStartDate: string; sourceEndDate: string; proposedStartDate: string; proposedEndDate: string; industryMatch: boolean; durationMonths: number }[] };
  const months = Math.max(1, Math.round(targetYears * 12));
  const maxEmployerCount = Math.max(1, Math.min(companies.length, months));
  const ranked = companies.map((company, originalIndex) => ({ company, originalIndex, industryMatch: industryMatches(company, analysis.industry) }));
  const matched = ranked.some((item) => item.industryMatch);
  const ordered = (matched ? [...ranked].sort((a, b) => Number(b.industryMatch) - Number(a.industryMatch) || a.originalIndex - b.originalIndex) : ranked)
    .slice(0, maxEmployerCount);
  const baseMonths = Math.floor(months / ordered.length);
  const remainder = months % ordered.length;
  const durationById = new Map(ordered.map((item, index) => [companyId(item.company), baseMonths + (index < remainder ? 1 : 0)]));
  const currentMonth = today.getFullYear() * 12 + today.getMonth();
  let cursor = currentMonth - months + 1;
  const chronological = [...ordered].reverse();
  const chronologicalEntries = chronological.map(({ company }) => {
    const id = companyId(company); const duration = durationById.get(id) ?? 1;
    const start = cursor; const end = cursor + duration - 1; cursor = end + 1;
    return { id, companyName: company.companyName, sourceStartDate: company.startDate, sourceEndDate: company.isCurrent ? "Present" : company.endDate, proposedStartDate: formatMonth(start), proposedEndDate: end === currentMonth ? "Present" : formatMonth(end), industryMatch: industryMatches(company, analysis.industry), durationMonths: duration };
  });
  const byId = new Map(chronologicalEntries.map((entry) => [entry.id, entry]));
  return {
    targetYears, industry: analysis.industry, companyLimit: maxEmployerCount,
    entries: ordered.map(({ company }) => byId.get(companyId(company))!),
  };
}

export function applyProposedTimelineDates(resume: Resume, entries: ReturnType<typeof proposeJDTimeline>["entries"]) {
  const proposed = new Map(entries.map((entry) => [entry.id, entry]));
  return {
    ...resume,
    experience: resume.experience.map((job) => {
      const dates = proposed.get(job.id);
      return dates ? { ...job, startDate: dates.proposedStartDate, endDate: dates.proposedEndDate } : job;
    }),
  };
}
