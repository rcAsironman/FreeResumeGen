import { assertLocalResumeSave, saveDailyResume } from "@/lib/save-daily-resume";

export async function POST(request: Request) {
  try {
    assertLocalResumeSave(request);
    const form = await request.formData();
    const file = form.get("file");
    const name = form.get("name");
    const format = form.get("format");
    if (!(file instanceof File) || typeof name !== "string" || name.length > 200 || !["docx", "pdf", "json"].includes(String(format)) || file.size > 20_000_000) return Response.json({ error: "Invalid resume download." }, { status: 400 });
    return Response.json(await saveDailyResume(new Uint8Array(await file.arrayBuffer()), name, format as "docx" | "pdf" | "json"), { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return Response.json({ error: (error as Error).message }, { status: 400 }); }
}
