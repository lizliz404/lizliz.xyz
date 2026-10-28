import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moved → 定价讨论稿",
  description: "内容已拆到两个长 slug 页面",
  robots: { index: false, follow: false },
};

/** 旧链接保留。Cloudflare _redirects 也会 301 到定价页。 */
export default function FoundryGtmRedirectPage() {
  return (
    <main id="main-content" style={{ padding: "48px 20px", fontFamily: "system-ui, sans-serif" }}>
      <p>
        这一页已拆开。定价讨论稿：{" "}
        <a href="/share/overseas-site-pricing-and-retainer-service/">/share/overseas-site-pricing-and-retainer-service/</a>
        ；GTM： <a href="/share/plain-gtm-where-buyers-search-and-pay/">/share/plain-gtm-where-buyers-search-and-pay/</a>。
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: 'location.replace("/share/overseas-site-pricing-and-retainer-service/");',
        }}
      />
    </main>
  );
}
