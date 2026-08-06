import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const TITLE = "Landing Page Replication v5 — 高保真落地页复刻";
const DESCRIPTION =
  "Copy a marketing landing page with measurable gates: capture, density, micro-parity, offline behavior probes. Free skill zip.";
const CANONICAL = "https://lizliz.xyz/skills/landing-page-replication-v5";
const OG_IMAGE = "https://lizliz.xyz/og/skills/landing-page-replication-v5.png";
const ZIP_URL = "/landing-page-replication-v5.zip";

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
        alt: "Landing Page Replication v5 skill pack — layered frames and orange tick on paper",
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
  name: "Landing Page Replication v5",
  alternateName: "高保真落地页复刻 skill",
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
  downloadUrl: "https://lizliz.xyz/landing-page-replication-v5.zip",
  potentialAction: {
    "@type": "DownloadAction",
    target: "https://lizliz.xyz/landing-page-replication-v5.zip",
  },
};

export default function LandingPageReplicationV5SkillPage() {
  return (
    <main id="main-content" className="skill-landing flex flex-1 flex-col items-center px-6 pt-24 pb-20">
      <Script
        id="landing-page-replication-v5-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="w-full max-w-lg md:max-w-2xl flex flex-col gap-8">
        <p className="text-sm tracking-[0.14em] uppercase" style={{ color: "var(--fg-secondary)" }}>
          Skill pack · lizliz.xyz
        </p>

        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/icons/skills/landing-page-replication-v5.svg"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl"
            />
            <h1
              className="text-4xl md:text-5xl font-normal tracking-tight leading-none"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Landing Replication v5
            </h1>
          </div>
          <p className="text-lg leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
            Measurable landing-page fidelity — not vibes. Capture the runtime surface, pin density, prove
            interactions offline.
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
          Download skill zip
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
              <strong style={{ color: "var(--fg)" }}>7-phase pipeline</strong> — Capture → Signal →
              Skeleton → Density → Micro-parity → Behavior → Polish
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Machine gates</strong> — IMR, scroll-length, offline
              behavior probes, reduced-motion, replica-only-motion blockers
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Scripts</strong> —{" "}
              <code>capture.py</code>, <code>capture-runtime.py</code>, <code>audit.py</code>, token
              extractors, evals
            </li>
            <li>
              Notes on theater runtimes, IP/fonts, CJK sites, and cases (Linear / Attio / haoqi)
            </li>
          </ul>
        </section>

        <section id="install" className="pop-reveal flex flex-col gap-3" aria-labelledby="install-heading">
          <h2 id="install-heading" className="section-heading section-heading-sm">
            <span className="section-heading-dot" aria-hidden="true" />
            Install
          </h2>
          <ol
            className="flex flex-col gap-2 text-base leading-relaxed list-decimal pl-5"
            style={{ color: "var(--fg-secondary)" }}
          >
            <li>
              Unpack <code>skill/</code> into your agent skills directory as{" "}
              <code>landing-page-replication-v5/</code>.
            </li>
            <li>
              Install script deps: <code>pip install -r skill/scripts/requirements.txt</code>
            </li>
            <li>
              Start Loop 0:{" "}
              <code>python3 scripts/capture.py --url https://target.com --out recon/</code>
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
