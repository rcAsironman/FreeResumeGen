/** Local, explainable concept matching. No remote model or keyword-as-proof shortcut. */
const aliases: [RegExp, string][] = [
  [/\bpostgres(?:ql)?\b/gi, "postgresql"], [/\bdot[ -]?net\b|\.net\b/gi, "dotnet"],
  [/c#/gi, "csharp"], [/c\+\+/gi, "cplusplus"], [/\bk8s\b/gi, "kubernetes"],
  [/\bamazon web services\b/gi, "aws"], [/\bgoogle cloud(?: platform)?\b/gi, "gcp"],
  [/\bci\s*\/\s*cd\b|\bcontinuous integration(?: and continuous delivery)?\b/gi, "cicd"],
  [/\b(restful|rest)\b/gi, "rest"], [/\blightning web components?\b/gi, "lwc"],
  [/\breact(?:\.js)?\b/gi, "react"], [/\bnode\.js\b/gi, "nodejs"],
  [/\b(developed?|developing|built|build(?:ing)?|implemented?|implementing|created?|creating)\b/gi, "implementation"],
  [/\b(tested?|testing|tests|test)\b/gi, "testing"],
  [/\b(debug(?:ged|ging)?|troubleshoot(?:ing)?|troubleshot|diagnosed?)\b/gi, "diagnosis"],
  [/\b(deploy(?:ed|ing|ment|ments)?|released?|releases)\b/gi, "deployment"],
  [/\b(administer(?:ed|ing)?|administration|operated?|operating)\b/gi, "administration"],
  [/\b(optimi[sz](?:e|ed|ation|ing)|tuned?|tuning)\b/gi, "optimization"],
];
const stop = new Set("a an the and or for to of in on at by with from using used use have has must should will required preferred mandatory experience experienced hands hands-on years year strong proven solid ability knowledge understanding proficiency proficient minimum relevant work working worked senior junior lead engineer developer consultant specialist software skills skill applications application systems system including support supporting supported team teams responsibilities responsibility qualification qualifications framework frameworks language languages platform platforms tools tool processes process core requirements requirement design principles good excellent communication candidates candidate".split(" "));
export function concepts(text: string): string[] {
  let value = text.toLowerCase();
  for (const [pattern, replacement] of aliases) value = value.replace(pattern, replacement);
  return [...new Set(value.match(/[a-z][a-z0-9]+/g) ?? [])].filter(word => !stop.has(word));
}
export function matchRequirement(requirement: string, evidence: string) {
  const needed = concepts(requirement), present = new Set(concepts(evidence));
  const matched = needed.filter(term => present.has(term));
  const missing = needed.filter(term => !present.has(term));
  const score = needed.length ? matched.length / needed.length : 0;
  // One overlapping generic action never establishes a multi-concept requirement.
  const negated = /\b(no|not|never|without|lack(?:s|ing)?)\b/i.test(evidence);
  return { score: negated ? 0 : score, matched: negated ? [] : matched, missing: negated ? needed : missing, supported: !negated && needed.length > 0 && missing.length === 0 };
}
