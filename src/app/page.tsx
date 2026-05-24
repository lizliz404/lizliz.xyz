import { getArticles } from "@/lib/articles";
import { getProjects } from "@/lib/projects";
import HomeContent from "./HomeContent";

export default async function Home() {
  const articles = getArticles();
  const projects = getProjects();
  return <HomeContent articles={articles} projects={projects} />;
}
