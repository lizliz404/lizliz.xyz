# HeroCanvas V1 — Paper Ink Garden (archived 2026-08-06)

**状态：已归档，仅作借鉴。** Liz 判定 V1「没那么好看」（2026-08-06），新一版 V2 按
`/home/ubuntu/projects/_templates/design/liz-personal-compact/DESIGN.md` 重做。
V1 保留在此供设计团队借鉴，不再上生产。

## 是什么

lizliz.xyz 首页全页 WebGL 背景（three.js 裸写，862 行，单文件）：
「Paper Ink Garden / 纸墨花园」——线框植物园，双材质溶解（sketch→solid），
螺旋轨道相机 + 鼠标视差，四层线重体系（inkHeavy / inkMedium / inkLight / accent），
idle progress ramp，暗色模式双色板，IntersectionObserver + visibilitychange 生命周期。

## 文件

- `HeroCanvas.tsx` — 归档时刻的生产实现（含 2026-08-06 优化轮：主题 MutationObserver 重建、dispose 复位 initedRef）
- `globals-shell.css` — 归档时刻 globals.css 全量副本（含 `.home-animation-shell` 径向 mask、skip-link、reduced-motion 块）

## 相关 commit

- `89972e1` feat(hero): Three.js WebGL ink garden + relocate pixel animation to /articles
- `890f39d` refactor(hero): WebGL as full-page background + fix articles iframe embedding
- `d516f2a` feat(site): structural optimization round 1（主题重建 / 懒载 / mask / a11y）
- `576ad25` / `ae583c6` — 同期 skill 上架与补丁，与 Hero 无直接关系

## 设计决策记录（V1 时代的判断，V2 可推翻）

- 隐喻：暖纸 + 墨 + 书写 → 植物图谱 / 墨园（site-adaptation-recipe 的隐喻表）
- 色板直接取自 globals.css tokens（PAPER #FAF9F5 / INK #141413 / ACCENT #B14E22 恒定），
  双模式（dark: #1C1A16 / #E8E4DD / #9B9488）
- 四层线重 = 建筑制图「结构线重、标注线轻」的语言迁移
- 全视口 fixed 背景层（z-index 0），`.home-content-panel` backdrop blur 保可读
- 边缘渐隐：scene fog + CSS radial mask（2026-08-06 补）

## 归档原因（Liz 原话摘录，2026-08-06）

> 「在体会过其他版本、其他人画的话之后，我感觉当前 personal side 背后的那一版事实上没那么好看。」
> 「就把这版 V1 先 archived，仅作为借鉴……根据我们 personal site 的 design MD，去设计新的一版。」

## 张力备忘

liz-personal-compact DESIGN.md 的 motion 条款：`avoid: heavy 3D / full-page WebGL /
long-running parallax stacks / motion that delays first content`——V1 与自身 design MD
冲突（MD scanDate 2026-06-23，墨园建于 2026-07-18，即墨园是 MD 之后才建的）。
V2 设计必须显式处理这个张力并给出裁决。
