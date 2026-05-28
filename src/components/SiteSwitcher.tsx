"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/i18n";

type Theme = "light" | "dark";

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75 9.75 9.75 0 0 1 8.25 6c0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25 9.75 9.75 0 0 0 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  );
}

function LanguageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 14.08 3 15.502m9.334-10.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
    </svg>
  );
}

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
