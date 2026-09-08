"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Clipboard, FileJson, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

import { SectionSelector, type HighlightSection } from "@/components/builder/SectionSelector";
import type { JobAnalysis } from "@/types/job-analysis";
import type { MasterResume } from "@/types/resume";

const DEFAULT_SECTIONS: HighlightSection[] = ["professionalSummary", "experience"];

function analysisPrompt(jd: string) {
  return `Analyze the job description below and return ONLY valid JSON with this exact structure. Do not use markdown fences. Use an empty array when a category is not present. Deduplicate skills and put every extracted technical term in allTechnicalSkills.\n\n${JSON.stringify({ targetRole: "", programmingLanguages: [], backendTechnologies: [], frontendTechnologies: [], frameworks: [], libraries: [], cloudPlatforms: [], cloudServices: [], databases: [], dataTechnologies: [], messagingTechnologies: [], devOpsTools: [], cicdTools: [], containerTechnologies: [], infrastructureTools: [], testingTools: [], monitoringTools: [], securityTechnologies: [], operatingSystems: [], developmentTools: [], architectureConcepts: [], architecturalPatterns: [], designPatterns: [], allTechnicalSkills: [] }, null, 2)}\n\nJOB DESCRIPTION:\n${jd.trim()}`;
}

function generationPrompt(jd: string, analysis: JobAnalysis, master: MasterResume, sections: HighlightSection[]) {
  const javaRelated = /java|spring boot|spring developer/i.test(analysis.targetRole);
  return `You are an expert ATS resume transformation specialist. Create a complete resume tailored to the supplied target role and job description. Return ONLY valid JSON with no Markdown fences, commentary, ATS score, or explanation.

TARGET ROLE:
${analysis.targetRole}

ROLE MODE:
${javaRelated ? "JAVA_RELATED_ROLE" : "COMPLETELY_DIFFERENT_ROLE"}

GLOBAL RULES
- Preserve the exact JSON structure and every required property from MASTER RESUME JSON.
- Preserve full name, email, phone, location, employer names, employer locations, employment dates, education, certifications, project history, and stable IDs.
- Keep email, LinkedIn, and other contact fields as plain text. Never output Markdown links or mailto syntax.
- Keep the resume internally consistent, technically believable, recruiter-readable, and ATS-friendly.
- Never invent employers, dates, education, certifications, revenue, financial savings, user counts, transaction volumes, or absolute scale claims.

PROFESSIONAL TITLE
- Produce a clean 2–6 word professional title representing the core profession and supported seniority.
- Do not copy marketing language, locations, contract details, requisition codes, client names, parenthetical phrases, or a list of technologies into the title.

PROFESSIONAL SUMMARY
- Preserve the same number of summary bullets as the master resume.
- Rewrite all bullets for the target role, eliminate repetition, and distribute high-value JD terminology naturally.
- Match the candidate's overall years and career level.
- Emphasize transferable experience and use realistic enterprise language.

REQUIRED JD SKILLS THAT ARE MISSING
- Treat the JD as the primary targeting source and the extracted skill list as an aid.
- Add explicitly required JD skills even when they are absent from the master resume, matching the behavior of the main resume-generator prompt.
- Add only the smallest technically coherent set of direct dependencies or companion skills.
- Prefer additions that naturally extend the candidate's Java, backend, full-stack, cloud, DevOps, data, or distributed-systems background.
- Do not add a technology as an isolated keyword. Demonstrate important additions in believable context across the Professional Summary, Technical Skills, recent Responsibilities, and Environment.
- Use restrained wording such as "integrated," "implemented," "applied," "used," or "exposure to" when expert ownership is not supported.
- Do not claim certifications, years of experience, deep expertise, or production scale for newly introduced skills.
- For AI-assisted-development roles, include only tools and practices explicitly required or strongly implied by the JD, such as Cursor AI, GitHub Copilot, AI pair programming, code generation, debugging, refactoring, test scaffolding, and code-review assistance. Do not add an unrelated AI ecosystem.

TECHNICAL SKILLS
${javaRelated ? `- Preserve existing skill categories and supported skills.
- Reorder the most relevant JD skills toward the beginning of the appropriate category.
- Add required JD technologies and a limited number of direct dependencies to the best category.
- Preserve version groups exactly when relevant, for example "Java 8/11/17" rather than splitting or truncating them.` : `- Rebuild categories for the target profession when necessary.
- Remove irrelevant Java-heavy categories and organize relevant JD, dependency, testing, deployment, security, and monitoring skills clearly.`}
- Remove duplicates and empty categories. Do not repeat the same skill across categories without a real reason.

PROFESSIONAL EXPERIENCE
- For every experience preserve exactly: id, company, location, startDate, and endDate.
- Rewrite role, responsibilities, and environment for relevance while keeping employer domain and time period realistic.
- Give the strongest JD alignment to the most recent and most relevant experience.
- Demonstrate added JD skills through plausible implementation context; do not make every employer use the same stack.
- Start bullets with varied action verbs and communicate Action + Technical Implementation + Engineering or Business Outcome.
- Keep most bullets approximately 20–35 words, remove generic filler, and avoid keyword lists disguised as sentences.
- Do not repeat nearly identical responsibilities across employers.

MEASURABLE IMPACT
- Retain source metrics. Where a measurable technical outcome naturally follows, you may add a small number of conservative, explicitly estimated improvements such as "approximately 20%" or "approximately 30%."
- Use estimates selectively: approximately 1–3 in recent relevant experience, 1–2 in mid-career experience, and 0–1 in older experience.
- Connect every estimate to a concrete technical change. Never use suspicious precision or unverifiable business figures.

ATS KEYWORD DISTRIBUTION
- Use exact standard names for the highest-priority JD requirements.
- Distribute them naturally through Summary, Technical Skills, recent Experience, and Environment instead of keyword stuffing.
- Cover these extracted terms where technically coherent: ${analysis.allTechnicalSkills.join(", ")}.
- The app will bold matching terms in these user-selected sections: ${sections.join(", ")}.

FINAL REVIEW
- Return the complete resume JSON object only.
- Ensure contact values contain no Markdown or mailto syntax.
- Verify required JD terms are represented in realistic context.
- Remove duplicate bullets, generic AI-style filler, and unnecessary technology repetition.
- Keep all additions conservative and interview-defensible. If an added skill is only adjacent exposure, say so rather than claiming mastery.

JOB DESCRIPTION:
${jd.trim()}

JOB ANALYSIS JSON:
${JSON.stringify(analysis, null, 2)}

MASTER RESUME JSON:
${JSON.stringify(master, null, 2)}`;
}

export function GuidedResumeWorkflow() {
  const router = useRouter();
  const [master, setMaster] = useState<MasterResume | null>(null);
  const [jd, setJd] = useState("");
  const [analysisText, setAnalysisText] = useState("");
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [sections, setSections] = useState<HighlightSection[]>(DEFAULT_SECTIONS);
  const [resumeText, setResumeText] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => { fetch("/api/master-resume", { cache: "no-store" }).then((response) => response.json()).then((result: { resume?: MasterResume; error?: string }) => { if (!result.resume) throw new Error(result.error); setMaster(result.resume); }).catch((caught) => setError(caught instanceof Error ? caught.message : "Unable to load master resume.")); }, []);
  const promptOne = useMemo(() => analysisPrompt(jd), [jd]);
  const promptTwo = useMemo(() => analysis && master ? generationPrompt(jd, analysis, master, sections) : "", [jd, analysis, master, sections]);

  async function copy(text: string, message: string) { await navigator.clipboard.writeText(text); setNotice(message); setError(""); }
  async function upload(event: ChangeEvent<HTMLInputElement>, setter: (text: string) => void) { const file = event.target.files?.[0]; if (file) setter(await file.text()); event.target.value = ""; }

  async function validateAnalysis() {
    try {
      const parsed = JSON.parse(analysisText) as unknown;
      const response = await fetch("/api/validate-analysis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed) });
      const result = await response.json() as { analysis?: JobAnalysis; error?: string };
      if (!response.ok || !result.analysis) throw new Error(result.error ?? "Invalid analysis JSON.");
      setAnalysis(result.analysis); setNotice("Analysis accepted. Review the skills and highlighting choices, then copy Prompt 2."); setError("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Invalid analysis JSON."); }
  }

  async function openEditor() {
    try {
      const parsed = JSON.parse(resumeText) as unknown;
      const response = await fetch("/api/current-resume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed) });
      const result = await response.json() as { resume?: MasterResume; error?: string };
      if (!response.ok || !result.resume || !analysis) throw new Error(result.error ?? "Invalid generated resume JSON.");
      sessionStorage.setItem("guidedResumeData", JSON.stringify({ resume: result.resume, technicalSkills: analysis.allTechnicalSkills, selectedSections: sections, targetRole: analysis.targetRole }));
      router.push("/editor");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Invalid generated resume JSON."); }
  }

  return <div className="mx-auto max-w-7xl p-4 sm:p-6">
    <header className="rounded-3xl border border-violet-200 bg-[#fffaf0] p-5 shadow-lg sm:p-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-violet-600">Guided ChatGPT workflow · No API key</p><h1 className="mt-1 text-3xl font-bold text-violet-950">JD to tailored resume</h1><p className="mt-2 text-stone-600">The app prepares two prompts. You use ChatGPT in your browser and paste its JSON responses back here.</p></header>
    {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">{error}</p>}{notice && <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">{notice}</p>}
    <section className="mt-5 grid gap-5 lg:grid-cols-2">
      <StepCard number="1" title="Extract skills in ChatGPT"><label className="text-sm font-semibold" htmlFor="jd">Job description</label><textarea id="jd" value={jd} onChange={(event) => setJd(event.target.value)} placeholder="Paste the complete job description…" className="mt-2 h-64 w-full rounded-xl border border-violet-200 p-3 text-sm"/><button disabled={jd.trim().length < 40} onClick={() => void copy(promptOne, "Prompt 1 copied. Paste it into ChatGPT, then paste the returned analysis JSON below.")} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white disabled:opacity-50"><Clipboard size={17}/> Copy Prompt 1</button></StepCard>
      <StepCard number="2" title="Paste analysis JSON"><JsonInput value={analysisText} setValue={setAnalysisText} onUpload={(event) => void upload(event, setAnalysisText)} placeholder="Paste ChatGPT analysis JSON…"/><button disabled={!analysisText.trim()} onClick={() => void validateAnalysis()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white disabled:opacity-50"><FileJson size={17}/> Validate analysis</button>{analysis && <div className="mt-4 rounded-xl bg-violet-50 p-3"><p className="font-bold text-violet-900">{analysis.targetRole || "Target role"}</p><div className="mt-2 flex max-h-32 flex-wrap gap-1 overflow-auto">{analysis.allTechnicalSkills.map((skill) => <span key={skill} className="rounded-full bg-white px-2 py-1 text-xs text-violet-800">{skill}</span>)}</div></div>}</StepCard>
    </section>
    {analysis && <section className="mt-5 grid gap-5 lg:grid-cols-2"><StepCard number="3" title="Choose skill highlighting"><SectionSelector selectedSections={sections} onChange={setSections}/><button disabled={!sections.length || !master} onClick={() => void copy(promptTwo, "Prompt 2 copied. Paste it into ChatGPT, then paste the generated resume JSON into Step 4.")} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white disabled:opacity-50"><Clipboard size={17}/> Copy Prompt 2</button></StepCard><StepCard number="4" title="Paste generated resume JSON"><JsonInput value={resumeText} setValue={setResumeText} onUpload={(event) => void upload(event, setResumeText)} placeholder="Paste ChatGPT generated resume JSON…"/><button disabled={!resumeText.trim()} onClick={() => void openEditor()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white disabled:opacity-50"><FileJson size={17}/> Validate, edit and preview</button></StepCard></section>}
  </div>;
}

function StepCard({ number, title, children }: { number: string; title: string; children: React.ReactNode }) { return <article className="rounded-2xl border border-violet-200 bg-white p-5 shadow-md"><p className="text-xs font-bold uppercase tracking-[.16em] text-violet-600">Step {number}</p><h2 className="mb-4 text-xl font-bold">{title}</h2>{children}</article>; }
function JsonInput({ value, setValue, onUpload, placeholder }: { value: string; setValue: (value: string) => void; onUpload: (event: ChangeEvent<HTMLInputElement>) => void; placeholder: string }) { return <><textarea value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} spellCheck={false} className="h-64 w-full rounded-xl bg-stone-950 p-3 font-mono text-xs leading-5 text-emerald-100"/><label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-violet-300 px-3 py-2 text-sm font-semibold text-violet-700"><Upload size={15}/> Upload JSON<input type="file" accept=".json,application/json" onChange={onUpload} className="hidden"/></label></>; }
