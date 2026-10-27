import type { EmploymentType } from "@/types/employment-type";

/** Adds the requested application arrangement without altering candidate history. */
export function employmentTypePrompt(type: EmploymentType = "full-time") {
  if (type === "c2c") {
    return `EMPLOYMENT TYPE FOR THIS APPLICATION: C2C (corp-to-corp)
- Treat C2C as the target engagement preference for this application. Do not add C2C, a staffing supplier, client relationship, or contract dates to the candidate's work history unless the selected source explicitly records them.
- Keep every employer, employer location, and employment date exactly as supplied. Do not relabel an employer as a client or vendor.
- Remove irrelevant employment-arrangement wording from the resume headline. Mention contract availability only if the source explicitly supplies it.`;
  }

  return `EMPLOYMENT TYPE FOR THIS APPLICATION: FULL-TIME
- Target a direct full-time position. Do not describe the candidate as a contractor or add contract/vendor language.
- Keep every employer, employer location, and employment date exactly as supplied in the selected source. Fidelity Investments and Pine Labs may appear only when they are present in that source; never import them from another resume file.
- Do not claim that the candidate is currently employed full-time or available to start unless the source explicitly says so.`;
}
