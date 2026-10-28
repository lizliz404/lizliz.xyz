import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import { ChipStrip, CrossNav, MicroStrip, Section, Takeaway, Toc } from "../parts";
import {
  DualPipelineSvg,
  GtmRoutesSwimlaneSvg,
  MatrixChoiceSvg,
  SearchMechanismSvg,
} from "../diagrams";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.summary,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: c.meta.title, description: c.meta.summary },
};

export default function GtmSharePage() {
  return (
    <main id="main-content" className="fg" lang="zh-CN">
      <div className="fg-page">
        <CrossNav current="gtm" />

        <header className="fg-head">
          <p className="fg-eyebrow">{c.meta.eyebrow}</p>
          <h1>{c.meta.title}</h1>
          <p className="fg-summary">{c.meta.summary}</p>
          <p className="fg-meta">{c.meta.note}</p>
        </header>

        <div className="fg-top-grid">
          <Takeaway items={c.takeaway} />
          <Toc items={c.toc} />
        </div>

        <Section id="routes" n={1} heading="五条路子：入口 → 钩子 → 承接 → 成交" emphasis>
          <GtmRoutesSwimlaneSvg />
          <ChipStrip items={c.routeChips} />
          <MatrixChoiceSvg />
        </Section>

        <Section id="search" n={2} heading="搜商：品类词排名看什么" emphasis>
          <SearchMechanismSvg />
        </Section>

        <Section id="pipelines" n={3} heading="双流向：我们获客 vs 客户海外询盘">
          <DualPipelineSvg />
        </Section>

        <Section id="next" n={4} heading="近 4 周（P0 最小闭环）">
          <MicroStrip items={c.nextStrip} />
        </Section>
      </div>
    </main>
  );
}
