import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liz — Compact Preview",
  description:
    "A compact personal-site design template: editorial warmth, systems language, capability clustering — without the WebGL tax.",
};

/* ── data ────────────────────────────────────────────────── */

const clusters = [
  {
    index: "01",
    title: "Agent systems",
    tags: ["autonomous workflows", "tool routing", "eval loops"],
    body: "Building agents that ship real output — not demos. From multi-provider orchestration to cron-driven autonomous tasks that collect external evidence.",
  },
  {
    index: "02",
    title: "Product & writing",
    tags: ["personal site", "content pipeline", "GEO"],
    body: "Writing about the systems that shape how we work. Publishing infrastructure that treats content as product, not decoration.",
  },
  {
    index: "03",
    title: "Markets & health",
    tags: ["trading systems", "risk control", "health tech"],
    body: "Exploring the intersection of market structure, payments, and health data — where good engineering compounds into real outcomes.",
  },
];

const works = [
  { title: "Hermes Agent", year: "2024—26", col: "lg:col-span-7 lg:col-start-6", tag: "PLATFORM" },
  { title: "lizliz.xyz", year: "2023—26", col: "lg:col-span-4 lg:col-start-1", tag: "SITE" },
  { title: "Pep Words", year: "2024", col: "lg:col-span-3 lg:col-start-6", tag: "WEB GAME" },
  { title: "BrainRush", year: "2025", col: "lg:col-span-4 lg:col-start-10", tag: "EDTECH" },
  { title: "Writing pipeline", year: "2025", col: "lg:col-span-5 lg:col-start-1", tag: "SYSTEM" },
  { title: "Orion review", year: "2026", col: "lg:col-span-3 lg:col-start-7", tag: "TOOLING" },
];

const writing = [
  { title: "The anti-echo-chamber principle for AI agents", date: "2026.06", excerpt: "Progress is not defined by system growth, documentation volume, or workflow elegance — but by externally verified output." },
  { title: "Wealth is value exchange, not magic", date: "2026.05", excerpt: "Any system that claims to generate money without strategy, risk, monitoring, and external validation is a scam." },
  { title: "Slow is fast: building assets with friction", date: "2026.04", excerpt: "The path that looks slower — building durable systems, real distribution, honest content — is the one that compounds." },
];

/* ── styles ──────────────────────────────────────────────── */

const styles = `
/* ── scope: preview ── */
.pv { --pv-gap: clamp(1rem, 2.2vw, 1.6rem); }

/* dotted hover border — haoqi signature */
.pv-dot {
  position: relative;
  isolation: isolate;
}
.pv-dot::before {
  content: "";
  position: absolute;
  inset: 0;
  border: 2px dotted transparent;
  pointer-events: none;
  transition: border-color 200ms;
  z-index: 1;
}
.pv-dot:hover::before { border-color: var(--color-accent); }

/* project card */
.pv-card {
  display: block;
  text-decoration: none;
  transition: transform 280ms cubic-bezier(0.22,1,0.36,1);
}
.pv-card:hover { transform: translateY(-3px); }

/* system strip pulse */
@keyframes pv-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
.pv-live { animation: pv-pulse 2.4s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .pv-live { animation: none; }
  .pv-card { transition: none; }
}

/* giant text */
.pv-display {
  font-family: var(--font-poppins);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: -0.035em;
  line-height: 0.88;
  font-size: clamp(2.8rem, 9vw, 7rem);
  color: var(--fg);
}

.pv-display-soft {
  font-family: var(--font-poppins);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.92;
  font-size: clamp(2rem, 6.5vw, 5rem);
  color: var(--fg-secondary);
}

/* monospace label */
.pv-mono {
  font-family: var(--font-mono);
  font-size: 0.69rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ink-secondary);
}

/* serif identity */
.pv-serif {
  font-family: var(--font-instrument-serif), Georgia, serif;
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: -0.022em;
  color: var(--fg);
}

.pv-serif-lg {
  font-family: var(--font-instrument-serif), Georgia, serif;
  font-weight: 400;
  font-size: clamp(1.75rem, 3.8vw, 3.2rem);
  line-height: 1;
  letter-spacing: -0.028em;
  color: var(--fg);
}

/* body */
.pv-body {
  font-family: var(--font-lora), Georgia, serif;
  font-size: 1.06rem;
  line-height: 1.72;
  color: var(--fg-secondary);
}

/* link with accent underline */
.pv-link {
  color: var(--fg);
  text-decoration: underline;
  text-underline-offset: 0.14em;
  text-decoration-color: var(--color-accent);
  text-decoration-thickness: 1px;
  transition: text-decoration-thickness 150ms;
}
.pv-link:hover { text-decoration-thickness: 2px; }

/* tag pill */
.pv-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.22em 0.62em;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-family: var(--font-poppins);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--fg-secondary);
  background: color-mix(in oklab, var(--color-surface) 62%, transparent);
}

/* project placeholder */
.pv-ph {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background:
    linear-gradient(135deg, color-mix(in oklab, var(--bg) 84%, var(--fg) 4%), color-mix(in oklab, var(--bg) 92%, var(--color-accent) 8%));
  border: 1px solid color-mix(in oklab, var(--border-color) 78%, transparent);
  border-radius: 18px;
  overflow: hidden;
}
.pv-ph::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-accent) 6%, transparent) 0%, transparent 60%);
  pointer-events: none;
}

/* writing row */
.pv-row {
  border-top: 1px solid var(--border-color);
  padding: 1.1rem 0;
  transition: padding-left 240ms cubic-bezier(0.22,1,0.36,1);
}
.pv-row:hover { padding-left: 0.6rem; }
.pv-row:last-child { border-bottom: 1px solid var(--border-color); }

/* footer giant */
.pv-foot {
  font-family: var(--font-poppins);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 0.82;
  font-size: clamp(2.5rem, 8.5vw, 6.5rem);
  color: var(--fg);
}
.pv-foot-soft { color: var(--fg-secondary); }
`;

/* ── page ────────────────────────────────────────────────── */

export default function PreviewPage() {
  return (
    <main className="pv">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* ═══════ System header ═══════ */}
      <div
        className="sticky top-0 z-30 border-b border-[color:var(--border-color)]"
        style={{
          background: "color-mix(in oklab, var(--bg) 90%, transparent)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="mx-auto grid max-w-[1120px] grid-cols-12 items-center px-[clamp(1rem,3vw,2rem)] py-3">
          {/* Left: logo */}
          <div className="col-span-3 flex items-center gap-2">
            <span
              className="grid h-6 w-6 place-items-center rounded-full text-[13px] font-bold"
              style={{ background: "var(--fg)", color: "var(--bg)", fontFamily: "var(--font-poppins)" }}
            >
              L
            </span>
            <span className="pv-mono">lizliz.xyz</span>
          </div>

          {/* Center: nav */}
          <nav className="col-span-4 hidden justify-center gap-5 md:flex">
            {["Index", "Work", "About", "Contact"].map((label) => (
              <span key={label} className="pv-dot cursor-pointer px-1">
                <span className="pv-mono" style={{ color: "var(--fg)" }}>{label}</span>
              </span>
            ))}
          </nav>

          {/* Right: system strip */}
          <div className="col-span-5 flex items-center justify-end gap-4 md:col-span-5">
            <span className="pv-mono hidden sm:inline">THEME[A]</span>
            <span className="pv-mono hidden sm:inline">SOUND[|]</span>
            <span className="pv-mono flex items-center gap-1.5">
              <span
                className="pv-live inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--color-green)" }}
              />
              GMT+8
            </span>
          </div>
        </div>
      </div>

      {/* ═══════ Identity ═══════ */}
      <section className="mx-auto max-w-[1120px] px-[clamp(1rem,3vw,2rem)] py-[clamp(3rem,7vw,5.5rem)]">
        <div className="grid grid-cols-12 gap-[var(--pv-gap)]">
          {/* Left: label + name */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-1">
            <div className="mb-6 flex items-center gap-3">
              <span className="pv-mono" style={{ color: "var(--color-accent)" }}>00 / IDENTITY</span>
              <span className="h-px flex-1 max-w-[60px]" style={{ background: "var(--border-color)" }} />
            </div>
            <h1 className="pv-serif-lg">
              Independent<br />
              developer building<br />
              at the edge of<br />
              <span style={{ color: "var(--color-accent)" }}>agents</span>,{" "}
              <span style={{ color: "var(--color-blue)" }}>markets</span>,<br />
              and <span style={{ fontStyle: "italic" }}>words</span>.
            </h1>
          </div>

          {/* Right: bio paragraph */}
          <div className="col-span-12 mt-8 lg:col-span-5 lg:col-start-8 lg:mt-0 lg:pt-2">
            <p className="pv-body">
              Hi — I&apos;m Liz. I build agent systems, ship products, and write
              about the infrastructure of how we work and think. This is a
              preview of a compact design language for my personal site:
              editorial warmth, systems structure, and capability clustering
              without the WebGL tax.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="pv-tag">Agent systems</span>
              <span className="pv-tag">Product</span>
              <span className="pv-tag">Writing</span>
              <span className="pv-tag">Markets</span>
            </div>
          </div>
        </div>

        {/* Giant statement below */}
        <div className="mt-[clamp(2.5rem,6vw,4.5rem)]">
          <p className="pv-display">
            ship signal,<br />
            not noise
          </p>
        </div>
      </section>

      {/* ═══════ Capability clusters ═══════ */}
      <section
        className="border-y"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="mx-auto max-w-[1120px] px-[clamp(1rem,3vw,2rem)] py-[clamp(3rem,7vw,5rem)]">
          <div className="mb-10 flex items-center gap-3">
            <span className="pv-mono" style={{ color: "var(--color-accent)" }}>01 / CAPABILITIES</span>
            <span className="h-px flex-1" style={{ background: "var(--border-color)" }} />
          </div>

          <div className="grid grid-cols-12 gap-y-12">
            {clusters.map((cluster, i) => (
              <div
                key={cluster.index}
                className={`col-span-12 md:col-span-6 lg:col-span-4 ${i === 0 ? "lg:col-start-1" : i === 1 ? "lg:col-start-5" : "lg:col-start-9"}`}
              >
                {/* mono index */}
                <span
                  className="pv-mono block mb-3"
                  style={{ color: "var(--color-accent)", fontSize: "0.78rem" }}
                >
                  {cluster.index}
                </span>

                {/* serif heading */}
                <h3 className="pv-serif lg:text-[1.5rem] mb-3" style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.65rem)", lineHeight: 1.05 }}>
                  {cluster.title}
                </h3>

                {/* tags */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {cluster.tags.map((tag) => (
                    <span key={tag} className="pv-tag">{tag}</span>
                  ))}
                </div>

                {/* body */}
                <p className="pv-body" style={{ fontSize: "0.95rem" }}>
                  {cluster.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Selected work ═══════ */}
      <section className="mx-auto max-w-[1120px] px-[clamp(1rem,3vw,2rem)] py-[clamp(3rem,7vw,5rem)]">
        <div className="mb-10 flex items-center gap-3">
          <span className="pv-mono" style={{ color: "var(--color-accent)" }}>02 / SELECTED WORK</span>
          <span className="h-px flex-1" style={{ background: "var(--border-color)" }} />
          <span className="pv-mono">{works.length} PROJECTS</span>
        </div>

        {/* asymmetric 12-col grid */}
        <div className="grid grid-cols-12 gap-x-[var(--pv-gap)] gap-y-10">
          {works.map((work) => (
            <a
              key={work.title}
              href="#"
              className={`pv-card pv-dot col-span-6 sm:col-span-6 ${work.col}`}
            >
              {/* placeholder */}
              <div className="pv-ph" />

              {/* label row */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="pv-mono"
                    style={{ color: "var(--color-accent)", fontSize: "0.6rem" }}
                  >
                    {work.tag}
                  </span>
                  <span className="pv-mono hidden sm:inline" style={{ fontSize: "0.6rem" }}>·</span>
                  <span className="pv-mono hidden sm:inline" style={{ fontSize: "0.6rem" }}>
                    {work.year}
                  </span>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ color: "var(--color-accent)", opacity: 0.5 }}>
                  <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* title */}
              <h3 className="mt-1.5 pv-serif" style={{ fontSize: "1.15rem", lineHeight: 1.1 }}>
                {work.title}
              </h3>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════ Writing proof ═══════ */}
      <section
        className="border-y"
        style={{ borderColor: "var(--border-color)", background: "color-mix(in oklab, var(--color-surface) 48%, transparent)" }}
      >
        <div className="mx-auto max-w-[1120px] px-[clamp(1rem,3vw,2rem)] py-[clamp(3rem,7vw,5rem)]">
          <div className="mb-8 flex items-center gap-3">
            <span className="pv-mono" style={{ color: "var(--color-accent)" }}>03 / WRITING</span>
            <span className="h-px flex-1" style={{ background: "var(--border-color)" }} />
          </div>

          <div>
            {writing.map((item) => (
              <div key={item.title} className="pv-row">
                <div className="grid grid-cols-12 items-baseline gap-4">
                  <div className="col-span-12 md:col-span-8">
                    <h3 className="pv-serif mb-1" style={{ fontSize: "1.18rem", lineHeight: 1.25 }}>
                      {item.title}
                    </h3>
                    <p className="pv-body" style={{ fontSize: "0.88rem", opacity: 0.72 }}>
                      {item.excerpt}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-3 md:col-start-10">
                    <span className="pv-mono">{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <a href="#" className="pv-link mt-6 inline-block pv-mono" style={{ fontSize: "0.72rem" }}>
            VIEW ALL WRITING →
          </a>
        </div>
      </section>

      {/* ═══════ About strip ═══════ */}
      <section className="mx-auto max-w-[1120px] px-[clamp(1rem,3vw,2rem)] py-[clamp(3rem,7vw,5rem)]">
        <div className="grid grid-cols-12 gap-[var(--pv-gap)]">
          <div className="col-span-12 lg:col-span-4 lg:col-start-1">
            <div className="mb-4 flex items-center gap-3">
              <span className="pv-mono" style={{ color: "var(--color-accent)" }}>04 / ABOUT</span>
              <span className="h-px flex-1 max-w-[40px]" style={{ background: "var(--border-color)" }} />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-5">
            <p className="pv-body" style={{ fontSize: "1.15rem", lineHeight: 1.7 }}>
              I run a small cloud server with AI agents that ship real output —
              content pipelines, monitoring systems, and autonomous tasks.
              Outside of building, I write about the intersection of agent
              systems, market structure, and the writing craft. Based in
              GMT+8. Independent by choice.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a href="#" className="pv-mono pv-dot px-1" style={{ color: "var(--fg)" }}>GitHub ↗</a>
              <a href="#" className="pv-mono pv-dot px-1" style={{ color: "var(--fg)" }}>X / Twitter ↗</a>
              <a href="#" className="pv-mono pv-dot px-1" style={{ color: "var(--fg)" }}>RSS ↗</a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Footer ═══════ */}
      <footer
        className="overflow-hidden"
        style={{ background: "color-mix(in oklab, var(--color-muted) 32%, transparent)" }}
      >
        <div className="mx-auto max-w-[1120px] px-[clamp(1rem,3vw,2rem)] py-[clamp(3.5rem,8vw,6rem)]">
          <p className="pv-foot">
            let&apos;s make<br />
            <span className="pv-foot-soft">something</span><br />
            that matters
          </p>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t sm:flex-row sm:items-end"
            style={{ borderColor: "var(--border-color)", paddingTop: "1.5rem" }}
          >
            {/* left: contact */}
            <div>
              <span className="pv-mono block mb-2">CONTACT</span>
              <a href="mailto:" className="pv-link pv-serif" style={{ fontSize: "1.15rem" }}>
                liz@lizliz.xyz
              </a>
            </div>

            {/* center: meta */}
            <div className="sm:text-center">
              <span className="pv-mono block mb-1">BUILT IN GMT+8</span>
              <span className="pv-mono" style={{ opacity: 0.6 }}>© 2026 Liz</span>
            </div>

            {/* right: links */}
            <div className="sm:text-right">
              <span className="pv-mono block mb-2">ELSEWHERE</span>
              <div className="flex gap-3 sm:justify-end">
                <a href="#" className="pv-mono pv-dot px-1" style={{ color: "var(--fg)" }}>GH</a>
                <a href="#" className="pv-mono pv-dot px-1" style={{ color: "var(--fg)" }}>X</a>
                <a href="#" className="pv-mono pv-dot px-1" style={{ color: "var(--fg)" }}>RSS</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}