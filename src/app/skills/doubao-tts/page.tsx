import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const TITLE = "Doubao TTS Skill — TTS, Podcast & ASR for Hermes";
const DESCRIPTION =
  "Hermes skill pack for Volcengine 豆包语音: article TTS, dual-speaker podcasts, and ASR transcripts for Liz's writing pipeline. Download the free agent skill zip.";
const CANONICAL = "https://lizliz.xyz/skills/doubao-tts";
const OG_IMAGE = "https://lizliz.xyz/og/skills/doubao-tts.png";
const ZIP_URL = "/doubao-tts-skill.zip";

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
        alt: "Doubao TTS skill pack — dual speakers and waveform on paper",
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
  name: "Doubao TTS Skill",
  alternateName: "豆包语音 TTS / Podcast / ASR",
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
  downloadUrl: "https://lizliz.xyz/doubao-tts-skill.zip",
  potentialAction: {
    "@type": "DownloadAction",
    target: "https://lizliz.xyz/doubao-tts-skill.zip",
  },
};

export default function DoubaoTtsSkillPage() {
  return (
    <main className="skill-landing flex flex-1 flex-col items-center px-6 pt-24 pb-20">
      <Script
        id="doubao-tts-json-ld"
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
              src="/assets/icons/skills/doubao-tts.svg"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl"
            />
            <h1
              className="text-4xl md:text-5xl font-normal tracking-tight leading-none"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Doubao TTS
            </h1>
          </div>
          <p className="text-lg leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
            Article voice, dual-speaker podcasts, and ASR for the writing pipeline — via Volcengine
            豆包语音.
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
              <strong style={{ color: "var(--fg)" }}>TTS</strong> — clean Markdown → spoken article audio
              (豆包 V1 production route)
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Podcast</strong> — AI dual-speaker conversation from
              article / topic
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>ASR</strong> — Flash/Standard transcripts with optional
              diarization
            </li>
            <li>
              Scripts: <code>tts-generate.py</code>, <code>podcast-generate.py</code>,{" "}
              <code>asr-transcribe.py</code>, plus publish references for lizliz.xyz
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
            <li>Download the zip and unpack into your agent skills directory.</li>
            <li>
              Set <code>DOUBAO_API_KEY</code> (new console) — keep legacy App ID / Access Token only if
              existing scripts still need them.
            </li>
            <li>
              Ask the agent for article audio, a dual-speaker podcast, or an ASR transcript — the skill
              covers the routing.
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
