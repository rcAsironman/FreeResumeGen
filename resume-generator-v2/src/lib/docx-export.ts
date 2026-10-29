import { AlignmentType, BorderStyle, Document, ImageRun, Packer, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, VerticalAlign, WidthType } from "docx";
import type { ProfileSettings, Resume } from "@/types/resume";
import { resolveLogoDataUrl } from "@/lib/certification-badges";

export async function createResumeDocx(resume: Resume, profile: ProfileSettings) {
  const font = "Times New Roman";
  const children: (Paragraph | Table)[] = [];
  const badges = profile.certifications.filter((item) => item.visible && item.logo);
  const heading = (title: string) => new Paragraph({ spacing: { before: 120, after: 80 }, border: { top: { style: BorderStyle.SINGLE, size: 6, color: "000000" }, bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" }, left: { style: BorderStyle.SINGLE, size: 6, color: "000000" }, right: { style: BorderStyle.SINGLE, size: 6, color: "000000" } }, shading: { type: ShadingType.CLEAR, fill: "D3D3D3" }, keepNext: true, children: [new TextRun({ text: title, bold: true, font, size: 22 })] });
  const bullet = (text: string) => new Paragraph({ bullet: { level: 0 }, keepLines: true, spacing: { after: 40 }, children: [new TextRun({ text, font })] });

  const header = [
    new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: resume.personalInfo.fullName, bold: true, font, size: 36 })] }),
    new Paragraph({ spacing: { after: 30 }, children: [new TextRun({ text: resume.personalInfo.professionalTitle, bold: true, font, size: 23 })] }),
    new Paragraph({ children: [new TextRun({ text: [resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.location].filter(Boolean).join(" | "), font, size: 20 })] }),
  ];
  const logoRuns = (await Promise.all(badges.map(async (credential) => {
    const logoData = await resolveLogoDataUrl(credential.logo!);
    const match = logoData.match(/^data:image\/(png|jpeg|jpg);base64,/i);
    if (!match) return null;
    const base64 = logoData.slice(logoData.indexOf(",") + 1);
    const data = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    const size = Math.min(140, credential.logoSize ?? 72);
    return new ImageRun({ type: match[1].toLowerCase() === "png" ? "png" : "jpg", data, transformation: { width: size, height: size }, altText: { description: `${credential.name} certification badge` } });
  }))).filter((run): run is ImageRun => run !== null);
  if (logoRuns.length) {
    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, columnWidths: [7200, 3600], borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } }, rows: [new TableRow({ children: [new TableCell({ width: { size: 7200, type: WidthType.DXA }, margins: { top: 0, bottom: 0, left: 0, right: 120 }, children: header }), new TableCell({ width: { size: 3600, type: WidthType.DXA }, margins: { top: 0, bottom: 0, left: 0, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: logoRuns })] })] })] }));
  } else children.push(...header);

  children.push(heading("PROFESSIONAL SUMMARY"), ...resume.professionalSummary.bullets.map(bullet));
  children.push(heading("TECHNICAL SKILLS"));
  for (const category of resume.technicalSkills.categories) children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: `${category.name}: `, bold: true, font }), new TextRun({ text: category.skills.join(", "), font })] }));
  children.push(heading("PROFESSIONAL EXPERIENCE"));
  for (const experience of resume.experience) {
    children.push(new Paragraph({ keepNext: true, keepLines: true, children: [new TextRun({ text: experience.company, bold: true, font }), ...(experience.location ? [new TextRun({ text: `, ${experience.location}`, font })] : []), new TextRun({ text: `\t${experience.startDate} – ${experience.endDate}`, bold: true, font })], tabStops: [{ type: AlignmentType.RIGHT, position: 9360 }] }));
    children.push(new Paragraph({ keepNext: experience.responsibilities.length > 0, keepLines: true, spacing: { after: 60 }, children: [new TextRun({ text: experience.role, italics: true, font })] }));
    children.push(...experience.responsibilities.map(bullet));
    if (experience.environment.length) children.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Environment: ", bold: true, font }), new TextRun({ text: `${experience.environment.join(", ")}.`, font })] }));
  }
  if (resume.education.length) children.push(heading("EDUCATION"), ...resume.education.map((education) => bullet(`${education.degree} from ${education.institution}${education.location ? `, ${education.location}` : ""}${education.graduationDate ? ` in ${education.graduationDate}` : ""}.`)));

  return Packer.toBlob(new Document({ styles: { default: { document: { run: { font, size: 21 }, paragraph: { spacing: { after: 0 } } } } }, sections: [{ properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 605, right: 720, bottom: 605, left: 720 } } }, children }] }));
}
