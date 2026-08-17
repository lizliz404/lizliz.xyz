"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { useT, useLang } from "@/i18n";
import type { ProjectMeta } from "@/lib/projects";
import type { SkillMeta } from "@/lib/skills";

type StreamVariant = "projects" | "skills";

const TUNING = {
  variants: {
    projects: {
      topology: {
        rows: 2,
        directions: [-1, -1],
        phaseRatios: [0.08, 0.43],
      },
      transport: {
        runtime: "track",
        laneSpeeds: [36, 36],
        maxDt: 0.05,
      },
      interaction: {
        touchPreview: "peek",
        longPressMs: 600,
        moveCancelPx: 10,
      },
      presentation: {
        bandPadY: 14,
        rowGap: 16,
        gapMin: 16,
        gapMax: 44,
        yJitter: 6,
        hoverScale: 1.04,
      },
    },
    skills: {
      topology: {
        rows: 1,
        directions: [-1],
        phaseRatios: [0.18],
      },
      transport: {
        runtime: "track",
        laneSpeeds: [24],
        maxDt: 0.05,
      },
      interaction: {
        touchPreview: "peek",
        longPressMs: 600,
        moveCancelPx: 10,
      },
      presentation: {
        bandPadY: 12,
        rowGap: 0,
        gapMin: 20,
        gapMax: 48,
        yJitter: 3,
        hoverScale: 1.035,
      },
    },
  },
} as const;

type StreamTuning = (typeof TUNING.variants)[StreamVariant];

type LaneItem = {
  project: ProjectMeta;
  gapAfter: number;
  yOffset: number;
};

type StreamLane = {
  row: number;
  items: LaneItem[];
};

type LayoutState = {
  ready: boolean;
  eligible: boolean;
  cycleWidths: number[];
};

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

function buildLanes(projects: ProjectMeta[], tuning: StreamTuning): StreamLane[] {
  const lanes: StreamLane[] = [];
  for (let row = 0; row < tuning.topology.rows; row++) {
    const rowProjects = projects.filter((_, index) => index % tuning.topology.rows === row);
    const pool = rowProjects.length > 0 ? rowProjects : projects;
    lanes.push({
      row,
      items: pool.map((project, index) => {
        const seed = `${project.url}|r${row}|i${index}`;
        return {
          project,
          gapAfter:
            tuning.presentation.gapMin +
            hash01(`${seed}|gap`) *
              (tuning.presentation.gapMax - tuning.presentation.gapMin),
          yOffset:
            (hash01(`${seed}|y`) - 0.5) * tuning.presentation.yJitter * 2,
        };
      }),
    });
  }
  return lanes;
}

function fillPopup(
  popup: HTMLDivElement,
  project: ProjectMeta | null,
  skillsContent?: Map<string, SkillMeta>,
  lang?: "en" | "zh",
) {
  const media = popup.querySelector<HTMLElement>("[data-popup-media]");
  const img = popup.querySelector<HTMLImageElement>("[data-popup-img]");
  const title = popup.querySelector<HTMLElement>("[data-popup-title]");
  const desc = popup.querySelector<HTMLElement>("[data-popup-desc]");
  const skills = popup.querySelector<HTMLElement>("[data-popup-skills]");
  const tagline = popup.querySelector<HTMLElement>("[data-popup-tagline]");
  const features = popup.querySelector<HTMLElement>("[data-popup-features]");
  if (!media || !img || !title || !desc || !skills || !tagline || !features) return;

  if (!project) {
    popup.dataset.show = "0";
    popup.setAttribute("aria-hidden", "true");
    return;
  }

  const skillEntry =
    project.kind === "skill" ? skillsContent?.get(project.url) : undefined;

  if (skillEntry) {
    // Skills have no website/OG image — the popup renders the accordion copy
    // (tagline + feature bullets) instead of a media card.
    media.hidden = true;
    media.dataset.loaded = "0";
    img.removeAttribute("src");
    title.textContent = skillEntry.name;
    desc.hidden = true;
    const zh = lang === "zh";
    tagline.textContent = zh ? skillEntry.taglineZh : skillEntry.tagline;
    features.textContent = "";
    for (const feature of zh ? skillEntry.featuresZh : skillEntry.features) {
      const row = document.createElement("span");
      row.className = "projects-marquee-popup-feature";
      if (feature.label) {
        const label = document.createElement("b");
        label.textContent = feature.label;
        row.append(label, " ");
      }
      row.append(document.createTextNode(feature.text));
      features.append(row);
    }
    skills.hidden = false;
    popup.dataset.skills = "1";
  } else {
    skills.hidden = true;
    delete popup.dataset.skills;
    desc.hidden = false;
    title.textContent = project.title;
    desc.textContent = project.description;
    if (project.ogImage) {
      media.hidden = false;
      media.dataset.loaded = "0";
      if (img.src !== project.ogImage) {
        img.removeAttribute("src");
        img.src = project.ogImage;
      }
      if (img.complete) {
        if (img.naturalWidth > 0) media.dataset.loaded = "1";
        else {
          media.dataset.loaded = "error";
          media.hidden = true;
        }
      }
    } else {
      media.hidden = true;
      media.dataset.loaded = "0";
      img.removeAttribute("src");
    }
  }
  popup.dataset.show = "1";
  popup.setAttribute("aria-hidden", "false");
}

function sameNumbers(a: number[], b: number[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export default function ProjectsMarquee({
  projects,
  variant = "projects",
  skillsContent,
}: {
  projects: ProjectMeta[];
  variant?: StreamVariant;
  skillsContent?: Map<string, SkillMeta>;
}) {
  const t = useT();
  const { lang } = useLang();
  const popupId = useId();
  const tuning = TUNING.variants[variant];
  const [reduced, setReduced] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    const onVis = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      mq.removeEventListener("change", onChange);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  const rootRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<Array<HTMLDivElement | null>>([]);
  const offsetsRef = useRef<number[]>([]);
  const popupMotionRef = useRef({
    active: false,
    hovered: false,
    row: 0,
    left: 0,
    top: 0,
  });
  const [mounted, setMounted] = useState(false);
  const [repeats, setRepeats] = useState<number[]>([]);
  const [layout, setLayout] = useState<LayoutState>({
    ready: false,
    eligible: false,
    cycleWidths: [],
  });

  useEffect(() => setMounted(true), []);

  const lanes = useMemo(() => buildLanes(projects, tuning), [projects, tuning]);
  const projectByUrl = useMemo(() => {
    const map = new Map<string, ProjectMeta>();
    for (const project of projects) map.set(project.url, project);
    return map;
  }, [projects]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || lanes.length === 0) return;

    let measureFrame = 0;
    const measure = () => {
      const viewportWidth = root.clientWidth;
      if (viewportWidth <= 0) return;

      let maxTileWidth = 0;
      const cycleWidths = lanes.map((lane) => {
        const shells = Array.from(
          root.querySelectorAll<HTMLElement>(
            `[data-stream-shell][data-row="${lane.row}"][data-copy="0"]`,
          ),
        );
        let width = 0;
        for (let index = 0; index < shells.length; index++) {
          const tileWidth = shells[index]?.offsetWidth ?? 0;
          maxTileWidth = Math.max(maxTileWidth, tileWidth);
          width += tileWidth + (lane.items[index]?.gapAfter ?? 0);
        }
        return Math.round(width);
      });

      if (cycleWidths.some((width) => width <= 0)) return;

      // A repeated URL sits one cycle apart. The stream stays motion-capable as
      // long as that spacing clears ~2 tiles (marquee-normal second lap); only
      // truly sparse cycles (2-3 tiles) must fall back to static. Measured
      // against maxTileWidth so the check scales with tile size.
      const eligible = cycleWidths.every(
        (cycleWidth) => cycleWidth > maxTileWidth * 2 + tuning.presentation.gapMax,
      );
      const overscan = maxTileWidth + tuning.presentation.gapMax;
      const nextRepeats = cycleWidths.map((cycleWidth) =>
        eligible
          ? Math.max(2, Math.ceil((viewportWidth + overscan) / cycleWidth) + 1)
          : 1,
      );

      setRepeats((current) => (sameNumbers(current, nextRepeats) ? current : nextRepeats));
      setLayout((current) => {
        if (
          current.ready &&
          current.eligible === eligible &&
          sameNumbers(current.cycleWidths, cycleWidths)
        ) {
          return current;
        }
        return { ready: true, eligible, cycleWidths };
      });
    };

    measureFrame = requestAnimationFrame(measure);
    // Tile widths depend on fonts; re-measure once they settle so eligibility
    // and derived repeats use stable geometry (fonts.ready is never pending).
    document.fonts?.ready?.then(() => {
      if (rootRef.current) requestAnimationFrame(measure);
    });
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(root);
    return () => {
      cancelAnimationFrame(measureFrame);
      resizeObserver.disconnect();
    };
  }, [lanes, tuning.presentation.gapMax]);

  const staticMode = !layout.ready || !layout.eligible || reduced;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const clearTrackTransforms = () => {
      for (const track of trackRefs.current) {
        if (track) track.style.transform = "";
      }
    };

    if (staticMode) {
      clearTrackTransforms();
      return;
    }
    if (!pageVisible || paused) return;

    let inView = false;
    let raf = 0;
    let lastTime = 0;

    for (let row = 0; row < lanes.length; row++) {
      const cycleWidth = layout.cycleWidths[row] ?? 0;
      if (cycleWidth <= 0) continue;
      const current = offsetsRef.current[row];
      if (current == null || !Number.isFinite(current)) {
        offsetsRef.current[row] =
          (tuning.topology.phaseRatios[row] ?? 0) * cycleWidth;
      } else {
        offsetsRef.current[row] = current % cycleWidth;
      }
    }

    const stopLoop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      lastTime = 0;
    };

    const tick = (now: number) => {
      if (!inView) {
        stopLoop();
        return;
      }
      const dt =
        lastTime === 0
          ? 0
          : Math.min((now - lastTime) / 1000, tuning.transport.maxDt);
      lastTime = now;

      if (dt > 0) {
        // Lane tracks preserve order by construction. Never reintroduce
        // per-tile X speeds: they require a real collision policy.
        for (let row = 0; row < lanes.length; row++) {
          const track = trackRefs.current[row];
          const cycleWidth = layout.cycleWidths[row] ?? 0;
          if (!track || cycleWidth <= 0) continue;
          const speed = tuning.transport.laneSpeeds[row] ?? 0;
          const direction = tuning.topology.directions[row] ?? -1;
          const offset =
            ((offsetsRef.current[row] ?? 0) + speed * dt) % cycleWidth;
          offsetsRef.current[row] = offset;
          const x = direction < 0 ? -offset : -cycleWidth + offset;
          track.style.transform = `translate3d(${x}px, 0, 0)`;
        }

        const popupMotion = popupMotionRef.current;
        const popup = popupRef.current;
        if (popupMotion.active && !popupMotion.hovered && popup) {
          const row = popupMotion.row;
          const speed = tuning.transport.laneSpeeds[row] ?? 0;
          const direction = tuning.topology.directions[row] ?? -1;
          popupMotion.left += direction < 0 ? -speed * dt : speed * dt;
          popup.style.transform = `translate3d(${popupMotion.left}px, ${popupMotion.top}px, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (raf || !inView) return;
      lastTime = 0;
      raf = requestAnimationFrame(tick);
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = !!entry?.isIntersecting;
        if (inView) startLoop();
        else stopLoop();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(root);

    return () => {
      stopLoop();
      intersectionObserver.disconnect();
    };
  }, [lanes, layout.cycleWidths, pageVisible, paused, staticMode, tuning]);

  useEffect(() => {
    const root = rootRef.current;
    const popup = popupRef.current;
    if (!root || !popup || lanes.length === 0) return;

    const finePointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    let finePointer = finePointerMq.matches;
    let activeEl: HTMLElement | null = null;
    let dismissedEl: HTMLElement | null = null;

    const tileEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-stream-tile]"),
    );

    // Hydration may occur after image load/error. Backfill both terminal states.
    for (const tile of tileEls) {
      const image = tile.querySelector("img");
      if (!image?.complete) continue;
      if (image.naturalWidth > 0) image.classList.add("is-loaded");
      else {
        image.style.display = "none";
        image.parentElement?.setAttribute("data-failed", "1");
      }
    }

    const positionPopup = () => {
      if (!activeEl || popup.dataset.show !== "1") return;
      const rect = activeEl.getBoundingClientRect();
      const popupWidth = popup.offsetWidth || 280;
      const popupHeight = popup.offsetHeight || 160;
      let left = rect.left + rect.width / 2 - popupWidth / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - popupWidth - 8));
      const above = rect.top - popupHeight;
      const below = rect.bottom;
      const top =
        above >= 8
          ? above
          : below + popupHeight <= window.innerHeight - 8
            ? below
            : Math.max(8, Math.min(above, window.innerHeight - popupHeight - 8));
      popupMotionRef.current.active = true;
      popupMotionRef.current.row = Number(activeEl.dataset.row ?? 0);
      popupMotionRef.current.left = left;
      popupMotionRef.current.top = top;
      popup.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    };

    const hidePopup = (clearActive = true) => {
      popupMotionRef.current.active = false;
      popupMotionRef.current.hovered = false;
      activeEl?.removeAttribute("aria-describedby");
      fillPopup(popup, null);
      if (clearActive) activeEl = null;
    };

    const showPopupFor = (tile: HTMLElement) => {
      if (reduced || dismissedEl === tile) return;
      activeEl?.removeAttribute("aria-describedby");
      activeEl = tile;
      const url = tile.dataset.projectUrl;
      const project = url ? projectByUrl.get(url) ?? null : null;
      fillPopup(popup, project, skillsContent, lang);
      if (!project) return;
      tile.setAttribute("aria-describedby", popupId);
      positionPopup();
    };

    const popupImage = popup.querySelector<HTMLImageElement>("[data-popup-img]");
    const popupMedia = popup.querySelector<HTMLElement>("[data-popup-media]");
    const onPopupImageLoad = () => {
      if (popupMedia) popupMedia.dataset.loaded = "1";
    };
    const onPopupImageError = () => {
      if (!popupMedia) return;
      popupMedia.dataset.loaded = "error";
      popupMedia.hidden = true;
    };
    popupImage?.addEventListener("load", onPopupImageLoad);
    popupImage?.addEventListener("error", onPopupImageError);

    const onTileEnter = (event: Event) => {
      if (!finePointer) return;
      const tile = event.currentTarget as HTMLElement;
      dismissedEl = null;
      showPopupFor(tile);
    };

    const onTileLeave = (event: Event) => {
      if (!finePointer) return;
      const related = (event as PointerEvent).relatedTarget;
      if (related instanceof Node && popup.contains(related)) return;
      if (activeEl === event.currentTarget) hidePopup();
    };

    const onPopupLeave = (event: PointerEvent) => {
      popupMotionRef.current.hovered = false;
      const related = event.relatedTarget;
      if (related instanceof Node && activeEl?.contains(related)) return;
      hidePopup();
    };

    const onPopupEnter = () => {
      popupMotionRef.current.hovered = true;
    };

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.hasAttribute("data-stream-tile")) {
        return;
      }
      if (target.getAttribute("aria-hidden") === "true") return;

      if (!finePointer) return;
      dismissedEl = null;
      showPopupFor(target);
    };

    const onFocusOut = () => {
      if (!finePointer) return;
      requestAnimationFrame(() => {
        const target = document.activeElement;
        if (
          target instanceof HTMLElement &&
          target.hasAttribute("data-stream-tile") &&
          root.contains(target)
        ) {
          dismissedEl = null;
          showPopupFor(target);
        } else {
          hidePopup();
        }
      });
    };

    const onDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && popup.dataset.show === "1") {
        dismissedEl = activeEl;
        hidePopup(false);
      }
    };

    const onViewportChange = () => {
      if (popup.dataset.show === "1") positionPopup();
    };

    // Touch strategy is intentionally "peek": hold opens, release closes.
    let longPressTimer: number | null = null;
    let longPressActive = false;
    let suppressClick = false;
    let pressStartX = 0;
    let pressStartY = 0;

    const clearLongPressTimer = () => {
      if (longPressTimer == null) return;
      window.clearTimeout(longPressTimer);
      longPressTimer = null;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (finePointer || event.pointerType === "mouse") return;
      const tile = event.currentTarget as HTMLElement;
      pressStartX = event.clientX;
      pressStartY = event.clientY;
      longPressActive = false;
      dismissedEl = null;
      clearLongPressTimer();
      try {
        tile.setPointerCapture(event.pointerId);
      } catch {
        // Capture is optional; the gesture still works with root listeners.
      }
      longPressTimer = window.setTimeout(() => {
        longPressTimer = null;
        longPressActive = true;
        suppressClick = true;
        showPopupFor(tile);
      }, tuning.interaction.longPressMs);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (finePointer || longPressTimer == null) return;
      const dx = event.clientX - pressStartX;
      const dy = event.clientY - pressStartY;
      if (
        dx * dx + dy * dy >
        tuning.interaction.moveCancelPx * tuning.interaction.moveCancelPx
      ) {
        clearLongPressTimer();
      }
    };

    const endTouchPeek = () => {
      clearLongPressTimer();
      if (longPressActive && tuning.interaction.touchPreview === "peek") {
        longPressActive = false;
        hidePopup();
      }
    };

    const onPointerUp = () => {
      if (!finePointer) endTouchPeek();
    };

    const onPointerCancel = () => {
      if (finePointer) return;
      clearLongPressTimer();
      longPressActive = false;
      suppressClick = false;
      hidePopup();
    };

    const onTileClick = (event: MouseEvent) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    };

    const onContextMenu = (event: Event) => {
      if (!finePointer) event.preventDefault();
    };

    const onPointerMqChange = () => {
      finePointer = finePointerMq.matches;
      dismissedEl = null;
      if (!finePointer) hidePopup();
    };

    for (const tile of tileEls) {
      tile.addEventListener("pointerenter", onTileEnter);
      tile.addEventListener("pointerleave", onTileLeave);
      tile.addEventListener("pointerdown", onPointerDown);
      tile.addEventListener("pointermove", onPointerMove);
      tile.addEventListener("pointerup", onPointerUp);
      tile.addEventListener("pointercancel", onPointerCancel);
      tile.addEventListener("click", onTileClick, true);
    }
    popup.addEventListener("pointerenter", onPopupEnter);
    popup.addEventListener("pointerleave", onPopupLeave);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    root.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onDocumentKeyDown);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, { passive: true });
    finePointerMq.addEventListener("change", onPointerMqChange);

    return () => {
      clearLongPressTimer();
      hidePopup();
      popupImage?.removeEventListener("load", onPopupImageLoad);
      popupImage?.removeEventListener("error", onPopupImageError);
      popup.removeEventListener("pointerenter", onPopupEnter);
      popup.removeEventListener("pointerleave", onPopupLeave);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      root.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onDocumentKeyDown);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange);
      finePointerMq.removeEventListener("change", onPointerMqChange);
      for (const tile of tileEls) {
        tile.removeEventListener("pointerenter", onTileEnter);
        tile.removeEventListener("pointerleave", onTileLeave);
        tile.removeEventListener("pointerdown", onPointerDown);
        tile.removeEventListener("pointermove", onPointerMove);
        tile.removeEventListener("pointerup", onPointerUp);
        tile.removeEventListener("pointercancel", onPointerCancel);
        tile.removeEventListener("click", onTileClick, true);
      }
    };
  }, [lanes, mounted, popupId, projectByUrl, reduced, repeats, tuning]);

  if (projects.length === 0) return null;

  const rootStyle = {
    "--stream-band-pad-y": `${tuning.presentation.bandPadY}px`,
    "--stream-row-gap": `${tuning.presentation.rowGap}px`,
    "--stream-hover-scale": tuning.presentation.hoverScale,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={`projects-marquee projects-marquee--${variant}`}
      role="group"
      aria-label={variant === "skills" ? t["section.skills"] : t["section.projects"]}
      data-ready={layout.ready ? "1" : "0"}
      data-eligible={layout.eligible ? "1" : "0"}
      data-mode={staticMode ? "static" : paused ? "paused" : "motion"}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
      style={rootStyle}
    >
      <div className="projects-marquee-stage">
        {lanes.map((lane) => {
          const repeatCount = repeats[lane.row] ?? 1;
          return (
            <div
              key={`lane-${lane.row}`}
              className="projects-marquee-lane"
              data-lane={lane.row}
            >
              <div
                ref={(node) => {
                  trackRefs.current[lane.row] = node;
                }}
                className="projects-marquee-track"
              >
                {Array.from({ length: repeatCount }, (_, copy) => (
                  <div
                    key={`lane-${lane.row}-copy-${copy}`}
                    className="projects-marquee-cycle"
                    data-copy={copy}
                  >
                    {lane.items.map((item, index) => {
                      const { project } = item;
                      const sameOrigin = isSameOrigin(project.url);
                      const label = shortTitle(project.title);
                      const letter = (label.charAt(0) || "?").toUpperCase();
                      const shellStyle = {
                        "--stream-gap-after": `${item.gapAfter}px`,
                        "--stream-y-offset": `${item.yOffset}px`,
                      } as CSSProperties;
                      return (
                        <span
                          key={`${project.url}|r${lane.row}|c${copy}|i${index}`}
                          className="projects-marquee-tile-wrap"
                          data-stream-shell=""
                          data-row={lane.row}
                          data-copy={copy}
                          style={shellStyle}
                        >
                          <a
                            href={project.url}
                            {...(sameOrigin
                              ? {}
                              : { target: "_blank", rel: "noopener noreferrer" })}
                            className="projects-marquee-tile"
                            data-stream-tile=""
                            data-project-url={project.url}
                            data-row={lane.row}
                            aria-label={project.title}
                            tabIndex={copy === 0 ? undefined : -1}
                            {...(copy === 0 ? {} : { "aria-hidden": true })}
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
                                onLoad={(event) => {
                                  event.currentTarget.classList.add("is-loaded");
                                  event.currentTarget.parentElement?.removeAttribute(
                                    "data-failed",
                                  );
                                }}
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                  event.currentTarget.parentElement?.setAttribute(
                                    "data-failed",
                                    "1",
                                  );
                                }}
                              />
                            </span>
                            <span className="projects-marquee-title">{label}</span>
                            <span className="projects-marquee-arrow" aria-hidden="true">
                              ↗
                            </span>
                          </a>
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {mounted &&
        createPortal(
          <div
            id={popupId}
            ref={popupRef}
            className="projects-marquee-popup"
            role="tooltip"
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
              <span className="projects-marquee-popup-skills" data-popup-skills hidden>
                <span className="projects-marquee-popup-tagline" data-popup-tagline />
                <span className="projects-marquee-popup-features" data-popup-features />
              </span>
            </span>
          </div>,
          document.body,
        )}
    </div>
  );
}
