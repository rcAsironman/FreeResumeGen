import type { TemplateConfig } from "@/types/template";

export const fixedResumeTemplateConfig: TemplateConfig = {
  id: "fixed-resume",
  name: "Karthik Resume Template",
  description: "Fixed resume layout based on the uploaded Word resume.",
  thumbnail: "/template-thumbnails/fixed-resume.png",
  requiredSections: [
    "professionalSummary",
    "technicalSkills",
    "education",
    "experience",
    "environment",
  ],
  optionalSections: [],
  unsupportedSections: [
    "projects",
    "certifications",
    "coreCompetencies",
    "keyAchievements",
    "languages",
    "awards",
  ],
  sectionOrder: [
    "professionalSummary",
    "technicalSkills",
    "education",
    "experience",
  ],
  sectionLabels: {
    professionalSummary: "PROFESSIONAL SUMMARY",
    technicalSkills: "TECHNICAL SKILLS",
    education: "EDUCATION",
    experience: "PROFESSIONAL EXPERIENCE",
    environment: "Environment",
  },
  supportedFormats: ["pdf", "docx"],
};