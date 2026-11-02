const fs=require('node:fs'),assert=require('node:assert/strict');const load=require('./load-ts.cjs');
const {generalGenerationPrompt}=load('prompts/general-resume.ts');const {analyzeLocally}=load('engine/resume-review/jd-workflow.ts');
for(const profile of ['general']){
 const source=JSON.parse(fs.readFileSync(`data/${profile}/master-resume-${profile}.json`,'utf8'));source.personalInfo.linkedIn='https://linkedin.com/in/private';const snapshot=JSON.stringify(source);
 const jd='Job Title: Salesforce Developer\n4 years of experience\nSkills: Apex, SOQL, Lightning Web Components';
 const prompt=generalGenerationPrompt(jd,analyzeLocally(jd),source,['experience'],'c2c',4);
 assert(prompt.includes(jd));assert(prompt.includes('ACHIEVEMENT DRAFTING'));assert(prompt.includes('Selected timeline: 4 years'));assert(prompt.includes('2–3 quantified'));assert(!prompt.includes('https://linkedin.com/in/private'));assert.equal(JSON.stringify(source),snapshot);
 const embedded=JSON.parse(prompt.split('SELECTED SOURCE RESUME (historical reference, not output template)\n')[1].split('\n\nFINAL CHECK')[0]);
 assert.equal(embedded.personalInfo.email,source.personalInfo.email);assert.deepEqual(embedded.experience.map(e=>[e.id,e.company,e.location]),source.experience.map(e=>[e.id,e.company,e.location]));const contract=JSON.parse(prompt.split('OUTPUT CONTRACT — RETURN ALL THESE ROOTS AND REQUIRED FIELDS\n')[1].split('\nEvery experience item')[0]);assert(contract.experience.every(e=>e.role===analyzeLocally(jd).targetRole));assert.deepEqual(embedded.education,source.education);
 console.log('PASS active universal prompt with '+profile+' source: JD, timeline, metrics and immutable source');
}
