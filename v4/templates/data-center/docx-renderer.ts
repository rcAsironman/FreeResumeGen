import {Document,Packer,Paragraph,TextRun,AlignmentType,BorderStyle,TabStopType,LevelFormat,LineRuleType} from 'docx';
import type {MasterResume} from '@/types/resume';

export async function createDataCenterDocx({resume}:{resume:MasterResume}) {
 const run=(text:string,bold=false,italics=false)=>new TextRun({text,font:'Times New Roman',size:20,bold,italics});
 const heading=(text:string)=>new Paragraph({children:[new TextRun({text,bold:true,size:22})],spacing:{before:120,after:60,line:253,lineRule:LineRuleType.EXACT},border:{bottom:{style:BorderStyle.SINGLE,size:4,color:'888888'}},keepNext:true});
 const pair=(left:string,right:string,bold=false,education=false)=>new Paragraph({children:[run(left,bold||education),run('\t'+right,bold)],tabStops:[{type:TabStopType.CENTER,position:education?8320:8560}],spacing:{after:40,line:230,lineRule:LineRuleType.EXACT},keepNext:bold});
 const children:Paragraph[]=[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:resume.personalInfo.fullName.toUpperCase(),size:32,bold:true})],spacing:{after:60,line:276}}),new Paragraph({alignment:AlignmentType.CENTER,children:[run(resume.personalInfo.location+' | '),new TextRun({text:resume.personalInfo.email,color:'0000EE',underline:{},font:'Times New Roman',size:20}),run(' | '+resume.personalInfo.phone)],spacing:{after:100,line:230,lineRule:LineRuleType.EXACT}}),heading('Professional Summary'),new Paragraph({children:[run(resume.professionalSummary.bullets.join(' '))],spacing:{after:0,line:230,lineRule:LineRuleType.EXACT}}),heading('Technical Skills')];
 for(const c of resume.technicalSkills.categories) children.push(new Paragraph({children:[run(c.name+': ',true),run(c.skills.join(', '))],spacing:{after:40,line:230,lineRule:LineRuleType.EXACT}}));
 children.push(heading('Professional Experience'));
 for(const e of resume.experience){children.push(pair(e.company+' | '+e.location,e.startDate+' - '+e.endDate,true),new Paragraph({children:[run(e.role,false,true)],keepNext:true,spacing:{after:60,line:230,lineRule:LineRuleType.EXACT}}));for(const b of e.responsibilities) children.push(new Paragraph({children:[run(b)],numbering:{reference:'dc-bullets',level:0},spacing:{after:40,line:230,lineRule:LineRuleType.EXACT},keepLines:true}));}
 children.push(heading('Education'));
 for(const e of resume.education)children.push(pair([e.institution,e.location].filter(Boolean).join(', '),e.degree,false,true));
 return Packer.toBuffer(new Document({styles:{default:{document:{run:{font:'Times New Roman',size:20}}}},numbering:{config:[{reference:'dc-bullets',levels:[{level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:360,hanging:270}}}}]}]},sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:160,bottom:720,left:860,right:860}}},children}]}));
}
