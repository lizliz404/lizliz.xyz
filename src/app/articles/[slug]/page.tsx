import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { absoluteUrl, getAdjacentArticles, getArticles, getArticle, getRelatedArticles } from "@/lib/articles";
import remarkHighlight from "@/lib/remark-highlight";
import ArticleContent from "./ArticleContent";

function countChars(content: string): string {
  const cjk = (content.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  const words = (content.match(/[a-zA-Z0-9]+/g) || []).length;
  const total = cjk + words;
  if (total >= 10000) return `${(total / 10000).toFixed(1)} 万字`;
  if (total >= 1000) return `${(total / 1000).toFixed(0)}k 字`;
  return `${total} 字`;
}

function estimateReadingTime(content: string): number {
  const cjk = (content.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  const words = (content.match(/[a-zA-Z0-9]+/g) || []).length;
  const total = cjk + words;
  // ~300 CJK chars/min or ~200 English words/min, blended
  return Math.max(1, Math.round(total / 350));
}

export function generateStaticParams() {
  const articles = getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const url = absoluteUrl(`/articles/${slug}`);
  const title = article.title;
  const description = article.description || `${article.title} — lizliz article`;
  const keywords = article.keywords || article.tags || [];

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Liz", url: absoluteUrl() }],
    alternates: { canonical: article.canonical || url },
    openGraph: {
      title,
      description,
      url,
      siteName: "lizliz",
      type: "article",
      publishedTime: article.date || undefined,
      modifiedTime: article.date || undefined,
      tags: article.tags,
      images: article.ogImage
        ? [{ url: article.ogImage }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@lizliz404",
      images: article.ogImage ? [article.ogImage] : undefined,
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const wordCount = countChars(article.content);
  const readingTime = article.readingTime || estimateReadingTime(article.content);
  const adjacent = getAdjacentArticles(slug);
  const relatedArticles = getRelatedArticles(slug);
  const url = absoluteUrl(`/articles/${slug}`);
  const description = article.description || `${article.title} — lizliz article`;

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description,
    url,
    datePublished: article.date || undefined,
    dateModified: article.date || undefined,
    author: {
      "@type": "Person",
      name: "Liz",
      url: absoluteUrl(),
    },
    publisher: {
      "@type": "Person",
      name: "Liz",
      url: absoluteUrl(),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: article.keywords?.join(", ") || article.tags?.join(", "),
    articleSection: article.tags?.[0],
    wordCount: wordCount,
    timeRequired: `PT${readingTime}M`,
    image: article.ogImage ? { "@type": "ImageObject", url: article.ogImage } : undefined,
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
        name: "Articles",
        item: absoluteUrl("/articles"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <Script
        id={`article-json-ld-${slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <Script
        id={`breadcrumb-json-ld-${slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <ArticleContent
        article={{
          title: article.title,
          date: article.date,
          description: article.description,
          wordCount,
          readingTime,
        }}
        newerArticle={adjacent.newer}
        olderArticle={adjacent.older}
        relatedArticles={relatedArticles}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkHighlight]}
          components={{
            h1: ({ children }) => <h2>{children}</h2>,
          }}
        >
          {article.content}
        </ReactMarkdown>
      </ArticleContent>
    </>
  );
}
