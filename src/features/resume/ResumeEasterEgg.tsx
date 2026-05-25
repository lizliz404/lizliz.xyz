"use client";

import { useRef } from "react";

const CLICK_WINDOW_MS = 2000;
const REQUIRED_CLICKS = 3;

export default function ResumeEasterEgg({ children }: { children: React.ReactNode }) {
  const clicksRef = useRef<number[]>([]);

  function handleClick() {
    const now = Date.now();
    clicksRef.current = [...clicksRef.current, now].filter((time) => now - time <= CLICK_WINDOW_MS);

    if (clicksRef.current.length === REQUIRED_CLICKS) {
      clicksRef.current = [];
      window.location.assign("/resume.pdf");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="cursor-default text-left select-none"
      aria-label="Hidden resume trigger"
      title=""
      style={{ color: "inherit" }}
    >
      {children}
    </button>
  );
}
