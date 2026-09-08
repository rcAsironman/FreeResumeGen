import { readFile } from "node:fs/promises";
import path from "node:path";

import { masterResumeSchema } from "@/engine/validation/resume.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const text = await readFile(path.join(process.cwd(), "data", "master-resume.json"), "utf8");
    return Response.json({ success: true, resume: masterResumeSchema.parse(JSON.parse(text)) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to load master-resume.json." }, { status: 500 });
  }
}
