"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useT } from "@/i18n";

export type MotionEnergyTier = "static" | "low" | "full";

type MotionPolicyValue = {
  reduced: boolean;
  pageVisible: boolean;
  userPaused: boolean;
  energyTier: MotionEnergyTier;
  pause: () => void;
  resume: () => void;
};

const MotionPolicyContext = createContext<MotionPolicyValue | null>(null);

export function MotionPolicyProvider({ children }: { children: ReactNode }) {
  // Static on the server and first client render; enhancement starts only after
  // the real media query and page visibility are known.
  const [reduced, setReduced] = useState(true);
  const [pageVisible, setPageVisible] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduced = () => setReduced(reduceMq.matches);
    const syncVisibility = () => setPageVisible(document.visibilityState === "visible");

    syncReduced();
    syncVisibility();
    reduceMq.addEventListener("change", syncReduced);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      reduceMq.removeEventListener("change", syncReduced);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  const pause = useCallback(() => setUserPaused(true), []);
  const resume = useCallback(() => {
    // A page control must never override the user's OS-level preference.
    setUserPaused(false);
  }, []);

  const energyTier: MotionEnergyTier =
    reduced || userPaused ? "static" : pageVisible ? "full" : "low";

  const value = useMemo(
    () => ({ reduced, pageVisible, userPaused, energyTier, pause, resume }),
    [energyTier, pageVisible, pause, reduced, resume, userPaused],
  );

  return <MotionPolicyContext.Provider value={value}>{children}</MotionPolicyContext.Provider>;
}

export function useMotionPolicy() {
  const value = useContext(MotionPolicyContext);
  if (!value) throw new Error("useMotionPolicy must be used within MotionPolicyProvider");
  return value;
}

export function MotionPauseControl() {
  const t = useT();
  const { reduced, userPaused, pause, resume } = useMotionPolicy();
  const paused = reduced || userPaused;
  const label = reduced
    ? t["motion.reduced"]
    : userPaused
      ? t["motion.resume"]
      : t["motion.pause"];

  return (
    <button
      type="button"
      className="projects-motion-control"
      onClick={userPaused ? resume : pause}
      disabled={reduced}
      aria-label={label}
      data-paused={paused ? "1" : "0"}
    >
      <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
      <span>{label}</span>
    </button>
  );
}
