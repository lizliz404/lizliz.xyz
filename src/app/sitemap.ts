import type { MetadataRoute } from "next";
import { absoluteUrl, getArticles } from "@/lib/articles";
import { getPodcasts } from "@/lib/podcast";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/articles"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/adventurex-2026/"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/skills"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/templates"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const articleRoutes = getArticles().map((article) => ({
    url: absoluteUrl(`/articles/${article.slug}`),
    lastModified: article.updatedDate || article.publishedDate || undefined,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const podcastRoutes = getPodcasts().map((podcast) => ({
    url: absoluteUrl(`/podcast/${podcast.slug}`),
    lastModified: podcast.publishedDate || podcast.date || undefined,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes, ...podcastRoutes];
}
