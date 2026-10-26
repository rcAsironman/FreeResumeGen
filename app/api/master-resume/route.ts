import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { PROFILE_DEFAULT_FILES, type ResumeProfile } from "@/types/resume-profile";

import { masterResumeSchema } from "@/engine/validation/resume.schema";

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
    const directory = path.join(process.cwd(), "data", profile);
    files = (await readdir(directory, { withFileTypes: true })).filter((entry) => entry.isFile() && /\.json$/i.test(entry.name)).map((entry) => entry.name).sort();
    const file = params.get("file") ?? PROFILE_DEFAULT_FILES[profile];
    if (!files.includes(file)) {
      return Response.json({ success: false, files, error: `Choose an available ${profile} source resume. The saved source is missing or belongs to another profile.` }, { status: 404, headers });
    }
    const text = await readFile(path.join(directory, file), "utf8");
    return Response.json({ success: true, profile, files, file, resume: masterResumeSchema.parse(JSON.parse(text)) }, { headers });
  } catch (error) {
    return Response.json({ success: false, files, error: error instanceof Error ? error.message : "Unable to load master resume." }, { status: 500, headers });
  }
}
