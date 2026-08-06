/**
 * Showcase copy registry — single source of truth for product card copy.
 *
 * Consumed by:
 *  - fetch-project-previews.cjs  → homepage cards (final word over scraped OG)
 *  - sync-og-copy.cjs            → writes these values back into each product
 *                                  repo's OG meta (reverse control)
 *
 * Audience language: ZH products stay ZH, EN products stay EN.
 * House voice: direct, plain, useful, beginner-friendly. No hype, no fluff.
 */
const COPY = {
  "https://holopinch.lizliz.xyz/": {
    title: "HoloPinch — Hold a hologram between your hands",
    description:
      "Browser AR: pinch, and a holographic mesh lives between your hands. MediaPipe + WebGL. No install.",
  },
  "https://acriva.lizliz.xyz/": {
    title: "融销通 — 借得到 · 卖得出 · 问得着",
    description:
      "给土老板和合作社的经营台：农贷申请、货盘上架、专家问答——钱、货、技术同台办。",
  },
  "https://reddit-viral.lizliz.xyz/": {
    title: "Reddit Viral — Market on Reddit without getting suspended",
    description:
      "Reddit marketing for founders: high-karma accounts, AI posts, safe pacing — without agency prices.",
  },
  "https://agent-crm.lizliz.xyz/": {
    title: "Agent CRM — CRM that runs deals while you sleep",
    description:
      "Agents build pipeline, move deals, and grow accounts around the clock.",
  },
  "https://cutting-die.lizliz.xyz/": {
    title: "Foldy — Packaging dielines in 30 seconds",
    description:
      "Pick a box style, enter dimensions, get cut and fold lines. Export SVG/DXF/PDF — factory verifies before die-making.",
  },
  "https://shelfplan.lizliz.xyz/": {
    title: "ShelfPlan — From Empty Shell to Procurement List",
    description:
      "零售空间规划：从空房到可执行采购清单。报价引擎，不是 3D 渲染玩具。",
  },
  "https://flappybird.lizliz.xyz/": {
    title: "Flappy FPV — First-Person Flappy Bird",
    description:
      "Flappy Bird in first person. Fly through the pipes from inside the bird. Three.js, no install.",
  },
  "https://brainrush.run/": {
    title: "Brain Rush｜60 秒口算与英语单词小游戏",
    description:
      "免费儿童口算与单词训练：60 秒速算、中英互译、错题本、本地成绩。",
  },
  "https://pep-words.brainrush.run/": {
    title: "PEP 英语词汇｜小学初中单词检索、卡片与测试",
    description:
      "人教版 PEP 单词工具：检索释义、收藏导出、卡片复习、快速测试。免费。",
  },
  "https://carver.lizliz.xyz/": {
    title: "Carver — Damage Becomes Infrastructure",
    description:
      "Browser puzzle: carve dirt into ice, turn void scars into braces, path to the goal. Free, no install.",
  },
  "https://vibe-gba.lizliz.xyz/": {
    title: "vibe-gba — Scratch-built Rust GBA emulator",
    description:
      "Rust Game Boy Advance emulator with Emerald education mode. Bring your own legal ROM — none included.",
  },
  "https://bitcoin-whitepaper.lizliz.xyz/": {
    title: "比特币白皮书中文翻译 2025",
    description:
      "《Bitcoin: A Peer-to-Peer Electronic Cash System》中文译本：结构、图示、公式、参考文献完整保留。",
  },
  "https://pausey.lizliz.xyz/": {
    title: "Pausey — Pause and breathe",
    description:
      "A tiny pause-and-breathe tool for when you need thirty quiet seconds.",
  },
  "https://lizliz.xyz/adventurex-2026/": {
    title: "AdventureX 2026 志愿者频道 — 数据侧写",
    description:
      "106 位志愿者、4779 条消息、23 天：一个群聊如何临时撑起整场活动。中英双语数据叙事。",
  },
};

module.exports = { COPY };
