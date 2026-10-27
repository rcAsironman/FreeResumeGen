import type { ResumeProfile } from "@/types/resume-profile";

export type EmploymentType = "full-time" | "c2c";

export const EMPLOYMENT_TYPE_STORAGE_DEFAULT: EmploymentType = "full-time";

/** Profile-specific direct-employment sources that can be selected automatically. */
export const FULL_TIME_MASTER_FILES: Partial<Record<ResumeProfile, string>> = {
  java: "master-resume8.json",
  general: "master-resume-fulltime.json",
};

export function isEmploymentType(value: unknown): value is EmploymentType {
  return value === "full-time" || value === "c2c";
}
