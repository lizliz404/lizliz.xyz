import type { Metadata } from "next";
import Script from "next/script";
import { Poppins, Lora } from "next/font/google";
import { LangProvider } from "@/i18n";
import TopBar from "@/components/TopBar";
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

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export const metadata: Metadata = {
  metadataBase: new URL("https://lizliz.xyz"),
  title: {
    default: "lizliz — building at the edge of agents, markets, and words",
    template: "%s | lizliz",
  },
  description:
    "Personal site of Liz. Writing about AI agents, SaaS infrastructure, global payments, health tech, and the systems that shape how we work and think.",
  keywords: [
    "Liz",
    "AI agent",
    "SaaS",
    "independent developer",
    "writing",
    "productivity",
    "trading",
    "health tech",
  ],
  authors: [{ name: "Liz", url: "https://lizliz.xyz" }],
  creator: "Liz",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
  },
  openGraph: {
    title: "lizliz — building at the edge of agents, markets, and words",
    description:
      "Personal site of Liz. Writing about AI agents, SaaS infrastructure, global payments, health tech, and the systems that shape how we work and think.",
    url: "https://lizliz.xyz",
    siteName: "lizliz",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "lizliz — building at the edge of agents, markets, and words",
    description:
      "Personal site of Liz. Writing about AI agents, SaaS infrastructure, global payments, health tech, and the systems that shape how we work and think.",
    creator: "@lizliz404",
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
  verification: {
    google: "G-TXVLTJJ878",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Liz",
  url: "https://lizliz.xyz",
  sameAs: [
    "https://github.com/lizliz404",
    "https://x.com/lizliz404",
    "https://okjk.co/znTaA1",
  ],
  jobTitle: "Independent Developer",
  worksFor: {
    "@type": "Organization",
    name: "lizliz.xyz",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "lizliz",
  url: "https://lizliz.xyz",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://lizliz.xyz/articles?q={search_term_string}",
    "query-input": "required name=search_term_string",
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
      className={`${poppins.variable} ${lora.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  var t = localStorage.getItem('theme');
  if (t === 'light' || t === 'dark') {
    document.documentElement.setAttribute('data-theme', t);
  }
})();`,
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
          <TopBar />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
