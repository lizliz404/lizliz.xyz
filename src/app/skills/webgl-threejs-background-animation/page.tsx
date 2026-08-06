import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const TITLE = "WebGL Three.js Background Animation — Motion Craft for the GPU-Conscious";
const DESCRIPTION =
  "Hermes skill pack for Three.js WebGL animation craft: batched LineSegments/Points, config-driven TUNING + CATEGORIES, dual-material dissolve, orbital camera with parallax, frame-rate-independent easing, in-game juice, zero GPU when invisible.";
const CANONICAL = "https://lizliz.xyz/skills/webgl-threejs-background-animation";
const OG_IMAGE = "https://lizliz.xyz/og/skills/webgl-threejs-background-animation.png";
const ZIP_URL = "/webgl-threejs-background-animation-skill.zip";

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
        alt: "WebGL Three.js Background Animation skill pack — dashed wireframe garden on paper",
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
  name: "WebGL Three.js Background Animation",
  alternateName: "融入页面的 3D 背景动画与游戏动效 · 低成本高感知",
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
  downloadUrl: "https://lizliz.xyz/webgl-threejs-background-animation-skill.zip",
  potentialAction: {
    "@type": "DownloadAction",
    target: "https://lizliz.xyz/webgl-threejs-background-animation-skill.zip",
  },
};

export default function WebglThreejsBackgroundAnimationSkillPage() {
  return (
    <main id="main-content" className="skill-landing flex flex-1 flex-col items-center px-6 pt-24 pb-20">
      <Script
        id="webgl-threejs-background-animation-json-ld"
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
              src="/assets/icons/skills/webgl-threejs-background-animation.svg"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl"
            />
            <h1
              className="text-4xl md:text-5xl font-normal tracking-tight leading-none"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              WebGL Three.js
              <br />
              Background Animation
            </h1>
          </div>
          <p className="text-lg leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
            Animated WebGL that blends into the page — not a framed exhibit. Light, quiet,
            high-perceived quality; fix the GPU burden first, add juice after.
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
              <strong style={{ color: "var(--fg)" }}>Design Preferences</strong> — the aesthetic
              rules, non-negotiable: the animation grows into the page (edge fade, full-viewport
              background layer, readable content over motion); the &ldquo;frame&rdquo;
              anti-patterns are banned
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Config-driven architecture</strong> — one{" "}
              <code>TUNING</code> object + one <code>CATEGORIES</code> array; a fifth visual
              weight is one entry, not a refactor
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Dual-material dissolve + helix camera</strong>{" "}
              — sketch→solid crossfade driven by hover, click, and an idle auto-ramp;
              frame-rate-independent damping (<code>1 − e^(−λ·dt)</code>)
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>In-game motion craft</strong> — dt-clamped
              loops, ViewRig cameras, juice recipes (squash, halo, FOV kick), pooled particles,
              procedural worlds
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Lifecycle hygiene</strong> —{" "}
              IntersectionObserver + visibilitychange + resize + reduced-motion + full dispose:
              zero GPU when invisible
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Visual levers &amp; budgets</strong> — fog,
              edge fade, parallax, colour hierarchy ranked by perceived gain ÷ cost; draw-call and
              pixelRatio budgets for desktop/mobile
            </li>
            <li>
              <strong style={{ color: "var(--fg)" }}>Reference implementation</strong> —{" "}
              <code>examples/HeroCanvas.tsx</code>: the lizliz.xyz &ldquo;Paper Ink
              Garden&rdquo; full-page background (862 lines, three@0.185)
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
              <code>webgl-threejs-background-animation/</code>.
            </li>
            <li>
              Read the Design Preferences first — the aesthetic rules are the acceptance
              criteria for any output.
            </li>
            <li>
              Follow the adaptation recipe: pick a metaphor → pull the palette from the site&apos;s
              own CSS → build <code>CATEGORIES</code> → geometry helpers → tune the camera; run
              the Build Checklist before shipping.
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
