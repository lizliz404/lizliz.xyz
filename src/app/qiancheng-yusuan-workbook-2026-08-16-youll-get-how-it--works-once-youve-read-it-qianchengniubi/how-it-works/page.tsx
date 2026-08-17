import type { Metadata } from "next";
import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { notFound } from "next/navigation";
import ArticleContent from "@/app/articles/[slug]/ArticleContent";
import { QIANCHENG_WORKBOOK_SLUG, getWorkbook } from "@/lib/workbooks";

type MarkdownAnchorProps = ComponentProps<"a">;

function MarkdownAnchor({ href = "", children, ...props }: MarkdownAnchorProps) {
  const source = String(href);
  const { node: _node, ...rest } = props as Record<string, unknown>;
  const internal = source.startsWith("/") || source.startsWith("#") || source.startsWith(".");
  return (
    <a
      href={source}
      target={internal ? undefined : "_blank"}
      rel={internal ? undefined : "noopener noreferrer"}
      {...rest}
    >
      {children}
    </a>
  );
}

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
  return Math.max(1, Math.round((cjk + words) / 350));
}

export function generateStaticParams() {
  return [{}];
}

export const metadata: Metadata = {
  title: "预算总表是怎么 work 的",
  description: "前程预算内部讲义：Excel 总线、表怎么长出来、数怎么往上滚。替代总线，不是消灭导出。",
  robots: { index: false, follow: false },
};

export default function QianchengWorkbookNotePage() {
  const note = getWorkbook("qiancheng-yusuan");
  if (!note) notFound();

  return (
    <ArticleContent
      article={{
        title: note.title,
        date: note.date,
        description: note.description,
        wordCount: countChars(note.content),
        readingTime: estimateReadingTime(note.content),
      }}
      backHref={`/${QIANCHENG_WORKBOOK_SLUG}/`}
      backLabel="← 讲义幻灯"
      showArticleNav={false}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
          a: MarkdownAnchor,
        }}
      >
        {note.content}
      </ReactMarkdown>
    </ArticleContent>
  );
}
