import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import {
  Cards,
  CrossNav,
  ExtLink,
  FactDl,
  Metrics,
  Section,
  Table,
  Takeaway,
  Text,
  Toc,
} from "../parts";
import {
  Ban,
  CalendarDays,
  Globe2,
  Megaphone,
  Share2,
} from "lucide-react";
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

  const xingguBarMax = Math.max(...c.xingguQuote.bars.map((b) => b.value));
  const barIcons = {
    "社交 plus": Share2,
    "AI 建站（英文）": Globe2,
    "广告充值": Megaphone,
  } as const;

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
          id="xinggu"
          n={1}
          heading="星谷云 10.30 报价单：先写客观价目"
          lede={c.xingguQuote.source}
          emphasis
        >
          <div
            className="fg-callout"
            style={{ marginBottom: 24 }}
            role="group"
            aria-label="星谷云双11三块金额"
          >
            <p className="fg-callout-lead">双11 合计 ¥120,600（原价 ¥151,500）</p>
            <div className="fg-callout-body" style={{ display: "grid", gap: 12, marginTop: 12 }}>
              {c.xingguQuote.bars.map((b) => {
                const Icon = barIcons[b.label as keyof typeof barIcons];
                return (
                <div key={b.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 4,
                    }}
                  >
                    <strong
                      style={{
                        color: b.focal ? "var(--fg-accent)" : undefined,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {Icon ? (
                        <Icon
                          className="fg-fact-icon"
                          aria-hidden="true"
                          style={{ color: "var(--fg-ink-2)" }}
                        />
                      ) : null}
                      {b.label}
                    </strong>
                    <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                      {b.display}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      borderRadius: 4,
                      background: "rgba(45,49,66,0.08)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(b.value / xingguBarMax) * 100}%`,
                        height: "100%",
                        background: b.focal ? "var(--fg-accent)" : "rgba(75,85,99,0.45)",
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <p className="fg-lede" style={{ marginTop: 6, marginBottom: 0 }}>
                    {b.detail}
                  </p>
                </div>
                );
              })}
            </div>
          </div>
          <FactDl
            items={[
              {
                icon: CalendarDays,
                label: "报价日期",
                value: "2026-10-30 Excel；双11 价至 11 月 11 日",
              },
              {
                icon: Globe2,
                label: "建站卖法",
                value: "按年订阅；表内无一次性建站费行；双11 按两年半打包，降幅全在这一行",
              },
              {
                icon: Megaphone,
                label: "广告构成",
                value: "花费 + 约 30% 服务费 + 6% 税回推；开户费 ¥1,000 另计首次",
              },
              {
                icon: Ban,
                label: "不在包内",
                value: "网站运营 / SEO·GEO 代运营由客户自做（工具开关 ≠ 人做）",
              },
            ]}
          />
          <Table columns={c.xingguQuote.table.columns} rows={c.xingguQuote.table.rows} />
          <Cards items={c.xingguQuote.scopeCards} />
          <Text>{c.xingguQuote.strategyNote}</Text>
        </Section>

        <Section
          id="landscape"
          n={2}
          heading="再按「客户买到什么」分成五类比价"
          lede="把 ¥500 的自助后台和十万级含广告大包混在一根价格条上比高低，结论一定错。星谷云各行已按 Excel 填入；我方档位均标假设。"
        >
          <Table
            columns={["客户买的是什么", "代表玩家与报价（点名称看出处）", "实际交付边界", "对我们定价的含义"]}
            rows={categoryRows}
          />
          <PricingLandscapeSvg />
          <Cards items={c.inquiryNotes} />
        </Section>

        <Section
          id="quadrant"
          n={3}
          heading="竞争定位：首年掏多少钱 × 活是谁干的"
          lede="同一个客户群里，决定价格带的核心变量不是公司规模，而是「客户自己动手」还是「有人替他把活干完」。"
        >
          <CompetitorQuadrantSvg />
          <Text>{c.quadrantNote}</Text>
        </Section>

        <Section
          id="architecture"
          n={4}
          heading="我们的三档方案（全部【假设·未定】）"
          lede="旧草案仍保留便于讨论拆法，但不是对标星谷云 33,600/2.5 年网站包的定稿；主推与金额待案例与成本账齐了再定。"
        >
          <Metrics metrics={c.tiers.metrics} />
          <Table columns={c.tiers.table.columns} rows={c.tiers.table.rows} emphasis={2} />
          <PricingArchitectureSvg />
          <Cards items={c.tiers.guardrails} />
        </Section>

        <Section
          id="ladder"
          n={5}
          heading="本季产能上限与阶梯价（假设·未定）"
          lede="代建和代运营吃的是创始人真实时间；下列数字是工时封顶设想，不是市场成交调研。"
        >
          <CapacityLadderSvg bPoints={c.ladder.bPoints} cPoints={c.ladder.cPoints} />
          <Text>{c.ladder.note}</Text>
        </Section>
      </div>
    </main>
  );
}
