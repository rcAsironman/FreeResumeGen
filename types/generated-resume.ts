import { ResumeSectionId } from "./section";

export interface GeneratedSection {
  id: ResumeSectionId;

  content: unknown;
}

export interface GeneratedResume {
  templateId: string;

  sections: GeneratedSection[];
}