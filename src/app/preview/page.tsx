import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liz — V5 Haoqi Study Template",
  description:
    "Personal site template V5 — haoqi-inspired GPU fluid, system UI language, proof cards, char reveal, and SVG signature.",
};

export default function PreviewPage() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: RAW_HTML,
      }}
    />
  );
}

const RAW_HTML = `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Liz Personal Site Template — V5 Haoqi Study</title>
<meta name="description" content="Personal site template V5 — haoqi-inspired GPU fluid, system interface language, proof-bearing work cards, char reveal, and SVG signature." />
<meta property="og:title" content="Liz Personal Site Template" />
<meta property="og:description" content="GPU fluid simulation, pointer pixel trail, char reveal, SVG drawing." />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="theme-color" content="#fbfaf4" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js"
  }
}
</script>
<style>

/* ═══════════════════════════════════════════════════════
   V5 TEMPLATE — haoqi.design target study
   Core: WebGL fluid + system UI + proof cards + char reveal
   ═══════════════════════════════════════════════════════ */

/* ── Design Tokens (from haoqi actual CSS) ─────────────── */
:root {
  /* Light theme === haoqi light */
  --label: 0,0,0;
  --label-d: 54,54,48;
  --bg-deep: 251,250,244;
  --label-1: rgba(var(--label),1);
  --label-2: rgba(var(--label-d),.6);
  --label-3: rgba(var(--label-d),.32);
  --label-4: rgba(var(--label-d),.18);
  --line: rgba(var(--label-d),.1);
  --bg-1: rgb(var(--bg-deep));
  --bg-elevated: #efede7;
  --easing-66: cubic-bezier(.66,0,.01,1);
  --selection-bg: #c0fe04;
  --accent-glow: #c0fe04;

  /* Dark theme */
  --label-dark: 255,255,255;
  --label-d-dark: 230,232,232;
  --bg-deep-dark: 15,17,17;

  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  --container: 96rem;
}

[data-theme="dark"] {
  --label: 255,255,255;
  --label-d: 230,232,232;
  --bg-deep: 15,17,17;
  --label-1: rgba(var(--label),1);
  --label-2: rgba(var(--label-d),.6);
  --label-3: rgba(var(--label-d),.32);
  --label-4: rgba(var(--label-d),.16);
  --line: rgba(var(--label-d),.08);
  --bg-1: rgb(var(--bg-deep));
  --bg-elevated: #191b1b;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  overflow: hidden; /* haoqi: body itself doesn't scroll */
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-1);
  color: var(--label-1);
  font-family: var(--font-sans);
  font-weight: 500;
}

::selection { background-color: var(--selection-bg); color: #000; }

a { color: inherit; text-decoration: inherit; }

/* hidden scrollbar (haoqi signature) */
.no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; }
.no-scrollbar::-webkit-scrollbar { width: 0; height: 0; display: none; }

/* ── Loading screen ─────────────────────────────────────── */
#loader {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  background: var(--bg-1);
  transition: opacity .6s var(--easing-66);
}
#loader.done { opacity: 0; pointer-events: none; }

.load-counter {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 400;
  color: var(--label-2);
  letter-spacing: .08em;
  margin-bottom: 16px;
}

.load-bar {
  width: 140px; height: 6px;
  border-radius: 999px;
  background: var(--label-3);
  overflow: hidden;
}
.load-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--label-1);
  width: 0%;
  transition: width 520ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* ── WebGL Canvas background ────────────────────────────── */
#bg-canvas {
  position: fixed; inset: 0;
  width: 100%; height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  animation: canvas-fade-in 1.2s ease .3s forwards;
  animation-delay: 1s;
}
@keyframes canvas-fade-in {
  to { opacity: 1; }
}

#bg-canvas2 {
  position: fixed; inset: 0;
  width: 100%; height: 100%;
  z-index: -1;
  pointer-events: none;
  opacity: 0.4;
}

/* ── Scroll container (haoqi: body overflow hidden, inner div scrolls) ── */
#scroll-root {
  position: fixed; inset: 0;
  width: 100%; height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
}
#scroll-root { scrollbar-width: none; }
#scroll-root::-webkit-scrollbar { width: 0; height: 0; display: none; }

/* ── Char reveal animation (haoqi hsst) ────────────────── */
.hsst-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(0.15em);
}
.hsst-char.in {
  animation: hsst-fade 0.8s var(--easing-66) forwards;
}
@keyframes hsst-fade {
  0%   { opacity: 0; transform: translateY(0.15em); }
  32%  { opacity: .22; }
  62%  { opacity: .55; transform: translateY(0.05em); }
  100% { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .hsst-char { opacity: 1; transform: none; animation: none; }
}

/* ── Scroll trigger reveal ──────────────────────────────── */
.reveal { opacity: 0; transform: translateY(30px); transition: opacity .8s var(--easing-66), transform .8s var(--easing-66); }
.reveal.in { opacity: 1; transform: translateY(0); }

/* ── Dotted hover (haoqi before: signature) ────────────── */
.dot-hover { position: relative; }
.dot-hover::before {
  content: "";
  position: absolute; inset: 0;
  border: 2px dotted transparent;
  pointer-events: none;
  transition: border-color .2s;
  z-index: 1;
  border-radius: inherit;
}
.dot-hover:hover::before, .dot-hover:focus-visible::before, .dot-hover:active::before {
  border-color: var(--label-1);
}

/* ── Header / System panel ──────────────────────────────── */
.site-header {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 50;
  display: flex; flex-direction: column; justify-content: space-between;
  font-family: var(--font-mono);
  pointer-events: none;
  transition: color .3s ease;
  mix-blend-mode: difference;
}
.header-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 24px;
  pointer-events: none;
}
@media (min-width: 64rem) { .header-row { padding: 28px 56px; } }

.brand {
  font-family: var(--font-sans);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.025em;
  font-size: 16px;
  pointer-events: auto;
  cursor: pointer;
  transition: color .3s ease;
  mix-blend-mode: difference;
  color: var(--label-1);
}
.brand .hsst-char { font-variation-settings: "wdth" 120; }

.nav-links {
  display: none;
  align-items: center;
  gap: 12px;
  pointer-events: auto;
}
@media (min-width: 64rem) { .nav-links { display: flex; } }

.nav-btn {
  position: relative;
  text-transform: uppercase;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  background: none; border: none;
  color: inherit;
  font-family: var(--font-mono);
  letter-spacing: .04em;
  transition: color .3s ease;
}

.sys-panel { 
  display: flex; align-items: center; gap: 12px;
  pointer-events: auto;
}
.sys-panel .nav-btn { font-size: 13px; }

.pulse-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #39a86b;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(57,168,107,.4); }
  50% { opacity: .6; box-shadow: 0 0 0 6px rgba(57,168,107,0); }
}

/* ── Coordinates display ────────────────────────────────── */
.coords {
  position: fixed;
  bottom: 28px; left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--label-2);
  letter-spacing: .06em;
  text-transform: uppercase;
  pointer-events: none;
  mix-blend-mode: difference;
  opacity: 0;
  transition: opacity .5s ease;
}
@media (max-width: 63rem) { .coords { display: none; } }

/* ── Layout grid ────────────────────────────────────────── */
.grid-12 { display: grid; grid-template-columns: repeat(12, minmax(0,1fr)); }
.section-pad { padding: 72px 24px; }
@media (min-width: 64rem) { .section-pad { padding: 96px 56px; } }

/* ── Hero ──────────────────────────────────────────────── */
.hero {
  min-height: 100vh; height: 100dvh;
  display: flex; flex-direction: column; justify-content: space-between;
}
.hero-top {
  flex: 1; display: flex; align-items: flex-end;
  padding-bottom: 24px;
}
.hero-identity {
  font-size: clamp(1.2rem, 3vw, 1.6rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.25;
  max-width: 600px;
}
.hero-identity .accent-text { color: var(--label-2); }

.hero-bottom {
  font-size: clamp(3rem, 7.2svw, 6rem);
  font-weight: 800;
  text-transform: uppercase;
  line-height: .88;
  letter-spacing: -0.035em;
  font-variation-settings: "wdth" 120;
}

/* ── Big section heading ────────────────────────────────── */
.section-heading {
  font-size: clamp(3rem, 7.2svw, 6.8svw);
  font-weight: 800;
  text-transform: uppercase;
  line-height: .88;
  letter-spacing: -0.035em;
  font-variation-settings: "wdth" 120;
  text-align: center;
  padding: 80px 0;
  min-height: 1px;
}
.section-heading-sticky { position: sticky; top: 0; }

/* ── Projects grid ──────────────────────────────────────── */
.work-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0,1fr));
  row-gap: 0;
}
.work-card { display: block; padding: 8px; }
.work-card-visual {
  aspect-ratio: 1 / 1;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--bg-elevated);
  position: relative;
  overflow: hidden;
  display: block;
  transition: border-color .2s ease, background .3s ease;
}
.work-card:hover .work-card-visual { border-color: var(--label-3); }
.work-card-visual::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(to bottom, rgba(var(--label-d),.07) 1px, transparent 1px),
    linear-gradient(to right, rgba(var(--label-d),.045) 1px, transparent 1px);
  background-size: 100% 18px, 18px 100%;
  mask-image: radial-gradient(circle at 50% 45%, #000 0, transparent 72%);
  opacity: .55;
}
.work-card-badge {
  position: absolute; top: 0; right: 0;
  background: var(--selection-bg);
  color: #000;
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .04em;
  padding: 3px 8px;
  z-index: 2;
}
.work-card-index {
  position: absolute;
  left: 18px;
  bottom: 14px;
  z-index: 2;
  font-size: clamp(54px, 8vw, 112px);
  line-height: .8;
  font-weight: 900;
  letter-spacing: -0.06em;
  color: rgba(var(--label-d), .16);
}
.work-card-system {
  position: absolute;
  inset: 18px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: .05em;
  font-size: 11px;
  color: var(--label-2);
}
.work-card-system strong {
  display: block;
  max-width: 18ch;
  color: var(--label-1);
  font-family: var(--font-sans);
  font-size: clamp(22px, 3vw, 38px);
  line-height: .96;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}
.work-card-system .metric {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  padding: 4px 7px;
  border: 1px solid var(--line);
  background: rgba(var(--bg-deep), .6);
  color: var(--label-1);
}
.work-card-system .metric::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--selection-bg);
  box-shadow: 0 0 12px rgba(192,254,4,.55);
}
.work-card-meta {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 10px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: .04em;
  font-family: var(--font-mono);
}
.work-card-meta .year { color: var(--label-2); }

/* ── SVG stamp section ──────────────────────────────────── */
.svg-stamp { position: relative; }
.svg-stamp svg { position: absolute; top: -3.125%; left: -8.33333%; width: 75%; pointer-events: none; }
.svg-stamp .svg-stamp-placeholder { aspect-ratio: 1 / 1; }

.svg-sign__path {
  opacity: 0;
  fill: none;
  stroke-linecap: butt;
}
.svg-sign.is-drawing .svg-sign__path {
  animation:
    svg-sign-show 0s linear var(--path-delay) forwards,
    svg-sign-draw var(--path-dur) cubic-bezier(0.65, 0, 0.35, 1) var(--path-delay) forwards;
}
@keyframes svg-sign-draw { to { stroke-dashoffset: 0; } }
@keyframes svg-sign-show { to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .svg-sign.is-drawing .svg-sign__path { animation: none; stroke-dashoffset: 0; opacity: 1; }
}

/* ── Footer / Contact ───────────────────────────────────── */
.footer {
  height: 100vh; height: 100dvh;
  display: flex; flex-direction: column; justify-content: center;
  position: relative;
  pointer-events: none;
}
.footer-words {
  display: grid;
  grid-template-columns: repeat(12, minmax(0,1fr));
  gap: 8px;
}
.footer-word {
  font-size: clamp(3rem, 7.2svw, 6svw);
  font-weight: 800;
  text-transform: uppercase;
  line-height: .88;
  letter-spacing: -0.035em;
  font-variation-settings: "wdth" 120;
  pointer-events: auto;
}
.footer-contact {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 72px 24px;
  font-family: var(--font-mono);
  font-size: 15px;
}
@media (min-width: 64rem) { .footer-contact { padding: 96px 56px; } }
.footer-contact-row {
  display: flex; justify-content: space-between; width: 100%;
  pointer-events: auto;
}
.footer-contact-row a {
  text-transform: uppercase;
  padding: 8px 12px;
  cursor: pointer;
}
.footer-links { display: flex; gap: 8px; }
@media (min-width: 64rem) { .footer-links { gap: 16px; } }

/* ── 3D tilt for project cards ──────────────────────────── */
.tilt-card { transform-style: preserve-3d; transition: transform .15s ease; }
.tilt-inner { transform-style: preserve-3d; }

/* ── Writing section ────────────────────────────────────── */
.writing-row {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 8px;
  border-top: 1px solid var(--line);
  transition: transform .3s var(--easing-66), color .3s ease;
}
.writing-row:hover { transform: translateX(16px); }
.writing-row:last-child { border-bottom: 1px solid var(--line); }
.writing-row .date { font-family: var(--font-mono); font-size: 13px; color: var(--label-3); text-transform: uppercase; }
.writing-row .title { font-size: 18px; font-weight: 600; flex: 1; }
.writing-row .arrow { color: var(--label-3); transition: color .3s ease; }
.writing-row:hover .arrow { color: var(--label-1); }

/* ── Caption text ──────────────────────────────────────── */
.caption {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--label-2);
  letter-spacing: .06em;
  text-transform: uppercase;
  padding: 8px;
}
.system-strip {
  display: grid;
  grid-template-columns: repeat(12, minmax(0,1fr));
  gap: 8px;
  padding: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.35;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--label-2);
}
.system-strip span {
  grid-column: span 12;
  border-top: 1px solid var(--line);
  padding-top: 8px;
}
@media (min-width: 64rem) { .system-strip span { grid-column: span 3; } }

</style>
</head>
<body>



<!-- ═══ Loading Sequence ═══ -->
<div id="loader">
  <div class="load-counter" id="loadCounter">0.00</div>
  <div class="load-bar"><div class="load-bar-fill" id="loadBar"></div></div>
</div>

<!-- ═══ WebGL Fluid Background ═══ -->
<canvas id="bg-canvas"></canvas>

<!-- ═══ Root Scroll Container ═══ -->
<div id="scroll-root" class="no-scrollbar">
  <div>

    <!-- ───── Header ───── -->
    <header class="site-header">
      <div class="header-row">
        <a class="brand dot-hover" href="#top" data-text="LIZ.SYSTEMS">
          <span class="hsst-wrap">LIZ.SYSTEMS</span>
        </a>
        <nav class="nav-links">
          <button class="nav-btn dot-hover" data-scroll="work">Index</button>
          <button class="nav-btn dot-hover" data-scroll="contact">Signal</button>
          <span class="nav-btn dot-hover" id="themeBtn" role="button" tabindex="0">
            <span id="themeLabel">Theme[A]</span>
          </span>
          <span class="nav-btn dot-hover" id="soundBtn" role="button" tabindex="0">
            <span class="pulse-dot" style="display:inline-block;vertical-align:middle;margin-right:4px;width:6px;height:6px;"></span>
            <span id="soundLabel">Sound[|]</span>
          </span>
        </nav>
      </div>
      <div class="header-row">
        <span class="nav-btn" style="font-size:13px;color:var(--label-2);" id="clockLabel">GMT+8 --:--</span>
      </div>
    </header>

    <!-- ───── Coordinates ───── -->
    <div class="coords" id="coords">0001 X 0001 Y</div>

    <!-- ───── Hero Section ───── -->
    <section id="top" class="hero section-pad">
      <div class="hero-top">
        <div class="grid-12" style="width:100%">
          <div class="hero-identity" style="grid-column: span 12;" data-reveal>
            <p class="caption" style="padding:8px;"> Liz — Interface / Agents / Writing Systems</p>
            <p style="padding:8px;font-size:clamp(1rem,3vw,1.4rem);line-height:1.3;color:var(--label-2);">
              A living index for AI-native work: small tools, agent loops, sharp writing systems, and product experiments with proof attached.
            </p>
            <div class="system-strip" aria-label="system status">
              <span>MODE / STUDYING HAOQI INTERACTION DENSITY</span>
              <span>STACK / STATIC HTML + THREE FLUIDPASS</span>
              <span>INPUT / POINTER FIELD + SCROLL ROOT</span>
              <span>OUTPUT / PROOF, NOT PORTFOLIO FOG</span>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-bottom">
        <div data-reveal="char">
          <div>I BUILD</div>
          <div>SYSTEMS THAT</div>
          <div>ANSWER BACK</div>
        </div>
      </div>
    </section>

    <!-- ───── About / Statement Section ───── -->
    <section class="section-pad">
      <div class="grid-12">
        <!-- SVG stamp (haoqi signature) -->
        <div class="svg-stamp" style="grid-column: span 12; padding:8px;" data-reveal>
          <div class="svg-stamp-placeholder"></div>
          <svg viewBox="0 0 320 154" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-sign" aria-hidden="true">
            <path class="svg-sign__path" d="M138.27 11.77C123.15 39.39 106.22 85.5 102.06 100.03C98.66 111.9 98.37 128.79 98.63 131.17" stroke="#c0fe04" stroke-width="4" fill="none" style="--path-dur:1.2s;--path-delay:0s;stroke-dasharray:200;stroke-dashoffset:200;" />
            <path class="svg-sign__path" d="M78.23 42.07C68.25 91.68 24.52 161.89 11.61 145.08C-3.91 124.87 84.42 80.04 149.13 70.31C129.18 76.88 121.73 89.34 127.22 93.32C137.21 100.56 148.93 80.91 154.83 68.44C154.83 68.44 145.92 84 152.86 86.46C163.67 90.27 183.35 47.45 193.77 55.61C200.86 61.17 188 78.04 180.89 75.65C176.52 74.17 179.98 64.54 184.58 59.69C186.63 62.17 192.88 65.7 201.5 59.91C210.12 54.12 217.99 47.64 220.84 45.12" stroke="#c0fe04" stroke-width="4" fill="none" style="--path-dur:2.5s;--path-delay:.3s;stroke-dasharray:500;stroke-dashoffset:500;" />
            <path class="svg-sign__path" d="M235.55 43.43C221.98 37.37 206.4 60.4 215.72 63.12C224.12 65.58 234.43 48.01 239.2 40.12C237.61 42.75 234.82 53.67 235.16 66.2C235.57 81.85 228.17 116.93 217.43 114.67C206.69 112.42 217.71 80.36 242.78 57.37C262.83 38.97 269.55 28.9 270.4 26.16C266.38 32.05 260.25 44.25 267.96 45.92C275.67 47.59 298.15 19.83 308.42 5.75" stroke="#c0fe04" stroke-width="4" fill="none" style="--path-dur:3s;--path-delay:.6s;stroke-dasharray:600;stroke-dashoffset:600;" />
          </svg>
        </div>

        <div style="grid-column: span 12; padding:8px;" data-reveal>
          <p style="font-size:clamp(1.1rem, 4.2vw, 2.2rem); line-height:1.3; font-weight:500;">
            The site behaves like a control surface: theme, sound state, coordinates, scroll position, and pointer energy all leave visible traces.
          </p>
          <p style="font-size:clamp(1.1rem, 4.2vw, 2.2rem); line-height:1.3; color:var(--label-2); font-weight:500; margin-top:16px;">
            The point is not decoration. The interface should prove that the builder understands systems, feedback loops, and taste under constraints.
          </p>
        </div>
      </div>
    </section>

    <!-- ───── Selected Work ───── -->
    <section id="work" class="section-pad" style="padding-top:48px;">
      <div class="work-grid">
        <!-- Card 1 -->
        <article class="work-card dot-hover" style="grid-column: span 12;" data-tilt data-reveal>
          <a class="work-card-visual tilt-card" id="tiltPanel1">
            <span class="work-card-badge">Agent System</span>
            <span class="work-card-index">01</span>
            <div class="work-card-system tilt-inner">
              <span>STATUS / ACTIVE LOOP</span>
              <strong>Hermes operator bench</strong>
              <span class="metric">Delegation + browser + cron</span>
            </div>
          </a>
          <div class="work-card-meta">
            <span>Agent workflows</span>
            <span class="year">2026</span>
          </div>
        </article>

        <!-- Card 2 -->
        <article class="work-card dot-hover" style="grid-column: span 12;" data-tilt data-reveal>
          <a class="work-card-visual tilt-card" id="tiltPanel2">
            <span class="work-card-badge">Writing System</span>
            <span class="work-card-index">02</span>
            <div class="work-card-system tilt-inner">
              <span>STATUS / SIGNAL EXTRACTION</span>
              <strong>dontbesilent diagnosis kit</strong>
              <span class="metric">Idea -> test -> publish</span>
            </div>
          </a>
          <div class="work-card-meta">
            <span>Content tools</span>
            <span class="year">2025-2026</span>
          </div>
        </article>

        <!-- Card 3 -->
        <article class="work-card dot-hover" style="grid-column: span 12;" data-tilt data-reveal>
          <a class="work-card-visual tilt-card" id="tiltPanel3">
            <span class="work-card-badge">Product Lab</span>
            <span class="work-card-index">03</span>
            <div class="work-card-system tilt-inner">
              <span>STATUS / MARKET PROBE</span>
              <strong>Tiny tools with fast evidence</strong>
              <span class="metric">Usage beats roadmap</span>
            </div>
          </a>
          <div class="work-card-meta">
            <span>Experiments</span>
            <span class="year">2024-2026</span>
          </div>
        </article>
      </div>
    </section>

    <!-- ───── Big Section Heading (sticky) ───── -->
    <section class="section-heading section-heading-sticky" data-reveal="char">
      <div>OPERATE</div>
      <div>WITH</div>
      <div>FEEDBACK</div>
    </section>

    <!-- ───── Writing ───── -->
    <section class="section-pad">
      <p class="caption" data-reveal>Writing</p>
      <div data-reveal>
        <a class="writing-row dot-hover" href="#">
          <span class="date">2026.06</span>
          <span class="title">Agent loops need kill criteria, not vibes</span>
          <span class="arrow">→</span>
        </a>
        <a class="writing-row dot-hover" href="#">
          <span class="date">2026.05</span>
          <span class="title">The interface is the proof of the system</span>
          <span class="arrow">→</span>
        </a>
        <a class="writing-row dot-hover" href="#">
          <span class="date">2026.04</span>
          <span class="title">Small tools, hard evidence, fewer roadmaps</span>
          <span class="arrow">→</span>
        </a>
        <a class="writing-row dot-hover" href="#">
          <span class="date">2026.03</span>
          <span class="title">How to stop AI from becoming a velvet echo chamber</span>
          <span class="arrow">→</span>
        </a>
      </div>
    </section>

    <!-- ───── Footer / Contact ───── -->
    <footer id="contact" class="footer">
      <div class="footer-words">
        <span class="footer-word" style="grid-column: 1 / span 6; text-align:left;" data-reveal="char">
          <div>LET'S</div>
        </span>
        <span class="footer-word" style="grid-column: 7 / span 6; text-align:right;" data-reveal="char">
          <div>CREATE</div>
        </span>
        <span class="footer-word" style="grid-column: 1 / span 12; text-align:left;" data-reveal="char">
          <div>SOMETHING</div>
        </span>
        <span class="footer-word" style="grid-column: 1 / span 12; text-align:right;" data-reveal="char">
          <div>EXTRAORDINARY</div>
        </span>
      </div>
      <div class="footer-contact">
        <div class="footer-contact-row">
          <a class="dot-hover" href="mailto:hello@lizliz.xyz">HELLO@LIZLIZ.XYZ</a>
          <div class="footer-links">
            <a class="dot-hover" href="#" target="_blank" rel="noreferrer">TWITTER/X</a>
            <a class="dot-hover" href="#" target="_blank" rel="noreferrer">GITHUB</a>
            <a class="dot-hover" href="#" target="_blank" rel="noreferrer">RSS</a>
          </div>
        </div>
      </div>
    </footer>

  </div>
</div>



<script type="module">
import * as THREE from 'three';

try {

// ═══════════════════════════════════════════════════════
// FLUID SIMULATION (from haoqi.design GPU fluid solver)
// curl → vorticity → divergence → pressure(Jacobi) → gradient → advect
// ═══════════════════════════════════════════════════════

const SIM_RESOLUTION = 160;
const PRESSURE_ITERATIONS = 4;
const ACCENT = new THREE.Color('#c0fe04');

// Shader helpers
const vs = \`varying vec2 vUv; void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 1.0, 1.0); }\`;

function makeRT(w, h) {
    return new THREE.WebGLRenderTarget(w, h, {
        minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat, type: THREE.HalfFloatType,
        depthBuffer: false, stencilBuffer: false
    });
}

function makeMat(fs, uniforms) {
    return new THREE.ShaderMaterial({
        vertexShader: vs, fragmentShader: fs, uniforms,
        depthTest: false, depthWrite: false, transparent: false, toneMapped: false
    });
}

// Fluid simulation shaders (extracted from haoqi JS bundles)
const curlFS = \`uniform sampler2D uVelocity; uniform vec2 uTexelSize; varying vec2 vUv;
void main(){
  float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
  float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
  float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
  float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
  float v = 0.5 * (R - L - T + B);
  gl_FragColor = vec4(v, 0.0, 0.0, 1.0);
}\`;

const vorticityFS = \`uniform sampler2D uVelocity; uniform sampler2D uCurl;
uniform vec2 uTexelSize; uniform vec2 uResolution; uniform vec2 uPointer; uniform vec2 uPointerDelta;
uniform float uCurlStrength; uniform float uSplatRadius; uniform float uSplatForce;
varying vec2 vUv;
void main(){
  float L = abs(texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x);
  float R = abs(texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x);
  float T = abs(texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x);
  float B = abs(texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x);
  float C = texture2D(uCurl, vUv).x;
  vec2 force = vec2(T - B, R - L);
  float fl = length(force);
  if (fl > 0.0001) force /= fl; else force = vec2(0.0);
  force *= uCurlStrength * C;
  force.y *= -1.0;
  vec2 vel = texture2D(uVelocity, vUv).xy;
  vel += force * 0.016;
  vel = clamp(vel, vec2(-1000.0), vec2(1000.0));
  vec2 mouseUv = uPointer / max(uResolution, vec2(0.0001));
  vec2 diff = vUv - mouseUv;
  diff.x *= uResolution.x / max(uResolution.y, 0.0001);
  float mask = exp(-dot(diff, diff) / max(uSplatRadius, 0.0001));
  vel += (uPointerDelta / max(uResolution, vec2(0.0001))) * mask * uSplatForce;
  gl_FragColor = vec4(vel, 0.0, 1.0);
}\`;

const divergenceFS = \`uniform sampler2D uVelocity; uniform vec2 uTexelSize; varying vec2 vUv;
void main(){
  float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
  float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
  float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
  float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
  float d = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(d, 0.0, 0.0, 1.0);
}\`;

const clearFS = \`void main(){ gl_FragColor = vec4(0.0); }\`;

const pressureFS = \`uniform sampler2D uPressure; uniform sampler2D uDivergence; uniform vec2 uTexelSize; varying vec2 vUv;
void main(){
  float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
  float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
  float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
  float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
  float d = texture2D(uDivergence, vUv).x;
  float p = (L + R + T + B - d) * 0.25;
  gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
}\`;

const gradientFS = \`uniform sampler2D uVelocity; uniform sampler2D uPressure; uniform vec2 uTexelSize; varying vec2 vUv;
void main(){
  float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
  float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
  float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
  float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
  vec2 v = texture2D(uVelocity, vUv).xy;
  v -= vec2(R - L, T - B);
  gl_FragColor = vec4(v, 0.0, 1.0);
}\`;

const advectFS = \`uniform sampler2D uVelocity; uniform sampler2D uProjectedVelocity; uniform vec2 uTexelSize; uniform float uDissipation; varying vec2 vUv;
void main(){
  vec2 v = texture2D(uProjectedVelocity, vUv).xy;
  vec2 coord = clamp(vUv - v * uTexelSize * 0.016, 0.0, 1.0);
  vec2 a = texture2D(uProjectedVelocity, coord).xy;
  a /= 1.0 + uDissipation * 0.016;
  gl_FragColor = vec4(a, 0.0, 1.0);
}\`;

// Display shader: visible water ripples + spectral highlight + pointer pixel trail
const displayFS = \`uniform sampler2D uVelocity; uniform vec2 uSimSize;
uniform float uDisplacementStrength; uniform float uChromaticBoost; uniform float uEffectEnabled;
uniform float uTime; uniform vec3 uBgColor; uniform float uIsDark;
uniform vec2 uPointer; uniform float uPointerActive;

vec3 accent = vec3(0.753, 0.996, 0.016); // #c0fe04

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  float a=hash(i), b=hash(i+vec2(1.0,0.0)), c=hash(i+vec2(0.0,1.0)), d=hash(i+vec2(1.0,1.0));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}
float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v += a*noise(p); p*=2.0; a*=0.5; } return v; }

vec3 spectrum(float x){ return cos((x - vec3(0.0, 0.5, 1.0)) * vec3(0.6, 1.0, 0.5) * 3.14); }

// Pointer pixel trail overlay, extracted from haoqi's display pass structure
uniform vec2 uTrail[16]; uniform float uTrailStrength[16]; uniform float uTrailCount;
uniform vec3 uPointerColor; uniform float uPointerOpacity; uniform float uPointerDotRadius;
uniform float uPointerPixelSize; uniform vec2 uResolution; uniform float uDevicePixelRatio;

float cellEquals(vec2 a, vec2 b){ vec2 d = abs(a-b); return 1.0 - step(0.5, max(d.x, d.y)); }

vec4 applyPointerOverlay(vec2 uv, vec4 baseColor){
  float cssPx = uPointerPixelSize * max(uDevicePixelRatio, 1.0);
  vec2 nps = vec2(cssPx / max(uResolution.x, 1.0), cssPx / max(uResolution.y, 1.0));
  vec2 sps = max(nps, vec2(1e-6));
  vec2 cellId = floor(uv / sps);
  vec2 cellUV = fract(uv / sps);
  float highlight = 0.0;
  for(int i = 0; i < 16; i++){
    float en = step(float(i), uTrailCount - 1.0);
    vec2 pc = floor(uTrail[i] / sps);
    float same = cellEquals(cellId, pc);
    float w = clamp(uTrailStrength[i], 0.0, 1.0);
    highlight = max(highlight, en * same * w);
  }
  float d = distance(cellUV, vec2(0.5));
  float aa = fwidth(d) * 1.5;
  float r = clamp(uPointerDotRadius, 0.0, 1.0);
  float circle = smoothstep(r, r - aa, d);
  float overlayAlpha = circle * highlight * clamp(uPointerOpacity, 0.0, 1.0);
  baseColor.rgb = mix(baseColor.rgb, uPointerColor, overlayAlpha);
  return baseColor;
}

varying vec2 vUv;
void main(){
  vec2 uv = vUv;
  vec2 vel = texture2D(uVelocity, uv).xy;
  float vmag = length(vel) / max(max(uSimSize.x, uSimSize.y), 1.0);

  // Fluid-driven chromatic displacement. This makes the GPU velocity field visible instead of hidden.
  vec2 flow = vel / max(uSimSize, vec2(1.0)) * uDisplacementStrength * 2.5;
  vec2 p = uv + flow * 0.08;

  // Soft caustic layer so the surface is alive even before the user moves.
  float t = uTime * 0.18;
  float n1 = fbm(p * 3.0 + vec2(t, -t * 0.7));
  float n2 = fbm((p + n1 * 0.18) * 8.0 + vec2(-t * 1.3, t));
  float caustic = pow(max(0.0, n2 - 0.42), 2.0) * 2.2;

  // Pointer ripple ring. This is separate from the solver so there is always immediate tactile feedback.
  vec2 pointerUv = uPointer / max(uResolution, vec2(1.0));
  pointerUv.y = 1.0 - pointerUv.y;
  float pd = distance(uv, pointerUv);
  float ring = sin(pd * 82.0 - uTime * 8.0) * 0.5 + 0.5;
  ring *= smoothstep(0.34, 0.0, pd) * uPointerActive;

  float fluid = smoothstep(0.0004, 0.011, vmag);
  float energy = clamp(caustic * 1.65 + fluid * 5.0 + ring * 0.9, 0.0, 1.0);

  vec3 base = uBgColor;
  vec3 ink = mix(vec3(0.02,0.025,0.025), vec3(0.92,0.93,0.90), 1.0 - uIsDark);
  vec3 spectral = spectrum(0.55 + energy * 0.35);
  vec3 water = mix(base, accent, energy * 0.88);
  water += spectral * (fluid + caustic) * 0.42 * uChromaticBoost;
  water += accent * ring * 0.75;
  water = mix(water, ink, caustic * 0.08);

  vec4 color = vec4(water, 1.0);
  gl_FragColor = applyPointerOverlay(uv, color);
}\`;

// ═══════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════

const canvas = document.getElementById('bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: false });

let W = window.innerWidth, H = window.innerHeight;
const DPR = Math.min(window.devicePixelRatio || 1, 2);
renderer.setPixelRatio(DPR);
renderer.setSize(W, H);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const quad = new THREE.PlaneGeometry(2, 2);

// Sim dimensions
let simW, simH;
function computeSimSize(){
    const aspect = W / H;
    if (aspect > 1) { simW = Math.round(SIM_RESOLUTION * aspect); simH = SIM_RESOLUTION; }
    else { simW = SIM_RESOLUTION; simH = Math.round(SIM_RESOLUTION / Math.max(aspect, 1e-4)); }
}
computeSimSize();

// Render targets
let velRead, velWrite, curlTarget, vortTarget, divTarget, pressA, pressB, projVel;
function createRTs(){
    [velRead, velWrite, curlTarget, vortTarget, divTarget, pressA, pressB, projVel].forEach(rt => rt?.dispose());
    velRead = makeRT(simW, simH); velWrite = makeRT(simW, simH);
    curlTarget = makeRT(simW, simH); vortTarget = makeRT(simW, simH);
    divTarget = makeRT(simW, simH); pressA = makeRT(simW, simH); pressB = makeRT(simW, simH);
    projVel = makeRT(simW, simH);
}
createRTs();

// Materials
const texelSize = new THREE.Vector2(1/simW, 1/simH);
const resolution = new THREE.Vector2(W, H);

const curlMat = makeMat(curlFS, { uVelocity: {value: null}, uTexelSize: {value: texelSize} });
const vortMat = makeMat(vorticityFS, {
    uVelocity: {value: null}, uCurl: {value: null}, uTexelSize: {value: texelSize.clone()},
    uResolution: {value: resolution.clone()}, uPointer: {value: new THREE.Vector2(-1,-1)},
    uPointerDelta: {value: new THREE.Vector2(0,0)}, uCurlStrength: {value: 0},
    uSplatRadius: {value: 0.003}, uSplatForce: {value: 3000}
});
const divMat = makeMat(divergenceFS, { uVelocity: {value: null}, uTexelSize: {value: texelSize.clone()} });
const clearMat = makeMat(clearFS, {});
const pressMat = makeMat(pressureFS, { uPressure: {value: null}, uDivergence: {value: null}, uTexelSize: {value: texelSize.clone()} });
const gradMat = makeMat(gradientFS, { uVelocity: {value: null}, uPressure: {value: null}, uTexelSize: {value: texelSize.clone()} });
const advectMat = makeMat(advectFS, { uVelocity: {value: null}, uProjectedVelocity: {value: null}, uTexelSize: {value: texelSize.clone()}, uDissipation: {value: 3} });

const displayMat = makeMat(displayFS, {
    tDiffuse: {value: null}, uVelocity: {value: null}, uSimSize: {value: new THREE.Vector2(simW, simH)},
    uDisplacementStrength: {value: 4.0}, uChromaticBoost: {value: 1.8}, uEffectEnabled: {value: 1},
    uTime: {value: 0}, uBgColor: {value: new THREE.Color(251/255, 250/255, 244/255)}, uIsDark: {value: 0},
    // Pointer trail uniforms
    uTrail: {value: Array.from({length:16}, () => new THREE.Vector2(0.5, 0.5))},
    uTrailStrength: {value: new Array(16).fill(0)},
    uTrailCount: {value: 14}, uPointerColor: {value: ACCENT.clone()},
    uPointerOpacity: {value: 1}, uPointerDotRadius: {value: 0.8}, uPointerPixelSize: {value: 16},
    uResolution: {value: new THREE.Vector2(W, H)}, uDevicePixelRatio: {value: DPR},
    uPointer: {value: new THREE.Vector2(W/2, H/2)}, uPointerActive: {value: 0}
});

// Render pass helper
const mesh = new THREE.Mesh(quad, displayMat);
scene.add(mesh);

function renderTo(rt, mat){
    mesh.material = mat;
    renderer.setRenderTarget(rt);
    renderer.clear();
    renderer.render(scene, camera);
}

function swapVel(){ const t = velRead; velRead = velWrite; velWrite = t; }

// ═══════════════════════════════════════════════════════
// POINTER TRAIL
// ═══════════════════════════════════════════════════════

const trail = Array.from({length: 16}, () => new THREE.Vector2(0.5, 0.5));
const trailStrength = new Array(16).fill(0);
let lastPointerCell = new THREE.Vector2(-1, -1);
const pixelSize = 16;
let pointerActive = false;

function updatePointer(x, y, delta){
    const cssX = x, cssY = y;
    const nps = pixelSize / Math.max(W, 1);
    const npsY = pixelSize / Math.max(H, 1);
    
    // Decay trail
    for (let i = pointerActive ? 1 : 0; i < 14; i++){
        trailStrength[i] = THREE.MathUtils.damp(trailStrength[i], 0, 2, 1/60);
    }
    
    if (pointerActive) {
        const cellX = Math.floor(cssX / nps);
        const cellY = Math.floor(cssY / npsY);
        if (cellX !== lastPointerCell.x || cellY !== lastPointerCell.y) {
            for (let i = 13; i > 0; i--) {
                trail[i].copy(trail[i-1]);
                trailStrength[i] = trailStrength[i-1];
            }
            lastPointerCell.set(cellX, cellY);
        }
        trail[0].set(cssX / W, 1.0 - cssY / H);
        trailStrength[0] = 1;
    }
    
    // Update display uniforms
    for (let i = 0; i < 16; i++) {
        displayMat.uniforms.uTrail.value[i].copy(trail[i]);
    }
    displayMat.uniforms.uTrailStrength.value = trailStrength;
    
    // Update vorticity uniforms for fluid injection
    vortMat.uniforms.uPointer.value.set(cssX, H - cssY);
    vortMat.uniforms.uPointerDelta.value.set(delta.x, -delta.y);
    displayMat.uniforms.uPointer.value.set(cssX, cssY);
    displayMat.uniforms.uPointerActive.value = pointerActive ? 1 : 0;
}

// ═══════════════════════════════════════════════════════
// ANIMATION LOOP
// ═══════════════════════════════════════════════════════

let lastMouse = { x: W/2, y: H/2, dx: 0, dy: 0 };
let currentTheme = 'light';
let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    lastMouse.x = e.clientX; lastMouse.y = e.clientY;
    lastMouse.dx = dx; lastMouse.dy = dy;
    pointerActive = true;
});
document.addEventListener('mouseleave', () => { pointerActive = false; });

const startTime = performance.now();
let lastTime = startTime;

function animate(){
    requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    
    // Update pointer trail
    updatePointer(lastMouse.x, lastMouse.y, { x: lastMouse.dx, y: lastMouse.dy });
    lastMouse.dx *= 0.5; lastMouse.dy *= 0.5;
    
    if (!reducedMotion) {
        // Fluid simulation steps
        // 1. Curl
        curlMat.uniforms.uVelocity.value = velRead.texture;
        renderTo(curlTarget, curlMat);
        
        // 2. Vorticity + pointer force injection
        vortMat.uniforms.uVelocity.value = velRead.texture;
        vortMat.uniforms.uCurl.value = curlTarget.texture;
        renderTo(vortTarget, vortMat);
        
        // 3. Divergence
        divMat.uniforms.uVelocity.value = vortTarget.texture;
        renderTo(divTarget, divMat);
        
        // 4. Clear pressure
        renderTo(pressA, clearMat);
        
        // 5. Pressure Jacobi iterations
        let pa = pressA, pb = pressB;
        for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
            pressMat.uniforms.uPressure.value = pa.texture;
            pressMat.uniforms.uDivergence.value = divTarget.texture;
            renderTo(pb, pressMat);
            const t = pa; pa = pb; pb = t;
        }
        
        // 6. Gradient subtraction
        gradMat.uniforms.uVelocity.value = vortTarget.texture;
        gradMat.uniforms.uPressure.value = pa.texture;
        renderTo(projVel, gradMat);
        
        // 7. Advect
        advectMat.uniforms.uVelocity.value = velRead.texture;
        advectMat.uniforms.uProjectedVelocity.value = projVel.texture;
        renderTo(velWrite, advectMat);
        swapVel();
    }
    
    // 8. Display pass
    displayMat.uniforms.tDiffuse.value = velRead.texture; // Use velocity as input for visual
    displayMat.uniforms.uVelocity.value = velRead.texture;
    displayMat.uniforms.uTime.value = (now - startTime) / 1000;
    displayMat.uniforms.uResolution.value.set(W * DPR, H * DPR);
    
    mesh.material = displayMat;
    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(scene, camera);
}

// ═══════════════════════════════════════════════════════
// RESIZE
// ═══════════════════════════════════════════════════════

function onResize(){
    W = window.innerWidth; H = window.innerHeight;
    renderer.setSize(W, H);
    computeSimSize();
    createRTs();
    texelSize.set(1/simW, 1/simH);
    [curlMat, vortMat, divMat, pressMat, gradMat, advectMat].forEach(m => {
        if (m.uniforms.uTexelSize) m.uniforms.uTexelSize.value.copy(texelSize);
    });
    vortMat.uniforms.uResolution.value.set(W, H);
    displayMat.uniforms.uSimSize.value.set(simW, simH);
    displayMat.uniforms.uResolution.value.set(W * DPR, H * DPR);
}
window.addEventListener('resize', onResize);

// ═══════════════════════════════════════════════════════
// THEME UPDATE
// ═══════════════════════════════════════════════════════

window.__updateFluidTheme = function(theme) {
    currentTheme = theme;
    if (theme === 'dark') {
        displayMat.uniforms.uBgColor.value.setRGB(15/255, 17/255, 17/255);
        displayMat.uniforms.uIsDark.value = 1;
    } else {
        displayMat.uniforms.uBgColor.value.setRGB(251/255, 250/255, 244/255);
        displayMat.uniforms.uIsDark.value = 0;
    }
};

// Start
animate();



} catch (e) { console.error('FLUID_RUNTIME_ERROR', e); window.__fluidError = { message: e && e.message, stack: e && e.stack }; }</script>

<script>

// ═══════════════════════════════════════════════════════
// UI INTERACTION (preserved from V3)
// ═══════════════════════════════════════════════════════
(function() {
  'use strict';

  /* ── Loading Sequence ──────────────────────────────── */
  const loader = document.getElementById('loader');
  const loadCounter = document.getElementById('loadCounter');
  const loadBar = document.getElementById('loadBar');
  let progress = 0;

  function loadTick() {
    progress += Math.random() * 0.15;
    if (progress >= 1) progress = 1;
    loadCounter.textContent = progress.toFixed(2);
    loadBar.style.width = (progress * 100) + '%';
    if (progress < 1) {
      setTimeout(loadTick, 80 + Math.random() * 120);
    } else {
      setTimeout(() => {
        loader.classList.add('done');
        startRevealSequence();
      }, 400);
    }
  }
  setTimeout(loadTick, 200);

  /* ── Char-by-char wrapper ──────────────────────────── */
  function wrapChars(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const texts = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.trim() && node.parentElement.tagName !== 'SCRIPT' && node.parentElement.tagName !== 'STYLE') {
        texts.push(node);
      }
    }
    texts.forEach(textNode => {
      const text = textNode.textContent;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const span = document.createElement('span');
        span.className = 'hsst-char';
        span.textContent = char === ' ' ? '\\u00a0' : char;
        span.style.animationDelay = (Math.random() * 0.4 + 0.1) + 's';
        frag.appendChild(span);
      }
      textNode.parentNode.replaceChild(frag, textNode);
    });
  }

  document.querySelectorAll('[data-reveal="char"]').forEach(el => {
    wrapChars(el);
  });

  /* ── Reveal sequence ──────────────────────────────── */
  function startRevealSequence() {
    const heroChars = document.querySelectorAll('.hero .hsst-char');
    heroChars.forEach((c, i) => {
      setTimeout(() => c.classList.add('in'), i * 20);
    });

    const brandChars = document.querySelectorAll('.brand .hsst-char');
    if (brandChars.length === 0) {
      // Wrap brand text
      const brandEl = document.querySelector('.brand .hsst-wrap') || document.querySelector('.brand');
      if (brandEl && !brandEl.querySelector('.hsst-char')) wrapChars(brandEl);
    }
    document.querySelectorAll('.brand .hsst-char').forEach((c, i) => {
      setTimeout(() => c.classList.add('in'), 200 + i * 30);
    });

    const svgSign = document.querySelector('.svg-sign');
    if (svgSign) {
      setTimeout(() => svgSign.classList.add('is-drawing'), 600);
    }

    initScrollReveal();
    document.getElementById('coords').style.opacity = '1';
  }

  /* ── Scroll reveal (IntersectionObserver) ──────────── */
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.dataset.reveal === 'char') {
            const chars = el.querySelectorAll('.hsst-char:not(.in)');
            chars.forEach((c, i) => {
              setTimeout(() => c.classList.add('in'), i * 15 + Math.random() * 100);
            });
          } else {
            el.classList.add('in');
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, root: document.getElementById('scroll-root') });

    document.querySelectorAll('[data-reveal]').forEach(el => {
      if (el.closest('.hero')) return;
      observer.observe(el);
    });
  }

  /* ── Theme toggle ──────────────────────────────────── */
  const themeBtn = document.getElementById('themeBtn');
  const themeLabel = document.getElementById('themeLabel');
  const html = document.documentElement;
  let currentTheme = 'light';

  themeBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', currentTheme);
    themeLabel.textContent = currentTheme === 'light' ? 'Theme[A]' : 'Theme[D]';
    if (window.__updateFluidTheme) window.__updateFluidTheme(currentTheme);
  });

  /* ── Sound toggle (visual only) ────────────────────── */
  const soundBtn = document.getElementById('soundBtn');
  const soundLabel = document.getElementById('soundLabel');
  let soundOn = true;
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    soundLabel.textContent = soundOn ? 'Sound[|]' : 'Sound[X]';
    const dot = soundBtn.querySelector('.pulse-dot');
    if (dot) dot.style.opacity = soundOn ? '1' : '0.3';
  });

  /* ── Clock ──────────────────────────────────────────── */
  function updateClock() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const gmt8 = new Date(utc + 8 * 3600000);
    const hh = String(gmt8.getHours()).padStart(2, '0');
    const mm = String(gmt8.getMinutes()).padStart(2, '0');
    document.getElementById('clockLabel').textContent = 'GMT+8 ' + hh + ':' + mm;
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ── Coordinates ────────────────────────────────────── */
  const coordsEl = document.getElementById('coords');
  document.addEventListener('mousemove', (e) => {
    const x = String(Math.round(e.clientX)).padStart(4, '0');
    const y = String(Math.round(e.clientY)).padStart(4, '0');
    coordsEl.textContent = x + ' X ' + y + ' Y';
  });

  /* ── Nav scroll ────────────────────────────────────── */
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.scroll);
      if (target) {
        document.getElementById('scroll-root').scrollTo({ top: target.offsetTop, behavior: 'smooth' });
      }
    });
  });

  /* ── 3D Tilt cards ─────────────────────────────────── */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    const panel = card.querySelector('.tilt-card');
    const inner = card.querySelector('.tilt-inner');
    if (!panel) return;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      panel.style.transform = 'perspective(800px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg)';
      if (inner) inner.style.transform = 'translateZ(40px) translateX(' + (x * 10) + 'px) translateY(' + (y * 10) + 'px)';
    });
    card.addEventListener('mouseleave', () => {
      panel.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
      if (inner) inner.style.transform = 'translateZ(0)';
    });
  });

  /* ── Brand click → scroll top ───────────────────────── */
  document.querySelector('.brand').addEventListener('click', () => {
    document.getElementById('scroll-root').scrollTo({ top: 0, behavior: 'smooth' });
  });

})();

</script>
</body>
</html>`;