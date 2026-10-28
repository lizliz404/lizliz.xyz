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
    "把可跑的获客路径拆成五条泳道。P0：应用内搜品类词占位 + 创始人 IP 反哺矩阵；P1：小店先付钱筛人、群主/展会借信任；投流等 CAC 跑通再开。两套流向隔离：我们国内收服务费 vs 客户海外询盘落客户自己通道。",
  note: "内部 GTM 打法拆解，与定价页配套。公开规则已核处标来源；内部假设标【假设】。",
};

export const takeaway = [
  "P0：搜品类词占位 + IP 矩阵反哺",
  "搜品类词看标题/认证/活跃，不看赞",
  "国内获客漏斗 ≠ 客户海外询盘通道",
];

export const toc = [
  { id: "routes", label: "五条路子全景" },
  { id: "search", label: "搜商机制" },
  { id: "pipelines", label: "双流向解耦" },
  { id: "next", label: "近 4 周" },
];

/** 泳道图下的短标签，不是段落 */
export const routeChips = [
  { label: "1 搜索拦截", meta: "P0", focal: true },
  { label: "2 IP 矩阵", meta: "P0", focal: true },
  { label: "3 小店闪电链", meta: "P1" },
  { label: "4 分销·展会", meta: "P1" },
  { label: "5 付费投流", meta: "P2 暂缓" },
];

export const nextStrip = [
  { n: "W1", title: "认证 + 小店咨询项" },
  { n: "W2", title: "60s 录屏 · 答案型标题 A/B" },
  { n: "W3–4", title: "询单台账 + 3 伙伴分销" },
];
