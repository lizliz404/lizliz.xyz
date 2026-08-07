"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useT } from "@/i18n";
import type { ProjectMeta } from "@/lib/projects";

/**
 * Full-bleed projects stream: two rows, unified speed, OG hover/long-press popup.
 * Idle tiles = favicon + title only; OG image + description live in the popup.
 * Transform-only rAF; flow does NOT pause on hover (Liz 2026-08 feedback).
 * Speed MUST be uniform across all tiles — per-tile/row speed diffs cause
 * same-row stacking (faster card catches up to slower). Variety comes from
 * hash gaps, row phaseShift, and Y jitter/bob only.
 * Touch: long-press (~600ms) ≡ hover OG popup (not browser link preview).
 * Damping: current += (target - current) * (1 - exp(-λ·dt)).
 */

const TUNING = {
  rows: 2,
  /** How many full project-set copies per row (fills ultrawide). */
  copies: 3,
  /**
   * Single shared drift speed (px/s). Do not reintroduce per-tile jitter,
   * per-row scale, or sin speed wobble — same-row speed variance → stacking.
   */
  speedBase: 36,
  gapMin: 16,
  gapMax: 44,
  bandPadY: 14,
  rowGap: 16,
  /** Visual Y bob amplitude (px). Does not change horizontal speed. */
  bobAmp: 2.5,
  /** Hover lift scale (stream keeps moving). */
  hoverScale: 1.04,
  scaleK: 14,
} as const;

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function hash01(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
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

type StreamInstance = {
  key: string;
  project: ProjectMeta;
  row: number;
  copy: number;
  primary: boolean;
  gapAfter: number;
  phase: number;
};

type FloaterRuntime = {
  x: number;
  y: number;
  baseY: number;
  w: number;
  h: number;
  speed: number;
  scale: number;
  targetScale: number;
  el: HTMLElement;
  inst: StreamInstance;
};

function buildInstances(projects: ProjectMeta[]): StreamInstance[] {
  if (projects.length === 0) return [];
  const out: StreamInstance[] = [];
  for (let row = 0; row < TUNING.rows; row++) {
    const rowProjects = projects.filter((_, i) => i % TUNING.rows === row);
    const pool = rowProjects.length > 0 ? rowProjects : projects;
    for (let copy = 0; copy < TUNING.copies; copy++) {
      for (let i = 0; i < pool.length; i++) {
        const project = pool[i]!;
        const seed = `${project.url}|r${row}|c${copy}|i${i}`;
        const u = hash01(seed);
        out.push({
          key: seed,
          project,
          row,
          copy,
          primary: false,
          gapAfter: TUNING.gapMin + u * (TUNING.gapMax - TUNING.gapMin),
          phase: u * Math.PI * 2,
        });
      }
    }
  }

  const seen = new Set<string>();
  for (const inst of out) {
    if (!seen.has(inst.project.url)) {
      inst.primary = true;
      seen.add(inst.project.url);
    } else {
      inst.primary = false;
    }
  }
  return out;
}

function fillPopup(popup: HTMLDivElement, project: ProjectMeta | null) {
  const media = popup.querySelector<HTMLElement>("[data-popup-media]");
  const img = popup.querySelector<HTMLImageElement>("[data-popup-img]");
  const title = popup.querySelector<HTMLElement>("[data-popup-title]");
  const desc = popup.querySelector<HTMLElement>("[data-popup-desc]");
  if (!media || !img || !title || !desc) return;

  if (!project) {
    popup.dataset.show = "0";
    return;
  }

  title.textContent = project.title;
  desc.textContent = project.description;
  if (project.ogImage) {
    media.hidden = false;
    media.dataset.loaded = "0";
    if (img.src !== project.ogImage) {
      img.removeAttribute("src");
      img.src = project.ogImage;
    } else if (img.complete && img.naturalWidth > 0) {
      media.dataset.loaded = "1";
    }
  } else {
    media.hidden = true;
    media.dataset.loaded = "0";
    img.removeAttribute("src");
  }
  popup.dataset.show = "1";
}

export default function ProjectsMarquee({ projects }: { projects: ProjectMeta[] }) {
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  // Portal the popup to <body> after mount: escapes the band's mask/overflow clipping,
  // so it can float over page content like a real tooltip.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const instances = useMemo(() => buildInstances(projects), [projects]);
  const projectByUrl = useMemo(() => {
    const m = new Map<string, ProjectMeta>();
    for (const p of projects) m.set(p.url, p);
    return m;
  }, [projects]);

  useEffect(() => {
    const root = rootRef.current;
    const popup = popupRef.current;
    if (!root || !popup || instances.length === 0) return;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");

    let reduceMotion = reduceMq.matches;
    let finePointer = finePointerMq.matches;
    let inView = true;
    let tabVisible = document.visibilityState === "visible";
    let raf = 0;
    let lastT = 0;
    let clock = 0;
    let hoveredEl: HTMLElement | null = null;

    const tileEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-stream-tile]"),
    );
    const byKey = new Map(instances.map((inst) => [inst.key, inst]));

    const floaters: FloaterRuntime[] = [];
    for (const el of tileEls) {
      const key = el.dataset.streamKey;
      if (!key) continue;
      const inst = byKey.get(key);
      if (!inst) continue;
      // Static-export hydration can finish AFTER images loaded/failed — the
      // load/error events already fired pre-hydration, so backfill both states.
      const im = el.querySelector("img");
      if (im) {
        if (im.complete && im.naturalWidth > 0) im.classList.add("is-loaded");
        else if (im.complete) {
          // Failed before hydration: mirror the onError fallback (letter chip).
          im.style.display = "none";
          im.parentElement?.setAttribute("data-failed", "1");
        }
      }
      floaters.push({
        x: 0,
        y: 0,
        baseY: 0,
        w: 0,
        h: 0,
        speed: TUNING.speedBase,
        scale: 1,
        targetScale: 1,
        el,
        inst,
      });
    }

    const measureTiles = () => {
      for (const f of floaters) {
        f.w = f.el.offsetWidth;
        f.h = f.el.offsetHeight;
      }
    };

    const applyTransforms = () => {
      for (const f of floaters) {
        f.el.style.transform = `translate3d(${f.x}px, ${f.y}px, 0) scale(${f.scale})`;
      }
    };

    const layoutInitial = () => {
      const bandW = root.clientWidth;
      const bandH = root.clientHeight;
      const pad = TUNING.bandPadY;
      const usableH = Math.max(0, bandH - pad * 2 - TUNING.rowGap);
      const rowH = usableH / TUNING.rows;

      measureTiles();

      for (let row = 0; row < TUNING.rows; row++) {
        const rowFloaters = floaters.filter((f) => f.inst.row === row);
        const phaseShift = -hash01(`row-start-${row}`) * bandW * 0.85;
        let x = phaseShift;
        for (const f of rowFloaters) {
          f.x = x;
          const j = (hash01(f.inst.key + "|y") - 0.5) * 12;
          f.baseY = pad + row * (rowH + TUNING.rowGap) + (rowH - f.h) / 2 + j;
          f.y = f.baseY;
          // Uniform speed — gaps/phase/Y provide variety without same-row catch-up.
          f.speed = TUNING.speedBase;
          x += f.w + f.inst.gapAfter;
        }
      }
      applyTransforms();
    };

    // Uniform speed → constant gaps → wrap never stacks; recycle off-left to row tail.
    const wrapFloaters = () => {
      for (let row = 0; row < TUNING.rows; row++) {
        const rowFloaters = floaters.filter((f) => f.inst.row === row);
        if (rowFloaters.length === 0) continue;

        for (const f of rowFloaters) {
          if (f.x + f.w < -40) {
            let maxRight = -Infinity;
            for (const o of rowFloaters) {
              if (o === f) continue;
              maxRight = Math.max(maxRight, o.x + o.w);
            }
            if (!Number.isFinite(maxRight)) maxRight = root.clientWidth;
            f.x = maxRight + f.inst.gapAfter;
          }
        }
      }
    };

    const updatePopupPosition = () => {
      // Allow both fine-pointer hover and touch long-press (finePointer not required).
      if (!hoveredEl || reduceMotion) {
        popup.dataset.show = "0";
        return;
      }
      const rect = hoveredEl.getBoundingClientRect();
      const pw = popup.offsetWidth || 280;
      const ph = popup.offsetHeight || 160;
      // Viewport coords (popup is portaled to <body>, position: fixed).
      let left = rect.left + rect.width / 2 - pw / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
      const above = rect.top - ph - 12;
      const below = rect.bottom + 12;
      let top;
      if (above >= 8) top = above;
      else if (below + ph <= window.innerHeight - 8) top = below;
      else top = Math.max(8, Math.min(above, window.innerHeight - ph - 8));
      popup.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      popup.dataset.show = "1";
    };

    const showPopupFor = (el: HTMLElement) => {
      const url = el.dataset.projectUrl;
      const project = url ? projectByUrl.get(url) ?? null : null;
      fillPopup(popup, project);
      updatePopupPosition();
    };

    const hidePopup = () => {
      fillPopup(popup, null);
    };

    const popupImg = popup.querySelector<HTMLImageElement>("[data-popup-img]");
    const popupMedia = popup.querySelector<HTMLElement>("[data-popup-media]");
    const onPopupImgLoad = () => {
      if (popupMedia) popupMedia.dataset.loaded = "1";
    };
    const onPopupImgError = () => {
      if (popupMedia) {
        popupMedia.dataset.loaded = "error";
        popupMedia.hidden = true;
      }
    };
    popupImg?.addEventListener("load", onPopupImgLoad);
    popupImg?.addEventListener("error", onPopupImgError);

    const tick = (now: number) => {
      if (!inView || !tabVisible || reduceMotion) {
        raf = 0;
        lastT = 0;
        return;
      }
      const dt = lastT === 0 ? 0 : Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      clock += dt;

      if (dt > 0) {
        for (const f of floaters) {
          f.x -= f.speed * dt;
          f.y =
            f.baseY +
            Math.sin(clock * 0.85 + f.inst.phase) * TUNING.bobAmp;
          f.targetScale = f.el === hoveredEl ? TUNING.hoverScale : 1;
          f.scale = damp(f.scale, f.targetScale, TUNING.scaleK, dt);
        }
        wrapFloaters();
        applyTransforms();
        if (hoveredEl) updatePopupPosition();
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

    const onTileEnter = (e: Event) => {
      if (!finePointer) return;
      const el = e.currentTarget as HTMLElement;
      hoveredEl = el;
      showPopupFor(el);
    };
    const onTileLeave = (e: Event) => {
      if (!finePointer) return;
      const el = e.currentTarget as HTMLElement;
      if (hoveredEl === el) {
        hoveredEl = null;
        hidePopup();
      }
    };
    const onFocusIn = (e: FocusEvent) => {
      // Keyboard focus only — touch taps focus links as a side effect and
      // would re-open the popup right after long-press release.
      if (!finePointer) return;
      const tEl = e.target;
      if (tEl instanceof HTMLElement && tEl.hasAttribute("data-stream-tile")) {
        hoveredEl = tEl;
        showPopupFor(tEl);
      }
    };
    const onFocusOut = () => {
      if (!finePointer) return;
      requestAnimationFrame(() => {
        const active = document.activeElement;
        if (
          active instanceof HTMLElement &&
          active.hasAttribute("data-stream-tile") &&
          root.contains(active)
        ) {
          hoveredEl = active;
          showPopupFor(active);
        } else {
          hoveredEl = null;
          hidePopup();
        }
      });
    };

    // Touch long-press ≡ hover OG popup (not browser link preview / context menu).
    const LONG_PRESS_MS = 600;
    const MOVE_CANCEL_PX = 10;
    let longPressTimer: number | null = null;
    let longPressActive = false;
    let suppressClick = false;
    let pressStartX = 0;
    let pressStartY = 0;
    let pressEl: HTMLElement | null = null;

    const clearLongPressTimer = () => {
      if (longPressTimer != null) {
        window.clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (finePointer) return;
      if (e.pointerType === "mouse") return;
      const el = e.currentTarget as HTMLElement;
      pressEl = el;
      pressStartX = e.clientX;
      pressStartY = e.clientY;
      longPressActive = false;
      clearLongPressTimer();
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore — capture optional */
      }
      longPressTimer = window.setTimeout(() => {
        longPressTimer = null;
        longPressActive = true;
        suppressClick = true;
        hoveredEl = el;
        showPopupFor(el);
      }, LONG_PRESS_MS);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (finePointer || longPressTimer == null) return;
      const dx = e.clientX - pressStartX;
      const dy = e.clientY - pressStartY;
      if (dx * dx + dy * dy > MOVE_CANCEL_PX * MOVE_CANCEL_PX) {
        clearLongPressTimer();
      }
    };

    const endLongPressGesture = () => {
      clearLongPressTimer();
      if (longPressActive) {
        longPressActive = false;
        if (hoveredEl && (!pressEl || hoveredEl === pressEl)) {
          hoveredEl = null;
          hidePopup();
        }
      }
      pressEl = null;
    };

    const onPointerUp = () => {
      if (finePointer) return;
      endLongPressGesture();
    };

    const onPointerCancel = () => {
      if (finePointer) return;
      clearLongPressTimer();
      if (longPressActive) {
        longPressActive = false;
        if (hoveredEl && (!pressEl || hoveredEl === pressEl)) {
          hoveredEl = null;
          hidePopup();
        }
      }
      pressEl = null;
      suppressClick = false;
    };

    const onTileClick = (e: MouseEvent) => {
      if (!suppressClick) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
    };

    const onContextMenu = (e: Event) => {
      // Kill the browser's native long-press menu ONLY on touch — desktop
      // right-click (new tab / copy link) stays native.
      if (!finePointer) e.preventDefault();
    };

    for (const f of floaters) {
      f.el.addEventListener("pointerenter", onTileEnter);
      f.el.addEventListener("pointerleave", onTileLeave);
      f.el.addEventListener("pointerdown", onPointerDown);
      f.el.addEventListener("pointermove", onPointerMove);
      f.el.addEventListener("pointerup", onPointerUp);
      f.el.addEventListener("pointercancel", onPointerCancel);
      f.el.addEventListener("click", onTileClick, true);
      f.el.addEventListener("contextmenu", onContextMenu);
    }
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    root.addEventListener("contextmenu", onContextMenu);

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
      } else stopLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      layoutInitial();
    });
    ro.observe(root);

    const onReduceChange = () => {
      reduceMotion = reduceMq.matches;
      root.dataset.reduced = reduceMotion ? "1" : "0";
      if (reduceMotion) {
        stopLoop();
        for (const f of floaters) {
          f.el.style.transform = "";
          f.scale = 1;
        }
        hidePopup();
      } else {
        layoutInitial();
        ensureLoop();
      }
    };
    const onPointerMq = () => {
      finePointer = finePointerMq.matches;
      if (!finePointer) {
        hoveredEl = null;
        hidePopup();
      }
    };
    reduceMq.addEventListener("change", onReduceChange);
    finePointerMq.addEventListener("change", onPointerMq);

    root.dataset.reduced = reduceMotion ? "1" : "0";
    layoutInitial();
    if (!reduceMotion) ensureLoop();

    return () => {
      stopLoop();
      clearLongPressTimer();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMq.removeEventListener("change", onReduceChange);
      finePointerMq.removeEventListener("change", onPointerMq);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      root.removeEventListener("contextmenu", onContextMenu);
      popupImg?.removeEventListener("load", onPopupImgLoad);
      popupImg?.removeEventListener("error", onPopupImgError);
      for (const f of floaters) {
        f.el.removeEventListener("pointerenter", onTileEnter);
        f.el.removeEventListener("pointerleave", onTileLeave);
        f.el.removeEventListener("pointerdown", onPointerDown);
        f.el.removeEventListener("pointermove", onPointerMove);
        f.el.removeEventListener("pointerup", onPointerUp);
        f.el.removeEventListener("pointercancel", onPointerCancel);
        f.el.removeEventListener("click", onTileClick, true);
        f.el.removeEventListener("contextmenu", onContextMenu);
      }
    };
  }, [instances, projectByUrl, mounted]);

  if (projects.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className="projects-marquee"
      role="region"
      aria-label={t["section.projects"]}
    >
      <div className="projects-marquee-stage">
        {instances.map((inst) => {
          const { project } = inst;
          const sameOrigin = isSameOrigin(project.url);
          const label = shortTitle(project.title);
          const letter = (label.charAt(0) || "?").toUpperCase();
          return (
            <a
              key={inst.key}
              href={project.url}
              {...(sameOrigin
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              className="projects-marquee-tile"
              data-stream-tile=""
              data-stream-key={inst.key}
              data-project-url={project.url}
              data-row={inst.row}
              aria-label={project.title}
              tabIndex={inst.primary ? undefined : -1}
              {...(inst.primary ? {} : { "aria-hidden": true })}
            >
              <span
                className="projects-marquee-icon"
                aria-hidden="true"
                data-letter={letter}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.iconUrl}
                  alt=""
                  width="28"
                  height="28"
                  loading="lazy"
                  decoding="async"
                  onLoad={(e) => {
                    e.currentTarget.classList.add("is-loaded");
                    e.currentTarget.parentElement?.removeAttribute("data-failed");
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement?.setAttribute("data-failed", "1");
                  }}
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

      {mounted &&
        createPortal(
          <div
            ref={popupRef}
            className="projects-marquee-popup"
            data-show="0"
            aria-hidden="true"
          >
            <span className="projects-marquee-popup-media" data-popup-media hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-popup-img alt="" width="640" height="336" decoding="async" />
            </span>
            <span className="projects-marquee-popup-body">
              <span className="projects-marquee-popup-title" data-popup-title />
              <span className="projects-marquee-popup-desc" data-popup-desc />
            </span>
          </div>,
          document.body,
        )}
    </div>
  );
}
