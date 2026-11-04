import type { MasterResume } from "@/types/resume";

/** GC imports keep source chronology while retaining the generated role and duties. */
export function preserveEmploymentTimeline(imported: MasterResume["experience"], source: MasterResume["experience"]): MasterResume["experience"] {
  if(imported.length!==source.length) throw new Error("C2C + GC keeps all source companies. Regenerate using the current prompt and include every company.");
  const remaining=[...imported];
  return source.map(company=>{
    const index=remaining.findIndex(item=>item.company.trim().toLowerCase()===company.company.trim().toLowerCase());
    if(index<0) throw new Error(`C2C + GC requires ${company.company}. Use the current prompt with the updated company list.`);
    const [item]=remaining.splice(index,1);
    return {...item,id:company.id,company:company.company,startDate:company.startDate,endDate:company.endDate};
  });
}
