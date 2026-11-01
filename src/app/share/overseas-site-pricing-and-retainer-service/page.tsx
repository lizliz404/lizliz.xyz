import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import { Cards, CrossNav, ExtLink, Metrics, Section, Table, Takeaway, Text, Toc } from "../parts";
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
  const categoryRows = c.categoryComparisons.map((row) => [
    row.category,
    <div key={row.category} style={{ display: "grid", gap: "6px" }}>
      {row.players.map((p) => (
        <div key={p.name}>
          {p.href ? (
            <ExtLink href={p.href}>
              <strong style={p.us ? { color: "var(--fg-accent)" } : undefined}>{p.name}</strong>
            </ExtLink>
          ) : (
            <strong style={p.us ? { color: "var(--fg-accent)" } : undefined}>{p.name}</strong>
          )}
          <span>：{p.price}</span>
        </div>
      ))}
    </div>,
    row.boundary,
    row.implication,
  ]);

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

        <Section
          id="landscape"
          n={1}
          heading="先把市场报价按「客户买到什么」分成五类"
          lede="把 ¥500 的自助后台和 ¥69,800 的含广告代投混在一根价格条上比高低，得出的结论一定是错的。先按交付物分五类（点品牌名可打开官方价格或规则页）："
          emphasis
        >
          <Table
            columns={["客户买的是什么", "代表玩家与首年报价（点名称看出处）", "实际交付边界", "对我们定价的含义"]}
            rows={categoryRows}
          />
          <PricingLandscapeSvg />
          <Cards items={c.inquiryNotes} />
        </Section>

        <Section
          id="quadrant"
          n={2}
          heading="竞争定位：首年掏多少钱 × 活是谁干的"
          lede="同一个客户群里，决定价格带的核心变量不是公司规模，而是「客户自己动手」还是「有人替他把活干完」。"
        >
          <CompetitorQuadrantSvg />
          <Text>{c.quadrantNote}</Text>
        </Section>

        <Section
          id="architecture"
          n={3}
          heading="我们的三档方案：怎么拆价、包含什么、三条护栏"
          lede="主推 B 档代建（¥5,800 草案），用一次性代建 + 3 个月维护帮客户把站真正跑起来；同时把建站费与月维护费拆开，让任何组合都能算清。"
          emphasis
        >
          <Metrics metrics={c.tiers.metrics} />
          <Table columns={c.tiers.table.columns} rows={c.tiers.table.rows} emphasis={2} />
          <PricingArchitectureSvg />
          <Cards items={c.tiers.guardrails} />
        </Section>

        <Section
          id="ladder"
          n={4}
          heading="本季产能上限与阶梯价（草案）"
          lede="代建和代运营吃的是创始人的真实时间，名额按实际工时封顶，边交付边校准。"
        >
          <CapacityLadderSvg bPoints={c.ladder.bPoints} cPoints={c.ladder.cPoints} />
          <Text>{c.ladder.note}</Text>
        </Section>
      </div>
    </main>
  );
}
