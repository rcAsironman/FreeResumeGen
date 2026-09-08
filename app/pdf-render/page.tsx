"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

import { FixedResumeTemplate } from "@/templates/fixed-resume/FixedResumeTemplate";
import type { MasterResume } from "@/types/resume";
import {
  DEFAULT_RESUME_FONT,
  type ResumeFont,
} from "@/types/resume-font";

interface PdfResumeData {
  resume: MasterResume;
  technicalSkills: string[];
  selectedSections: string[];
  fontFamily?: ResumeFont;
  documentHtml?: string;
}

export default function PdfRenderPage() {
  const [data, setData] =
    useState<PdfResumeData | null>(null);

  useEffect(() => {
    const storedData =
      sessionStorage.getItem(
        "pdfResumeData",
      );

    if (!storedData) {
      return;
    }

    try {
      const parsedData = JSON.parse(
        storedData,
      ) as PdfResumeData;

      setData(parsedData);
    } catch (error) {
      console.error(
        "Unable to read PDF resume data:",
        error,
      );
    }
  }, []);

  if (!data) {
    return (
      <main
        style={{
          margin: 0,
          padding: 0,
          background: "#ffffff",
        }}
      >
        Loading resume...
      </main>
    );
  }

  return (
    <main
      data-pdf-ready="true"
      style={{
        margin: 0,
        padding: 0,
        background: "#ffffff",
      }}
    >
      {data.documentHtml ? (
        <div dangerouslySetInnerHTML={{ __html: data.documentHtml }} />
      ) : <FixedResumeTemplate
        resume={data.resume}
        technicalSkills={
          data.technicalSkills
        }
        selectedSections={
          data.selectedSections
        }
        fontFamily={
          data.fontFamily ??
          DEFAULT_RESUME_FONT
        }
      />}
    </main>
  );
}
