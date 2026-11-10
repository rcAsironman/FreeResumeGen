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

export const MAX_EMPLOYER_OVERLAP = 0.2;
export interface EmployerOverlap {left:string;right:string;leftPercent:number;rightPercent:number;matched:number;exceedsTarget:boolean}
/** Percentage of near-duplicate responsibility bullets, not shared technology
 * vocabulary. One-to-one matching prevents one bullet inflating the numerator. */
export function employerResponsibilityOverlap(experience:Array<{company:string;responsibilities:string[]}>):EmployerOverlap[] {
 const result:EmployerOverlap[]=[];
 for(let i=0;i<experience.length;i++)for(let j=i+1;j<experience.length;j++){
  const left=experience[i],right=experience[j];
  const a=left.responsibilities.filter(t=>t.trim()).map(responsibilityFingerprint);
  const b=right.responsibilities.filter(t=>t.trim()).map(responsibilityFingerprint);
  if(!a.length||!b.length)continue;
  const matchedRight=new Map<number,number>();
  const match=(x:number,seen:Set<number>):boolean=>{
   for(let y=0;y<b.length;y++){
    if(seen.has(y)||!similarResponsibilities(a[x],b[y]))continue;
    seen.add(y);const previous=matchedRight.get(y);
    if(previous===undefined||match(previous,seen)){matchedRight.set(y,x);return true;}
   }
   return false;
  };
  a.forEach((_,x)=>match(x,new Set()));
  const matched=matchedRight.size;
  result.push({left:left.company,right:right.company,matched,leftPercent:Math.round(matched/a.length*100),rightPercent:Math.round(matched/b.length*100),exceedsTarget:matched/a.length>MAX_EMPLOYER_OVERLAP||matched/b.length>MAX_EMPLOYER_OVERLAP});
 }
 return result;
}
