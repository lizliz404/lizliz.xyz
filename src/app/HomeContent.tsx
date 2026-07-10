"use client";

import Link from "next/link";
import GithubHeatmap from "@/components/GithubHeatmap";
import InkRipple from "@/components/ClickRipple";
import ResumeEasterEgg from "@/features/resume/ResumeEasterEgg";
import { useT } from "@/i18n";
import type { ArticleMeta } from "@/lib/articles";
import type { ProjectMeta } from "@/lib/projects";
import type { PodcastMeta } from "@/lib/podcast";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-sm tracking-[0.16em] uppercase flex items-center gap-2"
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

function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card group"
      aria-label={project.title}
    >
      <span className="project-icon" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.iconUrl}
          alt=""
          className="h-5 w-5 rounded-sm object-cover"
          width="20"
          height="20"
          loading="lazy"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-medium" style={{ color: "var(--fg)" }}>
          {project.title}
        </span>
        <span className="mt-1 block text-sm leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
          {project.description}
        </span>
      </span>
      <span className="project-arrow" aria-hidden="true">↗</span>
    </a>
  );
}

export default function HomeContent({ articles, projects, podcasts }: { articles: ArticleMeta[]; projects: ProjectMeta[]; podcasts: PodcastMeta[] }) {
  const t = useT();

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pt-20 pb-16">
      <InkRipple />
      <div className="w-full max-w-lg md:max-w-2xl flex flex-col gap-14">
        {/* Name + tagline */}
        <header className="flex flex-col gap-4 pt-4">
          <h1
            className="text-6xl md:text-7xl font-normal tracking-tight select-none leading-none"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            <ResumeEasterEgg>{t["site.title"]}</ResumeEasterEgg>
          </h1>
          <p
            className="max-w-xl text-lg leading-relaxed"
            style={{ color: "var(--fg-secondary)" }}
          >
            {t["site.tagline"]}
          </p>
        </header>

        {/* Hero animation */}
        <section className="home-animation-shell" aria-label="Forest path pixel animation">
          <iframe
            src="/assets/animations/forest-path-companions.html"
            title="Forest path companions pixel animation"
            className="home-animation-frame"
            loading="lazy"
          />
        </section>

        {/* Now */}
        <section className="flex flex-col gap-3">
          <SectionTitle>{t["section.now"]}</SectionTitle>
          <div
            className="text-base leading-relaxed"
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
            {projects.map((project) => (
              <ProjectCard key={project.url} project={project} />
            ))}
          </div>
        </section>

        {/* What I do */}
        <section className="flex flex-col gap-3">
          <SectionTitle>{t["section.what_i_do"]}</SectionTitle>
          <ul
            className="flex flex-wrap gap-x-3 gap-y-1 text-base"
            style={{ color: "var(--fg-secondary)" }}
          >
            <li>{t["what_i_do.0"]}</li>
            <li aria-hidden="true" className="select-none opacity-30">·</li>
            <li>{t["what_i_do.1"]}</li>
            <li aria-hidden="true" className="select-none opacity-30">·</li>
            <li>{t["what_i_do.2"]}</li>
          </ul>
        </section>

        {/* Podcast */}
        {podcasts.length > 0 && (
          <section className="flex flex-col gap-3">
            <SectionTitle>{t["section.podcast"]}</SectionTitle>
            {podcasts.slice(0, 1).map((ep) => (
              <Link
                key={ep.slug}
                href={`/podcast/${ep.slug}`}
                className="group block rounded-lg border p-4 transition-colors hover:border-[var(--color-accent)]"
                style={{
                  borderColor: "var(--border-color, rgba(128,128,128,0.18))",
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex-shrink-0 text-lg select-none"
                    aria-hidden="true"
                  >
                    🎙️
                  </span>
                  <div className="min-w-0 flex-1">
                    <span
                      className="block text-base font-medium group-hover:underline"
                      style={{ color: "var(--fg)" }}
                    >
                      {ep.title}
                    </span>
                    <span
                      className="mt-1 block text-sm leading-relaxed line-clamp-2"
                      style={{ color: "var(--fg-secondary)" }}
                    >
                      {ep.description}
                    </span>
                    <span
                      className="mt-2 inline-flex items-center gap-2 text-xs"
                      style={{ color: "var(--fg-secondary)", opacity: 0.7 }}
                    >
                      <time dateTime={ep.publishedDate}>{ep.publishedDate}</time>
                      <span aria-hidden="true">·</span>
                      <span>{ep.duration}</span>
                      <span aria-hidden="true">·</span>
                      <span className="group-hover:opacity-100 transition-opacity opacity-70">
                        Listen →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}

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
          <ul className="home-article-list">
            {articles.slice(0, 5).map((article) => (
              <li key={article.slug} className="home-article-item">
                <div className="flex items-baseline justify-between gap-4">
                  <Link href={`/articles/${article.slug}`} className="home-article-title">
                    {article.title}
                  </Link>
                  <time className="home-article-date" dateTime={article.publishedDate}>
                    {article.publishedDate}
                  </time>
                </div>
                <p className="home-article-description">{article.description}</p>
              </li>
            ))}
            {articles.length > 5 && (
              <li className="pt-1">
                <Link href="/articles" className="home-article-more">
                  … {t["articles.all"]} →
                </Link>
              </li>
            )}
          </ul>
        </section>

        {/* GitHub activity heatmap */}
        <section className="flex flex-col gap-3">
          <GithubHeatmap />
        </section>

        {/* Footer */}
        <footer
          className="footer-accent pt-10 pb-4 flex flex-col gap-5"
        >
          <nav aria-label="Find me" className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            <a
              href="https://github.com/lizliz404"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 group no-underline"
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
              className="inline-flex items-center gap-2 group no-underline"
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
              className="inline-flex items-center gap-2 group no-underline"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/icons/social/jike-icon.jpg"
                alt=""
                className="w-4 h-4 rounded-sm opacity-60 group-hover:opacity-100 transition-opacity object-cover"
                width="16"
                height="16"
              />
              即刻
            </a>
          </nav>
          <p
            className="text-sm"
            style={{ color: "var(--fg-secondary)", opacity: 0.56 }}
          >
            {t["footer.brand"]} <span style={{ opacity: 0.5 }}>© 2026</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
