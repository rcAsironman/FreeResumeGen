const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),load=require('./load-ts.cjs');
const source=JSON.parse(fs.readFileSync('data/general/master-resume-data-center.json','utf8'));
const {proposeEmploymentTimeline}=load('engine/resume-review/experience-target.ts');
const {careerDuration}=load('engine/resume-review/content-review.ts');
const {generalGenerationPrompt}=load('prompts/general-resume.ts');
const {analyzeLocally}=load('engine/resume-review/jd-workflow.ts');
const study={start:'2024-01',end:'2025-12',cpt:'2025-01'};
test('Data Center source is independent and uses requested employers',()=>{
 assert(load('engine/validation/resume.schema.ts').masterResumeSchema.safeParse(source).success);
 assert.deepEqual(source.experience.map(e=>[e.company,e.location]),[['TierPoint','St. Louis, MO'],['NTT Global Data Centers','Bengaluru']]);
 const {sourceMatchesEmploymentType}=load('engine/resume-review/source-contract.ts');
 assert(sourceMatchesEmploymentType('general','master-resume-data-center.json',source,'data-center'));
 assert(!sourceMatchesEmploymentType('general','master-resume-data-center.json',source,'full-time'));
 assert(!sourceMatchesEmploymentType('general','master-resume-data-center.json',source,'c2c'));
});
test('each 1–4-year timeline counts work months and excludes pre-CPT study',()=>{
 const now=new Date('2026-11-09T18:00:00Z');
 for(let years=1;years<=4;years++){
  const t=proposeEmploymentTimeline(source.experience,years,now,study);
  assert.equal(careerDuration(t.experience,now).totalMonths,12*years);
  assert.equal(t.experience[0].endDate,'Present');
  assert(t.experience.every(e=>!e.startDate.endsWith('2024')&&!e.endDate.endsWith('2024')));
  if(years>=2){assert.equal(t.experience[0].startDate,'Jan 2025');assert.equal(t.experience[1].endDate,'Dec 2023');}
 }
});
test('single-page prompt overrides generic long-resume and forced metric rules',()=>{
 const jd='Data Center Technician: rack and stack, cabling, hardware diagnostics';
 const p=generalGenerationPrompt(jd,analyzeLocally(jd),source,['experience'],'data-center',3,study);
 assert(p.includes('DATA CENTER SINGLE-PAGE CONTRACT'));
 assert(p.includes('Education appears last'));
 assert(p.includes('2–3 proposed quantitative suggestions'));assert(p.includes('PROPOSED — REQUIRES CANDIDATE VERIFICATION'));
 assert(!p.includes('Zero is not acceptable'));
 assert(p.includes('candidate-specified CPT start: 2025-01'));
});
test('single page content guard refuses excess instead of clipping',()=>{
 const {validateDataCenterContent}=load('templates/data-center/validate.ts');
 validateDataCenterContent(source);
 const large=structuredClone(source);large.experience[0].responsibilities=Array(7).fill('Maintained server hardware.');
 assert.throws(()=>validateDataCenterContent(large),/six responsibilities/);
});
