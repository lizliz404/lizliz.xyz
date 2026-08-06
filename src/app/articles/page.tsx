import type { Metadata } from "next";
import Script from "next/script";
import { absoluteUrl, getArticles } from "@/lib/articles";
import ArticlesContent from "./ArticlesContent";

const ARTICLES_TITLE = "Articles";
const ARTICLES_DESCRIPTION =
  "Essays and research notes on AI agents, SaaS infrastructure, global payments, markets, psychology, and the systems behind how we work and think.";

export const metadata: Metadata = {
  title: ARTICLES_TITLE,
  description: ARTICLES_DESCRIPTION,
  openGraph: {
    title: `${ARTICLES_TITLE} | Liz`,
    description: ARTICLES_DESCRIPTION,
    url: "https://lizliz.xyz/articles",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Articles by Liz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${ARTICLES_TITLE} | Liz`,
    description: ARTICLES_DESCRIPTION,
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://lizliz.xyz/articles",
    types: {
      "application/rss+xml": "https://lizliz.xyz/rss.xml",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ArticlesPage() {
  const articles = getArticles();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Articles by Liz",
    description: ARTICLES_DESCRIPTION,
    numberOfItems: articles.length,
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.title,
      url: absoluteUrl(`/articles/${article.slug}`),
      description: article.description,
    })),
  };

  return (
    <>
      <Script
        id="articles-itemlist-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <ArticlesContent articles={articles} />
    </>
  );
}
