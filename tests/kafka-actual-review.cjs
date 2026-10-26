const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
function load(file) {
  const m = { exports: {} };
  new Function("require", "module", "exports", ts.transpile(fs.readFileSync(path.join(root, file), "utf8"), { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true }))((name) => name.startsWith("@/") ? load(name.slice(2) + ".ts") : require(name), m, m.exports);
  return m.exports;
}
const dir = path.join(root, "generated/reviews/kafka-developer-2026-10-15");
const read = (file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
const manifest = read("manifest.json");
const source = read("source-snapshot.json");
const final = read("resume-final.json");
const currentBytes = fs.readFileSync(path.join(root, manifest.source));
assert.equal(crypto.createHash("sha256").update(currentBytes).digest("hex"), manifest.sourceSha256, "Personal source must remain unchanged");
const { masterResumeSchema } = load("engine/validation/resume.schema.ts");
for (const file of manifest.rounds) {
  const resume = read(file);
  masterResumeSchema.parse(resume);
  assert.deepEqual(Object.keys(resume), Object.keys(source));
  assert.equal(resume.experience.length, source.experience.length);
  for (const key of ["fullName", "email", "phone", "location"]) assert.equal(resume.personalInfo[key], source.personalInfo[key]);
  for (const key of ["education", "certifications", "projects"]) assert.deepEqual(resume[key], source[key]);
  resume.experience.forEach((entry, i) => {
    for (const key of ["id", "company", "role", "location", "startDate", "endDate"]) assert.equal(entry[key], source.experience[i][key]);
  });
  assert(!/Ansible|Fictional|15\+ years|onsite availability|Kafka Java tools/i.test(JSON.stringify(resume)));
}
assert.equal(final.personalInfo.professionalTitle, "Kafka Developer");
assert(final.professionalSummary.bullets.length >= 12 && final.professionalSummary.bullets.length <= 14);
assert(final.experience[0].responsibilities.length >= 18 && final.experience[0].responsibilities.length <= 22);
assert(final.experience.slice(1, 3).every((e) => e.responsibilities.length >= 10 && e.responsibilities.length <= 14));
assert(final.experience.slice(3).every((e) => e.responsibilities.length >= 8 && e.responsibilities.length <= 10));
assert(!/React|Angular|Hibernate|Spring MVC/.test(JSON.stringify(final)));
assert(!/\d+(?:\.\d+)?%/.test(JSON.stringify(final)), "Do not introduce numerical performance claims");
const recent = final.experience[0].responsibilities.join(" ");
for (const term of [/Python/, /capacity planning/i, /root causes|root cause analysis/i, /Azure DevOps/, /Confluent Cloud/, /Confluent Platform/, /production.readiness/i, /Linux/]) assert(term.test(recent), String(term));
assert(!/Kafka/.test(final.experience.at(-1).responsibilities.join(" ")), "Do not recast early Java work as Kafka work");
assert(/Java/.test(final.experience.at(-1).responsibilities.join(" ")) && /debug/i.test(final.experience.at(-1).responsibilities.join(" ")), "Preserve actual older Java background");
const prompt = load("prompts/kafka-resume.ts").kafkaGenerationPrompt(fs.readFileSync(path.join(dir, "job-description.txt"), "utf8"), { targetRole: "Kafka Developer", allTechnicalSkills: ["Kafka", "Java", "Ansible", "Linux"] }, source, ["experience"]);
const embedded = JSON.parse(prompt.split("KAFKA MASTER RESUME (only candidate source of truth):\n")[1]);
embedded.experience.forEach((entry, i) => { const { environment, ...facts } = entry; const { environment: originalEnvironment, ...originalFacts } = source.experience[i]; assert.deepEqual(facts, originalFacts); assert(environment.every((skill) => originalEnvironment.includes(skill))); });
console.log("Passed: three rounds parse, immutable facts retained, detailed final, JD-supported evidence, no test-history contamination, and personal source unchanged.");
