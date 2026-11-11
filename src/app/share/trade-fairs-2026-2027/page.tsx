import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";
import "../share.css";
import { Appendix, ExtLink, Section, Table, Takeaway, Text, Toc } from "../parts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FairDetail } from "./FairDetail";
import { FairExplorer } from "./FairExplorer";
import { fairs, outOfScope, type Fair, type Period } from "./fairs";

const meta = {
  title: "广州、上海、深圳、义乌、宁波展会参观指南 2026-11 → 2027-10",
  summary:
    "以观众身份去展会、想见出口工厂、外贸公司和跨境卖家的人：全国外贸展会最密集的五个城市，一年内哪些展值得专门跑一趟、怎么去。",
  note: "信息核对于 2026-10-28（深圳 11-02、SCF／华礼／AWE／工博会 11-03）；日期和票价以官网与购票当天为准。",
};

export const metadata: Metadata = {
  title: meta.title,
  description: meta.summary,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: meta.title, description: meta.summary },
};

const youFairs = fairs.filter((f) => f.tier === "强");
const youIn = (p: Period) => youFairs.filter((f) => f.period === p);

const takeaway = [
  `看什么：外贸人一年真正能跑的展也就十几场——全年 ${fairs.length} 场里砍到 ${youFairs.length} 场「值得专门跑一趟」（按人流量和观众质量判）；其余 ${fairs.length - youFairs.length} 场收在页尾《完整尽调报告》。`,
  "最近：11/25–27 宁波中小工厂展（本地）和义乌跨境交易会撞同一周，两人分头或舍一场；同周深圳 APEC + 高交会，深圳酒店会紧。",
  "12 月两趟当天能回：上海文具展 12/4–6，义乌外贸工厂展 12/10–12。",
  "明年高峰在春季：3 月华交会、AWE → 3 月底深圳两馆连轴（CHWE 福田 + 玩具展宝安）→ 4 月广交会 + 深圳礼品展 → 5–6 月跨博会、SCF＋华礼、广州跨交会、中小工厂展春季。",
  "两个坑：深圳两馆（福田老馆 / 宝安新馆）差约 30 公里别跑错；观众证就够用，别印传单——展位里打开笔记本演示更有说服力。",
];

const toc = [
  { id: "overview", label: "全年一览" },
  { id: "fairs", label: `值得去的展 · ${youFairs.length} 场` },
  { id: "prep", label: "去之前做什么" },
  { id: "costs", label: "费用一眼看" },
];

const ROW =
  "grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 md:grid-cols-[6.5rem_3rem_minmax(0,1.5fr)_minmax(0,1.15fr)_minmax(0,1fr)_1rem] md:gap-x-4";

/** 一行一场，点开看细节；窄屏自动变卡片。 */
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
              <span className="block font-medium">{f.name}</span>
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

const H3 = ({ children }: { children: ReactNode }) => (
  <h3 className="mb-2 mt-8 text-base font-semibold first:mt-0">{children}</h3>
);

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
      { when: "12/1 前", what: "义乌外贸工厂展预登记", who: "参观者", note: <A href="https://www.dspfair.com/buyer/gzxz/">观众须知 / 预登记</A> },
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
  { scene: "近期强展合计（2 人）", how: "中小工厂展 + 义乌跨境会住 1 晚 + 义乌外贸工厂展 + 上海文具展", price: "约 2,400–3,500 元", note: "按上表场景相加【估算】" },
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
  "客户案例：1–2 个可公开讲的完整版放主页，现场只用 3 分钟缩略版；用前程等客户案例先征得同意。",
  "业务经验：工厂 / 外贸公司 / 跨境卖家各备一套「先问什么 → 演示哪段」，能当场回答凭什么。",
  "预登记：逐场查截止日提前登记（上面清单「入场 / 截止」一列有）；单位填营业执照全称；过点可能收费。",
  "入场材料：身份证、名片（电子名片能否入场，提前电话确认）。",
  "演示：笔记本 3 分钟用户旅程 + 可离线录屏；微信 / 企微 + 公开主页两张码。",
  "现场：两人一人聊一人拍；加微信当场备注 A/B/C；24–72 小时内跟进。",
  "同期取舍：两场撞期时提前定两人一起错峰还是分头（如 11/25–27）。",
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
      <div className="fg-page fg-wide">
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

        <div className="fg-top-grid">
          <Takeaway items={takeaway} />
          <Toc items={toc} />
        </div>

        <Section
          id="overview"
          n={1}
          heading="全年一览"
          lede="城市 × 月份年历，默认只画「值得去」的强档；中、弱、不推荐收在各月的「+N 场」里，也可一键全部放出。虚线框 = 只有惯例日期或未核实。点月份看当月清单，点一行展开细节。"
        >
          <FairExplorer fairs={fairs} />
        </Section>

        <Section
          id="fairs"
          n={2}
          heading={`值得专门跑一趟的展 · ${youFairs.length} 场`}
          lede="按人流量和观众质量判的，距离不挡入选。点一行看场馆、入场、截止、费用；标「未官宣 / 未核实」的日期出发前到官网确认。"
        >
          <H3>近期 · 2026-11 → 12（{youIn("near").length} 场）</H3>
          <FairList items={youIn("near")} />
          <div className="my-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border p-4 text-sm">
              <p className="mb-1 font-semibold">11/25–27 同期 · 方案 A：两人一起错峰</p>
              <p className="text-muted-foreground">
                11/25 宁波中小工厂展当天回；11/26 07:05 C695 去义乌住 1 晚；11/27 上午看跨境会（14:00 撤展），16:27 C630 / 16:55 C698 回宁波。
              </p>
              <p className="mt-2">2 人约 1,050–1,850 元【推断行程】· 两场都能看，保留一人聊、一人拍</p>
            </div>
            <div className="rounded-lg border p-4 text-sm">
              <p className="mb-1 font-semibold">11/25–27 同期 · 方案 B：分头</p>
              <p className="text-muted-foreground">一人在宁波拍，一人去义乌聊。</p>
              <p className="mt-2">两边都覆盖 · 少了现场配合</p>
            </div>
          </div>

          <H3>2027 春季 · 3–6 月（{youIn("spring").length} 场）</H3>
          <FairList items={youIn("spring")} />
          <Text>
            3 月底到 4 月可串成一趟大湾区行程：CHWE 3/30–4/2（福田）→ 玩具展 3/31–4/2（宝安）→ 广交会二期（惯例 4/23–27）→ 深圳礼品展 4/25–28（宝安）；6 月 SCF 和华礼同趟（6/10–12）。
          </Text>

          <H3>2027 夏秋 · 7–10 月（{youIn("summer").length + youIn("autumn").length} 场）</H3>
          <FairList items={[...youIn("summer"), ...youIn("autumn")]} />
          <Text>
            要拍板的：11/25 错峰还是分头；明年 17 场里定哪 8–10 场真去（10 月义博会、礼品展秋、广交会秋近同期，要二选一或分头）；案例能不能公开讲。
          </Text>
        </Section>

        <Section id="prep" n={3} heading="去之前做什么" lede="每场通用；前两条（案例、经验）不过，去了也是逛。">
          <ul className="list-disc space-y-2 pl-5">
            {open.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Section>

        <Section id="costs" n={4} heading="费用一眼看" lede="2 人从宁波鄞州出发、按平时价格估算；票价以购票当天为准。">
          <CostList />
          <Text>
            现场对方最想知道的是「凭什么信你」。3 分钟的笔记本演示加一个可公开的完整案例（扫码可看），比印刷品更有说服力。
          </Text>
        </Section>

        <Appendix title={`完整尽调报告：全年 ${fairs.length} 场分级口径、逐场预算与预登记、定位与收益`}>
          <Text>
            分档口径：强 = 值得专门跑一趟；中 = 规模或匹配只占一头；弱 = 只备查；不推荐 = 明确不去。全年 73 场在上面年历里（中 / 弱 / 不推荐默认收起，可一键放出）。
            方法与出处：
            <ExtLink href="https://github.com/lizliz404/project-context/tree/main/events/26.10.26-%E5%B1%95%E4%BC%9A%E5%8F%82%E5%B1%95%E5%B0%BD%E8%B0%83">尽调材料</ExtLink>
            {" · "}
            <ExtLink href="https://github.com/lizliz404/project-context/blob/main/gtm/foundry/research/trade-fairs-report-arc-strong-only-20261103.md">汇报弧</ExtLink>
            {" · "}
            <ExtLink href="https://github.com/lizliz404/project-context/blob/main/gtm/foundry/research/trade-fairs-you-prep-budget-20261103.md">优展 / 准备 / 预算调研</ExtLink>
            {" · "}
            <ExtLink href="https://github.com/lizliz404/project-context/blob/main/events/26.10.26-%E5%B1%95%E4%BC%9A%E5%8F%82%E5%B1%95%E5%B0%BD%E8%B0%83/costs.md">costs.md</ExtLink>
          </Text>

          <H3>{youFairs.length} 场逐场预算</H3>
          <Table columns={["#", "展会", "日期", "票 / 注册", "建议行程", "2 人大约"]} rows={youBudgetRows} />

          <H3>通用动作与逐场预登记</H3>
          <StepsList />

          <H3>定位与收益（推断）</H3>
          <Text>
            定位：观众身份进场，不摆摊；展位里笔记本讲 3 分钟，完整案例放扫码后的主页。目标：拍内容、粉丝面基、建联客资，签单预期放低。
            一趟值不值看联系人质量、约到的面谈、产出的内容条数，不单看当场签单。以上全部【推断】。
          </Text>
          <p className="mt-5 border-t border-dashed pt-2 text-xs text-muted-foreground">
            五城以外的相关展：{outOfScope.join("、")}。标「未核实 / 未官宣 / 推断 / 假设·未定」的日期和信息，出发前请到官网确认。
          </p>
        </Appendix>
      </div>
    </main>
  );
}
