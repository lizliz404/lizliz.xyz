/**
 * 定价架构简报（2026-10-28 可视化重写）。
 * Presentation = 图主导。词义 / 护栏细则 / 校准台账 / 长表 → gtm research 附录。
 * 骨架按商业逻辑：资产边界 → 定位象限 → 模块化拆价 → 产能阶梯。不以 /raw 口述为目录。
 */

export const meta = {
  eyebrow: "PRICING · 定价架构",
  title: "出海建站与代运营：价格带、拆价公式与产能阶梯",
  summary:
    "独立站是攒自己的资产；B2B 平台会员是租流量。主推代建 ¥5,800，拆成建站费和按月维护；代运营按季度签、名额有限。",
  note: "内部定价讨论稿，Foundry 只是实例。竞品公开价已核对；我方拆价和名额仍是草案。",
};

/** ≤3 条，每条尽量短，口播用 */
export const takeaway = [
  "两类账分开：攒站资产 vs 租平台流量",
  "主推代建 ¥5,800＝建站 ¥4,300 + 维护 ¥500×3（草案）",
  "代运营按季签、限额；重复交付再做成产品能力",
];

export const toc = [
  { id: "landscape", label: "两类购买边界" },
  { id: "quadrant", label: "预算 × 谁干活" },
  { id: "architecture", label: "三档怎么拆价" },
  { id: "ladder", label: "产能阶梯" },
];

export const tiers = {
  metrics: [
    {
      value: "¥1,050",
      label: "A · 自助",
      detail: "开站 ¥500 + ¥50/月×11",
      tag: "几乎不投人工",
    },
    {
      value: "¥5,800",
      label: "B · 代建",
      detail: "建站 ¥4,300 + 维护 ¥500×3（草案）",
      main: true,
      tag: "主推",
    },
    {
      value: "¥1.5–2k/月",
      label: "C · 代运营",
      detail: "按 3 个月一期 · 同时最多 5 家",
      tag: "限名额",
    },
  ],
};

export const ladder = {
  bPoints: [
    { label: "第 1–2 单", value: 5800, display: "¥5,800", sub: "早鸟" },
    { label: "第 3–4 单", value: 6800, display: "¥6,800", sub: "+17%" },
    { label: "第 5–6 单", value: 7800, display: "¥7,800", sub: "封顶" },
  ],
  cPoints: [
    { label: "第 1–2 家", value: 1500, display: "¥1,500/月", sub: "¥4.5k/期" },
    { label: "第 3–4 家", value: 1800, display: "¥1,800/月", sub: "¥5.4k/期" },
    { label: "第 5 家", value: 2000, display: "¥2,000/月", sub: "封顶" },
  ],
};
