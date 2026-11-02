"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

import { ResumeTemplate } from "@/templates/ResumeTemplate";
import type { ResumeLayout } from "@/types/resume-layout";
import type { MasterResume } from "@/types/resume";
import type { CertificationBadgeId } from "@/engine/certification-badges";
import type { CertificationBadgePosition } from "@/engine/certification-badges";
import {
  DEFAULT_RESUME_FONT,
  type ResumeFont,
} from "@/types/resume-font";

interface PdfResumeData {
  resume: MasterResume;
  templateId?: ResumeLayout;
  technicalSkills: string[];
  selectedSections: string[];
  fontFamily?: ResumeFont;
  documentHtml?: string;
  showCertificationLogos?: boolean;
  selectedCertificationBadges?: CertificationBadgeId[];
  certificationBadgePosition?: CertificationBadgePosition;
  certificationBadgeSize?: number;
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
      ) : <ResumeTemplate
        templateId={data.templateId}
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
        showCertificationLogos={data.showCertificationLogos}
        selectedCertificationBadges={data.selectedCertificationBadges}
        certificationBadgePosition={data.certificationBadgePosition}
        certificationBadgeSize={data.certificationBadgeSize}
      />}
    </main>
  );
}
