const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),load=require('./load-ts.cjs');
const {metricRecords,prepareMetricExport,PROPOSED_METRIC_STATUS,hasMetric}=load('engine/resume-review/metric-review.ts');
const {strengthenDraftMetrics}=load('engine/resume-review/achievement-draft.ts');
const source=JSON.parse(fs.readFileSync('data/general/master-resume-data-center.json','utf8'));
function fixture(){const r=structuredClone(source);r.personalInfo.professionalTitle='Data Center Technician';r.professionalSummary.bullets=['Data Center Technician with experience in server maintenance.'];r.experience[0].role=r.experience[1].role='Data Center Technician';r.experience[0].responsibilities=['Installed servers in approved racks and recorded serial identifiers.','Replaced failed memory modules following equipment isolation procedures.','Followed documented safety procedures.'];r.experience[1].responsibilities=['Installed fiber cabling and checked patch panel labels.','Reconciled equipment delivery records with asset identifiers.'];return r;}
test('automatic data center suggestions need no input and use distinct scoped workload counts',()=>{
 const r=fixture(),snapshot=JSON.stringify(r),result=strengthenDraftMetrics(r);
 assert.equal(result.edits.length,4);assert.equal(new Set(result.edits.map(e=>e.outcome)).size,4);
 assert(result.resume.experience.every(e=>e.responsibilities.filter(hasMetric).length===2));
 assert(result.edits.every(e=>!e.replacement.includes('uptime')&&!e.replacement.includes('99.7')&&e.status===PROPOSED_METRIC_STATUS));
 assert.equal(JSON.stringify(r),snapshot);
 const records=metricRecords(result.resume);assert.equal(records.length,4);assert(records.every(r=>r.employer&&r.estimatedValue&&r.unit&&r.verificationQuestion));
 assert.deepEqual(result.resume.experience.map(e=>[e.startDate,e.endDate]),r.experience.map(e=>[e.startDate,e.endDate]));
});
test('ChatGPT numbers are proposed; exact claims require specific evidence',()=>{
 const r=fixture();r.experience[0].responsibilities[0]='Installed 12 servers per month.';
 const text=r.experience[0].responsibilities[0];
 assert.equal(metricRecords(r)[0].status,PROPOSED_METRIC_STATUS);
 const verified=[{employerId:r.experience[0].id,text,evidence:'Monthly installation log, March 2026, 12 personally completed installations.',confirmed:true}];
 assert.equal(metricRecords(r,verified)[0].status,'CANDIDATE VERIFIED');
 assert.equal(prepareMetricExport(r,'submission',verified).resume.experience[0].responsibilities[0],text);
 r.experience[0].responsibilities[0]='Installed 120 servers per month.';
 assert.equal(metricRecords(r,verified)[0].status,PROPOSED_METRIC_STATUS);
 assert(!prepareMetricExport(r,'submission',verified).resume.experience[0].responsibilities.includes(r.experience[0].responsibilities[0]));
 assert(!prepareMetricExport(r,'submission',[{...verified[0],text:r.experience[0].responsibilities[0],evidence:''}]).resume.experience[0].responsibilities.includes(r.experience[0].responsibilities[0]));
});
test('submission removes unsupported outcomes across narrative; draft and nonmetrics unchanged',()=>{
 const r=fixture();r.experience[0].responsibilities.push('Reduced repair turnaround by 15%.');r.professionalSummary.bullets.push('Maintained 99.9% availability.');
 const before=JSON.stringify(r),final=prepareMetricExport(r,'submission');
 assert.equal(final.excluded,2);assert.equal(metricRecords(final.resume).length,0);assert.deepEqual(prepareMetricExport(r,'draft').resume,r);assert.equal(JSON.stringify(r),before);
 for(const text of ['Java 17 and .NET 8','24/7 operations','Cat6A and 48-port switches','4 years of experience','Jan 2025'])assert(!hasMetric(text),text);
 for(const text of ['Resolved 20 tickets weekly','Reduced latency by 12%','Maintained 4 racks','Saved 2 hours per release'])assert(hasMetric(text),text);
});
test('all mode prompts share proposed metric and submission separation rules',()=>{
 const {generalGenerationPrompt}=load('prompts/general-resume.ts'),{analyzeLocally}=load('engine/resume-review/jd-workflow.ts');
 for(const mode of ['full-time','c2c','data-center']){const p=generalGenerationPrompt('Data Center Technician',analyzeLocally('Data Center Technician'),source,[],mode);assert(p.includes('ACHIEVEMENT DRAFTING — ALL MODES'));assert(p.includes('PROPOSED — REQUIRES CANDIDATE VERIFICATION'));assert(!p.includes('Zero is not acceptable'));}
});
