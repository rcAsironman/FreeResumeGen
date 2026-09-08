import { ResumeSectionId } from "./section";

export interface TemplateConfig {
  id: string;

  name: string;

  description: string;

  thumbnail: string;

  requiredSections: ResumeSectionId[];

  optionalSections: ResumeSectionId[];

  unsupportedSections: ResumeSectionId[];

  sectionOrder: ResumeSectionId[];

  sectionLabels: Partial<Record<ResumeSectionId, string>>;

  supportedFormats: ("pdf" | "docx")[];
}