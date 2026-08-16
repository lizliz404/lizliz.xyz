import type { Metadata } from "next";
import Script from "next/script";
import { getProjects } from "@/lib/projects";
import HomeContent from "./HomeContent";

const HOME_TITLE = "Liz — writing and small products";
const HOME_DESCRIPTION =
  "Hangzhou. I write, and I ship things that are interesting and useful: kids' learning tools, a hologram toy, a Bitcoin whitepaper reader, and downloadable agent skills.";

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
  const projects = getProjects();

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
      <HomeContent projects={projects} />
    </>
  );
}
