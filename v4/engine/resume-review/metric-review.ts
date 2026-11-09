import { z } from 'zod';
import type { MasterResume } from '@/types/resume';

export const PROPOSED_METRIC_STATUS='PROPOSED — REQUIRES CANDIDATE VERIFICATION' as const;
// Outcomes and operational scope; deliberately exclude dates, software versions,
// electrical ratings, interface names, 24/7 schedules and years of experience.
const metricPattern=/\b\d+(?:\.\d+)?(?:\s*[–-]\s*\d+(?:\.\d+)?)?\+?\s*(?:%|percent\b|milliseconds?\b|ms\b|seconds?\b|minutes?\b|hours?\b|(?:monthly\s+|weekly\s+|daily\s+)?(?:servers?|racks?|tickets?|installations?|deployments?|incidents?|cables?|connections?|ports?|assets?|devices?|records?|transactions?|requests?|users?|tests?|reports?|workflows?|jobs?|pipelines?)\b|million\b)/gi;
export function metricValues(text:string) {return [...text.matchAll(metricPattern)].map(m=>({value:m[0].match(/^[\d.]+(?:\s*[–-]\s*[\d.]+)?\+?/)![0],unit:m[0].replace(/^[\d.]+(?:\s*[–-]\s*[\d.]+)?\+?\s*/,''),text:m[0]}));}
export function hasMetric(text:string) {return metricValues(text).length>0;}
export const verifiedMetricSchema=z.object({employerId:z.string(),text:z.string(),evidence:z.string().trim().min(12),confirmed:z.literal(true)});
export const metricExportFields={exportMode:z.enum(['draft','submission']).default('submission'),verifiedMetrics:z.array(verifiedMetricSchema).default([])};
export type VerifiedMetric=z.infer<typeof verifiedMetricSchema>;
export type MetricReviewRecord={employerId:string;employer:string;path:string;responsibility:string;estimatedValue:string;unit:string;status:typeof PROPOSED_METRIC_STATUS|'CANDIDATE VERIFIED';verificationQuestion:string;evidence?:string};
export function metricRecords(resume:MasterResume,verified:VerifiedMetric[]=[]):MetricReviewRecord[] {
 const rows:MetricReviewRecord[]=[];
 function scan(text:string,path:string,employerId:string,employer:string){
  const proof=verified.find(v=>v.employerId===employerId&&v.text===text&&verifiedMetricSchema.safeParse(v).success);
  for(const metric of metricValues(text)) rows.push({employerId,employer,path,responsibility:text,estimatedValue:metric.value,unit:metric.unit,status:proof?'CANDIDATE VERIFIED':PROPOSED_METRIC_STATUS,evidence:proof?.evidence,verificationQuestion:`What record or evidence-based estimate supports ${metric.text} for this work at ${employer}? Confirm the timeframe, your contribution and the outcome measured; a general resume confirmation is not evidence.`});
 }
 resume.professionalSummary.bullets.forEach((t,i)=>scan(t,`professionalSummary.bullets.${i}`,'summary','Career summary'));
 resume.experience.forEach((e,i)=>{e.responsibilities.forEach((t,j)=>scan(t,`experience.${i}.responsibilities.${j}`,e.id,e.company));e.environment.forEach((t,j)=>scan(t,`experience.${i}.environment.${j}`,e.id,e.company));if(e.description)scan(e.description,`experience.${i}.description`,e.id,e.company);});
 resume.projects.forEach((p,i)=>{scan(p.description,`projects.${i}.description`,p.id,p.name);p.highlights.forEach((t,j)=>scan(t,`projects.${i}.highlights.${j}`,p.id,p.name));});
 resume.technicalSkills.categories.forEach((c,i)=>c.skills.forEach((t,j)=>scan(t,`technicalSkills.categories.${i}.skills.${j}`,'skills','Skills')));
 return rows;
}
/** Submission exports omit unsupported numerical statements; never strip numbers
 * alone and leave a misleading causal claim. The editable draft stays untouched. */
export function prepareMetricExport(input:MasterResume,mode:'draft'|'submission',verified:VerifiedMetric[]=[]) {
 const resume=structuredClone(input),records=metricRecords(resume,verified);
 if(mode==='draft') return {resume,records,excluded:0};
 const paths=new Set(records.filter(r=>r.status===PROPOSED_METRIC_STATUS).map(r=>r.path));
 resume.professionalSummary.bullets=resume.professionalSummary.bullets.filter((_,i)=>!paths.has(`professionalSummary.bullets.${i}`));
 resume.experience.forEach((e,i)=>{e.responsibilities=e.responsibilities.filter((_,j)=>!paths.has(`experience.${i}.responsibilities.${j}`));e.environment=e.environment.filter((_,j)=>!paths.has(`experience.${i}.environment.${j}`));if(paths.has(`experience.${i}.description`))e.description='';if(e.responsibilityGroups?.length&&paths.size)delete e.responsibilityGroups;});
 resume.projects.forEach((p,i)=>{if(paths.has(`projects.${i}.description`))p.description='';p.highlights=p.highlights.filter((_,j)=>!paths.has(`projects.${i}.highlights.${j}`));});
 resume.technicalSkills.categories.forEach((c,i)=>{c.skills=c.skills.filter((_,j)=>!paths.has(`technicalSkills.categories.${i}.skills.${j}`));});
 if(!resume.professionalSummary.bullets.length)resume.professionalSummary.bullets=[resume.personalInfo.professionalTitle];
 return {resume,records,excluded:paths.size};
}
