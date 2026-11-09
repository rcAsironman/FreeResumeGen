/** Conservative text heuristic, not a semantic model or verification of work. */
export function responsibilityFingerprint(text: string): Set<string> {
  const normalized=text.toLowerCase()
    .replace(/\b(?:built|created|developed|implemented|delivered|engineered)\b/g,'build')
    .replace(/\b(?:optimized|tuned|improved|enhanced|refactored)\b/g,'improve')
    .replace(/\b(?:reducing|reduced|cutting|cut|lowering|lowered)\b/g,'reduce')
    .replace(/\b(?:latency|response time|execution time)\b/g,'duration')
    .replace(/\b(?:queries|query)\b/g,'query')
    .replace(/\b(?:indexes|indexing)\b/g,'index')
    .replace(/\b\d+(?:\.\d+)?\s*%?/g,'')
    .replace(/[^a-z0-9+#]+/g,' ');
  const stop=new Set(['a','an','the','and','or','for','to','of','in','on','by','with','using','through','across','from','that','this','which','as','at']);
  return new Set(normalized.split(/\s+/).filter(w=>w.length>1&&!stop.has(w)));
}

export function similarResponsibilities(a: Set<string>, b: Set<string>): boolean {
  if(Math.min(a.size,b.size)<7) return false;
  const shared=[...a].filter(w=>b.has(w)).length;
  return shared/new Set([...a,...b]).size>=0.72;
}
