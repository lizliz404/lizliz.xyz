#!/usr/bin/env node
/**
 * Generate public/rss.xml from content/articles/*.md
 * Called from prebuild so static export ships a real feed.
 */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const SITE_URL = "https://lizliz.xyz";
const ROOT = path.join(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "content/articles");
const OUT_FILE = path.join(ROOT, "public/rss.xml");

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeDate(value) {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  const raw = String(value);
  const parsed = Date.parse(raw.length === 10 ? `${raw}T00:00:00.000Z` : raw);
  if (Number.isNaN(parsed)) return new Date().toISOString();
  return new Date(parsed).toISOString();
}

function loadArticles() {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), "utf8");
      const { data } = matter(raw);
      if (data.draft) return null;
      const slug = filename.replace(/\.md$/, "");
      const published = data.published_date || data.date;
      const updated = data.updated_date || published;
      return {
        slug,
        title: String(data.title || slug),
        description: String(data.description || ""),
        published: normalizeDate(published),
        updated: normalizeDate(updated),
      };
    })
    .filter(Boolean)
    .sort((a, b) => Date.parse(b.published) - Date.parse(a.published));
}

function buildRss(articles) {
  const lastBuild = articles[0]?.updated || new Date().toISOString();
  const items = articles
    .map((article) => {
      const link = `${SITE_URL}/articles/${article.slug}/`;
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(article.published).toUTCString()}</pubDate>
      <description>${escapeXml(article.description)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Liz — Articles</title>
    <link>${SITE_URL}/</link>
    <description>Essays and research notes on AI agents, SaaS, markets, psychology, and systems.</description>
    <language>zh-cn</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

const articles = loadArticles();
fs.writeFileSync(OUT_FILE, buildRss(articles), "utf8");
console.log(`[generate-rss] wrote ${articles.length} items → public/rss.xml`);
