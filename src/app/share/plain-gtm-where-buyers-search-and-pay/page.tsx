import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import {
  Callout,
  Cards,
  ChipStrip,
  CrossNav,
  ExtLink,
  FactDl,
  Section,
  Steps,
  Takeaway,
  Toc,
} from "../parts";
import {
  BadgeCheck,
  Clapperboard,
  Film,
  MessageCircle,
  NotebookPen,
  Phone,
  Search,
  Store,
  Video,
  Wallet,
} from "lucide-react";
import {
  DualPipelineSvg,
  GtmRoutesSwimlaneSvg,
  MatrixChoiceSvg,
  SearchMechanismSvg,
} from "../diagrams";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.summary,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: c.meta.title, description: c.meta.summary },
};

export default function GtmSharePage() {
  const learnCards = c.learnFrom.map((item) => ({
    n: item.n,
    title: item.title,
    meta: item.meta,
    focal: item.focal,
    detail: item.linkHref ? (
      <>
        {item.detail}{" "}
        <ExtLink href={item.linkHref}>{item.linkLabel}</ExtLink>
      </>
    ) : (
      item.detail
    ),
  }));

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
          id="start"
          n={1}
          heading="怎么开动：两人四号、三条内容配比、两个收钱口子"
          lede="起步不铺摊子：两个人、四个号，把真实交付过程拍出来，主页留好加微信和小店下单两个口子。"
          emphasis
        >
          <Steps
            steps={c.startSteps.map((s, i) => ({
              ...s,
              icon: [BadgeCheck, Clapperboard, Store, Phone][i],
            }))}
          />
          <FactDl
            items={[
              {
                icon: Video,
                label: "主阵地",
                value: "抖音 + 视频号，两人共 4 个号；小红书 / B 站只同步",
              },
              {
                icon: Search,
                label: "搜索权益",
                value: "企业微信认证约 ¥300/年，平台明文写「搜索排前」",
              },
              {
                icon: MessageCircle,
                label: "承接",
                value: "主页统一微信号；小店挂付费咨询/诊断筛预算客",
              },
              {
                icon: Wallet,
                label: "报价",
                value: (
                  <>
                    站 / 社媒 / 都选区间稿，未锁死标【假设·未定】，见{" "}
                    <a href="/share/overseas-site-pricing-and-retainer-service/" className="fg-ext-link">
                      定价简报
                    </a>
                  </>
                ),
              },
            ]}
          />
          <Callout lead={c.paySignal.lead}>{c.paySignal.body}</Callout>
        </Section>

        <Section
          id="benchmarks"
          n={2}
          heading="对标拆解：内容、矩阵与收钱链具体学谁"
          lede="我们拆了四类账号的真实后台和搜索表现——不看口号，只看他们怎么把流量聚拢到主号、怎么排到搜索前排、怎么收钱。"
        >
          <Cards items={learnCards} />
          <MatrixChoiceSvg />
        </Section>

        <Section
          id="search"
          n={3}
          heading="应用内搜索（AEO）：怎么让挑供应商的陌生老板搜到我们"
          lede="应用内搜索分两场仗：认识你的人搜名字，正在挑供应商的陌生老板搜品类词（「外贸独立站多少钱」「品牌出海 SEO」）。实测样本里，品类词前排点赞只有 1–77，118 赞反而排在后面——拉开差距的是标题词根、认证主体和近期活跃。"
          emphasis
        >
          <SearchMechanismSvg />
        </Section>

        <Section
          id="routes"
          n={4}
          heading="五条获客路子与排期优先级（全景图）"
          lede="把微信、抖音与线下产业带里的获客办法拉通看，一共就这 5 条路子。先集中火力跑通 P0 的搜索拦截与四人号内容，其余按阶段推进。"
        >
          <ChipStrip items={c.routeChips} />
          <GtmRoutesSwimlaneSvg />
          <Callout tone="quiet" lead={c.notNow.lead}>
            {c.notNow.body}（具体排期可点顶部导航或直达{" "}
            <a href="/share/trade-fairs-2026-2027/" className="fg-ext-link">
              2026.11–2027.10 五城展会判断
            </a>
            ）。
          </Callout>
        </Section>

        <Section
          id="pipelines"
          n={5}
          heading="边界隔离与近 4 周动作：国内收钱链 vs 客户海外询盘链"
          lede="最后必须把两套数据流彻底分开：微信和小店是我们自己在国内获客收钱的工具；客户独立站收到的海外买家询盘直接进客户自己的站点后台与邮箱，绝不经过我们的企业微信。"
        >
          <DualPipelineSvg />
          <Steps
            steps={c.nextSteps.map((s, i) => ({
              ...s,
              icon: [BadgeCheck, Film, NotebookPen][i],
            }))}
          />
        </Section>
      </div>
    </main>
  );
}
