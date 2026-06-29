import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
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

type MarkdownImageProps = ComponentProps<"img">;
type MarkdownAnchorProps = ComponentProps<"a">;

const AUDIO_LINK_RE = /\.(?:mp3|m4a|ogg|wav)(?:[?#].*)?$/i;
const EXTERNAL_LINK_RE = /^https?:\/\//i;

function MarkdownAnchor({ href = "", children, ...props }: MarkdownAnchorProps) {
  const source = String(href);
  const isExternalLink = EXTERNAL_LINK_RE.test(source);

  if (AUDIO_LINK_RE.test(source)) {
    const label = typeof children === "string" ? children : "音频朗读";

    return (
      <span className="my-6 block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <span className="mb-3 block text-sm font-semibold text-[var(--foreground)]">{label}</span>
        <audio controls preload="metadata" className="w-full" src={source}>
          <a href={source} {...props}>
            {children}
          </a>
        </audio>
      </span>
    );
  }

  return (
    <a
      href={source}
      target={isExternalLink ? "_blank" : undefined}
      rel={isExternalLink ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

const ARTICLE_IMAGE_SIZES: Record<string, { width: number; height: number }> = {
  "/images/articles/platform-incentive-vs-building/okx-boost-economic-independence-2026-05-14.jpg": { width: 2940, height: 1672 },
  "/images/articles/traditional-education-system/devrel-intern-jd.jpg": { width: 545, height: 1234 },
  "/images/articles/traditional-education-system/junior-jobs-ai-squeeze.png": { width: 916, height: 1565 },
  "/images/articles/traditional-education-system/kazik-comment-why-need.jpg": { width: 1080, height: 1266 },
  "/images/articles/traditional-education-system/kol-ai-skills-beats-985.png": { width: 1080, height: 1982 },
  "/images/articles/universe-mayor/universe-mayor-classroom.png": { width: 1448, height: 1086 },
  "/images/articles/universe-mayor/universe-mayor-game-hall.png": { width: 1448, height: 1086 },
  "/images/articles/universe-mayor/universe-mayor-recursion.png": { width: 1448, height: 1086 },
};

function optimizedImageSrc(src: string, extension: "avif" | "webp") {
  return src.replace(/\.(?:jpe?g|png)$/i, `.${extension}`);
}

function MarkdownImage({ src = "", alt = "", ...props }: MarkdownImageProps) {
  const source = String(src);
  const dimensions = ARTICLE_IMAGE_SIZES[source];
  const rest = props;
  const common = {
    ...rest,
    src: source,
    alt: String(alt),
    width: dimensions?.width,
    height: dimensions?.height,
    loading: "lazy" as const,
    decoding: "async" as const,
  };

  if (!/\.(?:jpe?g|png)$/i.test(source)) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...common} />;
  }

  return (
    <picture>
      <source srcSet={optimizedImageSrc(source, "avif")} type="image/avif" />
      <source srcSet={optimizedImageSrc(source, "webp")} type="image/webp" />
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img {...common} />
    </picture>
  );
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
      publishedTime: article.publishedDate || undefined,
      modifiedTime: article.updatedDate || article.publishedDate || undefined,
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
    datePublished: article.publishedDate || undefined,
    dateModified: article.updatedDate || article.publishedDate || undefined,
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
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ children }) => <h2>{children}</h2>,
            a: MarkdownAnchor,
            img: MarkdownImage,
          }}
        >
          {article.content}
        </ReactMarkdown>
      </ArticleContent>
    </>
  );
}
