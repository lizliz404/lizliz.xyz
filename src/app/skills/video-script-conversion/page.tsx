import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const TITLE = "Video Script Conversion — Article → Spoken-Word Scripts";
const DESCRIPTION =
  "Hermes skill pack for turning articles and raw speech into short-video scripts: rebuild, refine, transcript cleanup, and audit against hard principles that keep the voice human.";
const CANONICAL = "https://lizliz.xyz/skills/video-script-conversion";
const OG_IMAGE = "https://lizliz.xyz/og/skills/video-script-conversion.png";
const ZIP_URL = "/video-script-conversion-skill.zip";

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
        alt: "Video Script Conversion skill pack — script page and play button on paper",
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
  name: "Video Script Conversion",
  alternateName: "文章→口播脚本 · 修整 / 实录 / 审计",
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
  downloadUrl: "https://lizliz.xyz/video-script-conversion-skill.zip",
  potentialAction: {
    "@type": "DownloadAction",
    target: "https://lizliz.xyz/video-script-conversion-skill.zip",
  },
};

export default function VideoScriptConversionSkillPage() {
  return (
    <main className="skill-landing flex flex-1 flex-col items-center px-6 pt-24 pb-20">
      <Script
        id="video-script-conversion-json-ld"
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
              src="/assets/icons/skills/video-script-conversion.svg"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl"
            />
            <h1
              className="text-4xl md:text-5xl font-normal tracking-tight leading-none"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Video Script Conversion
            </h1>
          </div>
          <p className="text-lg leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
            Article logic ≠ spoken logic. Rebuild, refine, and audit scripts for the spoken voice —
            five seconds decide whether viewers stay.
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
              <strong style={{ color: "var(--fg)" }}>4 modes</strong> — rebuild from long-form,
              refine approved spoken raw, transcript cleanup (实录修整), and patch assembly from
              settled feedback
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Hard-principle gate</strong> — hook trio,
              the two questions (why me / what&apos;s in it), price hedging, compliance rewording —
              marked as fixed by the author, not negotiable
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Voice preservation</strong> — keeps the
              speaker&apos;s operator words and meta-cognitive asides as fingerprints, cuts only
              no-information filler
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Scripts</strong> —{" "}
              <code>count_spoken_chars.py</code> character counting with dual metrics (spoken
              Chinese chars vs. total with punctuation) against the 850–950 target band
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>References</strong> — voice profile,
              anti-slop mantra, preemptive-rebuttal pattern, and worked examples from real
              rebuild sessions
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
              <code>video-script-conversion/</code>.
            </li>
            <li>
              The skill routes by mode: give it an article, an approved spoken draft, or a
              transcript — it picks rebuild / refine / transcript cleanup.
            </li>
            <li>
              Deliverables come as one copy-paste block: title trio, cover text, pyramid summary
              (one sentence + one paragraph), spoken script with beats, and cut points.
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
