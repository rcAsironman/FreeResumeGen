import { loadMasterResume } from "@/engine/resume-generator/resume-loader";
import { FixedResumeTemplate } from "@/templates/fixed-resume/FixedResumeTemplate";

import { PageNavigation } from "@/components/shared/PageNavigation";

export const dynamic = "force-dynamic";

export default async function PreviewPage() {
  const resume = await loadMasterResume();

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px",
        background: "var(--background)",
        overflowX: "auto",
      }}
    >
      <div className="mb-6"><PageNavigation backHref="/editor" /></div>
      <FixedResumeTemplate resume={resume} />
    </main>
  );
}