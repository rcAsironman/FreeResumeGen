import { overallExperience } from "@/engine/resume-review/jd-workflow";
import type { ExperienceItem } from "@/types/resume";

export interface JdExperienceTarget {
  requiredYears: number;
  targetResumeYears: number;
  sourceText: string;
}

export interface StudyDates { start: string; end: string; cpt: string }
export function studyExclusion(dates: StudyDates): {start:number;end:number} | null {
  const month=(value:string)=>{if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(value))return NaN;const [y,m]=value.split('-').map(Number);return y*12+m-1;};
  const start=month(dates.start), graduation=month(dates.end);
  const end=dates.cpt?month(dates.cpt):graduation+1;
  if(!Number.isFinite(start)||!Number.isFinite(graduation)||!Number.isFinite(end)||graduation<start||end<start||end>graduation+1)throw new Error('Check master’s start, end and CPT months. CPT must be within the study period; leave it blank if none.');
  return end===start?null:{start,end};
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
export function proposeEmploymentTimeline(experience: ExperienceItem[], targetYears: number, now = new Date(), study?: StudyDates): ProposedTimeline | null {
  if (!experience.length || !Number.isFinite(targetYears) || targetYears <= 0 || targetYears > 50) return null;
  const targetMonths = Math.round(targetYears * 12);
  if (targetMonths < experience.length) return null;
  const current = currentChicagoMonth(now);
  const excluded=study?studyExclusion(study):null;
  if(new Set(experience.map(e=>e.id)).size!==experience.length)return null;
  const chronology = experience.map((item, index) => {
    const sourceStart = parseMonthDate(item.startDate, false, current.monthIndex);
    const sourceEnd = parseMonthDate(item.endDate, true, current.monthIndex);
    const weight = sourceStart !== null && sourceEnd !== null && sourceEnd > sourceStart ? sourceEnd - sourceStart : 1;
    return { item, index, sourceStart, weight };
  }).sort((a, b) => a.sourceStart === null || b.sourceStart === null ? a.index - b.index : a.sourceStart - b.sourceStart);
  const durations = allocateMonths(targetMonths, chronology.map(item => item.weight));
  if(excluded) {
    const recentMonths=Math.max(0,current.monthIndex-excluded.end);
    if(recentMonths>0&&targetMonths>recentMonths) {
      if(chronology.length<2||targetMonths-recentMonths<chronology.length-1)return null;
      const earlier=allocateMonths(targetMonths-recentMonths,chronology.slice(0,-1).map(e=>e.weight));
      durations.splice(0,durations.length,...earlier,recentMonths);
    }
    let cursor=current.monthIndex;
    const result=new Map<string,ExperienceItem>();
    const changes:ProposedTimeline['changes']=[];
    for(let i=chronology.length-1;i>=0;i--) {
      if(cursor>excluded.start&&cursor<=excluded.end)cursor=excluded.start;
      let duration=durations[i];
      if(cursor>excluded.end&&cursor-duration<excluded.end) {
        if(i===0)return null; // A single employment interval cannot straddle a study gap.
        const available=cursor-excluded.end;
        durations[i-1]+=duration-available; duration=available;
      }
      const entry=chronology[i];
      const startDate=formatMonth(cursor-duration);
      const endDate=cursor===current.monthIndex&&/^(present|current|now)$/i.test(entry.item.endDate.trim())?'Present':formatMonth(cursor-1);
      cursor-=duration;
      result.set(entry.item.id,{...entry.item,startDate,endDate});
      changes.push({id:entry.item.id,company:entry.item.company,originalStartDate:entry.item.startDate,originalEndDate:entry.item.endDate,proposedStartDate:startDate,proposedEndDate:endDate});
    }
    return {targetYears,targetMonths,referenceDate:current.date,reference:'user-directed proposal; requires candidate review',experience:experience.map(e=>result.get(e.id)!),changes:experience.map(e=>changes.find(c=>c.id===e.id)!)};
  }
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

/** Shared overall-experience interpretation; no hidden extra year. */
export function jdExperienceTarget(jd: string): JdExperienceTarget | null {
  const requiredYears = overallExperience(jd);
  return requiredYears === null ? null : { requiredYears, targetResumeYears: requiredYears, sourceText: "Overall experience requirement from current JD" };
}
