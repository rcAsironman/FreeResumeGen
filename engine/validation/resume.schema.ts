import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string().min(1),
  professionalTitle: z.string().min(1),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  linkedIn: z.string().optional(),
  portfolio: z.string().optional(),
});

export const professionalSummarySchema = z.object({
  bullets: z.array(z.string().min(1)).min(1),
});

export const technicalSkillsSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string().min(1),
      skills: z.array(z.string().min(1)),
    }),
  ),
});

export const experienceSchema = z.array(
  z.object({
    id: z.string().min(1),
    company: z.string().min(1),
    role: z.string().min(1),
    location: z.string(),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
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

export type MasterResumeSchema = z.infer<typeof masterResumeSchema>;