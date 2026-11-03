import {z} from 'zod';
import {masterResumeSchema} from '@/engine/validation/resume.schema';
export function parseCandidateSettings(input:unknown) {
 const raw=z.object({personalInfo:z.record(z.string(),z.unknown()),companies:z.array(z.record(z.string(),z.unknown())).optional(),experience:z.array(z.unknown()).optional(),education:z.array(z.unknown()),certifications:z.array(z.record(z.string(),z.unknown())).default([]),projects:z.array(z.unknown()).optional(),preferences:z.object({maxExperienceYears:z.number().int().min(1).max(30).default(4),summaryBullets:z.number().int().min(1).max(15).default(6),latestCompanyBullets:z.number().int().min(1).max(20).default(8),otherCompanyBullets:z.number().int().min(1).max(20).default(5)}).default({maxExperienceYears:4,summaryBullets:6,latestCompanyBullets:8,otherCompanyBullets:5})}).passthrough().parse(input);
 const experience=raw.companies?.map((c,i)=>({id:c.id??`company-${i+1}`,company:c.companyName,role:c.jobTitle??'',location:c.location??'',startDate:c.startDate,endDate:c.endDate,responsibilities:c.responsibilities??[],environment:c.technologies??[]}))??raw.experience??[];
 const resume=masterResumeSchema.parse({...raw,personalInfo:{professionalTitle:'',location:'',...raw.personalInfo},professionalSummary:raw.professionalSummary??{bullets:['Candidate history for JD-specific drafting.']},technicalSkills:raw.technicalSkills??{categories:[]},experience,projects:raw.projects??[],certifications:raw.certifications.filter(c=>c.visible!==false)});
 if(!resume.experience.length)throw new Error('Add at least one company.');
 if(new Set(resume.experience.map(e=>e.id)).size!==resume.experience.length)throw new Error('Each company must have a unique id.');
 return {resume,preferences:raw.preferences};
}
