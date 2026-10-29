import type { ExperienceItem } from "@/types/resume";

export interface JdExperienceTarget {
  requiredYears: number;
  targetResumeYears: number;
  sourceText: string;
}

export interface ProposedTimeline {
  targetYears: number;
  targetMonths: number;
  referenceDate: string;
  reference: "user-directed proposal; requires candidate review";
  experience: ExperienceItem[];
  changes: Array<{ id: string; company: string; originalStartDate: string; originalEndDate: string; proposedStartDate: string; proposedEndDate: string }>;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function currentChicagoMonth(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(now);
  const year = Number(parts.find(part => part.type === "year")?.value);
  const month = Number(parts.find(part => part.type === "month")?.value);
  const day = Number(parts.find(part => part.type === "day")?.value);
  return { monthIndex: year * 12 + month - 1, date: year + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0") };
}

function parseMonthDate(value: string, end = false, currentMonth = currentChicagoMonth().monthIndex): number | null {
  if (/^(present|current|now)$/i.test(value.trim())) return currentMonth;
  const match = value.trim().match(/^([a-z]+)\s+(\d{4})$/i);
  if (!match) return null;
  const month = MONTHS.findIndex(name => name.toLowerCase() === match[1].slice(0, 3).toLowerCase());
  return month < 0 ? null : Number(match[2]) * 12 + month + (end ? 1 : 0);
}

function formatMonth(monthIndex: number) {
  const year = Math.floor(monthIndex / 12);
  const month = monthIndex - year * 12;
  return MONTHS[month] + " " + year;
}

function allocateMonths(total: number, weights: number[]) {
  const minimum = total >= weights.length * 6 ? 6 : 1;
  const remaining = total - minimum * weights.length;
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0) || weights.length;
  const exactExtras = weights.map(weight => remaining * (weight || 1) / weightTotal);
  const extras = exactExtras.map(Math.floor);
  const left = remaining - extras.reduce((sum, value) => sum + value, 0);
  const priority = exactExtras.map((value, index) => ({ index, remainder: value - extras[index] })).sort((a, b) => b.remainder - a.remainder);
  for (let index = 0; index < left; index++) extras[priority[index % priority.length].index]++;
  return extras.map(value => value + minimum);
}

/** Generate contiguous proposed month/year dates across source employers, preserving all other fields. */
export function proposeEmploymentTimeline(experience: ExperienceItem[], targetYears: number, now = new Date()): ProposedTimeline | null {
  if (!experience.length || !Number.isFinite(targetYears) || targetYears <= 0 || targetYears > 50) return null;
  const targetMonths = Math.round(targetYears * 12);
  if (targetMonths < experience.length) return null;
  const current = currentChicagoMonth(now);
  const chronology = experience.map((item, index) => {
    const sourceStart = parseMonthDate(item.startDate, false, current.monthIndex);
    const sourceEnd = parseMonthDate(item.endDate, true, current.monthIndex);
    const weight = sourceStart !== null && sourceEnd !== null && sourceEnd > sourceStart ? sourceEnd - sourceStart : 1;
    return { item, index, sourceStart, weight };
  }).sort((a, b) => a.sourceStart === null || b.sourceStart === null ? a.index - b.index : a.sourceStart - b.sourceStart);
  const durations = allocateMonths(targetMonths, chronology.map(item => item.weight));
  let cursor = current.monthIndex - targetMonths;
  const next = new Map<string, ExperienceItem>();
  const changes: ProposedTimeline["changes"] = [];
  chronology.forEach((entry, index) => {
    const duration = durations[index];
    const startDate = formatMonth(cursor);
    cursor += duration;
    const isCurrent = index === chronology.length - 1 && /^(present|current|now)$/i.test(entry.item.endDate.trim());
    const endDate = isCurrent ? "Present" : formatMonth(cursor - 1);
    next.set(entry.item.id, { ...entry.item, startDate, endDate });
    changes.push({ id: entry.item.id, company: entry.item.company, originalStartDate: entry.item.startDate, originalEndDate: entry.item.endDate, proposedStartDate: startDate, proposedEndDate: endDate });
  });
  return {
    targetYears,
    targetMonths,
    referenceDate: current.date,
    reference: "user-directed proposal; requires candidate review",
    experience: experience.map(item => next.get(item.id) ?? item),
    changes: experience.map(item => changes.find(change => change.id === item.id)!),
  };
}

/** Extract the first explicit minimum/range of years from a JD and add one target year. */
export function jdExperienceTarget(jd: string): JdExperienceTarget | null {
  const text = jd.replace(/[–—]/g, "-");
  const patterns = [
    /\b(?:minimum|min\.?|at least)\s*(\d+(?:\.\d+)?)\s*(?:\+\s*)?(?:years?|yrs?)\b[^.\n]{0,70}\bexperience\b/i,
    /\b(\d+(?:\.\d+)?)\s*(?:\+\s*)?(?:-|to)\s*\d+(?:\.\d+)?\s*(?:years?|yrs?)\b[^.\n]{0,70}\bexperience\b/i,
    /\b(\d+(?:\.\d+)?)\s*\+\s*(?:years?|yrs?)\s+(?:of\s+)?(?:relevant\s+|professional\s+|hands[- ]on\s+)?experience\b/i,
    /\b(\d+(?:\.\d+)?)\s*(?:years?|yrs?)\s+(?:of\s+)?(?:relevant\s+|professional\s+|hands[- ]on\s+)?experience\b/i,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (!match) continue;
    const requiredYears = Number(match[1]);
    if (!Number.isFinite(requiredYears) || requiredYears <= 0 || requiredYears > 50) continue;
    return { requiredYears, targetResumeYears: requiredYears + 1, sourceText: match[0].trim() };
  }
  return null;
}
