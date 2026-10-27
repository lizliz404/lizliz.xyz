import type { Metadata } from "next";
import "./foundry-gtm.css";
import * as c from "./content";
import { Bars, Callout, Columns, Flow, Matrix, Metrics, ProsCons, Rows, Section, Steps, Table, Text } from "./parts";

// 内容全部在 content.ts；这里只按顺序摆放。
export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.summary,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: c.meta.title, description: c.meta.summary },
};

export default function FoundryGtmSharePage() {
  return (
    <main id="main-content" className="fg" lang="zh-CN">
      <div className="fg-page">
        <header className="fg-head">
          <p className="fg-eyebrow">Foundry · GTM 讨论稿</p>
          <h1>{c.meta.title}</h1>
          <p className="fg-summary">{c.meta.summary}</p>
          <p className="fg-meta">{c.meta.note}</p>
        </header>

        <Section heading="主要矛盾">
          <Callout lead="主要矛盾">{c.contradiction.callout}</Callout>
          <Text>{c.contradiction.text}</Text>
        </Section>

        <Section heading="客户眼里的价格参照（第一年，人民币）">
          <Bars bars={c.bars} />
          <Text>{c.barsText}</Text>
        </Section>

        <Section heading="对手地图：高 / 中 / 低">
          <Matrix x={c.matrix.x} y={c.matrix.y} points={c.matrix.points} />
          <Text>{c.matrix.text}</Text>
        </Section>

        <Section heading="三档">
          <Metrics metrics={c.tiers.metrics} />
          <Table {...c.tiers.table} />
          <Text>{c.tiers.tableText}</Text>
          <Columns points={c.tiers.columns} />
          <Text>{c.tiers.columnsText}</Text>
        </Section>

        <Section heading="可守卖点与最低承接">
          <ProsCons {...c.pitch} />
          <Callout lead="最低承接">{c.pitch.callout}</Callout>
        </Section>

        <Section heading="怎么卖">
          <Flow nodes={c.sell.nodes} />
          <Text>{c.sell.text}</Text>
        </Section>

        <Section heading="隐藏成本和风险（只留影响最大的）">
          <Table columns={c.risks.columns} rows={c.risks.rows} />
          <Text>{c.risks.text}</Text>
        </Section>

        <Section heading="4 周验证 + 待拍板">
          <Steps steps={c.next.steps} />
          <Rows heading="待拍板" rows={c.next.decisions} />
        </Section>
      </div>
    </main>
  );
}
