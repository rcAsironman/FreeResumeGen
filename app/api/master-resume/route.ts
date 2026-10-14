import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { masterResumeSchema } from "@/engine/validation/resume.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  let files: string[] = [];
  try {
    const directory = path.join(process.cwd(), "data");
    files = (await readdir(directory)).filter((name) => /^master-resume.*\.json$/i.test(name)).sort();
    const file = new URL(request.url).searchParams.get("file") ?? "master-resume.json";
    if (!files.includes(file)) {
      return Response.json({ success: false, files, error: "Choose a master resume file below. data/master-resume.json is unavailable." }, { status: 404, headers });
    }
    const text = await readFile(path.join(directory, file), "utf8");
    return Response.json({ success: true, files, file, resume: masterResumeSchema.parse(JSON.parse(text)) }, { headers });
  } catch (error) {
    return Response.json({ success: false, files, error: error instanceof Error ? error.message : "Unable to load master resume." }, { status: 500, headers });
  }
}
