import type { Metadata } from "next";
import "../share.css";

export const metadata: Metadata = {
  title: "已升级 → 四城展会参观指南 2026-11 → 2027-10",
  description: "页面已改名，覆盖范围扩到宁波、义乌、广州、上海四城 2026-11 至 2027-10",
  robots: { index: false, follow: false },
};

/** 旧链接保留。Cloudflare _redirects 也会 301 到新 slug。 */
export default function TradeFairsQ4RedirectPage() {
  return (
    <main id="main-content" className="fg" lang="zh-CN">
      <div className="fg-page">
        <header className="fg-head">
          <p className="fg-eyebrow">页面已升级</p>
          <h1>展会指南已扩充至四城全年（2026-11 → 2027-10）</h1>
          <p className="fg-summary">
            正在自动跳转到新版页面；如未自动跳转，请点击下方链接。
          </p>
        </header>
        <div className="fg-callout">
          <p className="fg-callout-lead">新版地址</p>
          <div className="fg-callout-body">
            <a href="/share/trade-fairs-2026-2027/" className="fg-ext-link">
              /share/trade-fairs-2026-2027/
            </a>
          </div>
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: 'location.replace("/share/trade-fairs-2026-2027/" + location.hash);',
        }}
      />
    </main>
  );
}
