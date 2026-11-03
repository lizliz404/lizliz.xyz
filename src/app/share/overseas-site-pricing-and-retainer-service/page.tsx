import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import {
  Appendix,
  Callout,
  CrossNav,
  ExtLink,
  FactDl,
  Rows,
  Section,
  Table,
  Takeaway,
  Text,
  Toc,
} from "../parts";
import {
  CircleCheck,
  Flag,
  Handshake,
  NotebookPen,
  TriangleAlert,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.summary,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: c.meta.title, description: c.meta.summary },
};

const statusIcons = [CircleCheck, TriangleAlert, Flag];

function tierTable(rows: c.TierRow[]) {
  return rows.map((r) => [
    r.tag ? `${r.tier}（${r.tag}）` : r.tier,
    r.price,
    r.scope,
  ]);
}

export default function PricingSharePage() {
  return (
    <main id="main-content" className="fg" lang="zh-CN">
      <div className="fg-page">
        <CrossNav current="pricing" />

        <header className="fg-head">
          <p className="fg-eyebrow">{c.meta.eyebrow}</p>
          <h1>{c.meta.title}</h1>
          <p className="fg-summary">{c.meta.summary}</p>
          <p className="fg-meta">
            {c.meta.note}{" "}
            <ExtLink href={c.appendixLinks.narrative}>叙事 SoT（research）</ExtLink>
          </p>
        </header>

        <div className="fg-top-grid">
          <Takeaway heading={c.takeawayHeading} items={c.takeaway} />
          <Toc items={c.toc} />
        </div>

        <FactDl
          items={c.statusRows.map((row, i) => ({
            icon: statusIcons[i],
            label: row.label,
            value: row.value,
          }))}
        />

        <Section
          id="build"
          n={1}
          heading={c.buildSection.heading}
          lede={c.buildSection.lede}
        >
          <div className="fg-metrics">
            {c.buildSection.rows.map((row) => (
              <div key={row.label} className="fg-card fg-metric">
                <div className="fg-metric-top">
                  <span className="fg-metric-label">{row.label}</span>
                </div>
                <div className="fg-metric-value" style={{ fontSize: "1.35rem" }}>
                  {row.value}
                </div>
                <div className="fg-metric-detail">{row.note}</div>
              </div>
            ))}
          </div>
          <Callout lead="所以呢">{c.buildSection.soWhat}</Callout>
        </Section>

        <Section
          id="retainer"
          n={2}
          heading={c.retainerSection.heading}
          lede={c.retainerSection.lede}
        >
          <div className="fg-metrics">
            {c.retainerSection.rows.map((row) => (
              <div key={row.label} className="fg-card fg-metric">
                <div className="fg-metric-top">
                  <span className="fg-metric-label">{row.label}</span>
                </div>
                <div className="fg-metric-value" style={{ fontSize: "1.35rem" }}>
                  {row.value}
                </div>
                <div className="fg-metric-detail">{row.note}</div>
              </div>
            ))}
          </div>
          <Callout lead="所以呢">{c.retainerSection.soWhat}</Callout>
        </Section>

        <Section
          id="social"
          n={3}
          heading={c.socialSection.heading}
          lede={c.socialSection.lede}
        >
          <div className="fg-metrics">
            {c.socialSection.rows.map((row) => (
              <div key={row.label} className="fg-card fg-metric">
                <div className="fg-metric-top">
                  <span className="fg-metric-label">{row.label}</span>
                </div>
                <div className="fg-metric-value" style={{ fontSize: "1.35rem" }}>
                  {row.value}
                </div>
                <div className="fg-metric-detail">{row.note}</div>
              </div>
            ))}
          </div>
          <Callout lead="所以呢">{c.socialSection.soWhat}</Callout>
        </Section>

        <Section
          id="hang"
          n={4}
          heading="建议挂牌：两大块各三档；都选相加再打折"
          lede="下表数字除建站引流 ¥999 曾口头外，全部【建议·待拍】。档位＝服务强度，不用隐藏难度旋钮拉宽区间。"
        >
          <p
            className="fg-metric-label"
            style={{ margin: "0 0 12px", fontSize: "1.05rem", color: "var(--fg-fg, #14181f)" }}
          >
            独立站
          </p>
          <Table
            columns={["档位", "建议价", "大概包含"]}
            rows={tierTable(c.siteTiers)}
          />
          <p
            className="fg-metric-label"
            style={{ margin: "28px 0 12px", fontSize: "1.05rem", color: "var(--fg-fg, #14181f)" }}
          >
            海外社媒
          </p>
          <Table
            columns={["档位", "建议价", "大概包含"]}
            rows={tierTable(c.socialTiers)}
          />
          <Callout lead="Combo">{c.comboNote}</Callout>

          <p
            className="fg-metric-label"
            style={{ margin: "28px 0 12px", fontSize: "1.05rem", color: "var(--fg-fg, #14181f)" }}
          >
            待拍板（逐条过完即可定稿）
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {c.decisionChecklist.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Section>

        <Appendix title="备查：谈判锚、JD 摘要与出处">
          <Section
            id="negotiate"
            n={5}
            heading="谈判三句"
            lede="对方报什么价，先拆他买到的是什么。"
          >
            <Rows
              heading="按腿拆开说"
              rows={c.negotiationAnchors.map((b) => ({
                title: b.title,
                detail: b.detail,
              }))}
            />
          </Section>

          <Section
            id="jd"
            n={6}
            heading="JD 里一个人通常怎么写"
            lede="客户心里的外包上限，来自「自己招一个人要多少」。"
          >
            <FactDl
              items={[
                {
                  icon: Users,
                  label: c.jdSummary[0].title,
                  value: c.jdSummary[0].detail,
                },
                {
                  icon: Handshake,
                  label: c.jdSummary[1].title,
                  value: c.jdSummary[1].detail,
                },
                {
                  icon: NotebookPen,
                  label: c.jdSummary[2].title,
                  value: c.jdSummary[2].detail,
                },
              ]}
            />
          </Section>

          <Section
            id="sources"
            n={7}
            heading="出处（深挖去 research）"
            lede="本页只留结论；验算与 URL 表在 gtm research。"
          >
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <ExtLink href={c.appendixLinks.narrative}>叙事 SoT</ExtLink>
              </li>
              <li>
                <ExtLink href={c.appendixLinks.build}>一次建站 WTP</ExtLink>
              </li>
              <li>
                <ExtLink href={c.appendixLinks.retainer}>
                  站月运与社媒 agency WTP
                </ExtLink>
              </li>
              <li>
                <ExtLink href={c.appendixLinks.jd}>社媒 JD 薪资 33 条</ExtLink>
              </li>
            </ul>
            <Text>{c.sourceNote}</Text>
          </Section>
        </Appendix>
      </div>
    </main>
  );
}
