"use client";
import { reviewResumeContent, type ResumeIssue } from "@/engine/resume-review/content-review";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Eye, FileText, Home, Plus, RefreshCw, Trash2 } from "lucide-react";

import { ResumeTemplate } from "@/templates/ResumeTemplate";
import { DEFAULT_RESUME_LAYOUT, RESUME_LAYOUT_OPTIONS, type ResumeLayout } from "@/types/resume-layout";
import { SectionSelector, type HighlightSection } from "@/components/builder/SectionSelector";
import { RichTextToolbar } from "@/components/builder/RichTextToolbar";
import { ActionToast } from "@/components/shared/ActionToast";
import type { MasterResume } from "@/types/resume";
import { parsePastedJson } from "@/utils/parse-pasted-json";
import { DEFAULT_RESUME_FONT, RESUME_FONT_OPTIONS, type ResumeFont } from "@/types/resume-font";

const DEFAULT_SECTIONS: HighlightSection[] = ["professionalSummary", "experience"];


export function FileResumeEditor() {
  const [resume, setResume] = useState<MasterResume | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [templateId, setTemplateId] = useState<ResumeLayout>(DEFAULT_RESUME_LAYOUT);
  const [font, setFont] = useState<ResumeFont>(DEFAULT_RESUME_FONT);
  const [fullPreview, setFullPreview] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [downloading, setDownloading] = useState("");
  const [lastSavedPath, setLastSavedPath] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedSections, setSelectedSections] = useState<HighlightSection[]>(DEFAULT_SECTIONS);
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);

  const loadFile = useCallback(async () => {
    setError(""); setNotice("");
    try {
      const guided = sessionStorage.getItem("guidedResumeData");
      if (guided) {
        const data = JSON.parse(guided) as { resume: MasterResume; technicalSkills: string[]; selectedSections: HighlightSection[]; targetRole?: string; jobDescription?: string; sourceResume?: MasterResume; profile?: string };
        setResume(data.resume); setJsonText(JSON.stringify(data.resume, null, 2)); setTechnicalSkills(data.technicalSkills); setSelectedSections(data.selectedSections);
        return;
      }
      const response = await fetch("/api/current-resume", { cache: "no-store" });
      const result = await response.json() as { success: boolean; resume?: MasterResume; error?: string; issues?: ResumeIssue[] };
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
      const parsed = parsePastedJson(jsonText);
      const response = await fetch("/api/current-resume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed) });
      const result = await response.json() as { success: boolean; resume?: MasterResume; error?: string; issues?: ResumeIssue[] };
      if (!response.ok || !result.resume) throw new Error(result.error ?? "Invalid resume JSON.");
      update(result.resume);
      if (result.issues?.length) setNotice(`Preview updated. Review: ${result.issues.slice(0, 3).map(issue => issue.message).join(" ")}`);
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
      const contentErrors = reviewResumeContent(editedResume).filter(issue => issue.severity === "error");
      if (contentErrors.length) throw new Error(contentErrors.map(issue => issue.message).join(" "));
      const response = await fetch(`/api/export/${format}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resume: editedResume, saveToFolder: true, templateId, technicalSkills, selectedSections, fontFamily: font, documentHtml: format === "pdf" ? documentHtml : undefined }) });
      const result = await response.json() as { success?: boolean; filePath?: string; error?: string };
      if (!response.ok || !result.success || !result.filePath) throw new Error(result.error ?? `Unable to save ${format.toUpperCase()}.`);
      setLastSavedPath(result.filePath);
      setNotice(`Saved ${format.toUpperCase()} to ${result.filePath}`);
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
      return { ...original, company: text(element.querySelector('[data-experience-field="company"]')), location: text(element.querySelector('[data-experience-field="location"]')), startDate: text(element.querySelector('[data-experience-field="startDate"]')), endDate: text(element.querySelector('[data-experience-field="endDate"]')), role: text(element.querySelector('[data-experience-field="role"]')), responsibilities: Array.from(element.querySelectorAll("[data-responsibility-index]")).map((item) => text(item)).filter(Boolean), description: element.querySelector('[data-experience-field="description"]') ? text(element.querySelector('[data-experience-field="description"]')) : original.description, environment: element.querySelector("[data-environment-index]") ? Array.from(element.querySelectorAll("[data-environment-index]")).map((item) => text(item).replace(/^,\s*/, "")).filter(Boolean) : original.environment };
    }).filter((item) => item?.company && item?.role);

    return next;
  }

  function serializeEditedDocument() {
    const source = editorRef.current?.firstElementChild as HTMLElement | null;
    if (!source) return undefined;
    const clone = source.cloneNode(true) as HTMLElement;
    const sourceNodes = [source, ...Array.from(source.querySelectorAll<HTMLElement>("*"))];
    const cloneNodes = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>("*"))];
    const properties = ["font-family", "font-size", "font-weight", "font-style", "text-decoration", "color", "background-color", "text-align", "line-height", "margin-top", "margin-right", "margin-bottom", "margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-top", "border-right", "border-bottom", "border-left", "display", "list-style-type", "white-space", "justify-content", "align-items", "gap", "width", "max-width", "min-width", "letter-spacing", "text-transform", "break-inside", "break-after", "box-sizing"];
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

  if (!resume) return <div className="mx-auto max-w-4xl p-6"><div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">{error ? <><h1 className="text-2xl font-bold text-[var(--app-error)]">Resume file error</h1><p className="mt-3 text-[var(--app-error)]">{error}</p><p className="mt-3 text-sm text-[var(--app-muted)]">Fix <code>data/generated-resume.json</code>, save it, then reload.</p><button onClick={() => void loadFile()} className="mt-4 rounded-xl bg-[var(--app-primary)] px-4 py-2 font-semibold text-white">Try again</button></> : "Loading data/generated-resume.json…"}</div></div>;

  return <div className="mx-auto max-w-7xl p-4 sm:p-6">
    {error ? <ActionToast message={error} type="error" onDismiss={() => setError("")} /> : notice ? <ActionToast message={notice} onDismiss={() => setNotice("")} /> : null}
    <header className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-lg"><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--app-accent)]">File-driven · No AI key</p><h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">Resume from generated-resume.json</h1><p className="mt-2 text-[var(--app-muted)]">Replace or edit <code>data/generated-resume.json</code> in VS Code, restart the app, and this page loads it automatically.</p><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => void loadFile()} className="inline-flex items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 font-semibold text-[var(--app-accent)]"><RefreshCw size={16}/> Reload file</button><label className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">Resume format<select aria-label="Resume format" value={templateId} onChange={(event) => { const next = readDirectTextEdits(); setResume(next); setJsonText(JSON.stringify(next, null, 2)); setTemplateId(event.target.value as ResumeLayout); }} className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2">{RESUME_LAYOUT_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label><select value={font} onChange={(event) => setFont(event.target.value as ResumeFont)} className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2">{RESUME_FONT_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select><button onClick={() => void download("pdf")} disabled={Boolean(downloading)} className="inline-flex items-center gap-2 rounded-xl bg-[var(--app-primary)] px-4 py-2 font-semibold text-white disabled:opacity-50"><Download size={16}/>{downloading === "pdf" ? "Creating…" : "Download PDF"}</button><button onClick={() => void download("docx")} disabled={Boolean(downloading)} className="inline-flex items-center gap-2 rounded-xl bg-[var(--app-primary)] px-4 py-2 font-semibold text-white disabled:opacity-50"><FileText size={16}/>{downloading === "docx" ? "Creating…" : "Download DOCX"}</button></div></header>
    <p className="mt-3 break-all rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm text-[var(--app-muted)]" role="status">{lastSavedPath ? `Last saved: ${lastSavedPath}` : "Downloads are saved in Downloads/YYYY-MM-DD_resumes (Chicago date), with a different filename for each resume."}</p>
    <SectionSelector selectedSections={selectedSections} onChange={setSelectedSections}/>
    <section className="mt-5 grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
      <article className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-md"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-xl font-bold">Edit JSON and content</h2><p className="text-sm text-[var(--app-muted)]">All fields can be changed here. Validate before previewing.</p></div><button onClick={() => void copyJson()} className="rounded-lg border border-[var(--app-border)] px-3 py-2 text-sm font-semibold text-[var(--app-accent)]">Copy updated JSON</button></div><textarea value={jsonText} onChange={(event) => setJsonText(event.target.value)} spellCheck={false} className="mt-4 h-[540px] w-full rounded-xl bg-[var(--app-input)] p-4 font-mono text-xs leading-5 text-[var(--app-code)]"/><button onClick={() => void applyJson()} className="mt-3 w-full rounded-xl bg-[var(--app-primary)] px-4 py-3 font-semibold text-white">Validate edits and update preview</button>
        <div className="mt-5 border-t pt-4"><div className="flex items-center justify-between"><h3 className="font-bold">Quick summary controls</h3><button onClick={() => update({ ...resume, professionalSummary: { bullets: [...resume.professionalSummary.bullets, "Add new summary text here."] } })} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--app-accent)]"><Plus size={15}/> Add text</button></div><div className="mt-3 space-y-2">{resume.professionalSummary.bullets.map((bullet, index) => <div key={`${bullet}-${index}`} className="flex items-start gap-2 rounded-lg bg-[var(--app-surface-raised)] p-3"><span className="flex-1 text-xs leading-5">{bullet}</span><button disabled={resume.professionalSummary.bullets.length === 1} onClick={() => update({ ...resume, professionalSummary: { bullets: resume.professionalSummary.bullets.filter((_, itemIndex) => itemIndex !== index) } })} className="text-[var(--app-error)] disabled:opacity-30" aria-label="Remove summary text"><Trash2 size={16}/></button></div>)}</div></div>
      </article>
      <article className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-raised)] p-3 shadow-md"><div className="mb-3 flex items-center justify-between gap-2"><div><h2 className="font-bold">Edit directly on the resume</h2><p className="text-xs text-[var(--app-muted)]">Click text, select it, type, delete, or use the formatting toolbar. Direct edits are included in both downloads.</p></div><button type="button" onClick={openFullPreview} className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-primary)] px-3 py-2 text-sm font-semibold text-white"><Eye size={16}/> Full preview</button></div><RichTextToolbar editorRef={editorRef}/><div className="mt-3 max-h-[900px] overflow-auto rounded-lg bg-[var(--app-preview)] p-3"><div ref={editorRef} contentEditable suppressContentEditableWarning spellCheck className="mx-auto min-h-[1056px] w-[816px] max-w-full bg-white text-black shadow-xl outline-none focus:ring-4 focus:ring-[var(--app-accent)]" data-resume-paper style={{ colorScheme: "light", filter: "brightness(0.9)", padding: templateId === "architect-resume" ? "0 12.733px 0 18.933px" : "32px", minWidth: templateId === "architect-resume" ? "816px" : undefined }}><ResumeTemplate templateId={templateId} resume={resume} technicalSkills={technicalSkills} selectedSections={selectedSections} fontFamily={font}/></div></div></article>
    </section>
    {fullPreview && <div className="fixed inset-0 z-50 bg-black/75 p-3 sm:p-6"><div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[var(--app-surface-raised)]"><div className="flex items-center justify-between bg-[var(--app-surface)] p-3"><strong>Resume preview</strong><div className="flex flex-wrap gap-2"><Link href="/" className="inline-flex items-center gap-1 rounded-lg border px-3 py-1"><Home size={16}/> Home</Link><button type="button" onClick={() => setFullPreview(false)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1"><ArrowLeft size={16}/> Back to editor</button></div></div><div className="flex-1 overflow-auto"><div className="mx-auto w-[816px] max-w-full bg-white text-black shadow-xl" data-resume-paper style={{ colorScheme: "light", filter: "brightness(0.9)", padding: templateId === "architect-resume" ? "0 12.733px 0 18.933px" : "32px", minWidth: templateId === "architect-resume" ? "816px" : undefined }} dangerouslySetInnerHTML={{ __html: previewHtml }}/></div></div></div>}
  </div>;
}
