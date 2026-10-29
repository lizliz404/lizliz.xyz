import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import {
  Callout,
  Cards,
  ChipStrip,
  CrossNav,
  MicroStrip,
  Section,
  Steps,
  Takeaway,
  Toc,
} from "../parts";
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

        <Section id="start" n={1} heading="第一步：开号、发内容、留口子" emphasis>
          <Steps steps={c.startSteps} />
          <Cards items={c.learnFrom} />
          <Callout lead={c.paySignal.lead}>{c.paySignal.body}</Callout>
        </Section>

        <Section id="routes" n={2} heading="五条路子全景（排期用，不是都做）">
          <GtmRoutesSwimlaneSvg />
          <ChipStrip items={c.routeChips} />
          <MatrixChoiceSvg />
        </Section>

        <Section id="search" n={3} heading="应用内搜索：品类词怎么排到前面" emphasis>
          <SearchMechanismSvg />
        </Section>

        <Section id="pipelines" n={4} heading="两套流向：我们国内收钱 vs 客户海外询盘">
          <DualPipelineSvg />
        </Section>

        <Section id="next" n={5} heading="近 4 周先做这三步">
          <MicroStrip items={c.nextStrip} />
        </Section>
      </div>
    </main>
  );
}
