import { getArticles } from "@/lib/articles";
import { getProjects } from "@/lib/projects";
import HomeContent from "./HomeContent";

export default async function Home() {
  const [articles, projects] = await Promise.all([getArticles(), getProjects()]);
  return <HomeContent articles={articles} projects={projects} />;
}
