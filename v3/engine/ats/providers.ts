import type { AtsProvider, AtsResult } from "@/types/ats";
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("The scoring service returned an unreadable result.");
  return value as Record<string, unknown>;
}
function score(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 100) throw new Error("The scoring service did not return a valid score.");
  return Math.round(value);
}
function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").slice(0, 30).map(item => item.slice(0, 600)) : [];
}
export function parseAtsResult(provider: AtsProvider, body: unknown): AtsResult {
  const root = record(body);
  const base = { provider, checkedAt: new Date().toISOString(), missingSkills: [], suggestions: [], issues: [] };
  if (provider === "maxcv") {
    if (root.success !== true) throw new Error("MaxCV could not complete this check. Try again later.");
    // Only score the submitted original, never a hypothetical tailored CV.
    return { ...base, matchScore: score(record(root.data).originalScore) };
  }
  if (root.error) throw new Error("ResuMakeAi could not complete this check. Try again later.");
  const result = record(root.result);
  if (result.isError) throw new Error("ResuMakeAi could not complete this check. Its free daily quota may be exhausted.");
  const content = Array.isArray(result.content) ? result.content : [];
  const text = content.map(item => record(item)).filter(item => item.type === "text").map(item => String(item.text ?? "")).join("\n");
  let data: Record<string, unknown>;
  try { data = record(JSON.parse(text)); } catch { throw new Error("ResuMakeAi returned an unreadable score. Try again later."); }
  return { ...base, matchScore: score(data.matchPercentage), atsScore: score(data.atsScore), missingSkills: strings(data.missingSkills), suggestions: strings(data.suggestedKeywords), issues: strings(data.atsIssues) };
}
export async function fetchAtsScore(provider: AtsProvider, resumeText: string, jobDescription: string): Promise<AtsResult> {
  const signal = AbortSignal.timeout(55000);
  let response: Response;
  if (provider === "maxcv") {
    const body = new FormData(); body.set("cvText", resumeText); body.set("jobDescription", jobDescription);
    response = await fetch("https://maxcv.ai/api/score", { method: "POST", body, signal, cache: "no-store", redirect: "error" });
  } else {
    response = await fetch("https://www.resumakeai.com/api/mcp", {
      method: "POST", signal, cache: "no-store", redirect: "error",
      headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "score_resume", arguments: { resumeText, jobDescription } } }),
    });
  }
  if (response.status === 429) throw new Error("Free scoring limit reached. Try again later or use the other service.");
  if (!response.ok) throw new Error(`Scoring service unavailable (HTTP ${response.status}). Try again later.`);
  return parseAtsResult(provider, await response.json());
}
