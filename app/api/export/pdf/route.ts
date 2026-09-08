import { chromium } from "playwright";
import { z } from "zod";

import { masterResumeSchema } from "@/engine/validation/resume.schema";
import {
  DEFAULT_RESUME_FONT,
} from "@/types/resume-font";

export const runtime = "nodejs";

const requestSchema = z.object({
  resume: masterResumeSchema,

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
      technicalSkills,
      selectedSections,
      fontFamily,
      documentHtml,
    } = requestSchema.parse(body);

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

    const pdf = await page.pdf({
      format: "Letter",

      printBackground: true,

      /*
       * Playwright controls the physical
       * Letter page size.
       */
      preferCSSPageSize: false,

      margin: {
        top: "0.42in",
        right: "0.5in",
        bottom: "0.42in",
        left: "0.5in",
      },
    });

    /*
     * Convert Node Buffer into
     * a Response-compatible body.
     */

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
