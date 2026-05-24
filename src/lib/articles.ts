import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  draft?: boolean;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  readingTime?: number;
}

export interface Article extends ArticleMeta {
  content: string;
}

export const SITE_URL = "https://lizliz.xyz";

export function absoluteUrl(path = "") {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const articlesDir = path.join(process.cwd(), "content/articles");

/** Get all published articles sorted by date (newest first) */
export function getArticles(): ArticleMeta[] {
  if (!fs.existsSync(articlesDir)) return [];

  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(articlesDir, filename), "utf-8");
      const { data } = matter(raw);
      return {
        slug: filename.replace(/\.md$/, ""),
        title: data.title || "Untitled",
        date: data.date || "",
        description: data.description,
        tags: data.tags,
        draft: data.draft,
        keywords: data.keywords,
        ogImage: data.ogImage,
        canonical: data.canonical,
        readingTime: data.readingTime,
      };
    })
    .filter((a) => !a.draft)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

/** Get a single article by slug */
export function getArticle(slug: string): Article | null {
  const filePath = path.join(articlesDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || "Untitled",
    date: data.date || "",
    description: data.description,
    tags: data.tags,
    draft: data.draft,
    keywords: data.keywords,
    ogImage: data.ogImage,
    canonical: data.canonical,
    readingTime: data.readingTime,
    content,
  };
}

function tagOverlapScore(a: ArticleMeta, b: ArticleMeta) {
  const aTags = new Set((a.tags || []).map((tag) => tag.toLowerCase()));
  if (!aTags.size) return 0;
  return (b.tags || []).reduce((score, tag) => score + (aTags.has(tag.toLowerCase()) ? 1 : 0), 0);
}

export function getAdjacentArticles(slug: string) {
  const articles = getArticles();
  const index = articles.findIndex((article) => article.slug === slug);

  return {
    newer: index > 0 ? articles[index - 1] : null,
    older: index >= 0 && index < articles.length - 1 ? articles[index + 1] : null,
  };
}

function relatedFallbackIndex(slug: string, count: number) {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % count;
}

export function getRelatedArticles(slug: string, limit = 3): ArticleMeta[] {
  const articles = getArticles();
  const current = articles.find((article) => article.slug === slug);
  if (!current) return [];

  const scored = articles
    .filter((article) => article.slug !== slug)
    .map((article) => ({ article, score: tagOverlapScore(current, article) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || (a.article.date > b.article.date ? -1 : 1))
    .map(({ article }) => article);

  if (scored.length > 0) return scored.slice(0, limit);

  const fallback = articles.filter((article) => article.slug !== slug);
  if (!fallback.length) return [];

  return [fallback[relatedFallbackIndex(slug, fallback.length)]];
}
