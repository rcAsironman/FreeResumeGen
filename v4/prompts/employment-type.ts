import type { EmploymentType } from "@/types/employment-type";

/** Adds the requested application arrangement without altering candidate history. */
export function employmentTypePrompt(type: EmploymentType = "full-time") {
  if(type === "data-center") return `EMPLOYMENT TYPE: DATA CENTER. Use only the selected Data Center source. Preserve candidate identity and education; use the exact application-calculated dates and study/CPT exclusions. The reference PDF supplies layout only, never candidate qualifications. Do not import companies from Full-Time or C2C.`;
  if (type === "c2c") {
    return `EMPLOYMENT TYPE FOR THIS APPLICATION: C2C (corp-to-corp)
- Treat C2C as the target engagement preference for this application. Do not add C2C, a staffing supplier, client relationship, or contract dates to the candidate's work history unless the selected source explicitly records them.
- Use only the selected C2C-approved source resume for candidate facts. The application restricts C2C sources to a bachelor's degree with no master's degree. Do not import Fidelity Investments, Pine Labs, a graduate degree, employers or dates from any other source.
- Keep every C2C-source employer, location, ID and order. Use its dates as provided unless the user explicitly supplies a proposed timeline. Do not relabel an employer as a client or vendor.
- Include only the bachelor's degree recorded in the selected source. An application-supplied TIMELINE proposal overrides source dates for the editable draft only. Otherwise keep source dates.
- Remove irrelevant employment-arrangement wording from the resume headline. Mention contract availability only if the source explicitly supplies it.`;
  }

  return `EMPLOYMENT TYPE FOR THIS APPLICATION: FULL-TIME
- Target a direct full-time position. Do not describe the candidate as a contractor or add contract/vendor language.
- Use only the configured, application-approved full-time master source. The application disables Full-time when this profile has no verified full-time source; never fall back to or import C2C-source facts. Keep every employer, location, ID, date, education from the configured source. Fidelity Investments and Pine Labs may appear only when present in that source.
- Use source dates as provided unless the user explicitly supplies a proposed timeline. The configured full-time source supplies its master's degree; do not borrow education from another profile or employment mode.
- An application-supplied TIMELINE proposal overrides source dates for the editable draft only. Otherwise keep source dates.
- Do not claim that the candidate is currently employed full-time or available to start unless the source explicitly says so.`;
}
