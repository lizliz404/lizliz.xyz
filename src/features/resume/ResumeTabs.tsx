"use client";

import { useMemo, useRef, useState } from "react";
import type { ResumeData } from "./types";
import ResumeEditor from "./ResumeEditor";
import ResumeJsonViewer from "./ResumeJsonViewer";
import ResumeToolbar from "./ResumeToolbar";
import RenderedResume from "./RenderedResume";

type View = "resume" | "json" | "editor";

const CLICK_WINDOW = 2000;

export default function ResumeTabs({ initialResume, initialJson }: { initialResume: ResumeData; initialJson: string }) {
  const [resume, setResume] = useState(initialResume);
  const [view, setView] = useState<View>("resume");
  const [isFlipped, setIsFlipped] = useState(false);
  const clicksRef = useRef<number[]>([]);
  const json = useMemo(() => JSON.stringify(resume, null, 2), [resume]);

  function showResume() {
    setView("resume");
    setIsFlipped(false);
  }

  function handleCardTap() {
    const now = Date.now();
    clicksRef.current = [...clicksRef.current, now].filter((time) => now - time <= CLICK_WINDOW);

    if (clicksRef.current.length >= 3) {
      clicksRef.current = [];
      setView("editor");
      setIsFlipped(false);
      return;
    }

    if (clicksRef.current.length === 1) {
      setIsFlipped((current) => !current);
    }
  }

  return (
    <main className="resume-shell">
      <ResumeToolbar view={view} isFlipped={isFlipped} />

      {view === "editor" ? (
        <div className="resume-editor-wrapper">
          <button type="button" onClick={showResume} className="resume-print-button" style={{ marginBottom: "1rem" }}>
            ← Back to resume
          </button>
          <ResumeEditor json={initialJson} onSaved={setResume} />
        </div>
      ) : (
        <div className="resume-card" onClick={handleCardTap} role="button" tabIndex={0} aria-label={isFlipped ? "JSON view — tap to flip" : "Resume — tap to flip"}>
          <div className={`resume-card-inner ${isFlipped ? "flipped" : ""}`}>
            <div className="resume-card-front">
              <RenderedResume resume={resume} />
            </div>
            <div className="resume-card-back">
              <ResumeJsonViewer json={json} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
