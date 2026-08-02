"use client";

import { useEffect, useState } from "react";

/**
 * Thin top reading progress for long article pages.
 * Hidden when prefers-reduced-motion: reduce (position still knowable via scroll).
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setEnabled(!mq.matches);
    syncMotion();
    mq.addEventListener("change", syncMotion);

    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      mq.removeEventListener("change", syncMotion);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      className="reading-progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label="Reading progress"
    >
      <div className="reading-progress-bar" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
