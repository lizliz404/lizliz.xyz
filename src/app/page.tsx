import { getArticles } from "@/lib/articles";
import { getProjects } from "@/lib/projects";
import { getPodcasts } from "@/lib/podcast";
import HomeContent from "./HomeContent";

export default async function Home() {
  const articles = getArticles();
  const projects = getProjects();
  const podcasts = getPodcasts();
  return <HomeContent articles={articles} projects={projects} podcasts={podcasts} />;
}
