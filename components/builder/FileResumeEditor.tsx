"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Eye, FileText, Plus, RefreshCw, Trash2, X } from "lucide-react";

import { FixedResumeTemplate } from "@/templates/fixed-resume/FixedResumeTemplate";
import { SectionSelector, type HighlightSection } from "@/components/builder/SectionSelector";
import { RichTextToolbar } from "@/components/builder/RichTextToolbar";
import { ActionToast } from "@/components/shared/ActionToast";
import type { MasterResume } from "@/types/resume";
import { DEFAULT_RESUME_FONT, RESUME_FONT_OPTIONS, type ResumeFont } from "@/types/resume-font";

const DEFAULT_SECTIONS: HighlightSection[] = ["professionalSummary", "experience"];

function safeName(value: string) { return value.trim().replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, ""); }
function downloadName(resume: MasterResume, format: string) {
  const parts = resume.personalInfo.fullName.trim().split(/\s+/);
  const candidate = safeName(parts.length > 1 ? `${parts[0]}_${parts.at(-1)}` : parts[0] || "Candidate");
  return `${candidate}_Resume.${format}`;
}

export function FileResumeEditor() {
  const [resume, setResume] = useState<MasterResume | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [font, setFont] = useState<ResumeFont>(DEFAULT_RESUME_FONT);
  const [fullPreview, setFullPreview] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [downloading, setDownloading] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedSections, setSelectedSections] = useState<HighlightSection[]>(DEFAULT_SECTIONS);
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);

  const loadFile = useCallback(async () => {
    setError(""); setNotice("");
    try {
      const guided = sessionStorage.getItem("guidedResumeData");
      if (guided) {
        const data = JSON.parse(guided) as { resume: MasterResume; technicalSkills: string[]; selectedSections: HighlightSection[]; targetRole?: string };
        setResume(data.resume); setJsonText(JSON.stringify(data.resume, null, 2)); setTechnicalSkills(data.technicalSkills); setSelectedSections(data.selectedSections);
        return;
      }
      const response = await fetch("/api/current-resume", { cache: "no-store" });
      const result = await response.json() as { success: boolean; resume?: MasterResume; error?: string };
      if (!response.ok || !result.resume) throw new Error(result.error ?? "Unable to load the resume file.");
      setResume(result.resume);
      setJsonText(JSON.stringify(result.resume, null, 2));
      setTechnicalSkills(result.resume.technicalSkills.categories.flatMap((category) => category.skills));
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to load data/generated-resume.json."); }
  }, []);

  useEffect(() => { void loadFile(); }, [loadFile]);

  function update(next: MasterResume) {
    setResume(next);
    setJsonText(JSON.stringify(next, null, 2));
    setError(""); setNotice("Preview updated in memory. Copy the JSON into the VS Code file to keep it permanently.");
  }

  async function applyJson() {
    try {
      const parsed = JSON.parse(jsonText) as unknown;
      const response = await fetch("/api/current-resume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed) });
      const result = await response.json() as { success: boolean; resume?: MasterResume; error?: string };
      if (!response.ok || !result.resume) throw new Error(result.error ?? "Invalid resume JSON.");
      update(result.resume);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Invalid resume JSON."); }
  }

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(jsonText);
      setNotice("Updated JSON copied. Paste it into data/generated-resume.json in VS Code and save.");
      setError("");
    } catch {
      setError("Unable to copy to the clipboard. Check browser clipboard permission and try again.");
    }
  }

  async function download(format: "pdf" | "docx") {
    if (!resume || downloading) return;
    setDownloading(format); setError("");
    try {
      const documentHtml = serializeEditedDocument();
      const editedResume = readDirectTextEdits();
      const response = await fetch(`/api/export/${format}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resume: editedResume, technicalSkills, selectedSections, fontFamily: font, documentHtml: format === "pdf" ? documentHtml : undefined }) });
      if (!response.ok) throw new Error(`Unable to generate ${format.toUpperCase()}.`);
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a"); link.href = url; link.download = downloadName(resume, format); link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice(`${format.toUpperCase()} download created successfully.`);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Download failed."); }
    finally { setDownloading(""); }
  }

  function readDirectTextEdits(): MasterResume {
    const root = editorRef.current;
    const next = structuredClone(resume!);
    if (!root) return next;
    const text = (element: Element | null) => (element as HTMLElement | null)?.innerText.replace(/\s+/g, " ").trim() ?? "";

    next.personalInfo.fullName = text(root.querySelector('[data-resume-field="fullName"]'));
    next.personalInfo.professionalTitle = text(root.querySelector('[data-resume-field="professionalTitle"]'));
    next.personalInfo.email = text(root.querySelector('[data-contact-field="email"]')).replace(/^\|\s*/, "");
    next.personalInfo.phone = text(root.querySelector('[data-contact-field="phone"]')).replace(/^\|\s*/, "");
    next.personalInfo.location = text(root.querySelector('[data-contact-field="location"]')).replace(/^\|\s*/, "");
    next.personalInfo.linkedIn = text(root.querySelector('[data-resume-field="linkedIn"]'));

    next.professionalSummary.bullets = Array.from(root.querySelectorAll("[data-summary-index]"))
      .map((element) => text(element)).filter(Boolean);

    next.technicalSkills.categories = Array.from(root.querySelectorAll("[data-skill-category-index]"))
      .map((categoryElement) => ({
        name: text(categoryElement.querySelector("[data-skill-category-name]")).replace(/:\s*$/, ""),
        skills: Array.from(categoryElement.querySelectorAll("[data-skill-index]")).map((element) => text(element).replace(/^,\s*/, "")).filter(Boolean),
      })).filter((category) => category.name && category.skills.length);

    next.education = Array.from(root.querySelectorAll("[data-education-index]")).map((element) => {
      const index = Number(element.getAttribute("data-education-index"));
      return { ...next.education[index], degree: text(element.querySelector('[data-education-field="degree"]')), institution: text(element.querySelector('[data-education-field="institution"]')), location: text(element.querySelector('[data-education-field="location"]')) || undefined, graduationDate: text(element.querySelector('[data-education-field="graduationDate"]')) || undefined };
    }).filter((item) => item?.degree && item?.institution);

    next.experience = Array.from(root.querySelectorAll("[data-experience-index]")).map((element) => {
      const index = Number(element.getAttribute("data-experience-index"));
      const original = next.experience[index];
      return { ...original, company: text(element.querySelector('[data-experience-field="company"]')), location: text(element.querySelector('[data-experience-field="location"]')), startDate: text(element.querySelector('[data-experience-field="startDate"]')), endDate: text(element.querySelector('[data-experience-field="endDate"]')), role: text(element.querySelector('[data-experience-field="role"]')), responsibilities: Array.from(element.querySelectorAll("[data-responsibility-index]")).map((item) => text(item)).filter(Boolean), environment: Array.from(element.querySelectorAll("[data-environment-index]")).map((item) => text(item).replace(/^,\s*/, "")).filter(Boolean) };
    }).filter((item) => item?.company && item?.role);

    return next;
  }

  function serializeEditedDocument() {
    const source = editorRef.current?.firstElementChild as HTMLElement | null;
    if (!source) return undefined;
    const clone = source.cloneNode(true) as HTMLElement;
    const sourceNodes = [source, ...Array.from(source.querySelectorAll<HTMLElement>("*"))];
    const cloneNodes = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>("*"))];
    const properties = ["font-family", "font-size", "font-weight", "font-style", "text-decoration", "color", "background-color", "text-align", "line-height", "margin-top", "margin-right", "margin-bottom", "margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-top", "border-right", "border-bottom", "border-left", "display", "list-style-type", "white-space"];
    sourceNodes.forEach((node, index) => {
      const target = cloneNodes[index];
      if (!target) return;
      const computed = window.getComputedStyle(node);
      for (const property of properties) {
        let value = computed.getPropertyValue(property);
        if (property === "font-family") value = value.replace(/["']/g, "").split(",")[0]?.trim() ?? value;
        if (property === "background-color" && (value === "rgba(0, 0, 0, 0)" || value === "transparent")) continue;
        target.style.setProperty(property, value);
      }
      target.removeAttribute("contenteditable");
    });
    return clone.outerHTML;
  }

  function openFullPreview() {
    setPreviewHtml(serializeEditedDocument() ?? "");
    setFullPreview(true);
  }

  if (!resume) return <div className="mx-auto max-w-4xl p-6"><div className="rounded-2xl border border-violet-200 bg-white p-6">{error ? <><h1 className="text-2xl font-bold text-red-700">Resume file error</h1><p className="mt-3 text-red-700">{error}</p><p className="mt-3 text-sm text-stone-600">Fix <code>data/generated-resume.json</code>, save it, then reload.</p><button onClick={() => void loadFile()} className="mt-4 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white">Try again</button></> : "Loading data/generated-resume.json…"}</div></div>;

  return <div className="mx-auto max-w-7xl p-4 sm:p-6">
    {error ? <ActionToast message={error} type="error" onDismiss={() => setError("")} /> : notice ? <ActionToast message={notice} onDismiss={() => setNotice("")} /> : null}
    <header className="rounded-3xl border border-violet-200 bg-[#fffaf0] p-5 shadow-lg"><p className="text-xs font-bold uppercase tracking-[.18em] text-violet-600">File-driven · No AI key</p><h1 className="mt-1 text-3xl font-bold text-violet-950">Resume from generated-resume.json</h1><p className="mt-2 text-stone-600">Replace or edit <code>data/generated-resume.json</code> in VS Code, restart the app, and this page loads it automatically.</p><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => void loadFile()} className="inline-flex items-center gap-2 rounded-xl border border-violet-300 bg-white px-4 py-2 font-semibold text-violet-700"><RefreshCw size={16}/> Reload file</button><select value={font} onChange={(event) => setFont(event.target.value as ResumeFont)} className="rounded-xl border border-violet-300 bg-white px-3 py-2">{RESUME_FONT_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select><button onClick={() => void download("pdf")} disabled={Boolean(downloading)} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white disabled:opacity-50"><Download size={16}/>{downloading === "pdf" ? "Creating…" : "Download PDF"}</button><button onClick={() => void download("docx")} disabled={Boolean(downloading)} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white disabled:opacity-50"><FileText size={16}/>{downloading === "docx" ? "Creating…" : "Download DOCX"}</button></div></header>
    <SectionSelector selectedSections={selectedSections} onChange={setSelectedSections}/>
    <section className="mt-5 grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
      <article className="rounded-2xl border border-violet-200 bg-white p-4 shadow-md"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-xl font-bold">Edit JSON and content</h2><p className="text-sm text-stone-600">All fields can be changed here. Validate before previewing.</p></div><button onClick={() => void copyJson()} className="rounded-lg border border-violet-300 px-3 py-2 text-sm font-semibold text-violet-700">Copy updated JSON</button></div><textarea value={jsonText} onChange={(event) => setJsonText(event.target.value)} spellCheck={false} className="mt-4 h-[540px] w-full rounded-xl bg-stone-950 p-4 font-mono text-xs leading-5 text-emerald-100"/><button onClick={() => void applyJson()} className="mt-3 w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white">Validate edits and update preview</button>
        <div className="mt-5 border-t pt-4"><div className="flex items-center justify-between"><h3 className="font-bold">Quick summary controls</h3><button onClick={() => update({ ...resume, professionalSummary: { bullets: [...resume.professionalSummary.bullets, "Add new summary text here."] } })} className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700"><Plus size={15}/> Add text</button></div><div className="mt-3 space-y-2">{resume.professionalSummary.bullets.map((bullet, index) => <div key={`${bullet}-${index}`} className="flex items-start gap-2 rounded-lg bg-stone-50 p-3"><span className="flex-1 text-xs leading-5">{bullet}</span><button disabled={resume.professionalSummary.bullets.length === 1} onClick={() => update({ ...resume, professionalSummary: { bullets: resume.professionalSummary.bullets.filter((_, itemIndex) => itemIndex !== index) } })} className="text-red-600 disabled:opacity-30" aria-label="Remove summary text"><Trash2 size={16}/></button></div>)}</div></div>
      </article>
      <article className="rounded-2xl border border-violet-200 bg-stone-200 p-3 shadow-md"><div className="mb-3 flex items-center justify-between gap-2"><div><h2 className="font-bold">Edit directly on the resume</h2><p className="text-xs text-stone-600">Click text, select it, type, delete, or use the formatting toolbar. Direct edits are included in both downloads.</p></div><button type="button" onClick={openFullPreview} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white"><Eye size={16}/> Full preview</button></div><RichTextToolbar editorRef={editorRef}/><div className="mt-3 max-h-[900px] overflow-auto rounded-lg bg-stone-400 p-3"><div ref={editorRef} contentEditable suppressContentEditableWarning spellCheck className="mx-auto min-h-[1056px] w-[816px] max-w-full bg-white p-8 shadow-xl outline-none focus:ring-4 focus:ring-violet-300"><FixedResumeTemplate resume={resume} technicalSkills={technicalSkills} selectedSections={selectedSections} fontFamily={font}/></div></div></article>
    </section>
    {fullPreview && <div className="fixed inset-0 z-50 bg-black/75 p-3 sm:p-6"><div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-stone-200"><div className="flex items-center justify-between bg-white p-3"><strong>Resume preview</strong><button onClick={() => setFullPreview(false)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1"><X size={16}/> Close</button></div><div className="flex-1 overflow-auto"><div className="mx-auto w-[816px] max-w-full bg-white p-8 shadow-xl" dangerouslySetInnerHTML={{ __html: previewHtml }}/></div></div></div>}
  </div>;
}
