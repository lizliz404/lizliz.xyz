#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const PROJECT_URLS = [
  "https://bitcoin-whitepaper.lizliz.xyz/",
  "https://brainrush.run/",
  "https://pep-words.brainrush.run/",
];

const FALLBACKS = {
  "https://bitcoin-whitepaper.lizliz.xyz/": {
    title: "比特币白皮书中文翻译 2025 | Liz",
    description: "《Bitcoin: A Peer-to-Peer Electronic Cash System》中文翻译 2025 版，保留白皮书结构、图示、公式与参考文献。",
    iconUrl: "https://bitcoin-whitepaper.lizliz.xyz/favicon.svg",
    ogImage: "https://bitcoin-whitepaper.lizliz.xyz/og-image.png",
  },
  "https://brainrush.run/": {
    title: "BrainRush - 小学生数学口算练习游戏",
    description: "面向小学生的数学口算练习游戏，把加减乘除训练做成轻量、快速、可重复玩的网页小游戏。",
    iconUrl: "https://brainrush.run/favicon.ico",
    ogImage: "https://brainrush.run/og-image.png",
  },
  "https://pep-words.brainrush.run/": {
    title: "PEP 英语词汇学习｜小学初中单词检索、卡片与测试",
    description: "免费的人教版 PEP 英语词汇学习工具：检索小学/初中单词、看中文释义、收藏导出、卡片复习和快速测试。",
    iconUrl: "https://pep-words.brainrush.run/favicon.ico",
    ogImage: "https://pep-words.brainrush.run/og-image.png",
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
  if (url === "https://bitcoin-whitepaper.lizliz.xyz/") {
    return { url, ...fallback };
  }
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
