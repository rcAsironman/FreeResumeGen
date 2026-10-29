import { z } from "zod";

const optionalText = z.string().optional();
const experienceItem = z.object({
  id: z.string().min(1), company: z.string().min(1), role: z.string(), location: z.string(),
  startDate: z.string().min(1), endDate: z.string().min(1), description: optionalText, projectName: optionalText,
  responsibilityGroups: z.array(z.object({ heading: z.string(), startIndex: z.number().int().nonnegative() }).strict()).optional(),
  responsibilities: z.array(z.string().min(1)), environment: z.array(z.string()),
}).strict();

export const resumeSchema = z.object({
  personalInfo: z.object({ fullName: z.string().min(1), professionalTitle: z.string().min(1), email: z.string(), phone: z.string(), location: z.string(), portfolio: optionalText }).strict(),
  professionalSummary: z.object({ bullets: z.array(z.string().min(1)).min(1) }).strict(),
  technicalSkills: z.object({ categories: z.array(z.object({ name: z.string().min(1), skills: z.array(z.string().min(1)) }).strict()) }).strict(),
  experience: z.array(experienceItem),
  projects: z.array(z.object({ id: z.string().min(1), name: z.string().min(1), description: z.string(), technologies: z.array(z.string()), highlights: z.array(z.string()) }).strict()),
  education: z.array(z.object({ id: z.string().min(1), institution: z.string().min(1), degree: z.string().min(1), location: optionalText, graduationDate: optionalText }).strict()),
  certifications: z.array(z.object({ id: z.string().min(1), name: z.string().min(1), issuer: optionalText, year: optionalText }).strict()),
}).strict();

export const profileSchema = z.object({
  schemaVersion: z.literal(1), profileType: z.enum(["full-time", "c2c"]),
  personalInfo: z.object({ fullName: z.string(), email: z.string(), phone: z.string(), location: z.string(), portfolio: optionalText }).strict(),
  education: z.array(z.object({ id: z.string(), institution: z.string(), degree: z.string(), location: optionalText, graduationDate: optionalText }).strict()),
  certifications: z.array(z.object({ id: z.string(), name: z.string(), issuer: optionalText, year: optionalText, credentialId: optionalText, verificationLink: optionalText, badgeId: optionalText, logo: optionalText, logoSize: z.number().int().min(24).max(140).optional(), logoPosition: z.object({ x: z.number(), y: z.number() }).strict().optional(), visible: z.boolean().optional() }).strict()),
  companies: z.array(z.object({
    id: optionalText,
    companyName: z.string().min(1), clientName: z.string().default(""), industry: z.string().default(""), location: z.string().default(""), jobTitle: z.string().default(""),
    startDate: z.string().default(""), endDate: z.string().default(""), isCurrent: z.boolean().default(false),
    technologies: z.array(z.string()).default([]), responsibilities: z.array(z.string()).default([]),
    projects: z.array(z.object({ id: optionalText, name: z.string().min(1), industry: z.string().default(""), clientName: z.string().default(""), context: z.string().default(""), technologies: z.array(z.string()).default([]), responsibilities: z.array(z.string()).default([]) }).strict()).default([]),
  }).strict()),
  preferences: z.object({ maxExperienceYears: z.number().int().min(1).max(13), summaryBullets: z.number().int().min(1).max(15), latestCompanyBullets: z.number().int().min(1).max(20), otherCompanyBullets: z.number().int().min(1).max(20) }).strict(),
}).strict().superRefine((profile, context) => {
  if (profile.profileType === "full-time" && profile.preferences.maxExperienceYears > 8) {
    context.addIssue({ code: "custom", path: ["preferences", "maxExperienceYears"], message: "Full-Time profiles support a maximum of 8 years." });
  }
});

export function prettyIssues(error: z.ZodError) {
  return error.issues.map((issue) => `${issue.path.length ? issue.path.join(".") : "JSON"}: ${issue.message}`);
}
