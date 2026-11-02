"use client";
import { useMemo, useState } from "react";
import { ATS_PROVIDERS, type AtsProvider, type AtsResult } from "@/types/ats";
import type { MasterResume } from "@/types/resume";
import { atsImprovementPrompt } from "@/prompts/ats-improvement";
import { keywordCoverage } from "@/engine/ats/resume-text";

type Check = { loading?: boolean; error?: string; result?: AtsResult; snapshot?: string };
export function AtsScorePanel({ initialJd, keywords, getResumeText, getResume, source, profile, revision }: { initialJd: string; keywords: string[]; getResumeText: () => string; getResume: () => MasterResume; source: MasterResume | null; profile?: string; revision: string }) {
  const [copyNotice, setCopyNotice] = useState("");
  const [jd, setJd] = useState(initialJd);
  const [checks, setChecks] = useState<Partial<Record<AtsProvider, Check>>>({});
  const [local, setLocal] = useState<{ score: number | null; matched: string[]; missing: string[]; snapshot: string } | null>(null);
  const snapshot = useMemo(() => JSON.stringify([revision, jd]), [revision, jd]);
  const currentResults = Object.values(checks).flatMap(check => check?.result && check.snapshot === snapshot ? [check.result] : []);
  const currentLocal = local?.snapshot === snapshot ? local : null;
  async function copyImprovement() {
    try {
      await navigator.clipboard.writeText(atsImprovementPrompt(jd, getResume(), source, currentResults, currentLocal?.missing ?? [], profile));
      setCopyNotice("Improvement prompt copied. Paste into ChatGPT, then paste its complete resume JSON into the JSON editor below and click Validate edits and update preview. Run the score checks again afterwards.");
    } catch { setCopyNotice("Could not copy. Allow clipboard access in your browser and try again."); }
  }
  async function check(provider: AtsProvider) {
    const submittedSnapshot = snapshot;
    setChecks(previous => ({ ...previous, [provider]: { loading: true } }));
    try {
      const response = await fetch("/api/ats-score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider, resumeText: getResumeText(), jobDescription: jd }) });
      if (!response.headers.get("content-type")?.includes("application/json")) throw new Error("Scoring is unavailable. Refresh the app and try again.");
      const body = await response.json() as { result?: AtsResult; error?: string };
      if (!response.ok || !body.result) throw new Error(body.error ?? "No score returned.");
      setChecks(previous => ({ ...previous, [provider]: { result: body.result, snapshot: submittedSnapshot } }));
    } catch (error) {
      setChecks(previous => ({ ...previous, [provider]: { error: error instanceof Error ? error.message : "Unable to check this resume." } }));
    }
  }
  return <section aria-labelledby="ats-heading" className="mt-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
    <div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs font-bold uppercase tracking-widest text-[var(--app-accent)]">Resume quality check</p><h2 id="ats-heading" className="mt-1 text-xl font-bold">ATS & job-match scores</h2></div><span className="rounded-full bg-[var(--app-accent-soft)] px-3 py-1 text-xs text-[var(--app-accent)]">Free service access · No API key</span></div>
    <p className="mt-2 text-sm text-[var(--app-muted)]">Each provider uses its own method. Scores are estimates, not employer ATS results. Text checks do not test how your exported PDF or DOCX parses. Apply pending JSON edits to the preview before checking.</p>
    <label htmlFor="ats-jd" className="mt-4 block text-sm font-semibold">Compare with this job description</label>
    <textarea id="ats-jd" value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the job description to compare…" className="mt-2 h-28 w-full rounded-xl border border-[var(--app-border)] p-3 text-sm" />
    <p className="mt-2 text-xs text-[var(--app-muted)]">Click a provider to send your current edited resume content and this JD to that service. Name, email, phone and contact links are excluded. Employers and career details are included. Free limits apply.</p>
    <div className="mt-4 grid gap-4 md:grid-cols-2">{(Object.keys(ATS_PROVIDERS) as AtsProvider[]).map(provider => {
      const info = ATS_PROVIDERS[provider], state = checks[provider], result = state?.result;
      const stale = Boolean(result && state?.snapshot !== snapshot);
      return <article key={provider} className="rounded-xl border border-[var(--app-border)] bg-[var(--app-input)] p-4">
        <div className="flex items-center justify-between gap-3"><a href={info.url} target="_blank" rel="noreferrer" className="font-semibold text-[var(--app-accent)] underline underline-offset-4">{info.name}</a><span className="text-xs text-[var(--app-muted)]">Provider score</span></div>
        {result ? <><div className={`mt-4 flex flex-wrap gap-6 ${stale ? "opacity-50" : ""}`}><div><p className="text-3xl font-bold">{result.matchScore}<span className="text-sm font-normal text-[var(--app-muted)]"> / 100</span></p><p className="text-xs text-[var(--app-muted)]">JD match · {info.name}</p></div>{result.atsScore !== undefined && <div><p className="text-3xl font-bold">{result.atsScore}<span className="text-sm font-normal text-[var(--app-muted)]"> / 100</span></p><p className="text-xs text-[var(--app-muted)]">ATS text assessment · {info.name}</p></div>}</div>
          <p className="mt-3 text-xs text-[var(--app-muted)]">{stale ? "Resume or JD changed. Run this check again for a current score." : `Checked ${new Date(result.checkedAt).toLocaleTimeString()} · Contact fields excluded from assessment`}</p>
          {result.missingSkills.length > 0 && <Feedback title="Not found by this provider" items={result.missingSkills}/>}
          {result.suggestions.length > 0 && <Feedback title="Suggested terms — add only when true" items={result.suggestions}/>}
          {result.issues.length > 0 && <Feedback title="Provider feedback" items={result.issues}/>}
        </> : <p className="my-5 text-sm text-[var(--app-muted)]">Not checked yet. No score is estimated on this provider’s behalf.</p>}
        {state?.error && <p role="alert" className="mt-3 text-sm text-[var(--app-error)]">{state.error}</p>}
        <p className="mt-3 text-xs text-[var(--app-muted)]">App limit: {info.maxResume.toLocaleString()} resume / {info.maxJd.toLocaleString()} JD characters. Text is never silently shortened.</p>
        <button type="button" onClick={() => void check(provider)} disabled={state?.loading || jd.trim().length < 50} className="mt-3 rounded-lg bg-[var(--app-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{state?.loading ? "Checking…" : `Check with ${info.name}`}</button>
      </article>;
    })}</div>
    <div className="mt-4 rounded-xl border border-[var(--app-border)] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold">Improve this resume with the feedback</h3><p className="mt-1 text-xs text-[var(--app-muted)]">One click copies a complete regeneration prompt. It includes current scores and evidence-backed missing-term suggestions.</p></div><button type="button" disabled={!currentResults.length && !currentLocal} onClick={() => void copyImprovement()} className="rounded-lg bg-[var(--app-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Copy improvement prompt</button></div><p className="mt-2 text-xs text-[var(--app-muted)]">{currentResults.length || currentLocal ? "Paste into ChatGPT, then click Validate edits and update preview with the revised JSON below. Scores may change; improvements are not guaranteed." : "Run a provider or local keyword check on the current resume and JD to enable this button."}{!source ? " Original master unavailable: the prompt will revise existing facts only." : " Uses your original selected master and generation mode."}</p>{copyNotice && <p role="status" className="mt-3 text-sm text-[var(--app-accent)]">{copyNotice}</p>}</div>
    {keywords.length > 0 && <div className="mt-4 border-t border-[var(--app-border)] pt-4"><button type="button" onClick={() => setLocal({ ...keywordCoverage(getResumeText(), keywords), snapshot })} className="text-sm font-semibold text-[var(--app-accent)] underline underline-offset-4">Check extracted JD keyword coverage locally</button>{local && <div className="mt-2 text-sm"><p>{local.score ?? "—"}% of {local.matched.length + local.missing.length} extracted terms found · Resume Generator local check</p><p className="text-xs text-[var(--app-muted)]">Keyword presence only; not an ATS score or verification of experience. Uses the original analyzed JD terms.{local.snapshot !== snapshot ? " Resume or JD changed; rerun. Re-analyze the JD on Home if its requirements changed." : ""}</p>{local.missing.length > 0 && <Feedback title="Terms not found" items={local.missing}/>}</div>}</div>}
  </section>;
}
function Feedback({ title, items }: { title: string; items: string[] }) { return <details className="mt-3 text-sm"><summary className="cursor-pointer text-[var(--app-accent)]">{title} ({items.length})</summary><ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--app-muted)]">{items.map((item, i) => <li key={i}>{item}</li>)}</ul></details>; }
