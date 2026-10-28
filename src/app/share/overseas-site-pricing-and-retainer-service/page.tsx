import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import {
  Bars,
  Callout,
  Columns,
  Glossary,
  Matrix,
  Metrics,
  Rows,
  Section,
  Steps,
  Table,
  Takeaway,
  Text,
  Toc,
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
            获客／怎么卖 → <a href="/share/plain-gtm-where-buyers-search-and-pay/">朴素 GTM：人在哪、怎么被搜到、怎么成交</a>
          </p>
        </header>

        <Takeaway items={c.takeaway} />
        <Toc items={c.toc} />

        <Section
          id="compare"
          n={1}
          heading="先说清楚在比什么：谁在打价格战，谁能收钱"
          lede="这张页不是价目表。它回答一个问题：同赛道里，钱在哪一档，我们凭什么收。"
        >
          <Callout lead="同赛道定价">{c.contradiction.callout}</Callout>
          <Text>{c.contradiction.text}</Text>
        </Section>

        <Section
          id="glossary"
          n={2}
          heading="词义：本页用到的每个名词，先定义再使用"
          lede="上一版有几处词没定义就写上了（SKU、AI 矩阵），读者和我自己理解的可能不是一回事。这一节把用到的词固定下来。"
        >
          <Glossary items={c.glossary} />
        </Section>

        <Section
          id="bars"
          n={3}
          heading="同一类货的第一年价：客户要掏多少钱"
          lede="只放同一类：客户最终拿到一个自己的站。不同类的货下一节单列。"
        >
          <Bars bars={c.bars} />
          <Text>{c.barsText}</Text>
        </Section>

        <Section
          id="platform"
          n={4}
          heading="不同类的货：平台会员，单列不混排"
          lede="买平台会员是租平台内的流量，买独立站是攒自己的资产。数字能放一起，意思不能。"
        >
          <Table columns={c.platformMembers.columns} rows={c.platformMembers.rows} />
          <Text>{c.platformMembers.text}</Text>
        </Section>

        <Section
          id="map"
          n={5}
          heading="对手地图：客户第一年花多少，活是谁干的"
          lede="纵轴从「AI 深浅」换成了「活是谁干的」——前者没有公开依据，后者能从公开定价和定位读出来。"
        >
          <Matrix
            x={c.matrix.x}
            y={c.matrix.y}
            points={c.matrix.points}
            legendHeading={c.matrix.legendHeading}
          />
          <Text>{c.matrix.text}</Text>
        </Section>

        <Section
          id="tiers"
          n={6}
          heading="Foundry 三档：怎么付钱、包含什么、不包含什么"
          lede="B 是主推档，也是唯一一个能拆开算的：建站 ¥4,300 + 维护 ¥500/月 × 3。"
        >
          <Metrics metrics={c.tiers.metrics} />
          <Table {...c.tiers.table} />
          <Text>{c.tiers.tableText}</Text>
        </Section>

        <Section
          id="ladder"
          n={7}
          heading="名额与阶梯价：为什么后来的人更贵"
          lede="产能是硬的，所以价格随名额往上走。B 和 C 分开看——一个是整包价，一个是月费。"
        >
          <p className="fg-subhead">B 代建：一单一个整包价</p>
          <Columns points={c.ladder.bPoints} />
          <Text>{c.ladder.bText}</Text>
          <p className="fg-subhead">C 代运营：一家一个月单价</p>
          <Columns points={c.ladder.cPoints} />
          <Text>{c.ladder.cText}</Text>
          <Text>{c.ladder.text}</Text>
        </Section>

        <Section
          id="risk"
          n={8}
          heading="隐藏成本和风险：按对我们的影响排序"
          lede="只列真的会影响交付和现金流的那几条。"
        >
          <Table columns={c.risks.columns} rows={c.risks.rows} />
          <Text>{c.risks.text}</Text>
        </Section>

        <Section
          id="next"
          n={9}
          heading="接下来要拍板的事，以及先做什么"
          lede="现在所有的自定价都是【假设】。顺序是：先谈边界，再用真单校准。"
        >
          <Steps steps={c.next.steps} />
          <Rows heading="待拍板" rows={c.next.decisions} />
        </Section>
      </div>
    </main>
  );
}
