"use client";

import { useEffect, useRef } from "react";
import { useT } from "@/i18n";
import type { ProjectMeta } from "@/lib/projects";

/**
 * Interactive projects "river": continuous R→L marquee + pointer gather.
 * Transform-only rAF ticker; no animation library.
 * Damping: current += (target - current) * (1 - exp(-λ·dt)) — skill craft rules.
 */

const TUNING = {
  /** px/s base flow (right → left). */
  speedPx: 42,
  /** Exp damp for scroll speed toward target. */
  speedK: 8,
  /** Exp damp for per-tile gather offsets. */
  gatherK: 10,
  /** Attraction radius from pointer (px). */
  gatherRadius: 160,
  /** Max pull as fraction of dx/dy toward pointer. */
  gatherStrength: 0.28,
  /** Cap absolute gather offset (px). */
  gatherMax: 28,
  /** Vertical gather is softer. */
  gatherYScale: 0.45,
  /** Hovered tile scale target. */
  hoverScale: 1.045,
  /** Scale damp λ. */
  scaleK: 12,
} as const;

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function isSameOrigin(url: string) {
  try {
    return new URL(url).hostname === "lizliz.xyz";
  } catch {
    return url.startsWith("/");
  }
}

function shortTitle(title: string) {
  const cut = title.split(/\s*[—–|]\s*/)[0]?.trim();
  return cut && cut.length > 0 ? cut : title;
}

type TileState = {
  gx: number;
  gy: number;
  scale: number;
  targetGx: number;
  targetGy: number;
  targetScale: number;
};

export default function ProjectsMarquee({ projects }: { projects: ProjectMeta[] }) {
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setWidthRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || projects.length === 0) return;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");

    let reduceMotion = reduceMq.matches;
    let finePointer = finePointerMq.matches;
    let inView = true;
    let tabVisible = document.visibilityState === "visible";
    let raf = 0;
    let lastT = 0;
    let scroll = 0;
    let speed = 0;
    let speedTarget = reduceMotion ? 0 : TUNING.speedPx;
    let pointerInside = false;
    let pointerX = 0;
    let pointerY = 0;
    let hoveredEl: HTMLElement | null = null;

    const tiles = Array.from(
      track.querySelectorAll<HTMLElement>("[data-marquee-tile]"),
    );
    const state: TileState[] = tiles.map(() => ({
      gx: 0,
      gy: 0,
      scale: 1,
      targetGx: 0,
      targetGy: 0,
      targetScale: 1,
    }));

    const measure = () => {
      // First set = half of track children when duplicated once.
      const half = Math.floor(tiles.length / 2);
      if (half <= 0) {
        setWidthRef.current = track.scrollWidth / 2;
        return;
      }
      const first = tiles[0];
      const mid = tiles[half];
      if (first && mid) {
        setWidthRef.current = mid.offsetLeft - first.offsetLeft;
      } else {
        setWidthRef.current = track.scrollWidth / 2;
      }
    };

    const applyTransforms = () => {
      track.style.transform = `translate3d(${-scroll}px, 0, 0)`;
      for (let i = 0; i < tiles.length; i++) {
        const s = state[i];
        const el = tiles[i];
        if (!s || !el) continue;
        el.style.transform = `translate3d(${s.gx}px, ${s.gy}px, 0) scale(${s.scale})`;
      }
    };

    const clearGatherTargets = () => {
      for (const s of state) {
        s.targetGx = 0;
        s.targetGy = 0;
        s.targetScale = 1;
      }
    };

    const updateGatherTargets = () => {
      if (reduceMotion || !finePointer || !pointerInside) {
        clearGatherTargets();
        if (hoveredEl) {
          const idx = tiles.indexOf(hoveredEl);
          if (idx >= 0) state[idx]!.targetScale = TUNING.hoverScale;
        }
        return;
      }

      // Hovering a card: pause flow (handled elsewhere), stabilize that card,
      // no gather drift under the cursor.
      if (hoveredEl) {
        for (let i = 0; i < tiles.length; i++) {
          const s = state[i]!;
          const el = tiles[i]!;
          if (el === hoveredEl) {
            s.targetGx = 0;
            s.targetGy = 0;
            s.targetScale = TUNING.hoverScale;
          } else {
            // Soft secondary gather toward pointer while paused on a card.
            // Subtract current gather so rect feedback doesn't compound.
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2 - s.gx;
            const cy = rect.top + rect.height / 2 - s.gy;
            const dx = pointerX - cx;
            const dy = pointerY - cy;
            const dist = Math.hypot(dx, dy);
            const falloff = Math.max(0, 1 - dist / TUNING.gatherRadius);
            const pull = falloff * falloff * TUNING.gatherStrength * 0.55;
            s.targetGx = Math.max(
              -TUNING.gatherMax,
              Math.min(TUNING.gatherMax, dx * pull),
            );
            s.targetGy = Math.max(
              -TUNING.gatherMax * TUNING.gatherYScale,
              Math.min(
                TUNING.gatherMax * TUNING.gatherYScale,
                dy * pull * TUNING.gatherYScale,
              ),
            );
            s.targetScale = 1;
          }
        }
        return;
      }

      // Pointer in banner, not on a card → gather toward pointer ("小河流" bend).
      for (let i = 0; i < tiles.length; i++) {
        const s = state[i]!;
        const el = tiles[i]!;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2 - s.gx;
        const cy = rect.top + rect.height / 2 - s.gy;
        const dx = pointerX - cx;
        const dy = pointerY - cy;
        const dist = Math.hypot(dx, dy);
        const falloff = Math.max(0, 1 - dist / TUNING.gatherRadius);
        const pull = falloff * falloff * TUNING.gatherStrength;
        s.targetGx = Math.max(
          -TUNING.gatherMax,
          Math.min(TUNING.gatherMax, dx * pull),
        );
        s.targetGy = Math.max(
          -TUNING.gatherMax * TUNING.gatherYScale,
          Math.min(
            TUNING.gatherMax * TUNING.gatherYScale,
            dy * pull * TUNING.gatherYScale,
          ),
        );
        s.targetScale = 1 + falloff * 0.02;
      }
    };

    const tick = (now: number) => {
      if (!inView || !tabVisible) {
        raf = 0;
        lastT = 0;
        return;
      }
      const dt = lastT === 0 ? 0 : Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      if (dt > 0 && !reduceMotion) {
        speedTarget = hoveredEl ? 0 : TUNING.speedPx;
        speed = damp(speed, speedTarget, TUNING.speedK, dt);
        scroll += speed * dt;
        const w = setWidthRef.current;
        if (w > 0) {
          while (scroll >= w) scroll -= w;
          while (scroll < 0) scroll += w;
        }

        updateGatherTargets();
        for (const s of state) {
          s.gx = damp(s.gx, s.targetGx, TUNING.gatherK, dt);
          s.gy = damp(s.gy, s.targetGy, TUNING.gatherK, dt);
          s.scale = damp(s.scale, s.targetScale, TUNING.scaleK, dt);
        }
        applyTransforms();
      }

      raf = requestAnimationFrame(tick);
    };

    const ensureLoop = () => {
      if (reduceMotion || !inView || !tabVisible) return;
      if (raf) return;
      lastT = 0;
      raf = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      lastT = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!finePointer || reduceMotion) return;
      pointerX = e.clientX;
      pointerY = e.clientY;
    };

    const onPointerEnter = (e: PointerEvent) => {
      if (!finePointer) return;
      pointerInside = true;
      pointerX = e.clientX;
      pointerY = e.clientY;
    };

    const onPointerLeave = () => {
      pointerInside = false;
      hoveredEl = null;
      clearGatherTargets();
      if (!reduceMotion) speedTarget = TUNING.speedPx;
    };

    const onTileEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      hoveredEl = el;
      if (!reduceMotion) speedTarget = 0;
    };

    const onTileLeave = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      if (hoveredEl === el) hoveredEl = null;
    };

    // Focus: pause flow for keyboard users; keep link navigable.
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target;
      if (t instanceof HTMLElement && t.hasAttribute("data-marquee-tile")) {
        hoveredEl = t;
        if (!reduceMotion) speedTarget = 0;
      }
    };
    const onFocusOut = () => {
      // Defer: relatedTarget may land on another tile.
      requestAnimationFrame(() => {
        const active = document.activeElement;
        if (
          active instanceof HTMLElement &&
          active.hasAttribute("data-marquee-tile") &&
          track.contains(active)
        ) {
          hoveredEl = active;
        } else {
          hoveredEl = null;
        }
      });
    };

    for (const el of tiles) {
      el.addEventListener("pointerenter", onTileEnter);
      el.addEventListener("pointerleave", onTileLeave);
    }
    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerenter", onPointerEnter);
    root.addEventListener("pointerleave", onPointerLeave);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = !!entry?.isIntersecting;
        if (inView) ensureLoop();
        else stopLoop();
      },
      { threshold: 0 },
    );
    io.observe(root);

    const onVisibility = () => {
      tabVisible = document.visibilityState === "visible";
      if (tabVisible) {
        lastT = 0;
        ensureLoop();
      } else {
        stopLoop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      measure();
    });
    ro.observe(track);
    measure();

    const onReduceChange = () => {
      reduceMotion = reduceMq.matches;
      if (reduceMotion) {
        speed = 0;
        speedTarget = 0;
        scroll = 0;
        clearGatherTargets();
        for (const s of state) {
          s.gx = 0;
          s.gy = 0;
          s.scale = 1;
        }
        applyTransforms();
        stopLoop();
      } else {
        speedTarget = TUNING.speedPx;
        ensureLoop();
      }
    };
    const onPointerMq = () => {
      finePointer = finePointerMq.matches;
      if (!finePointer) {
        clearGatherTargets();
        pointerInside = false;
        hoveredEl = null;
      }
    };
    reduceMq.addEventListener("change", onReduceChange);
    finePointerMq.addEventListener("change", onPointerMq);

    if (!reduceMotion) ensureLoop();
    else applyTransforms();

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMq.removeEventListener("change", onReduceChange);
      finePointerMq.removeEventListener("change", onPointerMq);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerenter", onPointerEnter);
      root.removeEventListener("pointerleave", onPointerLeave);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      for (const el of tiles) {
        el.removeEventListener("pointerenter", onTileEnter);
        el.removeEventListener("pointerleave", onTileLeave);
      }
    };
  }, [projects]);

  if (projects.length === 0) return null;

  // Duplicate once for seamless loop. Second set is aria-hidden.
  const sets = [0, 1] as const;

  return (
    <div
      ref={rootRef}
      className="projects-marquee"
      role="region"
      aria-label={t["section.projects"]}
    >
      <div ref={trackRef} className="projects-marquee-track">
        {sets.map((setIndex) => (
          <div
            key={setIndex}
            className="projects-marquee-set"
            {...(setIndex === 1 ? { "aria-hidden": true } : {})}
          >
            {projects.map((project) => {
              const sameOrigin = isSameOrigin(project.url);
              const label = shortTitle(project.title);
              return (
                <a
                  key={`${setIndex}-${project.url}`}
                  href={project.url}
                  {...(sameOrigin
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="projects-marquee-tile"
                  data-marquee-tile=""
                  aria-label={project.title}
                  tabIndex={setIndex === 1 ? -1 : undefined}
                >
                  <span className="projects-marquee-icon" aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.iconUrl}
                      alt=""
                      width="28"
                      height="28"
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className="projects-marquee-title">{label}</span>
                  <span className="projects-marquee-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
