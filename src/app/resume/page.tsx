import type { Metadata } from "next";
import ResumeTabs from "@/features/resume/ResumeTabs";
import { resumeData, resumeJson } from "@/features/resume/data";

export const metadata: Metadata = {
  title: "Resume | Liz",
  description: "A structured, printable, Git-backed resume for Liz.",
};

export default function ResumePage() {
  return <ResumeTabs initialResume={resumeData} initialJson={resumeJson} />;
}
