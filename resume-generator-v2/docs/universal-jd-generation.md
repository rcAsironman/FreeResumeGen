# Universal JD generation

## Root causes

- Confirmations were stored under employment-profile and employer keys without a candidate identity or originating JD. Earlier generated titles could be replayed as source facts.
- `scopePriorStatements` accepted a single role keyword. The former headline check likewise treated one specialty word in a responsibility as sufficient alignment.
- The prompt combined saved facts with general drafting instructions, allowing frequent unrelated source technologies to dominate. JD inference also selected a profession from a fixed technology priority list.
- Prompt construction used a backward-calculated timeline and could reorder employers by industry. Those dates were not actual history.
- Import selected fictional quantified sentences into the displayed resume, while export bypassed the old claim-finalization code. The old scoring UI was hidden and used a different evidence model.

## Current implementation

- `jd.ts` extracts the current title, seniority, requirement categories, mandatory/preferred requirements, domain and experience. It retains an unspecified-title state rather than choosing a default technology profession. `.NET` punctuation is preserved.
- `requirement-match.ts` uses local concept normalization, controlled synonyms, action equivalents, conjunction coverage and conservative negation handling. An entire requirement must match before it counts as supported. This is an explainable local approximation, not an embedding model or independent fact verification.
- `work-evidence.ts` separates configured history from candidate confirmations and unconfirmed drafting briefs. Records include candidate identity, employer ID, source reference, status, tags, originating JD and timestamp where available. Unrelated facts remain saved but do not enter the drafting plan. Old records without a person identifier are retained for explicit association in Company Settings.
- `prompt.ts` supplies three distinct categories: immutable metadata, relevant employer evidence, and employer-specific unconfirmed briefs. It preserves every actual date and official title, uses no technology-specific prompt selection, and includes only supported metrics as facts. The model must not infer workplace experience from the JD.
- `jd-coverage.ts` reports separate terminology and verified-evidence coverage, plus title, summary, experience, depth, project, employer and qualification findings. A score is not an employer ATS score.
- `resume-review.ts` treats every unsupported imported statement as pending. Exact per-statement confirmations are reusable only for that candidate/employer and exact text. Changes require review again. Official title/date conflicts cannot be approved over configured history. Numerical outcomes require separate measured evidence.
- Step 2 accepts the existing JSON schema and another candidate's resume without rejecting it against the selected profile. Review is inside Step 2. No third step was introduced.
- Synthetic paired strings are split on import: the factual preview uses their qualitative version, and fictional examples remain in separate brainstorming state. DOCX, PDF and JSON final exports all call the same application-ready guard.
- Downloads continue using the original editor, styling, badge positioning, daily folder and filename logic. Only credentials listed in the imported resume may appear as preview badges. Company Settings distinguishes held credentials from the badge catalog through an explicit ownership confirmation.

## Verification

Run `npm test`, `npm run lint`, and `npm run build`.

`tests/universal-generation.test.ts` covers Salesforce, Java Full Stack, .NET, Python, SAP, Azure DevOps, AWS, Kafka, React, Data Engineering and Accounting. It verifies different drafting briefs, evidence isolation, missing skills, provenance, immutable metadata, overlap counting, synthetic separation and export gating.

`tests/universal-flow.e2e.mjs` exercises the production two-step flow, an independent candidate import, individual confirmations, refresh persistence, unsupported metric blocking, measured evidence confirmation, and all three download formats. Set `TEST_BASE_URL` to the test server and `RESUME_DOWNLOAD_DIR` on that server to isolate test artifacts.

Tests validate prompt construction and deterministic application behavior. They do not claim to validate a live ChatGPT response for every profession. Matching remains deliberately conservative; paraphrased or incomplete evidence may need individual review. Saved Company Settings are candidate-provided source facts, not externally authenticated employment records.

Validated: 64 unit/regression tests; clean ESLint; successful production build; independent import, original editor/export, and universal review/download browser flows. Synthetic percentages were absent from DOCX/PDF/JSON outputs, while a separately substantiated measurement passed the final JSON export test.
