"use client";

import Link from "next/link";
import GithubHeatmap from "@/components/GithubHeatmap";
import InkRipple from "@/components/ClickRipple";
import { useT } from "@/i18n";
import type { ArticleMeta } from "@/lib/articles";

const PROJECTS = [
  {
    title: "PEP Words",
    url: "https://pep-words.lizliz.xyz/",
    icon: "📚",
    descriptionKey: "projects.pep_words.description",
  },
  {
    title: "Brain Rush",
    url: "https://brainrush.lizliz.xyz/",
    icon: "⚡",
    descriptionKey: "projects.brain_rush.description",
  },
] as const;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xs tracking-widest uppercase flex items-center gap-2"
      style={{
        fontFamily: "var(--font-poppins)",
        color: "var(--fg-secondary)",
        opacity: 0.6,
      }}
    >
      <span
        className="inline-block w-1 h-1 rounded-full"
        style={{ backgroundColor: "var(--color-accent)" }}
      />
      {children}
    </h2>
  );
}

function ProjectCard({
  project,
}: {
  project: (typeof PROJECTS)[number];
}) {
  const t = useT();

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card group"
      aria-label={`${project.title}: ${project.url}`}
    >
      <span className="project-icon" aria-hidden="true">
        {project.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium" style={{ color: "var(--fg)" }}>
          {project.title}
        </span>
        <span className="mt-1 block text-xs leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
          {t[project.descriptionKey]}
        </span>
      </span>
      <span className="project-arrow" aria-hidden="true">↗</span>
    </a>
  );
}

export default function HomeContent({ articles }: { articles: ArticleMeta[] }) {
  const t = useT();

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pt-20 pb-16">
      <InkRipple />
      <div className="w-full max-w-lg md:max-w-2xl flex flex-col gap-14">
        {/* Name + tagline */}
        <header className="flex flex-col gap-3">
          <h1
            className="text-4xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {t["site.title"]}
          </h1>
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--fg-secondary)" }}
          >
            {t["site.tagline"]}
          </p>
        </header>

        {/* Links */}
        <nav aria-label="Find me" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <a
            href="https://github.com/lizliz404"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 group"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
          <a
            href="https://x.com/lizliz404"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 group"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" fill="currentColor" aria-hidden="true">
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
            </svg>
            X / Twitter
          </a>
          <a
            href="https://okjk.co/znTaA1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 group"
          >
            <img
              src="/jike-icon.jpg"
              alt="即刻"
              className="w-4 h-4 rounded-sm opacity-60 group-hover:opacity-100 transition-opacity object-cover"
            />
            即刻
          </a>
        </nav>

        {/* Hero animation */}
        <section className="home-animation-shell" aria-label="Forest path pixel animation">
          <iframe
            src="/animations/forest-path-companions.html"
            title="Forest path companions pixel animation"
            className="home-animation-frame"
            loading="lazy"
          />
        </section>

        {/* Now */}
        <section className="flex flex-col gap-3">
          <SectionTitle>{t["section.now"]}</SectionTitle>
          <div
            className="text-sm leading-relaxed"
            style={{ color: "var(--fg-secondary)" }}
          >
            <p>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
                style={{ backgroundColor: "var(--color-green)" }}
              />
              {t["now.text"]}
            </p>
          </div>
        </section>

        {/* Projects */}
        <section className="flex flex-col gap-3">
          <SectionTitle>{t["section.projects"]}</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.url} project={project} />
            ))}
          </div>
        </section>

        {/* What I do */}
        <section className="flex flex-col gap-3">
          <SectionTitle>{t["section.what_i_do"]}</SectionTitle>
          <ul
            className="flex flex-wrap gap-x-3 gap-y-1 text-sm"
            style={{ color: "var(--fg-secondary)" }}
          >
            <li>{t["what_i_do.0"]}</li>
            <li aria-hidden="true" className="select-none opacity-30">·</li>
            <li>{t["what_i_do.1"]}</li>
            <li aria-hidden="true" className="select-none opacity-30">·</li>
            <li>{t["what_i_do.2"]}</li>
          </ul>
        </section>

        {/* Articles */}
        <section className="flex flex-col gap-3">
          <SectionTitle>
            <Link
              href="/articles"
              className="hover:opacity-100 transition-opacity"
              style={{ color: "var(--fg-secondary)" }}
            >
              {t["section.articles"]}
            </Link>
          </SectionTitle>
          <ul className="flex flex-col gap-1 text-sm">
            {articles.map((article) => (
              <li key={article.slug}>
                <a
                  href={`/articles/${article.slug}`}
                  className="hover:underline underline-offset-4"
                  style={{ color: "var(--fg-secondary)" }}
                >
                  {article.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* GitHub activity heatmap */}
        <section className="flex flex-col gap-3">
          <GithubHeatmap />
        </section>

        {/* Footer */}
        <footer
          className="footer-accent pt-8 pb-2 flex items-center justify-between"
        >
          <p
            className="text-xs"
            style={{ color: "var(--fg-secondary)", opacity: 0.4 }}
          >
            {t["footer.brand"]} <span style={{ opacity: 0.4 }}>© 2026</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
