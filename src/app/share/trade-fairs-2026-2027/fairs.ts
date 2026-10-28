/**
 * 展会数据：只取自 project-context events/26.10.26-展会参展尽调
 * （README.md §近期窗口、§1 总表、§2 12 个月日历、§5.2 报名、§8 短名单；costs.md）。
 * 核对日 2026-10-26 / 10-27（Asia/Shanghai）。不新增事实。
 *
 * tier 是页面配色用的归档，规则写在页面上：
 *   近期按原文「对我们 / 建议」；2027 按 §8 短名单：前 3 = 强，其余 = 中，
 *   未进短名单 = 弱；原文写「不去 / 不建议」= 不去。
 * kind：exact = 有确定日期；approx = 只有惯例日期或日期未核实（日历上画虚线框，不填色）；
 *   month = 只知道月份（不上日历格子，只进当月清单）。
 */

export type Tier = "强" | "中" | "弱" | "不去";
export type City = "宁波" | "义乌" | "广州";
export type Period = "near" | "spring" | "autumn";
export type Kind = "exact" | "approx" | "month";

export type Fair = {
  id: string;
  city: City;
  /** 全名 */
  name: string;
  /** 年历条上的短名（≤6 字） */
  short: string;
  /** 显示用日期 */
  dates: string;
  /** 起止（含），yyyy-mm-dd。month 类为空。 */
  spans: [string, string][];
  /** month 类所在月份 yyyy-mm */
  month?: string;
  kind: Kind;
  /** 原文标注，原样上徽章：未官宣 / 未核实 / 第三方日程 / 推断 … */
  flags: string[];
  tier: Tier;
  /** 对我们（一句） */
  fit: string;
  /** 建议（一句） */
  advice: string;
  /** 入场 / 报名（一句） */
  entry?: string;
  /** 2 人费用量级 */
  cost?: string;
  /** 展开后才看的细节 */
  details?: string[];
  links?: { label: string; href: string }[];
  period: Period;
};

export const TIERS: Tier[] = ["强", "中", "弱", "不去"];

/** 档位配色：日历格子、徽章、年历条共用。 */
export const tierClass: Record<Tier, string> = {
  强: "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950",
  中: "bg-amber-200 text-amber-950 dark:bg-amber-300",
  弱: "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-100",
  不去: "bg-transparent text-muted-foreground line-through decoration-1 ring-1 ring-inset ring-border",
};

/** 虚线版（惯例日期 / 未核实日期 / 只知道月份）。 */
export const tierDashed: Record<Tier, string> = {
  强: "border border-dashed border-emerald-600 text-emerald-800 bg-emerald-50 dark:bg-transparent dark:text-emerald-300",
  中: "border border-dashed border-amber-500 text-amber-900 bg-amber-50 dark:bg-transparent dark:text-amber-200",
  弱: "border border-dashed border-stone-400 text-stone-600 bg-transparent dark:text-stone-300",
  不去: "border border-dashed border-border text-muted-foreground line-through decoration-1 bg-transparent",
};

export const PERIODS: { id: Period; label: string; range: string }[] = [
  { id: "near", label: "近期", range: "2026-10 末 → 12 月" },
  { id: "spring", label: "2027 春季窗口", range: "3–6 月" },
  { id: "autumn", label: "2027 秋季", range: "9–10 月" },
];

/** 年历条的月份（2026-10 只剩月末几天，研究窗口本身是 2026-11 → 2027-10）。 */
export const MONTHS = [
  "2026-10", "2026-11", "2026-12",
  "2027-01", "2027-02", "2027-03", "2027-04", "2027-05", "2027-06",
  "2027-07", "2027-08", "2027-09", "2027-10",
];

/** 空档与未查的说明（§2「季节性回答」和 12 月宁波行）。 */
export const monthNotes: Record<string, string> = {
  "2026-12": "宁波 12 月未查（尽调只查了 11 月）。",
  "2027-01": "1–2 月春节，出口／跨境类展基本空档。",
  "2027-02": "1–2 月春节，出口／跨境类展基本空档。",
  "2027-07": "7–8 月基本空档。",
  "2027-08": "7–8 月基本空档。",
};

export const fairs: Fair[] = [
  // ───────────── 近期 ─────────────
  {
    id: "nb-kitchen",
    city: "宁波",
    name: "宁波国际厨房卫浴展",
    short: "厨卫展",
    dates: "10/29–31",
    spans: [["2026-10-29", "2026-10-31"]],
    kind: "approx",
    flags: ["日期未核实", "第三方日程"],
    tier: "弱",
    fit: "厨卫，弱",
    advice: "练手可以",
    links: [{ label: "第三方日程 onezh", href: "https://m.onezh.com/hall/plan_286.html" }],
    period: "near",
  },
  {
    id: "gz-gba",
    city: "广州",
    name: "2026 大湾区国际跨境电商进出口贸易展",
    short: "大湾区跨境",
    dates: "10/30–11/1",
    spans: [["2026-10-30", "2026-11-01"]],
    kind: "exact",
    flags: ["规模为主办自述"],
    tier: "不去",
    fit: "有服务商展区、跨境平台区；民营主办",
    advice: "不建议：只剩 3 天，要飞广州",
    details: ["场馆：广州保利世贸博览馆。"],
    links: [{ label: "官网 icbeshow.com", href: "http://www.icbeshow.com/" }],
    period: "near",
  },
  {
    id: "yw-forest",
    city: "义乌",
    name: "义乌森博会（第 19 届）",
    short: "森博会",
    dates: "10/30–11/2",
    spans: [["2026-10-30", "2026-11-02"]],
    kind: "exact",
    flags: [],
    tier: "弱",
    fit: "林产品、家具、木制品，弱",
    advice: "不优先",
    entry: "实名预登记",
    details: ["5 万㎡、2000 展位。"],
    links: [{ label: "中国义乌网报道", href: "https://news.zgyww.cn/system/2026/09/02/010306885.shtml" }],
    period: "near",
  },
  {
    id: "gz-canton140",
    city: "广州",
    name: "广交会第 140 届 · 三期",
    short: "广交会三期",
    dates: "10/31–11/4",
    spans: [["2026-10-31", "2026-11-04"]],
    kind: "exact",
    flags: [],
    tier: "不去",
    fit: "玩具母婴、服装鞋包、家纺、办公文具、食品、个护、宠物",
    advice: "不去：没有可用的证件路径",
    entry: "境内采购商证要年营收≥5000 万 + 交易团邀请",
    links: [{ label: "广交会官网", href: "https://www.cantonfair.org.cn/zh-CN/pages/727090749086445568" }],
    period: "near",
  },
  {
    id: "nb-freight",
    city: "宁波",
    name: "中国国际货运产业链博览会",
    short: "货博会",
    dates: "11/4–6",
    spans: [["2026-11-04", "2026-11-06"]],
    kind: "exact",
    flags: ["第三方日程"],
    tier: "弱",
    fit: "展商是货代和物流公司，算同行或合作方",
    advice: "不去，或顺路看一眼",
    cost: "地铁当天",
    links: [{ label: "第三方日程 onezh", href: "https://m.onezh.com/hall/plan_286.html" }],
    period: "near",
  },
  {
    id: "yw-stationery",
    city: "义乌",
    name: "义乌文化用品秋季展",
    short: "文化用品展",
    dates: "11/6–8",
    spans: [["2026-11-06", "2026-11-08"]],
    kind: "exact",
    flags: ["第三方日程"],
    tier: "中",
    fit: "文具源头工厂，中",
    advice: "可选，非优先",
    cost: "义乌当天往返约 600–900 元",
    links: [{ label: "第三方 expozm", href: "https://www.expozm.com/guan/ywgjg/" }],
    period: "near",
  },
  {
    id: "nb-hardware",
    city: "宁波",
    name: "中国（宁波）五金机电进出口博览会 CHEE",
    short: "五金机电",
    dates: "11/12–14",
    spans: [["2026-11-12", "2026-11-14"]],
    kind: "exact",
    flags: [],
    tier: "中",
    fit: "出口五金工厂，中到强",
    advice: "挑一天，地铁去练手",
    entry: "官方预登记免费（官网在线登记）",
    cost: "2 人约 100–300 元",
    details: [
      "先练开场白和演示，晚上回家剪片【推断】。",
      "目标观众里列了外贸公司和电商平台；展出面积约 3 万㎡。",
      "观众组织部郭女士 15300156256（微信同号）；第三方平台展期票约 30 元，不用买。",
      "主办中展兴业（北京）国际会展；承办宁波港通国际会展。",
    ],
    links: [
      { label: "在线登记", href: "http://www.hardwareexpo.com.cn/h-col-123.html" },
      { label: "参观指南", href: "http://www.hardwareexpo.com.cn/h-col-124.html" },
    ],
    period: "near",
  },
  {
    id: "yw-import",
    city: "义乌",
    name: "义乌进口商品博览会 + 新能源与储能出口博览会（同期）",
    short: "进口/储能博",
    dates: "11/13–15",
    spans: [["2026-11-13", "2026-11-15"]],
    kind: "exact",
    flags: [],
    tier: "弱",
    fit: "进口商品、新能源储能，弱相关",
    advice: "不去",
    links: [{ label: "importfair.cn", href: "https://www.importfair.cn/" }],
    period: "near",
  },
  {
    id: "nb-hvac",
    city: "宁波",
    name: "宁波制冷空调热泵展",
    short: "制冷展",
    dates: "11/17–19",
    spans: [["2026-11-17", "2026-11-19"]],
    kind: "exact",
    flags: ["第三方日程"],
    tier: "弱",
    fit: "弱相关",
    advice: "不去",
    links: [{ label: "第三方 expozm", href: "https://www.expozm.com/cs/nb/" }],
    period: "near",
  },
  {
    id: "nb-factory",
    city: "宁波",
    name: "第 20 届中国（宁波）中小工厂展",
    short: "中小工厂展",
    dates: "11/25–27",
    spans: [["2026-11-25", "2026-11-27"]],
    kind: "exact",
    flags: [],
    tier: "强",
    fit: "展商全是中小工厂；近期排第一",
    advice: "优先覆盖；和义乌跨境撞期",
    entry: "免费；带身份证 + 名片；公众号预登记",
    cost: "宁波当天约 150–250 元/天",
    details: [
      "时间：11/25–26 09:30–17:30；11/27 09:30–14:00（13:30 停止入场），依据同主办上一届官方攻略，置信度中高。",
      "预登记：微信公众号「中小工厂展」→ 宁波站 → 参观登记；未满 18 岁谢绝入场。",
      "我们不印纸质名片：电子名片能不能入场【未核实】，打观众咨询 0574-87754727 问。",
      "规模：2025 届 2,067 家工厂、62,674 人次；2026 届预计 6 万㎡、2,400 家以上（第三方）。",
    ],
    links: [{ label: "观展指南", href: "https://gc-ningbo.com/gzzn" }],
    period: "near",
  },
  {
    id: "yw-crossborder",
    city: "义乌",
    name: "中国（浙江）跨境电商进出口交易会（第二届）",
    short: "跨境交易会",
    dates: "11/25–27",
    spans: [["2026-11-25", "2026-11-27"]],
    kind: "exact",
    flags: [],
    tier: "强",
    fit: "有服务生态、商业技术展区；短名单第 1",
    advice: "和宁波中小工厂展撞期，选方案 A/B",
    entry: "网上预登记；截止日未核实",
    cost: "当天约 600–900；住 1 晚约 1,000–1,800",
    details: [
      "开馆 09:00–17:00；11/27 14:00 撤展。",
      "5 个展区：海外工厂、产业带与供应链、未来商业技术生态、全链路服务生态、精品进口。",
      "上届（2025 首届）1000+ 家展商、20+ 国家。主办浙江中国小商品城集团。",
      "预登记观众凭确认短信或确认函走专用通道换证。",
    ],
    links: [
      { label: "预登记入口", href: "http://www.yxoexpo.com/article/vistform/k/2.html" },
      { label: "参观须知", href: "http://www.yxoexpo.com/article/detail/id/308.html" },
    ],
    period: "near",
  },
  {
    id: "yw-factory",
    city: "义乌",
    name: "中国（义乌）外贸工厂展（同期义乌物流展）",
    short: "外贸工厂展",
    dates: "12/10–12",
    spans: [["2026-12-10", "2026-12-12"]],
    kind: "exact",
    flags: [],
    tier: "强",
    fit: "展商全是外贸源头工厂；短名单第 2",
    advice: "去；只去一天选 12/10 或 12/11",
    entry: "免费参观证；12/1 前官网预登记",
    cost: "当天约 650–1,000；住 1 晚约 1,100–1,800",
    details: [
      "官方日程：12/10 10:00–17:00 洽谈；12/11 9:00–17:00；12/12 9:00–15:00 闭幕撤展，只值半天。",
      "5 万㎡、2300 个标准展位；同期物流展（跨境物流、海外仓、货代）。",
    ],
    links: [{ label: "观众须知 / 预登记", href: "http://www.dspfair.com/buyer/gzxz/" }],
    period: "near",
  },

  // ───────────── 2027 春季 ─────────────
  {
    id: "gz-cibe-spring",
    city: "广州",
    name: "广州美博会 CIBE（春）",
    short: "美博会",
    dates: "3/10–12",
    spans: [["2027-03-10", "2027-03-12"]],
    kind: "approx",
    flags: ["未核实"],
    tier: "弱",
    fit: "美妆，内贸为主",
    advice: "不优先",
    details: ["来源是代理站，非官方。"],
    links: [{ label: "mbhcibe.com（非官方）", href: "https://www.mbhcibe.com/news/869986/" }],
    period: "spring",
  },
  {
    id: "gz-ciff",
    city: "广州",
    name: "中国（广州）国际家具博览会 CIFF 第 59 届",
    short: "CIFF 家具",
    dates: "3/18–21、3/28–31",
    spans: [
      ["2027-03-18", "2027-03-21"],
      ["2027-03-28", "2027-03-31"],
    ],
    kind: "approx",
    flags: ["未逐字核实"],
    tier: "弱",
    fit: "家具全产业链",
    advice: "未进短名单",
    details: ["3/18–21 民用家具，3/28–31 办公商用；广交会展馆 + 保利世贸博览馆。日期来自搜索摘要。"],
    links: [{ label: "cn.ciff-gz.com", href: "https://cn.ciff-gz.com/" }],
    period: "spring",
  },
  {
    id: "nb-cnise",
    city: "宁波",
    name: "宁波国际文具礼品展 CNISE（第 24 届）",
    short: "文具礼品展",
    dates: "3/25–27",
    spans: [["2027-03-25", "2027-03-27"]],
    kind: "exact",
    flags: [],
    tier: "中",
    fit: "宁波本地；短名单第 7",
    advice: "适合春季第一次练手",
    entry: "3/25 零点前免费预登记，之后 50 元/人",
    cost: "宁波当天约 150–250 元/天",
    details: [
      "仅限专业观众，未满 18 岁不得入场；身份证 + 人脸识别；最后一天 15:00 闭馆。",
      "预登记走官网或公众号 CNISE-Fair；主办称从未授权第三方售票。",
      "规模：约 5 万采购商、80+ 国（第三方）【未核实】。",
    ],
    links: [{ label: "expo.antway.cn", href: "https://expo.antway.cn/cnise/content/79" }],
    period: "spring",
  },
  {
    id: "gz-canton141",
    city: "广州",
    name: "广交会第 141 届（春）",
    short: "广交会141",
    dates: "惯例 4/15–19、4/23–27、5/1–5",
    spans: [
      ["2027-04-15", "2027-04-19"],
      ["2027-04-23", "2027-04-27"],
      ["2027-05-01", "2027-05-05"],
    ],
    kind: "approx",
    flags: ["未官宣"],
    tier: "中",
    fit: "贸易服务展区可作为服务机构参展；短名单第 4",
    advice: "等官宣；不摆摊的话观众证路径不通",
    entry: "服务展区招展通告未发布",
    cost: "期间住琶洲约 4,700–17,400；住远约 3,000–9,500",
    details: [
      "日期只是惯例三期，官网接口 10-26 仍只返回第 140 届。",
      "观众路径：境内采购商证要年营收≥5000 万 + 交易团邀请，我们大概率不够资格。",
      "服务商路径：数字化转型／商务咨询专区；140 届最低档贸易服务柜台 22,500 元/9㎡/届；只能在本展位内宣传。Liz 已定不摆摊。",
      "141 届招展通告按 140 届节奏推断约 2027-03 发布、开展前约一个月截止【推断】。",
    ],
    links: [{ label: "140 届招展通告", href: "https://www.cantonfair.org.cn/content-detail?id=a9514de6fc244f6d9329a17392774ee9" }],
    period: "spring",
  },
  {
    id: "gz-jinhan-spring",
    city: "广州",
    name: "锦汉家居用品及礼品展（春季届）",
    short: "锦汉春季",
    dates: "4 月（日期未查到）",
    spans: [],
    month: "2027-04",
    kind: "month",
    flags: ["未核实"],
    tier: "弱",
    fit: "家居、礼品，出口贸易型",
    advice: "未进短名单",
    links: [{ label: "jinhanfair.com", href: "https://www.jinhanfair.com/cn/" }],
    period: "spring",
  },
  {
    id: "yw-hardware",
    city: "义乌",
    name: "义乌五金会",
    short: "五金会",
    dates: "惯例 4 月",
    spans: [],
    month: "2027-04",
    kind: "month",
    flags: ["未核实"],
    tier: "弱",
    fit: "五金工具",
    advice: "未进短名单",
    details: ["2026 年第 10 届是 4/20–22。"],
    links: [{ label: "cccfair.cn", href: "https://www.cccfair.cn/" }],
    period: "spring",
  },
  {
    id: "yw-tourism",
    city: "义乌",
    name: "义乌文旅博会",
    short: "文旅博会",
    dates: "惯例 5 月",
    spans: [],
    month: "2027-05",
    kind: "month",
    flags: ["未核实"],
    tier: "弱",
    fit: "文旅类",
    advice: "未进短名单",
    details: ["2026 年第 20 届是 5/11–13。"],
    links: [{ label: "ssofair.com", href: "https://www.ssofair.com/" }],
    period: "spring",
  },
  {
    id: "nb-ceec",
    city: "宁波",
    name: "中国—中东欧国家博览会暨国际消费品博览会（出口展）",
    short: "中东欧博览",
    dates: "5 月（具体日期未官宣）",
    spans: [],
    month: "2027-05",
    kind: "month",
    flags: ["未官宣"],
    tier: "弱",
    fit: "出口展品类：家居、礼品、餐厨等；短名单备选",
    advice: "待官宣",
    details: ["宁波国际会展中心，出口展 6 万㎡。第三方写 6/15–17，与官方「5 月」冲突，不采信。"],
    links: [{ label: "cicgf.com", href: "http://www.cicgf.com/col/col9500/index.html" }],
    period: "spring",
  },
  {
    id: "nb-ccbe",
    city: "宁波",
    name: "宁波出口跨境电商博览会（宁波跨博会）",
    short: "宁波跨博会",
    dates: "5/26–28",
    spans: [["2027-05-26", "2027-05-28"]],
    kind: "exact",
    flags: [],
    tier: "强",
    fit: "展商 83%+ 源头工厂，观众是卖家和外贸公司；短名单第 3",
    advice: "去；就在宁波",
    entry: "实名预登记，免费",
    cost: "宁波当天约 150–250 元/天",
    details: [
      "26–27 日 9:00–17:00，28 日 9:00–15:00；会展中心 1–8 号馆。",
      "2026 届专业观众 105,238 人次；观众构成：跨境卖家 31.48%、外贸公司 22.02%、工厂 12.19%。",
      "有服务商现场成交的先例（内容服务商签下每月 3000 张图的单）。",
      "禁止在通道发传单、拉客，禁止在展位内演示第三方内容。",
    ],
    links: [
      { label: "观众须知", href: "https://www.ecee-expo.com/gzzx" },
      { label: "官网", href: "https://www.nbecee.com/" },
    ],
    period: "spring",
  },
  {
    id: "gz-ccef",
    city: "广州",
    name: "中国（广州）跨境电商交易会（跨交会 CCEF）",
    short: "广州跨交会",
    dates: "6/16–18",
    spans: [["2027-06-16", "2027-06-18"]],
    kind: "exact",
    flags: [],
    tier: "中",
    fit: "200+ 服务商、50+ 平台，设「AI 日」；短名单第 5",
    advice: "适合找合作伙伴；要飞广州",
    entry: "参观联系曾女士 13560240173",
    cost: "3 天 2 晚平时约 2,700–9,400",
    details: [
      "广交会展馆 A 区，5 万㎡+；三大展区：供应链、平台及服务商、综试区及产业带。",
      "参展联系陈女士 13903005130 等；展位价格未公开。",
    ],
    links: [{ label: "gzccef.com", href: "https://www.gzccef.com/" }],
    period: "spring",
  },
  {
    id: "yw-ecfair",
    city: "义乌",
    name: "浙江国际电子商务博览会（义乌电商博览会，第 17 届）",
    short: "电商博览会",
    dates: "6/21–23",
    spans: [["2027-06-21", "2027-06-23"]],
    kind: "exact",
    flags: [],
    tier: "中",
    fit: "「电商服务企业」展区含应用软件；短名单第 6",
    advice: "和跨博会、跨交会连成 6 月窗口",
    entry: "观众登记方式未查",
    cost: "义乌当天约 600–900；住 1 晚约 1,000–1,800",
    details: ["2026 届 12.7 万人次；预设 2200 个展位；电话 0579-85891888。"],
    links: [{ label: "ecfair.cn", href: "http://www.ecfair.cn/" }],
    period: "spring",
  },
  {
    id: "nb-factory-spring",
    city: "宁波",
    name: "中国（宁波）中小工厂展 · 2027 春季展",
    short: "中小工厂春",
    dates: "6/23–25",
    spans: [["2027-06-23", "2027-06-25"]],
    kind: "exact",
    flags: ["档位推断"],
    tier: "强",
    fit: "同一主办的春季届；档位沿用秋季届",
    advice: "和义乌电商博览会 6/23 重叠一天",
    entry: "秋季届走公众号「中小工厂展」预登记",
    cost: "宁波当天约 150–250 元/天",
    links: [{ label: "gc-ningbo.com", href: "https://www.gc-ningbo.com/" }],
    period: "spring",
  },

  // ───────────── 2027 秋季 ─────────────
  {
    id: "gz-cibe-autumn",
    city: "广州",
    name: "广州美博会 CIBE（秋）",
    short: "美博会",
    dates: "9/4–6",
    spans: [["2027-09-04", "2027-09-06"]],
    kind: "approx",
    flags: ["未核实"],
    tier: "弱",
    fit: "美妆，内贸为主",
    advice: "不优先",
    details: ["来源是代理站，非官方。"],
    links: [{ label: "mbhcibe.com（非官方）", href: "https://www.mbhcibe.com/news/869986/" }],
    period: "autumn",
  },
  {
    id: "yw-yiwufair33",
    city: "义乌",
    name: "义博会（第 33 届）",
    short: "义博会",
    dates: "惯例 10/21–24",
    spans: [["2027-10-21", "2027-10-24"]],
    kind: "approx",
    flags: ["未官宣"],
    tier: "弱",
    fit: "日用消费品、五金、电子等，含服务贸易；未进短名单",
    advice: "等官宣",
    entry: "境内观众在线预登记，免费",
    cost: "义博会期间住 1 晚约 1,100–2,000",
    details: [
      "官网参展商页的常设写法是「举办日期：10月21-24日」，只能视作惯例。",
      "第 32 届：2770 家、11 万㎡；未经许可不得在现场发放资料。",
    ],
    links: [{ label: "yiwufair.com", href: "https://www.yiwufair.com/" }],
    period: "autumn",
  },
  {
    id: "gz-canton142",
    city: "广州",
    name: "广交会第 142 届（秋）",
    short: "广交会142",
    dates: "惯例 10 月中旬起",
    spans: [],
    month: "2027-10",
    kind: "month",
    flags: ["未核实"],
    tier: "弱",
    fit: "广交会秋季届",
    advice: "未进短名单",
    period: "autumn",
  },
];

/** 尽调里提到、但不在三城范围或不入表的展。 */
export const outOfScope = [
  "华交会（上海，2027-03-01–04）",
  "福州「中国跨交会」（2027-03-18–20）",
  "进博会（上海）",
];

// ───────────── 日期工具 ─────────────
export const toDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const monthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

/** 这场展碰到的月份（month 类就是它的 month）。 */
export function monthsOf(f: Fair): string[] {
  if (f.kind === "month") return f.month ? [f.month] : [];
  const out = new Set<string>();
  for (const [a, b] of f.spans) {
    const cur = toDate(a);
    const end = toDate(b);
    while (cur <= end) {
      out.add(monthKey(cur));
      cur.setDate(cur.getDate() + 1);
    }
  }
  return [...out];
}

export function covers(f: Fair, date: Date) {
  return f.spans.some(([a, b]) => date >= toDate(a) && date <= toDate(b));
}

export function monthLabel(key: string, withYear = false) {
  const [y, m] = key.split("-").map(Number);
  return withYear ? `${y} 年 ${m} 月` : `${m} 月`;
}
