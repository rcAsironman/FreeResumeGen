# Resume Studio v2

Resume Studio v2 is a standalone JD-first resume builder. It supports Full-Time and C2C profiles, any role described by the current job description, and a manual ChatGPT prompt/import workflow. It does not use an AI API.

## Run locally

```powershell
cd C:\Users\karth\Desktop\resume-generator-v2
npm run dev
```

Open http://localhost:3000.

## Seven-step workflow

1. **Company Settings:** Select Full-Time or C2C. Record each employer's actual title, client, location, actual dates, responsibilities, technologies, and project details. Enter work you personally performed. Company names and industries are not evidence of job duties.
2. **JD Analysis:** Paste the complete job description. The app extracts the target role, experience requirement, industry, and requirements locally in the browser.
3. **Experience Matching:** Compare JD requirements with the selected profile's saved work history. Supported, partial, and undocumented requirements are shown before generation.
4. **Resume Generation:** Copy the generated prompt, paste it into ChatGPT yourself, and ask it to return the requested resume JSON. The prompt uses the JD to prioritize matching facts; it cannot treat JD requirements as past experience.
5. **Import and Review:** Paste or import ChatGPT's complete JSON, validate it, then review generated statements and proposed dates. Edit, confirm, or remove each item. One-click confirmation is available only when all remaining claims accurately reflect the candidate's history.
6. **ATS Evaluation:** Review the evidence-based JD alignment estimate. The report distinguishes supported draft content, supported facts missing from the draft, requirements not documented in history, and JD terms present in the draft without matching profile evidence.
7. **Export:** Download final DOCX, PDF, or JSON after included content is confirmed. Draft downloads remain marked for review.

## Candidate profile data

Full-Time and C2C settings are separate and saved in the browser. The starter JSON files are in `data/settings/`. Each company can store:

- `companyName`, `clientName`, `industry`, `location`, actual `jobTitle`, actual dates, and `isCurrent`.
- `responsibilities` and `technologies` that the candidate personally performed or used.
- `projects`, each with its own client, industry, factual context, technologies, and responsibilities.

The settings screen has guided fields for employers and projects, plus an optional advanced JSON editor. Existing profile JSON without the new work-history arrays is migrated to empty arrays. The generator pauses when selected employers have no recorded work responsibilities or project facts; add the real source history before generating a complete resume.

JD target dates are proposed separately from configured actual dates. The timeline starts from the current date, follows the JD experience requirement up to the profile maximum (8 years for Full-Time and 13 years for C2C), and distributes the period across selected employers without overlap. Each changed date remains a proposal for review.

## Evidence and matching policy

The current JD can target Data Integration Developer, Kafka Engineer, Java Developer, or another role. It determines the target headline and content priorities. The profile determines historical facts: employer titles, responsibilities, technologies, project context, education, and credentials. The generator may rewrite and organize those facts but must not add unsupported duties, tools, metrics, migrations, or deployment outcomes. Unsupported JD requirements stay visible as gaps rather than being added as resume claims.

The score is a local text and evidence alignment estimate, not a score from an employer ATS, verification of the candidate's history, or a hiring prediction. No free ATS provider API is called.

## Resume output and layout

The resume JSON contract is `personalInfo`, `professionalSummary`, `technicalSkills`, `experience`, `projects`, `education`, and `certifications`. The exported resume retains the existing simple ATS-readable format: candidate header, bulleted summary, technical skills, employer sections with bulleted responsibilities, and education. DOCX page breaks keep each employer heading with the role and its first responsibility bullet while allowing longer experience entries to continue across pages.

## Data and privacy

Profiles, drafts, and previously confirmed statements are stored in browser local storage. The app does not upload files or call AI/ATS services. Copying the prompt puts the selected profile facts and job description on the clipboard; the candidate then chooses where to paste it.

## Quality checks

```powershell
npm test
npm run lint
npm run build
```
