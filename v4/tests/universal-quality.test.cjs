const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),load=require('./load-ts.cjs');
const {strengthenDraftMetrics}=load('engine/resume-review/achievement-draft.ts');const {technologyTenureGaps}=load('engine/resume-review/tenure.ts');const {reviewDraft}=load('engine/resume-review/jd-workflow.ts');
const source=JSON.parse(fs.readFileSync('data/general/master-resume-general.json','utf8'));
test('latest Databricks draft varies relevant outcomes across employers',()=>{
 const input=JSON.parse(fs.readFileSync('tests/fixtures/databricks-latest-response.json','utf8'));
 const result=strengthenDraftMetrics(input);
 assert.equal(result.edits.length,10);
 const outcomes=result.edits.map(e=>e.outcome);
 assert(new Set(outcomes).size>=7);
 assert(outcomes.filter(o=>o==='manual reconciliation effort').length<=1);
 assert(result.resume.experience.every(e=>e.responsibilities.filter(b=>/\d+%/.test(b)).length===2));
 const spark=result.edits.find(e=>e.original.includes('Adaptive Query Execution'));
 assert(spark);assert(!spark.replacement.includes('evaluate processing-time'));
 assert(!spark.replacement.includes('reducing query execution time'));
 assert.equal(strengthenDraftMetrics(result.resume).edits.length,0);
 assert(result.edits.some(e=>e.replacement.includes('. This reduced ')));
 assert(result.edits.some(e=>e.replacement.includes(', cutting ')));
 assert(result.edits.every(e=>!e.replacement.includes('manual execution effort')));
});
test('testing automation does not become deployment or scheduling performance',()=>{
 const input=structuredClone(source);
 input.experience=[{...input.experience[0],responsibilities:['Developed automated tests for Apex workflows.','Attended deployment planning meetings.']}];
 const result=strengthenDraftMetrics(input);
 assert.equal(result.edits.length,1);
 assert.equal(result.edits[0].outcome,'regression testing time');
 assert.equal(result.resume.experience[0].responsibilities[1],input.experience[0].responsibilities[1]);
});
test('replaces vague measurement aspiration without stacking duplicate outcomes',()=>{
 const input=structuredClone(source);
 input.experience=[{...input.experience[0],responsibilities:['Optimized Spark jobs through partition sizing, focusing on measurable reductions in job execution time.']}];
 const result=strengthenDraftMetrics(input);
 assert.equal(result.edits.length,1);
 assert(!result.edits[0].replacement.includes('focusing on measurable'));
 assert(result.edits[0].replacement.includes('partition sizing'));
 assert.equal(result.edits[0].original,input.experience[0].responsibilities[0]);
});
test('migration regenerates only untouched app-authored examples',()=>{
 const {refreshDraftMetrics}=load('engine/resume-review/achievement-draft.ts');
 const input=structuredClone(source);
 input.experience=[{...input.experience[0],responsibilities:['Optimized SQL queries through indexing.','Automated CI/CD workflows.']}];
 const old=strengthenDraftMetrics(input);
 old.resume.experience[0].responsibilities[0]='Reduced query execution time by 17% using measured production baselines.';
 const before=JSON.stringify(old.resume);
 const result=refreshDraftMetrics(old.resume,old.edits);
 assert.equal(result.resume.experience[0].responsibilities[0],old.resume.experience[0].responsibilities[0]);
 assert.equal(result.edits.length,1);
 assert.equal(JSON.stringify(old.resume),before);
});
for(const [role,bullets] of Object.entries({java:['Optimized SQL queries through execution-plan analysis.','Automated CI/CD workflows for releases.'],kafka:['Tuned Spark jobs with partition sizing.','Investigated streaming processing failures.'],salesforce:['Developed automated tests for Apex workflows.','Validated customer records through reconciliation rules.'],dotnet:['Optimized SQL queries in the service layer.','Automated regression tests for .NET services.']}))test('automatic draft metrics: '+role,()=>{const r=structuredClone(source);r.experience=[{...r.experience[0],responsibilities:bullets}];const original=JSON.stringify(r);const result=strengthenDraftMetrics(r);assert.equal(result.edits.length,2);assert(result.edits.every(e=>e.status==='PROPOSED — REQUIRES CANDIDATE VERIFICATION'));assert(result.resume.experience[0].responsibilities.every(b=>/\d+%/.test(b)));assert.equal(JSON.stringify(r),original);assert.equal(strengthenDraftMetrics(result.resume).edits.length,0);});
test('preserves existing measurements; no forced metric without an opportunity',()=>{const r=structuredClone(source);r.experience=[{...r.experience[0],responsibilities:['Reduced query latency by 35%.','Attended planning meetings.']}];const result=strengthenDraftMetrics(r);assert.equal(result.edits.length,0);assert.deepEqual(result.resume,r);});
test('tool tenure is non-overlapping text upper bound, not total career years',()=>{const r=structuredClone(source);r.experience=[{...r.experience[0],startDate:'Jan 2024',endDate:'Dec 2024',responsibilities:['Implemented Salesforce workflows.']},{...r.experience[1],startDate:'Jan 2024',endDate:'Dec 2024',responsibilities:['Configured Salesforce automation.']}];const gap=technologyTenureGaps(r,'3 years of experience with Salesforce')[0];assert.equal(gap.maximumDocumentedMonths,12);assert.equal(gap.requiredYears,3);});
test('unknown tool tenure and alternative requirements',()=>{const r=structuredClone(source);assert(technologyTenureGaps(r,'3 years of experience with Workday').some(g=>g.technology==='Workday'));assert.equal(technologyTenureGaps(r,'3 years of experience with Java or Python').length,0);});
test('title punctuation does not cause false mismatch',()=>{const r=structuredClone(source);r.personalInfo.professionalTitle='Data Engineer | Databricks & Scala';assert(!reviewDraft(r,source,'Job title: Data Engineer - Databricks, Scala').some(f=>f.text.startsWith('JD headline')));});

test('cross-employer review catches reworded work without changing candidate content',()=>{
 const r=structuredClone(source);
 r.experience[0].responsibilities=['Optimized PostgreSQL queries using indexing and execution plan analysis, reducing query latency by 35%.'];
 r.experience[1].responsibilities=['Tuned PostgreSQL queries through indexes and execution plan analysis, cutting query response time by 22%.'];
 const before=JSON.stringify(r);
 assert(reviewDraft(r,source,'').some(f=>f.kind==='duplicate'&&f.text.includes('Possible repeated work across employers')));
 assert.equal(JSON.stringify(r),before);
 r.experience[1].responsibilities=['Implemented PostgreSQL audit tables and retention policies for historical account changes with restricted access.'];
 assert(!reviewDraft(r,source,'').some(f=>f.text.includes('Possible repeated work across employers')));
});
test('universal prompt compares work rather than merely changing verbs',()=>{
 const {generalGenerationPrompt}=load('prompts/general-resume.ts');
 const {analyzeLocally}=load('engine/resume-review/jd-workflow.ts');
 for(const role of ['Salesforce Developer','Data Engineer','Java Developer','Kafka Administrator']) {
  const jd='Role: '+role;
  const prompt=generalGenerationPrompt(jd,analyzeLocally(jd),source,['experience'],'c2c');
  assert(prompt.includes('DISTINCT EMPLOYER WORK'));
  assert(prompt.includes('cross-employer comparison'));
  assert(prompt.includes('Do not invent work just to satisfy diversity'));
  assert(prompt.includes('no repeated API-first, database-second, testing-third sequence'));
 }
});
