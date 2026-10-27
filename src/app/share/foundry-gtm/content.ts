/**
 * Foundry GTM 分享页的全部内容。改字、改数字只改这个文件；
 * 版式在 parts.tsx + foundry-gtm.css，page.tsx 只负责按顺序摆放。
 *
 * 规则：数字只来自方案原文；没核实的保留【假设】/【未核实】；
 * 不放客户信息、录音原话、私有仓库链接。
 */

export const meta = {
  title: "Foundry GTM 方案：三档定价与获客",
  summary:
    "自助档打价格战没有优势；中档真正对手是星谷云。钱在代建。可守卖点只剩三件：改参数不加钱、到期不下线、一周交付。最低承接＝一个微信二维码 + 一个邮箱。",
  note: "讨论稿，不是对外报价。",
};

const XM = "销售口头报价，未见正式报价单";

export const contradiction = {
  callout:
    "自助档：AllinCMS ¥500（拼团 ¥399）+ 来发信 ≈¥900/年覆盖「建站+找客户」；我们首年 ¥1,050。只盯低价会错——中档真正对手是星谷云（AI 矩阵，年费不公开）。要证明的是「比一年几万的 AI 矩阵多了什么」，不是比 ¥399 强。",
  text: "钱在代建/代运营，但吃创始人时间。解法：代建现在收钱、记工时；重复 ≥3 次做成功能或模板。定位：阿里系自运营 ¥16,800/年、不能试用、不交源码；Foundry 先做出来给你看，再付 ¥5,800，到期不下线。",
};

export type Bar = {
  label: string;
  value: number;
  display: string;
  meta: string;
  us?: boolean;
  estimate?: boolean;
};

export const bars: Bar[] = [
  { label: "小满独立站·全包代运营", value: 69800, display: "¥69,800", meta: `含 SEM、人工写文章；只保排名不保询盘。${XM}` },
  { label: "中国制造网·钻石", value: 59800, display: "¥59,800/年", meta: "会员 + 固定广告位；上市公司口径" },
  { label: "环球资源", value: 40000, display: "¥40,000 起", meta: "基础方案；第三方汇总【中】" },
  { label: "阿里国际站会员", value: 35800, display: "¥35,800 起", meta: "另加约 ¥1 万直通车" },
  { label: "星谷云", value: 25000, display: "不公开（量级示意）", meta: "年费；官网不公开价目，报告称量级高于 Ueeshop 等中档明码【未核实】", estimate: true },
  { label: "小满独立站·自运营", value: 16800, display: "¥16,800/年", meta: `每年续同价，不交源码，不能试用。${XM}` },
  { label: "Foundry 代建（主推）", value: 5800, display: "¥5,800", meta: "先看成品再付，到期不下线", us: true },
  { label: "Ueeshop", value: 3800, display: "¥3,800 起", meta: "中档明码代表" },
  { label: "Foundry 自助", value: 1050, display: "¥1,050", meta: "首年：开站 + 月费", us: true },
  { label: "AllinCMS + 来发信", value: 900, display: "≈¥900", meta: "建站拼团 ¥399 + 获客券后 ¥399" },
  { label: "AllinCMS", value: 500, display: "¥500", meta: "拼团 ¥399" },
];

export const barsText =
  "讲「我们夹在谁中间」：上有阿里系/平台年费，中有星谷云（条是量级示意，不是官价），下有 AllinCMS 裂变价。代建第一年约是小满自运营的 1/3，第二年起只要 ¥600。";

export type MapPoint = { label: string; x: number; y: number; note: string; us?: boolean };

export const matrix = {
  x: ["低价 / 自助", "高价 / 全包"] as const,
  y: ["建站为主", "AI 矩阵深"] as const,
  points: [
    { label: "AllinCMS", x: 0.12, y: 0.25, note: "¥500，拼团 ¥399" },
    { label: "Foundry A", x: 0.22, y: 0.28, note: "¥1,050 首年：开站 + 月费", us: true },
    { label: "Ueeshop", x: 0.38, y: 0.22, note: "¥3,800 起，中档明码代表" },
    { label: "Foundry B", x: 0.42, y: 0.45, note: "¥5,800，先看成品再付，到期不下线", us: true },
    { label: "星谷云", x: 0.62, y: 0.88, note: "年费不公开；AI 矩阵【未核实】" },
    { label: "小满自运营", x: 0.72, y: 0.4, note: `¥16,800/年，不交源码。${XM}` },
    { label: "中国制造网", x: 0.82, y: 0.55, note: "钻石 ¥59,800/年" },
    { label: "环球资源", x: 0.88, y: 0.58, note: "¥40,000 起" },
    { label: "小满代运营", x: 0.92, y: 0.7, note: `¥69,800。${XM}` },
    { label: "阿里国际站", x: 0.95, y: 0.65, note: "¥35,800 起，另加约 ¥1 万直通车" },
  ] satisfies MapPoint[],
  text: "低档拼裂变；中档拼「AI 替人干活」——星谷云在这里。Foundry B 站中档左下：价看得见、资产归客户、不绑架续费。",
};

export const tiers = {
  metrics: [
    { value: "¥1,050", label: "A 自助·首年", detail: "开站 ¥500 + ¥50/月；≈0 创始人时间" },
    { value: "¥5,800", label: "B 代建·主推", detail: "含 3 个月维护；≤8h/单【假设】", main: true },
    { value: "¥1.5–2k/月", label: "C 代运营·限量", detail: "按季付；同时最多 5 家" },
  ],
  table: {
    columns: ["", "A 自助", "B 代建（主推）", "C 代运营"],
    emphasis: 2,
    rows: [
      ["价格", "¥500 + ¥50/月", "¥5,800 起（含 3 月维护）", "¥1,500–2,000/月，按季；不签年约"],
      ["包含 / 不包含", "AI 建站+后台；无人工", "≤50 SKU、1 轮设计、替买域名；不含文案/广告/SEO", "每期清单上新≤N、修改≤M；不承诺询盘数"],
      ["到期", "手动续", "转 C，或降回 A 继续在线", "不续降回 A"],
      ["计量单位", "站点", "一次交付", "每月工时"],
    ],
  },
  tableText: "「到期不下线」回应行业痛点。已知问题：三档计量单位不一致，客户会拿最便宜的「站点」比价——待拍板。",
  columns: [
    { label: "B 第1–2单", value: 5800, display: "¥5,800" },
    { label: "B 第3–4单", value: 6800, display: "¥6,800" },
    { label: "B 第5–6单", value: 7800, display: "¥7,800" },
    { label: "C 第1–2家/月", value: 1500, display: "¥1,500" },
    { label: "C 第3–4家/月", value: 1800, display: "¥1,800" },
    { label: "C 第5家/月", value: 2000, display: "¥2,000" },
  ],
  columnsText: "本季名额【假设】：B 6 单、C 最多 5 家。满了等候或扩产能；稀缺必须是真的。等候连续两季满才是招人信号。",
};

export const pitch = {
  prosHeading: "可守三卖点（对外只讲这些）",
  consHeading: "已降为行业标准（别当差异点）",
  pros: ["改一个参数不用加钱", "到期不下线（降档不删站）", "一周交付（对照全案几周到几月）"],
  cons: [
    "GEO / AI 搜索推荐（Durable、AllinCMS、星谷云都在讲）",
    "「站是你的」（定制工作室也在讲资产交付）",
    "「AI 建站」本身（是交付手段，不是主卖点）",
  ],
  callout: "一个微信二维码 + 一个邮箱。铺满落地页、自媒体、名片、报价单。硬校验：想联系的人能不能在 30 秒内找到入口。",
};

export const sell = {
  nodes: [
    { label: "相遇", detail: "IP 被喜欢 · 产品被搜到" },
    { label: "链接", detail: "二维码 + 邮箱" },
    { label: "转化", detail: "草稿 / 首页成品" },
    { label: "复购", detail: "年付 · C 或 A", terminal: true },
  ],
  text: "双轨：创始人号负责被喜欢——主形态是「丢 PDF → 出站 → 改参数 → 发布」60–90 秒录屏；产品号负责被搜到。分销抄阿里：全球统一价、钱进我们账户、无权改价；按 A/B/C 分线计佣；不收保证金、不要排他。最小可行＝3 个分销商 × 专属链接。暂时不做付费投放、不承诺询盘数。",
};

export const risks = {
  columns: ["#", "风险", "怎么挡"],
  rows: [
    ["1", "创始人时间被预售（年约＝时间期权）", "C 按季滚动 + 每期工作清单 + 每季限量；每单记工时"],
    ["2", "效果承诺和退款纠纷", "合同只说交付清单；不对外抄竞品询盘率话术（我们无样本）"],
    ["3", "范围蔓延", "每期清单写死；清单外变更单；5 个工作日验收"],
    ["4", "GEO、「站是你的」不再是差异点", "卖点只剩改参、不下线、一周交付"],
    ["5", "中档真正对手是星谷云", "「AI 建站」当手段；对外只讲三可守卖点"],
    ["6", "尚无 AI 接待询盘能力", "短期只承诺询盘推企微/邮箱"],
  ],
  text: "其余（版权/广告法、¥500 支持负荷、客户集中、渠道封号、商品化、预收款税票、县域假设）在完整方案里，演讲不展开。",
};

export const next = {
  steps: [
    { title: "第一单做成 B 档样板", detail: "问清范围；全程记工时，录屏留案例。" },
    { title: "3 个渠道测两周", detail: "分销、小红书个人号 vs 品牌号、熟人转介绍；只留最好的 1 个。" },
    { title: "拍一条 60–90 秒录屏", detail: "丢 PDF → 出站 → 改参数 → 发布 → 询盘推企微。" },
    { title: "合同清单过律师 + 域名流程", detail: "范围/变更/验收；域名代管流程跑通。" },
  ],
  decisions: [
    { title: "B 档 ¥5,800 和每单 ≤8 小时，能不能接受？" },
    { title: "每期 N（上新）/ M（修改）定多少？清单外单价？" },
    { title: "每季名额和价格台阶？", detail: "示意 B 6 / C 5；名额表公开在哪里" },
    { title: "什么时候招自己人？兼职还是全职？" },
    { title: "三档要不要统一计量单位？", detail: "站点 / 一次交付 / 每月工时不一致" },
    { title: "报价流程怎么说清？", detail: "免费草稿再付 vs 星谷云只演示不试用" },
  ],
};
