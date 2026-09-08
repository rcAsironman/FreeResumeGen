import { readFile } from "node:fs/promises";
import path from "node:path";

import { masterResumeSchema } from "@/engine/validation/resume.schema";
import type { MasterResume } from "@/types/resume";

export async function loadMasterResume(): Promise<MasterResume> {
  const filePath = path.join(
    process.cwd(),
    "data",
    "master-resume.json",
  );

  const fileContent = await readFile(filePath, "utf8");
  const parsedData: unknown = JSON.parse(fileContent);

  return masterResumeSchema.parse(parsedData);
}