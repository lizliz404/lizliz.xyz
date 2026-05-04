import { getArticles } from "@/lib/articles";
import HomeContent from "./HomeContent";

export default function Home() {
  const articles = getArticles();
  return <HomeContent articles={articles} />;
}
