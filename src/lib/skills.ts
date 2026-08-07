/**
 * Public skill packs shown on the /skills index.
 * Content mirrors what the old per-skill landing pages shipped
 * (tagline + "What's inside" bullets), flattened into accordion items.
 */
export type SkillFeature = { label?: string; text: string };

export type SkillMeta = {
  slug: string;
  name: string;
  tagline: string;
  features: SkillFeature[];
  iconUrl: string;
  zipUrl: string;
  /** Path inside the public GitHub mirror repo (github.com/lizliz404/agent-skills). */
  repoPath: string;
};

/** Public GitHub mirror of the downloadable skill packs. */
export const SKILLS_REPO = "https://github.com/lizliz404/agent-skills";

export const SKILLS: SkillMeta[] = [
  {
    slug: "doubao-tts",
    name: "Doubao TTS",
    tagline:
      "Article voice, dual-speaker podcasts, and ASR — via Volcengine 豆包语音. Built for writing pipelines.",
    features: [
      { label: "TTS", text: "Markdown → spoken article audio (豆包 V1 production route)" },
      { label: "Podcast", text: "dual-speaker conversation from an article or topic" },
      { label: "ASR", text: "Flash/Standard transcripts, optional diarization" },
      {
        text: "Scripts: tts-generate.py, podcast-generate.py, asr-transcribe.py, plus publish notes for lizliz.xyz",
      },
    ],
    iconUrl: "/assets/icons/skills/doubao-tts.svg",
    zipUrl: "/doubao-tts-skill.zip",
    repoPath: "skills/doubao-tts",
  },
  {
    slug: "geo-job-hunt",
    name: "Geo Job Hunt",
    tagline:
      "Jobs inside a map radius — Amap fence + Liepin hiring, without endless platform scrolling.",
    features: [
      { label: "Forward hunt", text: "place → radius companies → open roles on Liepin" },
      { label: "Reverse check", text: "search jobs, confirm the company is inside the fence" },
      {
        label: "Watch + apply",
        text: "monitor new roles, track, batch apply with rate-limit guardrails",
      },
      {
        text: "Pack: production skill/ (v5.1.3) plus audit notes — stdlib-only Python scripts",
      },
    ],
    iconUrl: "/assets/icons/skills/geo-job-hunt.svg",
    zipUrl: "/geo-job-hunt.zip",
    repoPath: "skills/geo-job-hunt",
  },
  {
    slug: "landing-page-replication-v5",
    name: "Landing Replication v5",
    tagline:
      "Measurable landing-page fidelity — not vibes. Capture the runtime surface, pin density, prove interactions offline.",
    features: [
      {
        label: "7-phase pipeline",
        text: "Capture → Signal → Skeleton → Density → Micro-parity → Behavior → Polish",
      },
      {
        label: "Machine gates",
        text: "IMR, scroll-length, offline behavior probes, reduced-motion, replica-only-motion blockers",
      },
      {
        label: "Scripts",
        text: "capture.py, capture-runtime.py, audit.py, token extractors, evals",
      },
      {
        text: "Notes on theater runtimes, IP/fonts, CJK sites, and cases (Linear / Attio / haoqi)",
      },
    ],
    iconUrl: "/assets/icons/skills/landing-page-replication-v5.svg",
    zipUrl: "/landing-page-replication-v5.zip",
    repoPath: "skills/landing-page-replication-v5",
  },
  {
    slug: "video-script-conversion",
    name: "Video Script Conversion",
    tagline:
      "Article logic ≠ spoken logic. Rebuild, refine, and audit scripts for the spoken voice — five seconds decide if viewers stay.",
    features: [
      {
        label: "4 modes",
        text: "rebuild from long-form, refine approved spoken raw, transcript cleanup (实录修整), patch assembly from settled feedback",
      },
      {
        label: "Hard-principle gate",
        text: "hook trio, the two questions (why me / what's in it), price hedging, compliance rewording — fixed by the author, not negotiable",
      },
      {
        label: "Voice preservation",
        text: "keeps the speaker's operator words and meta-cognitive asides; cuts only empty filler",
      },
      {
        label: "Scripts",
        text: "count_spoken_chars.py with dual metrics (spoken Chinese chars vs. total with punctuation) against the 850–950 target band",
      },
      {
        label: "References",
        text: "voice profile, anti-slop mantra, preemptive-rebuttal pattern, worked rebuild examples",
      },
    ],
    iconUrl: "/assets/icons/skills/video-script-conversion.svg",
    zipUrl: "/video-script-conversion-skill.zip",
    repoPath: "skills/video-script-conversion",
  },
  {
    slug: "design-md-visual-system",
    name: "DESIGN.md Visual System",
    tagline:
      "Tokens give exact values; prose carries judgment. Write Genre-A DESIGN.md so agents ship UI without inventing taste.",
    features: [
      {
        label: "Genre gate",
        text: "Visual system (A) vs brand/OG image brief (B); refuse thin vibe paragraphs; keep the two jobs split",
      },
      {
        label: "YAML-first workflow",
        text: "normative tokens, color aliases, role typography, components with description:; extract from real CSS/HTML, don't invent",
      },
      {
        label: "Signature Treatments",
        text: "non-optional moves when an element type appears, plus Defaults, Do/Don't, density philosophy",
      },
      {
        label: "Completeness bar",
        text: "CJK & International, Iteration Guide, Known Gaps, /10 rubric with audit blockquote",
      },
      {
        label: "References",
        text: "anatomy from the beautiful-html-templates gold corpus, quality rubric, fillable Genre A skeleton, 34 gold corpus design.md files under references/gold-corpus/",
      },
      {
        label: "Google CLI",
        text: "lint with @google/design.md; optional export to Tailwind theme or DTCG tokens.json",
      },
    ],
    iconUrl: "/assets/icons/skills/design-md-visual-system.svg",
    zipUrl: "/design-md-visual-system-skill.zip",
    repoPath: "skills/design-md-visual-system",
  },
  {
    slug: "webgl-threejs-background-animation",
    name: "WebGL Three.js Background Animation",
    tagline:
      "WebGL that blends into the page — not a framed exhibit. Light, quiet, high perceived quality. Fix GPU cost first; add juice after.",
    features: [
      {
        label: "Design Preferences",
        text: "animation grows into the page (edge fade, full-viewport background, readable content over motion); framed-exhibit anti-patterns are banned",
      },
      {
        label: "Config-driven architecture",
        text: "one TUNING object + one CATEGORIES array; a fifth visual weight is one entry, not a refactor",
      },
      {
        label: "Dual-material dissolve + helix camera",
        text: "sketch→solid crossfade from hover, click, and idle auto-ramp; frame-rate-independent damping (1 − e^(−λ·dt))",
      },
      {
        label: "In-game motion craft",
        text: "dt-clamped loops, ViewRig cameras, juice (squash, halo, FOV kick), pooled particles, procedural worlds",
      },
      {
        label: "Lifecycle hygiene",
        text: "IntersectionObserver + visibilitychange + resize + reduced-motion + full dispose: zero GPU when invisible",
      },
      {
        label: "Visual levers & budgets",
        text: "fog, edge fade, parallax, colour hierarchy by perceived gain ÷ cost; draw-call and pixelRatio budgets",
      },
      {
        label: "Reference implementation",
        text: "examples/HeroCanvas.tsx: lizliz.xyz “Paper Ink Garden” full-page background (862 lines, three@0.185)",
      },
    ],
    iconUrl: "/assets/icons/skills/webgl-threejs-background-animation.svg",
    zipUrl: "/webgl-threejs-background-animation-skill.zip",
    repoPath: "skills/webgl-threejs-background-animation",
  },
];
