import { careerDuration } from "@/engine/resume-review/content-review";
import { JD_TARGETING_RULES } from "@/prompts/jd-targeting";
import type { JobAnalysis } from "@/types/job-analysis";
import type { MasterResume } from "@/types/resume";
import type { HighlightSection } from "@/components/builder/SectionSelector";

export function javaGenerationPrompt(jd: string, analysis: JobAnalysis, master: MasterResume, sections: HighlightSection[]) {
  const promptMaster = { ...master, personalInfo: { ...master.personalInfo } };
  delete promptMaster.personalInfo.linkedIn;
  return `You are a senior Java engineering recruiter and technical resume writer specializing in Java backend and full-stack hiring. Use only the supplied Java source resume as candidate evidence. Create a complete resume tailored to the supplied target role and job description. Return ONLY valid JSON with no Markdown fences, commentary, ATS score, or explanation.

TARGET ROLE:
${analysis.targetRole}

${JD_TARGETING_RULES}

TOTAL CAREER TIMELINE CONTEXT:
${JSON.stringify({ asOfChicagoDate: new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(new Date()), duration: careerDuration(master.experience) })}
- Use the calculated non-overlapping duration for total career years, not an outdated summary. If duration is null, omit exact years rather than guess. This does not prove years with Java, Kafka or any specific product. Keep the profile-specific evidence rules.

TARGETING PRIORITY
- The current JOB DESCRIPTION is authoritative for the profession, role name, skills, duties, and deliverables. Correct stale or conflicting analysis using the JD.
- Keep this a Java engineering profile. Prioritize JD-relevant Java, Spring, APIs, application architecture, testing, cloud and delivery experience. Include frontend only for relevant full-stack duties; include Kafka only as application messaging when the JD and source support it. Do not import Kafka administrator or broker-operations claims from another profile.
- Rewrite all editable sections for the target profession, not just a few keywords. Preserve section order, experience order, and detailed source-backed summary and responsibilities; bullet counts must not force repetition or invented work.
- Internally map mandatory and preferred JD requirements to source evidence and transferable work before writing. Factual accuracy takes precedence: never turn unsupported JD requirements into invented past experience.

GLOBAL RULES
- Use valid JSON escaping: never put a backslash before punctuation such as &, _, or %. Encode literal backslashes as two backslashes and quotes inside strings as escaped quotes.
- Preserve the exact JSON structure and every required property from MASTER RESUME JSON.
- Preserve full name, email, phone, location, employer names, employer locations, employment dates, education, certifications, project history, and stable IDs.
- Omit personalInfo.linkedIn entirely. Never include LinkedIn labels, URLs, or links anywhere in the resume. Keep other contact fields as plain text without Markdown or mailto syntax.
- Copy the source email exactly as a plain email address. Never add forward slashes, backslashes, Markdown escapes, or link wrappers to email values.
- Keep the resume internally consistent, technically believable, recruiter-readable, and ATS-friendly.
- Never invent employers, dates, education, certifications, revenue, financial savings, user counts, transaction volumes, or absolute scale claims.

PROFESSIONAL TITLE
- Set personalInfo.professionalTitle to the current JD role name, retaining the core profession and specialization and only supported seniority. Never substitute the master title for a different target role.
- Do not copy marketing language, locations, contract details, requisition codes, client names, parenthetical phrases, or a list of technologies into the title.

PROFESSIONAL SUMMARY
- Retain detailed summary coverage from the master, using distinct relevant evidence rather than enforcing an exact count.
- Rewrite all bullets for the target role, eliminate repetition, and distribute high-value JD terminology naturally.
- Match the candidate's overall years and career level.
- Emphasize transferable experience and use realistic enterprise language.

REQUIRED JD SKILLS THAT ARE MISSING
- Treat the JD as the primary targeting source and the extracted skill list as an aid.
- Prioritize explicitly required JD skills explicitly supported by the source. Transferable work can demonstrate tasks, not unrecorded named-tool usage. Do not present unsupported skills as established experience.
- Include dependencies or companion tools only when source evidence establishes actual use and they are relevant to the JD.
- Select skills for the target profession, including domain tools, methods, and standards; remove unrelated legacy-stack emphasis.
- Do not add a technology as an isolated keyword. Demonstrate important additions in believable context across the Professional Summary, Technical Skills, recent Responsibilities, and Environment.
- NEVER add proficiency labels such as "Exposure," "Familiar," "Familiarity," "Basic," "Beginner," or "Working Knowledge" anywhere in the resume, whether parenthesized, bracketed, or written as a suffix.
- Add a JD skill only if its use is documented in source evidence; wording alone cannot justify adding it.
- Keep standard technology names clean in Technical Skills and Environment, for example "Angular," "Azure Kubernetes Service (AKS)," and "GenAI."
- In experience bullets, use defensible verbs such as "used," "integrated," "supported," "applied," or "worked with" according to the available evidence.
- Do not fabricate project experience or imply deep expertise where it is unsupported.
- Do not claim certifications, years of experience, deep expertise, or production scale for newly introduced skills.
- For AI-assisted-development roles, include only tools and practices explicitly required or strongly implied by the JD, such as Cursor AI, GitHub Copilot, AI pair programming, code generation, debugging, refactoring, test scaffolding, and code-review assistance. Do not add an unrelated AI ecosystem.

TECHNICAL SKILLS
- Rebuild categories around the target profession. Remove irrelevant legacy categories and prioritize supported mandatory JD skills, then preferred and supporting skills.
- Include relevant domain tools, methods, standards, and transferable skills for non-software roles.
- Preserve relevant version groups exactly, for example "Java 8/11/17".
- Remove duplicates and empty categories. Do not repeat the same skill across categories without a real reason.
- Technology names must always remain clean. Never append, prepend, or otherwise attach proficiency qualifiers to them.

PROFESSIONAL EXPERIENCE
- For every experience preserve exactly: id, company, location, startDate, and endDate.
- Align role wording with the target profession only when accurate for the source duties; never falsify historical titles. Rewrite every responsibility and environment for relevance while keeping employer domain and time period realistic.
- Use JD duty vocabulary to show the task, tool or method, deliverable, and supported outcome. Remove unrelated stack emphasis; never claim unsupported duties were performed.
- Give the strongest JD alignment to the most recent and most relevant experience.
- Demonstrate supported JD skills through their documented implementation context; do not make every employer use the same stack.
- Start bullets with varied action verbs and communicate Action + Technical Implementation + Engineering or Business Outcome.
- Keep most bullets approximately 20–35 words, remove generic filler, and avoid keyword lists disguised as sentences.
- Do not repeat nearly identical responsibilities across employers.

MEASURABLE IMPACT
- Retain only source-supported metrics and outcomes. Never invent estimated percentages, improvements, or other achievements.

ATS KEYWORD DISTRIBUTION
- Use exact standard names for the highest-priority JD requirements.
- Distribute them naturally through Summary, Technical Skills, recent Experience, and Environment instead of keyword stuffing.
- Cover these extracted terms where technically coherent: ${analysis.allTechnicalSkills.join(", ")}.
- The app will bold matching terms in these user-selected sections: ${sections.join(", ")}.

FINAL REVIEW
- Return the complete resume JSON object only.
- Ensure contact values contain no Markdown or mailto syntax.
- Verify required JD terms are represented in realistic context.
- Remove duplicate bullets, generic AI-style filler, and unnecessary technology repetition.
- Verify the professional title matches the current JD role and summary, categories, responsibilities, and environment consistently target that profession. Verify original structure and distinct evidence-backed bullets, and remove all LinkedIn content.
- Keep factual claims interview-defensible. Proficiency labels are prohibited everywhere in the resume. Express claim strength only through contextual wording in Professional Summary and Professional Experience.

JOB DESCRIPTION:
${jd.trim()}

JOB ANALYSIS JSON:
${JSON.stringify(analysis, null, 2)}

MASTER RESUME JSON:
${JSON.stringify(promptMaster, null, 2)}`;
}

