import { readFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import slots from "./slots.json";
import type { MasterResume } from "@/types/resume";
import { plainEmailValue } from "@/utils/resume-text";
import { DEFAULT_RESUME_FONT, type ResumeFont } from "@/types/resume-font";

interface Input { resume: MasterResume; technicalSkills: string[]; selectedSections: string[]; fontFamily?: ResumeFont }
const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export async function createArchitectResumeDocx({ resume, technicalSkills, selectedSections, fontFamily = DEFAULT_RESUME_FONT }: Input) {
  const zip = await JSZip.loadAsync(await readFile(path.join(process.cwd(), "templates/architect-resume/reference.docx")));
  const original = await zip.file("word/document.xml")!.async("string");
  let paragraphId = 0;
  function paragraph(slot: keyof typeof slots, pieces: { text: string; bold?: boolean; tab?: boolean }[], section = "") {
    const pattern = slots[slot];
    const open = pattern.match(/^<w:p(?:\s[^>]*)?>/)![0].replace(/ w14:(?:paraId|textId)="[^"]*"/g, "").replace(/>$/, ` w14:paraId="${(++paragraphId).toString(16).padStart(8, "0")}">`);
    let ppr = pattern.match(/<w:pPr>[\s\S]*?<\/w:pPr>/)?.[0] ?? "";
    if (slot === "education") ppr = ppr.replace(/<w:tabs>[\s\S]*?<\/w:tabs>/g, "").replace("</w:pPr>", '<w:tabs><w:tab w:val="right" w:pos="9680"/></w:tabs></w:pPr>');
    let rpr = pattern.match(/<w:r(?:\s[^>]*)?>\s*(<w:rPr>[\s\S]*?<\/w:rPr>)/)?.[1] ?? "<w:rPr/>";
    if (rpr === "<w:rPr/>") rpr = "<w:rPr></w:rPr>";
    rpr = rpr.replace(/w:(ascii|hAnsi|cs)="[^"]*"/g, (_, attr: string) => `w:${attr}="${escape(fontFamily)}"`);
    const skills = [...new Set(technicalSkills.filter(Boolean))].sort((a, b) => b.length - a.length);
    const re = skills.length && selectedSections.includes(section) ? new RegExp(`(?<![A-Za-z0-9])(${skills.map((skill) => skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![A-Za-z0-9])`, "gi") : null;
    const runs = pieces.map((piece) => {
      if (piece.tab) return `<w:r>${rpr}<w:tab/></w:r>`;
      const base = piece.bold === false ? rpr.replace(/<w:b(?:Cs)?(?:\s[^>]*)?\/>/g, "") : rpr;
      const parts = re ? piece.text.split(re) : [piece.text];
      return parts.map((text, i) => {
        const bold = piece.bold === true || (re && i % 2 === 1);
        const props = bold && !/<w:b\b/.test(base) ? base.replace("</w:rPr>", "<w:b/></w:rPr>") : base;
        return `<w:r>${props}<w:t xml:space="preserve">${escape(text)}</w:t></w:r>`;
      }).join("");
    }).join("");
    return `${open}${ppr}${runs}</w:p>`;
  }
  const text = (slot: keyof typeof slots, value: string, section = "") => paragraph(slot, [{ text: value }], section);
  const bullet = (slot: "qualification" | "responsibility", value: string, section: string) => {
    const colon = slot === "qualification" ? value.indexOf(":") : -1;
    return colon > 0 && colon < 80 ? paragraph(slot, [{ text: value.slice(0, colon + 1), bold: true }, { text: value.slice(colon + 1), bold: false }], section) : paragraph(slot, [{ text: value, bold: false }], section);
  };
  const body: string[] = [text("name", resume.personalInfo.fullName.toUpperCase()), text("title", resume.personalInfo.professionalTitle), text("contact", [resume.personalInfo.phone, plainEmailValue(resume.personalInfo.email), resume.personalInfo.location].filter(Boolean).join("  |  ")), text("heading", "PROFESSIONAL SUMMARY")];
  if (resume.professionalSummary.bullets[0]) body.push(text("summary", resume.professionalSummary.bullets[0], "professionalSummary"));
  if (resume.professionalSummary.bullets.length > 1) {
    body.push(text("heading", "KEY QUALIFICATIONS"));
    body.push(...resume.professionalSummary.bullets.slice(1).map((value) => bullet("qualification", value, "professionalSummary")));
  }
  body.push(text("heading", "TECHNICAL SKILLS"));
  resume.technicalSkills.categories.forEach((category) => body.push(paragraph("skill", [{ text: `${category.name}:`, bold: true }, { text: ` ${category.skills.join(", ")}`, bold: false }], "technicalSkills")));
  body.push(text("heading", "PROFESSIONAL EXPERIENCE"));
  resume.experience.forEach((entry, i) => {
    body.push(paragraph(i === 0 ? "role" : "laterRole", [{ text: entry.role }, { text: "", tab: true }, { text: `${entry.startDate} – ${entry.endDate}` }]));
    body.push(text("company", [entry.company, entry.location].filter(Boolean).join("  |  ")));
    if (entry.description) body.push(text("description", entry.description));
    entry.responsibilities.forEach((value, j) => {
      entry.responsibilityGroups?.filter((group) => group.startIndex === j).forEach((group) => body.push(text("subheading", group.heading)));
      body.push(bullet("responsibility", value, "experience"));
    });
  });
  if (resume.education.length) {
    body.push(text("heading", "EDUCATION"));
    resume.education.forEach((entry) => body.push(paragraph("education", [{ text: [entry.degree, entry.institution, entry.location].filter(Boolean).join(", "), bold: false }, { text: "", tab: true }, { text: entry.graduationDate ?? "", bold: false }])));
  }
  zip.file("word/document.xml", original.replace(/<w:body>[\s\S]*?<\/w:body>/, `<w:body>${body.join("")}${slots.section}</w:body>`));
  zip.file("docProps/core.xml", `<?xml version="1.0" encoding="UTF-8"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${escape(resume.personalInfo.fullName)} Resume</dc:title><dc:creator>Resume Generator</dc:creator></cp:coreProperties>`);
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}
