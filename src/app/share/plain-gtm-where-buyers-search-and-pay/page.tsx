import type { Metadata } from "next";
import "../share.css";
import * as c from "./content";
import {
  Appendix,
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
  Eye,
  Film,
  Hourglass,
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
  LedgerFunnelSvg,
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
          <p className="fg-meta">
            {c.meta.note}{" "}
            <ExtLink href="https://github.com/lizliz404/gtm/blob/main/foundry/proposal.md">
              完整底稿（proposal.md）
            </ExtLink>
          </p>
        </header>

        <div className="fg-top-grid">
          <Takeaway heading="30 秒结论" items={c.takeaway} />
          <Toc items={c.toc} />
        </div>

        <Section
          id="plan"
          n={1}
          heading="进展与近 4 周：素材现成，按周排"
          lede="种子高客单客户已签、新加坡样板单已交付——录屏素材现成，不用等案例再开工。节奏按 W1–W4 排，验收只看付钱。"
          emphasis
        >
          <Steps
            steps={c.nextSteps.map((s, i) => ({
              ...s,
              icon: [BadgeCheck, Film, NotebookPen][i],
            }))}
          />
          <Callout lead={c.paySignal.lead}>{c.paySignal.body}</Callout>
          <LedgerFunnelSvg />
        </Section>

        <Section
          id="start"
          n={2}
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
          <GtmRoutesSwimlaneSvg />
        </Section>

        <Section
          id="decisions"
          n={3}
          heading="风险与待拍板清单"
          lede="风险先摆明面上，每条带对策；要拍板的逐条过完就能收口。"
          emphasis
        >
          <FactDl
            items={c.risks.map((r, i) => ({
              icon: [Hourglass, Store, Eye, Search][i],
              label: r.label,
              value: r.detail,
            }))}
          />
          <ul className="list-disc space-y-2 pl-5">
            {c.decisionChecklist.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Section>

        <Section
          id="boundary"
          n={4}
          heading="边界隔离：国内收钱链 vs 客户海外询盘链"
          lede="两套数据流彻底分开：微信和小店是我们自己在国内获客收钱的工具；客户独立站收到的海外买家询盘直接进客户自己的站点后台与邮箱，绝不经过我们的企业微信。"
        >
          <DualPipelineSvg />
        </Section>

        <Appendix title="备查：对标拆解、应用内搜索机制、五条路子排期依据（3 节证据）">
        <Section
          id="benchmarks"
          n={5}
          heading="对标拆解：四家实测账号，哪些直接抄、哪些是坑"
          lede="证据备查：不看口号，只看他们怎么把流量聚拢到主号、怎么排到搜索前排、怎么收钱。"
        >
          <Cards items={learnCards} />
          <MatrixChoiceSvg />
        </Section>

        <Section
          id="search"
          n={6}
          heading="应用内搜索（AEO）：怎么让挑供应商的陌生老板搜到我们"
          lede="应用内搜索分两场仗：认识你的人搜名字，正在挑供应商的陌生老板搜品类词（「外贸独立站多少钱」「品牌出海 SEO」）。实测样本里，品类词前排点赞只有 1–77，118 赞反而排在后面——拉开差距的是标题词根、认证主体和近期活跃。"
          emphasis
        >
          <SearchMechanismSvg />
        </Section>

        <Section
          id="routes"
          n={7}
          heading="五条路子的排期依据"
          lede="全景图已在 §02；这节只留排期依据与现阶段明确不做的事。五条路子里只有两条 P0：应用内搜索拦截 + 两人四号内容；小店筛客和产业带展会 P1，投流 P2 暂缓。"
        >
          <ChipStrip items={c.routeChips} />
          <Callout tone="quiet" lead={c.notNow.lead}>
            {c.notNow.body}（具体排期可点顶部导航或直达{" "}
            <a href="/share/trade-fairs-2026-2027/" className="fg-ext-link">
              2026.11–2027.10 五城展会判断
            </a>
            ）。
          </Callout>
        </Section>
        </Appendix>
      </div>
    </main>
  );
}
