const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),load=require('./load-ts.cjs');
const {withResumeCompanies}=load('engine/resume-review/resume-company-overrides.ts');
const source=JSON.parse(fs.readFileSync('data/general/master-resume-data-center.json'));
test('resume company replacement preserves saved data, dates, IDs and personal details',()=>{
 const before=JSON.stringify(source),rows=source.experience.map(e=>({id:e.id,company:e.company,location:e.location}));rows[0].company='Test Employer';rows[0].location='Test Location';
 const next=withResumeCompanies(source,rows);
 assert.equal(next.experience[0].company,'Test Employer');assert.equal(next.experience[0].location,'Test Location');assert.equal(JSON.stringify(source),before);
 assert.deepEqual(next.personalInfo,source.personalInfo);assert.deepEqual(next.education,source.education);
 assert.deepEqual(next.experience.map(e=>[e.id,e.startDate,e.endDate]),source.experience.map(e=>[e.id,e.startDate,e.endDate]));
 const {generalGenerationPrompt}=load('prompts/general-resume.ts'),{analyzeLocally}=load('engine/resume-review/jd-workflow.ts');
 const prompt=generalGenerationPrompt('Data Center Technician',analyzeLocally('Data Center Technician'),next,[],'data-center',2);
 assert(prompt.includes('Test Employer'));assert(!prompt.includes('Preserve TierPoint'));
});
test('renaming does not transfer old employer achievements or projects',()=>{
 const s=structuredClone(source);s.experience[0].responsibilities=['Reduced outages by 20%.'];s.experience[0].projectName='Old employer project';s.projects=[{id:'old',name:'Old project',description:'',technologies:[],highlights:[]}];
 const rows=s.experience.map(e=>({id:e.id,company:e.company,location:e.location}));rows[0].company='New Employer';
 const next=withResumeCompanies(s,rows);assert.deepEqual(next.experience[0].responsibilities,[]);assert.equal(next.experience[0].projectName,undefined);assert.deepEqual(next.projects,[]);
 rows[0].company='';assert.throws(()=>withResumeCompanies(s,rows),/company name/);
});
