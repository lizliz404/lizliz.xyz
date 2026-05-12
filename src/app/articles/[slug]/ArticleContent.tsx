"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { ArticleMeta } from "@/lib/articles";
import { useT } from "@/i18n";

interface ArticleData {
  title: string;
  date: string;
  description?: string;
  wordCount: string;
}

export default function ArticleContent({
  article,
  children,
  newerArticle,
  olderArticle,
  relatedArticles,
}: {
  article: ArticleData;
  children: ReactNode;
  newerArticle?: ArticleMeta | null;
  olderArticle?: ArticleMeta | null;
  relatedArticles?: ArticleMeta[];
}) {
  const t = useT();

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pt-20 pb-40">
      <article className="w-full max-w-lg md:max-w-[46rem] flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <Link
            href="/articles"
            className="text-xs tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity"
            style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)" }}
          >
            {t["articles.back"]}
          </Link>
          <h1
            className="text-3xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {article.title}
          </h1>
          <div className="flex items-baseline gap-3">
            <p
              className="text-xs"
              style={{ color: "var(--fg-secondary)", opacity: 0.5 }}
            >
              {article.date}
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--fg-secondary)", opacity: 0.35 }}
            >
              {article.wordCount}
            </p>
          </div>
          {article.description && (
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--fg-secondary)", opacity: 0.6 }}
            >
              {article.description}
            </p>
          )}
        </header>

        <div className="prose-custom">{children}</div>

        <footer className="footer-accent pt-10 pb-8 flex flex-col gap-10">
          {(olderArticle || newerArticle) && (
            <nav
              aria-label="Article navigation"
              className="grid gap-4 sm:grid-cols-2"
            >
              {olderArticle ? (
                <Link
                  href={`/articles/${olderArticle.slug}`}
                  className="group rounded-2xl border px-4 py-4 transition-colors hover:bg-[var(--card-hover)]"
                  style={{ borderColor: "var(--border)", color: "var(--fg-primary)" }}
                >
                  <span
                    className="block text-[0.65rem] uppercase tracking-[0.2em]"
                    style={{ color: "var(--fg-secondary)", opacity: 0.55 }}
                  >
                    Older
                  </span>
                  <span className="mt-2 block text-sm font-medium leading-snug">← {olderArticle.title}</span>
                </Link>
              ) : (
                <div />
              )}

              {newerArticle ? (
                <Link
                  href={`/articles/${newerArticle.slug}`}
                  className="group rounded-2xl border px-4 py-4 text-right transition-colors hover:bg-[var(--card-hover)]"
                  style={{ borderColor: "var(--border)", color: "var(--fg-primary)" }}
                >
                  <span
                    className="block text-[0.65rem] uppercase tracking-[0.2em]"
                    style={{ color: "var(--fg-secondary)", opacity: 0.55 }}
                  >
                    Newer
                  </span>
                  <span className="mt-2 block text-sm font-medium leading-snug">{newerArticle.title} →</span>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          )}

          {!!relatedArticles?.length && (
            <section aria-labelledby="related-posts" className="flex flex-col gap-4">
              <h2
                id="related-posts"
                className="text-xs uppercase tracking-[0.24em]"
                style={{ fontFamily: "var(--font-poppins)", color: "var(--fg-secondary)", opacity: 0.55 }}
              >
                You may like
              </h2>
              <div className="grid gap-3">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/articles/${related.slug}`}
                    className="rounded-2xl border px-4 py-3 transition-colors hover:bg-[var(--card-hover)]"
                    style={{ borderColor: "var(--border)", color: "var(--fg-primary)" }}
                  >
                    <span className="block text-sm font-medium leading-snug">{related.title}</span>
                    {related.description && (
                      <span
                        className="mt-1 line-clamp-2 block text-xs leading-relaxed"
                        style={{ color: "var(--fg-secondary)", opacity: 0.55 }}
                      >
                        {related.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <Link
            href="/articles"
            className="self-start text-xs hover:opacity-100 transition-opacity"
            style={{ color: "var(--fg-secondary)", opacity: 0.4 }}
          >
            {t["articles.all"]}
          </Link>
        </footer>
      </article>
    </main>
  );
}
