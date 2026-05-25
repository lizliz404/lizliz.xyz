import Link from "next/link";

type ToolbarView = "resume" | "json" | "editor";

function statusText(view: ToolbarView, isFlipped: boolean) {
  if (view === "editor") return "Editor mode";
  if (isFlipped) return "JSON — tap to flip back";
  return "Tap card to flip · triple-tap for editor";
}

export default function ResumeToolbar({ view, isFlipped }: { view: ToolbarView; isFlipped: boolean }) {
  return (
    <div className="resume-toolbar print:hidden">
      <Link href="/" className="resume-back-link">← Home</Link>
      <span className="text-xs" style={{ color: "var(--fg-secondary)", opacity: 0.5 }}>
        {statusText(view, isFlipped)}
      </span>
      <a className="resume-print-button" href="/resume.pdf">
        Save PDF
      </a>
    </div>
  );
}
