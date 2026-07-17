import type { Metadata } from "next";
import { getArticles } from "@/lib/articles";
import { getProjects } from "@/lib/projects";
import { getPodcasts } from "@/lib/podcast";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: {
    absolute: "Liz — building at the edge of agents, markets, and words",
  },
  description:
    "Personal site of Liz. Writing about AI agents, SaaS infrastructure, global payments, health tech, and the systems that shape how we work and think.",
};

export default async function Home() {
  const articles = getArticles();
  const projects = getProjects();
  const podcasts = getPodcasts();
  return <HomeContent articles={articles} projects={projects} podcasts={podcasts} />;
}
