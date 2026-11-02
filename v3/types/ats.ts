export type AtsProvider = "resumakeai" | "maxcv";
export interface AtsResult {
  provider: AtsProvider;
  checkedAt: string;
  matchScore: number;
  atsScore?: number;
  missingSkills: string[];
  suggestions: string[];
  issues: string[];
}
export const ATS_PROVIDERS = {
  resumakeai: { name: "ResuMakeAi", url: "https://www.resumakeai.com/ats-checker", maxResume: 6000, maxJd: 4000 },
  maxcv: { name: "MaxCV", url: "https://maxcv.ai/for-ai-agents", maxResume: 60000, maxJd: 20000 },
} as const;
