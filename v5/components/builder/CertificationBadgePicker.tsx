"use client";

import { useState } from "react";
import Image from "next/image";
import { CERTIFICATION_BADGES, CERTIFICATION_BADGE_CATEGORIES, type CertificationBadgeId } from "@/engine/certification-badges";

export function CertificationBadgePicker({selected,onChange}:{selected:CertificationBadgeId[];onChange:(ids:CertificationBadgeId[])=>void}) {
  const [categoryId,setCategoryId]=useState("all");
  const category=CERTIFICATION_BADGE_CATEGORIES.find(c=>c.id===categoryId)!;
  const badges=CERTIFICATION_BADGES.filter(b=>category.badges.includes(b.id));
  return <fieldset className="w-full rounded-xl border border-[var(--app-border)] p-3">
    <legend className="px-1 text-sm font-semibold text-[var(--app-muted)]">Select certifications you hold · {selected.length} selected</legend>
    <div role="group" aria-label="Certification categories" className="mb-3 flex flex-wrap gap-2">
      {CERTIFICATION_BADGE_CATEGORIES.map(c=><button type="button" key={c.id} aria-pressed={categoryId===c.id} onClick={()=>setCategoryId(c.id)} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${categoryId===c.id?"border-[var(--app-primary)] bg-[var(--app-primary)] text-white":"border-[var(--app-border)] text-[var(--foreground)]"}`}>{c.label} ({c.badges.length})</button>)}
    </div>
    {category.description&&<p className="mb-3 text-xs text-[var(--app-muted)]">{category.description}</p>}
    <div className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
      {badges.map(b=><label key={b.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--app-border)] p-3 text-xs text-[var(--foreground)]">
        <input type="checkbox" checked={selected.includes(b.id)} onChange={e=>onChange(e.target.checked?[...new Set([...selected,b.id])]:selected.filter(id=>id!==b.id))}/>
        <Image src={`/certification-badges/${b.image}`} alt="" width={48} height={48} className="h-12 w-12 shrink-0 object-contain" unoptimized/>
        <span>{b.label}</span>
      </label>)}
    </div>
    <p className="mt-3 text-xs text-[var(--app-muted)]">Changing categories keeps your selections. Only selected badges appear on your resume.</p>
  </fieldset>;
}
