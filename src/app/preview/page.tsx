import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liz — V3 Template",
  description:
    "Personal site template V3 — haoqi/maximeheckel inspired WebGL + char reveal + SVG signature.",
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
<title>Liz — V3 Template</title>
<meta name="description" content="Personal site template V3 — haoqi/maximeheckel inspired WebGL + char reveal." />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
<style>
:root {
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
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
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
html, body { height: 100%; overflow: hidden; }
body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; background-color: var(--bg-1); color: var(--label-1); font-family: var(--font-sans); font-weight: 500; }
::selection { background-color: var(--selection-bg); color: #000; }
a { color: inherit; text-decoration: inherit; }
.no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; }
.no-scrollbar::-webkit-scrollbar { width: 0; height: 0; display: none; }

#loader { position: fixed; inset: 0; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg-1); transition: opacity .6s var(--easing-66); }
#loader.done { opacity: 0; pointer-events: none; }
.load-counter { font-family: var(--font-mono); font-size: 14px; font-weight: 400; color: var(--label-2); letter-spacing: .08em; margin-bottom: 16px; }
.load-bar { width: 140px; height: 6px; border-radius: 999px; background: var(--label-3); overflow: hidden; }
.load-bar-fill { height: 100%; border-radius: 999px; background: var(--label-1); width: 0%; transition: width 520ms cubic-bezier(0.22, 1, 0.36, 1); }

#bg-canvas { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; opacity: 0; animation: canvas-fade-in 1.2s ease .3s forwards; animation-delay: 1s; }
@keyframes canvas-fade-in { to { opacity: 1; } }
#bg-canvas2 { position: fixed; inset: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; opacity: 0.4; }

#scroll-root { position: fixed; inset: 0; width: 100%; height: 100%; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; }
#scroll-root::-webkit-scrollbar { width: 0; height: 0; display: none; }

.hsst-char { display: inline-block; opacity: 0; transform: translateY(0.15em); }
.hsst-char.in { animation: hsst-fade 0.8s var(--easing-66) forwards; }
@keyframes hsst-fade { 0% { opacity: 0; transform: translateY(0.15em); } 32% { opacity: .22; } 62% { opacity: .55; transform: translateY(0.05em); } 100% { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .hsst-char { opacity: 1; transform: none; animation: none; } }

.reveal { opacity: 0; transform: translateY(30px); transition: opacity .8s var(--easing-66), transform .8s var(--easing-66); }
.reveal.in { opacity: 1; transform: translateY(0); }

.dot-hover { position: relative; }
.dot-hover::before { content: ""; position: absolute; inset: 0; border: 2px dotted transparent; pointer-events: none; transition: border-color .2s; z-index: 1; border-radius: inherit; }
.dot-hover:hover::before, .dot-hover:focus-visible::before, .dot-hover:active::before { border-color: var(--label-1); }

.site-header { position: fixed; top: 0; left: 0; right: 0; z-index: 50; display: flex; flex-direction: column; justify-content: space-between; font-family: var(--font-mono); pointer-events: none; transition: color .3s ease; mix-blend-mode: difference; }
.header-row { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; pointer-events: none; }
@media (min-width: 64rem) { .header-row { padding: 28px 56px; } }
.brand { font-family: var(--font-sans); font-weight: 800; text-transform: uppercase; letter-spacing: -0.025em; font-size: 16px; pointer-events: auto; cursor: pointer; transition: color .3s ease; mix-blend-mode: difference; color: var(--label-1); }
.nav-links { display: none; align-items: center; gap: 12px; pointer-events: auto; }
@media (min-width: 64rem) { .nav-links { display: flex; } }
.nav-btn { position: relative; text-transform: uppercase; font-size: 14px; cursor: pointer; padding: 8px 12px; background: none; border: none; color: inherit; font-family: var(--font-mono); letter-spacing: .04em; transition: color .3s ease; }
.sys-panel { display: flex; align-items: center; gap: 12px; pointer-events: auto; }
.sys-panel .nav-btn { font-size: 13px; }
.pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: #39a86b; animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(57,168,107,.4); } 50% { opacity: .6; box-shadow: 0 0 0 6px rgba(57,168,107,0); } }

.coords { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 50; font-family: var(--font-mono); font-size: 13px; color: var(--label-2); letter-spacing: .06em; text-transform: uppercase; pointer-events: none; mix-blend-mode: difference; opacity: 0; transition: opacity .5s ease; }
@media (max-width: 63rem) { .coords { display: none; } }

.grid-12 { display: grid; grid-template-columns: repeat(12, minmax(0,1fr)); }
.section-pad { padding: 72px 24px; }
@media (min-width: 64rem) { .section-pad { padding: 96px 56px; } }

.hero { min-height: 100vh; height: 100dvh; display: flex; flex-direction: column; justify-content: space-between; }
.hero-top { flex: 1; display: flex; align-items: flex-end; padding-bottom: 24px; }
.hero-identity { font-size: clamp(1.2rem, 3vw, 1.6rem); font-weight: 600; letter-spacing: -0.02em; line-height: 1.25; max-width: 600px; }
.hero-identity .accent-text { color: var(--label-2); }
.hero-bottom { font-size: clamp(3rem, 7.2svw, 6rem); font-weight: 800; text-transform: uppercase; line-height: .88; letter-spacing: -0.035em; }

.section-heading { font-size: clamp(3rem, 7.2svw, 6.8svw); font-weight: 800; text-transform: uppercase; line-height: .88; letter-spacing: -0.035em; text-align: center; padding: 80px 0; min-height: 1px; }
.section-heading-sticky { position: sticky; top: 0; }

.work-grid { display: grid; grid-template-columns: repeat(12, minmax(0,1fr)); row-gap: 0; }
.work-card { display: block; padding: 8px; }
.work-card-visual { aspect-ratio: 1 / 1; border: 1px solid var(--line); border-radius: 12px; background: var(--bg-elevated); position: relative; overflow: hidden; transition: border-color .2s ease; display: block; }
.work-card:hover .work-card-visual { border-color: var(--label-3); }
.work-card-badge { position: absolute; top: 0; right: 0; background: var(--selection-bg); color: #000; font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: .04em; padding: 3px 8px; z-index: 2; }
.work-card-meta { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; font-size: 13px; text-transform: uppercase; letter-spacing: .04em; font-family: var(--font-mono); }
.work-card-meta .year { color: var(--label-2); }

.svg-stamp { position: relative; }
.svg-stamp svg { position: absolute; top: -3.125%; left: -8.33333%; width: 75%; pointer-events: none; }
.svg-stamp .svg-stamp-placeholder { aspect-ratio: 1 / 1; }
.svg-sign__path { opacity: 0; fill: none; stroke-linecap: butt; }
.svg-sign.is-drawing .svg-sign__path { animation: svg-sign-show 0s linear var(--path-delay) forwards, svg-sign-draw var(--path-dur) cubic-bezier(0.65, 0, 0.35, 1) var(--path-delay) forwards; }
@keyframes svg-sign-draw { to { stroke-dashoffset: 0; } }
@keyframes svg-sign-show { to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .svg-sign.is-drawing .svg-sign__path { animation: none; stroke-dashoffset: 0; opacity: 1; } }

.footer { height: 100vh; height: 100dvh; display: flex; flex-direction: column; justify-content: center; position: relative; pointer-events: none; }
.footer-words { display: grid; grid-template-columns: repeat(12, minmax(0,1fr)); gap: 8px; }
.footer-word { font-size: clamp(3rem, 7.2svw, 6svw); font-weight: 800; text-transform: uppercase; line-height: .88; letter-spacing: -0.035em; pointer-events: auto; }
.footer-contact { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 72px 24px; font-family: var(--font-mono); font-size: 15px; }
@media (min-width: 64rem) { .footer-contact { padding: 96px 56px; } }
.footer-contact-row { display: flex; justify-content: space-between; width: 100%; pointer-events: auto; }
.footer-contact-row a { text-transform: uppercase; padding: 8px 12px; cursor: pointer; }
.footer-links { display: flex; gap: 8px; }
@media (min-width: 64rem) { .footer-links { gap: 16px; } }

.tilt-card { transform-style: preserve-3d; transition: transform .15s ease; }
.tilt-inner { transform-style: preserve-3d; }

.writing-row { display: flex; align-items: center; gap: 12px; padding: 16px 8px; border-top: 1px solid var(--line); transition: transform .3s var(--easing-66), color .3s ease; }
.writing-row:hover { transform: translateX(16px); }
.writing-row:last-child { border-bottom: 1px solid var(--line); }
.writing-row .date { font-family: var(--font-mono); font-size: 13px; color: var(--label-3); text-transform: uppercase; }
.writing-row .title { font-size: 18px; font-weight: 600; flex: 1; }
.writing-row .arrow { color: var(--label-3); transition: color .3s ease; }
.writing-row:hover .arrow { color: var(--label-1); }

.caption { font-family: var(--font-mono); font-size: 13px; color: var(--label-2); letter-spacing: .06em; text-transform: uppercase; padding: 8px; }
</style>
</head>
<body>

<div id="loader">
  <div class="load-counter" id="loadCounter">0.00</div>
  <div class="load-bar"><div class="load-bar-fill" id="loadBar"></div></div>
</div>

<canvas id="bg-canvas"></canvas>
<canvas id="bg-canvas2"></canvas>

<div id="scroll-root" class="no-scrollbar">
  <div>

    <header class="site-header">
      <div class="header-row">
        <a class="brand dot-hover" href="#top">LIZ.DESIGN</a>
        <nav class="nav-links">
          <button class="nav-btn dot-hover" data-scroll="work">Work</button>
          <button class="nav-btn dot-hover" data-scroll="contact">Contact</button>
          <span class="nav-btn dot-hover" id="themeBtn" role="button" tabindex="0"><span id="themeLabel">Theme[A]</span></span>
          <span class="nav-btn dot-hover" id="soundBtn" role="button" tabindex="0"><span class="pulse-dot" style="display:inline-block;vertical-align:middle;margin-right:4px;width:6px;height:6px;"></span><span id="soundLabel">Sound[|]</span></span>
        </nav>
      </div>
      <div class="header-row">
        <span class="nav-btn" style="font-size:13px;color:var(--label-2);" id="clockLabel">GMT+8 --:--</span>
      </div>
    </header>

    <div class="coords" id="coords">0001 X 0001 Y</div>

    <section id="top" class="hero section-pad">
      <div class="hero-top">
        <div class="grid-12" style="width:100%">
          <div class="hero-identity" style="grid-column: span 12;" data-reveal>
            <p class="caption" style="padding:8px;">Liz \u2014 Design & Engineering</p>
            <p style="padding:8px;font-size:clamp(1rem,3vw,1.4rem);line-height:1.3;color:var(--label-2);">Building AI-native products at the intersection of craft, systems thinking, and taste. Exploring how agents extend human capability.</p>
          </div>
        </div>
      </div>
      <div class="hero-bottom">
        <div data-reveal="char">
          <div>I BRING</div>
          <div>CRAFT & TASTE</div>
          <div>TO DIGITAL WORK</div>
        </div>
      </div>
    </section>

    <section class="section-pad">
      <div class="grid-12">
        <div class="svg-stamp" style="grid-column: span 12; padding:8px;" data-reveal>
          <div class="svg-stamp-placeholder"></div>
          <svg viewBox="0 0 320 154" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-sign" aria-hidden="true">
            <path class="svg-sign__path" d="M138.27 11.77C123.15 39.39 106.22 85.5 102.06 100.03C98.66 111.9 98.37 128.79 98.63 131.17" stroke="#c0fe04" stroke-width="4" fill="none" style="--path-dur:1.2s;--path-delay:0s;stroke-dasharray:200;stroke-dashoffset:200;" />
            <path class="svg-sign__path" d="M78.23 42.07C68.25 91.68 24.52 161.89 11.61 145.08C-3.91 124.87 84.42 80.04 149.13 70.31C129.18 76.88 121.73 89.34 127.22 93.32C137.21 100.56 148.93 80.91 154.83 68.44C154.83 68.44 145.92 84 152.86 86.46C163.67 90.27 183.35 47.45 193.77 55.61C200.86 61.17 188 78.04 180.89 75.65C176.52 74.17 179.98 64.54 184.58 59.69C186.63 62.17 192.88 65.7 201.5 59.91C210.12 54.12 217.99 47.64 220.84 45.12" stroke="#c0fe04" stroke-width="4" fill="none" style="--path-dur:2.5s;--path-delay:.3s;stroke-dasharray:500;stroke-dashoffset:500;" />
            <path class="svg-sign__path" d="M235.55 43.43C221.98 37.37 206.4 60.4 215.72 63.12C224.12 65.58 234.43 48.01 239.2 40.12C237.61 42.75 234.82 53.67 235.16 66.2C235.57 81.85 228.17 116.93 217.43 114.67C206.69 112.42 217.71 80.36 242.78 57.37C262.83 38.97 269.55 28.9 270.4 26.16C266.38 32.05 260.25 44.25 267.96 45.92C275.67 47.59 298.15 19.83 308.42 5.75" stroke="#c0fe04" stroke-width="4" fill="none" style="--path-dur:3s;--path-delay:.6s;stroke-dasharray:600;stroke-dashoffset:600;" />
          </svg>
        </div>
        <div style="grid-column: span 12; padding:8px;" data-reveal>
          <p style="font-size:clamp(1.1rem, 4.2vw, 2.2rem); line-height:1.3; font-weight:500;">I explore how to shape AI-era workflows with craft and taste, building the next generation of digital products.</p>
          <p style="font-size:clamp(1.1rem, 4.2vw, 2.2rem); line-height:1.3; color:var(--label-2); font-weight:500; margin-top:16px;">Currently building tools for agent-driven development. Previously shipped products in automation, search, and developer tooling.</p>
        </div>
      </div>
    </section>

    <section id="work" class="section-pad" style="padding-top:48px;">
      <div class="work-grid">
        <article class="work-card dot-hover" style="grid-column: span 12;" data-tilt data-reveal>
          <a class="work-card-visual tilt-card" id="tiltPanel1"><span class="work-card-badge">Coding Project</span><div class="tilt-inner" style="position:absolute;inset:0;display:grid;place-items:center;"><span style="font-size:42px;font-weight:800;letter-spacing:-0.03em;opacity:.15;">01</span></div></a>
          <div class="work-card-meta"><span>Project Alpha</span><span class="year">2024-2026</span></div>
        </article>
        <article class="work-card dot-hover" style="grid-column: span 12;" data-tilt data-reveal>
          <a class="work-card-visual tilt-card" id="tiltPanel2"><span class="work-card-badge">Coding Project</span><div class="tilt-inner" style="position:absolute;inset:0;display:grid;place-items:center;"><span style="font-size:42px;font-weight:800;letter-spacing:-0.03em;opacity:.15;">02</span></div></a>
          <div class="work-card-meta"><span>Inspire Mono</span><span class="year">2025</span></div>
        </article>
        <article class="work-card dot-hover" style="grid-column: span 12;" data-tilt data-reveal>
          <a class="work-card-visual tilt-card" id="tiltPanel3"><span class="work-card-badge">Coding Project</span><div class="tilt-inner" style="position:absolute;inset:0;display:grid;place-items:center;"><span style="font-size:42px;font-weight:800;letter-spacing:-0.03em;opacity:.15;">03</span></div></a>
          <div class="work-card-meta"><span>Wasm Utils</span><span class="year">2025</span></div>
        </article>
      </div>
    </section>

    <section class="section-heading section-heading-sticky" data-reveal="char">
      <div>INNOVATE</div><div>WITH</div><div>PURPOSE</div>
    </section>

    <section class="section-pad">
      <p class="caption" data-reveal>Writing</p>
      <div data-reveal>
        <a class="writing-row dot-hover" href="#"><span class="date">2026.06</span><span class="title">The leverage hierarchy: where agents create the most value</span><span class="arrow">\u2192</span></a>
        <a class="writing-row dot-hover" href="#"><span class="date">2026.05</span><span class="title">Designing for trust in AI-mediated interfaces</span><span class="arrow">\u2192</span></a>
        <a class="writing-row dot-hover" href="#"><span class="date">2026.04</span><span class="title">Why the best personal sites look like systems, not pages</span><span class="arrow">\u2192</span></a>
        <a class="writing-row dot-hover" href="#"><span class="date">2026.03</span><span class="title">The compounding edge: small bets in public</span><span class="arrow">\u2192</span></a>
      </div>
    </section>

    <footer id="contact" class="footer">
      <div class="footer-words">
        <span class="footer-word" style="grid-column: 1 / span 6; text-align:left;" data-reveal="char"><div>LET'S</div></span>
        <span class="footer-word" style="grid-column: 7 / span 6; text-align:right;" data-reveal="char"><div>CREATE</div></span>
        <span class="footer-word" style="grid-column: 1 / span 12; text-align:left;" data-reveal="char"><div>SOMETHING</div></span>
        <span class="footer-word" style="grid-column: 1 / span 12; text-align:right;" data-reveal="char"><div>EXTRAORDINARY</div></span>
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

<script>
(function() {
  'use strict';

  var loader = document.getElementById('loader');
  var loadCounter = document.getElementById('loadCounter');
  var loadBar = document.getElementById('loadBar');
  var progress = 0;

  function loadTick() {
    progress += Math.random() * 0.15;
    if (progress >= 1) progress = 1;
    loadCounter.textContent = progress.toFixed(2);
    loadBar.style.width = (progress * 100) + '%';
    if (progress < 1) {
      setTimeout(loadTick, 80 + Math.random() * 120);
    } else {
      setTimeout(function() {
        loader.classList.add('done');
        startRevealSequence();
      }, 400);
    }
  }
  setTimeout(loadTick, 200);

  function wrapChars(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var texts = [];
    var node;
    while (node = walker.nextNode()) {
      if (node.textContent.trim() && node.parentElement.tagName !== 'SCRIPT' && node.parentElement.tagName !== 'STYLE') {
        texts.push(node);
      }
    }
    texts.forEach(function(textNode) {
      var text = textNode.textContent;
      var frag = document.createDocumentFragment();
      for (var i = 0; i < text.length; i++) {
        var char = text[i];
        var span = document.createElement('span');
        span.className = 'hsst-char';
        span.textContent = char === ' ' ? '\\u00a0' : char;
        span.style.animationDelay = (Math.random() * 0.4 + 0.1) + 's';
        frag.appendChild(span);
      }
      textNode.parentNode.replaceChild(frag, textNode);
    });
  }

  document.querySelectorAll('[data-reveal="char"]').forEach(function(el) {
    wrapChars(el);
  });

  function startRevealSequence() {
    var heroChars = document.querySelectorAll('.hero .hsst-char');
    heroChars.forEach(function(c, i) {
      setTimeout(function() { c.classList.add('in'); }, i * 20);
    });

    var brandText = document.querySelector('.brand');
    if (brandText && !brandText.querySelector('.hsst-char')) {
      wrapChars(brandText);
    }
    var brandChars = document.querySelectorAll('.brand .hsst-char');
    brandChars.forEach(function(c, i) {
      setTimeout(function() { c.classList.add('in'); }, 200 + i * 30);
    });

    var svgSign = document.querySelector('.svg-sign');
    if (svgSign) {
      setTimeout(function() { svgSign.classList.add('is-drawing'); }, 600);
    }

    initScrollReveal();
    document.getElementById('coords').style.opacity = '1';
  }

  function initScrollReveal() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          if (el.dataset.reveal === 'char') {
            var chars = el.querySelectorAll('.hsst-char:not(.in)');
            chars.forEach(function(c, i) {
              setTimeout(function() { c.classList.add('in'); }, i * 15 + Math.random() * 100);
            });
          } else {
            el.classList.add('in');
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, root: document.getElementById('scroll-root') });

    document.querySelectorAll('[data-reveal]').forEach(function(el) {
      if (el.closest('.hero')) return;
      observer.observe(el);
    });
  }

  var themeBtn = document.getElementById('themeBtn');
  var themeLabel = document.getElementById('themeLabel');
  var html = document.documentElement;
  var currentTheme = 'light';

  themeBtn.addEventListener('click', function() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', currentTheme);
    themeLabel.textContent = currentTheme === 'light' ? 'Theme[A]' : 'Theme[D]';
  });

  var soundBtn = document.getElementById('soundBtn');
  var soundLabel = document.getElementById('soundLabel');
  var soundOn = true;
  soundBtn.addEventListener('click', function() {
    soundOn = !soundOn;
    soundLabel.textContent = soundOn ? 'Sound[|]' : 'Sound[X]';
    var dot = soundBtn.querySelector('.pulse-dot');
    if (dot) dot.style.opacity = soundOn ? '1' : '0.3';
  });

  function updateClock() {
    var now = new Date();
    var utc = now.getTime() + now.getTimezoneOffset() * 60000;
    var gmt8 = new Date(utc + 8 * 3600000);
    var hh = String(gmt8.getHours()).padStart(2, '0');
    var mm = String(gmt8.getMinutes()).padStart(2, '0');
    document.getElementById('clockLabel').textContent = 'GMT+8 ' + hh + ':' + mm;
  }
  updateClock();
  setInterval(updateClock, 1000);

  var coordsEl = document.getElementById('coords');
  document.addEventListener('mousemove', function(e) {
    var x = String(Math.round(e.clientX)).padStart(4, '0');
    var y = String(Math.round(e.clientY)).padStart(4, '0');
    coordsEl.textContent = x + ' X ' + y + ' Y';
  });

  document.querySelectorAll('[data-scroll]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = document.getElementById(btn.dataset.scroll);
      if (target) {
        document.getElementById('scroll-root').scrollTo({ top: target.offsetTop, behavior: 'smooth' });
      }
    });
  });

  document.querySelectorAll('[data-tilt]').forEach(function(card) {
    var panel = card.querySelector('.tilt-card');
    var inner = card.querySelector('.tilt-inner');
    if (!panel) return;
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      panel.style.transform = 'perspective(800px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg)';
      if (inner) inner.style.transform = 'translateZ(40px) translateX(' + (x * 10) + 'px) translateY(' + (y * 10) + 'px)';
    });
    card.addEventListener('mouseleave', function() {
      panel.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
      if (inner) inner.style.transform = 'translateZ(0)';
    });
  });

  // WebGL FBM noise background
  var canvas = document.getElementById('bg-canvas');
  var gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
  if (gl) {
    function resize() {
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    var vsSource = 'attribute vec2 a_pos; varying vec2 v_uv; void main(){ v_uv=a_pos*0.5+0.5; gl_Position=vec4(a_pos,0.0,1.0); }';
    var fsSource = [
      'precision highp float;',
      'varying vec2 v_uv;',
      'uniform float u_time;',
      'uniform vec2 u_mouse;',
      'uniform float u_theme;',
      'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);float a=hash(i);float b=hash(i+vec2(1.0,0.0));float c=hash(i+vec2(0.0,1.0));float d=hash(i+vec2(1.0,1.0));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}',
      'float fbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}',
      'void main(){',
      '  vec2 uv=v_uv;',
      '  vec2 p=uv*3.0;',
      '  vec2 q=vec2(fbm(p+u_time*0.05),fbm(p+vec2(1.0)));',
      '  vec2 r=vec2(fbm(p+q+vec2(1.7,9.2)+u_time*0.08),fbm(p+q+vec2(8.3,2.8)+u_time*0.06));',
      '  float f=fbm(p+r*1.5);',
      '  float md=length(uv-u_mouse);',
      '  f+=smoothstep(0.4,0.0,md)*0.15;',
      '  float t=u_theme;',
      '  vec3 lightCol=vec3(0.75,0.69,0.57);',
      '  vec3 darkCol=vec3(0.06,0.07,0.07);',
      '  vec3 base=mix(lightCol,darkCol,t);',
      '  vec3 accent=vec3(0.75,1.0,0.02);',
      '  vec3 col=base+f*0.08;',
      '  col=mix(col,col+accent*0.02,smoothstep(0.55,0.75,f));',
      '  gl_FragColor=vec4(col,0.06);',
      '}'
    ].join('\\n');

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; }
      return s;
    }

    var vs = compile(gl.VERTEX_SHADER, vsSource);
    var fs = compile(gl.FRAGMENT_SHADER, fsSource);
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    var posLoc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    var timeLoc = gl.getUniformLocation(prog, 'u_time');
    var mouseLoc = gl.getUniformLocation(prog, 'u_mouse');
    var themeLoc = gl.getUniformLocation(prog, 'u_theme');
    var mouse = { x: 0.5, y: 0.5 };
    document.addEventListener('mousemove', function(e) {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1.0 - e.clientY / window.innerHeight;
    });

    var startTime = performance.now();
    function render() {
      var t = (performance.now() - startTime) / 1000;
      gl.uniform1f(timeLoc, t);
      gl.uniform2f(mouseLoc, mouse.x, mouse.y);
      gl.uniform1f(themeLoc, currentTheme === 'dark' ? 1.0 : 0.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }
    render();
  }

  // Canvas2: secondary particle layer
  var canvas2 = document.getElementById('bg-canvas2');
  var ctx2 = canvas2.getContext('2d');
  var particles = [];

  function resizeCanvas2() {
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    initParticles();
  }
  function initParticles() {
    particles = [];
    for (var i = 0; i < 60; i++) {
      particles.push({ x: Math.random()*canvas2.width, y: Math.random()*canvas2.height, vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3, r: Math.random()*2+0.5, a: Math.random()*0.3+0.1 });
    }
  }
  resizeCanvas2();
  window.addEventListener('resize', resizeCanvas2);

  function renderCanvas2() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    var isDark = currentTheme === 'dark';
    particles.forEach(function(p) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas2.width;
      if (p.x > canvas2.width) p.x = 0;
      if (p.y < 0) p.y = canvas2.height;
      if (p.y > canvas2.height) p.y = 0;
      ctx2.beginPath();
      ctx2.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx2.fillStyle = isDark ? 'rgba(192,254,4,' + (p.a * 0.15) + ')' : 'rgba(54,54,48,' + (p.a * 0.1) + ')';
      ctx2.fill();
    });
    requestAnimationFrame(renderCanvas2);
  }
  renderCanvas2();

})();
</script>
</body>
</html>`;