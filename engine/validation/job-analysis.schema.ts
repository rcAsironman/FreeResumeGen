import { z } from "zod";

export const jobAnalysisSchema = z.object({
  targetRole: z.string(),

  programmingLanguages: z.array(z.string()),
  backendTechnologies: z.array(z.string()),
  frontendTechnologies: z.array(z.string()),
  frameworks: z.array(z.string()),
  libraries: z.array(z.string()),

  cloudPlatforms: z.array(z.string()),
  cloudServices: z.array(z.string()),

  databases: z.array(z.string()),
  dataTechnologies: z.array(z.string()),
  messagingTechnologies: z.array(z.string()),

  devOpsTools: z.array(z.string()),
  cicdTools: z.array(z.string()),
  containerTechnologies: z.array(z.string()),
  infrastructureTools: z.array(z.string()),

  testingTools: z.array(z.string()),
  monitoringTools: z.array(z.string()),
  securityTechnologies: z.array(z.string()),

  operatingSystems: z.array(z.string()),
  developmentTools: z.array(z.string()),

  architectureConcepts: z.array(z.string()),
  architecturalPatterns: z.array(z.string()),
  designPatterns: z.array(z.string()),

  allTechnicalSkills: z.array(z.string()),
});

export type JobAnalysis = z.infer<typeof jobAnalysisSchema>;