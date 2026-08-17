"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useT } from "@/i18n";
import type { ArticleMeta } from "@/lib/articles";
import { useFilterHotkeys } from "@/lib/useFilterHotkeys";

const ARTICLE_CATEGORIES = [
  { slug: "psychology", value: "心理" },
  { slug: "tech", value: "技术" },
  { slug: "society", value: "社会" },
  { slug: "business", value: "商业" },
] as const;

type CategoryValue = (typeof ARTICLE_CATEGORIES)[number]["value"];

function categoryHref(slug: string | null) {
  return slug ? `/articles/?c=${slug}` : "/articles/";
}

export default function ArticlesContent({ articles }: { articles: ArticleMeta[] }) {
  const t = useT();
  const searchParams = useSearchParams();
  const asked = searchParams.get("c");
  const known = ARTICLE_CATEGORIES.find((c) => c.slug === asked);
  // 筛空 ≠ 库空: a present unknown ?c= is empty-filter, not "show all".
  const unknownFilter = asked !== null && !known;
  const activeCategory: CategoryValue | null = known?.value ?? null;
  const allActive = !unknownFilter && activeCategory === null;
  const [reduceMotion, setReduceMotion] = useState(false);
  const [query, setQuery] = useState("");
  const filterRef = useRef<HTMLInputElement>(null);
  useFilterHotkeys(filterRef);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const filteredArticles = useMemo(() => {
    if (unknownFilter) return [];
    if (!activeCategory) return articles;
    return articles.filter((a) => a.categories?.includes(activeCategory));
  }, [articles, activeCategory, unknownFilter]);

  const needle = query.trim().toLowerCase();
  const visibleArticles = useMemo(() => {
    if (!needle) return filteredArticles;
    return filteredArticles.filter((a) => {
      if (a.title.toLowerCase().includes(needle)) return true;
      return Boolean(a.description?.toLowerCase().includes(needle));
    });
  }, [filteredArticles, needle]);
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
            {t["articles.back_home"]}
          </Link>
          <h1
            className="text-3xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {t["section.writing"]}
          </h1>
          <p className="section-lede">{t["section.writing.lede"]}</p>
        </header>

        {reduceMotion ? null : (
          <section className="flex justify-center py-4" aria-label="Forest path pixel animation">
            <iframe
              src="/assets/animations/forest-path-companions.html"
              title="Forest path companions pixel animation"
              className="articles-animation-frame"
              loading="lazy"
            />
          </section>
        )}

        <label
          className="flex items-center gap-2 border-b pb-1.5"
          style={{ borderColor: "var(--border-color)" }}
        >
          <span className="sr-only">{t["articles.filter"]}</span>
          <input
            ref={filterRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t["articles.filter_placeholder"]}
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

        {/* Category filter */}
        <nav className="flex flex-wrap gap-2" aria-label={t["section.writing"]}>
          <Link
            href={categoryHref(null)}
            aria-current={allActive ? "page" : undefined}
            className="px-3 py-1 text-xs rounded-full border transition-colors"
            style={{
              fontFamily: "var(--font-poppins)",
              borderColor: allActive ? "var(--fg)" : "var(--fg-secondary)",
              color: allActive ? "var(--bg)" : "var(--fg-secondary)",
              opacity: allActive ? 1 : 0.5,
              background: allActive ? "var(--fg)" : "transparent",
            }}
          >
            {t["articles.category_all"]}
          </Link>
          {ARTICLE_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={categoryHref(cat.slug)}
              aria-current={activeCategory === cat.value ? "page" : undefined}
              className="px-3 py-1 text-xs rounded-full border transition-colors"
              style={{
                fontFamily: "var(--font-poppins)",
                borderColor: activeCategory === cat.value ? "var(--fg)" : "var(--fg-secondary)",
                color: activeCategory === cat.value ? "var(--bg)" : "var(--fg-secondary)",
                opacity: activeCategory === cat.value ? 1 : 0.5,
                background: activeCategory === cat.value ? "var(--fg)" : "transparent",
              }}
            >
              {t[`articles.category.${cat.slug}`]}
            </Link>
          ))}
        </nav>

        {visibleArticles.length === 0 ? (
          <div className="flex flex-col gap-3">
            <p style={{ color: "var(--fg-secondary)", opacity: 0.65 }}>
              {unknownFilter
                ? t["articles.empty_unknown"]
                : queryActive
                  ? t["articles.empty_query"]
                  : activeCategory
                    ? t["articles.empty_filter"]
                    : t["articles.empty"]}
            </p>
            {unknownFilter || activeCategory || queryActive ? (
              queryActive && !unknownFilter ? (
                <button
                  type="button"
                  className="w-fit text-sm hover:opacity-70 transition-opacity"
                  style={{
                    fontFamily: "var(--font-poppins)",
                    color: "var(--fg)",
                    textDecoration: "underline",
                    textDecorationColor: "var(--border-color)",
                    textUnderlineOffset: "4px",
                  }}
                  onClick={() => setQuery("")}
                >
                  {t["articles.clear_filter"]}
                </button>
              ) : (
                <Link
                  href={categoryHref(null)}
                  className="w-fit text-sm hover:opacity-70 transition-opacity"
                  style={{
                    fontFamily: "var(--font-poppins)",
                    color: "var(--fg)",
                    textDecoration: "underline",
                    textDecorationColor: "var(--border-color)",
                    textUnderlineOffset: "4px",
                  }}
                >
                  {t["articles.clear_filter"]}
                </Link>
              )
            ) : (
              <Link
                href="/"
                className="w-fit text-sm opacity-70 hover:opacity-100 transition-opacity"
                style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)" }}
              >
                {t["articles.back_home"]}
              </Link>
            )}
          </div>
        ) : (
          <ul className="flex flex-col gap-6">
            {visibleArticles.map((article) => (
              <li key={article.slug} className="flex flex-col gap-1">
                <Link
                  href={`/articles/${article.slug}`}
                  className="text-base font-medium w-fit"
                  style={{ color: "var(--fg)" }}
                >
                  {article.title}
                </Link>
                <time
                  className="text-xs"
                  dateTime={article.publishedDate}
                  style={{ color: "var(--fg-secondary)", opacity: 0.5 }}
                >
                  {article.publishedDate}
                </time>
                {article.description && (
                  <span
                    className="text-xs"
                    style={{ color: "var(--fg-secondary)", opacity: 0.45 }}
                  >
                    {article.description}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
