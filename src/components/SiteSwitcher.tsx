"use client";

import { useState, useEffect } from "react";
import { LanguageIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useLang } from "@/i18n";

type Theme = "light" | "dark";

export default function SiteSwitcher() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const { lang, setLang } = useLang();

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
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

  if (!mounted) return <div className="h-10 w-[92px]" aria-hidden="true" />;

  return (
    <div className="flex items-center gap-2 select-none">
      <button
        onClick={toggleTheme}
        className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:opacity-75"
        style={{
          border: "1px solid var(--border-color)",
          background: "var(--bg)",
          color: "var(--fg)",
        }}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        title={theme === "light" ? "Dark mode" : "Light mode"}
      >
        {theme === "light" ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
      </button>

      <button
        onClick={() => setLang(lang === "en" ? "zh" : "en")}
        className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:opacity-75"
        style={{
          border: "1px solid var(--border-color)",
          background: "var(--bg)",
          color: "var(--fg)",
        }}
        aria-label={`Switch to ${lang === "en" ? "Chinese" : "English"}`}
        title={lang === "en" ? "中文" : "English"}
      >
        <LanguageIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
