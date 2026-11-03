/** Clean posting decorations without guessing a different profession or seniority. */
export function cleanRoleTitle(input: string): string {
  let title=input.split(/\r?\n/)[0].replace(/\*\*/g, "").replace(/^\s*#+\s+/, "").trim()
    .replace(/^[^\p{L}\p{N}.+#]+/u, "")
    .replace(/^(?:(?:urgent(?:ly)?(?: hiring)?|we['’]?re hiring|hiring|job description|job title|role|position|title)\s*[:!–—-]?\s*)+/i, "")
    .replace(/\bdot\s*net\b|\.net\b/gi, ".NET")
    .replace(/\bfull[ -]stack\b/gi, "Full-Stack");
  // Technology qualifiers belong in skills. Preserve prefixes such as Java or .NET.
  const core=title.match(/^(.+?\b(?:engineer|developer|architect|administrator|analyst|consultant|designer|manager|scientist|specialist|lead|officer)\b(?:\s+(?:[1-5]|IV|I{1,3}))?)(?=\s*(?:$|with\b|w\/|[|,–—(]|-\s))(.*)$/i);
  if(core && /^\s*(?:with\b|w\/|[|,–—]|-\s|\()/i.test(core[2])) title=core[1];
  title=title.replace(/\s+(?:remote|on[- ]?site|hybrid|contract(?:or)?|full[- ]time|USC|GC|W2|C2C|locals? only)\b.*$/i, "")
    .replace(/\s+(?:location|visa|duration|job id)\s*:.*$/i, "")
    .replace(/\s+/g," ").replace(/[\s:|,–—-]+$/, "").trim();
  return title;
}
