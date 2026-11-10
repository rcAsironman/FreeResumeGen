import type { MasterResume } from "@/types/resume";
import { hasMetric, PROPOSED_METRIC_STATUS } from "@/engine/resume-review/metric-review";

export const METRIC_DRAFT_VERSION = 5;
export type DraftMetricEdit = {employerId:string;index:number;original:string;replacement:string;outcome?:string;status:typeof PROPOSED_METRIC_STATUS|"unverified generated example"};
// Select actual outcome categories across the whole resume, not synonyms for one result.
type Opportunity={family:string;test:RegExp;outcome:string;value?:number;unit?:string};
const opportunities:Opportunity[] = [
 {family:"dc-rework",test:/\b(?:reduc|improv|prevent|correct)\w*\b.*\b(?:cabling errors|cabling rework|cable labeling errors)|\b(?:cabling errors|cabling rework)\b.*\b(?:reduc|prevent)\w*/i,outcome:"cabling rework"},
 {family:"dc-repair",test:/\b(?:streamlin|improv|reduc|standardiz)\w*\b.*\b(?:hardware repair|repair turnaround|hardware troubleshooting)/i,outcome:"hardware repair turnaround time"},
 {family:"rack-stack",test:/\brack[- ](?:and[- ]|&[- ]?)stack\b|\brack[- ]mount(?:ed|ing)?\b.*\b(?:install|deploy)\w*/i,outcome:"rack deployment work",value:2,unit:"racks per month"},
 {family:"fiber-test",test:/\b(?:test|inspect|check|validat)\w*\b.*\b(?:fiber|copper|patch panel|cabl)|\b(?:fiber|copper|cabl)\w*\b.*\b(?:test|inspect|validat)\w*/i,outcome:"physical connectivity checks",value:12,unit:"connections per month"},
 {family:"hardware-tickets",test:/\b(?:resolv|clos|handl)\w*\b.*\b(?:hardware|data center)\b.*\btickets?\b/i,outcome:"hardware ticket resolution",value:10,unit:"tickets per month"},
 {family:"server-install",test:/\b(?:install|deploy)\w*\b.*\bservers?\b|\bservers?\b.*\b(?:install|deploy)\w*/i,outcome:"server installations",value:6,unit:"servers per month"},
 {family:"rack",test:/\bcommission\w*\b.*\bracks?\b/i,outcome:"rack commissioning",value:2,unit:"racks per month"},
 {family:"cabling",test:/\b(?:install|terminat|rout|patch)\w*\b.*\b(?:fiber|copper|cabl)/i,outcome:"cabling work",value:12,unit:"connections per month"},
 {family:"inventory",test:/\b(?:reconcil|inspect|record|inventor)\w*\b.*\b(?:assets?|equipment|serial|deliver)/i,outcome:"equipment inventory",value:20,unit:"assets per month"},
 {family:"hardware",test:/\b(?:replac|repair)\w*\b.*\b(?:memory|power suppl\w*|hardware|modules?|components?|fans?|disks?)\b/i,outcome:"hardware maintenance",value:8,unit:"devices per month"},

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
  for(const text of resume.experience.flatMap(e=>e.responsibilities).filter(t=>hasMetric(t))) {
    for(const rule of opportunities)if(text.toLowerCase().includes(rule.outcome))usage.set(rule.family,(usage.get(rule.family)||0)+1);
  }
  resume.experience.forEach((employer)=>{
    let count=employer.responsibilities.filter(t=>hasMetric(t)).length;
    const used=new Set<string>();
    while(count<2) {
      const candidates=employer.responsibilities.flatMap((original,index)=>hasMetric(original)?[]:opportunities.flatMap((rule,order)=>!used.has(rule.family)&&rule.test.test(rule.family==="query"?original.replace(/Adaptive Query Execution/gi,""):original)?[{original,index,rule,order}]:[]));
      candidates.sort((a,b)=>(usage.get(a.rule.family)||0)-(usage.get(b.rule.family)||0)||a.order-b.order||a.index-b.index);
      const choice=candidates[0];
      if(!choice)break;
      const {original,index,rule}=choice;
      used.add(rule.family);usage.set(rule.family,(usage.get(rule.family)||0)+1);
      // Conservative task-specific drafting assumptions, not measured results or
      // industry benchmarks. No index-based pseudo-performance calculation.
      const percent=({"dc-rework":10,"dc-repair":12,query:15,compute:12,shuffle:10,tests:15,release:20,orchestration:10,reconciliation:15,validation:10,duplicates:12,recovery:10,incremental:15,diagnosis:10,latency:12} as Record<string,number>)[rule.family]??10;
      // Remove a trailing drafting instruction, not candidate-authored work history.
      const action=original
        .replace(/;\s*evaluate\s+[^.;]*\b(?:reductions|improvements)\s+against\s+recorded\s+[^.;]*baselines\.?\s*$/i,"")
        .replace(/,\s*focusing on measurable (?:reductions|improvements) in [^.;]+\.?\s*$/i,"");
      const replacement=rule.unit
        ? action.trim().replace(/[.;]+$/, '')+', covering '+rule.value+' '+rule.unit+'.'
        : achievementText(action,rule.outcome,percent,edits.length%3);
      employer.responsibilities[index]=replacement;count++;
      edits.push({employerId:employer.id,index,original,replacement,outcome:rule.outcome,status:PROPOSED_METRIC_STATUS});
    }
  });
  return {resume,edits};
}

/** Only regenerate untouched app-authored examples. User edits and other numbers stay intact. */
export function refreshDraftMetrics(input: MasterResume, previous: DraftMetricEdit[]) {
  const original=structuredClone(input);
  for(const edit of previous) {
    if(edit.status!=="unverified generated example" && edit.status!==PROPOSED_METRIC_STATUS)continue;
    const employer=original.experience.find(e=>e.id===edit.employerId);
    if(employer?.responsibilities[edit.index]===edit.replacement)employer.responsibilities[edit.index]=edit.original;
  }
  return strengthenDraftMetrics(original);
}
