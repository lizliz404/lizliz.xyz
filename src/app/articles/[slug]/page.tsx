import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { absoluteUrl, getArticles, getArticle } from "@/lib/articles";
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

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "lizliz",
      type: "article",
      publishedTime: article.date || undefined,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: "index, follow",
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
  const url = absoluteUrl(`/articles/${slug}`);
  const description = article.description || `${article.title} — lizliz article`;
  const jsonLd = {
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
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <>
      <Script
        id={`article-json-ld-${slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleContent
        article={{
          title: article.title,
          date: article.date,
          description: article.description,
          wordCount,
        }}
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
