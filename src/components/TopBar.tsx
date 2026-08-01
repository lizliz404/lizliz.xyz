"use client";

import Link from "next/link";
import SiteSwitcher from "./SiteSwitcher";
import { usePathname } from "next/navigation";
import { useT } from "@/i18n";

const NAV_ITEMS = [
  { href: "/#projects", labelKey: "nav.projects" as const },
  { href: "/#writing", labelKey: "nav.writing" as const },
  { href: "/#connect", labelKey: "nav.connect" as const },
];

export default function TopBar() {
  const t = useT();
  const pathname = usePathname();

  if (pathname === "/resume.pdf") return null;

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
              <a key={item.href} href={item.href} className="home-section-nav-link">
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
