const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),load=require('./load-ts.cjs');
const {generalGenerationPrompt}=load('prompts/general-resume.ts'),{analyzeLocally,reviewDraft}=load('engine/resume-review/jd-workflow.ts');
const source=JSON.parse(fs.readFileSync('data/general/master-resume-data-center.json'));
const jd='Role: Data Center Technician\n4 years of experience\nServer deployments, hardware repair and fiber cabling';
const analysis=analyzeLocally(jd),study={start:'2024-01',end:'2025-12',cpt:'2025-01'};
test('each selected mode dispatches to a distinct builder and maintains metrics/schema',()=>{
 const prompts=['full-time','c2c','data-center'].map(mode=>generalGenerationPrompt(jd,analysis,source,[],mode,4,study));
 assert(prompts[0].startsWith('FULL-TIME JD-DRIVEN RESUME PROMPT'));
 assert(prompts[1].startsWith('C2C JD-DRIVEN RESUME PROMPT'));
 assert(prompts[2].startsWith('DATA CENTER JD-DRIVEN RESUME PROMPT'));
 assert(!prompts[0].includes('C2C RESUME CONTRACT'));assert(!prompts[1].includes('FULL-TIME RESUME CONTRACT'));assert(!prompts[0].includes('DATA CENTER SINGLE-PAGE CONTRACT'));
 assert(prompts[2].includes('Education appears last'));assert(prompts[0].includes('candidate-specified CPT start'));assert(!prompts[1].includes('candidate-specified CPT start'));
 for(const p of prompts){assert(p.includes('ACHIEVEMENT DRAFTING'));assert(p.includes('AT MOST 20%'));assert(p.includes('OUTPUT CONTRACT — RETURN ALL THESE ROOTS AND REQUIRED FIELDS'));}
 const locked=generalGenerationPrompt(jd,analysis,source,[],'c2c',2,study,true);assert(locked.includes('LOCKED SOURCE HISTORY'));assert(!locked.includes('Selected timeline: 2 years'));
 assert.throws(()=>generalGenerationPrompt(jd,analysis,source,[],'data-center',5),/between 1 and 4/);
});
test('20% threshold is pairwise duplicate-bullet coverage, with one-to-one matches',()=>{
 const {employerResponsibilityOverlap}=load('engine/resume-review/responsibility-similarity.ts');
 const same='Implemented PostgreSQL query optimization using targeted indexes and execution plan analysis for billing transactions.';
 const different=['Configured access policies for account records with restricted administrative permissions.','Documented site equipment inventory reconciliation procedures for receiving staff.','Inspected fiber connections and cable labeling before commissioning storage hardware.','Prepared release schedules with dependency tracking and operational readiness reviews.'];
 const left={company:'A',responsibilities:[same,...different]};
 const right={company:'B',responsibilities:[same,'Replaced failed memory modules and recorded diagnostic checks in maintenance tickets.','Created customer-facing forms with accessible validation messages and keyboard navigation.','Designed backup retention rules and reviewed restoration runbooks with the operations team.','Automated vendor invoice reconciliation and exception routing for finance approvals.']};
 let result=employerResponsibilityOverlap([left,right])[0];assert.equal(result.leftPercent,20);assert.equal(result.exceedsTarget,false);
 right.responsibilities[1]=different[0];result=employerResponsibilityOverlap([left,right])[0];assert.equal(result.leftPercent,40);assert(result.exceedsTarget);
 const r=structuredClone(source);r.experience=r.experience.map((e,i)=>({...e,...[left,right][i]}));assert(reviewDraft(r,source,jd).some(f=>f.text.includes('overlap estimate')&&f.text.includes('40%')));
 const before=JSON.stringify(r);reviewDraft(r,source,jd);assert.equal(JSON.stringify(r),before);
 const repeated=employerResponsibilityOverlap([{company:'A',responsibilities:[same,same]},{company:'B',responsibilities:[same]}])[0];assert.equal(repeated.matched,1);
});
