"use client";

import type { ReactNode } from "react";
import Link from "next/link";
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
}: {
  article: ArticleData;
  children: ReactNode;
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

        <footer className="footer-accent pt-10 pb-8 flex items-center gap-3">
          <Link
            href="/articles"
            className="text-xs hover:opacity-100 transition-opacity"
            style={{ color: "var(--fg-secondary)", opacity: 0.4 }}
          >
            {t["articles.all"]}
          </Link>
        </footer>
      </article>
    </main>
  );
}
