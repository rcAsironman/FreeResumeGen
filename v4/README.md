# Resume Generator — independent clone

This app lives in `C:\Users\karth\Desktop\resume-generator-json\v3`. It has no v2 folder and does not import code or data from another project.

## Start

```powershell
npm ci
npx playwright install chromium
npm run dev
```

Open http://127.0.0.1:3021. For production, run `npm run build` then `npm start`. No AI API key is used. PDF export needs the Playwright Chromium installation.

## Two-step workflow

1. Select Full-Time or C2C, optionally GC for C2C, and paste the JD. Generate and copy one complete prompt into ChatGPT.
2. Paste the complete response and click Generate resume. The existing editor provides preview, direct text editing, badge selection/drag/size, and DOCX/PDF/JSON downloads.

The full JD is always included. Local title/skill extraction is only a preview aid; it is not a complete semantic parser. The prompt asks ChatGPT to analyze the full JD internally. No external ChatGPT generation is executed by this app.

## Timeline policy

- C2C + GC: 12-year proposed timeline.
- C2C without GC and Full-Time: detected overall JD requirement, without the previous extra year.
- Ranges use the lower bound. Per-product and preferred-only years are excluded where identifiable.
- No clear overall requirement: preserve source dates.
- Proposed dates are separate from saved original history. Review the proposal before exporting; GC selection is not evidence of career duration.

## Candidate settings and recovery

Expand Company settings to edit/import the source JSON. Full-Time and C2C custom sources save separately. Reload file source discards the current mode's browser override and loads the configured file; it does not change disk files.

Only `data/general` is active, with separate Full-Time and C2C settings. Java/Kafka entry points, source directories and their old targeting policies were moved to `.implementation-backup/retired-profile-entrypoints`; they are not imported or served. The UI always calls `prompts/general-resume.ts`. Saved legacy profile selections migrate to General.

Browser key `resume-clone-workflow-v2` stores selection, JD, pasted response and custom sources. `resume-clone-editor-v2` stores the latest imported/edited resume for recovery. Session storage keeps current editor context. Export JSON for a portable backup; browser storage is device-specific. Source JSON and pasted response are retained across refreshes. Direct text edits are saved; browser-native rich text formatting is reflected in current exports, but not all arbitrary inline styling is represented in the resume JSON.

## Achievement drafts and quality review

The prompt targets 2–3 relevant quantified bullets per employer. It uses source measurements when available and allows illustrative, unverified numerical drafts when absent. It requests distinct employer-specific work instead of repetitive duties. The JD controls draft technology, role and responsibility content; new narrative claims are unverified examples. Identity, employers, education, certifications and existing project IDs/names remain preserved. Old source summary, skills, roles, duties and environments are excluded from prompt input to prevent domain carryover.

Imported figures are never automatically deleted or converted into qualitative text. Newly introduced numerical bullets are flagged outside the resume. Exact source matches are identified as source-recorded, not independently verified. Downloads retain editable draft content; they are not a certification of factual accuracy. Replace illustrative figures with actual results before professional use.

Quality review warns about repeated/near-duplicate responsibilities, excessive metrics, missing explicit JD terms, title/body specialization gaps, target/date discrepancies and inconsistent summary years. These are heuristic warnings, not an employer ATS score or a guarantee of JD qualification. Structural JSON errors block import; content warnings do not.

## Exports

The original resume templates, font controls and badge placement are retained. Local exports save to `Downloads/YYYY-MM-DD_resumes` using America/Chicago dates and the existing rotating name sequence, now shared by DOCX, PDF and JSON. Existing files are not overwritten. The notification stays until dismissed and shows the full path. `RESUME_DOWNLOAD_DIR` overrides the destination for tests. PDF rendering uses this running app's origin, rather than the original project's port 3000.

## Verification

- `npm test`: current logic/prompt contracts, source integrity, chronology, content validation, naming and template regression checks.
- `npm run lint`
- `npm run build`
- `npm run test:e2e`: start this app on port 3021 first. Uses an isolated browser context, tests profiles/GC/refresh/import/metrics/badges and saves QA exports. Set `RESUME_DOWNLOAD_DIR` to `.qa/downloads` when launching the test server to isolate files.

The archived `kafka-actual-review.cjs` is a historical October review against a recorded source checksum and old prompt rules; it is not part of the current regression suite. Historical generated artifacts are reference material, not current app data or current test outputs. Current test results and browser artifacts are in `.qa` (ignored by Git).

The automated tests exercise application behavior with explicit fixtures. They do not prove that every future ChatGPT response will comply or achieve a particular ATS score.

## Databricks regression

`tests/databricks.test.cjs` covers the supplied JD and original failing response: prose experience extraction, mandatory roles, technology coverage, profile removal and source narrative isolation. `.qa/databricks` contains an assistant-authored test response, the app-generated prompt, browser-tested exports and a comparison report. This was not a live ChatGPT UI generation. Missing functional roles can be filled from an explicit JD title during draft import, with an audit notice; existing nonempty titles are never silently overwritten.

## Universal achievement completion
Step 2 now adds up to two contextual numerical draft examples per employer when imported responsibilities lack them. Existing measurements are preserved. Original/replacement text and unverified status are stored in draftMetricEdits outside the resume schema. One draft notice replaces individual review flags. Private correction diagnostics separate tool-specific tenure from career duration, check skills-only entries and vague wording, and ignore harmless headline punctuation. The latest actual response test produced ten examples across five employers without changing dates or titles.

Outcome selection considers the entire resume to avoid repeating the same result under every employer. Only outcomes relevant to the original responsibility are eligible. Older saved examples refresh when the editor opens if their text still exactly matches the app's recorded replacement; manually edited bullets and other numerical claims remain unchanged. Generated percentages remain unverified draft examples.

Version 3 varies result placement and sentence structure while retaining the original technical implementation. Testing, deployment preparation and job orchestration use separate outcome categories; merely attending deployment meetings does not qualify. The single ChatGPT prompt also requests specific, varied achievements rather than repetitive percentage suffixes. Existing saved app-authored examples migrate safely through the same versioned editor refresh.

## Resume headlines
JD analysis, prompt construction and JSON imports share a title cleaner. Posting slogans, technology suffixes, locations and contract qualifiers are removed from the headline while the complete JD remains available for skill extraction. Meaningful prefixes and levels such as Java, C#, .NET Core and Engineer II are retained. Nonempty historical employer titles are never replaced by the JD headline. Older browser drafts receive a one-time headline cleanup; subsequent manual editor changes remain editable and exports use the same resume state as the preview. Full-Stack scope checks look for both frontend and backend responsibilities without inventing missing work.

## V4 experience selection
Run v4 on http://127.0.0.1:3032. The saved Experience years dropdown overrides JD/GC defaults; Automatic retains those defaults. Full-Time study settings default to the candidate-provided January 2024–December 2025 master's period and January 2025 CPT start. Pre-CPT study months are excluded from proposed employment, and selected years count employment months only. A blank CPT field excludes the entire study period. Settings are editable and are not a determination of employment authorization. Dates are synchronized on import only when employer IDs and company names match the selected source; independent resume imports retain their own history. Education follows Technical Skills in both preview layouts and DOCX/PDF exports. V3 is unchanged.


## Shared-link downloads
Remote visitors receive file bytes, never a save into the host computer's Downloads. Chrome/Edge users can choose Downloads once per page session; the app creates the dated folder and avoids existing JSON/DOCX/PDF names. If directory access is unavailable, the browser downloads a ZIP with the dated folder inside. Browser settings determine the fallback download location. Localhost retains the existing direct daily-folder save. PDF rendering uses the local HTTP origin behind a TLS tunnel.

