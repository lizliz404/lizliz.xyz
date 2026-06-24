export const metadata = {
  title: "Liz Personal Compact — Preview",
  description: "Preview of the compact personal-site template combining editorial warmth and a lightweight systems feel.",
};

const signalRows = [
  ["Editorial", "Serif headline, warm paper, calm spacing, one accent."],
  ["Systems", "Theme / sound / status language without control-panel bloat."],
  ["Clustering", "Projects grouped by capability instead of a flat feed."],
  ["Motion", "Tiny hover and fade only. No first-load tax."],
];

const rules = [
  "Use serif for identity, sans for UI, monospace only when needed.",
  "Keep the homepage centered on one thesis.",
  "Group projects by capability and outcome.",
  "Let writing and projects do the credibility work.",
];

export default function PreviewPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]" style={{ background: "linear-gradient(180deg, var(--bg), #f7f4ed 58%, var(--bg))" }}>
      <div className="mx-auto min-h-screen max-w-[1120px] px-6 py-6">
        <header className="sticky top-0 z-20 mb-6 flex h-[68px] items-center justify-between gap-6 border-b border-[var(--border-color)] bg-[color:rgba(250,249,245,0.84)] backdrop-blur-md">
          <div className="flex items-center gap-3 font-[var(--font-poppins)] text-[15px] font-semibold tracking-[-0.02em]">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--fg)] text-[var(--bg)] text-[14px] font-bold">L</span>
            <span>Liz Personal Compact</span>
          </div>
          <div className="hidden gap-7 font-[var(--font-poppins)] text-[13px] font-medium text-[var(--fg-secondary)] md:flex">
            <a href="#signals">Signals</a>
            <a href="#rules">Rules</a>
            <a href="#preview">Preview</a>
          </div>
          <a className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--fg)] px-4 font-[var(--font-poppins)] text-[13px] font-semibold" href="#preview">
            Open preview
          </a>
        </header>

        <section className="grid items-center gap-10 py-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(440px,0.82fr)] lg:py-16">
          <div>
            <p className="mb-4 font-[var(--font-poppins)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-blue)]">
              Compact personal site template · high signal, low weight
            </p>
            <h1 className="max-w-[840px] text-[clamp(48px,7vw,90px)] font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--fg)] font-[var(--font-instrument-serif)]">
              Warm editorial structure for a personal site that still feels like a system.
            </h1>
            <p className="max-w-[680px] text-[clamp(19px,2vw,24px)] leading-[1.58] text-[var(--fg-secondary)] font-[var(--font-lora)]">
              This preview borrows the best bits from Vercel&apos;s typographic discipline, Haoqi&apos;s systems language, and Maxime&apos;s capability clustering — then cuts the heavy WebGL tax.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="inline-flex h-[46px] items-center justify-center rounded-full border border-[var(--fg)] bg-[var(--fg)] px-5 text-[13px] font-semibold text-[var(--bg)]" href="#preview">
                Inspect preview
              </a>
              <a className="inline-flex h-[46px] items-center justify-center rounded-full border border-[var(--color-ink)] bg-[rgba(255,253,248,0.56)] px-5 text-[13px] font-semibold text-[var(--fg)]" href="#rules">
                See rules
              </a>
            </div>
            <p className="mt-4 text-[13px] text-[var(--color-ink-secondary)]">Goal: visual upgrade with minimal payload. Not a motion playground.</p>
          </div>

          <aside className="relative -m-0 rounded-[28px] border border-[var(--border-color)] bg-[linear-gradient(180deg,rgba(255,253,248,0.94),rgba(241,238,230,0.7))] p-6 shadow-[0_22px_70px_rgba(43,37,27,0.09)]">
            <div className="mb-4 flex justify-between border-b border-[var(--border-color)] pb-4 font-[var(--font-poppins)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-secondary)]">
              <span>THEME</span>
              <span>SOUND</span>
              <span>GMT+8</span>
            </div>
            <div className="relative grid min-h-[450px] place-items-center overflow-hidden rounded-[22px] bg-[radial-gradient(circle_at_50%_50%,rgba(255,253,248,0.46),transparent_62%),radial-gradient(circle_at_50%_52%,rgba(199,111,58,0.08),transparent_56%)]">
              <div className="absolute inset-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(199,111,58,0.2)]" />
              <div className="absolute inset-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(79,111,143,0.18)]" />
              <div className="absolute inset-1/2 h-[130px] w-[130px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(111,143,114,0.2)]" />
              <span className="absolute right-[130px] top-[104px] h-[14px] w-[14px] rounded-full bg-[var(--color-accent)] shadow-[0_0_0_12px_rgba(255,255,255,0.18)]" />
              <span className="absolute left-[112px] bottom-[112px] h-[14px] w-[14px] rounded-full bg-[var(--color-blue)] shadow-[0_0_0_12px_rgba(255,255,255,0.18)]" />
              <span className="absolute right-[88px] bottom-[170px] h-[14px] w-[14px] rounded-full bg-[var(--color-green)] shadow-[0_0_0_12px_rgba(255,255,255,0.18)]" />
              <span className="absolute bottom-[26px] left-1/2 -translate-x-1/2 rounded-full border border-[var(--border-color)] bg-[rgba(255,253,248,0.82)] px-4 py-2 font-[var(--font-poppins)] text-[12px] font-semibold tracking-[0.02em] text-[var(--fg-secondary)]">
                writing / projects / experiments
              </span>
            </div>
          </aside>
        </section>

        <section className="border-y border-[var(--border-color)] bg-[rgba(255,253,248,0.44)] py-10">
          <div className="grid gap-8 md:grid-cols-[260px_minmax(0,1fr)] md:items-baseline">
            <p className="m-0 text-[13px] font-semibold leading-[1.55] text-[var(--color-accent)] font-[var(--font-poppins)]">Take</p>
            <h2 className="m-0 text-[clamp(28px,4vw,50px)] font-medium leading-[1.13] tracking-[-0.035em] text-[var(--fg)] font-[var(--font-instrument-serif)]">
              Do not copy the heavy parts. Copy the legible parts: typography, clustering, microcopy, and a few precise visual moves.
            </h2>
          </div>
        </section>

        <section className="py-24" id="signals">
          <div className="max-w-[760px] mb-12">
            <p className="mb-4 font-[var(--font-poppins)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-blue)]">Signals</p>
            <h2 className="text-[clamp(32px,5vw,60px)] font-medium leading-[0.98] tracking-[-0.045em] text-[var(--fg)] font-[var(--font-instrument-serif)]">
              Three visual languages, one compact template.
            </h2>
          </div>
          <div className="grid border-l border-t border-[var(--border-color)] md:grid-cols-3">
            {signalRows.map(([title, body], index) => (
              <article key={title} className={`min-h-[190px] border-b border-r border-[var(--border-color)] p-7 ${index === 1 ? 'bg-[rgba(79,111,143,0.055)]' : index === 2 ? 'bg-[rgba(199,111,58,0.055)]' : index === 5 ? 'bg-[rgba(111,143,114,0.055)]' : 'bg-[rgba(250,249,245,0.52)]'}`}>
                <h3 className="mb-3 text-[20px] font-semibold leading-[1.1] tracking-[-0.045em] text-[var(--fg)] font-[var(--font-poppins)]">{title}</h3>
                <p className="m-0 text-[15px] leading-[1.7] text-[var(--fg-secondary)]">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="preview" className="grid gap-16 bg-[rgba(250,249,245,0.72)] py-24 lg:grid-cols-[0.72fr_1fr] lg:items-center">
          <div>
            <p className="mb-4 font-[var(--font-poppins)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-blue)]">Preview</p>
            <h2 className="text-[clamp(32px,5vw,60px)] font-medium leading-[0.98] tracking-[-0.045em] text-[var(--fg)] font-[var(--font-instrument-serif)]">
              What the homepage could feel like.
            </h2>
            <p className="text-[18px] leading-[1.72] text-[var(--fg-secondary)]">
              Centered hero, thesis strip, capability grid, and a report-like writing block. Personal site, not startup landing page.
            </p>
          </div>
          <div className="overflow-hidden rounded-[8px] border border-[var(--color-ink)] bg-[var(--color-surface)] shadow-[0_1px_3px_rgba(43,37,27,0.08)]">
            <div className="border-b border-[var(--border-color)] px-6 py-4 font-[var(--font-poppins)] text-[12px] text-[var(--color-ink-secondary)]">preview / home / writing / projects / system</div>
            <pre className="m-0 whitespace-pre-wrap p-7 font-[var(--font-poppins)] text-[13px] leading-[1.72] text-[var(--fg-secondary)]">Liz
Personal compact template

Design language:
- warm paper background
- serif headline / sans UI
- one accent color
- grouped projects
- small status strip

Content structure:
1. Thesis
2. Projects
3. Writing proof
4. About strip
5. Contact / links

Motion budget:
- hover
- fade
- tiny transition
- no full-page 3D</pre>
          </div>
        </section>

        <section id="rules" className="pb-24">
          <div className="grid border border-[var(--border-color)] bg-[var(--color-surface)] md:grid-cols-3">
            <div className="border-r border-[var(--border-color)] p-8">
              <p className="mb-4 font-[var(--font-poppins)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-blue)]">Do</p>
              <ul className="m-0 space-y-3 pl-4 leading-[1.75] text-[var(--fg-secondary)]">
                {rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
            <div className="border-r border-[var(--border-color)] bg-[#f4eee2] p-8">
              <p className="mb-4 font-[var(--font-poppins)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">Don&apos;t</p>
              <ul className="m-0 space-y-3 pl-4 leading-[1.75] text-[var(--fg-secondary)]">
                <li>Do not add WebGL before the site has bones.</li>
                <li>Do not copy SaaS purple-gradient junk.</li>
                <li>Do not create a control-panel fetish.</li>
                <li>Do not flatten everything into a blog list.</li>
                <li>Do not trade speed for fake wow.</li>
              </ul>
            </div>
            <div className="p-8">
              <p className="mb-4 font-[var(--font-poppins)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-blue)]">Target</p>
              <ul className="m-0 space-y-3 pl-4 leading-[1.75] text-[var(--fg-secondary)]">
                <li>Small payload.</li>
                <li>High visual payoff.</li>
                <li>Personal, but structured.</li>
                <li>Editorial, but not fragile.</li>
                <li>Systemic, but not bloated.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}