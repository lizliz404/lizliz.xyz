#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const PROJECT_URLS = [
  "https://pep-words.lizliz.xyz/",
  "https://brainrush.lizliz.xyz/",
];

const FALLBACKS = {
  "https://pep-words.lizliz.xyz/": {
    title: "PEP Words",
    description: "A lightweight PEP English vocabulary study site.",
    iconUrl: "https://pep-words.lizliz.xyz/favicon.ico",
    ogImage: "https://pep-words.lizliz.xyz/og-image.png",
  },
  "https://brainrush.lizliz.xyz/": {
    title: "Brain Rush",
    description: "飞机大战 / 躲避接物 × 小学算术训练",
    iconUrl: "https://brainrush.lizliz.xyz/favicon.ico",
    ogImage: "https://brainrush.lizliz.xyz/og-image.png",
  },
};

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
  const icon = html.match(/<link[^>]+rel=["'][^"']*(?:icon|shortcut icon|apple-touch-icon)[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>/i)?.[1];
  return absoluteUrl(icon || "/favicon.ico", base);
}

async function fetchPreview(url) {
  const fallback = FALLBACKS[url] || {};
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "lizliz.xyz build-time OG preview generator" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    return {
      url,
      title: metaContent(html, "og:title") || titleContent(html) || fallback.title || url,
      description:
        metaContent(html, "og:description") ||
        metaContent(html, "description") ||
        fallback.description ||
        "Project by Liz.",
      iconUrl: faviconUrl(html, url) || fallback.iconUrl || "",
      ogImage: absoluteUrl(metaContent(html, "og:image"), url) || fallback.ogImage || "",
    };
  } catch (error) {
    console.warn(`project preview fallback used for ${url}: ${error.message}`);
    return {
      url,
      title: fallback.title || url,
      description: fallback.description || "Project by Liz.",
      iconUrl: fallback.iconUrl || "",
      ogImage: fallback.ogImage || "",
    };
  }
}

async function main() {
  const projects = await Promise.all(PROJECT_URLS.map(fetchPreview));
  const outPath = path.join(__dirname, "..", "src", "generated", "project-previews.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(projects, null, 2) + "\n");
  console.log(`Project previews: ${projects.length} generated`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
