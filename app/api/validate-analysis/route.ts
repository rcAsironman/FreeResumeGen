import { z } from "zod";

import { jobAnalysisSchema } from "@/engine/validation/job-analysis.schema";

export async function POST(request: Request) {
  try {
    return Response.json({ success: true, analysis: jobAnalysisSchema.parse(await request.json()) });
  } catch (error) {
    const detail = error instanceof z.ZodError
      ? error.issues.map((issue) => `${issue.path.join(".") || "analysis"}: ${issue.message}`).join("; ")
      : "The analysis is not valid JSON.";
    return Response.json({ success: false, error: detail }, { status: 400 });
  }
}
