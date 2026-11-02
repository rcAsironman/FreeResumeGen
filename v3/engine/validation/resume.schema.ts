import { z } from "zod";

import { plainEmailValue } from "@/utils/resume-text";

export const personalInfoSchema = z.object({
  fullName: z.string().min(1),
  professionalTitle: z.string().default(""),
  email: z.string().transform(plainEmailValue),
  phone: z.string(),
  location: z.string(),
  portfolio: z.string().optional(),
});

export const professionalSummarySchema = z.object({
  bullets: z.array(z.string().min(1)).min(1),
});

export const skillCategorySchema = z.preprocess((value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const row = value as Record<string, unknown>;
  // Normalize the common model alias only when the canonical property is absent.
  if (row.name === undefined && typeof row.category === "string") return { ...row, name: row.category };
  return value;
}, z.object({ name: z.string().min(1), skills: z.array(z.string().min(1)) }));

export const technicalSkillsSchema = z.object({ categories: z.array(skillCategorySchema) });

export const experienceSchema = z.array(
  z.object({
    id: z.string().min(1),
    company: z.string().min(1),
    role: z.string().default(""),
    location: z.string(),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    description: z.string().optional(),
    projectName: z.string().optional(),
    responsibilityGroups: z.array(z.object({ heading: z.string(), startIndex: z.number().int().nonnegative() })).optional(),
    responsibilities: z.array(z.string().min(1)),
    environment: z.array(z.string().min(1)),
  }),
);

export const projectsSchema = z.array(
  z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string(),
    technologies: z.array(z.string()),
    highlights: z.array(z.string()),
  }),
);

export const educationSchema = z.array(
  z.object({
    id: z.string().min(1),
    institution: z.string().min(1),
    degree: z.string().min(1),
    location: z.string().optional(),
    graduationDate: z.string().optional(),
  }),
);

export const certificationsSchema = z.array(
  z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    issuer: z.string().optional(),
    year: z.string().optional(),
  }),
);

export const masterResumeSchema = z.object({
  personalInfo: personalInfoSchema,
  professionalSummary: professionalSummarySchema,
  technicalSkills: technicalSkillsSchema,
  experience: experienceSchema,
  projects: projectsSchema,
  education: educationSchema,
  certifications: certificationsSchema,
});

/** Generated resumes must supply JD-specific headline and employer role labels. */
export const generatedResumeSchema = masterResumeSchema.superRefine((resume, context) => {
  if (!resume.personalInfo.professionalTitle.trim()) {
    context.addIssue({ code: "custom", path: ["personalInfo", "professionalTitle"], message: "Add a headline based on the job description." });
  }
  resume.experience.forEach((item, index) => {
    if (!item.role.trim()) {
      context.addIssue({ code: "custom", path: ["experience", index, "role"], message: "Generate a JD-relevant functional role for each employer." });
    }
  });
});

export type MasterResumeSchema = z.infer<typeof masterResumeSchema>;
