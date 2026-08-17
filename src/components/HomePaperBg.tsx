"use client";

/**
 * Ink/cream MeshGradient (预算登录同款旋钮) + window pointer/click.
 * Mesh keeps its own roll (speed). Pointer/click only lerp offset.
 * CSS dual veil in HomeContent stays for first paint and reduced-motion.
 */

import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useRef, useState } from "react";

const INK = ["#FAFAFA", "#EDE8DF", "#171717", "#4D4D4D", "#321C1C"];
const INK_DARK = ["#1c1a16", "#2a2620", "#5c564c", "#b9a48a", "#fff8ee"];

const BASE_SPEED = 0.36;
const BASE_SWIRL = 0.42;
const BASE_DISTORTION = 0.58;

/** Current → target ease per rAF frame (pointer + boost). */
const LERP = 0.08;
/** Per-frame exponential decay of click target (~e-fold in 22 frames). */
const BOOST_DECAY = 0.045;

/** Pointer / click only lerp offset — swirl/distortion stay at login defaults. */
const PTR_OFFSET_AMP = 0.1;
const BOOST_OFFSET_AMP = 0.06;

const KNOB_EPS = 1e-4;

interface HomePaperBgProps {
  className?: string;
}

function resolveDark(): boolean {
  const explicit = document.documentElement.dataset.theme;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return explicit ? explicit === "dark" : prefersDark;
}

function readPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readDark(): boolean {
  if (typeof window === "undefined") return false;
  return resolveDark();
}

function readHidden(): boolean {
  if (typeof document === "undefined") return false;
  return document.visibilityState === "hidden";
}

function readPageVisible(): boolean {
  if (typeof document === "undefined") return true;
  return !document.hidden;
}

export default function HomePaperBg({ className }: HomePaperBgProps) {
  // ssr:false home import — read window now so the mesh can roll on first paint
  // instead of waiting a useEffect cycle behind a reduceMotion=true stub.
  const [reduceMotion, setReduceMotion] = useState(readPrefersReducedMotion);
  const [pageVisible, setPageVisible] = useState(readPageVisible);
  const [dark, setDark] = useState(readDark);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const targetPtr = useRef({ x: 0.5, y: 0.5 });
  const currentPtr = useRef({ x: 0.5, y: 0.5 });
  const targetBoost = useRef(0);
  const currentBoost = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const syncVisibility = () => {
      setHidden(document.visibilityState === "hidden");
    };
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);

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

    const syncVisible = () => {
      const hidden = document.hidden;
      setPageVisible(!hidden);
      document.documentElement.toggleAttribute("data-page-hidden", hidden);
    };
    syncVisible();
    document.addEventListener("visibilitychange", syncVisible);

    return () => {
      motionMq.removeEventListener("change", syncMotion);
      mo.disconnect();
      darkMq.removeEventListener("change", syncDark);
      document.removeEventListener("visibilitychange", syncVisible);
      document.documentElement.removeAttribute("data-page-hidden");
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const onMove = (e: PointerEvent) => {
      targetPtr.current = {
        x: e.clientX / Math.max(window.innerWidth, 1),
        y: e.clientY / Math.max(window.innerHeight, 1),
      };
      startTick();
    };
    const onClick = () => {
      targetBoost.current = 1;
      startTick();
    };

    function tick() {
      if (document.hidden) {
        rafRef.current = 0;
        return;
      }

      const ptr = currentPtr.current;
      const tPtr = targetPtr.current;
      ptr.x += (tPtr.x - ptr.x) * LERP;
      ptr.y += (tPtr.y - ptr.y) * LERP;

      targetBoost.current *= 1 - BOOST_DECAY;
      if (targetBoost.current < KNOB_EPS) targetBoost.current = 0;
      currentBoost.current += (targetBoost.current - currentBoost.current) * LERP;
      if (currentBoost.current < KNOB_EPS && targetBoost.current === 0) {
        currentBoost.current = 0;
      }

      const x = (ptr.x - 0.5) * PTR_OFFSET_AMP + currentBoost.current * BOOST_OFFSET_AMP;
      const y = (ptr.y - 0.5) * PTR_OFFSET_AMP + currentBoost.current * BOOST_OFFSET_AMP;

      setOffset((prev) => {
        if (Math.abs(prev.x - x) < KNOB_EPS && Math.abs(prev.y - y) < KNOB_EPS) {
          return prev;
        }
        return { x, y };
      });

      // Pointer/click only lerp offset — once current catches target, stop the loop.
      // Autonomous roll is MeshGradient speed (0.36 visible, 0 hidden), not this rAF.
      const settled =
        Math.abs(ptr.x - tPtr.x) < KNOB_EPS &&
        Math.abs(ptr.y - tPtr.y) < KNOB_EPS &&
        targetBoost.current === 0 &&
        currentBoost.current === 0;
      if (settled) {
        rafRef.current = 0;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    function startTick() {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
        return;
      }
      startTick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <MeshGradient
      className={className ? `home-paper-shader ${className}` : "home-paper-shader"}
      colors={dark ? INK_DARK : INK}
      distortion={BASE_DISTORTION}
      swirl={BASE_SWIRL}
      offsetX={offset.x}
      offsetY={offset.y}
      grainMixer={0.12}
      grainOverlay={0.06}
      speed={pageVisible ? BASE_SPEED : 0}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
