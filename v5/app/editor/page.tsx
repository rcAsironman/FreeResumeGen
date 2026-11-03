import { FileResumeEditor } from "@/components/builder/FileResumeEditor";

import { PageNavigation } from "@/components/shared/PageNavigation";

export default function EditorPage() {
  return <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]"><PageNavigation /><FileResumeEditor /></main>;
}
