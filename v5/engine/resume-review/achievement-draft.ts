import type { MasterResume } from "@/types/resume";
import { numericOutcome } from "@/engine/resume-review/jd-workflow";

export const METRIC_DRAFT_VERSION = 3;
export type DraftMetricEdit = {employerId:string;index:number;original:string;replacement:string;outcome?:string;status:"unverified generated example"};
// Select actual outcome categories across the whole resume, not synonyms for one result.
const opportunities = [
  {family:"query",test:/\b(?:sql|quer(?:y|ies)|index(?:es|ing)?)\b.*\b(?:optim|tun|execution.plan)|\b(?:optim|tun)\w*\b.*\b(?:sql|quer(?:y|ies))\b/i, outcome:"query execution time"},
  {family:"compute",test:/\b(?:spark|job|dataframe)\b.*\b(?:optim|tun|partition|caching)|\b(?:optim|tun)\w*\b.*\b(?:spark|job|dataframe)/i, outcome:"processing runtime"},
  {family:"shuffle",test:/\b(?:reduc|refactor|optim|tun|broadcast)\w*\b.*\b(?:shuffle|join)|\b(?:shuffle|join)\b.*\b(?:reduc|refactor|optim|tun)/i,outcome:"shuffle data volume"},
  {family:"tests",test:/\b(?:unit tests?|test automation|automated tests?|regression tests?)\b/i,outcome:"regression testing time"},
  {family:"release",test:/\bci\/cd\b|\bautomat\w*.*\b(?:deploy|release)|\b(?:deploy|release)\w*.*\bautomat/i,outcome:"deployment preparation time"},
  {family:"orchestration",test:/\b(?:orchestrat)\w*|\bworkflows?\b.*\b(?:schedul|retries|retry|dependent|dependencies)/i,outcome:"time spent manually coordinating job runs"},
  {family:"reconciliation",test:/\b(?:reconcil|source.to.target|mismatched reporting totals)\w*/i,outcome:"manual reconciliation effort"},
  {family:"validation",test:/\b(?:validat|cleans|schema enforcement|required.field)\w*/i,outcome:"invalid records reaching downstream processing"},
  {family:"duplicates",test:/\b(?:deduplicat|duplicate detection|duplicate identifiers|duplicate records)\w*/i,outcome:"duplicate records in published datasets"},
  {family:"recovery",test:/\b(?:restartable|failure recovery|recovery procedures|restart steps|failed.*restart)\b/i,outcome:"failed-run recovery time"},
  {family:"incremental",test:/\b(?:incremental|unchanged source|source update timestamps)\b/i,outcome:"records reprocessed during recurring loads"},
  {family:"diagnosis",test:/\b(?:troubleshoot|diagnos|debug|investigat)\w*/i,outcome:"issue investigation time"},
  {family:"latency",test:/\b(?:latency|response time|request processing|performance tun)\w*/i,outcome:"response latency"},
];

function achievementText(action:string,outcome:string,percent:number,variant:number) {
  const clause=action.trim().replace(/[.;]+$/, "");
  // Retain the implementation verbatim; vary result placement without inventing mechanisms.
  const result=`${outcome} by ${percent}%`;
  if(variant===1)return `${clause}. This reduced ${result}.`;
  if(variant===2)return `${clause}, cutting ${result}.`;
  return `${clause}, reducing ${result}.`;
}
export function strengthenDraftMetrics(input: MasterResume) {
  const resume=structuredClone(input);
  const edits: DraftMetricEdit[]=[];
  const usage=new Map<string,number>();
  // Include pre-existing outcome language when choosing new examples, but never edit it.
  for(const text of resume.experience.flatMap(e=>e.responsibilities).filter(t=>numericOutcome.test(t))) {
    for(const rule of opportunities)if(text.toLowerCase().includes(rule.outcome))usage.set(rule.family,(usage.get(rule.family)||0)+1);
  }
  resume.experience.forEach((employer,employerIndex)=>{
    let count=employer.responsibilities.filter(t=>numericOutcome.test(t)).length;
    const used=new Set<string>();
    while(count<2) {
      const candidates=employer.responsibilities.flatMap((original,index)=>numericOutcome.test(original)?[]:opportunities.flatMap((rule,order)=>!used.has(rule.family)&&rule.test.test(rule.family==="query"?original.replace(/Adaptive Query Execution/gi,""):original)?[{original,index,rule,order}]:[]));
      candidates.sort((a,b)=>(usage.get(a.rule.family)||0)-(usage.get(b.rule.family)||0)||a.order-b.order||a.index-b.index);
      const choice=candidates[0];
      if(!choice)break;
      const {original,index,rule}=choice;
      used.add(rule.family);usage.set(rule.family,(usage.get(rule.family)||0)+1);
      const percent=18+((employerIndex*7+index*3)%17);
      // Remove a trailing drafting instruction, not candidate-authored work history.
      const action=original
        .replace(/;\s*evaluate\s+[^.;]*\b(?:reductions|improvements)\s+against\s+recorded\s+[^.;]*baselines\.?\s*$/i,"")
        .replace(/,\s*focusing on measurable (?:reductions|improvements) in [^.;]+\.?\s*$/i,"");
      const replacement=achievementText(action,rule.outcome,percent,edits.length%3);
      employer.responsibilities[index]=replacement;count++;
      edits.push({employerId:employer.id,index,original,replacement,outcome:rule.outcome,status:"unverified generated example"});
    }
  });
  return {resume,edits};
}

/** Only regenerate untouched app-authored examples. User edits and other numbers stay intact. */
export function refreshDraftMetrics(input: MasterResume, previous: DraftMetricEdit[]) {
  const original=structuredClone(input);
  for(const edit of previous) {
    if(edit.status!=="unverified generated example")continue;
    const employer=original.experience.find(e=>e.id===edit.employerId);
    if(employer?.responsibilities[edit.index]===edit.replacement)employer.responsibilities[edit.index]=edit.original;
  }
  return strengthenDraftMetrics(original);
}
