import type { Metadata } from "next";
import Script from "next/script";
import { absoluteUrl } from "@/lib/articles";
import { SKILLS } from "@/lib/skills";
import SkillsContent from "./SkillsContent";

const SKILLS_TITLE = "Skills";
const SKILLS_DESCRIPTION =
  "Free agent skill packs by Liz — landing-page replication, Doubao TTS & podcasts, video scripts, GEO job hunting, WebGL backgrounds, DESIGN.md visual systems. Unzip and use.";

export const metadata: Metadata = {
  title: SKILLS_TITLE,
  description: SKILLS_DESCRIPTION,
  openGraph: {
    title: `${SKILLS_TITLE} | Liz`,
    description: SKILLS_DESCRIPTION,
    url: "https://lizliz.xyz/skills",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Skills by Liz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SKILLS_TITLE} | Liz`,
    description: SKILLS_DESCRIPTION,
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://lizliz.xyz/skills",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SkillsPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Skills by Liz",
    description: SKILLS_DESCRIPTION,
    numberOfItems: SKILLS.length,
    itemListElement: SKILLS.map((skill, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: skill.name,
      url: absoluteUrl(`/skills#${skill.slug}`),
      description: skill.tagline,
    })),
  };

  return (
    <>
      <Script
        id="skills-itemlist-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <SkillsContent />
    </>
  );
}
