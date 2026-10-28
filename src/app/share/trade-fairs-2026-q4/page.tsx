import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moved → 展会尽调 2026-11 → 2027-10",
  description: "页面已改名，覆盖范围扩到 2027-10",
  robots: { index: false, follow: false },
};

/** 旧链接保留。Cloudflare _redirects 也会 301 到新 slug。 */
export default function TradeFairsQ4RedirectPage() {
  return (
    <main id="main-content" style={{ padding: "48px 20px", fontFamily: "system-ui, sans-serif" }}>
      <p>
        这一页已改名并扩到 2027-10：{" "}
        <a href="/share/trade-fairs-2026-2027/">/share/trade-fairs-2026-2027/</a>
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: 'location.replace("/share/trade-fairs-2026-2027/" + location.hash);',
        }}
      />
    </main>
  );
}
