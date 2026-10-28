import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import {
  Callout,
  Cards,
  CrossNav,
  Section,
  Steps,
  Table,
  Takeaway,
  Toc,
} from "../parts";
import {
  DualPipelineSvg,
  GtmRoutesSwimlaneSvg,
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

        <Section
          id="routes"
          n={1}
          heading="全景拆解：在微信、抖音与产业带场景下，我们到底有哪 5 条路子？"
          lede="跳过「为什么选微信和抖音」的常识，直接把所有能走通的获客路径拆成 5 条泳道：看清每条路子的入口、钩子、承接载体、成交闭环与当前优先级。"
          emphasis
        >
          <GtmRoutesSwimlaneSvg />
          <Cards items={c.routeCards} />
        </Section>

        <Section
          id="search"
          n={2}
          heading="路子 1 深拆（搜商 AEO）：为什么点赞 1–77 的内容排在 118 赞前面？"
          lede="买家在微信搜一搜、抖音搜索框里的行为分两类：搜名字（认识你）和搜品类词（挑供应商）。12 张实测截图揭示了品类词排名的三个决定因子。"
          emphasis
        >
          <SearchMechanismSvg />
          <Table {...c.searchCompare} />
        </Section>

        <Section
          id="matrix"
          n={3}
          heading="路子 2 深拆（IP 与矩阵）：反哺主 IP 的新生代矩阵 vs 关键词堆号"
          lede="个人号本身就可以是品牌。同样是在一个平台上开多个号，为什么 Don't Be Silent 眉清目秀且高转化，而同质化关键词堆号却沦为无效噪音？"
        >
          <Table {...c.matrixComparison} />
          <Callout lead="前端内容即销售筛选器（「付钱的人就是精准的」）">
            当后端觉得「加微信的人都不精准、聊起来极累」时，真正的原因是前端内容的销售能力与边界表达不足。内容端把「我们解决什么、不做什么、价格锚点在哪」呈现得越清晰，不匹配的人越会自动走开；大家都在喊 GEO 和 AI 建站，真正做好交付效果的少之又少，拿实测录屏和排名截图说话就是最硬的差异点。
          </Callout>
        </Section>

        <Section
          id="pipelines"
          n={4}
          heading="路子 3 与承接闭环：小店闪电链，以及「我方获客」与「客户海外询盘」双流解耦"
          lede="最快成交是给观众一个立刻付钱的口子（小店挂咨询/诊断，或企微/对公收款）；同时必须把「我们国内获客」与「客户独立站的海外买家询盘流」彻底分开。"
          emphasis
        >
          <DualPipelineSvg />
        </Section>

        <Section
          id="execution"
          n={5}
          heading="4 周最小验证计划"
          lede="不铺摊子，围绕 P0 主线跑通「认证占位 + 60秒录屏 + 小店/私域收款 + 30天询单记账」闭环。"
        >
          <Steps steps={c.execution.steps} />
        </Section>
      </div>
    </main>
  );
}
