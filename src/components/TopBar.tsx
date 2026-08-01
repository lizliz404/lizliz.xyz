"use client";

import Link from "next/link";
import SiteSwitcher from "./SiteSwitcher";
import { usePathname, useRouter } from "next/navigation";
import { useT } from "@/i18n";
import type { MouseEvent } from "react";

const NAV_ITEMS = [
  { hash: "#projects", labelKey: "nav.projects" as const },
  { hash: "#writing", labelKey: "nav.writing" as const },
  { hash: "#connect", labelKey: "nav.connect" as const },
];

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  // Update URL without Next soft-nav / full reload.
  window.history.replaceState(null, "", hash);
  return true;
}

export default function TopBar() {
  const t = useT();
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/resume.pdf") return null;

  const isHome = pathname === "/" || pathname === "";

  function onHashNav(e: MouseEvent<HTMLAnchorElement>, hash: string) {
    // Already on home: in-page scroll only — no remount, no lang re-boot.
    if (isHome) {
      e.preventDefault();
      scrollToHash(hash);
      return;
    }
    // From another route: client-navigate home then scroll after paint.
    e.preventDefault();
    router.push(`/${hash}`);
    // Fallback if App Router drops hash scroll on static export.
    window.setTimeout(() => scrollToHash(hash), 0);
    window.setTimeout(() => scrollToHash(hash), 120);
    window.setTimeout(() => scrollToHash(hash), 320);
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

          <nav aria-label="Primary" className="home-section-nav">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.hash}
                href={`/${item.hash}`}
                className="home-section-nav-link"
                onClick={(e) => onHashNav(e, item.hash)}
              >
                {t[item.labelKey]}
              </a>
            ))}
            <Link href="/articles" className="home-section-nav-link">
              {t["nav.articles"]}
            </Link>
          </nav>
        </div>

        <SiteSwitcher />
      </div>
    </header>
  );
}
