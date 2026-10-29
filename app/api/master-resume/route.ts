import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { PROFILE_DEFAULT_FILES, type ResumeProfile } from "@/types/resume-profile";

import { masterResumeSchema } from "@/engine/validation/resume.schema";
import { sourceMatchesEmploymentType } from "@/engine/resume-review/source-contract";
import { isEmploymentType, type EmploymentType } from "@/types/employment-type";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  let files: string[] = [];
  try {
    const params = new URL(request.url).searchParams;
    const selectedProfile = params.get("profile") ?? "java";
    if (selectedProfile !== "java" && selectedProfile !== "kafka" && selectedProfile !== "general") {
      return Response.json({ success: false, error: "Invalid resume profile." }, { status: 400, headers });
    }
    const profile: ResumeProfile = selectedProfile;
    const employmentTypeValue = params.get("employmentType");
    const employmentType: EmploymentType = isEmploymentType(employmentTypeValue) ? employmentTypeValue : "c2c";
    const directory = path.join(process.cwd(), "data", profile);
    const entries = (await readdir(directory, { withFileTypes: true })).filter((entry) => entry.isFile() && /\.json$/i.test(entry.name));
    const compatible: string[] = [];
    for (const entry of entries) {
      try {
        const candidate = masterResumeSchema.parse(JSON.parse(await readFile(path.join(directory, entry.name), "utf8")));
        if (sourceMatchesEmploymentType(profile, entry.name, candidate, employmentType)) compatible.push(entry.name);
      } catch { /* Invalid source files are not selectable. */ }
    }
    files = compatible.sort();
    const requestedFile = params.get("file");
    const file = requestedFile ?? (files.includes(PROFILE_DEFAULT_FILES[profile]) ? PROFILE_DEFAULT_FILES[profile] : files[0]);
    if (!file || !files.includes(file)) {
      return Response.json({ success: false, files, error: employmentType === "full-time"
        ? `No verified full-time source is configured for ${profile}. Choose another profile or add a full-time source with the required education record.`
        : `Choose a ${profile} C2C source containing a bachelor's degree and no master's degree.` }, { status: 404, headers });
    }
    const text = await readFile(path.join(directory, file), "utf8");
    return Response.json({ success: true, profile, files, file, resume: masterResumeSchema.parse(JSON.parse(text)) }, { headers });
  } catch (error) {
    return Response.json({ success: false, files, error: error instanceof Error ? error.message : "Unable to load master resume." }, { status: 500, headers });
  }
}
