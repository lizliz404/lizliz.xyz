import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PodcastContent from "./PodcastContent";
import { absoluteUrl } from "@/lib/articles";
import {
  durationToIso8601,
  getPodcast,
  getPodcasts,
  loadSubtitles,
} from "@/lib/podcast";

export function generateStaticParams() {
  return getPodcasts().map((podcast) => ({ slug: podcast.slug }));
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
  const hostsList = podcast.hosts.map((h) => h.name).join(" & ");

  return {
    title,
    description,
    keywords: podcast.keywords,
    authors: [{ name: hostsList || "dayi & mizai" }],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "lizliz",
      type: "article",
      publishedTime: podcast.publishedDate || undefined,
      tags: podcast.tags,
      images: podcast.ogImage
        ? [{ url: absoluteUrl(podcast.ogImage) }]
        : undefined,
      audio: podcast.audioFile
        ? [{ url: absoluteUrl(podcast.audioFile), type: "audio/mpeg" }]
        : undefined,
    },
    twitter: {
      card: podcast.ogImage ? "summary_large_image" : "summary",
      title,
      description,
      creator: "@lizliz404",
      images: podcast.ogImage ? [absoluteUrl(podcast.ogImage)] : undefined,
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
  const subtitles = loadSubtitles(slug);
  const episodeNumber = slug.match(/(\d+)/)?.[1] || undefined;
  const isoDuration = durationToIso8601(podcast.duration);

  const jsonLdPodcast = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: podcast.title,
    description,
    url,
    datePublished: podcast.publishedDate || undefined,
    duration: isoDuration,
    episodeNumber,
    author: {
      "@type": "Person",
      name: podcast.hosts.map((h) => h.name).join(" & ") || "dayi & mizai",
    },
    partOfSeries: {
      "@type": "PodcastSeries",
      name: "lizliz podcast",
      url: absoluteUrl(),
    },
    associatedMedia: {
      "@type": "AudioObject",
      name: podcast.title,
      description,
      url: absoluteUrl(podcast.audioFile),
      contentUrl: absoluteUrl(podcast.audioFile),
      encodingFormat: "audio/mpeg",
      duration: isoDuration,
    },
    publisher: {
      "@type": "Person",
      name: "Liz",
      url: absoluteUrl(),
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl() },
      {
        "@type": "ListItem",
        position: 2,
        name: "Podcast",
        item: absoluteUrl(),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPodcast) }}
      />
      <Script
        id={`breadcrumb-json-ld-${slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <PodcastContent
        podcast={{
          title: podcast.title,
          date: podcast.date,
          description: podcast.description,
          duration: podcast.duration,
          hosts: podcast.hosts,
          audioFile: podcast.audioFile,
          subtitles,
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{ h1: ({ children }) => <h2>{children}</h2> }}
        >
          {podcast.content}
        </ReactMarkdown>
      </PodcastContent>
    </>
  );
}
