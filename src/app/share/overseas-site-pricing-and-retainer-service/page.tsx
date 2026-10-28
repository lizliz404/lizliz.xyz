import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import {
  Bars,
  Cards,
  Columns,
  CrossNav,
  Metrics,
  Section,
  Steps,
  Table,
  Takeaway,
  Text,
  Toc,
} from "../parts";
import {
  CompetitorQuadrantSvg,
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

        <Section
          id="landscape"
          n={1}
          heading="市场价格带与两类购买边界：攒自有资产 vs 租平台流量"
          lede="把同赛道玩家按客户首年掏的钱放在同一张架构图里，先切开「买自己的站」和「租 B2B 平台铺位」，再看低中高三档各自靠什么活。"
          emphasis
        >
          <PricingLandscapeSvg />
          <Cards items={c.landscapeCards} />
          <Bars bars={c.bars} />
        </Section>

        <Section
          id="quadrant"
          n={2}
          heading="竞争定位四象限：客户首年花多少 × 活到底是谁干的"
          lede="删掉没有公开依据的「AI 矩阵深浅」伪维度，只用两个公开可查的硬指标定位：横轴看首年客单价，纵轴看人工交付介入度。"
        >
          <CompetitorQuadrantSvg />
        </Section>

        <Section
          id="architecture"
          n={3}
          heading="Foundry 三档套餐、模块化拆价公式与产品反哺飞轮"
          lede="B 档（¥5,800）是主推锚点，拆成「一次性代建 ¥4,300 + 月维护 ¥500 × 月数」，让任何组合都能当场算清；同时用代建真单喂养后台自动化。"
          emphasis
        >
          <Metrics metrics={c.tiers.metrics} />
          <PricingArchitectureSvg />
          <Table {...c.tiers.table} />
        </Section>

        <Section
          id="ladder"
          n={4}
          heading="容量约束与季度名额阶梯：用真实产能定价"
          lede="两位创始人的时间是硬约束。B 档（整包价）和 C 档（月单价）计量单位不同，分立两张坐标图；名额满即进等候名单或招自己人。"
        >
          <div className="fg-ladder-grid">
            <Columns
              title="B 档代建：按单整包阶梯（本季限 6 单）【假设】"
              subtitle="建站 + 3 个月维护整包价，随本季剩余工时递进"
              points={c.ladder.bPoints}
            />
            <Columns
              title="C 档代运营：按家月费阶梯（同时限 5 家）【假设】"
              subtitle="每期 3 个月，按期初结算；单位为每月单价"
              points={c.ladder.cPoints}
            />
          </div>
          <Text>{c.ladder.note}</Text>
        </Section>

        <Section
          id="guardrails"
          n={5}
          heading="服务型收入的五道风险护栏：管住时间、范围与法务边界"
          lede="高接触服务最怕三件事：年框锁死时间期权、许愿池式范围蔓延、以及口头承诺效果引发退款纠纷。"
        >
          <Cards items={c.guardrails} />
        </Section>

        <Section
          id="calibration"
          n={6}
          heading="真单实测校准路线"
          lede="所有内部自定价与工时上限在未跑完首批样板单前均为【假设】；通过真单记账与竞品暗访完成闭环。"
        >
          <Steps steps={c.calibration.steps} />
        </Section>
      </div>
    </main>
  );
}
