"use client";

/**
 * Ink/cream MeshGradient (预算登录同款旋钮) + window pointer/click.
 * CSS dual veil in HomeContent stays for first paint and reduced-motion.
 */

import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

const INK = ["#FAFAFA", "#EDE8DF", "#171717", "#4D4D4D", "#321C1C"];
const INK_DARK = ["#1c1a16", "#2a2620", "#5c564c", "#b9a48a", "#fff8ee"];

interface HomePaperBgProps {
  className?: string;
}

function resolveDark(): boolean {
  const explicit = document.documentElement.dataset.theme;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return explicit ? explicit === "dark" : prefersDark;
}

export default function HomePaperBg({ className }: HomePaperBgProps) {
  const [reduceMotion, setReduceMotion] = useState(true);
  const [dark, setDark] = useState(false);
  const [ptr, setPtr] = useState({ x: 0.5, y: 0.5 });
  const [boost, setBoost] = useState(0);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(motionMq.matches);
    syncMotion();
    motionMq.addEventListener("change", syncMotion);

    const syncDark = () => setDark(resolveDark());
    syncDark();
    const mo = new MutationObserver(syncDark);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const darkMq = window.matchMedia("(prefers-color-scheme: dark)");
    darkMq.addEventListener("change", syncDark);

    const onMove = (e: PointerEvent) => {
      setPtr({
        x: e.clientX / Math.max(window.innerWidth, 1),
        y: e.clientY / Math.max(window.innerHeight, 1),
      });
    };
    const onClick = () => {
      setBoost(1);
      window.setTimeout(() => setBoost(0), 720);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick);

    return () => {
      motionMq.removeEventListener("change", syncMotion);
      mo.disconnect();
      darkMq.removeEventListener("change", syncDark);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  if (reduceMotion) return null;

  const swirl = 0.42 + (ptr.x - 0.5) * 0.46 + boost * 0.32;
  const distortion = 0.58 + (ptr.y - 0.5) * 0.3 + boost * 0.18;
  const speed = 0.28 + boost * 0.45;

  return (
    <MeshGradient
      className={className ? `home-paper-shader ${className}` : "home-paper-shader"}
      colors={dark ? INK_DARK : INK}
      distortion={distortion}
      swirl={swirl}
      grainMixer={0.12}
      grainOverlay={0.06}
      speed={speed}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
