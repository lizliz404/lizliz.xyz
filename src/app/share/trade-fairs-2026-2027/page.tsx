import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";
import "../share.css";
import { Callout, Section, Takeaway, Text, Toc } from "../parts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FairDetail } from "./FairDetail";
import { FairExplorer } from "./FairExplorer";
import { fairs, outOfScope, tierClass, tierDashed, type Fair, type Period } from "./fairs";

const meta = {
  title: "展会尽调 2026-11 → 2027-10 · 宁波 / 义乌 / 广州 / 上海",
  summary:
    "我们俩（宁波深问科技）以观众身份去，不摆摊。2026-11 → 2027-10 宁波、义乌、广州、上海有哪些展、去不去、最少要办哪些事。",
  note: "核对日 2026-10-26 / 27；费用 2026-10-28 按 costs.md 明细对齐。数据来自内部尽调文档，这页只做呈现，不新增事实。本页不对外索引。",
};

export const metadata: Metadata = {
  title: meta.title,
  description: meta.summary,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: meta.title, description: meta.summary },
};

const takeaway = [
  "不摆摊：拿观众证进展位一对一聊；不印东西，直接开电脑演示完整用户旅程。顺带拍内容、见粉丝、加微信。",
  "近期：11/12–14 五金机电练手 → 11/25–27 两个展撞在同一天，二选一 → 12/10–12 义乌外贸工厂展。",
  "2027 春季（3–6 月）能去的比秋季多、门槛也更低：文具礼品展 3/25–27 → 宁波跨博会 5/26–28 → 6 月三场连着（广州跨交会、义乌电商博览会、宁波中小工厂展春季）。",
  "1–2 月和 7–8 月只有零星的弱相关展，都在月份里标了。2027 秋季的年度轮回展还没排期，义博会和广交会 142 届都没官宣。",
  "广州：近期不去。广交会 141 届办不了观众证，服务展区得摆摊，已经定了不摆。",
  "上海：3/1–4 华交会是四城里门槛最低、人群最对口的一场（预登记免费、不看营收），2 人当天高铁往返约 850–1,000 元。",
];

const toc = [
  { id: "overview", label: "全年一览 + 每月清单" },
  { id: "near", label: "近期：2026-10 末 → 12 月" },
  { id: "spring", label: "2027 春季窗口：3–6 月" },
  { id: "autumn", label: "2027 秋季：9–10 月" },
  { id: "steps", label: "最少必要步骤" },
  { id: "costs", label: "费用一眼看" },
  { id: "open", label: "还没定的事" },
];

const byPeriod = (p: Period) => fairs.filter((f) => f.period === p);

const ROW =
  "grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 md:grid-cols-[6.5rem_3rem_minmax(0,1.5fr)_minmax(0,1.15fr)_minmax(0,1fr)_1rem] md:gap-x-4";

/** 分时段列表：一行一场，点开看细节；窄屏自动变卡片。 */
function FairList({ items }: { items: Fair[] }) {
  return (
    <div data-slot="fair-list" className="my-4 overflow-hidden rounded-lg border text-sm">
      <div className={cn(ROW, "hidden bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground md:grid")}>
        <span>日期</span>
        <span>城市</span>
        <span>展会</span>
        <span>建议</span>
        <span>入场 / 截止</span>
        <span />
      </div>
      {items.map((f) => (
        <details key={f.id} className="group border-t first:border-t-0 md:first:border-t">
          <summary
            className={cn(
              ROW,
              "cursor-pointer list-none px-4 py-3 hover:bg-muted/40 [&::-webkit-details-marker]:hidden",
            )}
          >
            <span className="font-medium tabular-nums">{f.dates}</span>
            <span className="text-muted-foreground">{f.city}</span>
            <ChevronDownIcon
              className="col-start-3 row-start-1 mt-0.5 size-4 text-muted-foreground transition-transform group-open:rotate-180 md:col-start-6"
              aria-hidden
            />
            <span className="col-span-3 min-w-0 md:col-span-1 md:col-start-3 md:row-start-1">
              <span className="block font-medium">
                <Badge className={cn("mr-1.5 align-[1px]", f.kind === "exact" ? tierClass[f.tier] : tierDashed[f.tier])}>
                  {f.tier}
                </Badge>
                {f.name}
              </span>
              {f.flags.length ? (
                <span className="mt-1 flex flex-wrap gap-1">
                  {f.flags.map((fl) => (
                    <Badge key={fl} variant="outline" className="border-dashed">
                      {fl}
                    </Badge>
                  ))}
                </span>
              ) : null}
            </span>
            <span className="col-span-3 md:col-span-1 md:col-start-4 md:row-start-1">{f.advice}</span>
            <span
              className={cn(
                "col-span-3 text-muted-foreground md:col-span-1 md:col-start-5 md:row-start-1",
                !f.entry && "hidden md:block",
              )}
            >
              {f.entry ?? "—"}
              {f.deadline ? <span className="block text-xs opacity-80">截止：{f.deadline}</span> : null}
            </span>
          </summary>
          <FairDetail fair={f} className="border-t border-dashed bg-muted/20 px-4 py-3 md:pl-[calc(6.5rem+3rem+3rem)]" />
        </details>
      ))}
    </div>
  );
}

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="text-sky-700 underline underline-offset-2 dark:text-sky-400">
    {children}
  </a>
);

type Step = { when: string; what: string; who: string; note: ReactNode };

const steps: { group: string; rows: Step[] }[] = [
  {
    group: "每场都做",
    rows: [
      { when: "每场预登记时", what: "「单位」填公司全称", who: "Liz / Hanzi", note: "宁波深问科技有限公司 · 91330201MAKMYX2R21" },
      { when: "展前 1 周", what: "笔记本演示完整用户旅程 + 录好屏", who: "两人", note: "询盘站 / 出海云 / Radar 能跑到哪一步，还没试过；展馆网差，先录屏" },
      { when: "展前就绪", what: "手机两张码：微信 + 自媒体主页", who: "两人", note: "不印纸质名片、传单；加上微信顺手关注" },
      { when: "开展前数日", what: "自媒体预告「我们会去」", who: "内容负责人", note: "「X 月 X 日我们在 X 展」，别指望粉丝自己撞上来" },
      { when: "展中", what: "一人聊、一人拍，轮换", who: "Liz + Hanzi", note: "只在展位内低调谈；不在通道拉客、不发资料（各展禁令）" },
      { when: "当场", what: "加微信立即备注", who: "聊天的人", note: "哪个展、展位号、他是哪类人（工厂 / 外贸 / 卖家）、痛点、看了哪段演示、A/B/C" },
      { when: "展后当晚起", what: "24–72 小时内分好类再跟进", who: "两人", note: "A = 可能成交，约拜访；B = 先养着，推内容；C = 当粉丝。附对方看过的那段录屏" },
      { when: "每场结束后", what: "一页复盘", who: "两人", note: "拍了多少、加了多少、A 类几个、哪类人愿聊、哪段演示有效 → 记进内部尽调文档" },
    ],
  },
  {
    group: "近期（11–12 月）",
    rows: [
      { when: "11/12 前尽早", what: "五金机电观众预登记", who: "两人各登", note: <A href="http://www.hardwareexpo.com.cn/h-col-123.html">在线登记（免费）</A> },
      {
        when: "11/25 前",
        what: "中小工厂展预登记 + 打电话问电子名片",
        who: "去宁波的人",
        note: "公众号「中小工厂展」→ 宁波站；0574-87754727 问电子名片能否入场【未核实】",
      },
      {
        when: "11/25 前（截止日未核实）",
        what: "义乌跨境观众预登记",
        who: "选 A/B 后去义乌的人",
        note: <A href="http://www.yxoexpo.com/article/vistform/k/2.html">预登记入口</A>,
      },
      { when: "12/1 前", what: "义乌外贸工厂展预登记", who: "去的人", note: <A href="http://www.dspfair.com/buyer/gzxz/">观众须知 / 预登记</A> },
      {
        when: "12/4 前",
        what: "上海文具展（Paperworld China）预登记",
        who: "去的人",
        note: <>没查到截止日；<A href="https://paperworldchina.hk.messefrankfurt.com/zh-cn.html">官网</A> · 顺带订高铁票</>,
      },
    ],
  },
  {
    group: "2027 春季",
    rows: [
      {
        when: "3/1 前",
        what: "上海华交会预登记，办采购商证",
        who: "去的人",
        note: <>免费、不看营收，填表就行；现场也能办但要 3 张名片 · <A href="https://www.ecf.org.cn/">ecf.org.cn</A></>,
      },
      {
        when: "3/25 零点前",
        what: "宁波文具礼品展实名预登记",
        who: "去的人",
        note: <>免费，过点 50 元/人；官网或公众号 CNISE-Fair · <A href="https://expo.antway.cn/cnise/content/79">antway</A></>,
      },
      {
        when: "开展前",
        what: "宁波跨博会实名预登记",
        who: "去的人",
        note: <>姓名、身份证号、手机号 · <A href="https://www.ecee-expo.com/gzzx">观众须知</A></>,
      },
      { when: "6/16 前", what: "广州跨交会：问观众怎么登记", who: "去广州的人", note: "官网公开的参观联系人：曾女士 13560240173" },
      { when: "6/21 前", what: "义乌电商博览会：查观众登记方式", who: "—", note: "尽调里还没查；电话 0579-85891888" },
      { when: "等官宣", what: "盯广交会 141 届、中东欧博览会的正式日期", who: "—", note: "两者目前都只有惯例或月份" },
    ],
  },
];

const STEP_ROW = "grid gap-x-4 gap-y-0.5 md:grid-cols-[10rem_minmax(0,1.1fr)_minmax(0,1.6fr)]";

function StepsList() {
  return (
    <div data-slot="steps-list" className="my-4 overflow-hidden rounded-lg border text-sm">
      <div className={cn(STEP_ROW, "hidden bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground md:grid")}>
        <span>何时</span>
        <span>做什么 · 谁</span>
        <span>备注 / 链接</span>
      </div>
      {steps.map((g) => (
        <div key={g.group}>
          <div className="border-t bg-muted/20 px-4 py-1.5 text-xs font-semibold tracking-wide">{g.group}</div>
          {g.rows.map((r) => (
            <div key={r.what} className={cn(STEP_ROW, "border-t px-4 py-2.5")}>
              <span className="text-xs font-medium text-muted-foreground tabular-nums md:text-sm md:text-foreground">
                {r.when}
              </span>
              <span>
                <span className="font-medium">{r.what}</span>
                <span className="text-muted-foreground"> · {r.who}</span>
              </span>
              <span className="text-muted-foreground">{r.note}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const costs: { scene: string; how: string; price: string; note: string }[] = [
  { scene: "宁波当天", how: "地铁 5 号线盎孟港 → 会展中心，2 站", price: "约 150–250 元/天", note: "吃快餐 130–170，吃正餐 190–290" },
  { scene: "义乌当天往返", how: "宁波站 ⇄ 义乌站高铁约 2 小时", price: "约 500–650 元", note: "末班直达约 16:55；展馆实际只能待约 10:00–16:00" },
  { scene: "义乌住 1 晚", how: "同上 + 酒店", price: "约 900–1,600 元（平时价）", note: "义博会期间约 1,100–2,000（义乌酒店涨价最狠）" },
  { scene: "上海 · 当天往返", how: "宁波 ⇄ 上海虹桥高铁约 2 小时", price: "约 850–1,000 元", note: "二等座 172 元/人/程；不用订房" },
  { scene: "上海 · 3 天 2 晚", how: "同上 + 龙阳路一带酒店", price: "约 2,000–2,900 元", note: "展期房价上浮没查到，按日常价预留" },
  { scene: "广州 3 天 2 晚 · 平时", how: "栎社 ⇄ 白云直飞约 2h15m", price: "约 2,700–9,400 元", note: "只坐春秋约 3,000–3,800；机票和酒店是大头" },
  { scene: "广州 · 广交会期间住琶洲", how: "同上", price: "约 4,700–17,400 元", note: "琶洲酒店涨 3–5 倍" },
  { scene: "广州 · 广交会期间住远一点", how: "同上，地铁过去", price: "约 3,000–9,500 元", note: "酒店价为【估算】" },
  { scene: "近期四趟合计（2 人）", how: "五金机电 + 中小工厂展 + 义乌住 1 晚 + 外贸工厂展", price: "约 1,650–2,800 元", note: "按方案 A 算，不含广州；加上海文具展约 +850–1,000" },
];

const COST_ROW = "grid gap-x-4 gap-y-0.5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,1.4fr)]";

function CostList() {
  return (
    <div data-slot="cost-list" className="my-4 overflow-hidden rounded-lg border text-sm">
      <div className={cn(COST_ROW, "hidden bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground md:grid")}>
        <span>场景 · 怎么去</span>
        <span>2 人大约</span>
        <span>关键约束</span>
      </div>
      {costs.map((r) => (
        <div key={r.scene} className={cn(COST_ROW, "border-t px-4 py-2.5 first:border-t-0 md:first:border-t")}>
          <span>
            <span className="font-medium">{r.scene}</span>
            <span className="block text-xs text-muted-foreground">{r.how}</span>
          </span>
          <span className="font-medium tabular-nums">{r.price}</span>
          <span className="text-muted-foreground">{r.note}</span>
        </div>
      ))}
    </div>
  );
}

const open = [
  "能拿得出手的案例：自媒体上有没有可以公开的真实客户完整版？哪些客户同意讲？",
  "笔记本演示能跑到哪一步：询盘站、出海云、Radar；离线或网络差怎么办？",
  "展会用哪个平台账号做二维码和预告？要不要提前预告面基？",
  "前程：11 月这几个展去不去、能否同行或引荐、案例能否对外讲？",
  "11/25–27 撞期选方案 A（两人一起错峰）还是 B（分头）？",
];

export default function TradeFairs2026To2027SharePage() {
  return (
    <main id="main-content" className="fg" lang="zh-CN">
      <div className="fg-page fg-wide">
        <header className="fg-head">
          <p className="fg-eyebrow">展会尽调 · 演示稿</p>
          <h1>{meta.title}</h1>
          <p className="fg-summary">{meta.summary}</p>
          <p className="fg-meta">{meta.note}</p>
        </header>

        <Takeaway items={takeaway} />

        <Toc items={toc} />

        <section id="overview" aria-labelledby="overview-h" className="my-10 scroll-mt-6">
          <h2 id="overview-h" className="mb-1 text-xl font-semibold">
            全年一览 + 每月清单
          </h2>
          <p className="mb-4 max-w-[70ch] text-sm text-muted-foreground">
            研究窗口是 2026-11 → 2027-10；10 月末那几场也顺手列进来了。<br />
            颜色就是「值不值得去」：<b>强</b> = 值得专门跑一趟，<b>中</b> = 看情况或顺路，<b>弱</b> = 只备查，划线 = 明确不去。虚线框 = 只有惯例日期或没核实。
            顺序来自内部尽调的优先级表；照同一主办其他届套用的、或者我按人群判断插进来的，会在展名下面标出来。
          </p>
          <FairExplorer fairs={fairs} />
        </section>

        <Section id="near" n={1} heading="近期：2026-10 末 → 12 月" lede="10/29 起这几场就在眼前，去不去都不影响大局；真正要动手的只有四段：11/12、11/25、12/4（上海文具）、12/10。" emphasis>
          <FairList items={byPeriod("near")} />
          <div data-slot="clash-plans" className="my-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border p-4 text-sm">
              <p className="mb-1 font-semibold">11/25–27 撞期 · 方案 A：两人一起</p>
              <p className="text-muted-foreground">
                11/25 宁波中小工厂展当天回；11/26 07:05 C695 去义乌住 1 晚；11/27 上午看跨境会（14:00 撤展），16:27 C630 / 16:55 C698 回宁波。
              </p>
              <p className="mt-2">2 人约 1,050–1,850 元【推断行程】· 保留一人聊、一人拍</p>
            </div>
            <div className="rounded-lg border p-4 text-sm">
              <p className="mb-1 font-semibold">11/25–27 撞期 · 方案 B：分头</p>
              <p className="text-muted-foreground">一人在宁波拍，一人去义乌聊。</p>
              <p className="mt-2">两边都覆盖 · 少了现场配合</p>
            </div>
          </div>
          <Callout lead="12 月宁波" tone="quiet">
            12 月宁波主馆只有茶博会一场（弱）；余姚塑博会在 11 月初，日期有三种说法，去之前先看官网。
          </Callout>
        </Section>

        <Section id="spring" n={2} heading="2027 春季窗口：3–6 月" lede="1–2 月只有零星的弱相关展。春季能去的比秋季多、门槛也更低。开头就是 3/1–4 的上海华交会，宁波是主办方之一。" emphasis>
          <FairList items={byPeriod("spring")} />
          <Text>
            6 月可以连成一个窗口：广州跨交会 6/16–18 → 义乌电商博览会 6/21–23 → 宁波中小工厂展春季 6/23–25（和电商博览会 6/23 重叠一天）。
            广交会 141 届只有惯例日期；服务展区是摆摊路径（最低档贸易服务柜台 22,500 元/9㎡/届，140 届价），Liz 已定不摆。
          </Text>
        </Section>

        <Section id="autumn" n={3} heading="2027 秋季：9–10 月" lede="2027 秋季的年度轮回展（森博、文化用品、外贸工厂展等）到 10/28 为止都还没排期，不是漏查。现在只有原定的三条，日期全是惯例或没核实。">
          <FairList items={byPeriod("autumn")} />
        </Section>

        <Section id="steps" n={4} heading="最少必要步骤" lede="能直接开干的动作；预登记链接已找到的直接给。" emphasis>
          <StepsList />
        </Section>

        <Section id="costs" n={5} heading="费用一眼看" lede="2 人、正常价、出发点鄞州高新区数字智慧园。数字以 costs.md 明细为准，票价以购票当天为准。">
          <CostList />
          <Text>
            现场要回答的其实就一句「凭什么」。不印东西，打开电脑演示完整用户旅程，3 分钟讲个故事；完整案例放自媒体，扫码就能看。
            一趟值不值：内容条数 + 见到几个粉丝或熟人 + 加到的微信质量，不只看签单。
          </Text>
        </Section>

        <Section id="open" n={6} heading="还没定的事" lede="下面这些还没定，等 Liz / Hanzi 拍板或去核实。撞期方案这页不替你们选。">
          <ul className="list-disc space-y-1 pl-5">
            {open.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="mt-5 border-t border-dashed pt-2 text-xs text-muted-foreground">
            范围外（不在四城，不展开）：{outOfScope.join("、")}。标【未核实】【未官宣】【推断】的，都不是已验证事实；原始证据在内部尽调文档（README.md、costs.md）。
          </p>
        </Section>
      </div>
    </main>
  );
}
