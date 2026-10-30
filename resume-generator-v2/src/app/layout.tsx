import "./original-resume.css";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Studio | JD-first resume builder",
  description: "Create evidence-based, job-targeted resumes with a manual ChatGPT workflow.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
