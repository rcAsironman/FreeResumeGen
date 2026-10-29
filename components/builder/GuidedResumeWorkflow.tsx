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
import { careerDuration } from "@/engine/resume-review/content-review";
import { jdExperienceTarget, proposeEmploymentTimeline } from "@/engine/resume-review/experience-target";
import { analysisPrompt } from "@/prompts/job-analysis";
import { generalGenerationPrompt } from "@/prompts/general-resume";
import { PROFILE_DEFAULT_FILES, PROFILE_LABELS, type ResumeProfile } from "@/types/resume-profile";
import { EMPLOYMENT_TYPE_STORAGE_DEFAULT, FULL_TIME_MASTER_FILES, isEmploymentType, type EmploymentType } from "@/types/employment-type";

const PROFILE_STORAGE_KEY = "resume-profile-selection-v1";

const DEFAULT_SECTIONS: HighlightSection[] = ["professionalSummary", "experience"];


export function GuidedResumeWorkflow() {
  const router = useRouter();
  const workflowRevision = useRef(0);
  const [profile, setProfile] = useState<ResumeProfile>("java");
  const [employmentType, setEmploymentType] = useState<EmploymentType>(EMPLOYMENT_TYPE_STORAGE_DEFAULT);
  const [targetYearsOverride, setTargetYearsOverride] = useState<number | null>(null);
  const [timelineTargets, setTimelineTargets] = useState<Record<string, number>>({});
  const [selectionReady, setSelectionReady] = useState(false);
  const [rememberedFiles, setRememberedFiles] = useState<Record<ResumeProfile, string>>(PROFILE_DEFAULT_FILES);
  const [master, setMaster] = useState<MasterResume | null>(null);
  const [fullTimeMaster, setFullTimeMaster] = useState<MasterResume | null>(null);
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
      const saved = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) ?? "null") as { profile?: unknown; files?: Partial<Record<ResumeProfile, unknown>>; employmentType?: unknown; targetYears?: unknown; timelineTargets?: Record<string, unknown> } | null;
      const nextProfile = saved?.profile === "general" ? "general" : saved?.profile === "kafka" ? "kafka" : "java";
      const nextEmploymentType = isEmploymentType(saved?.employmentType) ? saved.employmentType : EMPLOYMENT_TYPE_STORAGE_DEFAULT;
      const availableEmploymentType = nextEmploymentType === "full-time" && !FULL_TIME_MASTER_FILES[nextProfile] ? "c2c" : nextEmploymentType;
      const nextTargetYears = typeof saved?.targetYears === "number" && saved.targetYears >= 1 && saved.targetYears <= 50 ? saved.targetYears : null;
      const nextTimelineTargets: Record<string, number> = {};
      for (const [key, value] of Object.entries(saved?.timelineTargets ?? {})) {
        if (typeof value === "number" && value >= 1 && value <= 50) nextTimelineTargets[key] = value;
      }
      if (!Object.keys(nextTimelineTargets).length && nextTargetYears !== null) nextTimelineTargets[`${nextProfile}:${availableEmploymentType}`] = nextTargetYears;
      const files = { ...PROFILE_DEFAULT_FILES };
      for (const key of ["java", "kafka", "general"] as const) {
        if (typeof saved?.files?.[key] === "string") files[key] = saved.files[key] as string;
      }
      setProfile(nextProfile); setRememberedFiles(files); setEmploymentType(availableEmploymentType); setTimelineTargets(nextTimelineTargets); setTargetYearsOverride(nextTimelineTargets[`${nextProfile}:${availableEmploymentType}`] ?? null);
      setMasterFile(availableEmploymentType === "full-time" ? FULL_TIME_MASTER_FILES[nextProfile] ?? files[nextProfile] : files[nextProfile]);
    } catch { setMasterFile(PROFILE_DEFAULT_FILES.java); }
    setSelectionReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!selectionReady) return;
    try { localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ profile, files: rememberedFiles, employmentType, timelineTargets })); } catch { /* Selection still works when browser storage is unavailable. */ }
  }, [profile, rememberedFiles, employmentType, timelineTargets, selectionReady]);

  function changeProfile(next: ResumeProfile) {
    workflowRevision.current++;
    const nextType = employmentType === "full-time" && !FULL_TIME_MASTER_FILES[next] ? "c2c" : employmentType;
    const nextFile = nextType === "full-time" ? FULL_TIME_MASTER_FILES[next]! : rememberedFiles[next];
    setProfile(next); setEmploymentType(nextType); setTargetYearsOverride(timelineTargets[`${next}:${nextType}`] ?? null); setMasterFile(nextFile); setMasterFiles([]); setMaster(null); setFullTimeMaster(null); setMasterLoading(true); setMasterError("");
    setAnalysis(null); setAnalysisText(""); setResumeText(""); setNotice(""); setError("");
    if (employmentType === "full-time" && nextType === "c2c") setNotice(`No verified Full-time source is configured for ${PROFILE_LABELS[next]}. Switched to C2C; add a source with the correct full-time history to enable it.`);
  }

  function changeEmploymentType(next: EmploymentType) {
    workflowRevision.current++;
    if (next === "full-time" && !FULL_TIME_MASTER_FILES[profile]) {
      setNotice(`No verified Full-time source is configured for ${PROFILE_LABELS[profile]}. Add one before using Full-time.`);
      return;
    }
    const nextFile = next === "full-time" ? FULL_TIME_MASTER_FILES[profile]! : rememberedFiles[profile];
    setEmploymentType(next); setResumeText(""); setNotice(""); setError("");
    setTargetYearsOverride(timelineTargets[`${profile}:${next}`] ?? null);
    if (nextFile !== masterFile) {
      setMasterFile(nextFile); setMasterFiles([]); setMaster(null); setMasterLoading(true); setMasterError("");
    }
    setNotice(`${next === "full-time" ? "Full-time" : "C2C"} preference saved${next === "full-time" ? "; the configured source was selected" : ". Only bachelor’s-degree C2C sources are available"}.`);
  }

  function changeMasterFile(file: string) {
    workflowRevision.current++;
    setMaster(null); setMasterLoading(true); setMasterError(""); setMasterFile(file);
    setRememberedFiles((previous) => ({ ...previous, [profile]: file }));
    setResumeText("");
  }

  function changeTargetYears(next: number | null) {
    workflowRevision.current++;
    setTargetYearsOverride(next);
    const key = `${profile}:${employmentType}`;
    setTimelineTargets((previous) => {
      const updated = { ...previous };
      if (next === null) delete updated[key]; else updated[key] = next;
      return updated;
    });
    setResumeText(""); setNotice(""); setError("");
  }

  useEffect(() => {
    if (!selectionReady) return;
    const controller = new AbortController();
    fetch(`/api/master-resume?profile=${profile}&employmentType=${employmentType}&file=${encodeURIComponent(masterFile)}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.headers.get("content-type")?.includes("application/json")) {
          throw new Error("The resume service is unavailable. Retry loading your master resumes.");
        }
        return response.json();
      })
      .then((result: { resume?: MasterResume; files?: string[]; error?: string }) => {
        if (controller.signal.aborted) return;
        setMasterFiles(result.files ?? []);
        if (!result.resume && result.files?.length && !result.files.includes(masterFile)) {
          const replacement = employmentType === "full-time" ? FULL_TIME_MASTER_FILES[profile] : result.files.includes(PROFILE_DEFAULT_FILES[profile]) ? PROFILE_DEFAULT_FILES[profile] : result.files[0];
          if (replacement) {
            setMasterFile(replacement);
            if (employmentType === "c2c") setRememberedFiles((previous) => ({ ...previous, [profile]: replacement }));
            setMasterLoading(true);
            return;
          }
        }
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
  }, [masterFile, profile, employmentType, selectionReady, masterLoadAttempt]);
  useEffect(() => {
    if (!selectionReady) return;
    const file = FULL_TIME_MASTER_FILES[profile];
    if (!file) return;
    const controller = new AbortController();
    fetch(`/api/master-resume?profile=${profile}&employmentType=full-time&file=${encodeURIComponent(file)}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => response.ok ? response.json() as Promise<{ resume?: MasterResume }> : null)
      .then((result) => { if (!controller.signal.aborted) setFullTimeMaster(result?.resume ?? null); })
      .catch(() => { if (!controller.signal.aborted) setFullTimeMaster(null); });
    return () => controller.abort();
  }, [profile, selectionReady]);
  const sourceCoverage = useMemo(() => analysis && master ? keywordCoverage(resumeScoringText(master), analysis.allTechnicalSkills) : null, [analysis, master]);
  const sourceTimeline = useMemo(() => master ? careerDuration(master.experience) : null, [master]);
  const sourceCompanies = useMemo(() => master ? [...new Set(master.experience.map((item) => item.company).filter(Boolean))] : [], [master]);
  const sourceYearsLabel = sourceTimeline ? `${sourceTimeline.years} yr${sourceTimeline.years === 1 ? "" : "s"}${sourceTimeline.remainingMonths ? ` ${sourceTimeline.remainingMonths} mo` : ""}` : "not available";
  const experienceTarget = useMemo(() => jdExperienceTarget(jd), [jd]);
  const effectiveTargetYears = targetYearsOverride ?? null;
  const proposedTimeline = useMemo(() => master && effectiveTargetYears ? proposeEmploymentTimeline(master.experience, effectiveTargetYears) : null, [master, effectiveTargetYears]);
  const fullTimeTimeline = useMemo(() => fullTimeMaster ? careerDuration(fullTimeMaster.experience) : null, [fullTimeMaster]);
  const fullTimeYearsLabel = fullTimeTimeline ? `${fullTimeTimeline.years} yr${fullTimeTimeline.years === 1 ? "" : "s"}${fullTimeTimeline.remainingMonths ? ` ${fullTimeTimeline.remainingMonths} mo` : ""}` : "";
  const fullTimeCompanies = useMemo(() => fullTimeMaster ? [...new Set(fullTimeMaster.experience.map((item) => item.company).filter(Boolean))] : [], [fullTimeMaster]);
  const sourceDegrees = master?.education.map((item) => item.degree).filter(Boolean) ?? [];
  const promptOne = useMemo(() => analysisPrompt(jd, profile), [jd, profile]);
  const promptTwo = useMemo(() => {
    if (!analysis || !master || (effectiveTargetYears !== null && !proposedTimeline)) return "";
    return generalGenerationPrompt(jd, analysis, master, sections, employmentType, effectiveTargetYears);
  }, [jd, analysis, master, sections, employmentType, effectiveTargetYears, proposedTimeline]);

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
      const response = await fetch("/api/current-resume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resume: parsed, profile, file: masterFile, employmentType, targetYears: effectiveTargetYears }) });
      const result = await response.json() as { resume?: MasterResume; error?: string; repairs?: string[] };
      if (revision !== workflowRevision.current) return;
      if (!response.ok || !result.resume || !analysis || !master) throw new Error(result.error ?? "Invalid generated resume JSON.");
      sessionStorage.setItem("guidedResumeData", JSON.stringify({ resume: result.resume, technicalSkills: analysis.allTechnicalSkills, selectedSections: sections, targetRole: analysis.targetRole, jobDescription: jd, sourceResume: master, profile, employmentType, validationRepairs: result.repairs ?? [], timelineProposal: proposedTimeline ? { targetYears: proposedTimeline.targetYears, targetMonths: proposedTimeline.targetMonths, referenceDate: proposedTimeline.referenceDate, reference: proposedTimeline.reference, changes: proposedTimeline.changes } : null }));
      router.push("/editor");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Invalid generated resume JSON."); }
  }

  return <div className="mx-auto max-w-7xl p-4 sm:p-6">
    {error ? <ActionToast message={error} type="error" onDismiss={() => setError("")} /> : notice ? <ActionToast message={notice} onDismiss={() => setNotice("")} /> : null}
    <header className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-lg sm:p-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--app-accent)]">Guided ChatGPT workflow · No API key</p><h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">JD to tailored resume</h1><p className="mt-2 text-[var(--app-muted)]">Choose a master resume for its company and career details, paste any job description, and review the proposed target timeline.</p></header>
    <section aria-label="Resume setup" className="mt-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
      <div className="grid gap-4 md:grid-cols-3">
      <div className="min-w-0">
      <label htmlFor="resume-profile" className="text-sm font-semibold">Master resume source</label>
      <select id="resume-profile" value={profile} disabled={!selectionReady} onChange={(event) => changeProfile(event.target.value as ResumeProfile)} className="mt-2 block h-12 w-full min-w-0 rounded-xl border border-[var(--app-border)] px-3 text-sm">
        <option value="general">General master — any target role from JD</option>
        <option value="java">Java master — source facts for JD</option>
        <option value="kafka">Kafka master — source facts for JD</option>
      </select>
      <p className="mt-2 text-xs text-[var(--app-muted)]">This chooses candidate history, not the target job. Every profile uses the same JD-first prompt; the pasted JD sets the target role, headline and relevant content.</p>
      </div>
      <div className="min-w-0">
      <label htmlFor="master-resume-file" className="text-sm font-semibold">Master resume</label>
      <select id="master-resume-file" value={masterFiles.includes(masterFile) ? masterFile : ""} disabled={!selectionReady || (employmentType === "full-time" && Boolean(FULL_TIME_MASTER_FILES[profile]))} onChange={(event) => changeMasterFile(event.target.value)} className="mt-2 block h-12 w-full min-w-0 rounded-xl border border-[var(--app-border)] px-3 text-sm">
        <option value="" disabled>Choose your source resume…</option>
        {masterFiles.map((file) => <option key={file} value={file}>{file}</option>)}
      </select>
      </div>
      <fieldset className="min-w-0">
      <legend className="text-sm font-semibold">Application arrangement</legend>
      <div className="mt-2 grid h-12 grid-cols-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-input)] p-1" role="group" aria-label="Application arrangement">
        {(["full-time", "c2c"] as const).map((type) => <button key={type} type="button" aria-pressed={employmentType === type} disabled={type === "full-time" && !FULL_TIME_MASTER_FILES[profile]} title={type === "full-time" && !FULL_TIME_MASTER_FILES[profile] ? "No verified full-time source is configured for this profile." : undefined} onClick={() => changeEmploymentType(type)} className={`rounded-lg px-2 text-xs font-semibold transition-colors sm:text-sm ${employmentType === type ? "bg-[var(--app-primary)] text-white shadow-sm" : "text-[var(--app-muted)] hover:text-[var(--foreground)]"} disabled:cursor-not-allowed disabled:opacity-40`}>{type === "full-time" ? "Full-time · Direct" : "C2C · Corp-to-corp"}</button>)}
      </div>
      <p className="mt-2 text-xs text-[var(--app-muted)]">Full-time auto-selects its configured source. C2C remembers your last compatible bachelor’s-only source; invalid saved choices are replaced by the profile default. The choice is saved automatically.</p>
      </fieldset>
      </div>
      <div className="mt-4 grid gap-3 border-t border-[var(--app-border)] pt-4 md:grid-cols-2">
        <div className={`rounded-xl border p-3 ${employmentType === "full-time" ? "border-[var(--app-accent)] bg-[var(--app-accent-soft)]" : "border-[var(--app-border)]"}`}>
          <p className="text-sm font-semibold">{employmentType === "full-time" ? "Selected: Full-time" : "Full-time uses"}</p>
          <p className="mt-1 text-xs text-[var(--app-muted)]">{FULL_TIME_MASTER_FILES[profile] ? `Configured source: ${FULL_TIME_MASTER_FILES[profile]}` : `Full-time is unavailable for ${PROFILE_LABELS[profile]} until a verified full-time master is added.`}</p>
          {FULL_TIME_MASTER_FILES[profile] && <p className="mt-1 text-xs text-[var(--app-muted)]">Companies: {fullTimeCompanies.length ? fullTimeCompanies.join(" · ") : "Loading source details…"}{fullTimeYearsLabel ? ` · ${fullTimeYearsLabel} dated history` : ""}</p>}
          {FULL_TIME_MASTER_FILES[profile] && fullTimeMaster?.education.length ? <p className="mt-1 text-xs text-[var(--app-muted)]">Degree in this source: {fullTimeMaster.education.map((item) => item.degree).join(" · ")}</p> : null}
        </div>
        <div className={`rounded-xl border p-3 ${employmentType === "c2c" ? "border-[var(--app-accent)] bg-[var(--app-accent-soft)]" : "border-[var(--app-border)]"}`}>
          <p className="text-sm font-semibold">{employmentType === "c2c" ? "Selected: C2C" : "C2C uses"}</p>
          <p className="mt-1 text-xs text-[var(--app-muted)]">Only sources with a bachelor’s degree and no master’s degree are selectable. Changing the arrangement does not rewrite employers or dates.</p>
        </div>
      </div>
      <div className="mt-3 rounded-xl bg-[var(--app-input)] p-3 text-xs text-[var(--app-muted)]">
        <p><span className="font-semibold text-[var(--foreground)]">Source currently loaded:</span> {masterLoading ? "Loading…" : masterFile || "None"}</p>
        <p className="mt-1"><span className="font-semibold text-[var(--foreground)]">Employers in source:</span> {masterLoading ? "Loading…" : sourceCompanies.length ? sourceCompanies.join(" · ") : "None loaded"}</p>
        <p className="mt-1"><span className="font-semibold text-[var(--foreground)]">Original dated work history:</span> {masterLoading ? "Loading…" : sourceYearsLabel}. These dates are retained for comparison; the selected target may create a proposed timeline for your review.</p>
        <p className="mt-1"><span className="font-semibold text-[var(--foreground)]">Education in this source:</span> {masterLoading ? "Loading…" : sourceDegrees.length ? sourceDegrees.join(" · ") : "None listed"}. Full-time uses its configured master’s-degree source; C2C sources contain a bachelor’s degree only.</p>
      </div>
      <div className="mt-3 flex flex-wrap items-end gap-3 rounded-xl border border-[var(--app-border)] p-3">
        <label className="text-sm font-semibold" htmlFor="target-years">Optional proposed timeline target (years)
          <input id="target-years" type="number" min={1} max={50} step={0.5} value={targetYearsOverride ?? ""} placeholder="Keep source dates" onChange={(event) => changeTargetYears(event.target.value === "" ? null : Number(event.target.value))} className="mt-1 block h-10 w-40 rounded-lg border border-[var(--app-border)] bg-[var(--app-input)] px-3 text-sm"/>
        </label>
        <button type="button" onClick={() => changeTargetYears(null)} disabled={!targetYearsOverride} className="h-10 rounded-lg border border-[var(--app-border)] px-3 text-sm font-semibold text-[var(--app-accent)] disabled:opacity-50">Use source dates</button>
        <p className="max-w-2xl text-xs text-[var(--app-muted)]">{experienceTarget ? `JD experience requirement detected: ${experienceTarget.requiredYears} years. This is informational and will not change your employment dates. Leave the target blank to preserve source dates, or enter a target to create a proposed timeline for your review.` : "Source employment dates are preserved by default. Enter a target only if you want the app to draft a proposed timeline for your review."}</p>
      </div>
      <p role="status" className="mt-4 border-t border-[var(--app-border)] pt-3 text-xs text-[var(--app-muted)]">{masterLoading ? "Loading master resume…" : masterError || `${PROFILE_LABELS[profile]} source ready. Your profile, source, and ${employmentType === "full-time" ? "full-time" : "C2C"} preference are saved automatically. Employer history stays tied to the selected source.`}</p>
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
        {analysis && <div className="mt-4 rounded-xl bg-[var(--app-accent-soft)] p-3"><p className="font-bold text-[var(--foreground)]">{analysis.targetRole || "Target role"}</p>{effectiveTargetYears !== null && <p className="mt-1 text-sm text-[var(--app-muted)]">Target timeline: {effectiveTargetYears} years as of today. The prompt includes proposed dates for every source employer. Review the changes before using the resume.</p>}<div className="mt-2 flex max-h-28 flex-wrap gap-1 overflow-auto">{analysis.allTechnicalSkills.map((skill) => <span key={skill} className="rounded-full bg-[var(--app-surface)] px-2 py-1 text-xs text-[var(--app-accent)]">{skill}</span>)}</div></div>}
        {analysis && effectiveTargetYears !== null && master && <div className="mt-4 rounded-xl border border-[var(--app-border)] p-3">
          <h3 className="font-semibold">Proposed employer dates — review before use</h3>
          <p className="mt-1 text-xs text-[var(--app-muted)]">Calculated from {new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", dateStyle: "long" }).format(new Date())}; this is a user-directed proposal, not independent verification.</p>
          {proposedTimeline ? <div className="mt-3 overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-[var(--app-border)] text-[var(--app-muted)]"><th className="py-2 pr-3">Company</th><th className="py-2 pr-3">Original dates</th><th className="py-2">Proposed dates</th></tr></thead><tbody>{proposedTimeline.changes.map((change) => <tr key={change.id} className="border-b border-[var(--app-border)] last:border-0"><td className="py-2 pr-3 font-semibold">{change.company}</td><td className="py-2 pr-3">{change.originalStartDate} – {change.originalEndDate}</td><td className="py-2">{change.proposedStartDate} – {change.proposedEndDate}</td></tr>)}</tbody></table></div> : effectiveTargetYears < 1 || effectiveTargetYears > 50 ? <p className="mt-2 text-sm text-[var(--app-error)]">Enter a target between 1 and 50 years.</p> : <p className="mt-2 text-sm text-[var(--app-error)]">This target is too short to assign at least one month to each of the {master.experience.length} existing employers. Increase the target to generate a proposal.</p>}
        </div>}
      </StepCard>
    </section>
    {analysis && <p className="mt-4 text-sm text-[var(--app-muted)]">The current JD controls the target role for every source profile. Company titles, dates, education and technology claims stay grounded in the selected master; unsupported JD skills are not added as hands-on experience.</p>}
    {sourceCoverage && sourceCoverage.missing.length > 0 && <aside aria-label="Source resume gaps" className="mt-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-accent-soft)] p-5"><h2 className="font-bold">JD terms to verify against your source</h2><p className="mt-2 text-sm">{sourceCoverage.missing.length} extracted JD terms were not found by the local text check in the selected master. The prompt prioritizes JD requirements but leaves unsupported technologies and duties unclaimed. Add verified work details to your source resume if you have used these skills.</p><details className="mt-3 text-sm"><summary className="cursor-pointer font-semibold">View terms not found</summary><p className="mt-2">{sourceCoverage.missing.join(", ")}</p></details><p className="mt-3 text-sm text-[var(--app-muted)]">The resume headline and employer role labels are generated from the JD and supported work details. Proposed dates are shown above for your review.</p></aside>}
    {analysis && <section className="mt-5"><StepCard number="2" title="Generate and open the resume"><div className="grid gap-5 lg:grid-cols-2"><div><SectionSelector selectedSections={sections} onChange={setSections}/><button disabled={masterLoading || !master || !promptTwo} onClick={() => void copy(promptTwo, "Resume prompt copied. Paste it into ChatGPT, then paste the generated resume JSON here.")} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--app-primary)] px-4 py-3 font-semibold text-white disabled:opacity-50"><Clipboard size={17}/> Copy resume prompt</button></div><div><p className="mb-2 text-sm font-semibold">Generated resume JSON</p><JsonInput value={resumeText} setValue={setResumeText} onUpload={(event) => void upload(event, setResumeText)} placeholder="Paste ChatGPT generated resume JSON…" compact/><button disabled={!resumeText.trim()} onClick={() => void openEditor()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--app-primary)] px-4 py-3 font-semibold text-white disabled:opacity-50"><FileJson size={17}/> Validate, edit and preview</button></div></div></StepCard></section>}
  </div>;
}

function StepCard({ number, title, children }: { number: string; title: string; children: React.ReactNode }) { return <article className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-md"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--app-accent-soft)] text-sm font-bold text-[var(--app-accent)]" aria-label={`Step ${number}`}>{number}</span><h2 className="text-xl font-bold">{title}</h2></div>{children}</article>; }
function JsonInput({ value, setValue, onUpload, placeholder, compact = false }: { value: string; setValue: (value: string) => void; onUpload: (event: ChangeEvent<HTMLInputElement>) => void; placeholder: string; compact?: boolean }) { return <><textarea value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} spellCheck={false} className={`${compact ? "h-48" : "h-64"} w-full rounded-xl bg-[var(--app-input)] p-3 font-mono text-xs leading-5 text-[var(--app-code)]`}/><label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--app-border)] px-3 py-2 text-sm font-semibold text-[var(--app-accent)]"><Upload size={15}/> Upload JSON<input type="file" accept=".json,application/json" onChange={onUpload} className="hidden"/></label></>; }
