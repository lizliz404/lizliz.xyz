"use client";

import Link from "next/link";
import SiteSwitcher from "./SiteSwitcher";
import { useT } from "@/i18n";

export default function TopBar() {
  const t = useT();

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
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-2xl font-normal tracking-tight no-underline hover:opacity-70 transition-opacity"
          style={{ color: "var(--fg)", fontFamily: "var(--font-instrument-serif)" }}
        >
          {t["site.title"]}
        </Link>

        <SiteSwitcher />
      </div>
    </header>
  );
}
