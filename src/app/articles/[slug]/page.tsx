import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getArticles, getArticle } from "@/lib/articles";
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const wordCount = countChars(article.content);

  return (
    <ArticleContent
      article={{
        title: article.title,
        date: article.date,
        description: article.description,
        wordCount,
      }}
    >
      <ReactMarkdown>{article.content}</ReactMarkdown>
    </ArticleContent>
  );
}
