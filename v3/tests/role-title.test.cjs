const test=require('node:test'),assert=require('node:assert/strict'),load=require('./load-ts.cjs');
const {cleanRoleTitle}=load('engine/resume-review/role-title.ts');
const {analyzeLocally}=load('engine/resume-review/jd-workflow.ts');
for(const [input,expected] of [
 ['Java Full-Stack Engineer With Kafka and MongoDB','Java Full-Stack Engineer'],
 ['Urgent Hiring: Java Developer - Remote - USC/GC','Java Developer'],
 ['🚀 WE’RE HIRING: Data Integration Developer (Remote)','Data Integration Developer'],
 ['Data Engineer - Databricks, Scala','Data Engineer'],
 ['.NET Core Software Engineer 2','.NET Core Software Engineer 2'],
 ['Dot net Developer','.NET Developer'],
 ['C# Developer With Azure','C# Developer'],
 ['Lead Software Engineer With Kafka','Lead Software Engineer'],
 ['Senior Salesforce Developer | Apex, LWC','Senior Salesforce Developer'],
 ['SAP S/4HANA Consultant','SAP S/4HANA Consultant'],
 ['Confluent Kafka Administrator','Confluent Kafka Administrator'],
 ['Software Engineer II (Contract)','Software Engineer II'],
 ['Research and Development Engineer','Research and Development Engineer'],
 ['Full Stack Engineer','Full-Stack Engineer']
])test('clean headline: '+input,()=>{assert.equal(cleanRoleTitle(input),expected);assert.equal(cleanRoleTitle(expected),expected);});
test('headline cleanup does not discard JD technology requirements',()=>{const result=analyzeLocally('Job Title: Java Full-Stack Engineer With Kafka and MongoDB\nSkills: React, Spring Boot');assert.equal(result.targetRole,'Java Full-Stack Engineer');for(const skill of ['Kafka','MongoDB','React','Spring Boot'])assert(result.allTechnicalSkills.includes(skill));});
