import { z } from "zod";
import { fetchAtsScore } from "@/engine/ats/providers";
import { ATS_PROVIDERS } from "@/types/ats";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const inputSchema = z.object({ provider: z.enum(["resumakeai", "maxcv"]), resumeText: z.string().trim().min(50).max(60000), jobDescription: z.string().trim().min(50).max(20000) });
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Open the checker from the resume app." }, { status: 403, headers });
  try {
    const input = inputSchema.parse(await request.json());
    const limits = ATS_PROVIDERS[input.provider];
    if (input.resumeText.length > limits.maxResume || input.jobDescription.length > limits.maxJd) {
      return Response.json({ error: `${limits.name} accepts up to ${limits.maxResume.toLocaleString()} resume characters and ${limits.maxJd.toLocaleString()} JD characters in this app. Your text was not shortened or sent. Use another service or a shorter resume.` }, { status: 400, headers });
    }
    return Response.json({ result: await fetchAtsScore(input.provider, input.resumeText, input.jobDescription) }, { headers });
  } catch (error) {
    const message = error instanceof z.ZodError ? "Provide a resume and JD of at least 50 characters each, within the displayed limits." : error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError") ? "The scoring service timed out. Try again later." : error instanceof Error ? error.message : "Unable to check this resume.";
    return Response.json({ error: message }, { status: error instanceof z.ZodError ? 400 : 502, headers });
  }
}
