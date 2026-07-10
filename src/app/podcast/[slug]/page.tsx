import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PodcastContent from "./PodcastContent";
import { absoluteUrl } from "@/lib/articles";

interface PodcastMeta {
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

interface Podcast extends PodcastMeta {
  content: string;
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
    ogImage: typeof data.ogImage === "string" ? data.ogImage : undefined,
    audioFile: String(data.audioFile || ""),
  };
}

function getPodcast(slug: string): Podcast | null {
  const filePath = path.join(podcastsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    ...normalizePodcastMeta(`${slug}.md`, data),
    content,
  };
}

export function generateStaticParams() {
  if (!fs.existsSync(podcastsDir)) return [];
  return fs
    .readdirSync(podcastsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.md$/, "") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const podcast = getPodcast(slug);
  if (!podcast) return {};

  const url = absoluteUrl(`/podcast/${slug}`);
  const title = podcast.title;
  const description =
    podcast.description || `${podcast.title} — lizliz podcast`;

  return {
    title,
    description,
    keywords: podcast.keywords,
    authors: [{ name: "dayi & mizai" }],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "lizliz",
      type: "article",
      publishedTime: podcast.publishedDate || undefined,
      tags: podcast.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@lizliz404",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function PodcastPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const podcast = getPodcast(slug);
  if (!podcast) notFound();

  const url = absoluteUrl(`/podcast/${slug}`);
  const description =
    podcast.description || `${podcast.title} — lizliz podcast`;

  const jsonLdPodcast = {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    name: podcast.title,
    description,
    url,
    datePublished: podcast.publishedDate || undefined,
    duration: podcast.duration,
    author: {
      "@type": "Person",
      name: "dayi & mizai",
    },
    publisher: {
      "@type": "Person",
      name: "Liz",
      url: absoluteUrl(),
    },
    contentUrl: absoluteUrl(podcast.audioFile),
    encodingFormat: "audio/mpeg",
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Podcast",
        item: absoluteUrl("/podcast"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: podcast.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <Script
        id={`podcast-json-ld-${slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdPodcast),
        }}
      />
      <Script
        id={`breadcrumb-json-ld-${slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdBreadcrumb),
        }}
      />
      <PodcastContent
        podcast={{
          title: podcast.title,
          date: podcast.date,
          description: podcast.description,
          duration: podcast.duration,
          hosts: podcast.hosts,
          audioFile: podcast.audioFile,
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h2>{children}</h2>,
          }}
        >
          {podcast.content}
        </ReactMarkdown>
      </PodcastContent>
    </>
  );
}
