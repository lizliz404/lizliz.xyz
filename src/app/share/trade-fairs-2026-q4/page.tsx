import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import { Callout, Section, Table, Takeaway, Text, Toc } from "../parts";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.summary,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: c.meta.title, description: c.meta.summary },
};

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="fg-bullets">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export default function TradeFairs2026Q4SharePage() {
  return (
    <main id="main-content" className="fg" lang="zh-CN">
      <div className="fg-page">
        <header className="fg-head">
          <p className="fg-eyebrow">{c.meta.eyebrow}</p>
          <h1>{c.meta.title}</h1>
          <p className="fg-summary">{c.meta.summary}</p>
          <p className="fg-meta">{c.meta.note}</p>
        </header>

        <Takeaway items={c.takeaway} />
        <Toc items={c.toc} />

        <Section
          id="oct"
          n={1}
          heading="10 月末：窗口已过 / 不建议"
          lede={c.oct.lede}
        >
          <Table columns={c.fairColumns} rows={c.oct.rows} />
        </Section>

        <Section
          id="nov-early"
          n={2}
          heading="11 上旬中旬：五金机电练手"
          lede={c.novEarly.lede}
          emphasis
        >
          <Table columns={c.fairColumns} rows={c.novEarly.rows} />
          <Callout lead="预登记（已核实入口）">{c.novEarly.hardwareNote}</Callout>
        </Section>

        <Section
          id="clash"
          n={3}
          heading="11/25–27 撞期：宁波中小工厂展 vs 义乌跨境"
          lede={c.clash.lede}
          emphasis
        >
          <Table columns={c.fairColumns} rows={c.clash.rows} />
          <Text>{c.clash.ningboDetail}</Text>
          <Text>{c.clash.yiwuDetail}</Text>
          <Table columns={c.clash.plans.columns} rows={c.clash.plans.rows} />
        </Section>

        <Section
          id="dec"
          n={4}
          heading="12/10–12：义乌外贸工厂展"
          lede={c.dec.lede}
        >
          <Table columns={c.fairColumns} rows={c.dec.rows} />
          <Text>{c.dec.schedule}</Text>
        </Section>

        <Section
          id="guangzhou"
          n={5}
          heading="广州：近期不去"
          lede={c.guangzhou.lede}
        >
          <Table columns={c.fairColumns} rows={c.guangzhou.rows} />
        </Section>

        <Section
          id="steps"
          n={6}
          heading="最少必要步骤"
          lede={c.steps.lede}
          emphasis
        >
          <Table columns={c.steps.columns} rows={c.steps.rows} />
        </Section>

        <Section id="play" n={7} heading="打法一句话" lede={c.play.lede}>
          <Text>{c.play.body}</Text>
        </Section>

        <Section id="costs" n={8} heading="费用一眼看" lede={c.costs.lede}>
          <Table columns={c.costs.columns} rows={c.costs.rows} />
        </Section>

        <Section id="open" n={9} heading="还没定的事" lede={c.open.lede}>
          <Bullets items={c.open.items} />
          <p className="fg-caveat">{c.sourceLine}</p>
        </Section>
      </div>
    </main>
  );
}
