"use client";

import { useState, useEffect } from "react";
import { LanguageIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useLang, useT } from "@/i18n";
import { ICON_LG } from "@/lib/icons";

type Theme = "light" | "dark";

export default function SiteSwitcher() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const { lang, setLang } = useLang();
  const t = useT();

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

  if (!mounted) return <div className="h-8 w-[72px] md:h-10 md:w-[92px]" aria-hidden="true" />;

  return (
    <div className="flex shrink-0 items-center gap-1.5 select-none md:gap-2">
      <button
        type="button"
        onClick={toggleTheme}
        className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:opacity-75 md:h-10 md:w-10"
        style={{
          border: "1px solid var(--border-color)",
          background: "var(--bg)",
          color: "var(--fg)",
        }}
        aria-label={theme === "light" ? t["a11y.switch_theme_dark"] : t["a11y.switch_theme_light"]}
        aria-pressed={theme === "dark"}
        title={theme === "light" ? t["a11y.theme_dark"] : t["a11y.theme_light"]}
      >
        {theme === "light" ? <MoonIcon className={ICON_LG} /> : <SunIcon className={ICON_LG} />}
      </button>

      <button
        type="button"
        onClick={() => setLang(lang === "en" ? "zh" : "en")}
        className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:opacity-75 md:h-10 md:w-10"
        style={{
          border: "1px solid var(--border-color)",
          background: "var(--bg)",
          color: "var(--fg)",
        }}
        aria-label={lang === "en" ? t["a11y.switch_lang_zh"] : t["a11y.switch_lang_en"]}
        aria-pressed={lang === "zh"}
        title={lang === "en" ? "中文" : "English"}
      >
        <LanguageIcon className={ICON_LG} />
      </button>
    </div>
  );
}
