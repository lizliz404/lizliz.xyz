#!/usr/bin/env node
/**
 * Build-time project showcase data.
 * Live product pages are scraped for OG/title/favicon.
 * Skill packs and non-HTML artifacts use static entries.
 */
const fs = require("fs");
const path = require("path");

/** Live product / demo sites — order = showcase order. */
const PROJECT_URLS = [
  "https://holopinch.lizliz.xyz/",
  "https://acriva.lizliz.xyz/",
  "https://reddit-viral.lizliz.xyz/",
  "https://agent-crm.lizliz.xyz/",
  "https://cutting-die.lizliz.xyz/",
  "https://shelfplan.lizliz.xyz/",
  "https://flappybird.lizliz.xyz/",
  "https://brainrush.run/",
  "https://pep-words.brainrush.run/",
  "https://carver.lizliz.xyz/",
  "https://vibe-gba.lizliz.xyz/",
  "https://bitcoin-whitepaper.lizliz.xyz/",
  "https://pausey.lizliz.xyz/",
  "https://lizliz.xyz/adventurex-2026/",
];

const FALLBACKS = {
  "https://holopinch.lizliz.xyz/": {
    title: "HoloPinch — Hold a hologram between your hands",
    description:
      "Browser AR toy: pinch with your hands and a living holographic mesh appears between them. MediaPipe + WebGL. No app install.",
    iconUrl: "https://holopinch.lizliz.xyz/favicon.svg",
    ogImage: "https://holopinch.lizliz.xyz/og.png?v=20260801b",
  },
  "https://acriva.lizliz.xyz/": {
    title: "融销通 — 借得到 · 卖得出 · 问得着",
    description:
      "融销通（Acriva）是给土老板和合作社的一张经营台：农贷能申请、货盘能上架、专家能问到——钱、货、技术同台办成。",
    iconUrl: "https://acriva.lizliz.xyz/icon.svg",
    ogImage: "https://acriva.lizliz.xyz/og-image.png",
  },
  "https://reddit-viral.lizliz.xyz/": {
    title: "Reddit Viral — Market on Reddit without getting suspended",
    description:
      "Reddit marketing automation for founders and SaaS teams: high-karma accounts, AI-written posts, safe pacing — without agency prices.",
    iconUrl: "https://reddit-viral.lizliz.xyz/favicon.svg",
    ogImage: "https://reddit-viral.lizliz.xyz/og.png?v=20260801b",
  },
  "https://agent-crm.lizliz.xyz/": {
    title: "Agent CRM — The CRM for agentic revenue",
    description:
      "The agentic CRM that builds pipeline, advances deals, and grows accounts around the clock.",
    iconUrl: "https://agent-crm.lizliz.xyz/icon.svg",
    ogImage: "https://agent-crm.lizliz.xyz/og-image.png",
  },
  "https://cutting-die.lizliz.xyz/": {
    title: "Foldy — Packaging Dielines, Drafted in 30 Seconds",
    description:
      "For merchandisers who wait on no one. Pick a box style, enter dimensions, get cut lines and fold lines. Export SVG/DXF/PDF drafts — factory verifies before die-making.",
    iconUrl: "https://cutting-die.lizliz.xyz/favicon-32x32.png",
    ogImage: "https://dieline-generator.lizliz.xyz/og.png",
  },
  "https://shelfplan.lizliz.xyz/": {
    title: "ShelfPlan — From Empty Shell to Procurement List",
    description:
      "零售空间规划工具：从空房子到可执行采购清单。报价引擎，不是3D渲染工具。",
    iconUrl: "https://shelfplan.lizliz.xyz/favicon.svg",
    ogImage: "https://shelfplan.lizliz.xyz/og-image.png",
  },
  "https://flappybird.lizliz.xyz/": {
    title: "Flappy FPV — First-Person Flappy Bird",
    description:
      "Flappy Bird remade in first person. Fly through the pipes — from inside the bird. Three.js, no install.",
    iconUrl: "https://flappybird.lizliz.xyz/favicon.svg",
    ogImage: "https://flappybird.lizliz.xyz/og.png?v=20260805a",
  },
  "https://brainrush.run/": {
    title: "Brain Rush｜60 秒口算训练与英语单词小游戏",
    description:
      "免费的儿童口算训练与英语单词小游戏：60 秒速算、单词中英互译、错题本和本地成绩。",
    iconUrl: "https://brainrush.run/brand-assets/brain-rush-icon-v3.svg",
    ogImage: "https://brainrush.run/brain-rush-social.png?v=20260522",
  },
  "https://pep-words.brainrush.run/": {
    title: "PEP 英语词汇学习｜小学初中单词检索、卡片与测试",
    description:
      "免费的人教版 PEP 英语词汇学习工具：检索小学/初中单词、看中文释义、收藏导出、卡片复习和快速测试。",
    iconUrl: "https://pep-words.brainrush.run/pep-words-logo.svg",
    ogImage: "https://pep-words.brainrush.run/pep-words-screenshot.png",
  },
  "https://carver.lizliz.xyz/": {
    title: "Carver — Damage Becomes Infrastructure",
    description:
      "Play Carver, a free browser puzzle game about irreversible damage becoming infrastructure: carve dirt into ice, use void scars as braces, and find a path to the goal.",
    iconUrl: "https://carver.lizliz.xyz/favicon.ico",
    ogImage: "https://carver.pages.dev/og-image.png",
  },
  "https://vibe-gba.lizliz.xyz/": {
    title: "vibe-gba — Scratch-built Rust GBA emulator",
    description:
      "A Rust Game Boy Advance emulator prototype with Emerald education objective mode. Bring your own legal ROM — no ROMs included.",
    iconUrl: "https://vibe-gba.lizliz.xyz/favicon.svg",
    ogImage: "https://vibe-gba.lizliz.xyz/og-image.png",
  },
  "https://bitcoin-whitepaper.lizliz.xyz/": {
    title: "比特币白皮书中文翻译 2025 | Liz",
    description:
      "《Bitcoin: A Peer-to-Peer Electronic Cash System》中文翻译 2025 版，保留白皮书结构、图示、公式与参考文献。",
    iconUrl: "https://bitcoin-whitepaper.lizliz.xyz/assets/favicon.svg",
    ogImage: "https://bitcoin-whitepaper.lizliz.xyz/assets/og-image.png",
  },
  "https://pausey.lizliz.xyz/": {
    title: "Pausey — Minimal pause & breathing",
    description: "A minimal pause and breathing tool.",
    iconUrl: "https://pausey.lizliz.xyz/pausey-icon-512.png",
    // Interim host until pausey.lizliz.xyz ships /og-image.png (asset also in pausey repo).
    ogImage: "https://pausey.lizliz.xyz/og-image.png",
  },
  "https://lizliz.xyz/adventurex-2026/": {
    title: "AdventureX 2026 志愿者频道 — 数据侧写",
    description:
      "106 位志愿者、4779 条消息、23 天：一个群聊如何临时承担了一场活动的全部运转。中英双语数据叙事。",
    iconUrl: "https://lizliz.xyz/favicon.svg",
    ogImage: "https://lizliz.xyz/adventurex-2026/og.png",
  },
};

/** Skill packs — landing pages (zip remains the download target on each page). */
const SKILL_PACKS = [
  {
    kind: "skill",
    url: "https://lizliz.xyz/skills/doubao-tts/",
    title: "Doubao TTS Skill — 豆包语音 TTS / Podcast / ASR",
    description:
      "Hermes skill pack for Volcengine 豆包语音: article TTS, dual-speaker podcast generation, and ASR transcripts for the writing pipeline.",
    iconUrl: "https://lizliz.xyz/assets/icons/skills/doubao-tts.svg",
    ogImage: "https://lizliz.xyz/og/skills/doubao-tts.png",
  },
  {
    kind: "skill",
    url: "https://lizliz.xyz/skills/geo-job-hunt/",
    title: "Geo Job Hunt Skill — 地理围栏找工作",
    description:
      "Amap radius + Liepin hiring workflow skill: jobs near a place, reverse geo-check, watch mode, and batch apply tooling.",
    iconUrl: "https://lizliz.xyz/assets/icons/skills/geo-job-hunt.svg",
    ogImage: "https://lizliz.xyz/og/skills/geo-job-hunt.png",
  },
  {
    kind: "skill",
    url: "https://lizliz.xyz/skills/landing-page-replication-v5/",
    title: "Landing Page Replication v5 — 高保真落地页复刻",
    description:
      "Measurable marketing-landing fidelity pipeline: Capture → Signal → Skeleton → Density → Micro-parity → Behavior → Polish, with offline behavior probes.",
    iconUrl: "https://lizliz.xyz/assets/icons/skills/landing-page-replication-v5.svg",
    ogImage: "https://lizliz.xyz/og/skills/landing-page-replication-v5.png",
  },
  {
    kind: "skill",
    url: "https://lizliz.xyz/skills/video-script-conversion/",
    title: "Video Script Conversion Skill — 文章→口播脚本",
    description:
      "Article → spoken-word short-video scripts: rebuild, refine, transcript cleanup, and audit against hard principles that keep the voice human.",
    iconUrl: "https://lizliz.xyz/assets/icons/skills/video-script-conversion.svg",
    ogImage: "https://lizliz.xyz/og/skills/video-script-conversion.png",
  },
  {
    kind: "skill",
    url: "https://lizliz.xyz/skills/design-md-visual-system/",
    title: "DESIGN.md Visual System Skill — 实现级视觉系统 · tokens+prose",
    description:
      "Genre-A UI DESIGN.md for coding agents: YAML tokens plus Signature Treatments, Defaults, Do/Don't, CJK, and Iteration — lint/export via @google/design.md.",
    iconUrl: "https://lizliz.xyz/assets/icons/skills/design-md-visual-system.svg",
    ogImage: "https://lizliz.xyz/og/skills/design-md-visual-system.png",
  },
];

function decodeEntities(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function absoluteUrl(value, base) {
  if (!value) return "";
  try {
    return new URL(value, base).toString();
  } catch {
    return "";
  }
}

function metaContent(html, selector) {
  const attrPattern = "(?:property|name|itemprop)=[\\\"']" + selector + "[\\\"']";
  const re = new RegExp("<meta[^>]+" + attrPattern + "[^>]+content=[\\\"']([^\\\"']+)[\\\"'][^>]*>", "i");
  const reverse = new RegExp("<meta[^>]+content=[\\\"']([^\\\"']+)[\\\"'][^>]+" + attrPattern + "[^>]*>", "i");
  return html.match(re)?.[1] || html.match(reverse)?.[1] || "";
}

function titleContent(html) {
  return html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || "";
}

function faviconUrl(html, base) {
  const icon = html.match(
    /<link[^>]+rel=["'][^"']*(?:icon|shortcut icon|apple-touch-icon)[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>/i,
  )?.[1];
  const reverse = html.match(
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*(?:icon|shortcut icon|apple-touch-icon)[^"']*["'][^>]*>/i,
  )?.[1];
  return absoluteUrl(icon || reverse || "", base);
}

async function fetchPreview(url) {
  const fallback = FALLBACKS[url] || {};
  // Prefer curated bitcoin fallback (stable assets).
  if (url === "https://bitcoin-whitepaper.lizliz.xyz/") {
    return { kind: "site", url, ...fallback, title: decodeEntities(fallback.title || url), description: decodeEntities(fallback.description || "Project by Liz.") };
  }
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "lizliz.xyz build-time OG preview generator" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const scrapedIcon = faviconUrl(html, url);
    const scrapedTitle = metaContent(html, "og:title") || titleContent(html) || "";
    const scrapedDesc =
      metaContent(html, "og:description") || metaContent(html, "description") || "";
    // Prefer curated title when scrape is just a short brand name.
    const title =
      fallback.title && scrapedTitle && scrapedTitle.length < 18 && fallback.title.length > scrapedTitle.length
        ? fallback.title
        : scrapedTitle || fallback.title || url;
    return {
      kind: "site",
      url,
      title: decodeEntities(title),
      description: decodeEntities(scrapedDesc || fallback.description || "Project by Liz."),
      iconUrl: scrapedIcon || fallback.iconUrl || "",
      ogImage: absoluteUrl(metaContent(html, "og:image"), url) || fallback.ogImage || "",
    };
  } catch (error) {
    console.warn(`project preview fallback used for ${url}: ${error.message}`);
    return {
      kind: "site",
      url,
      title: decodeEntities(fallback.title || url),
      description: decodeEntities(fallback.description || "Project by Liz."),
      iconUrl: fallback.iconUrl || "",
      ogImage: fallback.ogImage || "",
    };
  }
}

async function main() {
  const sites = await Promise.all(PROJECT_URLS.map(fetchPreview));
  // Prefer curated OG/icon for known weak scrapes (screenshot OG, missing favicon).
  const CURATED = {
    "https://vibe-gba.lizliz.xyz/": {
      iconUrl: "https://vibe-gba.lizliz.xyz/favicon.svg",
      ogImage: "https://vibe-gba.lizliz.xyz/og-image.png",
    },
    "https://holopinch.lizliz.xyz/": {
      iconUrl: "https://holopinch.lizliz.xyz/favicon.svg?v=20260801b",
      ogImage: "https://holopinch.lizliz.xyz/og.png?v=20260801b",
    },
    "https://reddit-viral.lizliz.xyz/": {
      iconUrl: "https://reddit-viral.lizliz.xyz/favicon.svg?v=20260801b",
      ogImage: "https://reddit-viral.lizliz.xyz/og.png?v=20260801b",
    },
    "https://flappybird.lizliz.xyz/": {
      iconUrl: "https://flappybird.lizliz.xyz/favicon.svg?v=20260805a",
      ogImage: "https://flappybird.lizliz.xyz/og.png?v=20260805a",
    },
  };
  for (const p of sites) {
    const c = CURATED[p.url];
    if (!c) continue;
    if (c.iconUrl) p.iconUrl = c.iconUrl;
    if (c.ogImage) p.ogImage = c.ogImage;
  }

  // Prefer fallback icon when scrape is empty.
  for (const p of sites) {
    if (!p.iconUrl && FALLBACKS[p.url]?.iconUrl) {
      p.iconUrl = FALLBACKS[p.url].iconUrl;
    }
    if (!p.iconUrl && p.ogImage) {
      p.iconUrl = p.ogImage;
    }
  }
  const projects = [...sites, ...SKILL_PACKS];
  const outPath = path.join(__dirname, "..", "src", "generated", "project-previews.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(projects, null, 2) + "\n");
  console.log(`Project previews: ${projects.length} generated (${sites.length} sites + ${SKILL_PACKS.length} skills)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
