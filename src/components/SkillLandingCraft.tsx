"use client";

import { useEffect } from "react";
import { initPremiumOnePager } from "@/lib/premium-one-pager";
import "@/styles/premium-one-pager.css";

/**
 * Light 附 A craft for short skill landings:
 * progress + one-shot reveal + noise. Chapters off (page too short).
 * Hero stays static — only `.pop-reveal` below the fold animates.
 */
export default function SkillLandingCraft() {
  useEffect(() => {
    const teardown = initPremiumOnePager({
      enableChapters: false,
      enableProgress: true,
      enableReveal: true,
      enableNoise: true,
      revealSelector: ".skill-landing .pop-reveal",
    });

    return () => {
      teardown();
      // Pack mounts fixed chrome on body — remove when leaving skills routes
      document.getElementById("pop-progress")?.remove();
      document.querySelector(".pop-noise")?.remove();
      document.getElementById("pop-chapters")?.remove();
    };
  }, []);

  return null;
}
