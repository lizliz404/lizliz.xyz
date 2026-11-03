import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  BriefcaseBusiness,
  ChevronDownIcon,
  CircleCheck,
  Flag,
  NotebookPen,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import "../share.css";
import { Appendix, Callout, ExtLink, FactDl, Section, Table, Takeaway, Text, Toc } from "../parts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FairDetail } from "./FairDetail";
import { FairExplorer } from "./FairExplorer";
import { fairs, outOfScope, tierClass, tierDashed, type Fair, type Period } from "./fairs";

const meta = {
  title: "广州、上海、深圳、义乌、宁波展会参观指南 2026-11 → 2027-10",
  summary:
    "为什么是这五城 → 五城里砍到强／优约 21 场 → 今年／明年切开 → 准备什么 → 决赛圈预算高低因 → 我们去的定位与收益。中、弱、不推荐并进备查，不抢主视线。",
  note: "信息核对于 2026-10-28（深圳及本轮补漏为 2026-11-02）；t306 按人流升强补录 SCF／华礼／AWE／工博会为 2026-11-03。日期和票价以官方与购票当天为准。「优」= 数据里的「强」。进场门槛不作筛选（有前程关系／推荐可进）。人流量与观众质量权重大于距离。",
};

export const metadata: Metadata = {
  title: meta.title,
  description: meta.summary,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: meta.title, description: meta.summary },
};

const takeaway = [
  "为什么是这五城：广州、上海、深圳、义乌、宁波——全国外贸展会最密集、各方往来最活跃的五个城市。不是「我们住哪」，是「展最多、人最多」；东莞拿掉，换成离我们更近的义乌。",
  "五城里公开能查到的展先全收进来，再按人流量与观众质量为主分级（距离权重低）。决策面只看强／优：全年约 73 场里砍到 21 场（中约 32、弱与不推荐并进备查，主日历默认不画它们）。品类太窄、太小的不进决赛圈；流量确实大的上海跨博会／华礼／AWE／工博会已补进强。",
  "以明年开年切开：今年还剩 4 场优——11/25–27 宁波中小工厂展、11/25–27 义乌跨境交易会、12/4–6 上海文具展、12/10–12 义乌外贸工厂展；明年开年之后 17 场优（实操从 2027-03 起，含 AWE、SCF＋华礼、工博会等）。",
  "无论去哪：我们自己最需要先备好可公开讲的客户案例，以及能当场讲清的业务经验——不印传单，靠 3 分钟演示回答「凭什么」。预登记、身份证、离线演示、微信备注、24–72 小时跟进照做；进场门槛不作筛选（有前程关系／推荐可进）。",
  "决赛圈预算（2 人、观众路径）：最低是宁波本地优展，约 150–250 元/天（不用出城）；最高是广交会住琶洲，约 4,700–17,400 元/趟（机票 + 展期酒店暴涨）。中间带：义乌住 1 晚约 900–1,600，上海 3 天 2 晚约 2,000–2,900，广州／深圳平时约 2,700–9,400（深圳【假设·未定】）。无论去哪一场，预算大致落在「宁波一天」到「广交会琶洲一趟」之间。",
];

const toc = [
  { id: "takeaway", label: "先看结论" },
  { id: "you-split", label: "优展：今年 / 明年" },
  { id: "prep", label: "去之前准备什么" },
  { id: "you-budget", label: "决赛圈预算" },
  { id: "position", label: "定位 · 目标 · 收益" },
  { id: "overview", label: "强展年历" },
  { id: "appendix", label: "备查" },
];

const byPeriod = (p: Period) => fairs.filter((f) => f.period === p);
const isPrimaryFair = (f: Fair) => f.tier === "强";
/** 优 = 强。切开：今年还剩 = 2026 年内；明年开年后 = 2027-01 起（优展实际从 3 月起）。 */
const youFairs = fairs.filter((f) => f.tier === "强");
const fairStart = (f: Fair) => f.spans[0]?.[0] ?? (f.month ? `${f.month}-01` : "9999");
const youThisYear = youFairs
  .filter((f) => fairStart(f).startsWith("2026"))
  .sort((a, b) => fairStart(a).localeCompare(fairStart(b)));
const youNextYear = youFairs
  .filter((f) => !fairStart(f).startsWith("2026"))
  .sort((a, b) => fairStart(a).localeCompare(fairStart(b)));

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
            展开备查：同期其余 {rest.length} 场（中／弱／不优先）
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
  "客户案例（最优先）：至少 1–2 个可公开讲的完整版放上主页；现场只用 3 分钟缩略版。用前程等客户案例前先征得同意。",
  "业务经验（最优先）：按工厂 / 外贸公司 / 跨境卖家各准备一套「先问什么 → 演示哪段」口述，能当场回答凭什么。",
  "演示：笔记本 3 分钟用户旅程 + 可离线录屏备份（展馆网络差时也能讲完）。",
  "二维码与账号：微信 / 企微 + 公开主页；是否提前在公开账号预告行程。",
  "同期取舍：两场同期（如 11/25–27）时，决定两人一起错峰还是分头。",
  "预登记：逐场查截止日并提前登记；过点可能收费（如宁波文具礼品展 50 元/人、CHWE 现场 49.9 元/人）。",
  "入场材料：身份证、名片（或确认电子名片是否可用）、预登记确认短信。",
  "同行与引荐：有没有熟人同去或能介绍展商，提前约好时间。",
];

/** 21 场优展预算行：票价来自官方/须知；行程带来自 costs.md。深圳未核价标假设。t306 补 SCF／华礼／AWE／CIIF。 */
const youBudgetRows: string[][] = [
  ["1", "宁波中小工厂展", "11/25–27", "免费（须身份证+名片口径）", "本地当天×1–3 天", "约 150–250 元/天"],
  ["2", "义乌跨境交易会", "11/25–27", "预登记免费；截止未公布", "住 1 晚（或与宁波错峰）", "约 900–1,600 元"],
  ["3", "上海文具展 Paperworld", "12/4–6", "预登记（截止未查到）", "当天或 3 天 2 晚", "当天约 850–1,000；3 天 2 晚约 2,000–2,900"],
  ["4", "义乌外贸工厂展", "12/10–12", "免费参观证；建议 12/1 前登记", "住 1 晚", "约 900–1,600 元"],
  ["5", "上海华交会", "3/1–4", "预登记免费", "当天或 3 天 2 晚", "当天约 850–1,000；3 天 2 晚约 2,000–2,900"],
  ["6", "上海 AWE", "3/17–20", "官网／公众号／小程序预登记", "当天或 3 天 2 晚", "当天约 850–1,000；3 天 2 晚约 2,000–2,900"],
  ["7", "深圳 CHWE 春", "3/30–4/2", "预登记免费；现场 49.9 元/人", "3 天 2 晚，可与玩具展串", "约 2,700–9,400【假设·未定】"],
  ["8", "深圳玩具展", "3/31–4/2", "业内观众免费登记", "与 CHWE 串馆", "并入深圳趟【假设·未定】"],
  ["9", "广交会 141 春", "惯例 4–5 月", "采购商证常见 300 元/人/天+工本（门槛高）；关系/贸易服务区另计", "3 天 2 晚", "住远约 3,000–9,500；住琶洲约 4,700–17,400"],
  ["10", "深圳礼品展春", "4/25–28", "预登记", "3 天 2 晚", "约 2,700–9,400【假设·未定】"],
  ["11", "宁波跨博会", "5/26–28", "实名预登记免费", "本地当天×1–3", "约 150–250 元/天"],
  ["12", "上海跨博会 SCF", "6/10–12", "预登记（官网）", "当天或 3 天 2 晚；可与华礼同趟", "当天约 850–1,000；3 天 2 晚约 2,000–2,900"],
  ["13", "上海华礼展", "6/10–12", "预登记（同期群）", "与 SCF 同趟", "并入 SCF 趟"],
  ["14", "广州跨交会", "6/16–18", "参观登记（公开价按免费估）【待确认】", "3 天 2 晚平时", "约 2,700–9,400"],
  ["15", "宁波中小工厂展春", "6/23–25", "公众号预登记口径", "本地", "约 150–250 元/天"],
  ["16", "上海百货会", "7/22–24", "预登记", "当天或 3 天 2 晚", "当天约 850–1,000；3 天 2 晚约 2,000–2,900"],
  ["17", "深圳 CCBEC", "8/18–20", "预登记", "3 天 2 晚", "约 2,700–9,400【假设·未定】"],
  ["18", "上海工博会 CIIF", "9/20–24", "预登记（以官核为准）", "3–4 天住虹桥／徐泾一带", "约 2,000–3,500【推断·未单核展期房价】"],
  ["19", "深圳礼品展秋", "10/20–23", "预登记", "3 天 2 晚；与义博会近同期", "约 2,700–9,400【假设·未定】"],
  ["20", "义博会 33", "惯例 10/21–24", "境内预登记免费", "住 1–3 晚（展期涨价）", "住 1 晚约 1,100–2,000"],
  ["21", "广交会 142 秋", "惯例 10 月", "同春；日期未官宣", "3 天 2 晚", "同春广交会带"],
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
            <ExtLink href="https://github.com/lizliz404/gtm/blob/main/foundry/research/trade-fairs-report-arc-strong-only-20261103.md">
              汇报弧 · 只看强
            </ExtLink>
            {" · "}
            <ExtLink href="https://github.com/lizliz404/gtm/blob/main/foundry/research/trade-fairs-you-prep-budget-20261103.md">
              优展 / 准备 / 预算调研
            </ExtLink>
            {" · "}
            <ExtLink href="https://github.com/lizliz404/project-context/tree/main/events/26.10.26-%E5%B1%95%E4%BC%9A%E5%8F%82%E5%B1%95%E5%B0%BD%E8%B0%83">
              完整尽调材料
            </ExtLink>
          </p>
        </header>

        <div id="takeaway" className="mt-9 scroll-mt-8">
          <Takeaway items={takeaway} />
        </div>

        <FactDl
          items={[
            {
              icon: CircleCheck,
              label: "进展",
              value: "汇报弧已按「五城 → 只看强／优 → 今年／明年 → 准备 → 预算高低因 → 定位收益」重排；年历默认只画强档，中／弱／不推荐并进备查。",
            },
            {
              icon: TriangleAlert,
              label: "风险",
              value: "11/25 三城撞期；APEC 周深圳酒店紧；福田/宝安馆距约 30 公里；广交会与义博会酒店暴涨；深圳机票房价仍未核；全量普查仍可再补。",
            },
            {
              icon: Flag,
              label: "待拍板",
              value: "① 11/25 错峰还是分头；② 明年 17 场缩到哪 8–10 场真去；③ 可公开案例与客户同意；④ 是否补核深圳票价。",
            },
          ]}
        />

        <Section
          id="you-split"
          n={1}
          heading={`决赛圈 ${youFairs.length} 场：今年还剩 ${youThisYear.length}，明年开年后 ${youNextYear.length}`}
          lede="五城公开展收齐后按人流量与观众质量为主砍到强／优——「优」就是数据里的「强」，值得专门跑一趟；距离不挡升强。中、弱不进主视线。切开点是明年开年（公历年初；2027 春节 2/6，1–2 月几乎无外贸向优展，明年优展实际从 3 月排起）。"
        >
          <div className="my-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-5 text-sm leading-[1.7]">
              <p className="text-lg font-semibold text-foreground">今年还剩 · {youThisYear.length} 场</p>
              <p className="mt-1 text-muted-foreground">2026-11-03 → 12-31</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                {youThisYear.map((f) => (
                  <li key={f.id}>
                    <span className="font-medium tabular-nums">{f.dates}</span>
                    <span className="text-muted-foreground"> · {f.city} · </span>
                    {f.name}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-muted-foreground">
                11/25 宁波中小工厂展与义乌跨境交易会撞期；同周还有深圳高交会。两人可错峰或分头，见备查近期方案。
              </p>
            </div>
            <div className="rounded-lg border p-5 text-sm leading-[1.7]">
              <p className="text-lg font-semibold text-foreground">明年开年之后 · {youNextYear.length} 场</p>
              <p className="mt-1 text-muted-foreground">2027-03 → 10（1–2 月无优展）</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                {youNextYear.map((f) => (
                  <li key={f.id}>
                    <span className="font-medium tabular-nums">{f.dates}</span>
                    <span className="text-muted-foreground"> · {f.city} · </span>
                    {f.short || f.name}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-muted-foreground">
                不可能 17 场都去。拍板时先定 8–10 场真预算；6 月 SCF＋华礼同趟，10 月义博会、礼品展秋、广交会秋近同期，要二选一或分头。
              </p>
            </div>
          </div>
        </Section>

        <Section
          id="prep"
          n={2}
          heading="无论去哪都要准备：我们最需要客户案例 + 业务经验"
          lede="通用动作每场都做；真正决定「凭什么信你」的，是能公开讲的案例和能当场讲清的经验。不印传单，展位里打开笔记本演示 3 分钟用户旅程，完整故事放在扫码后的主页上。"
        >
          <div className="my-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-emerald-600/30 bg-emerald-50/40 p-5 text-sm leading-[1.7] dark:bg-emerald-950/20">
              <p className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <BriefcaseBusiness className="size-5" aria-hidden />
                我们自己 · 最优先
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <span className="font-medium">客户案例</span>
                  ：至少 1–2 个完整版上主页；现场只用缩略版。用前程等客户案例前先征得同意。
                </li>
                <li>
                  <span className="font-medium">业务经验</span>
                  ：工厂 / 外贸公司 / 跨境卖家各一套「先问什么 → 演示哪段」，能答询盘从哪来、回复要多久、图谁做。
                </li>
              </ul>
            </div>
            <div className="rounded-lg border p-5 text-sm leading-[1.7]">
              <p className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <NotebookPen className="size-5" aria-hidden />
                每场通用
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>预登记（单位填营业执照全称）；查截止日</li>
                <li>身份证；部分展要名片——电子名片能否过提前电话确认</li>
                <li>离线可播的演示录屏；微信 + 主页两张码</li>
                <li>两人时一人聊、一人拍；当场备注 A/B/C；24–72 小时跟进；一页复盘</li>
              </ul>
            </div>
          </div>
          <Callout lead="没有案例和经验口述" tone="quiet">
            去再优的展也只是逛。预算表再准，也换不成询盘。出发前确认清单见备查末节。
          </Callout>
        </Section>

        <Section
          id="you-budget"
          n={3}
          heading="决赛圈预算：最低与最高，以及中间带"
          lede="按 2 人、从宁波鄞州出发、观众证路径、不印物料估算。票/注册能查到官方的写官方；行程带来自尽调 costs.md。深圳机票房价未核，标【假设·未定】。"
        >
          <div className="my-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-emerald-600/30 bg-emerald-50/40 p-5 text-sm leading-[1.7] dark:bg-emerald-950/20">
              <p className="text-lg font-semibold text-foreground">最低 · 宁波本地优展</p>
              <p className="mt-1 font-medium tabular-nums">约 150–250 元/天（2 人）</p>
              <p className="mt-2 text-muted-foreground">
                为什么低：不出城，地铁到会展中心，不用机票酒店。覆盖：中小工厂展（今秋／明春）、跨博会等。
              </p>
            </div>
            <div className="rounded-lg border border-amber-600/30 bg-amber-50/40 p-5 text-sm leading-[1.7] dark:bg-amber-950/20">
              <p className="text-lg font-semibold text-foreground">最高 · 广交会住琶洲</p>
              <p className="mt-1 font-medium tabular-nums">约 4,700–17,400 元/趟（2 人 · 3 天 2 晚）</p>
              <p className="mt-2 text-muted-foreground">
                为什么高：宁波飞广州机票是大头，展期琶洲酒店涨 3–5 倍；若走正式采购商证还可能加证费。住远一点地铁过去可压到约 3,000–9,500。
              </p>
            </div>
          </div>
          <div className="my-4 flex items-start gap-3 rounded-lg border p-4 text-sm leading-[1.7]">
            <Wallet className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
            <div>
              <p className="font-medium">中间带 · 无论去哪一场的大致区间</p>
              <p className="mt-1 text-muted-foreground">
                义乌当天 500–650 / 住 1 晚 900–1,600（义博会 1,100–2,000）· 上海当天 850–1,000 / 3 天 2 晚 2,000–2,900 · 广州平时或深圳【假设·未定】约 2,700–9,400。整体：从「宁波一天」到「广交会琶洲一趟」。今年 4 场都去（错峰宁波+义乌跨境，再加上海文具、义乌工厂展）粗算约 3,200–6,000 元【推断叠加，未含高交会】。
              </p>
            </div>
          </div>
          <Table
            columns={["#", "展会", "日期", "票 / 注册", "建议行程", "2 人大约"]}
            rows={youBudgetRows}
          />
          <Text>
            更深的验算、车次和酒店出处见{" "}
            <ExtLink href="https://github.com/lizliz404/project-context/blob/main/events/26.10.26-%E5%B1%95%E4%BC%9A%E5%8F%82%E5%B1%95%E5%B0%BD%E8%B0%83/costs.md">
              costs.md
            </ExtLink>
            ；本轮整理表见{" "}
            <ExtLink href="https://github.com/lizliz404/gtm/blob/main/foundry/research/trade-fairs-you-prep-budget-20261103.md">
              GTM 调研
            </ExtLink>
            。
          </Text>
        </Section>

        <Section
          id="position"
          n={4}
          heading="我们去展上做什么：定位 · 目标 · 收益"
          lede="很难算成一张精确 ROI 表，但可以先说清楚。下列全部标【推断】，来自尽调 README 的 P1–P3 与多线目标，不是已验证数字。"
        >
          <div className="my-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-5 text-sm leading-[1.7]">
              <p className="text-lg font-semibold text-foreground">定位</p>
              <p className="mt-2 text-muted-foreground">
                观众身份进场，不摆摊。展位里打开笔记本讲 3 分钟用户旅程；完整案例在扫码后的主页上。轻资产接触工厂／外贸／跨境卖家。【推断】
              </p>
            </div>
            <div className="rounded-lg border p-5 text-sm leading-[1.7]">
              <p className="text-lg font-semibold text-foreground">目标</p>
              <p className="mt-2 text-muted-foreground">
                多线并行，不赌「唯一主线」：拍内容、粉丝面基、建联客资。签单预期放低——信任要时间。【推断】
              </p>
            </div>
            <div className="rounded-lg border p-5 text-sm leading-[1.7]">
              <p className="text-lg font-semibold text-foreground">收益怎么看</p>
              <p className="mt-2 text-muted-foreground">
                一趟值不值，看联系人质量、约到的面谈、产出的内容条数，不单看当场签单。展会本身也是下一条内容的素材。【推断】
              </p>
            </div>
          </div>
          <Callout lead="没有案例和经验口述" tone="quiet">
            定位再清楚也换不成询盘。出发前确认清单见备查末节。
          </Callout>
        </Section>

        <Section
          id="overview"
          n={5}
          heading="强／优年历（默认只看决赛圈）"
          lede="范围 2026-11 → 2027-10。主视图默认只画强／优；中、弱、不推荐并进「备查／不优先」，点展开后仍保留各自旧配色。虚线框 = 惯例日期或未核实。进场门槛不作筛选，细节里可看。"
        >
          <FairExplorer fairs={fairs} />
        </Section>

        <div id="appendix" className="scroll-mt-8" />
        <Appendix title="备查：中／弱／不优先清单、撞期方案、参观步骤、费用总表、出发前确认">
        <Section id="near" n={6} heading="近期：2026-10 末 → 12 月" lede="10 月末的几场已结束或太紧，可以跳过；值得提前准备的节点：11/12、11/25（三城撞同一周）、12/2–4（深圳连场 + 上海文具）、12/10。">
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

        <Section id="spring" n={7} heading="2027 春季窗口：3–6 月" lede="1–2 月只有零星的弱相关展。春季能去的展比秋季多：3 月华交会开局，3 月底深圳两馆连轴，4 月广交会一期接深圳礼品展，5–6 月跨境展扎堆。">
          <PeriodFairGroup items={byPeriod("spring")} />
          <Text>
            3 月底到 4 月可以串成一趟大湾区行程：CHWE 3/30–4/2（福田）→ 玩具展 3/31–4/2（宝安）→ 广交会二期 4/23–27（惯例）→ 深圳礼品展 4/25–28（宝安），中间穿插 ITES、CHINAPLAS。
            6 月跨境展扎堆：广州跨交会 6/16–18 和深圳 616 跨境节完全同期（二选一）→ 义乌电商博览会 6/21–23 → 宁波中小工厂展春季 6/23–25（和电商博览会 6/23 重叠一天）。
            广交会 141 届只有惯例日期；有前程的关系/推荐可以直接进，自营正规入口是贸易服务展区参展（最低档贸易服务柜台 22,500 元/9㎡/届，140 届价）。
          </Text>
        </Section>

        <Section id="autumn" n={8} heading="2027 夏秋季：7–10 月" lede="7–8 月不是空档：建博会、百货会、CCBEC、CHWE 秋都在这一段。10 月是年度大展窗口——义博会、广交会 142 届、深圳礼品展秋同一周，但日期多数还没官宣，标虚线的以官网为准。">
          <PeriodFairGroup items={[...byPeriod("summer"), ...byPeriod("autumn")]} />
        </Section>

        <Section id="steps" n={9} heading="参观步骤与预登记" lede="按时间排的动作清单，已有的预登记入口直接给链接。">
          <StepsList />
        </Section>

        <Section id="costs" n={10} heading="费用一眼看（城市总表）" lede="假设 2 人从宁波鄞州出发、按平时价格估算；票价以购票当天为准。决赛圈逐场表见上文预算节。">
          <CostList />
          <Text>
            现场对方最想知道的是「凭什么信你」。3 分钟的笔记本演示加一个可公开的完整案例（扫码可看），比印刷品更有说服力。
            评估一趟值不值，除了签单，还可以看：加到的联系人质量、约到的面谈数、产出的内容条数。
          </Text>
        </Section>

        <Section id="open" n={11} heading="参展前确认清单" lede="出发前逐项确认。前两条（案例、经验）不过，后面都是空转。">
          <ul className="list-disc space-y-2 pl-5">
            {open.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="mt-5 border-t border-dashed pt-2 text-xs text-muted-foreground">
            五城以外的相关展：{outOfScope.join("、")}。标「未核实 / 未官宣 / 推断 / 假设·未定」的日期和信息，出发前请到官网确认。
          </p>
        </Section>
        </Appendix>
        </div>
       </div>
      </div>
    </main>
  );
}
