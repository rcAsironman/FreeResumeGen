import { z } from "zod";

import { jobAnalysisSchema } from "@/engine/validation/job-analysis.schema";
import { cleanRoleTitle } from "@/engine/resume-review/role-title";

export async function POST(request: Request) {
  try {
    const analysis=jobAnalysisSchema.parse(await request.json());
    analysis.targetRole=cleanRoleTitle(analysis.targetRole);
    return Response.json({ success: true, analysis });
  } catch (error) {
    const detail = error instanceof z.ZodError
      ? error.issues.map((issue) => `${issue.path.join(".") || "analysis"}: ${issue.message}`).join("; ")
      : "The analysis is not valid JSON.";
    return Response.json({ success: false, error: detail }, { status: 400 });
  }
}
