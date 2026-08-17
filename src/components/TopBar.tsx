"use client";

import Link from "next/link";
import { ArrowTopRightOnSquareIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import SiteSwitcher from "./SiteSwitcher";
import { usePathname, useRouter } from "next/navigation";
import { useT } from "@/i18n";
import { ICON } from "@/lib/icons";
import { useEffect, useRef, useState, type MouseEvent } from "react";

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) return false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  window.history.replaceState(null, "", hash);
  return true;
}

export default function TopBar() {
  const t = useT();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/" || pathname === "";
  const isWriting =
    pathname.startsWith("/articles") || pathname.startsWith("/podcast");
  const isSkills =
    pathname.startsWith("/skills") || pathname.startsWith("/templates");
  const [onProjectsHash, setOnProjectsHash] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const connectRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const sync = () => {
      setOnProjectsHash(isHome && window.location.hash === "#projects");
    };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, [isHome]);

  useEffect(() => {
    const menu = connectRef.current;
    if (!menu) return;
    const syncOpen = () => setConnectOpen(menu.open);
    syncOpen();
    menu.addEventListener("toggle", syncOpen);
    return () => menu.removeEventListener("toggle", syncOpen);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const menu = connectRef.current;
      if (!menu?.open) return;
      menu.open = false;
      menu.querySelector("summary")?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      const menu = connectRef.current;
      if (!menu?.open) return;
      if (menu.contains(e.target as Node)) return;
      menu.open = false;
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  function goHomeIdentity() {
    setOnProjectsHash(false);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    window.history.replaceState(null, "", "/");
  }

  function goProjects() {
    scrollToHash("#projects");
    setOnProjectsHash(true);
  }

  function onHome(e: MouseEvent<HTMLAnchorElement>) {
    if (!isHome) return;
    e.preventDefault();
    goHomeIdentity();
  }

  function onProjects(e: MouseEvent<HTMLAnchorElement>) {
    if (isHome) {
      e.preventDefault();
      goProjects();
      return;
    }
    e.preventDefault();
    router.push("/#projects");
    window.setTimeout(goProjects, 0);
    window.setTimeout(goProjects, 120);
    window.setTimeout(goProjects, 320);
  }

  if (pathname === "/resume.pdf") return null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: "color-mix(in oklab, var(--bg) 92%, transparent)",
        borderBottom: "1px solid color-mix(in oklab, var(--border-color) 72%, transparent)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div className="site-header-inner mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 min-[860px]:gap-4 min-[860px]:px-6">
        <div className="site-header-lead flex min-w-0 flex-1 items-center gap-3 min-[860px]:gap-8">
          <Link
            href="/"
            onClick={onHome}
            aria-current={isHome && !onProjectsHash ? "page" : undefined}
            className="shrink-0 text-xl font-normal tracking-tight no-underline hover:opacity-70 transition-opacity min-[860px]:text-2xl"
            style={{ color: "var(--fg)", fontFamily: "var(--font-instrument-serif)" }}
          >
            {t["site.title"]}
          </Link>

          <nav aria-label={t["nav.primary"]} className="home-section-nav">
            <a
              href="/#projects"
              className="home-section-nav-link"
              onClick={onProjects}
              aria-current={onProjectsHash ? "location" : undefined}
            >
              {t["nav.projects"]}
            </a>
            <Link
              href="/articles/"
              className="home-section-nav-link"
              aria-current={isWriting ? "page" : undefined}
            >
              {t["nav.writing"]}
            </Link>
            <Link
              href="/skills/"
              className="home-section-nav-link"
              aria-current={isSkills ? "page" : undefined}
            >
              {t["nav.skills"]}
            </Link>
            <details ref={connectRef} className="home-connect-menu">
              <summary
                className="home-section-nav-link"
                aria-haspopup="menu"
                aria-expanded={connectOpen}
              >
                {t["nav.connect"]}
                <ChevronDownIcon className={`${ICON} home-connect-chevron`} aria-hidden="true" />
              </summary>
              <div className="home-connect-panel" role="menu">
                <a href="https://github.com/lizliz404" target="_blank" rel="noopener noreferrer" role="menuitem">
                  GitHub
                  <ArrowTopRightOnSquareIcon className={ICON} aria-hidden="true" />
                </a>
                <a href="https://x.com/lizliz404" target="_blank" rel="noopener noreferrer" role="menuitem">
                  X
                  <ArrowTopRightOnSquareIcon className={ICON} aria-hidden="true" />
                </a>
                <a href="https://okjk.co/znTaA1" target="_blank" rel="noopener noreferrer" role="menuitem">
                  即刻
                  <ArrowTopRightOnSquareIcon className={ICON} aria-hidden="true" />
                </a>
              </div>
            </details>
          </nav>
        </div>

        <div className="site-header-tools shrink-0">
          <SiteSwitcher />
        </div>
      </div>
    </header>
  );
}
