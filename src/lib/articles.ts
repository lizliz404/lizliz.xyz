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
    content,
  };
}
