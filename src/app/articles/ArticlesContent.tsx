"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useT } from "@/i18n";
import type { ArticleMeta } from "@/lib/articles";

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
  const unknownFilter = Boolean(asked) && !known;
  const activeCategory: CategoryValue | null = known?.value ?? null;
  const [reduceMotion, setReduceMotion] = useState(false);

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

        {/* Category filter */}
        <nav className="flex flex-wrap gap-2" aria-label={t["section.writing"]}>
          <Link
            href={categoryHref(null)}
            aria-current={activeCategory === null ? "page" : undefined}
            className="px-3 py-1 text-xs rounded-full border transition-colors"
            style={{
              fontFamily: "var(--font-poppins)",
              borderColor: activeCategory === null ? "var(--fg)" : "var(--fg-secondary)",
              color: activeCategory === null ? "var(--bg)" : "var(--fg-secondary)",
              opacity: activeCategory === null ? 1 : 0.5,
              background: activeCategory === null ? "var(--fg)" : "transparent",
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

        {filteredArticles.length === 0 ? (
          <div className="flex flex-col gap-3">
            <p style={{ color: "var(--fg-secondary)", opacity: 0.65 }}>
              {unknownFilter
                ? t["articles.empty_unknown"]
                : activeCategory
                  ? t["articles.empty_filter"]
                  : t["articles.empty"]}
            </p>
            {unknownFilter || activeCategory ? (
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
            {filteredArticles.map((article) => (
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
