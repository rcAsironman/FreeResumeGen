const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
function load(relative) {
  const file = path.join(root, relative);
  const module = { exports: {} };
  const js = ts.transpile(fs.readFileSync(file, "utf8"), { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true });
  new Function("require", "module", "exports", js)((name) => name.startsWith("@/") ? load(name.slice(2) + ".ts") : require(name), module, module.exports);
  return module.exports;
}
const dir = path.join(__dirname, "fixtures/kafka-developer-ofallon");
const read = (name) => JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));
const source = read("source-fictional.json");
const initial = read("resume-initial-review-sample.json");
const refined = read("resume-refined.json");
const { masterResumeSchema } = load("engine/validation/resume.schema.ts");
for (const resume of [source, initial, refined]) masterResumeSchema.parse(resume);
assert.equal(refined.personalInfo.professionalTitle, "Kafka Developer");
assert.equal(refined.professionalSummary.bullets.length, source.professionalSummary.bullets.length);
refined.experience.forEach((entry, i) => {
  for (const key of ["id", "company", "role", "location", "startDate", "endDate"]) assert.equal(entry[key], source.experience[i][key]);
  assert.equal(entry.responsibilities.length, source.experience[i].responsibilities.length);
});
assert.equal(refined.experience.at(-1).startDate, "Jul 2011");
assert.equal(refined.experience[1].startDate, "Jul 2020");
assert(refined.experience[1].environment.includes("Apache Kafka"));
assert(!refined.experience[1].environment.some((x) => /Confluent/.test(x)));
assert(refined.experience[0].environment.includes("Confluent Platform"));
assert(!JSON.stringify(refined).includes("linkedIn"));
const checks = [
  ["JD title", (r) => r.personalInfo.professionalTitle === "Kafka Developer"],
  ["Ansible with scripting and CI/CD", (r) => /Ansible/.test(r.experience[0].responsibilities.join(" ")) && /Python|Shell/.test(r.experience[0].responsibilities.join(" ")) && /CI\/CD/.test(r.experience[0].responsibilities.join(" "))],
  ["Java platform tooling with debugging", (r) => r.experience[0].responsibilities.some((b) => /Java/.test(b) && /debug/i.test(b) && /tool/i.test(b))],
  ["SRE and operational readiness", (r) => /SRE/.test(r.experience[0].responsibilities.join(" ")) && /operational.readiness/i.test(r.experience[0].responsibilities.join(" "))],
  ["Incident response and RCA", (r) => /incident/i.test(r.experience[0].responsibilities.join(" ")) && /root causes|root.cause/i.test(r.experience[0].responsibilities.join(" "))],
  ["Capacity and Kafka architecture", (r) => /capacity planning/i.test(r.experience[0].responsibilities.join(" ")) && /partition|replication/.test(r.experience[0].responsibilities.join(" "))],
  ["Linux monitoring and alerting", (r) => /Linux/.test(r.experience[0].responsibilities.join(" ")) && /Prometheus|Grafana/.test(r.experience[0].responsibilities.join(" ")) && /alert/.test(r.experience[0].responsibilities.join(" "))],
  ["Application/platform collaboration", (r) => /application and platform engineers/i.test(r.experience[0].responsibilities.join(" "))],
];
for (const [name, check] of checks) {
  console.log(`${name}: initial=${check(initial)}, refined=${check(refined)}`);
  assert(check(refined), name);
}
assert(checks.filter(([, c]) => c(refined)).length > checks.filter(([, c]) => c(initial)).length);
const actual = JSON.parse(fs.readFileSync(path.join(root, "data/kafka/master-resume-kafka.json"), "utf8"));
assert(!/ansible/i.test(JSON.stringify(actual)), "Do not add test Ansible claims to actual source");
const { kafkaGenerationPrompt } = load("prompts/kafka-resume.ts");
const prompt = kafkaGenerationPrompt(fs.readFileSync(path.join(dir, "job-description.txt"), "utf8"), { targetRole: "Kafka Developer", allTechnicalSkills: ["Kafka", "Ansible", "Java", "SRE"] }, actual, ["professionalSummary", "experience"]);
const embedded = JSON.parse(prompt.split("KAFKA MASTER RESUME (only candidate source of truth):\n")[1]);
embedded.experience.forEach((entry, i) => { const { environment, ...facts } = entry; const { environment: originalEnvironment, ...originalFacts } = actual.experience[i]; assert.deepEqual(facts, originalFacts); assert(environment.every((skill) => originalEnvironment.includes(skill))); });
assert(!/ansible/i.test(JSON.stringify(embedded)));
assert(!JSON.stringify(embedded).includes("Fictional"));
console.log("Passed: synthetic review improves demonstrated JD coverage; actual candidate history remains isolated. This is not a hiring or ATS score.");
