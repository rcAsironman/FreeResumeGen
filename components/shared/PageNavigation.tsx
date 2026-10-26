import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export function PageNavigation({ backHref = "/" }: { backHref?: string }) {
  const buttonClass = "inline-flex items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 font-semibold text-[var(--app-accent)] hover:bg-[var(--app-accent-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-accent)]";

  return <nav aria-label="Page navigation" className="mx-auto flex w-full max-w-7xl flex-wrap gap-2 px-4 pt-4 sm:px-6 print:hidden">
    <Link href={backHref} className={buttonClass}><ArrowLeft size={17} aria-hidden="true"/> Back</Link>
    <Link href="/" className={buttonClass}><Home size={17} aria-hidden="true"/> Home</Link>
  </nav>;
}
