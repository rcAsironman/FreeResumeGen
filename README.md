# Guided Keyless Resume Generator

This project recreates the JD-analysis and tailored-resume workflow without an OpenAI API key. It prepares prompts for ChatGPT in your browser and validates the JSON responses you paste back into the app.

Workflow:

1. Paste the job description and copy Prompt 1 into ChatGPT.
2. Paste ChatGPT's analysis JSON into the app.
3. Choose the sections where matching skills should be bolded. Professional Summary and Professional Experience are selected by default.
4. Copy Prompt 2 into ChatGPT and paste the generated resume JSON into the app.
5. Edit, add, or remove content; preview; then download PDF or DOCX.

The editor also supports direct Word-style editing on the rendered resume. Select text to apply bold, italic, underline, strikethrough, fonts, sizes, colors, highlighting, alignment, lists, indentation, links, undo/redo, or clear formatting. These direct edits are included in PDF and DOCX downloads.

The editor saves files directly into the local computer’s `Downloads/YYYY-MM-DD_resumes/` folder, using the date in America/Chicago. It reuses the daily folder and selects an unused name across PDF and Word exports: `karthik_resume`, `karthik-resume`, `karthik_M_resume`, `karthik_ma_resume`, `karthik_Man_resume`, then longer surname prefixes. After the full surname, clean numeric suffixes keep names unique. Existing files are never overwritten, and the sequence restarts in the next day’s folder. The page shows the full saved path. This feature is for the locally running app; `RESUME_DOWNLOAD_DIR` can override the base folder for testing or configuration. API callers can still request a raw PDF/DOCX by omitting `saveToFolder`.

Master sources are stored separately in `data/java/` and `data/kafka/`. Generated resume data remains in `data/generated-resume.json`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# File-driven resume workflow

This project does not require an OpenAI key.

1. Give ChatGPT the job description and `data/master-resume.json`.
2. Ask ChatGPT to return only valid JSON using the same schema.
3. Replace the contents of `data/generated-resume.json` with that JSON.
4. Run `npm run dev`, or restart the command if it was already running.
5. Open `http://localhost:3000` to edit, add or remove content, preview the resume, and download PDF or DOCX.

Changes made in the browser are temporary. Use **Copy updated JSON**, paste it back into `data/generated-resume.json`, and save to keep them.
# FreeResumeGen


## Java and Kafka profiles

The home page has separate Java and Kafka profiles. Each uses an independent generation prompt and source resume. The browser remembers the active profile and each profile's last selected source for the same site address.

The setup panel remembers a Full-time or C2C preference. Full-time automatically selects the Fidelity Investments/Pine Labs source for Java and general profiles; switching to C2C restores the source you last selected for that profile. Both the preference and source selection persist. Kafka currently has no Fidelity/Pine Labs source file, so its selected Kafka source remains active.

- Java defaults to `data/java/master-resume-java.json`, seeded from `master-resume9.json`, and uses `prompts/java-resume.ts`.
- Kafka defaults to `data/kafka/master-resume-kafka.json`, seeded from `master-resume-k10.json` with a curated Kafka skills section, and uses `prompts/kafka-resume.ts`.
- Original experience variants remain available in their respective folders. Add a valid resume JSON file to `data/java/` or `data/kafka/` and refresh to see it under that profile. Profile and saved filename selections continue working after the folder move.
- Edit the selected source to update candidate facts. Sources are never merged between profiles. Switching profiles clears the previous analysis and generated response.

## Generate any resume from JD

Choose **Generate any resume from JD** in the profile dropdown. It uses `data/general/master-resume-general.json` for candidate details and history, and `prompts/general-resume.ts` for targeting any profession. The initial source is copied from the existing candidate resume; edit it or add another valid JSON file in `data/general/` to supply different factual history.

Update the selected source JSON to supply actual tools, tasks, employers and dates. The browser remembers the selected profile/source. Analyze the current JD, then copy the generation prompt as usual. This mode has no Java/Kafka preference and no automatic language/database exclusion. Required years are assessed separately per skill; employment dates and unsupported product experience are never invented. Direct, evidence-based wording replaces proficiency labels.

Public Kofax/Tungsten customer references are saved in `data/reference/technology-companies.ts`. They are research references, not candidate work history, and customer names are not injected into generated employment. General-mode prompts use existing source dates without date follow-ups and adjust emphasis to requested experience; they never construct a 4- or 13-year career by substituting employers or dates.

## Resume formats

In the editor, use **Resume format** to choose **Original format (default)** or **Aditya reference format**. The original remains the initial selection. The reference format uses a centered header, thin rules under headings, a paragraph summary followed by key qualifications, role/date rows, and education last. Both PDF and Word downloads follow the selected format. The first summary point becomes the paragraph; the remaining points become qualifications, without duplicating or dropping text. Environments are retained in resume data but are not displayed in the reference format, matching the source document. Existing optional experience descriptions and responsibility-group headings are supported. Word output reuses the source package styles and numbering; changing the font or text can change pagination.
