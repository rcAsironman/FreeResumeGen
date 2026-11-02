const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const assert = require("node:assert/strict");
const ts = require("typescript");
const moduleUnderTest = { exports: {} };
const source = require("node:fs").readFileSync(path.join(__dirname, "../engine/export-engine/save-daily-resume.ts"), "utf8");
new Function("require", "module", "exports", ts.transpile(source, { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true }))(require, moduleUnderTest, moduleUnderTest.exports);
const { dailyResumeFolder, resumeFileStem, saveDailyResume, assertLocalResumeSave } = moduleUnderTest.exports;
(async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "resume-download-test-"));
  const now = new Date("2026-10-21T18:00:00Z");
  try {
    assert.equal(dailyResumeFolder(now), "2026-10-21_resumes");
    assert.equal(dailyResumeFolder(new Date("2026-10-22T02:00:00Z")), "2026-10-21_resumes");
    assert.equal(dailyResumeFolder(new Date("2026-10-22T05:01:00Z")), "2026-10-22_resumes");
    const expected = ["karthik_resume", "karthik-resume", "karthik_M_resume", "karthik_ma_resume", "karthik_Man_resume", "karthik_Mang_resume"];
    for (const [i, name] of expected.entries()) assert.equal(resumeFileStem("Karthik Mangineni", i), name);
    for (let i = 0; i < expected.length; i++) {
      const format = i % 2 ? "pdf" : "docx";
      const saved = await saveDailyResume(Buffer.from(`test-${i}`), "Karthik Mangineni", format, { now, downloadsRoot: root });
      assert.equal(saved.filename, `${expected[i]}.${format}`);
      assert.equal(await fs.readFile(saved.filePath, "utf8"), `test-${i}`);
    }
    const folder = path.join(root, dailyResumeFolder(now));
    await fs.writeFile(path.join(folder, "karthik_Mangi_resume.PDF"), "existing", { flag: "wx" });
    const next = await saveDailyResume(Buffer.from("next"), "Karthik Mangineni", "docx", { now, downloadsRoot: root });
    assert.equal(next.filename, "karthik_Mangin_resume.docx");
    const parallel = await Promise.all(Array.from({ length: 15 }, (_, i) => saveDailyResume(Buffer.from(String(i)), "Karthik Mangineni", i % 2 ? "pdf" : "docx", { now, downloadsRoot: root })));
    assert.equal(new Set(parallel.map((entry) => path.parse(entry.filename).name)).size, parallel.length);
    assert.equal(await fs.readFile(path.join(folder, "karthik_resume.docx"), "utf8"), "test-0");
    assert((await fs.readdir(folder)).every((name) => !name.endsWith(".reserve")));
    const tomorrow = await saveDailyResume(Buffer.from("day two"), "Karthik Mangineni", "pdf", { now: new Date("2026-10-22T18:00:00Z"), downloadsRoot: root });
    assert.equal(tomorrow.filename, "karthik_resume.pdf");
    assert.equal(tomorrow.folderName, "2026-10-22_resumes");
    for (const unsafe of ["../../outside", "C:\\evil\\name", "..."]) assert(!/[\\/]/.test(resumeFileStem(unsafe, 2)));
    assertLocalResumeSave(new Request("http://localhost:3000/api/export/docx", { headers: { origin: "http://localhost:3000" } }));
    assertLocalResumeSave(new Request("http://localhost:3000/api/export/docx", { headers: { origin: "http://127.0.0.1:3000" } }));
    assert.throws(() => assertLocalResumeSave(new Request("http://localhost:3000/api/export/docx", { headers: { origin: "https://other.example" } })));
    console.log("Passed: exact naming sequence, shared PDF/Word ordering, folder reuse, Chicago midnight rollover, existing-file protection, concurrent exports and local-request checks.");
  } finally {
    const resolved = path.resolve(root);
    assert(resolved.startsWith(path.resolve(os.tmpdir()) + path.sep) && path.basename(resolved).startsWith("resume-download-test-"));
    await fs.rm(resolved, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
  }
})().catch((error) => { console.error(error); process.exit(1); });
