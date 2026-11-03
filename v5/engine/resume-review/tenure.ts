import type { MasterResume } from "@/types/resume";
import { careerDuration } from "@/engine/resume-review/content-review";
import { extractRequirements, hasTerm } from "@/engine/resume-review/jd-workflow";

/** A period mentioning a skill is an upper bound, never verified full-time use. */
export function technologyTenureGaps(resume: MasterResume,jd: string) {
  const requirements=new Map<string,number>();
  for(const line of jd.split(/[\n;]+/)) {
    if(/preferred|advantageous|optional|not required/i.test(line))continue;
    const years=line.match(/\b(\d+(?:\.\d+)?)\s*\+?\s*(?:[-–]\s*\d+)?\s*years?\b/i);
    if(!years)continue;
    const tail=line.slice(years.index!+years[0].length);
    const found=extractRequirements(tail);
    // Also handle tools unknown to the vocabulary in "experience with/in X" clauses.
    const unknown=tail.match(/\bexperience\s+(?:with|in)\s+([A-Z][\w.+#-]*(?:\s+[A-Z][\w.+#-]*)?)/);
    if(unknown)found.push(unknown[1]);
    // Alternatives do not require the minimum for every option.
    if(/\bor\b/i.test(tail))continue;
    for(const term of found)requirements.set(term,Math.max(requirements.get(term)||0,Number(years[1])));
  }
  return [...requirements].flatMap(([technology,requiredYears])=>{
    const periods=resume.experience.filter(e=>e.responsibilities.some(t=>hasTerm(t,technology)));
    const duration=careerDuration(periods);
    const months=duration?.totalMonths??0;
    if(months>=requiredYears*12)return [];
    return [{technology,requiredYears,maximumDocumentedMonths:months,text:`${technology}: JD asks for ${requiredYears} years; employer periods describing it cover at most ${Math.floor(months/12)} years ${months%12} months. This is a text-based upper bound, not verified tool tenure. Do not extend dates or invent earlier use to close the gap.`}];
  });
}
