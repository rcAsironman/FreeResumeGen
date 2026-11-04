"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ActionToast } from "@/components/shared/ActionToast";
import { generalGenerationPrompt } from "@/prompts/general-resume";
import { analyzeLocally, resolveTarget, reviewDraft } from "@/engine/resume-review/jd-workflow";
import { strengthenDraftMetrics, METRIC_DRAFT_VERSION } from "@/engine/resume-review/achievement-draft";
import { proposeEmploymentTimeline, type StudyDates } from "@/engine/resume-review/experience-target";
import { parsePastedJson } from "@/utils/parse-pasted-json";
import { PROFILE_DEFAULT_FILES } from "@/types/resume-profile";
import { FULL_TIME_MASTER_FILES, type EmploymentType } from "@/types/employment-type";
import type { MasterResume } from "@/types/resume";
import { masterResumeSchema } from "@/engine/validation/resume.schema";

import { preserveEmploymentTimeline } from "@/engine/resume-review/locked-timeline";
import { careerDuration } from "@/engine/resume-review/content-review";

const KEY = "resume-v4-workflow";
const control = "mt-2 block w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-input)] p-3 text-sm";
const button = "rounded-xl bg-[var(--app-primary)] px-4 py-3 font-semibold text-white disabled:opacity-40";
const panel = "mt-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5";
export function GuidedResumeWorkflow() {
  const router = useRouter();
  const [ready,setReady] = useState(false);
  const [mode,setMode] = useState<EmploymentType>("full-time");
  const [gc,setGc] = useState(false);
  const [years,setYears]=useState<number|null>(null);
  const [study,setStudy]=useState<StudyDates>({start:'2024-01',end:'2025-12',cpt:'2025-01'});
  const profile = "general" as const;
  const [file,setFile] = useState(PROFILE_DEFAULT_FILES.general);
  const [files,setFiles] = useState<string[]>([]);
  const [source,setSource] = useState<MasterResume|null>(null);
  const [custom,setCustom] = useState<Partial<Record<EmploymentType,MasterResume>>>({});
  const [settingsText,setSettingsText] = useState("");
  const [jd,setJd] = useState("");
  const [responseText,setResponseText] = useState("");
  const [prompt,setPrompt] = useState("");
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [notice,setNotice] = useState("");
  const [reload,setReload] = useState(0);
  const [loading,setLoading] = useState(true);
  const revision = useRef(0);
  useEffect(() => {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || "null");
      if(value?.version===2) {
        if(value.mode==="c2c" || value.mode==="full-time") setMode(value.mode);
        setGc(value.gc===true);
        if(Number.isInteger(value.years)&&value.years>=1&&value.years<=30)setYears(value.years);
        if(value.study&&['start','end','cpt'].every(k=>typeof value.study[k]==='string'))setStudy(value.study);

        if(value.profile === "general" && typeof value.file==="string") setFile(value.file);
        if(typeof value.jd==="string") setJd(value.jd);
        if(typeof value.responseText==="string") setResponseText(value.responseText);
        const loaded: Partial<Record<EmploymentType,MasterResume>> = {};
        for(const key of ["full-time","c2c"] as const) if(value.custom?.[key]) loaded[key] = masterResumeSchema.parse(value.custom[key]);
        if(value.c2cTimelineVersion!==2) {
          if(loaded.c2c) localStorage.setItem(KEY+":c2c-history-backup",JSON.stringify(loaded.c2c));
          delete loaded.c2c;
          setFile(PROFILE_DEFAULT_FILES.general);
        }
        setCustom(loaded);
      }
    } catch {
      try { const raw = localStorage.getItem(KEY); if (raw) localStorage.setItem(KEY + ":recovery:" + Date.now(), raw); } catch { /* Existing settings are not deleted explicitly. */ }
      setError("Saved settings could not be read. A recovery copy was attempted in browser storage; keep your source JSON backup before replacing settings.");
    }
    setReady(true);
  },[]);
  useEffect(() => {
    if(!ready) return;
    try { localStorage.setItem(KEY,JSON.stringify({version:2,c2cTimelineVersion:2,mode,gc,years,study,profile,file,jd,responseText,custom})); }
    catch { setError("Browser storage is full or unavailable. Keep a copy of your JSON before closing this page."); }
  },[ready,mode,gc,years,study,profile,file,jd,responseText,custom]);
  useEffect(() => {
    if(!ready) return;
    revision.current++; setPrompt(""); setSource(null); setLoading(true);
    if(custom[mode]) {setSource(custom[mode]!); setLoading(false); return;}
    const controller = new AbortController();
    const selected = mode === "full-time" ? FULL_TIME_MASTER_FILES[profile] : file;
    if(!selected) {setError("This source has no full-time history. Select General or import your full-time settings.");setLoading(false);return;}
    fetch(`/api/master-resume?profile=${profile}&employmentType=${mode}&file=${encodeURIComponent(selected)}`,{signal:controller.signal,cache:"no-store"})
      .then(async r => {if(!r.headers.get("content-type")?.includes("application/json")) throw new Error("Resume service did not return JSON. Check the running server.");return r.json();})
      .then(data => {if(controller.signal.aborted)return;setFiles(data.files||[]);if(!data.resume)throw new Error(data.error||"Source unavailable");setSource(data.resume);setLoading(false);setError("");})
      .catch(e=>{if(!controller.signal.aborted){setLoading(false);setError(String(e.message||e));}});
    return ()=>controller.abort();
  },[ready,mode,profile,file,custom,reload]);
  const locked=mode==='c2c'&&gc;
  const duration=source?careerDuration(source.experience):null;
  const target = useMemo(()=>mode==='c2c'&&gc?resolveTarget(jd,mode,gc):years?{years,reason:'Your selected experience overrides the JD'}:resolveTarget(jd,mode,gc),[jd,mode,gc,years]);
  const analysis = useMemo(()=>analyzeLocally(jd),[jd]);
  const timelineResult=useMemo(()=>{try{return {timeline:source&&target.years?proposeEmploymentTimeline(source.experience,target.years,new Date(),mode==='full-time'?study:undefined):null,error:''};}catch(e){return {timeline:null,error:e instanceof Error?e.message:'Invalid study dates'};}},[source,target.years,mode,study]);
  const timeline=timelineResult.timeline;
  function invalidate() {revision.current++;setPrompt("");setNotice("");setError("");}
  function buildPrompt() {
    if(!source)return;
    if(timelineResult.error || target.years && !timeline){setError(timelineResult.error||"The target cannot fit these employers around the study gap. Review the selected years or company settings.");return;}
    setPrompt(generalGenerationPrompt(jd,analysis,source,["professionalSummary","experience"],mode,target.years,study,locked));
    setNotice("Complete prompt ready. Copy it into ChatGPT, then paste the resume JSON in Step 2.");
  }
  async function copy() {try{await navigator.clipboard.writeText(prompt);setNotice("Resume prompt copied. Paste it into ChatGPT.");}catch{setError("Clipboard unavailable. Select the prompt below and copy it manually.");}}
  async function generate() {
    if(!source)return;
    if(timelineResult.error || target.years && !timeline){setError(timelineResult.error||'Cannot allocate the selected years across these employers and study dates.');return;}
    const current=revision.current;setBusy(true);setError("");
    try {
      const raw=parsePastedJson(responseText);
      const input=raw && typeof raw==="object" && "resume" in raw ? (raw as {resume:unknown}).resume : raw;
      const result=await fetch("/api/current-resume",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({resume:input,draftMode:"jd-first",jobDescription:jd})});
      const data=await result.json();
      if(current!==revision.current)return;
      if(!result.ok || !data.resume)throw new Error(data.error||"Unable to validate resume");
      const enriched=strengthenDraftMetrics(data.resume as MasterResume);
      const draft=enriched.resume;
      if(locked) draft.experience=preserveEmploymentTimeline(draft.experience,source.experience);
      if(timeline && draft.experience.length===timeline.experience.length && draft.experience.every((e,i)=>e.id===timeline.experience[i].id&&e.company===timeline.experience[i].company)) {
        if(draft.experience.some((e,i)=>e.startDate!==timeline.experience[i].startDate||e.endDate!==timeline.experience[i].endDate))data.repairs=[...(data.repairs||[]),'Applied the selected proposed timeline, including the study gap. Review dates and any years mentioned in the summary.'];
        draft.experience=draft.experience.map((e,i)=>({...e,startDate:timeline.experience[i].startDate,endDate:timeline.experience[i].endDate}));
      }
      const findings=reviewDraft(draft,source,jd,target.years);
      // Keep the imported resume intact. The source is reference data, never an import identity restriction.
      const proposal=timeline && draft.experience.length===timeline.experience.length && draft.experience.every((e,i)=>e.id===timeline.experience[i].id && e.company===timeline.experience[i].company && e.startDate===timeline.experience[i].startDate && e.endDate===timeline.experience[i].endDate)?timeline:null;
      const context={resume:draft,technicalSkills:analysis.allTechnicalSkills,selectedSections:["professionalSummary","experience"],targetRole:analysis.targetRole,jobDescription:jd,sourceResume:source,profile,employmentType:mode,preserveSourceTimeline:locked,studyDates:study,validationRepairs:[...(data.repairs||[]),...(enriched.edits.length?[`Added ${enriched.edits.length} unverified numerical draft examples. Review and replace with actual results before professional use.`]:[])],draftMetricEdits:enriched.edits,metricDraftVersion:METRIC_DRAFT_VERSION,timelineProposal:proposal,targetYears:target.years,draftFindings:findings};
      sessionStorage.setItem("guidedResumeData",JSON.stringify(context));
      localStorage.setItem("resume-clone-editor-v2",JSON.stringify(context));
      router.push("/editor");
    }catch(e){setError(e instanceof Error?e.message:"Could not open the resume. Your response remains in the textbox.");}finally{setBusy(false);}
  }
  function saveSettings(){try{const parsed=masterResumeSchema.parse(parsePastedJson(settingsText));setCustom(old=>({...old,[mode]:parsed}));invalidate();setNotice(`${mode} settings saved separately. They will survive refresh.`);}catch(e){setError(e instanceof Error?e.message:"Invalid settings JSON");}}
  return <div className="mx-auto max-w-6xl p-4 sm:p-6">
    {error?<ActionToast message={error} type="error" onDismiss={()=>setError("")}/>:notice?<ActionToast message={notice} onDismiss={()=>setNotice("")}/>:null}
    <header className={panel}><p className="text-xs font-bold uppercase tracking-widest text-[var(--app-accent)]">Two steps · No API key</p><h1 className="mt-2 text-3xl font-bold">Your experience. The current job description.</h1><p className="mt-2 text-[var(--app-muted)]">Create one prompt, then import the response. Your editor, resume format and badge controls remain available.</p></header>
    <section className={panel} aria-label="Application settings"><div className="grid gap-4 sm:grid-cols-3"><label>Employment type<select aria-label="Employment type" className={control} value={mode} onChange={e=>{invalidate();setMode(e.target.value as EmploymentType);}}><option value="full-time">Full-Time</option><option value="c2c">C2C</option></select></label><label className="flex items-center gap-3"><input aria-label="GC selected" type="checkbox" checked={gc} disabled={mode!=="c2c"} onChange={e=>{invalidate();setGc(e.target.checked);}}/> GC selected (keep company dates)</label><div><p className="font-semibold">{locked&&duration?`${duration.years} years ${duration.remainingMonths} months — locked`:target.years?`${target.years} years` : "Source timeline"}</p><p className="mt-2 text-sm text-[var(--app-muted)]">{target.reason}</p></div></div>
      <label className="mt-4 block font-semibold">Experience years<select aria-label="Experience years" disabled={locked} className={control} value={years??'auto'} onChange={e=>{invalidate();setYears(e.target.value==='auto'?null:Number(e.target.value));}}><option value="auto">Automatic (JD; GC preserves history)</option>{Array.from({length:30},(_,i)=>i+1).map(n=><option key={n} value={n}>{n} {n===1?'year':'years'}</option>)}</select></label>
      {mode==='full-time'&&<fieldset className="mt-4 rounded-xl border border-[var(--app-border)] p-3"><legend>Master’s study / CPT timeline</legend><div className="grid gap-3 sm:grid-cols-3">{([{key:'start',label:'Master’s start'},{key:'end',label:'Master’s end'},{key:'cpt',label:'CPT start (blank if none)'}] as const).map(f=><label key={f.key}>{f.label}<input aria-label={f.label} type="month" className={control} value={study[f.key]} onChange={e=>{invalidate();setStudy(old=>({...old,[f.key]:e.target.value}));}}/></label>)}</div><p className="mt-2 text-sm">Employment excludes the study period before your CPT start. Without CPT, the entire study period is excluded. Earlier employment may precede your master’s. Selected years count working months only.</p>{timelineResult.error&&<p role="alert">{timelineResult.error}</p>}</fieldset>}
      <p className="mt-4 text-sm">{loading?"Loading source…":source?source.experience.map(e=>e.company).join(" · "):"No source loaded"}</p>
      <details className="mt-4"><summary className="cursor-pointer font-semibold">Company settings and source history</summary><div className="mt-3 grid gap-3 sm:grid-cols-2"><div><p className="font-semibold">Universal JD-first generation</p><p className="mt-2 text-sm">Full-Time and C2C have separate company settings. There are no Java/Kafka source profiles.</p></div><label>Source file<select className={control} disabled={mode==="full-time" || Boolean(custom[mode])} value={mode==="full-time"?FULL_TIME_MASTER_FILES[profile]||"":file} onChange={e=>{invalidate();setFile(e.target.value);}}>{files.map(f=><option key={f}>{f}</option>)}</select></label></div><p className="my-3 text-sm">Saved history supplies identity and company context, not a technology whitelist for the editable draft. Import complete source JSON separately for each employment type. Include actual work and measured outcomes when available.</p><button className={button} disabled={!source} onClick={()=>setSettingsText(JSON.stringify(source,null,2))}>Edit current source JSON</button><textarea aria-label="Company settings JSON" className={control+" h-52 font-mono"} value={settingsText} onChange={e=>setSettingsText(e.target.value)} placeholder="Paste or edit source resume JSON"/><div className="mt-3 flex gap-3"><button className={button} disabled={!settingsText.trim()} onClick={saveSettings}>Save company settings</button><button className={button} onClick={()=>{invalidate();setCustom(old=>{const next={...old};delete next[mode];return next;});setReload(v=>v+1);}}>Reload file source</button></div></details>
    </section>
    <section className={panel} id="job-description"><h2 className="text-xl font-bold">1. Job description → complete prompt</h2><textarea aria-label="Job description" className={control+" h-64"} value={jd} onChange={e=>{invalidate();setJd(e.target.value);}} placeholder="Paste the complete JD"/><p className="my-3 text-sm">Detected headline: {analysis.targetRole||"ChatGPT will identify the target title from the full JD"}. {target.years?"Dates will be calculated as a proposal; original history remains in settings.":"Dates remain unchanged."}</p><div className="flex gap-3"><button className={button} disabled={loading||!source||jd.trim().length<20} onClick={buildPrompt}>Generate prompt</button><button className={button} disabled={!prompt} onClick={()=>void copy()}>Copy prompt</button></div>{prompt&&<details className="mt-4"><summary>View complete prompt</summary><textarea aria-label="Complete prompt" className={control+" h-64 font-mono"} value={prompt} readOnly/></details>}
    {timeline&&<details className="mt-4"><summary>Review proposed employer dates</summary><ul className="mt-2 space-y-2 text-sm">{timeline.changes.map(c=><li key={c.id}>{c.company}: {c.originalStartDate}–{c.originalEndDate} → {c.proposedStartDate}–{c.proposedEndDate}</li>)}</ul></details>}</section>
    <section className={panel} id="resume-import"><h2 className="text-xl font-bold">2. Paste response → generate resume</h2><p className="mt-2 text-sm text-[var(--app-muted)]">Paste the complete ChatGPT JSON. The generated roles, work descriptions, technologies and numerical outcomes are an unverified JD-first draft for your review. No metrics are automatically removed.</p><textarea aria-label="ChatGPT response" className={control+" h-64 font-mono"} value={responseText} onChange={e=>{revision.current++;setResponseText(e.target.value);}} placeholder="Paste complete resume JSON, with or without a code fence"/><button className={button+" mt-3"} disabled={busy||loading||!source||!responseText.trim()} onClick={()=>void generate()}>{busy?"Opening resume…":"Generate resume"}</button></section>
  </div>;
}
