/**
 * GTM 获客简报（2026-10-28 可视化重写）。
 * 骨架只答：这些平台/场景下有哪几条路子？入口→钩子→承接→成交→优先级。
 * 不以 /raw 口述为目录；不复述「为什么选微信/抖音」共识。
 * 词义 / 待核 / 长表 → gtm research 附录。
 */

export const meta = {
  eyebrow: "GTM · 获客路径",
  title: "五条路子：入口、钩子、承接、成交与优先级",
  summary:
    "先把能跑的路径画成五条泳道。眼前主抓两条：应用内搜品类词占位，以及创始人内容把流量导回主号。国内收服务费的漏斗，和客户海外询盘通道，分开走。",
  note: "内部打法拆解，与定价页配套。只有已核对过的平台规则才当事实写。",
};

export const takeaway = [
  "眼前主抓：搜品类词占位 + 主号内容",
  "品类词排名看标题、认证、活跃，不看赞",
  "我们国内收钱 ≠ 客户海外询盘通道",
];

export const toc = [
  { id: "routes", label: "五条路子全景" },
  { id: "search", label: "应用内搜索怎么排" },
  { id: "pipelines", label: "两套流向分开" },
  { id: "next", label: "近 4 周" },
];

/** 泳道图下的短标签，不是段落 */
export const routeChips = [
  { label: "1 搜索拦截", meta: "P0", focal: true },
  { label: "2 主号内容", meta: "P0", focal: true },
  { label: "3 小店先付钱", meta: "P1" },
  { label: "4 分销·展会", meta: "P1" },
  { label: "5 付费投流", meta: "P2 暂缓" },
];

export const nextStrip = [
  { n: "W1", title: "认证 + 小店咨询商品" },
  { n: "W2", title: "60 秒录屏 · 标题试两条" },
  { n: "W3–4", title: "询单记账 + 3 个分销伙伴" },
];
