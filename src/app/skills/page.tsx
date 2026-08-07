import type { Metadata } from "next";
import Script from "next/script";
import { absoluteUrl } from "@/lib/articles";
import { SKILLS } from "@/lib/skills";
import SkillsContent from "./SkillsContent";

const SKILLS_TITLE = "Skills";
/** Keep ≤160 chars for SERP snippets; packs named in visible SSR accordion too. */
const SKILLS_DESCRIPTION =
  "Free agent skill packs by Liz — landing replication, Doubao TTS, video scripts, GEO job hunt, WebGL backgrounds, DESIGN.md. Unzip and use.";

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
      // Hash URLs are not indexed as separate docs; point at the index page.
      // Deep-link UX still uses /skills#<slug> in the client accordion.
      url: absoluteUrl("/skills"),
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
