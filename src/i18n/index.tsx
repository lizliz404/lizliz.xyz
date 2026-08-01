"use client";

import {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  useCallback,
  type ReactNode,
} from "react";
import en from "./en";
import zh from "./zh";
import type { Translations } from "./en";

type Lang = "en" | "zh";

const translations: Record<Lang, Translations> = { en, zh };

function readBootLang(): Lang {
  if (typeof window === "undefined") return "en";
  const boot = (window as unknown as { __LIZ_LANG__?: string }).__LIZ_LANG__;
  if (boot === "zh" || boot === "en") return boot;
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "zh" || saved === "en") return saved;
  } catch {
    /* ignore */
  }
  return "en";
}

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}>({ lang: "en", setLang: () => {}, t: en });

export function LangProvider({ children }: { children: ReactNode }) {
  // SSR + first client paint stay "en" to match static HTML; useLayoutEffect
  // applies the real lang before the browser paints when possible. Boot script
  // hides body when saved lang is zh so users never see the English flash.
  const [lang, setLangState] = useState<Lang>("en");

  useLayoutEffect(() => {
    const next = readBootLang();
    setLangState(next);
    document.documentElement.setAttribute("data-lang", next);
    document.documentElement.lang = next;
    document.documentElement.removeAttribute("data-lang-pending");
  }, []);

  // Safety: never leave the page invisible if hydration is delayed/broken.
  useLayoutEffect(() => {
    const timer = window.setTimeout(() => {
      document.documentElement.removeAttribute("data-lang-pending");
    }, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {
      /* ignore */
    }
    document.documentElement.setAttribute("data-lang", l);
    document.documentElement.lang = l;
    (window as unknown as { __LIZ_LANG__?: Lang }).__LIZ_LANG__ = l;
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useT(): Translations {
  return useContext(LangContext).t;
}

export function useLang() {
  const { lang, setLang } = useContext(LangContext);
  return { lang, setLang };
}
