import { generatedResumeSchema } from "@/engine/validation/resume.schema";
import { assertLocalResumeSave, saveDailyResume } from "@/engine/export-engine/save-daily-resume";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resume = generatedResumeSchema.parse(body.resume);
    if(body.saveToFolder===false)return new Response(JSON.stringify(resume,null,2),{headers:{'Content-Type':'application/json','Content-Disposition':'attachment; filename="resume.json"','Cache-Control':'no-store'}});
    assertLocalResumeSave(request);
    const saved = await saveDailyResume(Buffer.from(JSON.stringify(resume, null, 2)), resume.personalInfo.fullName, "json", { fileName: body.fileName });
    return Response.json(saved, {headers:{"Cache-Control":"no-store"}});
  } catch(error) { return Response.json({success:false,error:error instanceof Error?error.message:"JSON export failed"},{status:400}); }
}
