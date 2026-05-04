"use client";

import Link from "next/link";
import SiteSwitcher from "./SiteSwitcher";
import { useT } from "@/i18n";

export default function TopBar() {
  const t = useT();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3"
      style={{
        background: "var(--bg)",
        borderBottom: "1px solid var(--border-color)",
        fontFamily: "var(--font-poppins)",
      }}
    >
      <Link
        href="/"
        className="text-sm font-medium tracking-tight hover:opacity-70 transition-opacity flex items-center gap-1.5"
        style={{ color: "var(--fg)" }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
        {t["site.title"]}
      </Link>

      <SiteSwitcher />
    </header>
  );
}
