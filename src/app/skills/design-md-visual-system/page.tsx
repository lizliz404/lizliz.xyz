import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const TITLE = "DESIGN.md Visual System — Implementation-Grade Visual Systems";
const DESCRIPTION =
  "Hermes skill pack for Genre-A UI DESIGN.md: YAML tokens plus Signature Treatments, Defaults, Do/Don't, CJK, and Iteration so coding agents implement without inventing taste.";
const CANONICAL = "https://lizliz.xyz/skills/design-md-visual-system";
const OG_IMAGE = "https://lizliz.xyz/og/skills/design-md-visual-system.png";
const ZIP_URL = "/design-md-visual-system-skill.zip";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: true, follow: true },
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    siteName: "lizliz.xyz",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "DESIGN.md Visual System skill pack — document with YAML token rails on paper",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
    creator: "@lizliz404",
    site: "@lizliz404",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "DESIGN.md Visual System",
  alternateName: "实现级视觉系统 · tokens + prose",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description: DESCRIPTION,
  url: CANONICAL,
  image: OG_IMAGE,
  author: {
    "@type": "Person",
    name: "Liz",
    url: "https://lizliz.xyz",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  downloadUrl: "https://lizliz.xyz/design-md-visual-system-skill.zip",
  potentialAction: {
    "@type": "DownloadAction",
    target: "https://lizliz.xyz/design-md-visual-system-skill.zip",
  },
};

export default function DesignMdVisualSystemSkillPage() {
  return (
    <main className="skill-landing flex flex-1 flex-col items-center px-6 pt-24 pb-20">
      <Script
        id="design-md-visual-system-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="w-full max-w-lg md:max-w-2xl flex flex-col gap-8">
        <p className="text-sm tracking-[0.14em] uppercase" style={{ color: "var(--fg-secondary)" }}>
          Skill pack · lizliz.xyz
        </p>

        {/* Hero stays static — no pop-reveal on LCP headline */}
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/icons/skills/design-md-visual-system.svg"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl"
            />
            <h1
              className="text-4xl md:text-5xl font-normal tracking-tight leading-none"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              DESIGN.md Visual System
            </h1>
          </div>
          <p className="text-lg leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
            Tokens give exact values; prose carries judgment. Write implementation-grade Genre A
            DESIGN.md so coding agents ship UI without inventing taste.
          </p>
        </header>

        <a
          href={ZIP_URL}
          download
          className="skill-download-cta inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium no-underline hover:opacity-90"
          style={{
            background: "var(--color-accent)",
            color: "#FAF9F5",
          }}
        >
          ↓ Download skill zip
        </a>

        <section
          id="whats-inside"
          className="pop-reveal flex flex-col gap-3"
          aria-labelledby="whats-inside-heading"
        >
          <h2 id="whats-inside-heading" className="section-heading section-heading-sm">
            <span className="section-heading-dot" aria-hidden="true" />
            What&apos;s inside
          </h2>
          <ul className="flex flex-col gap-2 text-base leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
            <li>
              <strong style={{ color: "var(--fg)" }}>Genre gate</strong> — Visual system (A) vs
              brand/OG image brief (B); refuse thin vibe paragraphs and keep the two jobs split
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>YAML-first workflow</strong> — normative
              tokens, color aliases, role typography, components with{" "}
              <code>description:</code>; extract from real CSS/HTML, don&apos;t invent
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Signature Treatments</strong> — non-optional
              moves when an element type appears, plus Defaults, Do/Don&apos;t, density philosophy
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Completeness bar</strong> — CJK &amp;
              International, Iteration Guide, Known Gaps, and a /10 rubric with audit blockquote
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>References</strong> — anatomy from
              the beautiful-html-templates gold corpus pattern, quality rubric, a
              fillable Genre A skeleton, and all 34 gold corpus design.md examples
              bundled under <code>references/gold-corpus/</code>
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Google CLI</strong> — lint with{" "}
              <code>@google/design.md</code>; optional export to Tailwind theme or DTCG{" "}
              <code>tokens.json</code>
            </li>
          </ul>
        </section>

        <section
          id="install"
          className="pop-reveal flex flex-col gap-3"
          aria-labelledby="install-heading"
        >
          <h2 id="install-heading" className="section-heading section-heading-sm">
            <span className="section-heading-dot" aria-hidden="true" />
            Install
          </h2>
          <ol className="flex flex-col gap-2 text-base leading-relaxed list-decimal pl-5" style={{ color: "var(--fg-secondary)" }}>
            <li>
              Unpack into your agent skills directory as{" "}
              <code>design-md-visual-system/</code>.
            </li>
            <li>
              Confirm Genre A (UI system). For brand/OG/image briefs, switch to a design-brief
              skill instead of forcing one file to do both jobs.
            </li>
            <li>
              Write YAML tokens first, lock Signature Treatments, then fill the extended body
              (CJK, Iteration, Gaps). Lint with{" "}
              <code>npx -y @google/design.md lint DESIGN.md</code>; self-score with the rubric
              before shipping.
            </li>
          </ol>
        </section>

        <p className="text-sm" style={{ color: "var(--fg-secondary)", opacity: 0.7 }}>
          <Link href="/#skills" className="underline-offset-2 hover:underline">
            ← Back to skills
          </Link>
          {" · "}
          <a href={ZIP_URL} download className="underline-offset-2 hover:underline">
            Direct zip
          </a>
        </p>
      </article>
    </main>
  );
}
