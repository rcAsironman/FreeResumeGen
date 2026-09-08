import { z } from "zod";
import HTMLtoDOCX from "html-to-docx";

import { createResumeDocx } from "@/engine/export-engine/create-resume-docx";
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
  try {
    /*
     * Read the request body sent from:
     *
     * app/generated-preview/page.tsx
     */

    const body: unknown =
      await request.json();

    /*
     * Validate the complete request.
     *
     * If fontFamily is missing,
     * Times New Roman is automatically used.
     */

    const {
      resume,
      technicalSkills,
      selectedSections,
      fontFamily,
      documentHtml,
    } = requestSchema.parse(body);

    /*
     * Generate the DOCX using the
     * user-selected font.
     */

    const docxBuffer = documentHtml
      ? Buffer.from(await HTMLtoDOCX(
        `<!doctype html><html><head><meta charset="utf-8"></head><body>${documentHtml}</body></html>`,
        undefined,
        { pageSize: { width: 12240, height: 15840 }, margins: { top: 605, right: 720, bottom: 605, left: 720 } },
      ))
      : await createResumeDocx({
        resume,
        technicalSkills,
        selectedSections,
        fontFamily,
      });

    /*
     * Convert the Node.js Buffer into
     * a web-compatible Uint8Array.
     */

    const docxBytes =
      new Uint8Array(docxBuffer);

    /*
     * Return the generated Word document.
     */

    return new Response(
      docxBytes,
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

          "Content-Disposition":
            'attachment; filename="Karthik_Mangineni_Resume.docx"',

          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "DOCX generation error:",
      error,
    );

    /*
     * Zod validation error
     */

    if (error instanceof z.ZodError) {
      return Response.json(
        {
          success: false,

          error:
            "Invalid DOCX export data.",

          details:
            error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    /*
     * General DOCX generation error
     */

    return Response.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to generate DOCX.",
      },
      {
        status: 500,
      },
    );
  }
}
