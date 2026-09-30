import { readFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { removeProficiencyLabels } from "@/engine/resume-generator/remove-proficiency-labels";
import { masterResumeSchema } from "@/engine/validation/resume.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "generated-resume.json");
    const text = await readFile(filePath, "utf8");
    const resume = masterResumeSchema.parse(removeProficiencyLabels(JSON.parse(text)));
    return Response.json({ success: true, resume }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const detail = error instanceof z.ZodError
      ? error.issues.map((issue) => `${issue.path.join(".") || "resume"}: ${issue.message}`).join("; ")
      : error instanceof SyntaxError
        ? `Invalid JSON syntax: ${error.message}`
        : error instanceof Error ? error.message : "Unable to read generated-resume.json.";
    return Response.json({ success: false, error: detail }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const resume = masterResumeSchema.parse(removeProficiencyLabels(await request.json()));
    return Response.json({ success: true, resume });
  } catch (error) {
    const detail = error instanceof z.ZodError
      ? error.issues.map((issue) => `${issue.path.join(".") || "resume"}: ${issue.message}`).join("; ")
      : "The editor does not contain valid JSON.";
    return Response.json({ success: false, error: detail }, { status: 400 });
  }
}
