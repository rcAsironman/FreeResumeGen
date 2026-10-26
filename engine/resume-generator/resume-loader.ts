import { readFile } from "node:fs/promises";
import path from "node:path";

import { masterResumeSchema } from "@/engine/validation/resume.schema";
import { PROFILE_DEFAULT_FILES, type ResumeProfile } from "@/types/resume-profile";
import type { MasterResume } from "@/types/resume";

export async function loadMasterResume(profile: ResumeProfile = "java"): Promise<MasterResume> {
  const filePath = path.join(
    process.cwd(),
    "data",
    profile,
    PROFILE_DEFAULT_FILES[profile],
  );

  const fileContent = await readFile(filePath, "utf8");
  const parsedData: unknown = JSON.parse(fileContent);

  return masterResumeSchema.parse(parsedData);
}