"use client";

import Link from "next/link";
import { useT, useLang } from "@/i18n";
import { TEMPLATES_PACK, TEMPLATES_REPO } from "@/lib/templates";

/**
 * Single-pack templates page (mirrors the /skills structure):
 * breadcrumb → h1 → lede → download CTA → what's inside (3 areas) →
 * how to use → download CTA. Content comes from lib/templates.ts with
 * zh twins; the accordion is unnecessary for one pack, so this stays
 * a flat static layout.
 */
export default function TemplatesContent() {
  const t = useT();
  const { lang } = useLang();
  const zh = lang === "zh";

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex flex-1 flex-col items-center justify-center px-6 pt-20 pb-40 outline-none"
    >
      <div className="w-full max-w-lg md:max-w-2xl flex flex-col gap-10">
        <header className="flex flex-col gap-2">
          <Link
            href="/"
            className="text-xs tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity"
            style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)" }}
          >
            {t["templates.back_home"]}
          </Link>
          <div className="flex items-baseline justify-between gap-3">
            <h1
              className="text-3xl font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {t["section.templates"]}
            </h1>
            <a
              href={TEMPLATES_REPO}
              target="_blank"
              rel="noreferrer"
              className="text-xs opacity-40 hover:opacity-100 transition-opacity"
              style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)" }}
            >
              {t["templates.github"]}
            </a>
          </div>
          <p className="section-lede">{t["section.templates.lede"]}</p>
          <Link
            href="/skills/"
            className="w-fit text-sm opacity-55 hover:opacity-100 transition-opacity"
            style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)" }}
          >
            {t["templates.see_skills"]}
          </Link>
        </header>

        <div className="flex justify-start">
          <a href={TEMPLATES_PACK.zipUrl} download className="skill-download-cta">
            <span className="skill-download-cta-full">
              {t["templates.download"]} — {zh ? TEMPLATES_PACK.nameZh : TEMPLATES_PACK.name}
            </span>
            <span className="skill-download-cta-short" aria-hidden="true">
              {t["templates.download_short"]}
            </span>
          </a>
        </div>

        <section className="flex flex-col gap-4">
          <h2
            className="text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {t["templates.whats_inside"]}
          </h2>
          {TEMPLATES_PACK.areas.map((area) => (
            <div key={area.name} className="flex flex-col gap-1.5">
              <h3
                className="text-sm font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {zh ? area.nameZh : area.name}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
                {zh ? area.blurbZh : area.blurb}
              </p>
              <ul className="flex flex-col gap-1.5 text-sm leading-relaxed">
                {(zh ? area.itemsZh : area.items).map((item, i) => (
                  <li key={i} style={{ color: "var(--fg-secondary)" }}>
                    {item.label && (
                      <strong className="font-medium" style={{ color: "var(--fg)" }}>
                        {item.label}
                      </strong>
                    )}
                    {item.label ? " — " : ""}
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-2">
          <h2
            className="text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {t["templates.how_to_use"]}
          </h2>
          <ol className="flex flex-col gap-1.5 text-sm leading-relaxed list-decimal pl-5">
            {(zh ? TEMPLATES_PACK.howtoZh : TEMPLATES_PACK.howto).map((step, i) => (
              <li key={i} style={{ color: "var(--fg-secondary)" }}>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <div className="flex justify-start">
          <a href={TEMPLATES_PACK.zipUrl} download className="skill-download-cta">
            <span className="skill-download-cta-full">
              {t["templates.download"]} — {zh ? TEMPLATES_PACK.nameZh : TEMPLATES_PACK.name}
            </span>
            <span className="skill-download-cta-short" aria-hidden="true">
              {t["templates.download_short"]}
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}
