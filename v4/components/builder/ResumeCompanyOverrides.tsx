"use client";
import {useState} from 'react';
import type {MasterResume} from '@/types/resume';
import {withResumeCompanies,type ResumeCompanyEdit} from '@/engine/resume-review/resume-company-overrides';

export function ResumeCompanyOverrides({source,active,onApply,onReset}:{source:MasterResume;active:ResumeCompanyEdit[]|null;onApply:(edits:ResumeCompanyEdit[])=>void;onReset:()=>void}) {
 const [rows,setRows]=useState<ResumeCompanyEdit[]>(()=>active??source.experience.map(({id,company,location})=>({id,company,location})));
 const [error,setError]=useState('');
 return <details className="mt-4 rounded-xl border border-[var(--app-border)] p-4">
  <summary className="cursor-pointer font-semibold">Update companies for this resume{active?' · temporary changes active':''}</summary>
  <p className="my-3 text-sm">Change company names and locations for this resume only. Saved company settings stay unchanged. Dates follow your selected experience and GC/CPT rules. These edits stay in this tab until you reset them or switch profiles.</p>
  {rows.map((row,i)=><div key={row.id} className="mb-3 grid gap-3 sm:grid-cols-2">
   <label className="text-sm">Company {i+1}<input aria-label={`Resume company ${i+1}`} value={row.company} onChange={e=>{setError('');setRows(old=>old.map((r,j)=>i===j?{...r,company:e.target.value}:r));}} className="mt-1 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-input)] p-2"/></label>
   <label className="text-sm">Location<input aria-label={`Resume company location ${i+1}`} value={row.location} onChange={e=>setRows(old=>old.map((r,j)=>i===j?{...r,location:e.target.value}:r))} className="mt-1 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-input)] p-2"/></label>
  </div>)}
  {error&&<p role="alert" className="my-2 text-red-400">{error}</p>}
  <div className="flex flex-wrap gap-3"><button type="button" onClick={()=>{try{withResumeCompanies(source,rows);onApply(rows.map(r=>({...r,company:r.company.trim(),location:r.location.trim()})));setError('');}catch(e){setError(e instanceof Error?e.message:'Invalid company details');}}} className="rounded-lg bg-[var(--app-primary)] px-4 py-2 font-semibold text-white">Use these companies for this resume</button><button type="button" onClick={()=>{setRows(source.experience.map(({id,company,location})=>({id,company,location})));setError('');onReset();}} className="rounded-lg border border-[var(--app-border)] px-4 py-2">Use saved companies</button></div>
  <p className="mt-2 text-xs text-[var(--app-muted)]">After applying, generate a fresh prompt. Replacing a company does not transfer the previous employer’s projects or measurements.</p>
 </details>;
}
