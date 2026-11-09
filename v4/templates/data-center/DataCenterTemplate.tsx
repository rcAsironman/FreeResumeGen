import type { MasterResume } from "@/types/resume";
import type { CSSProperties, ReactNode } from "react";

const row:CSSProperties={display:'flex',justifyContent:'space-between',gap:'12pt'};
function Heading({children}:{children:ReactNode}) {return <h2 style={{fontSize:'11pt',fontWeight:700,borderBottom:'0.5pt solid #888',margin:'6pt 0 3pt',paddingBottom:'2pt',lineHeight:1.15,breakAfter:'avoid'}}>{children}</h2>;}
/** Reference: Letter, Times New Roman 10pt, 16pt centered name, ruled headings. */
export function DataCenterTemplate({resume}:{resume:MasterResume}) {
 return <article data-data-center-resume style={{boxSizing:'border-box',width:'816px',minHeight:'1056px',padding:'8pt 43pt 36pt',fontFamily:'"Times New Roman", Times, serif',fontSize:'10pt',lineHeight:1.15,color:'#000',background:'#fff'}}>
  <header style={{textAlign:'center',marginBottom:'8pt'}}>
   <h1 data-resume-field="fullName" style={{fontSize:'16pt',lineHeight:1.15,fontWeight:700,textTransform:'uppercase',margin:'0 0 3pt'}}>{resume.personalInfo.fullName}</h1>
   <span data-resume-field="professionalTitle" style={{display:'none'}}>{resume.personalInfo.professionalTitle}</span>
   <div>{(['location','email','phone'] as const).filter(k=>resume.personalInfo[k]).map((k,i)=><span key={k}>{i>0?' | ':''}<span data-contact-field={k} style={k==='email'?{color:'#00e',textDecoration:'underline'}:undefined}>{resume.personalInfo[k]}</span></span>)}</div>
  </header>
  <Heading>Professional Summary</Heading>
  <p style={{margin:0}}>{resume.professionalSummary.bullets.map((b,i)=><span key={i} data-summary-index={i}>{b}{i<resume.professionalSummary.bullets.length-1?' ':''}</span>)}</p>
  <Heading>Technical Skills</Heading>
  {resume.technicalSkills.categories.map((c,i)=><p key={i} data-skill-category-index={i} style={{margin:'0 0 2pt'}}><strong data-skill-category-name>{c.name}:</strong>{' '}{c.skills.map((s,j)=><span key={j}>{j>0?', ':''}<span data-skill-index={j}>{s}</span></span>)}</p>)}
  <Heading>Professional Experience</Heading>
  {resume.experience.map((e,i)=><section key={e.id} data-experience-index={i}>
   <div style={{...row,fontWeight:700,breakAfter:'avoid'}}><span><span data-experience-field="company">{e.company}</span>{' | '}<span data-experience-field="location">{e.location}</span></span><span style={{whiteSpace:'nowrap',width:'196pt',textAlign:'center',flexShrink:0}}><span data-experience-field="startDate">{e.startDate}</span> - <span data-experience-field="endDate">{e.endDate}</span></span></div>
   <p data-experience-field="role" style={{fontStyle:'italic',margin:'1pt 0 3pt',breakAfter:'avoid'}}>{e.role}</p>
   <ul style={{listStyleType:'disc',margin:'0 0 3pt',paddingLeft:'18pt'}}>{e.responsibilities.map((b,j)=><li key={j} data-responsibility-index={j} style={{paddingLeft:0,marginBottom:'2pt',breakInside:'avoid'}}>{b}</li>)}</ul>
  </section>)}
  <Heading>Education</Heading>
  {resume.education.map((e,i)=><div key={e.id} data-education-index={i} style={{...row,marginBottom:'2pt'}}><strong><span data-education-field="institution">{e.institution}</span>{e.location&&<>, <span data-education-field="location">{e.location}</span></>}</strong><span data-education-field="degree" style={{width:'220pt',textAlign:'center',flexShrink:0}}>{e.degree}</span><span data-education-field="graduationDate" style={{display:'none'}}>{e.graduationDate}</span></div>)}
 </article>;
}
