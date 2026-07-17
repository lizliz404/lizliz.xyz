import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Subtitle {
  start: number;
  end: number;
  speaker: string;
  text: string;
}

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
  ogImage?: string;
  audioFile: string;
}

export interface Podcast extends PodcastMeta {
  content: string;
}

const podcastsDir = path.join(process.cwd(), "content/podcast");
const subtitlesDir = path.join(process.cwd(), "public/data/podcast");

/** Convert "23:24" or "1:05:30" to ISO 8601 duration (PT23M24S). */
export function durationToIso8601(duration: string): string | undefined {
  if (!duration) return undefined;
  if (duration.startsWith("PT")) return duration;

  const parts = duration.split(":").map(Number);
  if (parts.some(Number.isNaN)) return undefined;

  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  if (parts.length === 3) {
    [hours, minutes, seconds] = parts;
  } else if (parts.length === 2) {
    [minutes, seconds] = parts;
  } else if (parts.length === 1) {
    [seconds] = parts;
  } else {
    return undefined;
  }

  let result = "PT";
  if (hours > 0) result += `${hours}H`;
  if (minutes > 0) result += `${minutes}M`;
  if (seconds > 0) result += `${seconds}S`;
  return result === "PT" ? undefined : result;
}

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
    ogImage: typeof data.ogImage === "string" ? data.ogImage : undefined,
    audioFile: String(data.audioFile || ""),
  };
}

export function loadSubtitles(slug: string): Subtitle[] {
  const filePath = path.join(subtitlesDir, `${slug}-subtitles.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

export function getPodcast(slug: string): Podcast | null {
  const filePath = path.join(podcastsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    ...normalizePodcastMeta(`${slug}.md`, data),
    content,
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
