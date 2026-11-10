import type {EmploymentType} from '@/types/employment-type';
import type {JobAnalysis} from '@/types/job-analysis';
import type {MasterResume} from '@/types/resume';
import type {HighlightSection} from '@/components/builder/SectionSelector';
import type {StudyDates} from '@/engine/resume-review/experience-target';
import {fullTimeGenerationPrompt} from '@/prompts/full-time-resume';
import {c2cGenerationPrompt} from '@/prompts/c2c-resume';
import {dataCenterGenerationPrompt} from '@/prompts/data-center-resume';
export {generalDraftSource,ACHIEVEMENT_RULES,JD_DRAFT_RULES,EMPLOYER_DIVERSITY_RULES} from '@/prompts/shared-resume';
/** Compatibility dispatcher. Each mode owns its prompt builder and contract. */
export function generalGenerationPrompt(jd:string,analysis:JobAnalysis,master:MasterResume,sections:HighlightSection[],employmentType:EmploymentType='full-time',targetYears?:number|null,study?:StudyDates,preserveSourceTimeline=false){
 const input={jd,analysis,master,sections,targetYears,study,preserveSourceTimeline};
 switch(employmentType){case 'full-time':return fullTimeGenerationPrompt(input);case 'c2c':return c2cGenerationPrompt(input);case 'data-center':return dataCenterGenerationPrompt(input);default:throw new Error('Unknown employment mode');}
}
