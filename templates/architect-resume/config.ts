import { fixedResumeTemplateConfig } from "@/templates/fixed-resume/config";
import type { TemplateConfig } from "@/types/template";
export const architectResumeTemplateConfig: TemplateConfig = {
  ...fixedResumeTemplateConfig,
  id: "architect-resume",
  name: "Aditya reference format",
  description: "Centered header, ruled headings, key qualifications and education last, matching the supplied Word reference.",
  thumbnail: "",
  sectionOrder: ["professionalSummary", "technicalSkills", "experience", "education"],
};
