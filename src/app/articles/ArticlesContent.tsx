"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useT } from "@/i18n";
import type { ArticleMeta } from "@/lib/articles";

const ALL_CATEGORIES = ["心理", "技术", "社会", "商业"] as const;
type Category = (typeof ALL_CATEGORIES)[number];

export default function ArticlesContent({ articles }: { articles: ArticleMeta[] }) {
  const t = useT();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const filteredArticles = useMemo(() => {
    if (!activeCategory) return articles;
    return articles.filter((a) => a.categories?.includes(activeCategory));
  }, [articles, activeCategory]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pt-20 pb-40">
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
            {t["section.articles"]}
          </h1>
        </header>

        {/* Category filter */}
        <nav className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className="px-3 py-1 text-xs rounded-full border transition-colors"
            style={{
              fontFamily: "var(--font-poppins)",
              borderColor: activeCategory === null ? "var(--fg)" : "var(--fg-secondary)",
              color: activeCategory === null ? "var(--fg)" : "var(--fg-secondary)",
              opacity: activeCategory === null ? 1 : 0.5,
              background: activeCategory === null ? "var(--fg)" : "transparent",
              ...(activeCategory === null ? { color: "var(--bg)" } : {}),
            }}
          >
            {t["articles.category_all"]}
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-1 text-xs rounded-full border transition-colors"
              style={{
                fontFamily: "var(--font-poppins)",
                borderColor: activeCategory === cat ? "var(--fg)" : "var(--fg-secondary)",
                color: activeCategory === cat ? "var(--bg)" : "var(--fg-secondary)",
                opacity: activeCategory === cat ? 1 : 0.5,
                background: activeCategory === cat ? "var(--fg)" : "transparent",
              }}
            >
              {cat}
            </button>
          ))}
        </nav>

        {filteredArticles.length === 0 ? (
          <p style={{ color: "var(--fg-secondary)", opacity: 0.5 }}>
            {t["articles.empty"]}
          </p>
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
                <span
                  className="text-xs"
                  style={{ color: "var(--fg-secondary)", opacity: 0.5 }}
                >
                  {article.publishedDate}
                </span>
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
