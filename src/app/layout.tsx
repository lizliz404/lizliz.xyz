import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Poppins, Lora, Instrument_Serif } from "next/font/google";
import { LangProvider } from "@/i18n";
import TopBar from "@/components/TopBar";
import SkipLink from "@/components/SkipLink";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-lora",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

// House-wide GA4 property — keep ID intact; env override only for local forks.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-TXVLTJJ878";

const SITE_TITLE = "Liz — AI agents, SaaS systems, and writing";
const SITE_DESCRIPTION =
  "Independent developer building agent infrastructure and shipping small products. Essays on AI systems, global payments, markets, health tech, and how we work.";

export const metadata: Metadata = {
  metadataBase: new URL("https://lizliz.xyz"),
  title: {
    default: SITE_TITLE,
    template: "%s | Liz",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Liz",
    "lizliz",
    "AI agent",
    "agent infrastructure",
    "SaaS",
    "independent developer",
    "global payments",
    "writing",
    "trading",
    "health tech",
  ],
  authors: [{ name: "Liz", url: "https://lizliz.xyz" }],
  creator: "Liz",
  publisher: "Liz",
  category: "technology",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://lizliz.xyz",
    siteName: "lizliz.xyz",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Liz — AI agents, SaaS systems, and writing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@lizliz404",
    site: "@lizliz404",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://lizliz.xyz",
    types: {
      "application/rss+xml": "https://lizliz.xyz/rss.xml",
    },
  },
};

// Next.js emits theme-color from the viewport export only (metadata.themeColor is ignored).
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1a16" },
  ],
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Liz",
  alternateName: ["LizLiz", "lizliz404"],
  url: "https://lizliz.xyz",
  image: "https://lizliz.xyz/og-image.png",
  sameAs: [
    "https://github.com/lizliz404",
    "https://x.com/lizliz404",
    "https://okjk.co/znTaA1",
  ],
  jobTitle: "Independent Developer",
  description: SITE_DESCRIPTION,
  knowsAbout: [
    "AI agents",
    "SaaS infrastructure",
    "global payments",
    "trading systems",
    "product design",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "lizliz.xyz",
  alternateName: "Liz",
  url: "https://lizliz.xyz",
  description: SITE_DESCRIPTION,
  inLanguage: ["en", "zh"],
  author: {
    "@type": "Person",
    name: "Liz",
    url: "https://lizliz.xyz",
  },
  potentialAction: {
    "@type": "ReadAction",
    target: "https://lizliz.xyz/articles/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${lora.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://analytics.google.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Liz — Articles RSS"
          href="https://lizliz.xyz/rss.xml"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-theme', t);
    }
    var l = localStorage.getItem('lang');
    if (l !== 'zh' && l !== 'en') l = 'en';
    document.documentElement.setAttribute('data-lang', l);
    document.documentElement.lang = l;
    window.__LIZ_LANG__ = l;
    // SSR HTML is English. If the user prefers zh, hold first paint until
    // React applies Chinese in useLayoutEffect — avoids the EN→ZH flash.
    if (l === 'zh') {
      document.documentElement.setAttribute('data-lang-pending', '');
    }
  } catch (e) {}
})();`,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `html[data-lang-pending] body{visibility:hidden}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}
      <body className="min-h-full flex flex-col">
        <LangProvider>
          <SkipLink />
          <TopBar />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
