import { reviewResumeContent } from "@/engine/resume-review/content-review";
import { assertLocalResumeSave, saveDailyResume } from "@/engine/export-engine/save-daily-resume";
import { RESUME_LAYOUTS, DEFAULT_RESUME_LAYOUT } from "@/types/resume-layout";
import { chromium } from "playwright";
import { z } from "zod";

import { masterResumeSchema } from "@/engine/validation/resume.schema";
import {
  DEFAULT_RESUME_FONT,
} from "@/types/resume-font";

export const runtime = "nodejs";

const requestSchema = z.object({
  resume: masterResumeSchema,
  saveToFolder: z.boolean().optional().default(false),
  templateId: z.enum(RESUME_LAYOUTS).optional().default(DEFAULT_RESUME_LAYOUT),

  technicalSkills: z.array(
    z.string(),
  ),

  selectedSections: z.array(
    z.string(),
  ),

  documentHtml: z.string().max(2_000_000).optional(),

  fontFamily: z
    .enum([
      "Times New Roman",
      "Arial",
      "Calibri",
      "Cambria",
      "Georgia",
    ])
    .optional()
    .default(DEFAULT_RESUME_FONT),
});

export async function POST(
  request: Request,
) {
  let browser;

  try {
    const body: unknown =
      await request.json();

    const {
      resume,
      saveToFolder,
      templateId,
      technicalSkills,
      selectedSections,
      fontFamily,
      documentHtml,
    } = requestSchema.parse(body);

    const contentErrors = reviewResumeContent(resume).filter(issue => issue.severity === "error");
    if (contentErrors.length) return Response.json({ success: false, error: contentErrors.map(issue => issue.message).join(" ") }, { status: 400 });
    if (saveToFolder) assertLocalResumeSave(request);

    const baseUrl =
      process.env.APP_BASE_URL ??
      "http://localhost:3000";

    browser = await chromium.launch({
      headless: true,
    });

    const page =
      await browser.newPage();

    /*
     * Open the app origin first so
     * sessionStorage is available.
     */

    await page.goto(
      baseUrl,
      {
        waitUntil:
          "domcontentloaded",
      },
    );

    /*
     * Store all resume-rendering data,
     * including the selected font.
     */

    await page.evaluate(
      (payload) => {
        sessionStorage.setItem(
          "pdfResumeData",
          JSON.stringify(payload),
        );
      },
      {
        resume,
        templateId,
        technicalSkills,
        selectedSections,
        fontFamily,
        documentHtml,
      },
    );

    /*
     * Open the dedicated PDF render page.
     */

    await page.goto(
      `${baseUrl}/pdf-render`,
      {
        waitUntil:
          "domcontentloaded",
      },
    );

    /*
     * Wait until React has rendered
     * the complete resume.
     */

    await page.waitForSelector(
      '[data-pdf-ready="true"]',
      {
        state: "visible",
        timeout: 30000,
      },
    );

    /*
     * Use print CSS.
     */

    await page.emulateMedia({
      media: "print",
    });

    /*
     * Generate a real 8.5 × 11
     * US Letter PDF.
     */

    if (templateId === "architect-resume") {
      await page.addStyleTag({ content: "@page { size: Letter; margin: 0in 0.132639in 0in 0.197222in; }" });
    }
    const pdf = await page.pdf({
      format: "Letter",

      printBackground: true,

      /*
       * Playwright controls the physical
       * Letter page size.
       */
      preferCSSPageSize: false,

      margin: {
        top: templateId === "architect-resume" ? "0in" : "0.42in",
        right: templateId === "architect-resume" ? "0.132639in" : "0.5in",
        bottom: templateId === "architect-resume" ? "0in" : "0.42in",
        left: templateId === "architect-resume" ? "0.197222in" : "0.5in",
      },
    });

    /*
     * Convert Node Buffer into
     * a Response-compatible body.
     */

    if (saveToFolder) {
      const saved = await saveDailyResume(pdf, resume.personalInfo.fullName, "pdf");
      return Response.json(saved, { headers: { "Cache-Control": "no-store" } });
    }

    const pdfBytes =
      new Uint8Array(pdf);

    return new Response(
      pdfBytes,
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            'inline; filename="Karthik_Mangineni_Resume.pdf"',

          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "PDF generation error:",
      error,
    );

    if (
      error instanceof
      z.ZodError
    ) {
      return Response.json(
        {
          success: false,

          error:
            "Invalid PDF export data.",

          details:
            error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    return Response.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to generate PDF.",
      },
      {
        status: 500,
      },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
