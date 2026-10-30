import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { dailyResumeFolder, resumeFileStem, saveDailyResume, assertLocalResumeSave } from "@/lib/save-daily-resume";

test("original daily naming is shared across DOCX, PDF and JSON without overwrites", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "resume-v2-download-test-"));
  try {
    const now = new Date("2026-10-29T18:00:00Z");
    assert.equal(dailyResumeFolder(new Date("2026-10-30T02:00:00Z")), "2026-10-29_resumes");
    const expected = ["karthik_resume", "karthik-resume", "karthik_M_resume", "karthik_ma_resume", "karthik_Man_resume"];
    for (let i = 0; i < expected.length; i++) {
      assert.equal(resumeFileStem("Karthik Mangineni", i), expected[i]);
      const format = (["docx", "pdf", "json"] as const)[i % 3];
      const saved = await saveDailyResume(Buffer.from(String(i)), "Karthik Mangineni", format, { now, downloadsRoot: directory });
      assert.equal(saved.filename, `${expected[i]}.${format}`);
      assert.equal(await readFile(saved.filePath, "utf8"), String(i));
    }
    const parallel = await Promise.all(Array.from({ length: 5 }, () => saveDailyResume(Buffer.from("test"), "Karthik Mangineni", "pdf", { now, downloadsRoot: directory })));
    assert.equal(new Set(parallel.map((saved) => saved.filename)).size, 5);
    assert.equal((await readdir(path.join(directory, dailyResumeFolder(now)))).filter((name) => name.endsWith(".reserve")).length, 0);
    const tomorrow = await saveDailyResume(Buffer.from("next"), "Karthik Mangineni", "docx", { now: new Date("2026-10-30T18:00:00Z"), downloadsRoot: directory });
    assert.equal(tomorrow.filename, "karthik_resume.docx");
    assertLocalResumeSave(new Request("http://127.0.0.1:3000/api/save-resume", { headers: { origin: "http://localhost:3000" } }));
    assert.throws(() => assertLocalResumeSave(new Request("http://127.0.0.1:3000/api/save-resume", { headers: { origin: "https://example.com" } })));
  } finally {
    assert(path.resolve(directory).startsWith(path.resolve(os.tmpdir()) + path.sep));
    assert(path.basename(directory).startsWith("resume-v2-download-test-"));
    await rm(directory, { recursive: true, force: true });
  }
});
