import { architectResumeTemplateConfig } from "@/templates/architect-resume/config";
import { fixedResumeTemplateConfig } from "@/templates/fixed-resume/config";

export const templateRegistry = {
  "architect-resume": architectResumeTemplateConfig,
  "fixed-resume": fixedResumeTemplateConfig,
} as const;

export type TemplateId = keyof typeof templateRegistry;

export function getTemplateConfig(templateId: TemplateId) {
  return templateRegistry[templateId];
}

export function getAllTemplateConfigs() {
  return Object.values(templateRegistry);
}