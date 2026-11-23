"use client";

import Link from "next/link";
import { useT } from "@/i18n";

export default function PrivacyContent() {
  const t = useT();

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex flex-1 flex-col items-center justify-center px-6 pt-20 pb-40 outline-none"
    >
      <article className="w-full max-w-lg md:max-w-[46rem] flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-xs tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity"
            style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)" }}
          >
            {t["legal.back_home"]}
          </Link>
          <p
            className="text-[0.65rem] uppercase tracking-[0.24em]"
            style={{ fontFamily: "var(--font-poppins)", color: "var(--color-accent)" }}
          >
            {t["legal.kicker"]}
          </p>
          <h1
            className="text-4xl md:text-5xl font-normal tracking-tight"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            {t["privacy.title"]}
          </h1>
          <p
            className="text-xs"
            style={{ color: "var(--fg-secondary)", opacity: 0.5 }}
          >
            {t["legal.updated"]} · 2026-11-23
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--fg-secondary)", opacity: 0.6 }}
          >
            {t["privacy.lede"]}
          </p>
        </header>

        <div className="prose-custom">
          <p>{t["privacy.intro"]}</p>

          <h2>{t["privacy.what_h"]}</h2>
          <p>{t["privacy.what_p"]}</p>

          <h2>{t["privacy.data_h"]}</h2>
          <p>{t["privacy.data_p"]}</p>

          <h2>{t["privacy.never_h"]}</h2>
          <ul>
            <li>{t["privacy.never_i1"]}</li>
            <li>{t["privacy.never_i2"]}</li>
            <li>{t["privacy.never_i3"]}</li>
            <li>{t["privacy.never_i4"]}</li>
          </ul>

          <h2>{t["privacy.scope_h"]}</h2>
          <p>{t["privacy.scope_p"]}</p>

          <h2>{t["privacy.contact_h"]}</h2>
          <p>
            {t["privacy.contact_p"]} <Link href="/">lizliz.xyz</Link>.
          </p>
        </div>

        <footer className="footer-accent pt-10 pb-8 flex flex-col gap-4">
          <Link
            href="/terms/"
            className="text-sm font-medium no-underline hover:opacity-70 transition-opacity"
            style={{ fontFamily: "var(--font-poppins)", color: "var(--fg)" }}
          >
            {t["legal.terms_link"]}
          </Link>
          <p
            className="text-xs"
            style={{ color: "var(--fg-secondary)", opacity: 0.5 }}
          >
            {t["legal.site_note"]}
          </p>
        </footer>
      </article>
    </main>
  );
}
