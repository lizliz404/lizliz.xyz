"use client";

import Link from "next/link";
import { useT } from "@/i18n";
import type { ArticleMeta } from "@/lib/articles";

export default function ArticlesContent({ articles }: { articles: ArticleMeta[] }) {
  const t = useT();

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

        {articles.length === 0 ? (
          <p style={{ color: "var(--fg-secondary)", opacity: 0.5 }}>
            {t["articles.empty"]}
          </p>
        ) : (
          <ul className="flex flex-col gap-6">
            {articles.map((article) => (
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
                  {article.date}
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
