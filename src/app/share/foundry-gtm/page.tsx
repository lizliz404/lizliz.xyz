import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moved → 定价讨论稿",
  description: "内容已拆到 /share/pricing/ 与 /share/gtm/",
  robots: { index: false, follow: false },
};

/** 旧链接保留。Cloudflare _redirects 也会 301 到 /share/pricing/。 */
export default function FoundryGtmRedirectPage() {
  return (
    <main id="main-content" style={{ padding: "48px 20px", fontFamily: "system-ui, sans-serif" }}>
      <p>
        这一页已拆开。定价讨论稿：{" "}
        <a href="/share/pricing/">/share/pricing/</a>
        ；GTM： <a href="/share/gtm/">/share/gtm/</a>。
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: 'location.replace("/share/pricing/");',
        }}
      />
    </main>
  );
}
