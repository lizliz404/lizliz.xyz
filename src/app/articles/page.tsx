import type { Metadata } from "next";
import { getArticles } from "@/lib/articles";
import ArticlesContent from "./ArticlesContent";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Essays and notes on AI agents, markets, language, and the systems behind how we work and think.",
};

export default function ArticlesPage() {
  const articles = getArticles();
  return <ArticlesContent articles={articles} />;
}
