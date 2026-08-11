import type { Metadata } from "next";
import Script from "next/script";
import { getArticles } from "@/lib/articles";
import { getProjects } from "@/lib/projects";
import { getPodcasts } from "@/lib/podcast";
import HomeContent from "./HomeContent";

const HOME_TITLE = "Liz — AI agents, SaaS systems, and writing";
const HOME_DESCRIPTION =
  "Independent developer building agent infrastructure and shipping small products. Browse projects, essays on AI systems and markets, and long-form notes.";

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "https://lizliz.xyz",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: HOME_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://lizliz.xyz",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Home() {
  const articles = getArticles();
  const projects = getProjects();
  const podcasts = getPodcasts();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Liz showcase projects",
    description: "Shipped tools, games, product experiments, and downloadable agent skill packs.",
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      url: project.url,
      description: project.description,
      ...(project.ogImage
        ? {
            item: {
              "@type":
                project.kind === "skill" || project.kind === "templates"
                  ? "SoftwareApplication"
                  : "CreativeWork",
              name: project.title,
              url: project.url,
              description: project.description,
              image: project.ogImage,
            },
          }
        : {}),
    })),
  };

  return (
    <>
      <Script
        id="home-itemlist-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <HomeContent articles={articles} projects={projects} podcasts={podcasts} />
    </>
  );
}
