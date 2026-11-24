import { createEffect, createMemo, createSignal, createUniqueId, For, untrack } from 'solid-js';
import { Portal } from '@solidjs/web';
import type { Catalog } from './model';

type Project = Catalog['projects'][number];
type LaneItem = { project: Project; gapAfter: number; yOffset: number };

const TUNING = {
  rows: 2,
  directions: [-1, -1],
  phaseRatios: [0.08, 0.43],
  laneSpeeds: [36, 36],
  maxDt: 0.05,
  touchPreview: 'peek',
  longPressMs: 600,
  moveCancelPx: 10,
  bandPadY: 14,
  rowGap: 16,
  gapMin: 16,
  gapMax: 44,
  yJitter: 6,
  hoverScale: 1.04,
} as const;

function hash01(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967295;
}

function shortTitle(title: string) {
  const cut = title.split(/\s*[—–|]\s*/)[0]?.trim();
  return cut && cut.length > 0 ? cut : title;
}

function buildLanes(projects: Project[]): LaneItem[][] {
  const lanes: LaneItem[][] = [];
  for (let row = 0; row < TUNING.rows; row++) {
    const rowProjects = projects.filter((_, index) => index % TUNING.rows === row);
    const pool = rowProjects.length > 0 ? rowProjects : projects;
    lanes.push(pool.map((project, index) => {
      const seed = `${project.url}|r${row}|i${index}`;
      return { project, gapAfter: TUNING.gapMin + hash01(`${seed}|gap`) * (TUNING.gapMax - TUNING.gapMin), yOffset: (hash01(`${seed}|y`) - 0.5) * TUNING.yJitter * 2 };
    }));
  }
  return lanes;
}

function sameNumbers(a: number[], b: number[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function ProjectsMarquee(props: { projects: Project[]; label: string }) {
  const popupId = createUniqueId();
  const [reduced, setReduced] = createSignal(false);
  const [pageVisible, setPageVisible] = createSignal(true);
  const [paused, setPaused] = createSignal(false);
  const [repeats, setRepeats] = createSignal<number[]>([]);
  const [layout, setLayout] = createSignal({ ready: false, eligible: false, cycleWidths: [] as number[] });
  let root: HTMLDivElement | undefined;
  let popup: HTMLDivElement | undefined;
  const trackRefs: (HTMLDivElement | undefined)[] = [];
  const offsets: number[] = [];
  const popupMotion = { active: false, hovered: false, row: 0, left: 0, top: 0 };
  const lanes = createMemo(() => buildLanes(props.projects));
  const projectByUrl = createMemo(() => new Map(props.projects.map(project => [project.url, project])));

  createEffect(() => true, () => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = (event: MediaQueryListEvent) => setReduced(event.matches);
    setReduced(mq.matches);
    const onVis = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    mq.addEventListener('change', onMotion);
    return () => { mq.removeEventListener('change', onMotion); document.removeEventListener('visibilitychange', onVis); };
  });

  createEffect(() => lanes(), () => {
    if (!root || lanes().length === 0) return;
    let measureFrame = 0;
    const measure = () => {
      const viewportWidth = root!.clientWidth;
      if (viewportWidth <= 0) return;
      let maxTileWidth = 0;
      const cycleWidths = lanes().map((lane, row) => {
        const shells = Array.from(root!.querySelectorAll<HTMLElement>(`[data-stream-shell][data-row="${row}"][data-copy="0"]`));
        let width = 0;
        for (let index = 0; index < shells.length; index++) {
          const tileWidth = shells[index]?.offsetWidth ?? 0;
          maxTileWidth = Math.max(maxTileWidth, tileWidth);
          width += tileWidth + (lane[index]?.gapAfter ?? 0);
        }
        return Math.round(width);
      });
      if (cycleWidths.some(width => width <= 0)) return;
      const eligible = cycleWidths.every(cycleWidth => cycleWidth > maxTileWidth * 2 + TUNING.gapMax);
      const overscan = maxTileWidth + TUNING.gapMax;
      const nextRepeats = cycleWidths.map(cycleWidth => eligible ? Math.max(2, Math.ceil((viewportWidth + overscan) / cycleWidth) + 1) : 1);
      setRepeats(current => sameNumbers(current, nextRepeats) ? current : nextRepeats);
      setLayout(current => current.ready && current.eligible === eligible && sameNumbers(current.cycleWidths, cycleWidths) ? current : { ready: true, eligible, cycleWidths });
    };
    measureFrame = requestAnimationFrame(measure);
    document.fonts?.ready?.then(() => { if (root) requestAnimationFrame(measure); });
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(root);
    return () => { cancelAnimationFrame(measureFrame); resizeObserver.disconnect(); };
  });

  const staticMode = createMemo(() => !layout().ready || !layout().eligible || reduced());

  createEffect(() => ({ staticMode: staticMode(), cycleWidths: layout().cycleWidths, visible: pageVisible(), paused: paused() }), state => {
    if (!root || state.staticMode) {
      for (const track of trackRefs) if (track) track.style.transform = '';
      if (state.staticMode) return;
    }
    if (!state.visible || state.paused) return;
    let inView = false;
    let raf = 0;
    let lastTime = 0;
    for (let row = 0; row < lanes().length; row++) {
      const cycleWidth = state.cycleWidths[row] ?? 0;
      if (cycleWidth <= 0) continue;
      const current = offsets[row];
      offsets[row] = current == null || !Number.isFinite(current) ? (TUNING.phaseRatios[row] ?? 0) * cycleWidth : current % cycleWidth;
    }
    const stopLoop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; lastTime = 0; };
    const tick = (now: number) => {
      if (!inView) { stopLoop(); return; }
      const dt = lastTime === 0 ? 0 : Math.min((now - lastTime) / 1000, TUNING.maxDt);
      lastTime = now;
      if (dt > 0) {
        for (let row = 0; row < lanes().length; row++) {
          const track = trackRefs[row];
          const cycleWidth = state.cycleWidths[row] ?? 0;
          if (!track || cycleWidth <= 0) continue;
          const speed = TUNING.laneSpeeds[row] ?? 0;
          const direction = TUNING.directions[row] ?? -1;
          const offset = ((offsets[row] ?? 0) + speed * dt) % cycleWidth;
          offsets[row] = offset;
          const x = direction < 0 ? -offset : -cycleWidth + offset;
          track.style.transform = `translate3d(${x}px, 0, 0)`;
        }
        if (popupMotion.active && !popupMotion.hovered && popup) {
          const row = popupMotion.row;
          const speed = TUNING.laneSpeeds[row] ?? 0;
          const direction = TUNING.directions[row] ?? -1;
          popupMotion.left += direction < 0 ? -speed * dt : speed * dt;
          popup.style.transform = `translate3d(${popupMotion.left}px, ${popupMotion.top}px, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    const startLoop = () => { if (raf || !inView) return; lastTime = 0; raf = requestAnimationFrame(tick); };
    const intersectionObserver = new IntersectionObserver(([entry]) => { inView = !!entry?.isIntersecting; if (inView) startLoop(); else stopLoop(); }, { threshold: 0 });
    intersectionObserver.observe(root!);
    return () => { stopLoop(); intersectionObserver.disconnect(); };
  });

  createEffect(() => ({ mounted: layout().ready, repeats: repeats(), reduced: reduced() }), () => {
    if (!root || !popup || lanes().length === 0) return;
    const popupEl = popup;
    const finePointerMq = window.matchMedia('(hover: hover) and (pointer: fine)');
    let finePointer = finePointerMq.matches;
    let activeEl: HTMLElement | null = null;
    let dismissedEl: HTMLElement | null = null;
    const tileEls = Array.from(root.querySelectorAll<HTMLElement>('[data-stream-tile]'));

    for (const tile of tileEls) {
      const image = tile.querySelector('img');
      if (!image?.complete) continue;
      if (image.naturalWidth > 0) image.classList.add('is-loaded');
      else { image.style.display = 'none'; image.parentElement?.setAttribute('data-failed', '1'); }
    }

    const fillPopup = (project: Project | null) => {
      const media = popupEl.querySelector<HTMLElement>('[data-popup-media]');
      const img = popupEl.querySelector<HTMLImageElement>('[data-popup-img]');
      const title = popupEl.querySelector<HTMLElement>('[data-popup-title]');
      const desc = popupEl.querySelector<HTMLElement>('[data-popup-desc]');
      if (!media || !img || !title || !desc) return;
      if (!project) { delete popupEl.dataset.show; popupEl.setAttribute('aria-hidden', 'true'); return; }
      title.textContent = project.title;
      desc.textContent = project.description;
      if (project.ogImage) {
        media.hidden = false;
        media.dataset.loaded = '0';
        if (img.src !== project.ogImage) { img.removeAttribute('src'); img.src = project.ogImage; }
        if (img.complete) { if (img.naturalWidth > 0) media.dataset.loaded = '1'; else { media.dataset.loaded = 'error'; media.hidden = true; } }
      } else { media.hidden = true; media.dataset.loaded = '0'; img.removeAttribute('src'); }
      popupEl.dataset.show = '1';
      popupEl.setAttribute('aria-hidden', 'false');
    };

    const positionPopup = () => {
      if (!activeEl || popupEl.dataset.show !== '1') return;
      const rect = activeEl.getBoundingClientRect();
      const popupWidth = popupEl.offsetWidth || 280;
      const popupHeight = popupEl.offsetHeight || 160;
      let left = rect.left + rect.width / 2 - popupWidth / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - popupWidth - 8));
      const above = rect.top - popupHeight;
      const below = rect.bottom;
      const top = above >= 8 ? above : below + popupHeight <= window.innerHeight - 8 ? below : Math.max(8, Math.min(above, window.innerHeight - popupHeight - 8));
      popupMotion.active = true;
      popupMotion.row = Number(activeEl.dataset.row ?? 0);
      popupMotion.left = left;
      popupMotion.top = top;
      popupEl.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    };

    const hidePopup = (clearActive = true) => {
      popupMotion.active = false;
      popupMotion.hovered = false;
      activeEl?.removeAttribute('aria-describedby');
      fillPopup(null);
      if (clearActive) activeEl = null;
    };

    const showPopupFor = (tile: HTMLElement) => {
      if (reduced() || dismissedEl === tile) return;
      activeEl?.removeAttribute('aria-describedby');
      activeEl = tile;
      const url = tile.dataset.projectUrl;
      const project = url ? projectByUrl().get(url) ?? null : null;
      fillPopup(project);
      if (!project) return;
      tile.setAttribute('aria-describedby', popupId);
      positionPopup();
    };

    const popupImage = popupEl.querySelector<HTMLImageElement>('[data-popup-img]');
    const popupMedia = popupEl.querySelector<HTMLElement>('[data-popup-media]');
    const onPopupImageLoad = () => { if (popupMedia) popupMedia.dataset.loaded = '1'; };
    const onPopupImageError = () => { if (!popupMedia) return; popupMedia.dataset.loaded = 'error'; popupMedia.hidden = true; };
    popupImage?.addEventListener('load', onPopupImageLoad);
    popupImage?.addEventListener('error', onPopupImageError);

    const onTileEnter = (event: Event) => {
      if (!finePointer) return;
      const tile = event.currentTarget as HTMLElement;
      dismissedEl = null;
      showPopupFor(tile);
    };
    const onTileLeave = (event: Event) => {
      if (!finePointer) return;
      const related = (event as PointerEvent).relatedTarget;
      if (related instanceof Node && popupEl.contains(related)) return;
      if (activeEl === event.currentTarget) hidePopup();
    };
    const onPopupEnter = () => { popupMotion.hovered = true; };
    const onPopupLeave = (event: PointerEvent) => {
      popupMotion.hovered = false;
      const related = event.relatedTarget;
      if (related instanceof Node && activeEl?.contains(related)) return;
      hidePopup();
    };
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.hasAttribute('data-stream-tile')) return;
      if (target.getAttribute('aria-hidden') === 'true') return;
      if (!finePointer) return;
      dismissedEl = null;
      showPopupFor(target);
    };
    const onFocusOut = () => {
      if (!finePointer) return;
      requestAnimationFrame(() => {
        const target = document.activeElement;
        if (target instanceof HTMLElement && target.hasAttribute('data-stream-tile') && root!.contains(target)) { dismissedEl = null; showPopupFor(target); } else hidePopup();
      });
    };
    const onDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && popupEl.dataset.show === '1') { dismissedEl = activeEl; hidePopup(false); }
    };
    const onViewportChange = () => { if (popupEl.dataset.show === '1') positionPopup(); };

    let longPressTimer: number | null = null;
    let longPressActive = false;
    let suppressClick = false;
    let pressStartX = 0;
    let pressStartY = 0;
    const clearLongPressTimer = () => { if (longPressTimer == null) return; window.clearTimeout(longPressTimer); longPressTimer = null; };
    const onPointerDown = (event: PointerEvent) => {
      if (finePointer || event.pointerType === 'mouse') return;
      const tile = event.currentTarget as HTMLElement;
      pressStartX = event.clientX;
      pressStartY = event.clientY;
      longPressActive = false;
      dismissedEl = null;
      clearLongPressTimer();
      try { tile.setPointerCapture(event.pointerId); } catch { /* Capture is optional. */ }
      longPressTimer = window.setTimeout(() => { longPressTimer = null; longPressActive = true; suppressClick = true; showPopupFor(tile); }, TUNING.longPressMs);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (finePointer || longPressTimer == null) return;
      const dx = event.clientX - pressStartX;
      const dy = event.clientY - pressStartY;
      if (dx * dx + dy * dy > TUNING.moveCancelPx * TUNING.moveCancelPx) clearLongPressTimer();
    };
    const endTouchPeek = () => { clearLongPressTimer(); if (longPressActive && TUNING.touchPreview === 'peek') { longPressActive = false; hidePopup(); } };
    const onPointerUp = () => { if (!finePointer) endTouchPeek(); };
    const onPointerCancel = () => { if (finePointer) return; clearLongPressTimer(); longPressActive = false; suppressClick = false; hidePopup(); };
    const onTileClick = (event: MouseEvent) => { if (!suppressClick) return; event.preventDefault(); event.stopPropagation(); suppressClick = false; };
    const onContextMenu = (event: Event) => { if (!finePointer) event.preventDefault(); };
    const onPointerMqChange = () => { finePointer = finePointerMq.matches; dismissedEl = null; if (!finePointer) hidePopup(); };

    for (const tile of tileEls) {
      tile.addEventListener('pointerenter', onTileEnter);
      tile.addEventListener('pointerleave', onTileLeave);
      tile.addEventListener('pointerdown', onPointerDown);
      tile.addEventListener('pointermove', onPointerMove);
      tile.addEventListener('pointerup', onPointerUp);
      tile.addEventListener('pointercancel', onPointerCancel);
      tile.addEventListener('click', onTileClick, true);
    }
    popupEl.addEventListener('pointerenter', onPopupEnter);
    popupEl.addEventListener('pointerleave', onPopupLeave);
    root!.addEventListener('focusin', onFocusIn);
    root!.addEventListener('focusout', onFocusOut);
    root!.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('keydown', onDocumentKeyDown);
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, { passive: true });
    finePointerMq.addEventListener('change', onPointerMqChange);
    return () => {
      clearLongPressTimer();
      hidePopup();
      popupImage?.removeEventListener('load', onPopupImageLoad);
      popupImage?.removeEventListener('error', onPopupImageError);
      popupEl.removeEventListener('pointerenter', onPopupEnter);
      popupEl.removeEventListener('pointerleave', onPopupLeave);
      root!.removeEventListener('focusin', onFocusIn);
      root!.removeEventListener('focusout', onFocusOut);
      root!.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('keydown', onDocumentKeyDown);
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('scroll', onViewportChange);
      finePointerMq.removeEventListener('change', onPointerMqChange);
      for (const tile of tileEls) {
        tile.removeEventListener('pointerenter', onTileEnter);
        tile.removeEventListener('pointerleave', onTileLeave);
        tile.removeEventListener('pointerdown', onPointerDown);
        tile.removeEventListener('pointermove', onPointerMove);
        tile.removeEventListener('pointerup', onPointerUp);
        tile.removeEventListener('pointercancel', onPointerCancel);
        tile.removeEventListener('click', onTileClick, true);
      }
    };
  });

  if (props.projects.length === 0) return null;
  return <div ref={root} class="projects-marquee" role="group" aria-label={props.label} data-ready={layout().ready ? '1' : '0'} data-eligible={layout().eligible ? '1' : '0'} data-mode={staticMode() ? 'static' : paused() ? 'paused' : 'motion'} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocusIn={() => setPaused(true)} onFocusOut={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false); }} style={{ '--stream-band-pad-y': `${TUNING.bandPadY}px`, '--stream-row-gap': `${TUNING.rowGap}px`, '--stream-hover-scale': TUNING.hoverScale }}>
    <div class="projects-marquee-stage">
      <For each={lanes()}>{(lane, row) => <div class="projects-marquee-lane" data-lane={row()}>
        <div ref={el => { trackRefs[untrack(row)] = el; }} class="projects-marquee-track">
          <For each={Array.from({ length: repeats()[row()] ?? 1 })}>{(_, copy) => <div class="projects-marquee-cycle" data-copy={copy()}>
            <For each={lane}>{item => { const label = shortTitle(item.project.title); return <span class="projects-marquee-tile-wrap" data-stream-shell data-row={row()} data-copy={copy()} style={{ '--stream-gap-after': `${item.gapAfter}px`, '--stream-y-offset': `${item.yOffset}px` }}>
              <a href={item.project.url} class="projects-marquee-tile" data-stream-tile data-project-url={item.project.url} data-row={row()} aria-label={item.project.title} tabindex={copy() === 0 ? undefined : -1} aria-hidden={copy() === 0 ? undefined : 'true'} target={item.project.url.startsWith('http') ? '_blank' : undefined} rel={item.project.url.startsWith('http') ? 'noopener noreferrer' : undefined}>
                <span class="projects-marquee-icon" aria-hidden="true" data-letter={(label.charAt(0) || '?').toUpperCase()}>
                  <img src={item.project.iconUrl} alt="" width="28" height="28" loading="lazy" decoding="async" onLoad={event => { event.currentTarget.classList.add('is-loaded'); event.currentTarget.parentElement?.removeAttribute('data-failed'); }} onError={event => { event.currentTarget.style.display = 'none'; event.currentTarget.parentElement?.setAttribute('data-failed', '1'); }} />
                </span>
                <span class="projects-marquee-title">{label}</span>
                <span class="projects-marquee-arrow" aria-hidden="true">↗</span>
              </a>
            </span>; }}</For>
          </div>}</For>
        </div>
      </div>}</For>
    </div>
    <Portal><div id={popupId} ref={popup} class="projects-marquee-popup" role="tooltip" aria-hidden="true">
      <span class="projects-marquee-popup-media" data-popup-media hidden><img data-popup-img alt="" width="640" height="336" decoding="async" /></span>
      <span class="projects-marquee-popup-body"><span class="projects-marquee-popup-title" data-popup-title /><span class="projects-marquee-popup-desc" data-popup-desc /></span>
    </div></Portal>
  </div>;
}
