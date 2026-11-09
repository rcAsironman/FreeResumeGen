import type { MasterResume } from '@/types/resume';

export function validateDataCenterContent(resume:MasterResume) {
 const text=[...resume.professionalSummary.bullets,...resume.technicalSkills.categories.flatMap(c=>[c.name,...c.skills]),...resume.experience.flatMap(e=>[e.company,e.role,...e.responsibilities]),...resume.education.flatMap(e=>[e.institution,e.degree])].join(' ');
 if(resume.experience.length!==2) throw new Error('The Data Center reference format requires two employers.');
 if(text.trim().split(/\s+/).length>600 || resume.experience.some(e=>e.responsibilities.length>6)) throw new Error('The Data Center format is one page: keep visible content within 600 words and at most six responsibilities per employer. Shorten the content in the editor; nothing has been removed.');
 if(resume.projects.length || resume.certifications.length) throw new Error('The Data Center reference has no Projects or Certifications section. Move relevant supported details into the existing sections or choose another format; these records will not be silently omitted.');
}
