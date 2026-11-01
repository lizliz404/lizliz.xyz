import type { Metadata } from "next";
import "../share.css";

export const metadata: Metadata = {
  title: "已拆分为两页：出海建站定价 + 国内获客（GTM）",
  description: "原合订页已拆分为定价讨论稿与 GTM 获客简报两页",
  robots: { index: false, follow: false },
};

/** 旧链接保留。Cloudflare _redirects 默认 301 到定价页；此处同时保留两页入口。 */
export default function FoundryGtmRedirectPage() {
  return (
    <main id="main-content" className="fg" lang="zh-CN">
      <div className="fg-page">
        <header className="fg-head">
          <p className="fg-eyebrow">页面已拆分</p>
          <h1>原合订页已拆成「定价」与「获客（GTM）」两份独立简报</h1>
          <p className="fg-summary">
            正在自动跳转到定价讨论稿；如果你要直接看国内获客（GTM）打法，可点下方第二个入口。
          </p>
        </header>
        <div className="fg-callout">
          <p className="fg-callout-lead">直达入口</p>
          <div className="fg-callout-body">
            1. 定价与陪跑方案：{" "}
            <a href="/share/overseas-site-pricing-and-retainer-service/" className="fg-ext-link">
              /share/overseas-site-pricing-and-retainer-service/
            </a>
            <br />
            2. 国内获客（GTM）简报：{" "}
            <a href="/share/plain-gtm-where-buyers-search-and-pay/" className="fg-ext-link">
              /share/plain-gtm-where-buyers-search-and-pay/
            </a>
          </div>
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: 'location.replace("/share/overseas-site-pricing-and-retainer-service/");',
        }}
      />
    </main>
  );
}
