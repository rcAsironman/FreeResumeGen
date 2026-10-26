"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Clipboard, FileJson, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

import { SectionSelector, type HighlightSection } from "@/components/builder/SectionSelector";
import { ActionToast } from "@/components/shared/ActionToast";
import type { JobAnalysis } from "@/types/job-analysis";
import type { MasterResume } from "@/types/resume";
import { parsePastedJson } from "@/utils/parse-pasted-json";

import { keywordCoverage, resumeScoringText } from "@/engine/ats/resume-text";
import { analysisPrompt } from "@/prompts/job-analysis";
import { javaGenerationPrompt } from "@/prompts/java-resume";
import { kafkaGenerationPrompt } from "@/prompts/kafka-resume";
import { generalGenerationPrompt } from "@/prompts/general-resume";
import { PROFILE_DEFAULT_FILES, PROFILE_LABELS, type ResumeProfile } from "@/types/resume-profile";

const PROFILE_STORAGE_KEY = "resume-profile-selection-v1";

const DEFAULT_SECTIONS: HighlightSection[] = ["professionalSummary", "experience"];


export function GuidedResumeWorkflow() {
  const router = useRouter();
  const workflowRevision = useRef(0);
  const [profile, setProfile] = useState<ResumeProfile>("java");
  const [selectionReady, setSelectionReady] = useState(false);
  const [rememberedFiles, setRememberedFiles] = useState<Record<ResumeProfile, string>>(PROFILE_DEFAULT_FILES);
  const [master, setMaster] = useState<MasterResume | null>(null);
  const [masterFiles, setMasterFiles] = useState<string[]>([]);
  const [masterFile, setMasterFile] = useState("");
  const [masterError, setMasterError] = useState("");
  const [masterLoading, setMasterLoading] = useState(true);
  const [masterLoadAttempt, setMasterLoadAttempt] = useState(0);
  const [jd, setJd] = useState("");
  const [analysisText, setAnalysisText] = useState("");
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [sections, setSections] = useState<HighlightSection[]>(DEFAULT_SECTIONS);
  const [resumeText, setResumeText] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Restore browser-only preferences after hydration without changing server-rendered HTML.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) ?? "null") as { profile?: unknown; files?: Partial<Record<ResumeProfile, unknown>> } | null;
      const nextProfile = saved?.profile === "general" ? "general" : saved?.profile === "kafka" ? "kafka" : "java";
      const files = { ...PROFILE_DEFAULT_FILES };
      for (const key of ["java", "kafka", "general"] as const) {
        if (typeof saved?.files?.[key] === "string") files[key] = saved.files[key] as string;
      }
      setProfile(nextProfile); setRememberedFiles(files); setMasterFile(files[nextProfile]);
    } catch { setMasterFile(PROFILE_DEFAULT_FILES.java); }
    setSelectionReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!selectionReady) return;
    try { localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ profile, files: rememberedFiles })); } catch { /* Selection still works when browser storage is unavailable. */ }
  }, [profile, rememberedFiles, selectionReady]);

  function changeProfile(next: ResumeProfile) {
    workflowRevision.current++;
    setProfile(next); setMasterFile(rememberedFiles[next]); setMasterFiles([]); setMaster(null); setMasterLoading(true); setMasterError("");
    setAnalysis(null); setAnalysisText(""); setResumeText(""); setNotice(""); setError("");
  }

  function changeMasterFile(file: string) {
    workflowRevision.current++;
    setMaster(null); setMasterLoading(true); setMasterError(""); setMasterFile(file);
    setRememberedFiles((previous) => ({ ...previous, [profile]: file }));
    setResumeText("");
  }

  useEffect(() => {
    if (!selectionReady) return;
    const controller = new AbortController();
    fetch(`/api/master-resume?profile=${profile}&file=${encodeURIComponent(masterFile)}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.headers.get("content-type")?.includes("application/json")) {
          throw new Error("The resume service is unavailable. Retry loading your master resumes.");
        }
        return response.json();
      })
      .then((result: { resume?: MasterResume; files?: string[]; error?: string }) => {
        if (controller.signal.aborted) return;
        setMasterFiles(result.files ?? []);
        setMaster(result.resume ?? null);
        setMasterError(result.resume ? "" : result.error ?? "Unable to load master resume.");
        setMasterLoading(false);
      })
      .catch((caught) => {
        if (controller.signal.aborted) return;
        setMasterError(caught instanceof Error ? caught.message : "Unable to load master resume.");
        setMasterLoading(false);
      });
    return () => controller.abort();
  }, [masterFile, profile, selectionReady, masterLoadAttempt]);
  const sourceCoverage = useMemo(() => analysis && master && profile === "general" ? keywordCoverage(resumeScoringText(master), analysis.allTechnicalSkills) : null, [analysis, master, profile]);
  const promptOne = useMemo(() => analysisPrompt(jd, profile), [jd, profile]);
  const promptTwo = useMemo(() => analysis && master ? (profile === "general" ? generalGenerationPrompt(jd, analysis, master, sections) : (profile === "kafka" ? kafkaGenerationPrompt : javaGenerationPrompt)(jd, analysis, master, sections)) : "", [jd, analysis, master, sections, profile]);

  async function copy(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text);
      setNotice(message); setError("");
    } catch {
      setError("Unable to copy to the clipboard. Check browser clipboard permission and try again.");
    }
  }
  async function upload(event: ChangeEvent<HTMLInputElement>, setter: (text: string) => void) { const file = event.target.files?.[0]; if (file) { setter(await file.text()); setNotice(`${file.name} loaded successfully.`); setError(""); } event.target.value = ""; }

  async function validateAnalysis() {
    const revision = workflowRevision.current;
    try {
      const parsed = parsePastedJson(analysisText);
      const response = await fetch("/api/validate-analysis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed) });
      const result = await response.json() as { analysis?: JobAnalysis; error?: string };
      if (revision !== workflowRevision.current) return;
      if (!response.ok || !result.analysis) throw new Error(result.error ?? "Invalid analysis JSON.");
      setAnalysis(result.analysis); setNotice("Analysis accepted. Review the skills and highlighting choices, then copy Prompt 2."); setError("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Invalid analysis JSON."); }
  }

  async function openEditor() {
    const revision = workflowRevision.current;
    try {
      const parsed = parsePastedJson(resumeText);
      const response = await fetch("/api/current-resume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed) });
      const result = await response.json() as { resume?: MasterResume; error?: string };
      if (revision !== workflowRevision.current) return;
      if (!response.ok || !result.resume || !analysis) throw new Error(result.error ?? "Invalid generated resume JSON.");
      sessionStorage.setItem("guidedResumeData", JSON.stringify({ resume: result.resume, technicalSkills: analysis.allTechnicalSkills, selectedSections: sections, targetRole: analysis.targetRole, jobDescription: jd, sourceResume: master, profile }));
      router.push("/editor");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Invalid generated resume JSON."); }
  }

  return <div className="mx-auto max-w-7xl p-4 sm:p-6">
    {error ? <ActionToast message={error} type="error" onDismiss={() => setError("")} /> : notice ? <ActionToast message={notice} onDismiss={() => setNotice("")} /> : null}
    <header className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-lg sm:p-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--app-accent)]">Guided ChatGPT workflow · No API key</p><h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">JD to tailored resume</h1><p className="mt-2 text-[var(--app-muted)]">Choose your profile, paste a job description, and build your tailored resume with ChatGPT.</p></header>
    <section aria-label="Resume setup" className="mt-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
      <div className="grid gap-4 md:grid-cols-2">
      <div className="min-w-0">
      <label htmlFor="resume-profile" className="text-sm font-semibold">Resume profile</label>
      <select id="resume-profile" value={profile} disabled={!selectionReady} onChange={(event) => changeProfile(event.target.value as ResumeProfile)} className="mt-2 block h-12 w-full min-w-0 rounded-xl border border-[var(--app-border)] px-3 text-sm">
        <option value="general">Generate any resume from JD</option>
        <option value="java">Java — application engineering</option>
        <option value="kafka">Kafka — platform administration and reliability</option>
      </select>
      </div>
      <div className="min-w-0">
      <label htmlFor="master-resume-file" className="text-sm font-semibold">Master resume</label>
      <select id="master-resume-file" value={masterFiles.includes(masterFile) ? masterFile : ""} disabled={!selectionReady} onChange={(event) => changeMasterFile(event.target.value)} className="mt-2 block h-12 w-full min-w-0 rounded-xl border border-[var(--app-border)] px-3 text-sm">
        <option value="" disabled>Choose your source resume…</option>
        {masterFiles.map((file) => <option key={file} value={file}>{file}</option>)}
      </select>
      </div>
      </div>
      <p role="status" className="mt-4 border-t border-[var(--app-border)] pt-3 text-xs text-[var(--app-muted)]">{masterLoading ? "Loading master resume…" : masterError || `${PROFILE_LABELS[profile]} source ready. Your selection is saved automatically.`}</p>
      {<button type="button" disabled={masterLoading} onClick={() => { setMasterLoading(true); setMasterError(""); setMasterLoadAttempt((attempt) => attempt + 1); }} className="mt-3 rounded-lg border border-[var(--app-border)] px-3 py-2 text-sm font-semibold text-[var(--app-accent)]">{masterError ? "Retry loading resumes" : "Reload master resume"}</button>}
    </section>
    <section className="mt-5">
      <StepCard number="1" title="Analyze the job description">
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label className="text-sm font-semibold" htmlFor="jd">Job description</label>
            <textarea id="jd" value={jd} onChange={(event) => { workflowRevision.current++; setJd(event.target.value); setAnalysis(null); setAnalysisText(""); setResumeText(""); setNotice(""); setError(""); }} placeholder="Paste the complete job description…" className="mt-2 h-56 w-full rounded-xl border border-[var(--app-border)] p-3 text-sm"/>
            <button disabled={jd.trim().length < 40} onClick={() => void copy(promptOne, "Prompt 1 copied. Paste it into ChatGPT, then paste the returned analysis JSON here.")} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--app-primary)] px-4 py-3 font-semibold text-white disabled:opacity-50"><Clipboard size={17}/> Copy analysis prompt</button>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">ChatGPT analysis JSON</p>
            <JsonInput value={analysisText} setValue={(value) => { workflowRevision.current++; setAnalysisText(value); setAnalysis(null); setResumeText(""); }} onUpload={(event) => void upload(event, (value) => { setAnalysisText(value); setAnalysis(null); setResumeText(""); })} placeholder="Paste ChatGPT analysis JSON…" compact/>
            <button disabled={!analysisText.trim()} onClick={() => void validateAnalysis()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--app-primary)] px-4 py-3 font-semibold text-white disabled:opacity-50"><FileJson size={17}/> Validate analysis</button>
          </div>
        </div>
        {analysis && <div className="mt-4 rounded-xl bg-[var(--app-accent-soft)] p-3"><p className="font-bold text-[var(--foreground)]">{analysis.targetRole || "Target role"}</p><div className="mt-2 flex max-h-28 flex-wrap gap-1 overflow-auto">{analysis.allTechnicalSkills.map((skill) => <span key={skill} className="rounded-full bg-[var(--app-surface)] px-2 py-1 text-xs text-[var(--app-accent)]">{skill}</span>)}</div></div>}
      </StepCard>
    </section>
    {profile === "general" && <p className="mt-4 text-sm text-[var(--app-muted)]">JD-adapted draft: roles, skills and responsibilities follow the JD. Master identity, employers and dates stay fixed. Review rewritten experience before use.</p>}
    {sourceCoverage && sourceCoverage.missing.length > 0 && <aside aria-label="Source resume gaps" className="mt-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-accent-soft)] p-5"><h2 className="font-bold">JD-adapted draft: review rewritten experience</h2><p className="mt-2 text-sm">{sourceCoverage.missing.length} extracted JD terms were not found by the local text check in your selected master. This mode drafts roles, skills and responsibilities from the JD while preserving master identity, employers and dates. Rewritten experience is not verified.</p><details className="mt-3 text-sm"><summary className="cursor-pointer font-semibold">View terms not found</summary><p className="mt-2">{sourceCoverage.missing.join(", ")}</p></details><p className="mt-3 text-sm text-[var(--app-muted)]">Review all rewritten titles and technology claims before using the draft. Add your actual implementation details to the master for more accurate content.</p></aside>}
    {analysis && <section className="mt-5"><StepCard number="2" title="Generate and open the resume"><div className="grid gap-5 lg:grid-cols-2"><div><SectionSelector selectedSections={sections} onChange={setSections}/><button disabled={masterLoading || !master || !promptTwo} onClick={() => void copy(promptTwo, "Resume prompt copied. Paste it into ChatGPT, then paste the generated resume JSON here.")} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--app-primary)] px-4 py-3 font-semibold text-white disabled:opacity-50"><Clipboard size={17}/> Copy resume prompt</button></div><div><p className="mb-2 text-sm font-semibold">Generated resume JSON</p><JsonInput value={resumeText} setValue={setResumeText} onUpload={(event) => void upload(event, setResumeText)} placeholder="Paste ChatGPT generated resume JSON…" compact/><button disabled={!resumeText.trim()} onClick={() => void openEditor()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--app-primary)] px-4 py-3 font-semibold text-white disabled:opacity-50"><FileJson size={17}/> Validate, edit and preview</button></div></div></StepCard></section>}
  </div>;
}

function StepCard({ number, title, children }: { number: string; title: string; children: React.ReactNode }) { return <article className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-md"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--app-accent-soft)] text-sm font-bold text-[var(--app-accent)]" aria-label={`Step ${number}`}>{number}</span><h2 className="text-xl font-bold">{title}</h2></div>{children}</article>; }
function JsonInput({ value, setValue, onUpload, placeholder, compact = false }: { value: string; setValue: (value: string) => void; onUpload: (event: ChangeEvent<HTMLInputElement>) => void; placeholder: string; compact?: boolean }) { return <><textarea value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} spellCheck={false} className={`${compact ? "h-48" : "h-64"} w-full rounded-xl bg-[var(--app-input)] p-3 font-mono text-xs leading-5 text-[var(--app-code)]`}/><label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--app-border)] px-3 py-2 text-sm font-semibold text-[var(--app-accent)]"><Upload size={15}/> Upload JSON<input type="file" accept=".json,application/json" onChange={onUpload} className="hidden"/></label></>; }
