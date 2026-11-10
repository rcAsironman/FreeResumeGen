import type { MasterResume } from '@/types/resume';

export type ResumeCompanyEdit={id:string;company:string;location:string};
export function companyScope(source:MasterResume) {
 return JSON.stringify(source.experience.map(e=>[e.id,e.company,e.location,e.startDate,e.endDate]));
}
/** Temporary resume input only. Never mutates saved sources or their dates. */
export function withResumeCompanies(source:MasterResume,edits:ResumeCompanyEdit[]):MasterResume {
 if(edits.length!==source.experience.length)throw new Error('Keep one company entry for each existing experience.');
 const byId=new Map(edits.map(e=>[e.id,e]));
 if(byId.size!==edits.length)throw new Error('Company entries must have unique IDs.');
 const next=structuredClone(source);
 let changedCompany=false;
 next.experience=next.experience.map(e=>{
  const edit=byId.get(e.id);
  if(!edit||typeof edit.company!=='string'||!edit.company.trim()||typeof edit.location!=='string')throw new Error('Enter a company name for every experience.');
  const company=edit.company.trim(),location=edit.location.trim();
  if(company!==e.company){changedCompany=true;return {...e,company,location,role:'',description:'',projectName:undefined,responsibilityGroups:undefined,responsibilities:[],environment:[]};}
  return {...e,company,location};
 });
 // Old project identities/achievements must not be attributed to replacement employers.
 if(changedCompany)next.projects=[];
 return next;
}
