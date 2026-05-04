import { getArticles } from "@/lib/articles";
import ArticlesContent from "./ArticlesContent";

export default function ArticlesPage() {
  const articles = getArticles();
  return <ArticlesContent articles={articles} />;
}
