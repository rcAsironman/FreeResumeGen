import { loadMasterResume } from "@/engine/resume-generator/resume-loader";
import { FixedResumeTemplate } from "@/templates/fixed-resume/FixedResumeTemplate";

export const dynamic = "force-dynamic";

export default async function PreviewPage() {
  const resume = await loadMasterResume();

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px",
        background: "#e5e7eb",
        overflowX: "auto",
      }}
    >
      <FixedResumeTemplate resume={resume} />
    </main>
  );
}