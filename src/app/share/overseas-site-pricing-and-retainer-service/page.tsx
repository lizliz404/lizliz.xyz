import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import { CrossNav, Metrics, Section, Takeaway, Toc } from "../parts";
import {
  CompetitorQuadrantSvg,
  CapacityLadderSvg,
  PricingArchitectureSvg,
  PricingLandscapeSvg,
} from "../diagrams";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.summary,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: c.meta.title, description: c.meta.summary },
};

export default function PricingSharePage() {
  return (
    <main id="main-content" className="fg" lang="zh-CN">
      <div className="fg-page">
        <CrossNav current="pricing" />

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

        <Section id="landscape" n={1} heading="两类购买边界：攒资产 vs 租流量" emphasis>
          <PricingLandscapeSvg />
        </Section>

        <Section id="quadrant" n={2} heading="定位：首年预算 × 谁干活">
          <CompetitorQuadrantSvg />
        </Section>

        <Section id="architecture" n={3} heading="三档拆价与反哺飞轮" emphasis>
          <Metrics metrics={c.tiers.metrics} />
          <PricingArchitectureSvg />
        </Section>

        <Section id="ladder" n={4} heading="产能阶梯（本季名额【假设】）">
          <CapacityLadderSvg bPoints={c.ladder.bPoints} cPoints={c.ladder.cPoints} />
        </Section>
      </div>
    </main>
  );
}
