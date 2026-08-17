"use client";

import { useT } from "@/i18n";
import type { MouseEvent } from "react";

export default function SkipLink() {
  const t = useT();

  function onSkip(e: MouseEvent<HTMLAnchorElement>) {
    const el = document.getElementById("main-content");
    if (!el) return;
    e.preventDefault();
    el.focus({ preventScroll: true });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", "#main-content");
  }

  return (
    <a href="#main-content" className="skip-link" onClick={onSkip}>
      {t["a11y.skip_to_content"]}
    </a>
  );
}
