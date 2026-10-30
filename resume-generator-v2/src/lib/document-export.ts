import { AlignmentType, BorderStyle, Document, HorizontalPositionRelativeFrom, ImageRun, Packer, Paragraph, ShadingType, TextRun, VerticalPositionRelativeFrom } from "docx";
import { resolveLogoDataUrl } from "./certification-badges";

/** Snapshot computed editor styles so PDF has the exact same fonts, layout and edits. */
export async function snapshotDocument(root: HTMLElement) {
  const clone = root.cloneNode(true) as HTMLElement;
  const originals = [root, ...root.querySelectorAll<HTMLElement>("*")];
  const copies = [clone, ...clone.querySelectorAll<HTMLElement>("*")];
  originals.forEach((original, i) => {
    const style = getComputedStyle(original);
    copies[i].removeAttribute("contenteditable");
    copies[i].removeAttribute("tabindex");
    copies[i].removeAttribute("id");
    copies[i].removeAttribute("onerror");
    copies[i].style.cssText = Array.from(style).map((property) => `${property}:${style.getPropertyValue(property)}`).join(";");
    copies[i].style.outline = "none";
    // Screen pixel heights must not constrain text that flows across printed pages.
    if (original.tagName !== "IMG") copies[i].style.height = "auto";
  });
  for (const image of clone.querySelectorAll<HTMLImageElement>("img")) {
    image.src = await resolveLogoDataUrl(image.src);
    image.removeAttribute("srcset");
    image.removeAttribute("loading");
  }
  const paddingTop = parseFloat(getComputedStyle(root).paddingTop);
  const paddingLeft = parseFloat(getComputedStyle(root).paddingLeft);
  clone.style.width = "720px";
  clone.style.minHeight = "0";
  clone.style.padding = "0";
  clone.style.margin = "0";
  clone.style.border = "0";
  clone.style.boxShadow = "none";
  clone.querySelector(".credential-logos")?.remove();
  const paperBounds = root.getBoundingClientRect();
  for (const original of root.querySelectorAll<HTMLImageElement>(".credential-logo img")) {
    const bounds = original.getBoundingClientRect();
    const image = document.createElement("img");
    image.src = await resolveLogoDataUrl(original.src);
    image.alt = original.alt;
    image.style.cssText = `position:absolute;left:${bounds.left - paperBounds.left - paddingLeft}px;top:${bounds.top - paperBounds.top - paddingTop}px;width:${bounds.width}px;height:${bounds.height}px;object-fit:contain`;
    clone.appendChild(image);
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:white}li::marker{color:black;font-size:9pt}h2{break-after:avoid-page}li{break-inside:avoid} [data-docx-job],[data-docx-role]{break-after:avoid-page}</style></head><body>${clone.outerHTML}</body></html>`;
}

/** Export edited text and inline formatting; coordinates are CSS pixels converted to EMUs. */
export async function createEditedDocx(root: HTMLElement) {
  const children: Paragraph[] = [];
  const style = getComputedStyle(root);
  const origin = root.getBoundingClientRect();
  const images = await Promise.all(Array.from(root.querySelectorAll<HTMLImageElement>(".credential-logo img")).map(async (image) => {
    const dataUrl = await resolveLogoDataUrl(image.src);
    const bounds = image.getBoundingClientRect();
    const data = Uint8Array.from(atob(dataUrl.split(",")[1]), (character) => character.charCodeAt(0));
    return new ImageRun({ type: dataUrl.startsWith("data:image/png") ? "png" : "jpg", data,
      transformation: { width: bounds.width, height: bounds.height },
      floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.MARGIN, offset: Math.round((bounds.left - origin.left - parseFloat(style.paddingLeft)) * 9525) }, verticalPosition: { relative: VerticalPositionRelativeFrom.MARGIN, offset: Math.round((bounds.top - origin.top - parseFloat(style.paddingTop)) * 9525) }, allowOverlap: true, behindDocument: false },
    });
  }));
  function runs(element: HTMLElement): TextRun[] {
    const output: TextRun[] = [];
    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const css = getComputedStyle(node.parentElement!);
        const rgb = css.color.match(/\d+/g);
        output.push(new TextRun({ text: node.textContent ?? "", font: css.fontFamily.split(",")[0].replace(/["']/g, ""), size: Math.round(parseFloat(css.fontSize) * 1.5), bold: Number(css.fontWeight) >= 600 || css.fontWeight === "bold", italics: css.fontStyle === "italic", underline: css.textDecorationLine.includes("underline") ? {} : undefined, strike: css.textDecorationLine.includes("line-through"), color: rgb?.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, "0")).join("") }));
      } else if (node.nodeName === "BR") output.push(new TextRun({ break: 1 }));
      else node.childNodes.forEach(walk);
    };
    walk(element); return output;
  }
  const editable = root.querySelector<HTMLElement>(".original-editable")!;
  let previousBottom: number | null = null;
  function visit(element: HTMLElement) {
    const isJob = element.hasAttribute("data-docx-job");
    const isBlock = ["H1", "H2", "P", "LI"].includes(element.tagName) || element.hasAttribute("data-docx-role") || (element.tagName === "DIV" && !element.querySelector("div,p,ul,ol,h1,h2,section"));
    if (isBlock || isJob) {
      const css = getComputedStyle(element);
      const heading = element.tagName === "H2";
      const bullet = element.tagName === "LI";
      const headingBorder = { style: BorderStyle.SINGLE, size: 6, color: "000000" };
      const textRuns = isJob ? [...runs(element.children[0] as HTMLElement), new TextRun("\t"), ...runs(element.children[1] as HTMLElement)] : runs(element);
      const bounds = element.getBoundingClientRect();
      const before = previousBottom === null ? 0 : Math.max(0, Math.round((bounds.top - previousBottom) * 15));
      children.push(new Paragraph({
        children: [...(children.length ? [] : images), ...textRuns],
        spacing: { before, after: 0, line: Math.round(parseFloat(css.lineHeight || "16") * 15) },
        keepNext: heading || isJob || element.hasAttribute("data-docx-role"), keepLines: true,
        bullet: bullet ? { level: 0 } : undefined,
        indent: bullet ? { left: 420, hanging: 270 } : undefined,
        alignment: css.textAlign === "center" ? AlignmentType.CENTER : css.textAlign === "right" ? AlignmentType.RIGHT : css.textAlign === "justify" ? AlignmentType.JUSTIFIED : AlignmentType.LEFT,
        tabStops: isJob ? [{ type: AlignmentType.RIGHT, position: 10800 }] : undefined,
        border: heading ? { top: headingBorder, bottom: headingBorder, left: headingBorder, right: headingBorder } : undefined,
        shading: heading ? { type: ShadingType.CLEAR, fill: "D3D3D3" } : undefined,
      }));
      previousBottom = bounds.bottom;
    } else Array.from(element.children).forEach((child) => visit(child as HTMLElement));
  }
  Array.from(editable.children).forEach((child) => visit(child as HTMLElement));
  return Packer.toBlob(new Document({ styles: { default: { document: { run: { font: "Times New Roman", size: 21 }, paragraph: { spacing: { after: 0 } } } } }, sections: [{ properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 605, right: 720, bottom: 605, left: 720 } } }, children }] }));
}

export async function saveResumeDownload(blob: Blob, fullName: string, format: "docx" | "pdf" | "json") {
  const form = new FormData(); form.set("file", blob, `resume.${format}`); form.set("name", fullName); form.set("format", format);
  const response = await fetch("/api/save-resume", { method: "POST", body: form });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Could not save resume.");
  return result as { filePath: string; filename: string; folderName: string };
}
