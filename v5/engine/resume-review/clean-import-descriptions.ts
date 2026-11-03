import type {MasterResume} from '@/types/resume';
import {reviewResumeContent} from '@/engine/resume-review/content-review';

/** Optional drafting notes are omitted, never rewritten into claimed work. */
export function cleanImportDescriptions(input:MasterResume) {
 const resume=structuredClone(input);
 const repairs:string[]=[];
 const issues=reviewResumeContent(resume);
 resume.experience.forEach((entry,index)=>{
   if(issues.some(issue=>issue.code==='draft-language'&&issue.path===`experience.${index}.description`)) {
     entry.description='';
     repairs.push(`Omitted drafting instructions from ${entry.company}'s optional description. Responsibilities were preserved.`);
   }
 });
 return {resume,repairs};
}
