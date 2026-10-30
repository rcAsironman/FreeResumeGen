"use client";

import { useEffect, useRef, useState } from "react";
import type { Resume, ProfileSettings } from "@/types/resume";
import { PreviewCertificationBadges } from "./preview-certification-badges";
import { RichTextToolbar } from "./rich-text-toolbar";
const styles = {"bulletList": "old-bulletList", "clientRow": "old-clientRow", "contactLine": "old-contactLine", "dates": "old-dates", "environment": "old-environment", "experience": "old-experience", "experienceList": "old-experienceList", "header": "old-header", "linkedIn": "old-linkedIn", "name": "old-name", "officialTitle": "old-officialTitle", "resume": "old-resume", "role": "old-role", "section": "old-section", "sectionHeading": "old-sectionHeading", "separator": "old-separator", "skillRow": "old-skillRow", "skills": "old-skills", "title": "old-title"};

const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

/** Uses the original project's exact fixed-template CSS and section order. */
export function originalResumeHTML(resume: Resume) {
  const field = (path: string, value: string, array = false) => `<span contenteditable="false" data-edit-path="${path}"${array ? ' data-array="true"' : ""}>${escape(value)}</span>`;
  const heading = (text: string) => `<h2 class="${styles.sectionHeading}">${text}</h2>`;
  const bullets = (values: string[], prefix: string) => `<ul class="${styles.bulletList}">${values.map((value, i) => `<li>${field(`${prefix}.${i}`, value)}</li>`).join("")}</ul>`;
  return `<header class="${styles.header}"><h1 class="${styles.name}">${field("personalInfo.fullName", resume.personalInfo.fullName)}</h1><div class="${styles.title}">${field("personalInfo.professionalTitle", resume.personalInfo.professionalTitle)}</div><div class="${styles.contactLine}">${["email", "phone", "location"].filter((key) => resume.personalInfo[key as keyof Resume["personalInfo"]]).map((key) => field(`personalInfo.${key}`, resume.personalInfo[key as keyof Resume["personalInfo"]]!)).join(' <span class="' + styles.separator + '"> | </span> ')}</div></header>
  <section class="${styles.section}">${heading("PROFESSIONAL SUMMARY")}${bullets(resume.professionalSummary.bullets, "professionalSummary.bullets")}</section>
  <section class="${styles.section}">${heading("TECHNICAL SKILLS")}<div class="${styles.skills}">${resume.technicalSkills.categories.map((category, i) => `<p class="${styles.skillRow}"><strong>${field(`technicalSkills.categories.${i}.name`, category.name)}:</strong> ${field(`technicalSkills.categories.${i}.skills`, category.skills.join(", "), true)}</p>`).join("")}</div></section>
  <section class="${styles.section}">${heading("PROFESSIONAL EXPERIENCE")}<div class="${styles.experienceList}">${resume.experience.map((job, i) => `<section class="${styles.experience}"><div class="${styles.clientRow}" data-docx-job="true"><div><strong>${field(`experience.${i}.company`, job.company)}</strong>${job.location ? `, ${field(`experience.${i}.location`, job.location)}` : ""}</div><div class="${styles.dates}">${field(`experience.${i}.startDate`, job.startDate)} – ${field(`experience.${i}.endDate`, job.endDate)}</div></div><div class="${styles.role}" data-docx-role="true">${field(`experience.${i}.role`, job.role)}</div>${bullets(job.responsibilities, `experience.${i}.responsibilities`)}${job.environment.length ? `<p class="${styles.environment}"><strong>Environment:</strong> ${field(`experience.${i}.environment`, job.environment.join(", "), true)}.</p>` : ""}</section>`).join("")}</div></section>
  ${resume.education.length ? `<section class="${styles.section}">${heading("EDUCATION")}<ul class="${styles.bulletList}">${resume.education.map((education, i) => `<li>${field(`education.${i}.degree`, education.degree)} from ${field(`education.${i}.institution`, education.institution)}${education.location ? `, ${field(`education.${i}.location`, education.location)}` : ""}${education.graduationDate ? ` in ${field(`education.${i}.graduationDate`, education.graduationDate)}` : ""}.</li>`).join("")}</ul></section>` : ""}`;
}

export function OriginalResumeEditor({ resume, profile, onChange, onPositionChange }: {
  resume: Resume; profile: ProfileSettings; onChange: (resume: Resume) => void;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastJSON = useRef("");
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    const json = JSON.stringify(resume);
    if (editorRef.current && lastJSON.current !== json) {
      editorRef.current.innerHTML = originalResumeHTML(resume);
      lastJSON.current = json;
    }
  }, [resume]);

  useEffect(() => {
    editorRef.current?.querySelectorAll<HTMLElement>("[data-edit-path]").forEach((element) => { element.contentEditable = String(editing); });
  }, [editing, resume]);

  useEffect(() => {
    const header = editorRef.current?.querySelector<HTMLElement>("header");
    if (!header) return;
    const bottom = Math.max(0, ...profile.certifications.filter((badge) => badge.visible && badge.logo).map((badge) => 50 + (badge.logoPosition?.y ?? 0) + (badge.logoSize ?? 72)));
    header.style.minHeight = bottom ? `${bottom}px` : "";
  }, [profile.certifications, resume]);

  function sync() {
    const next = structuredClone(resume);
    editorRef.current?.querySelectorAll<HTMLElement>("[data-edit-path]").forEach((element) => {
      const parts = element.dataset.editPath!.split(".");
      let owner: unknown = next;
      for (const part of parts.slice(0, -1)) owner = (owner as Record<string, unknown>)[part];
      const text = element.innerText.trim();
      (owner as Record<string, unknown>)[parts.at(-1)!] = element.dataset.array ? text.split(",").map((part) => part.trim()).filter(Boolean) : text;
    });
    lastJSON.current = JSON.stringify(next);
    if (lastJSON.current !== JSON.stringify(resume)) onChange(next);
  }

  return <div className="original-editor">
    <div className="editor-actions"><button type="button" className="button secondary" onClick={() => { sync(); setEditing(!editing); }}>{editing ? "Done editing · Preview" : "Edit resume"}</button><span>{editing ? "Click text to edit. Select text to format it with the toolbar." : "Original resume format · US Letter · Times New Roman"}</span></div>
    {editing && <RichTextToolbar editorRef={editorRef}/>}
    <div className="original-paper-scroll"><article className={`original-paper ${styles.resume}`} data-resume-paper>
      <div ref={editorRef} tabIndex={-1} suppressContentEditableWarning onInput={sync} onBlur={sync} className="original-editable" aria-label="Resume document editor"/>
      <PreviewCertificationBadges badges={profile.certifications.filter((badge) => badge.visible && badge.logo)} onPositionChange={onPositionChange}/>
    </article></div>
  </div>;
}
