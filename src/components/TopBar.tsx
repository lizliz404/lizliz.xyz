"use client";

import Link from "next/link";
import SiteSwitcher from "./SiteSwitcher";
import { usePathname, useRouter } from "next/navigation";
import { useT } from "@/i18n";
import type { MouseEvent } from "react";

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) return false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  window.history.replaceState(null, "", hash);
  return true;
}

export default function TopBar() {
  const t = useT();
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/resume.pdf") return null;

  const isHome = pathname === "/" || pathname === "";

  function onProjects(e: MouseEvent<HTMLAnchorElement>) {
    if (isHome) {
      e.preventDefault();
      scrollToHash("#projects");
      return;
    }
    e.preventDefault();
    router.push("/#projects");
    window.setTimeout(() => scrollToHash("#projects"), 0);
    window.setTimeout(() => scrollToHash("#projects"), 120);
    window.setTimeout(() => scrollToHash("#projects"), 320);
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: "color-mix(in oklab, var(--bg) 92%, transparent)",
        borderBottom: "1px solid color-mix(in oklab, var(--border-color) 72%, transparent)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex min-w-0 items-center gap-6 md:gap-8">
          <Link
            href="/"
            className="shrink-0 text-2xl font-normal tracking-tight no-underline hover:opacity-70 transition-opacity"
            style={{ color: "var(--fg)", fontFamily: "var(--font-instrument-serif)" }}
          >
            {t["site.title"]}
          </Link>

          <nav aria-label={t["nav.primary"]} className="home-section-nav">
            <a href="/#projects" className="home-section-nav-link" onClick={onProjects}>
              {t["nav.projects"]}
            </a>
            <Link href="/articles/" className="home-section-nav-link">
              {t["nav.writing"]}
            </Link>
            <Link href="/skills/" className="home-section-nav-link">
              {t["nav.skills"]}
            </Link>
            <details className="home-connect-menu">
              <summary className="home-section-nav-link">{t["nav.connect"]}</summary>
              <div className="home-connect-panel" role="menu">
                <a href="https://github.com/lizliz404" target="_blank" rel="noopener noreferrer" role="menuitem">
                  GitHub
                </a>
                <a href="https://x.com/lizliz404" target="_blank" rel="noopener noreferrer" role="menuitem">
                  X
                </a>
                <a href="https://okjk.co/znTaA1" target="_blank" rel="noopener noreferrer" role="menuitem">
                  即刻
                </a>
              </div>
            </details>
          </nav>
        </div>

        <SiteSwitcher />
      </div>
    </header>
  );
}
