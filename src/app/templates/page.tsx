import type { Metadata } from "next";
import Script from "next/script";
import { absoluteUrl } from "@/lib/articles";
import { TEMPLATES_PACK } from "@/lib/templates";
import TemplatesContent from "./TemplatesContent";

const TEMPLATES_TITLE = "Templates";
/** Keep ≤160 chars for SERP snippets. */
const TEMPLATES_DESCRIPTION =
  "Free reusable design template pack by Liz — DESIGN.md visual systems, landing templates, UI micro-patterns, and craft checklists. Download, unzip, reuse.";

export const metadata: Metadata = {
  title: TEMPLATES_TITLE,
  description: TEMPLATES_DESCRIPTION,
  openGraph: {
    title: `${TEMPLATES_TITLE} | Liz`,
    description: TEMPLATES_DESCRIPTION,
    url: "https://lizliz.xyz/templates",
    type: "website",
    images: [
      {
        url: "/og/templates.png",
        width: 1200,
        height: 630,
        alt: "Design Templates Pack by Liz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TEMPLATES_TITLE} | Liz`,
    description: TEMPLATES_DESCRIPTION,
    images: ["/og/templates.png"],
  },
  alternates: {
    canonical: "https://lizliz.xyz/templates",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TemplatesPage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: TEMPLATES_PACK.name,
    description: TEMPLATES_DESCRIPTION,
    applicationCategory: "DeveloperApplication",
    author: { "@type": "Person", name: "Liz" },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    downloadUrl: absoluteUrl(TEMPLATES_PACK.zipUrl),
    url: absoluteUrl("/templates"),
  };

  return (
    <>
      <Script
        id="templates-software-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <TemplatesContent />
    </>
  );
}
