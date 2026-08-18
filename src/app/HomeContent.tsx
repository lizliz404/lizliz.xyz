"use client";

import dynamic from "next/dynamic";
import ProjectsMarquee from "@/components/ProjectsMarquee";
import ResumeEasterEgg from "@/features/resume/ResumeEasterEgg";
import { useT } from "@/i18n";
import type { ProjectMeta } from "@/lib/projects";
import { useEffect } from "react";

// Paper mesh (WebGL) + cream-lily still + cream-perlin veil. Reduced-motion: mesh unmounts, paper stays.
const HomePaperBg = dynamic(() => import("@/components/HomePaperBg"), {
  ssr: false,
});

function SectionTitle({
  children,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  as?: "h2" | "h3";
}) {
  return (
    <Tag
      className={
        Tag === "h2"
          ? "section-heading section-heading-lg"
          : "section-heading section-heading-sm"
      }
    >
      <span className="section-heading-dot" aria-hidden="true" />
      {children}
    </Tag>
  );
}

export default function HomeContent({
  projects,
}: {
  projects: ProjectMeta[];
}) {
  const t = useT();
  const siteProjects = projects.filter(
    (p) => (p.kind ?? "site") !== "skill" && p.kind !== "templates",
  );

  // Arrive from other routes via /#projects — ensure hash lands after mount.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
    const run = () => document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
    run();
    const t1 = window.setTimeout(run, 80);
    const t2 = window.setTimeout(run, 280);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <>
      {/* Mesh foam + cream-lily still (cover) + one cream-perlin tile. Pointer/click live on window. */}
      <div className="home-animation-shell" aria-hidden="true">
        <HomePaperBg className="home-animation-canvas" />
        <div className="home-paper-fiber" />
        <div className="home-paper-veil" />
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className="home-main flex flex-1 flex-col items-center pt-24 pb-16 outline-none"
      >
        <div className="w-full max-w-lg md:max-w-2xl px-6 flex flex-col gap-10 md:gap-12">
          {/* Identity + now */}
          <header id="top" className="home-content-panel home-hero-panel flex flex-col gap-5 scroll-mt-28">
            <div className="flex flex-col gap-3">
              <h1
                className="text-6xl md:text-7xl font-normal tracking-tight select-none leading-none"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                <ResumeEasterEgg>{t["site.title"]}</ResumeEasterEgg>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
                {t["site.tagline"]}
              </p>
            </div>

            <div className="home-hero-meta">
              <p className="home-now-line">
                <span className="home-now-dot" aria-hidden="true" />
                <span className="home-now-label">{t["section.now"]}</span>
                <span className="home-now-text">{t["now.text"]}</span>
              </p>
            </div>
          </header>
        </div>

        {/* Projects — full-bleed stream of shipped sites only */}
        <section
          id="projects"
          className="w-full flex flex-col gap-5 md:gap-6 scroll-mt-28 mt-10 md:mt-12"
          aria-labelledby="projects-heading"
        >
          <div className="w-full max-w-lg md:max-w-2xl mx-auto px-6">
            <div className="home-content-panel flex flex-col gap-2">
              <SectionTitle>
                <span id="projects-heading">{t["section.projects"]}</span>
              </SectionTitle>
              <p className="section-lede">{t["section.projects.lede"]}</p>
            </div>
          </div>

          <ProjectsMarquee projects={siteProjects} />
        </section>

        <footer className="w-full max-w-lg md:max-w-2xl px-6 pt-16 pb-4">
          <p className="text-sm" style={{ color: "var(--fg-secondary)", opacity: 0.56 }}>
            {t["footer.brand"]} <span style={{ opacity: 0.5 }}>© 2026</span>
          </p>
        </footer>
      </main>
    </>
  );
}
