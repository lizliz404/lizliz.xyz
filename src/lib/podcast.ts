import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PodcastMeta {
  slug: string;
  title: string;
  date: string;
  publishedDate: string;
  description: string;
  duration: string;
  hosts: { name: string; role: string; gender: string }[];
  tags: string[];
  keywords: string[];
  audioFile: string;
}

const podcastsDir = path.join(process.cwd(), "content/podcast");

function normalizePodcastMeta(
  filename: string,
  data: Record<string, unknown>,
): PodcastMeta {
  return {
    slug: filename.replace(/\.md$/, ""),
    title: String(data.title || "Untitled"),
    date: String(data.date || ""),
    publishedDate: String(data.published_date || data.date || ""),
    description: String(data.description || ""),
    duration: String(data.duration || ""),
    hosts: Array.isArray(data.hosts) ? data.hosts : [],
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    audioFile: String(data.audioFile || ""),
  };
}

/** Get all published podcasts sorted by date (newest first) */
export function getPodcasts(): PodcastMeta[] {
  if (!fs.existsSync(podcastsDir)) return [];

  return fs
    .readdirSync(podcastsDir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(podcastsDir, filename), "utf-8");
      const { data } = matter(raw);
      return normalizePodcastMeta(filename, data);
    })
    .sort((a, b) => {
      const aTime = Date.parse(a.publishedDate);
      const bTime = Date.parse(b.publishedDate);
      return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
    });
}
