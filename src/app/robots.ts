import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/articles";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/preview",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
