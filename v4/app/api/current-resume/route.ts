import { reviewResumeContent } from "@/engine/resume-review/content-review";
import { analyzeLocally } from "@/engine/resume-review/jd-workflow";
import { cleanRoleTitle } from "@/engine/resume-review/role-title";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { removeProficiencyLabels } from "@/engine/resume-generator/remove-proficiency-labels";
import { generatedResumeSchema, masterResumeSchema } from "@/engine/validation/resume.schema";
import { proposeEmploymentTimeline } from "@/engine/resume-review/experience-target";
import { sourceMatchesEmploymentType, sourcePreservationIssues } from "@/engine/resume-review/source-contract";
import { isEmploymentType, type EmploymentType } from "@/types/employment-type";
import type { ResumeProfile } from "@/types/resume-profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "generated-resume.json");
    const text = await readFile(filePath, "utf8");
    const resume = generatedResumeSchema.parse(removeProficiencyLabels(JSON.parse(text)));
    resume.personalInfo.professionalTitle = cleanRoleTitle(resume.personalInfo.professionalTitle || "");
    return Response.json({ success: true, resume }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const detail = error instanceof z.ZodError
      ? error.issues.map((issue) => `${issue.path.join(".") || "resume"}: ${issue.message}`).join("; ")
      : error instanceof SyntaxError
        ? `Invalid JSON syntax: ${error.message}`
        : error instanceof Error ? error.message : "Unable to read generated-resume.json.";
    return Response.json({ success: false, error: detail }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();
    const wrapped = payload && typeof payload === "object" && !Array.isArray(payload) && "resume" in payload;
    const data = wrapped ? payload as Record<string, unknown> : null;
    const guided = Boolean(data && "profile" in data);
    let resumeInput = wrapped ? data!.resume : payload;
    const repairs: string[] = [];
    if (data?.draftMode === "jd-first" && typeof data.jobDescription === "string" && resumeInput && typeof resumeInput === "object" && !Array.isArray(resumeInput)) {
      const target = analyzeLocally(data.jobDescription).targetRole;
      const value = structuredClone(resumeInput) as Record<string, unknown>;
      if (target && Array.isArray(value.experience)) {
        value.experience = value.experience.map((item: unknown) => {
          if (!item || typeof item !== "object" || Array.isArray(item)) return item;
          const row=item as Record<string, unknown>;
          if (typeof row.role === "string" && row.role.trim()) return row;
          repairs.push(`Added missing functional role for ${String(row.company || "employer")}: ${target}. This is a draft label for review, not an official title.`);
          return {...row,role:target};
        });
        const personal=value.personalInfo as Record<string,unknown> | undefined;
        if(personal && typeof personal === "object" && !(typeof personal.professionalTitle === "string" && personal.professionalTitle.trim())) {
          value.personalInfo={...personal,professionalTitle:target}; repairs.push("Added missing JD headline for draft review.");
        }
        resumeInput=value;
      }
    }
    if (guided && resumeInput && typeof resumeInput === "object" && !Array.isArray(resumeInput)) {
      const generated = resumeInput as Record<string, unknown>;
      const personalInfo = generated.personalInfo && typeof generated.personalInfo === "object" && !Array.isArray(generated.personalInfo) ? generated.personalInfo as Record<string, unknown> : null;
      const experience = Array.isArray(generated.experience) ? generated.experience : [];
      const recentRole = experience[0] && typeof experience[0] === "object" && "role" in experience[0] && typeof experience[0].role === "string" ? experience[0].role.trim() : "";
      if (personalInfo && !(typeof personalInfo.professionalTitle === "string" && personalInfo.professionalTitle.trim()) && recentRole) {
        resumeInput = { ...generated, personalInfo: { ...personalInfo, professionalTitle: recentRole } };
        repairs.push("The missing headline was filled from the most recent employer role. Review it in the editor.");
      }
    }
    const resume = generatedResumeSchema.parse(removeProficiencyLabels(resumeInput));
    const headline=cleanRoleTitle(resume.personalInfo.professionalTitle || "");
    if(headline && headline!==resume.personalInfo.professionalTitle) {
      resume.personalInfo.professionalTitle=headline;
      repairs.push("Cleaned posting qualifiers from the headline; employer titles and skills were preserved.");
    }
    const issues = reviewResumeContent(resume);
    const errors = issues.filter(issue => issue.severity === "error");
    if (errors.length) return Response.json({ success: false, error: errors.map(issue => issue.message).join(" "), issues }, { status: 400 });
    if (guided) {
      const profileValue = data!.profile;
      const employmentTypeValue = data!.employmentType;
      const file = data!.file;
      if ((profileValue !== "general") || !isEmploymentType(employmentTypeValue) || typeof file !== "string" || path.basename(file) !== file || !/\.json$/i.test(file)) {
        return Response.json({ success: false, error: "The selected source profile, employment mode, or source file is invalid." }, { status: 400 });
      }
      const profile = profileValue as ResumeProfile;
      const employmentType: EmploymentType = employmentTypeValue;
      const sourcePath = path.join(process.cwd(), "data", profile, file);
      const source = masterResumeSchema.parse(JSON.parse(await readFile(sourcePath, "utf8")));
      if (!sourceMatchesEmploymentType(profile, file, source, employmentType)) {
        return Response.json({ success: false, error: `The selected source is not approved for ${employmentType === "full-time" ? "Full-time" : "C2C"}. Re-select a compatible source and regenerate.` }, { status: 400 });
      }
      const targetYears = data!.targetYears;
      let expectedExperience = source.experience;
      if (targetYears !== null && targetYears !== undefined) {
        if (typeof targetYears !== "number" || targetYears < 1 || targetYears > 50) return Response.json({ success: false, error: "The proposed timeline target must be between 1 and 50 years." }, { status: 400 });
        const proposal = proposeEmploymentTimeline(source.experience, targetYears);
        if (!proposal) return Response.json({ success: false, error: "The proposed timeline cannot fit the selected source employers." }, { status: 400 });
        expectedExperience = proposal.experience;
      }
      const sourceErrors = sourcePreservationIssues(resume, source, employmentType, expectedExperience);
      if (sourceErrors.length) return Response.json({ success: false, error: sourceErrors.join(" "), issues: sourceErrors.map((message) => ({ code: "source-preservation", severity: "error", path: "resume", message })) }, { status: 400 });
    }
    return Response.json({ success: true, resume, issues, repairs });
  } catch (error) {
    const detail = error instanceof z.ZodError
      ? error.issues.map((issue) => `${issue.path.join(".") || "resume"}: ${issue.message}`).join("; ")
      : "The editor does not contain valid JSON.";
    return Response.json({ success: false, error: detail }, { status: 400 });
  }
}
