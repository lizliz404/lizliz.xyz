import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import {
  Callout,
  Cards,
  CrossNav,
  FactDl,
  Section,
  Table,
  Takeaway,
  Text,
  Toc,
} from "../parts";
import {
  Ban,
  NotebookPen,
  Package,
  Globe2,
  MessageCircle,
  Search,
  Share2,
  Target,
  Users,
  Wallet,
} from "lucide-react";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.summary,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: c.meta.title, description: c.meta.summary },
};

export default function PricingSharePage() {
  const marketTableRows = c.marketRows.map((row) => [
    row.category,
    row.example,
    row.boundary,
    row.soWhat,
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
          <Takeaway heading={c.takeawayHeading} items={c.takeaway} />
          <Toc items={c.toc} />
        </div>

        <Section
          id="north-star"
          n={1}
          heading="北星：只盯客户咨询量"
          lede="万剑归宗就一个数——询单。站和社媒是两条路，不是五个价档。"
          emphasis
        >
          <FactDl
            items={[
              {
                icon: Target,
                label: "唯一指标",
                value: c.northStar.metric,
              },
              {
                icon: Search,
                label: "搜索站",
                value: c.northStar.roads[0].detail,
              },
              {
                icon: Share2,
                label: "社媒",
                value: c.northStar.roads[1].detail,
              },
              {
                icon: Globe2,
                label: "都选",
                value: c.northStar.roads[2].detail,
              },
            ]}
          />
          <Callout lead="所以呢">{c.northStar.soWhat}</Callout>
        </Section>

        <Section
          id="market"
          n={2}
          heading="市场怎么分：先看客户买到的是什么"
          lede="分类要清楚，再比价。广告充值和 B2B 平台会员不进主表。"
        >
          <Table
            columns={["类型", "例子", "实际买到什么", "所以呢"]}
            rows={marketTableRows}
          />
          <Text>{c.marketRefsNote}</Text>
        </Section>

        <Section
          id="sell"
          n={3}
          heading="我们卖什么：人把询单结果扛住"
          lede={c.sellWhat.lead}
          emphasis
        >
          <FactDl
            items={c.sellWhat.bullets.map((b, i) => ({
              icon: [Globe2, Users, Package][i],
              label: b.title,
              value: b.body,
            }))}
          />
        </Section>

        <Section
          id="lanes"
          n={4}
          heading="三选一报价：区间 × 难度"
          lede="按客户选的路报价。除一次性建站 ¥999 外，其余均【假设·未定】；难度高就上浮。"
          emphasis
        >
          <div className="fg-metrics">
            {c.laneQuotes.map((lane) => (
              <div
                key={lane.id}
                className="fg-card fg-metric"
                data-main={lane.main || undefined}
              >
                <div className="fg-metric-top">
                  <span className="fg-metric-label">{lane.name}</span>
                  <span className="fg-metric-tag">{lane.tag}</span>
                </div>
                <div style={{ display: "grid", gap: "12px", marginTop: "8px" }}>
                  {lane.lines.map((line) => (
                    <div key={line.label}>
                      <div className="fg-metric-detail" style={{ marginBottom: 2 }}>
                        {line.label}
                      </div>
                      <div className="fg-metric-value" style={{ fontSize: "1.35rem" }}>
                        {line.value}
                      </div>
                      {line.note ? (
                        <div className="fg-metric-detail">{line.note}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
                <p className="fg-text" style={{ marginTop: "14px", marginBottom: 0 }}>
                  {lane.soWhat}
                </p>
              </div>
            ))}
          </div>
          <Callout lead="定价怎么动" tone="quiet">
            {c.dynamicNote}
          </Callout>
        </Section>

        <Section
          id="why"
          n={5}
          heading="为什么这价：风险、成本、收益"
          lede="每一段都要答得上「所以呢」。细节验算进分析稿，不堆在汇报页。"
        >
          <Cards items={c.whyCards} />
        </Section>

        <Section
          id="refs"
          n={6}
          heading="对照与出处（短）"
          lede="星谷云只作已出现处的核实；不升格成页首主线。"
        >
          <FactDl
            items={[
              {
                icon: Wallet,
                label: "双11 全包",
                value: c.refs.xinggu[0].value,
              },
              {
                icon: Share2,
                label: "社媒 plus",
                value: c.refs.xinggu[1].value,
              },
              {
                icon: Globe2,
                label: "建站",
                value: c.refs.xinggu[2].value,
              },
              {
                icon: Ban,
                label: "广告充值行",
                value: c.refs.xinggu[3].value,
              },
              {
                icon: MessageCircle,
                label: "对接群",
                value: c.refs.xinggu[4].value,
              },
              {
                icon: NotebookPen,
                label: "其他一句",
                value: c.refs.others.join(" "),
              },
            ]}
          />
          <Text>{c.refs.sourceNote}</Text>
        </Section>

        <Section
          id="decisions"
          n={7}
          heading="待拍板清单"
          lede="全是从【假设·未定】里挑出来的具体落点，逐条过一遍就能定稿。"
          emphasis
        >
          <ul className="list-disc space-y-1 pl-5">
            {c.decisionChecklist.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Section>
      </div>
    </main>
  );
}
