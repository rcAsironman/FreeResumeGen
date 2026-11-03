# Resume Generator V5 — Full-Time

One candidate file: `data/candidate.json`. Supports the supplied `companies` format and the complete resume `experience` format. No master's degree, CPT or C2C setup is required.

## Use the shared link
1. Open **Edit candidate details** to review or edit the preloaded JSON, then **Save candidate details**. Changes persist in this browser. **Reload JSON file** restores the server file.
2. Select experience years, paste the JD, generate/copy the prompt into ChatGPT.
3. Paste the response, generate the resume, review proposed dates and download.

Chrome/Edge users choose their Downloads folder for dated-folder saves. Unsupported browsers receive a ZIP with the dated folder. Remote exports never write into the host's Downloads folder.

## Run locally
Run `npm ci`, `npm run build`, then `npm start` from v5. Open http://127.0.0.1:3033. For development use `npm run dev`.

## Candidate settings
Contact details, companies and education are supplied solely by the one JSON file. In-page edits override that file only in the current browser. Certification entries marked `visible: false` are not included as displayed credentials; badge controls remain optional. The JSON's `preferences.maxExperienceYears` supplies the initial target, which the dropdown can override. Bullet-count preferences override only generic length guidance, not JD matching or achievement rules.

## Validation
`npm test`, `npm run lint`, `npm run build`. The JD analysis, ATS scoring and achievement engines retain V4's behavior and limitations. Generated responsibilities and percentages remain editable, unverified draft content; no guaranteed ATS or hiring score is implied.
