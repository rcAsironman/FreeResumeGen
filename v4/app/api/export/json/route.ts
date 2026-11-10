import { prepareMetricExport, verifiedMetricSchema } from "@/engine/resume-review/metric-review";
import { z } from "zod";
import { generatedResumeSchema } from "@/engine/validation/resume.schema";
import { assertLocalResumeSave, saveDailyResume } from "@/engine/export-engine/save-daily-resume";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const imported = generatedResumeSchema.parse(body.resume);
    // Review records remain outside the unchanged resume JSON schema.
    const verified=z.array(verifiedMetricSchema).parse(body.verifiedMetrics??[]);
    const {resume}=prepareMetricExport(imported,body.exportMode==='draft'?'draft':'submission',verified);
    if(body.saveToFolder===false)return new Response(JSON.stringify(resume,null,2),{headers:{'Content-Type':'application/json','Content-Disposition':'attachment; filename="resume.json"','Cache-Control':'no-store'}});
    assertLocalResumeSave(request);
    const saved = await saveDailyResume(Buffer.from(JSON.stringify(resume, null, 2)), resume.personalInfo.fullName, "json", { fileName: body.fileName });
    return Response.json(saved, {headers:{"Cache-Control":"no-store"}});
  } catch(error) { return Response.json({success:false,error:error instanceof Error?error.message:"JSON export failed"},{status:400}); }
}
