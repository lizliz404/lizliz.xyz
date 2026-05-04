"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/i18n";

type Theme = "light" | "dark";

export default function SiteSwitcher() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const { lang, setLang } = useLang();

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "dark") {
      setTheme("dark");
    } else {
      // Default to system preference on first visit
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => setTheme((p) => (p === "light" ? "dark" : "light"));

  if (!mounted) return <div className="flex items-center gap-3 h-6 w-[110px]" aria-hidden="true" />;

  return (
    <div
      className="flex items-center rounded-full text-[11px] select-none"
      style={{
        border: "1px solid var(--border-color)",
        background: "var(--bg)",
        fontFamily: "var(--font-poppins)",
      }}
    >
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors"
        style={{ color: theme === "dark" ? "var(--fg-secondary)" : "var(--color-accent)" }}
        aria-label={`Theme: ${theme}`}
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ opacity: theme === "light" ? 1 : 0.35 }}
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
          style={{ opacity: theme === "dark" ? 1 : 0.35, marginLeft: "-1px" }}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>

      {/* Divider */}
      <span style={{ width: "1px", height: "14px", background: "var(--border-color)" }} />

      {/* Language toggle */}
      <button
        onClick={() => setLang(lang === "en" ? "zh" : "en")}
        className="flex items-center gap-0.5 px-2.5 py-1 rounded-full transition-colors"
        style={{ color: "var(--fg-secondary)" }}
      >
        <span
          style={{
            opacity: lang === "en" ? 1 : 0.35,
            fontWeight: lang === "en" ? 500 : 400,
            color: lang === "en" ? "var(--color-accent)" : undefined,
          }}
        >
          EN
        </span>
        <span style={{ opacity: 0.25, fontSize: "9px" }}>/</span>
        <span
          style={{
            opacity: lang === "zh" ? 1 : 0.35,
            fontWeight: lang === "zh" ? 500 : 400,
            color: lang === "zh" ? "var(--color-accent)" : undefined,
          }}
        >
          中
        </span>
      </button>
    </div>
  );
}
