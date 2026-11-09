"use client";
import {useState} from 'react';
import {PROPOSED_METRIC_STATUS,type MetricReviewRecord,type VerifiedMetric} from '@/engine/resume-review/metric-review';

export function MetricReviewPanel({records,onVerify}:{records:MetricReviewRecord[];onVerify:(value:VerifiedMetric)=>void}) {
 const [evidence,setEvidence]=useState<Record<string,string>>({});
 const proposed=records.filter(r=>r.status===PROPOSED_METRIC_STATUS);
 return <section className="mt-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4" aria-label="Metric review">
  <h2 className="font-bold">Quantified achievement review</h2>
  <p className="text-sm">{proposed.length} proposed values · {records.length-proposed.length} candidate-verified values. Suggestions are generated automatically. Confirming dates or the document does not verify these numbers.</p>
  <p className="mt-2 text-sm">Draft PDF/DOCX files carry a visible review label. Submission exports omit unsupported numerical statements. JSON downloads always use the submission version.</p>
  <details className="mt-3"><summary className="cursor-pointer">Review proposed values and supporting evidence</summary>
   {records.map((r,i)=>{const key=r.employerId+'|'+r.responsibility;return <article key={i} className="my-3 rounded-lg border border-[var(--app-border)] p-3">
    <strong>{r.employer}: {r.estimatedValue} {r.unit}</strong><p className="text-xs font-semibold">{r.status}</p><p className="my-2 text-sm">{r.responsibility}</p>
    {r.status===PROPOSED_METRIC_STATUS?<><p className="text-sm">{r.verificationQuestion}</p><textarea aria-label={`Supporting evidence ${i+1}`} className="mt-2 w-full rounded border p-2 text-sm" placeholder="Optional for drafting. Required only to confirm this specific claim: record, timeframe, measurement or basis of your own evidence-based estimate." value={evidence[key]??''} onChange={e=>setEvidence(old=>({...old,[key]:e.target.value}))}/><button className="mt-2 rounded bg-[var(--app-primary)] px-3 py-2 text-sm text-white disabled:opacity-40" disabled={(evidence[key]??'').trim().length<12} onClick={()=>onVerify({employerId:r.employerId,text:r.responsibility,evidence:evidence[key].trim(),confirmed:true})}>I confirm this claim is supported by this evidence</button></>:<p className="text-sm">Candidate-provided basis: {r.evidence}</p>}
   </article>;})}
   {!records.length&&<p>No numerical outcome claims were detected. Qualitative achievements remain valid.</p>}
  </details>
 </section>;
}
