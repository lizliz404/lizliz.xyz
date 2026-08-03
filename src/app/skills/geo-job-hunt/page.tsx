import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const TITLE = "Geo Job Hunt Skill — Amap radius + Liepin hiring";
const DESCRIPTION =
  "Jobs near a place with Amap geofencing plus Liepin search, watch mode, and batch apply tooling for Hermes agents. Free skill-pack zip — ready to install.";
const CANONICAL = "https://lizliz.xyz/skills/geo-job-hunt";
const OG_IMAGE = "https://lizliz.xyz/og/skills/geo-job-hunt.png";
const ZIP_URL = "/geo-job-hunt.zip";

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
        alt: "Geo Job Hunt skill pack — map pin inside a radius on paper",
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
  name: "Geo Job Hunt Skill",
  alternateName: "地理围栏找工作",
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
  downloadUrl: "https://lizliz.xyz/geo-job-hunt.zip",
  potentialAction: {
    "@type": "DownloadAction",
    target: "https://lizliz.xyz/geo-job-hunt.zip",
  },
};

export default function GeoJobHuntSkillPage() {
  return (
    <main className="skill-landing flex flex-1 flex-col items-center px-6 pt-24 pb-20">
      <Script
        id="geo-job-hunt-json-ld"
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
              src="/assets/icons/skills/geo-job-hunt.svg"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl"
            />
            <h1
              className="text-4xl md:text-5xl font-normal tracking-tight leading-none"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Geo Job Hunt
            </h1>
          </div>
          <p className="text-lg leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
            Jobs within a radius — Amap geofencing + Liepin hiring, without island-platform scrolling.
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
              <strong style={{ color: "var(--fg)" }}>Forward hunt</strong> — place → radius companies → open
              roles on Liepin
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Reverse check</strong> — search jobs, verify company is
              inside the fence
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Watch + apply</strong> — incremental monitoring, tracker,
              batch apply with rate-limit guardrails
            </li>
            <li>
              Pack: production <code>skill/</code> (v5.1.3) plus audit notes — scripts are stdlib-only Python
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
              Unpack <code>skill/</code> into your agent skills directory (see pack README).
            </li>
            <li>
              Provide <code>AMAP_MAPS_API_KEY</code> and <code>MCP_LIEPIN_API_KEY</code>; wire Amap + Liepin MCP
              servers.
            </li>
            <li>
              Run forward/reverse hunts, then use tracker / batch apply once rate limits allow.
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
