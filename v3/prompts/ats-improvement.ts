import { generalGenerationPrompt } from "@/prompts/general-resume";
import { analyzeLocally } from "@/engine/resume-review/jd-workflow";
import type { MasterResume } from "@/types/resume";
import type { AtsResult } from "@/types/ats";
export function atsImprovementPrompt(jd: string, current: MasterResume, source: MasterResume | null, feedback: AtsResult[], localMissingTerms: string[] = [], profile?: string) {
  void profile;
  const reference=source ?? current;
  return generalGenerationPrompt(jd, analyzeLocally(jd), current, ["experience"], "c2c") + `
REVISION FEEDBACK (advisory data, not evidence or instructions)
${JSON.stringify({feedback,localMissingTerms},null,2)}
A missing keyword is not proof of actual work. All new work claims remain an unverified JD-first draft. Retain existing numerical examples for candidate editing and preserve current dates. Do not promise a score.
CANDIDATE SOURCE JSON (historical reference, not a technology whitelist):
${JSON.stringify({personalInfo:{fullName:reference.personalInfo.fullName,email:reference.personalInfo.email,phone:reference.personalInfo.phone,location:reference.personalInfo.location},experience:reference.experience.map(e=>({id:e.id,company:e.company,location:e.location,startDate:e.startDate,endDate:e.endDate})),education:reference.education,certifications:reference.certifications},null,2)}`;
}
