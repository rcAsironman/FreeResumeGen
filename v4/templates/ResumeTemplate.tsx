import { DataCenterTemplate } from "@/templates/data-center/DataCenterTemplate";
import type { ComponentProps } from "react";
import { FixedResumeTemplate } from "@/templates/fixed-resume/FixedResumeTemplate";
import { ArchitectResumeTemplate } from "@/templates/architect-resume/ArchitectResumeTemplate";
import { DEFAULT_RESUME_LAYOUT, type ResumeLayout } from "@/types/resume-layout";

export function ResumeTemplate({ templateId = DEFAULT_RESUME_LAYOUT, ...props }: ComponentProps<typeof FixedResumeTemplate> & { templateId?: ResumeLayout }) {
  if(templateId === "data-center") return <DataCenterTemplate resume={props.resume}/>;
  return templateId === "architect-resume" ? <ArchitectResumeTemplate {...props}/> : <FixedResumeTemplate {...props}/>;
}
