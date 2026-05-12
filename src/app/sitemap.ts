import type { MetadataRoute } from "next";
import { absoluteUrl, getArticles } from "@/lib/articles";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/articles"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const articleRoutes = getArticles().map((article) => ({
    url: absoluteUrl(`/articles/${article.slug}`),
    lastModified: article.date || undefined,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
