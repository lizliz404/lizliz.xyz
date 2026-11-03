import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";
import "../share.css";
import { Appendix, Callout, ExtLink, Section, Takeaway, Text, Toc } from "../parts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FairDetail } from "./FairDetail";
import { FairExplorer } from "./FairExplorer";
import { fairs, outOfScope, tierClass, tierDashed, type Fair, type Period } from "./fairs";

const meta = {
  title: "广州、上海、深圳、义乌、宁波展会参观指南 2026-11 → 2027-10",
  summary:
    "以观众身份去展会、想见出口工厂、外贸公司和跨境卖家的人：全国外贸展会最密集的五个城市，一年内哪些展值得去、怎么去。",
  note: "信息核对于 2026-10-28（深圳及本轮补漏为 2026-11-02）；日期和票价以官方与购票当天为准。",
};

export const metadata: Metadata = {
  title: meta.title,
  description: meta.summary,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: meta.title, description: meta.summary },
};

const takeaway = [
  "为什么是这五城：广州、上海、深圳、义乌、宁波是全国外贸展会最密集的五个城市。",
  "全年（2026-11 → 2027-10）共 69 场，强 17、中 32；今年剩下约 60 天（11/3 → 12/31）里值得去 13 场，其中最值得专程去的「强」4 场——11/25–27 宁波中小工厂展、11/25–27 义乌跨境电商交易会、12/4–6 上海文具展 Paperworld、12/10–12 义乌外贸工厂展。",
  "其余 9 场「中」看情况或顺路：先用 11/12–14 宁波五金机电展练手（本地、便宜）；12 月深圳物博会 12/2–4（福田）→ DMP 工博会 12/3–6（宝安）可一趟跑两馆。",
  "要注意：11/25 那周宁波、义乌、深圳高交会三场撞期，两人分头或舍一场；11/18–19 APEC 在深圳，那周酒店紧；深圳福田老馆和宝安新馆差 30 公里，别跑错。",
  "怎么去：观众证就够，不印传单，展位里掏笔记本演示。明年春季（3–6 月）展更密，全年清单都在下面年历。",
];

const toc = [
  { id: "takeaway", label: "先看结论" },
  { id: "overview", label: "全年一览" },
  { id: "near", label: "近期 11–12 月" },
  { id: "appendix", label: "备查" },
];

const byPeriod = (p: Period) => fairs.filter((f) => f.period === p);
const isPrimaryFair = (f: Fair) => f.tier === "强" || f.tier === "中";

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

function PeriodFairGroup({ items }: { items: Fair[] }) {
  const primary = items.filter(isPrimaryFair);
  const rest = items.filter((f) => !isPrimaryFair(f));
  if (primary.length === 0) {
    return <FairList items={items} />;
  }
  return (
    <>
      <FairList items={primary} />
      {rest.length > 0 ? (
        <details className="my-3 rounded-lg border border-dashed bg-muted/10 px-4 py-2.5 text-sm">
          <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
            展开查看同期其余 {rest.length} 场（弱相关或不建议专程）
          </summary>
          <FairList items={rest} />
        </details>
      ) : null}
    </>
  );
}

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-sky-700 underline underline-offset-2 dark:text-sky-400">
    {children}
  </a>
);

type Step = { when: string; what: string; who: string; note: ReactNode };

const steps: { group: string; rows: Step[] }[] = [
  {
    group: "每场都做",
    rows: [
      { when: "每场预登记时", what: "「单位」填公司全称", who: "每位参观者", note: "与营业执照一致" },
      { when: "展前 1 周", what: "准备笔记本演示 + 录屏备份", who: "每位参观者", note: "展馆网络普遍不稳，演示要能离线播放" },
      { when: "展前就绪", what: "手机备两张码：微信 + 公开主页", who: "每位参观者", note: "部分展会入场要名片；不发传单时，扫码是主要的留联系方式" },
      { when: "开展前数日", what: "在公开账号预告行程", who: "有公开账号的人", note: "例如「X 月 X 日在 X 展」；能约到的面谈比现场偶遇可靠" },
      { when: "展中", what: "两人同行时一人聊、一人拍，轮换", who: "两人同行时", note: "只在展位内谈；多数展禁止在通道拉客、发资料" },
      { when: "当场", what: "加微信立即备注", who: "每位参观者", note: "哪个展、展位号、对方类型（工厂 / 外贸 / 卖家）、需求、看了哪段演示、A/B/C" },
      { when: "展后当晚起", what: "24–72 小时内分类跟进", who: "每位参观者", note: "A = 可能成交，约拜访；B = 保持联系，发内容；C = 普通关注。附上对方看过的那段录屏" },
      { when: "每场结束后", what: "一页复盘", who: "每位参观者", note: "加了多少人、A 类几个、哪类人愿聊、哪段演示有效，用来决定下一场去不去" },
    ],
  },
  {
    group: "近期（11–12 月）",
    rows: [
      { when: "11/12 前尽早", what: "五金机电观众预登记", who: "每人各自登记", note: <A href="http://www.hardwareexpo.com.cn/h-col-123.html">在线登记（免费）</A> },
      {
        when: "11/25 前",
        what: "中小工厂展预登记 + 打电话问电子名片",
        who: "参观者",
        note: "公众号「中小工厂展」→ 宁波站；0574-87754727 问电子名片能否入场【未核实】",
      },
      {
        when: "11 月中旬前（截止日未公布）",
        what: "义乌跨境观众预登记",
        who: "参观者",
        note: <A href="http://www.yxoexpo.com/article/vistform/k/2.html">预登记入口</A>,
      },
      { when: "12/1 前", what: "义乌外贸工厂展预登记", who: "参观者", note: <A href="http://www.dspfair.com/buyer/gzxz/">观众须知 / 预登记</A> },
      {
        when: "12/4 前",
        what: "上海文具展（Paperworld China）预登记",
        who: "参观者",
        note: <>没查到截止日；<A href="https://paperworldchina.hk.messefrankfurt.com/zh-cn.html">官网</A> · 顺带订高铁票</>,
      },
      {
        when: "去深圳的话",
        what: "先确认馆：福田老馆还是宝安新馆",
        who: "参观者",
        note: "两馆相距约 30 公里；物博会在福田（12/2–4）、DMP 在宝安（12/3–6）、高交会在宝安（11/26–28）",
      },
    ],
  },
  {
    group: "2027 春季",
    rows: [
      {
        when: "3/1 前",
        what: "上海华交会预登记，办采购商证",
        who: "参观者",
        note: <>免费、不看营收，填表就行；现场也能办但要 3 张名片 · <A href="https://www.ecf.org.cn/">ecf.org.cn</A></>,
      },
      {
        when: "3/12 前",
        what: "深圳大湾区跨境展预登记",
        who: "参观者",
        note: <A href="http://www.icbeshow.com/">icbeshow.com</A>,
      },
      {
        when: "3/25 零点前",
        what: "宁波文具礼品展实名预登记",
        who: "参观者",
        note: <>免费，过点 50 元/人；官网或公众号 CNISE-Fair · <A href="https://expo.antway.cn/cnise/content/79">antway</A></>,
      },
      {
        when: "3/30 前",
        what: "CHWE 春（福田）+ 玩具展（宝安）预登记",
        who: "参观者",
        note: <><A href="https://www.chwe.cn/">chwe.cn</A> 免费、现场 49.9；<A href="https://chinatoyfair.com/">chinatoyfair.com</A> 业内观众免费、16 岁以下不得入</>,
      },
      {
        when: "4/25 前",
        what: "深圳礼品展春预登记",
        who: "参观者",
        note: <>一次进场覆盖 GGE 跨境出海、OEM/ODM 源头工厂等同期群 · <A href="https://apr.rxhuabo.com.cn/">励展华博</A></>,
      },
      {
        when: "开展前",
        what: "宁波跨博会实名预登记",
        who: "参观者",
        note: <>姓名、身份证号、手机号 · <A href="https://www.ecee-expo.com/gzzx">观众须知</A></>,
      },
      { when: "6/16 前", what: "广州跨交会：问观众怎么登记", who: "参观者", note: "官网公开的参观联系人：曾女士 13560240173" },
      { when: "6/21 前", what: "义乌电商博览会：查观众登记方式", who: "—", note: "登记方式未公布，可电话 0579-85891888 询问" },
      { when: "等官宣", what: "盯广交会 141 届、中东欧博览会的正式日期", who: "—", note: "两者目前都只有惯例或月份" },
    ],
  },
  {
    group: "2027 夏秋",
    rows: [
      {
        when: "8/18 前",
        what: "深圳 CCBEC 预登记",
        who: "参观者",
        note: <A href="https://www.ccbecexpo.com/">ccbecexpo.com</A>,
      },
      {
        when: "8/25 前",
        what: "CHWE 秋（福田）预登记",
        who: "参观者",
        note: <><A href="https://www.chwe.cn/">chwe.cn</A> 免费、现场 49.9</>,
      },
      {
        when: "10/20 前",
        what: "深圳礼品展秋 + 义博会预登记（同期，二选一或分头）",
        who: "参观者",
        note: <>义博会日期未官宣，按惯例 10/21–24 · <A href="https://www.yiwufair.com/">yiwufair.com</A></>,
      },
      { when: "等官宣", what: "盯义博会 33 届、广交会 142 届正式日期", who: "—", note: "都只有惯例口径" },
    ],
  },
];

const STEP_ROW = "grid gap-x-4 gap-y-1 md:grid-cols-[10rem_minmax(0,1.1fr)_minmax(0,1.6fr)]";

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
  { scene: "深圳 3 天 2 晚 · 平时", how: "栎社 ⇄ 宝安直飞约 2h", price: "量级参考广州【估算，未核价】", note: "两馆相距约 30 公里：福田老馆在市中心，宝安新馆靠近机场" },
  { scene: "近期四趟合计（2 人）", how: "五金机电 + 中小工厂展 + 义乌住 1 晚 + 外贸工厂展", price: "约 1,650–2,800 元", note: "按方案 A 算，不含广州；加上海文具展约 +850–1,000" },
];

const COST_ROW = "grid gap-x-4 gap-y-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,1.4fr)]";

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
  "演示：准备一份可离线播放的录屏，展馆网络差时也能完整演示。",
  "案例：确认哪些客户案例可以公开讲、对方是否同意，完整版放在扫码可看的地方。",
  "二维码与账号：选定展会统一用的微信和公开账号，决定是否提前预告行程。",
  "同期取舍：两场同期（如 11/25–27）时，决定两人一起错峰还是分头。",
  "预登记：逐场查截止日并提前登记；过点可能收费（如宁波文具礼品展 50 元/人）。",
  "入场材料：身份证、名片（或确认电子名片是否可用）、预登记确认短信。",
  "同行与引荐：有没有熟人同去或能介绍展商，提前约好时间。",
];

export default function TradeFairs2026To2027SharePage() {
  return (
    <main id="main-content" className="fg" lang="zh-CN">
      <div className="fg-page fg-wide fg-has-rail">
       <div className="fg-rail-layout">
        <aside>
          <Toc items={toc} variant="rail" />
        </aside>
        <div className="fg-rail-main">
        <header className="fg-head">
          <p className="fg-eyebrow">展会参观指南 · 广州 / 上海 / 深圳 / 义乌 / 宁波</p>
          <h1>{meta.title}</h1>
          <p className="fg-summary">{meta.summary}</p>
          <p className="fg-meta">
            {meta.note}{" "}
            <ExtLink href="https://github.com/lizliz404/project-context/tree/main/events/26.10.26-%E5%B1%95%E4%BC%9A%E5%8F%82%E5%B1%95%E5%B0%BD%E8%B0%83">
              完整尽调材料
            </ExtLink>
          </p>
        </header>

        <div id="takeaway" className="mt-9 scroll-mt-8">
          <Takeaway items={takeaway} />
        </div>

        <Section
          id="overview"
          n={1}
          heading="全年一览 + 每月清单"
          lede="范围是 2026-11 → 2027-10，10 月末的几场一并列入。城市按外贸展会密度取前五：广州、上海、深圳、义乌、宁波。颜色代表「值不值得去」：强 = 值得专门跑一趟，中 = 看情况或顺路，弱 = 只备查，不推荐 = 明确不去。虚线框 = 只有惯例日期或未核实。进场门槛不作筛选，保留在详情里作参考。"
        >
          <FairExplorer fairs={fairs} />
        </Section>

        <Section id="near" n={2} heading="近期：2026-10 末 → 12 月" lede="10 月末的几场已结束或太紧，可以跳过；值得提前准备的节点：11/12、11/25（三城撞同一周）、12/2–4（深圳连场 + 上海文具）、12/10。">
          <PeriodFairGroup items={byPeriod("near")} />
          <div data-slot="clash-plans" className="my-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border p-4 text-sm">
              <p className="mb-1 font-semibold">11/25–28 同期 · 方案 A：两人一起错峰</p>
              <p className="text-muted-foreground">
                11/25 宁波中小工厂展当天回；11/26 07:05 C695 去义乌住 1 晚；11/27 上午看跨境会（14:00 撤展），16:27 C630 / 16:55 C698 回宁波。深圳高交会 11/26–28 也在同一周，要去只能另算一趟。
              </p>
              <p className="mt-2">2 人约 1,050–1,850 元【推断行程】· 两场都能看，保留一人聊、一人拍</p>
            </div>
            <div className="rounded-lg border p-4 text-sm">
              <p className="mb-1 font-semibold">11/25–28 同期 · 方案 B：分头</p>
              <p className="text-muted-foreground">一人在宁波拍，一人去义乌聊；或者一人飞深圳看高交会，但要接受完全不同的客群（科技企业偏多）。</p>
              <p className="mt-2">两边都覆盖 · 少了现场配合</p>
            </div>
          </div>
          <Callout lead="12 月深圳最密" tone="quiet">
            物博会（福田 12/2–4）和 DMP 工博会（宝安 12/3–6）连着跑一周能覆盖两个馆；宁波主馆 12 月只有茶博会（弱），余姚塑博会在 11 月初，日期有两种说法，去之前先看官网。
          </Callout>
        </Section>

        <div id="appendix" className="scroll-mt-8" />
        <Appendix title="备查：2027 春季 / 夏秋完整清单、参观步骤与预登记、费用明细、出发前确认（5 节）">
        <Section id="spring" n={3} heading="2027 春季窗口：3–6 月" lede="1–2 月只有零星的弱相关展。春季能去的展比秋季多：3 月华交会开局，3 月底深圳两馆连轴，4 月广交会一期接深圳礼品展，5–6 月跨境展扎堆。">
          <PeriodFairGroup items={byPeriod("spring")} />
          <Text>
            3 月底到 4 月可以串成一趟大湾区行程：CHWE 3/30–4/2（福田）→ 玩具展 3/31–4/2（宝安）→ 广交会二期 4/23–27（惯例）→ 深圳礼品展 4/25–28（宝安），中间穿插 ITES、CHINAPLAS。
            6 月跨境展扎堆：广州跨交会 6/16–18 和深圳 616 跨境节完全同期（二选一）→ 义乌电商博览会 6/21–23 → 宁波中小工厂展春季 6/23–25（和电商博览会 6/23 重叠一天）。
            广交会 141 届只有惯例日期；有前程的关系/推荐可以直接进，自营正规入口是贸易服务展区参展（最低档贸易服务柜台 22,500 元/9㎡/届，140 届价）。
          </Text>
        </Section>

        <Section id="autumn" n={4} heading="2027 夏秋季：7–10 月" lede="7–8 月不是空档：建博会、百货会、CCBEC、CHWE 秋都在这一段。10 月是年度大展窗口——义博会、广交会 142 届、深圳礼品展秋同一周，但日期多数还没官宣，标虚线的以官网为准。">
          <FairList items={[...byPeriod("summer"), ...byPeriod("autumn")]} />
        </Section>

        <Section id="steps" n={5} heading="参观步骤与预登记" lede="按时间排的动作清单，已有的预登记入口直接给链接。">
          <StepsList />
        </Section>

        <Section id="costs" n={6} heading="费用一眼看" lede="假设 2 人从宁波鄞州出发、按平时价格估算；票价以购票当天为准。">
          <CostList />
          <Text>
            现场对方最想知道的是「凭什么信你」。3 分钟的笔记本演示加一个可公开的完整案例（扫码可看），比印刷品更有说服力。
            评估一趟值不值，除了签单，还可以看：加到的联系人质量、约到的面谈数、产出的内容条数。
          </Text>
        </Section>

        <Section id="open" n={7} heading="参展前确认清单" lede="出发前逐项确认。">
          <ul className="list-disc space-y-2 pl-5">
            {open.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="mt-5 border-t border-dashed pt-2 text-xs text-muted-foreground">
            五城以外的相关展：{outOfScope.join("、")}。标「未核实 / 未官宣 / 推断」的日期和信息，出发前请到官网确认。
          </p>
        </Section>
        </Appendix>
        </div>
       </div>
      </div>
    </main>
  );
}
