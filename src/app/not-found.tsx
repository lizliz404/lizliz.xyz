"use client";

import Link from "next/link";
import { useT } from "@/i18n";

export default function NotFound() {
  const t = useT();

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pt-28 pb-24" id="main-content">
      <div className="w-full max-w-lg flex flex-col gap-5">
        <p
          className="text-xs tracking-[0.2em] uppercase opacity-45"
          style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)" }}
        >
          {t["not_found.code"]}
        </p>
        <h1
          className="text-3xl md:text-4xl font-normal tracking-tight leading-tight"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          {t["not_found.title"]}
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
          {t["not_found.body"]}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2 text-sm">
          <Link
            href="/"
            className="font-medium no-underline hover:opacity-70 transition-opacity"
            style={{ fontFamily: "var(--font-poppins)", color: "var(--fg)" }}
          >
            {t["not_found.home"]} →
          </Link>
          <Link
            href="/articles"
            className="opacity-70 hover:opacity-100 transition-opacity"
            style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)" }}
          >
            {t["not_found.articles"]}
          </Link>
        </div>
      </div>
    </main>
  );
}
