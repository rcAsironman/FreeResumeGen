const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const ts = require("typescript");
const JSZip = require("jszip");
const root = path.resolve(__dirname, "..");
function load(file) {
  const m = { exports: {} };
  const js = ts.transpile(fs.readFileSync(path.join(root, file), "utf8"), { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true });
  new Function("require", "module", "exports", js)((name) => name.startsWith("@/") ? load(name.slice(2) + ".ts") : name.endsWith(".json") ? require(path.resolve(root, path.dirname(file), name)) : require(name), m, m.exports);
  return m.exports;
}
(async () => {
  const { DEFAULT_RESUME_LAYOUT } = load("types/resume-layout.ts");
  assert.equal(DEFAULT_RESUME_LAYOUT, "fixed-resume");
  const source = JSON.parse(fs.readFileSync(path.join(root, "data/general/master-resume-general.json"), "utf8"));
  const snapshot = JSON.stringify(source);
  source.personalInfo.fullName = "QA & Candidate <test>";
  source.professionalSummary.bullets[0] = "Built C++ and .NET tools with Java 8/11/17.";
  const { createArchitectResumeDocx } = load("templates/architect-resume/docx-renderer.ts");
  const bytes = await createArchitectResumeDocx({ resume: source, technicalSkills: ["C++", ".NET", "Java 8/11/17"], selectedSections: ["professionalSummary"] });
  const output = await JSZip.loadAsync(bytes);
  const reference = await JSZip.loadAsync(fs.readFileSync(path.join(root, "templates/architect-resume/reference.docx")));
  for (const name of Object.keys(reference.files)) {
    if (name === "word/document.xml" || name === "docProps/core.xml" || reference.files[name].dir) continue;
    assert.deepEqual(await output.file(name).async("nodebuffer"), await reference.file(name).async("nodebuffer"), name);
  }
  const xml = await output.file("word/document.xml").async("string");
  assert(xml.includes("QA &amp; CANDIDATE &lt;TEST&gt;"));
  assert(!xml.includes("ADITYA KATKOJU"));
  assert(!xml.includes("adithyaaadik2510"));
  assert(xml.includes("KEY QUALIFICATIONS"));
  assert.equal((xml.match(/<w:numId w:val="2"/g) || []).length, source.professionalSummary.bullets.length - 1 + source.experience.reduce((n, e) => n + e.responsibilities.length, 0));
  assert(xml.lastIndexOf("EDUCATION") > xml.lastIndexOf("PROFESSIONAL EXPERIENCE"));
  const ids = [...xml.matchAll(/w14:paraId="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  const expectedSection = (await reference.file("word/document.xml").async("string")).match(/<w:sectPr[\s\S]*?<\/w:sectPr>/)[0].replace(/ xmlns(?::[A-Za-z0-9]+)?="[^"]*"/g, "");
  assert(xml.includes(expectedSection));
  const candidate = JSON.parse(snapshot);
  fs.writeFileSync(path.join(root, "generated/template-qa/candidate-architect.docx"), await createArchitectResumeDocx({ resume: candidate, technicalSkills: [], selectedSections: [] }));
  assert.equal(JSON.stringify(candidate), snapshot);
  console.log("Passed: original default, preserved source styles/numbering/page geometry, unique IDs, escaped content, complete bullet coverage, no reference-person leakage and unchanged candidate data.");
})().catch((error) => { console.error(error); process.exit(1); });
