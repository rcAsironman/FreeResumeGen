"use client";
import { metricRecords, verifiedMetricSchema, type VerifiedMetric } from "@/engine/resume-review/metric-review";
import { parseResumeFileStem, RESUME_FILENAME_LIMIT, resumeFileStem } from "@/utils/resume-download-name";
import { chooseBrowserDownloadFolder, saveBrowserResume } from "@/utils/browser-resume-download";
import { cleanRoleTitle } from "@/engine/resume-review/role-title";
import { refreshDraftMetrics, METRIC_DRAFT_VERSION, type DraftMetricEdit } from "@/engine/resume-review/achievement-draft";
import { generalGenerationPrompt } from "@/prompts/general-resume";
import { analyzeLocally, reviewDraft } from "@/engine/resume-review/jd-workflow";
import { reviewResumeContent, type ResumeIssue } from "@/engine/resume-review/content-review";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CertificationBadgePicker } from "@/components/builder/CertificationBadgePicker";
import { ArrowLeft, Download, Eye, FileText, Home, Plus, RefreshCw, Trash2 } from "lucide-react";

import { ResumeTemplate } from "@/templates/ResumeTemplate";
import { DEFAULT_RESUME_LAYOUT, RESUME_LAYOUT_OPTIONS, type ResumeLayout } from "@/types/resume-layout";
import { SectionSelector, type HighlightSection } from "@/components/builder/SectionSelector";
import { RichTextToolbar } from "@/components/builder/RichTextToolbar";
import { ActionToast } from "@/components/shared/ActionToast";
import type { MasterResume } from "@/types/resume";
import type { ProposedTimeline } from "@/engine/resume-review/experience-target";
import { parsePastedJson } from "@/utils/parse-pasted-json";
import { DEFAULT_RESUME_FONT, RESUME_FONT_OPTIONS, type ResumeFont } from "@/types/resume-font";
import { CERTIFICATION_BADGES, type CertificationBadgeId } from "@/engine/certification-badges";

const DEFAULT_SECTIONS: HighlightSection[] = ["professionalSummary", "experience"];
const CERTIFICATION_LOGOS_STORAGE_KEY = "resume-certification-logos-v1";
const SELECTED_CERTIFICATION_BADGES_STORAGE_KEY = "resume-selected-certification-badges-v3";
const CERTIFICATION_BADGE_POSITION_STORAGE_KEY = "resume-certification-badge-position-v2";
const CERTIFICATION_BADGE_SIZE_STORAGE_KEY = "resume-certification-badge-size-v1";
const RESUME_LAYOUT_STORAGE_KEY = "resume-layout-v1";
const RESUME_FONT_STORAGE_KEY = "resume-font-v1";


export function FileResumeEditor() {
  const exportMode = "draft" as const;
  const [verifiedMetrics,setVerifiedMetrics]=useState<VerifiedMetric[]>([]);
  const [sourceContext, setSourceContext] = useState<MasterResume | null>(null);
  const [targetYears, setTargetYears] = useState<number | null>(null);
  const [currentJd, setCurrentJd] = useState("");
  const [resume, setResume] = useState<MasterResume | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [templateId, setTemplateId] = useState<ResumeLayout>(DEFAULT_RESUME_LAYOUT);
  const [font, setFont] = useState<ResumeFont>(DEFAULT_RESUME_FONT);
  const [fullPreview, setFullPreview] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const [downloading, setDownloading] = useState("");
  const [lastSavedPath, setLastSavedPath] = useState("");
  const [timelineProposal, setTimelineProposal] = useState<Pick<ProposedTimeline, "targetYears" | "targetMonths" | "referenceDate" | "reference" | "changes"> | null>(null);
  const [timelineReviewConfirmed, setTimelineReviewConfirmed] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedSections, setSelectedSections] = useState<HighlightSection[]>(DEFAULT_SECTIONS);
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [showCertificationLogos, setShowCertificationLogos] = useState(false);
  const [selectedCertificationBadges, setSelectedCertificationBadges] = useState<CertificationBadgeId[]>([]);
  const [certificationBadgePosition, setCertificationBadgePosition] = useState({ x: 0, y: 0 });
  const [certificationBadgeSize, setCertificationBadgeSize] = useState(72);
  const [logoPreferenceReady, setLogoPreferenceReady] = useState(false);

  useEffect(() => {
    try {
      const storedLayout = localStorage.getItem(RESUME_LAYOUT_STORAGE_KEY);
      if (RESUME_LAYOUT_OPTIONS.some((option) => option.id === storedLayout)) setTemplateId(storedLayout as ResumeLayout);
      const storedFont = localStorage.getItem(RESUME_FONT_STORAGE_KEY);
      if (RESUME_FONT_OPTIONS.includes(storedFont as ResumeFont)) setFont(storedFont as ResumeFont);
      setShowCertificationLogos(localStorage.getItem(CERTIFICATION_LOGOS_STORAGE_KEY) === "true");
      const storedBadges = localStorage.getItem(SELECTED_CERTIFICATION_BADGES_STORAGE_KEY);
      if (storedBadges) {
        const parsedBadges = JSON.parse(storedBadges) as string[];
        setSelectedCertificationBadges(parsedBadges.filter((badge): badge is CertificationBadgeId => CERTIFICATION_BADGES.some((item) => item.id === badge)));
      }
      const storedPosition = localStorage.getItem(CERTIFICATION_BADGE_POSITION_STORAGE_KEY);
      if (storedPosition) {
        const parsedPosition = JSON.parse(storedPosition) as { x?: number; y?: number };
        if (Number.isFinite(parsedPosition.x) && Number.isFinite(parsedPosition.y)) {
          setCertificationBadgePosition({ x: Math.max(-1200, Math.min(1200, parsedPosition.x!)), y: Math.max(-2400, Math.min(2400, parsedPosition.y!)) });
        }
      }
      const storedSize = Number(localStorage.getItem(CERTIFICATION_BADGE_SIZE_STORAGE_KEY));
      if (Number.isFinite(storedSize) && storedSize >= 36 && storedSize <= 110) setCertificationBadgeSize(storedSize);
    }
    catch { /* The switch remains available if browser storage is blocked. */ }
    setLogoPreferenceReady(true);
  }, []);

  useEffect(() => {
    if (!logoPreferenceReady) return;
    try {
      localStorage.setItem(RESUME_LAYOUT_STORAGE_KEY, templateId);
      localStorage.setItem(RESUME_FONT_STORAGE_KEY, font);
    } catch { /* Layout and font choices remain available for the current page session. */ }
  }, [templateId, font, logoPreferenceReady]);

  useEffect(() => {
    if (!logoPreferenceReady) return;
    try { localStorage.setItem(CERTIFICATION_LOGOS_STORAGE_KEY, String(showCertificationLogos)); }
    catch { /* The switch still works for the current page session. */ }
  }, [showCertificationLogos, logoPreferenceReady]);

  useEffect(() => {
    if (!logoPreferenceReady) return;
    try { localStorage.setItem(SELECTED_CERTIFICATION_BADGES_STORAGE_KEY, JSON.stringify(selectedCertificationBadges)); }
    catch { /* Logo choices remain available for the current page session. */ }
  }, [selectedCertificationBadges, logoPreferenceReady]);

  useEffect(() => {
    if (!logoPreferenceReady) return;
    try { localStorage.setItem(CERTIFICATION_BADGE_POSITION_STORAGE_KEY, JSON.stringify(certificationBadgePosition)); }
    catch { /* Badge placement remains available for the current page session. */ }
  }, [certificationBadgePosition, logoPreferenceReady]);

  useEffect(() => {
    if (!logoPreferenceReady) return;
    try { localStorage.setItem(CERTIFICATION_BADGE_SIZE_STORAGE_KEY, String(certificationBadgeSize)); }
    catch { /* Badge size remains available for the current page session. */ }
  }, [certificationBadgeSize, logoPreferenceReady]);

  const loadFile = useCallback(async () => {
    setError(""); setNotice("");
    try {
      const guided = sessionStorage.getItem("guidedResumeData") || localStorage.getItem("resume-clone-editor-v2");
      if (guided) {
        const data = JSON.parse(guided) as { verifiedMetrics?: VerifiedMetric[]; employmentType?: string; templateId?: ResumeLayout; titleFormatVersion?: number; metricDraftVersion?: number; draftMetricEdits?: DraftMetricEdit[]; targetYears?: number | null; resume: MasterResume; technicalSkills: string[]; selectedSections: HighlightSection[]; targetRole?: string; jobDescription?: string; sourceResume?: MasterResume; profile?: string; validationRepairs?: string[]; timelineProposal?: Pick<ProposedTimeline, "targetYears" | "targetMonths" | "referenceDate" | "reference" | "changes"> | null };
        if(data.titleFormatVersion!==1) {
          const headline=cleanRoleTitle(data.resume.personalInfo.professionalTitle || "");
          if(headline && headline!==data.resume.personalInfo.professionalTitle) {
            data.resume.personalInfo.professionalTitle=headline;
            data.validationRepairs=[...(data.validationRepairs??[]),"Cleaned posting qualifiers from the headline; employer titles were preserved."];
          }
          data.titleFormatVersion=1;
          const saved=JSON.stringify(data); sessionStorage.setItem("guidedResumeData",saved); localStorage.setItem("resume-clone-editor-v2",saved);
        }
        if (data.draftMetricEdits?.length && data.metricDraftVersion !== METRIC_DRAFT_VERSION) {
          const refreshed = refreshDraftMetrics(data.resume, data.draftMetricEdits.filter(edit=>!data.verifiedMetrics?.some(v=>v.text===edit.replacement&&verifiedMetricSchema.safeParse(v).success)));
          data.resume = refreshed.resume; data.draftMetricEdits = refreshed.edits; data.metricDraftVersion = METRIC_DRAFT_VERSION;
          data.validationRepairs = [...(data.validationRepairs ?? []), "Refreshed untouched app-generated metric examples with more varied outcomes. Existing user edits were preserved."];
          const saved = JSON.stringify(data); sessionStorage.setItem("guidedResumeData", saved); localStorage.setItem("resume-clone-editor-v2", saved);
        }
        if(data.employmentType==='data-center') {setTemplateId('data-center');setFont('Times New Roman');setShowCertificationLogos(false);}
        else if(localStorage.getItem(RESUME_LAYOUT_STORAGE_KEY)==='data-center')setTemplateId(DEFAULT_RESUME_LAYOUT);
        const verified=(data.verifiedMetrics??[]).filter(v=>verifiedMetricSchema.safeParse(v).success);
        setVerifiedMetrics(verified);
        setSourceContext(data.sourceResume ?? null); setCurrentJd(data.jobDescription ?? ""); setTargetYears(data.targetYears ?? null);
        setResume(data.resume); setJsonText(JSON.stringify(data.resume, null, 2)); setTechnicalSkills(data.technicalSkills); setSelectedSections(data.selectedSections);
        if (data.validationRepairs?.length) setNotice(data.validationRepairs.join(" "));
        setTimelineProposal(data.timelineProposal ?? null); setTimelineReviewConfirmed(false);
        return;
      }
      setTimelineProposal(null); setTimelineReviewConfirmed(false);
      const response = await fetch("/api/current-resume", { cache: "no-store" });
      const result = await response.json() as { success: boolean; resume?: MasterResume; error?: string; issues?: ResumeIssue[] };
      if (!response.ok || !result.resume) throw new Error(result.error ?? "Unable to load the resume file.");
      setResume(result.resume);
      setJsonText(JSON.stringify(result.resume, null, 2));
      setTechnicalSkills(result.resume.technicalSkills.categories.flatMap((category) => category.skills));
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to load data/generated-resume.json."); }
  }, []);

  useEffect(() => { void loadFile(); }, [loadFile]);

  function persistDraft(next: MasterResume, verifiedOverride=verifiedMetrics) {
    try {
      const previous = JSON.parse(sessionStorage.getItem("guidedResumeData") || localStorage.getItem("resume-clone-editor-v2") || "{}");
      const review=metricRecords(next,verifiedOverride);
      const saved = JSON.stringify({...previous, resume: next,verifiedMetrics:verifiedOverride,metricReview:review});
      sessionStorage.setItem("guidedResumeData", saved); localStorage.setItem("resume-clone-editor-v2", saved);
    } catch { setError("Unable to save edits in browser storage. Download or copy your JSON before leaving."); }
  }

  function update(next: MasterResume) {
    persistDraft(next);
    setResume(next);
    setJsonText(JSON.stringify(next, null, 2));
    if (timelineProposal) setTimelineReviewConfirmed(false);
    setError(""); setNotice("Preview updated and saved on this browser.");
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

  async function copyCorrection() {
    if (!sourceContext) return;
    try {
      const current = readDirectTextEdits();
      const context = JSON.parse(sessionStorage.getItem("guidedResumeData") || localStorage.getItem("resume-clone-editor-v2") || "{}");
      const mode = context.employmentType === "data-center" ? "data-center" : context.employmentType === "c2c" ? "c2c" : "full-time";
      const base = generalGenerationPrompt(currentJd, analyzeLocally(currentJd), sourceContext, selectedSections, mode, targetYears, context.studyDates, context.preserveSourceTimeline===true);
      const findings = reviewDraft(current, sourceContext, currentJd, targetYears);
      const correction = base + "\n\nCURRENT EDITABLE RESUME:\n" + JSON.stringify(current, null, 2) + "\n\nAPP REVIEW FINDINGS (heuristic feedback, not candidate facts):\n" + JSON.stringify(findings, null, 2) + "\nReturn the complete corrected resume JSON. Address role alignment, supported missing terms and repetitive wording. Retain existing numerical draft outcomes for candidate editing; do not silently remove or convert them into qualitative bullets. Do not treat these numbers as verified evidence or present new JD-driven draft responsibilities as verified work.";
      await navigator.clipboard.writeText(correction);
      setNotice("Correction prompt copied. Paste it into ChatGPT, then import the complete response in Step 2.");
    } catch { setError("Unable to copy the correction prompt. Check clipboard permission."); }
  }

  async function copyJson() {
    if (timelineProposal && !timelineReviewConfirmed) {
      setError("Review the proposed employer dates and confirm them before copying this resume JSON.");
      return;
    }
    try {
      const edited = readDirectTextEdits(); persistDraft(edited);
      await navigator.clipboard.writeText(JSON.stringify(edited, null, 2));
      setNotice("Updated JSON copied and saved in this browser.");
      setError("");
    } catch {
      setError("Unable to copy to the clipboard. Check browser clipboard permission and try again.");
    }
  }

  async function download(format: "pdf" | "docx" | "json") {
    if (!resume || downloading) return;
    if (timelineProposal && !timelineReviewConfirmed) {
      setError("Review the proposed employer dates and confirm them before downloading.");
      return;
    }
    setDownloading(format); setError("");
    try {
      if(templateId==='data-center' && format!=='json') {
        const paper=editorRef.current?.querySelector('[data-data-center-resume]') as HTMLElement|null;
        if(paper && paper.scrollHeight>1057) throw new Error('Data Center content exceeds one page. Shorten the text before downloading; nothing will be clipped.');
      }
      const customStem = parseResumeFileStem(downloadName);
      const local=['localhost','127.0.0.1','[::1]'].includes(window.location.hostname);
      const destination=local?null:await chooseBrowserDownloadFolder();
      const documentHtml = serializeEditedDocument();
      const editedResume = readDirectTextEdits();
      persistDraft(editedResume);
      const contentErrors = reviewResumeContent(editedResume).filter(issue => issue.severity === "error");
      if (contentErrors.length) throw new Error(contentErrors.map(issue => issue.message).join(" "));
      const response = await fetch(`/api/export/${format}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resume: editedResume, exportMode, verifiedMetrics, saveToFolder: local, fileName: customStem, templateId, technicalSkills, selectedSections, fontFamily: font, showCertificationLogos, selectedCertificationBadges, certificationBadgePosition, certificationBadgeSize, documentHtml: format === "pdf" ? documentHtml : undefined }) });
      if(!local) {
        if(!response.ok){const failure=await response.json();throw new Error(failure.error||'Download generation failed.');}
        const message=await saveBrowserResume(await response.blob(),editedResume.personalInfo.fullName,format,destination,customStem);
        setLastSavedPath('');setNotice(message);return;
      }
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

  const { fullName, professionalTitle } = resume.personalInfo;
  const filenamePart = (value: string) => value.replace(/[^\p{L}\p{N}]+/gu, "_").slice(0, 48).replace(/^_+|_+$/g, "");
  const candidateName = filenamePart(fullName) || "Candidate";
  const roleName = filenamePart(professionalTitle);
  const suggestedNames = [
    resumeFileStem(fullName, 0).slice(0, RESUME_FILENAME_LIMIT),
    `${candidateName}_Resume`,
    ...(roleName ? [`${candidateName}_${roleName}`] : []),
  ];

  return <div className="mx-auto max-w-7xl p-4 sm:p-6">
    {error ? <ActionToast message={error} type="error" onDismiss={() => setError("")} /> : notice ? <ActionToast message={notice} onDismiss={() => setNotice("")} /> : null}
    <header className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-lg"><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--app-accent)]">File-driven · No AI key</p><h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">Edit, preview and download</h1><p className="mt-2 text-[var(--app-muted)]">Your imported resume is editable below. Changes are saved in this browser. Use the editor below to refine your resume and download it.</p><div className="mt-4 flex flex-wrap items-center gap-2"><button onClick={() => void loadFile()} className="inline-flex items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 font-semibold text-[var(--app-accent)]"><RefreshCw size={16}/> Reload file</button><label className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">Resume format<select aria-label="Resume format" value={templateId} onChange={(event) => { const next = readDirectTextEdits(); setResume(next); setJsonText(JSON.stringify(next, null, 2)); setTemplateId(event.target.value as ResumeLayout); }} className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2">{RESUME_LAYOUT_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label><select disabled={templateId==='data-center'} value={font} onChange={(event) => setFont(event.target.value as ResumeFont)} className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2">{RESUME_FONT_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm font-semibold text-[var(--foreground)]"><input type="checkbox" role="switch" disabled={templateId==='data-center'} aria-label="Show certification badges" checked={showCertificationLogos} onChange={(event) => { const enabled = event.target.checked; const currentResume = readDirectTextEdits(); setResume(currentResume); setJsonText(JSON.stringify(currentResume, null, 2)); setShowCertificationLogos(enabled);  }} className="h-6 w-11 cursor-pointer appearance-none rounded-full bg-[var(--app-border)] transition-colors checked:bg-[var(--app-primary)] before:relative before:left-1 before:top-1 before:block before:h-4 before:w-4 before:rounded-full before:bg-white before:shadow before:transition-transform checked:before:translate-x-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-accent)]"/><span>Show certification badges</span></label>{showCertificationLogos && <><CertificationBadgePicker selected={selectedCertificationBadges} onChange={setSelectedCertificationBadges}/><label className="flex w-full items-center gap-3 text-sm text-[var(--foreground)]">Badge size: {certificationBadgeSize}px<input aria-label="Certification badge size" type="range" min={36} max={110} step={2} value={certificationBadgeSize} onChange={(event) => setCertificationBadgeSize(Number(event.target.value))} className="w-full max-w-sm accent-[var(--app-primary)]"/></label><p className="w-full text-xs text-[var(--app-muted)]">Drag the selected badge group directly on the resume preview to place it.</p></>}
      <div className="w-full space-y-2">
        <label htmlFor="resume-download-name" className="block text-sm font-semibold text-[var(--foreground)]">Resume filename</label>
        <input id="resume-download-name" value={downloadName} onChange={(event) => setDownloadName(event.target.value)} maxLength={RESUME_FILENAME_LIMIT + 5} placeholder="Use automatic name" aria-describedby="resume-download-name-help" className="w-full max-w-md rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm" />
        <p id="resume-download-name-help" className="text-xs text-[var(--app-muted)]">Leave blank for automatic naming. The selected format adds the file extension.</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--app-muted)]">
          <span>Suggested names</span>
          {[...new Set(suggestedNames)].map((name) => (
            <button key={name} type="button" onClick={() => setDownloadName(name)} className="break-all rounded-lg border border-[var(--app-border)] px-2 py-1 text-[var(--app-accent)]">{name}</button>
          ))}
        </div>
      </div>
      <button onClick={() => void download("pdf")} disabled={Boolean(downloading) || Boolean(timelineProposal && !timelineReviewConfirmed)} className="inline-flex items-center gap-2 rounded-xl bg-[var(--app-primary)] px-4 py-2 font-semibold text-white disabled:opacity-50"><Download size={16}/>{downloading === "pdf" ? "Creating…" : "Download PDF"}</button><button onClick={() => void download("docx")} disabled={Boolean(downloading) || Boolean(timelineProposal && !timelineReviewConfirmed)} className="inline-flex items-center gap-2 rounded-xl bg-[var(--app-primary)] px-4 py-2 font-semibold text-white disabled:opacity-50"><FileText size={16}/>{downloading === "docx" ? "Creating…" : "Download DOCX"}</button><button onClick={() => void download("json")} disabled={Boolean(downloading) || Boolean(timelineProposal && !timelineReviewConfirmed)} className="rounded-xl bg-[var(--app-primary)] px-4 py-2 font-semibold text-white disabled:opacity-50">Download JSON</button></div></header>
    <p className="mt-2 text-xs text-[var(--app-muted)]">Certification logos appear only for matching credentials listed in the resume; skills alone never add a certification mark.</p>
    <p className="mt-3 break-all rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm text-[var(--app-muted)]" role="status">{lastSavedPath ? `Last saved: ${lastSavedPath}` : "Downloads are saved in Downloads/YYYY-MM-DD_resumes (Chicago date), with a different filename for each resume."}</p>
    {timelineProposal && <aside aria-label="Proposed employment dates" className="mt-4 rounded-2xl border border-amber-400 bg-amber-50 p-4 text-amber-950">
      <h2 className="font-bold">Review proposed employment dates</h2>
      <p className="mt-1 text-sm">These dates were calculated at your direction for a {timelineProposal.targetMonths / 12}-year timeline ending {timelineProposal.referenceDate}. They are proposed edits, not independently verified records.</p>
      <div className="mt-3 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-amber-300"><th className="py-2 pr-3">Company</th><th className="py-2 pr-3">Original</th><th className="py-2">Proposed</th></tr></thead><tbody>{timelineProposal.changes.map((change) => <tr key={change.id} className="border-b border-amber-200 last:border-0"><td className="py-2 pr-3 font-semibold">{change.company}</td><td className="py-2 pr-3">{change.originalStartDate} – {change.originalEndDate}</td><td className="py-2">{change.proposedStartDate} – {change.proposedEndDate}</td></tr>)}</tbody></table></div>
      <label className="mt-3 flex cursor-pointer items-start gap-2 text-sm font-semibold"><input type="checkbox" checked={timelineReviewConfirmed} onChange={(event) => setTimelineReviewConfirmed(event.target.checked)} className="mt-0.5"/> I reviewed the proposed dates and confirm them before exporting this resume.</label>
    </aside>}
    <p className="mt-3 text-sm text-[var(--app-muted)]">Using a shared link? Choose your Downloads folder when prompted. The app creates today’s resume folder there. If folder access is unavailable, a ZIP containing the dated folder downloads instead.</p><aside className="my-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4"><h2 className="font-bold">Editable resume draft</h2><p className="mt-2 text-sm">This draft may include generated responsibilities, proposed experience and invented numerical examples. Review and edit them before professional use. Draft status is shown here, not inside your resume bullets.</p>{sourceContext && <button type="button" onClick={() => void copyCorrection()} className="mt-3 rounded-lg bg-[var(--app-primary)] px-3 py-2 font-semibold text-white">Copy correction prompt</button>}</aside>
    <SectionSelector selectedSections={selectedSections} onChange={setSelectedSections}/>
    <section className="mt-5 grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
      <article className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-md"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-xl font-bold">Edit JSON and content</h2><p className="text-sm text-[var(--app-muted)]">All fields can be changed here. Validate before previewing.</p></div><button onClick={() => void copyJson()} className="rounded-lg border border-[var(--app-border)] px-3 py-2 text-sm font-semibold text-[var(--app-accent)]">Copy updated JSON</button></div><textarea value={jsonText} onChange={(event) => { setJsonText(event.target.value); if (timelineProposal) setTimelineReviewConfirmed(false); }} spellCheck={false} className="mt-4 h-[540px] w-full rounded-xl bg-[var(--app-input)] p-4 font-mono text-xs leading-5 text-[var(--app-code)]"/><button onClick={() => void applyJson()} className="mt-3 w-full rounded-xl bg-[var(--app-primary)] px-4 py-3 font-semibold text-white">Validate edits and update preview</button>
        <div className="mt-5 border-t pt-4"><div className="flex items-center justify-between"><h3 className="font-bold">Quick summary controls</h3><button onClick={() => update({ ...resume, professionalSummary: { bullets: [...resume.professionalSummary.bullets, "Add new summary text here."] } })} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--app-accent)]"><Plus size={15}/> Add text</button></div><div className="mt-3 max-h-96 overflow-auto space-y-2">{resume.professionalSummary.bullets.map((bullet, index) => <div key={`${bullet}-${index}`} className="flex items-start gap-2 rounded-lg bg-[var(--app-surface-raised)] p-3"><span className="flex-1 text-xs leading-5">{bullet}</span><button disabled={resume.professionalSummary.bullets.length === 1} onClick={() => update({ ...resume, professionalSummary: { bullets: resume.professionalSummary.bullets.filter((_, itemIndex) => itemIndex !== index) } })} className="text-[var(--app-error)] disabled:opacity-30" aria-label="Remove summary text"><Trash2 size={16}/></button></div>)}</div></div>
      </article>
      <article className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-raised)] p-3 shadow-md"><div className="mb-3 flex items-center justify-between gap-2"><div><h2 className="font-bold">Edit directly on the resume</h2><p className="text-xs text-[var(--app-muted)]">Click text, select it, type, delete, or use the formatting toolbar. Direct edits are included in both downloads.</p></div><button type="button" onClick={openFullPreview} className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-primary)] px-3 py-2 text-sm font-semibold text-white"><Eye size={16}/> Full preview</button></div><RichTextToolbar editorRef={editorRef}/><div className="mt-3 max-h-[900px] overflow-auto rounded-lg bg-[var(--app-preview)] p-3"><div ref={editorRef} contentEditable suppressContentEditableWarning spellCheck onInput={() => { persistDraft(readDirectTextEdits()); if (timelineProposal) setTimelineReviewConfirmed(false); }} className="mx-auto min-h-[1056px] w-[816px] max-w-full bg-white text-black shadow-xl outline-none focus:ring-4 focus:ring-[var(--app-accent)]" data-resume-paper style={{ colorScheme: "light", filter: "brightness(0.9)", padding: templateId === "data-center" ? "0" : templateId === "architect-resume" ? "0 12.733px 0 18.933px" : "32px", minWidth: templateId === "data-center" ? "816px" : templateId === "architect-resume" ? "816px" : undefined }}><ResumeTemplate templateId={templateId} resume={resume} technicalSkills={technicalSkills} selectedSections={selectedSections} fontFamily={font} showCertificationLogos={showCertificationLogos} selectedCertificationBadges={selectedCertificationBadges} certificationBadgePosition={certificationBadgePosition} certificationBadgeSize={certificationBadgeSize} onCertificationBadgePositionChange={setCertificationBadgePosition}/></div></div></article>
    </section>
    {fullPreview && <div className="fixed inset-0 z-50 bg-black/75 p-3 sm:p-6"><div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[var(--app-surface-raised)]"><div className="flex items-center justify-between bg-[var(--app-surface)] p-3"><strong>Resume preview</strong><div className="flex flex-wrap gap-2"><Link href="/" className="inline-flex items-center gap-1 rounded-lg border px-3 py-1"><Home size={16}/> Home</Link><button type="button" onClick={() => setFullPreview(false)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1"><ArrowLeft size={16}/> Back to editor</button></div></div><div className="flex-1 overflow-auto"><div className="mx-auto w-[816px] max-w-full bg-white text-black shadow-xl" data-resume-paper style={{ colorScheme: "light", filter: "brightness(0.9)", padding: templateId === "data-center" ? "0" : templateId === "architect-resume" ? "0 12.733px 0 18.933px" : "32px", minWidth: templateId === "data-center" ? "816px" : templateId === "architect-resume" ? "816px" : undefined }} dangerouslySetInnerHTML={{ __html: previewHtml }}/></div></div></div>}
  </div>;
}
