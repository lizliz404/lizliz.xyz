import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import {
  Bars,
  Callout,
  Columns,
  Matrix,
  Metrics,
  Rows,
  Section,
  Steps,
  Table,
  Text,
} from "../parts";

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
        <header className="fg-head">
          <p className="fg-eyebrow">定价讨论稿 · Foundry 只是实例之一</p>
          <h1>{c.meta.title}</h1>
          <p className="fg-summary">{c.meta.summary}</p>
          <p className="fg-meta">{c.meta.note}</p>
          <p className="fg-cross">
            获客／怎么卖 → <a href="/share/gtm/">GTM 讨论稿</a>
          </p>
        </header>

        <Section heading="先说清楚在比什么">
          <Callout lead="同赛道定价">{c.contradiction.callout}</Callout>
          <Text>{c.contradiction.text}</Text>
        </Section>

        <Section heading="客户眼里的价格参照（第一年，人民币）">
          <Bars bars={c.bars} />
          <Text>{c.barsText}</Text>
        </Section>

        <Section heading="对手地图">
          <Matrix x={c.matrix.x} y={c.matrix.y} points={c.matrix.points} />
          <Text>{c.matrix.text}</Text>
        </Section>

        <Section heading="三档（Foundry 实例）">
          <Metrics metrics={c.tiers.metrics} />
          <Table {...c.tiers.table} />
          <Text>{c.tiers.tableText}</Text>
          <Columns points={c.tiers.columns} />
          <Text>{c.tiers.columnsText}</Text>
        </Section>

        <Section heading="隐藏成本和风险（影响最大的）">
          <Table columns={c.risks.columns} rows={c.risks.rows} />
          <Text>{c.risks.text}</Text>
        </Section>

        <Section heading="接下来要拍板的">
          <Steps steps={c.next.steps} />
          <Rows heading="待拍板" rows={c.next.decisions} />
        </Section>
      </div>
    </main>
  );
}
