"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDownTrayIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useT, useLang } from "@/i18n";
import { ICON } from "@/lib/icons";
import { SKILLS, SKILLS_REPO } from "@/lib/skills";
import { useFilterHotkeys } from "@/lib/useFilterHotkeys";

/** Hover-preview only on fine pointers — avoids sticky :hover on touch. */
function canHoverPreview(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

function syncHash(slug: string | null) {
  if (typeof window === "undefined") return;
  const base = window.location.pathname;
  if (slug) {
    window.history.replaceState(null, "", `${base}#${slug}`);
  } else {
    window.history.replaceState(null, "", base);
  }
}

/**
 * Flat skills index (mirrors the Articles page structure):
 * breadcrumb → h1 → lede → accordion list. Each item expands on
 * hover (preview) and pins on click; the download zip button sits
 * on the right of the row. Deep links (/skills#<slug>) pin an item.
 */
export default function SkillsContent() {
  const t = useT();
  const { lang } = useLang();
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [unknownHash, setUnknownHash] = useState(false);
  const [query, setQuery] = useState("");
  const filterRef = useRef<HTMLInputElement>(null);

  const togglePinned = (slug: string) => {
    const next = pinned === slug ? null : slug;
    setPinned(next);
    setUnknownHash(false);
    syncHash(next);
  };

  useEffect(() => {
    const syncFromHash = () => {
      const slug = window.location.hash.replace("#", "");
      if (!slug) {
        setUnknownHash(false);
        return;
      }
      if (SKILLS.some((s) => s.slug === slug)) {
        setPinned(slug);
        setUnknownHash(false);
      } else {
        // 筛空: unknown hash is a filter miss, not "show all" and not 404.
        setPinned(null);
        setUnknownHash(true);
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const onFilterEscape = useCallback(() => {
    if (!pinned && !unknownHash) return false;
    setPinned(null);
    setUnknownHash(false);
    syncHash(null);
    return true;
  }, [pinned, unknownHash]);

  useFilterHotkeys(filterRef, onFilterEscape);

  const zh = lang === "zh";
  const needle = query.trim().toLowerCase();
  const visibleSkills = useMemo(() => {
    if (!needle) return SKILLS;
    return SKILLS.filter((skill) => {
      const tagline = zh ? skill.taglineZh : skill.tagline;
      return (
        skill.name.toLowerCase().includes(needle) ||
        skill.slug.toLowerCase().includes(needle) ||
        tagline.toLowerCase().includes(needle)
      );
    });
  }, [needle, zh]);
  const queryActive = needle.length > 0;

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
            {t["skills.back_home"]}
          </Link>
          <div className="flex items-baseline justify-between gap-3">
            <h1
              className="text-3xl font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {t["section.skills"]}
            </h1>
            <a
              href={SKILLS_REPO}
              target="_blank"
              rel="noreferrer"
              className="text-xs opacity-40 hover:opacity-100 transition-opacity"
              style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)" }}
            >
              {t["skills.github"]}
            </a>
          </div>
          <p className="section-lede">{t["section.skills.lede"]}</p>
          <Link
            href="/templates/"
            className="w-fit text-sm opacity-55 hover:opacity-100 transition-opacity"
            style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)" }}
          >
            {t["skills.see_templates"]}
          </Link>
          {unknownHash ? (
            <div className="flex flex-col gap-2 pt-2">
              <p className="text-sm" style={{ color: "var(--fg-secondary)", opacity: 0.7 }}>
                {t["skills.empty_hash"]}
              </p>
              <button
                type="button"
                className="w-fit text-sm underline underline-offset-4"
                style={{ fontFamily: "var(--font-poppins)", color: "var(--fg)" }}
                onClick={() => {
                  setUnknownHash(false);
                  setPinned(null);
                  syncHash(null);
                }}
              >
                {t["skills.clear_filter"]}
              </button>
            </div>
          ) : null}
        </header>

        <label
          className="flex items-center gap-2 border-b pb-1.5"
          style={{ borderColor: "var(--border-color)" }}
        >
          <span className="sr-only">{t["skills.filter"]}</span>
          <input
            ref={filterRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t["skills.filter_placeholder"]}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-keyshortcuts="/"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            style={{ fontFamily: "var(--font-poppins)", color: "var(--fg)" }}
          />
          <kbd
            className="hidden sm:inline-block rounded border px-1 py-0.5 text-[0.55rem] font-mono"
            style={{
              borderColor: "var(--border-color)",
              color: "var(--fg-secondary)",
              opacity: 0.35,
            }}
            aria-hidden="true"
          >
            /
          </kbd>
        </label>

        {queryActive && visibleSkills.length === 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm" style={{ color: "var(--fg-secondary)", opacity: 0.7 }}>
              {t["skills.empty_query"]}
            </p>
            <button
              type="button"
              className="w-fit text-sm underline underline-offset-4"
              style={{ fontFamily: "var(--font-poppins)", color: "var(--fg)" }}
              onClick={() => setQuery("")}
            >
              {t["skills.clear_filter"]}
            </button>
          </div>
        ) : (
          <ul className="flex flex-col gap-3" aria-label={t["section.skills"]}>
          {visibleSkills.map((skill) => {
            const open = (hovered ?? pinned) === skill.slug;
            const tagline = zh ? skill.taglineZh : skill.tagline;
            const features = zh ? skill.featuresZh : skill.features;
            return (
              <li
                key={skill.slug}
                id={skill.slug}
                className="skill-accordion-item"
                data-open={open}
                onMouseEnter={() => {
                  if (canHoverPreview()) setHovered(skill.slug);
                }}
                onMouseLeave={() => {
                  if (canHoverPreview()) {
                    setHovered((h) => (h === skill.slug ? null : h));
                  }
                }}
              >
                <div className="flex items-center gap-2 sm:gap-3 pr-2 sm:pr-4">
                  <button
                    type="button"
                    id={`skill-toggle-${skill.slug}`}
                    onClick={() => togglePinned(skill.slug)}
                    aria-expanded={open}
                    aria-controls={`skill-panel-${skill.slug}`}
                    className="skill-accordion-toggle"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={skill.iconUrl}
                      alt=""
                      width={40}
                      height={40}
                      className="skill-accordion-icon shrink-0"
                    />
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="skill-accordion-name">{skill.name}</span>
                      <span className="skill-accordion-tagline">{tagline}</span>
                    </span>
                    <ChevronDownIcon
                      className={`${ICON} skill-accordion-chevron ${open ? "skill-accordion-chevron-open" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  <a
                    href={skill.zipUrl}
                    download
                    className="skill-download-cta"
                    aria-label={`${t["skills.download"]} — ${skill.name}`}
                  >
                    <ArrowDownTrayIcon className={ICON} aria-hidden="true" />
                    <span className="skill-download-cta-full">{t["skills.download"]}</span>
                    <span className="skill-download-cta-short" aria-hidden="true">
                      {t["skills.download_short"]}
                    </span>
                  </a>
                </div>

                <div
                  id={`skill-panel-${skill.slug}`}
                  role="region"
                  aria-labelledby={`skill-toggle-${skill.slug}`}
                  aria-hidden={!open}
                  inert={!open ? true : undefined}
                  className="skill-accordion-panel"
                  data-open={open}
                >
                  <div className="skill-accordion-panel-inner">
                    <ul className="flex flex-col gap-1.5 text-sm leading-relaxed">
                      {features.map((feature, i) => (
                        <li key={i} style={{ color: "var(--fg-secondary)" }}>
                          {feature.label && (
                            <strong className="font-medium" style={{ color: "var(--fg)" }}>
                              {feature.label}
                            </strong>
                          )}
                          {feature.label ? " — " : ""}
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
          </ul>
        )}
      </div>
    </main>
  );
}
