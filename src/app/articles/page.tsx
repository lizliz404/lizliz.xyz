import type { Metadata } from "next";
import { getArticles } from "@/lib/articles";
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
};

export default function ArticlesPage() {
  const articles = getArticles();
  return <ArticlesContent articles={articles} />;
}
