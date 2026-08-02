# lizliz.xyz × 高杠杆工艺清单 v3 — 压力测试审计

**日期：** 2026-08-02  
**手册：** `/home/ubuntu/projects/_templates/high-leverage-craft-checklist.md` (v3)  
**Repo：** `/home/ubuntu/projects/lizliz.xyz`  
**Live：** https://lizliz.xyz  
**产品形态：** Next.js 16 静态导出个人站 / 内容站 + portfolio（CF Pages Git）  
**Starter pack 锚定：** 附 B「内容站 / 文档站」+ 个人站 OG / 空状态 / 404 / microcopy / reduced-motion

---

## 1. Executive summary

- **默认 Next 404 是峰终漏洞**：线上 `/does-not-exist-404-test` 返回 framework chrome（`404: This page could not be found.`），无品牌口吻、无回首页 CTA；错误路径完全没设计。
- **文章分享路径假大型卡**：`twitter:card=summary_large_image`，但 0/39 篇 frontmatter 有 `ogImage`，`generateMetadata` 在缺失时把 `images` 设为 `undefined`；抽样 `/articles/agent-loop/` 无 `og:image` / `twitter:image`。
- **首页 /articles 列表 OG 已 OK**：`/og-image.png` 真实 1200×630 PNG（28688 bytes），layout/articles/skills 元数据齐全；缺口在「单篇回落」。
- **过滤空状态是「暂无数据」反模式**：分类筛空后只剩 `Nothing here yet.` / `暂无文章。`，无「清筛选」CTA。
- **完成度细节半成品**：`scroll-behavior` + 部分 `prefers-reduced-motion` 已有；缺 `::selection`、`:focus-visible`、长文阅读进度；无 `error.tsx`。

---

## 2. Matrix（手册条目 × 本站）

| # | 条目 | 状态 | 证据 | 杠杆 | 成本 |
|---|---|---|---|---|---|
| 1 | 骨架屏 | N/A | 静态 SSG，无 dashboard 加载 | L | — |
| 2 | Optimistic UI | N/A | 无写路径 / 点赞等 | L | — |
| 3 | 劳动幻觉进度 | N/A / won't | 静态站；brief 禁止假进度 | L | — |
| 4 | 本地先渲染 | N/A | 无远端列表请求 | L | — |
| 5 | Undo Toast | N/A | 无破坏性写操作 | L | — |
| 6 | Autosave | N/A | 无编辑器 | L | — |
| 7 | Soft-delete | N/A | 无后端 | L | — |
| 8 | 预填示例 | N/A | 非 SaaS onboarding | L | — |
| 9 | 完成态庆祝 | N/A | 无任务完成流 | L | — |
| 10 | 离开设计 | N/A | 无订阅/账号 | L | — |
| 11 | 错误文案 | **gap** | 无 `src/app/error.tsx`；404 为默认 framework | H | 咖啡 |
| 12 | 按钮写后果 | N/A | 无破坏性 modal | L | — |
| 13 | 空状态+CTA | **gap** | `ArticlesContent.tsx:89-92`；`en.ts:37` `Nothing here yet.` | H | 咖啡 |
| 14 | Status Page | won't | 静态 brochure；假状态页有害 | L | — |
| 15 | Changelog | won't / soft | 无产品 changelog 需求；文章日期已是「活着」信号 | M | 下午+ |
| 16 | 纯文本邮件 | N/A | 无事务邮件 | L | — |
| 17 | 动态 OG | **部分 OK / gap** | Home/articles index：`layout.tsx:68-74`、`articles/page.tsx:17-23`、live PNG 200；**单篇无 fallback**：`[slug]/page.tsx:153-162`；live agent-loop 无 og:image | H | 咖啡（fallback） |
| 18 | 定价三档 | N/A | 无定价页 | L | — |
| 19 | Powered by | N/A | 非可分享 widget 产品 | L | — |
| 20 | 分享插队 | won't | 非冷启动 waitlist | L | — |
| 21 | Cmd+K | won't | brief + 手册：线性阅读站不硬上 | L | — |
| 22 | 微反馈三档 | 部分 OK | `ClickRipple`、按钮 hover；缺统一 focus ring | M | 咖啡 |
| 23–27 | 后端条目 | N/A | 静态导出，无支付/队列/flag/DB | L | — |
| 28–29 | 埋点/Replay | won't | 已有 GA；加 5 事件不改本周决策 | L | — |
| 30 | clone && make | 部分 OK | `package.json` scripts；非本任务范围 | L | — |
| 31 | Request ID | N/A | 无反馈表单后端 | L | — |
| 32 | 安全基线 | 部分 OK | `public/_headers`：XFO/nosniff/Referrer/Permissions；无 CSP/HSTS（CF 层） | M | 下午 |
| 33 | 双端校验 | N/A | 无写路径 | L | — |
| 34–35 | AI 流式/引用 | N/A | 本站非 AI 产品壳 | L | — |
| 36–38 | 判断层 | OK 姿态 | 本次按三问砍 scope | — | — |
| 附 A.1 | 滚动进度 | **gap** | 长文存在（如 universe-mayor 555 行）；无 progress bar | M–H | 咖啡 |
| 附 A.2 | 进视口 reveal | won't | 首页已有 WebGL；再加易噪 | L | — |
| 附 A.3 | 章节点 | won't | 非 one-pager 文档叙事页 | L | — |
| 附 A.4 | 噪点覆盖 | won't | 装饰≠杠杆；与现有纸感冲突风险 | L | — |
| 附 A.5 | selection/smooth/reduced-motion | **部分 gap** | `globals.css:611-618` 有 smooth+reduce；**无 `::selection` / `:focus-visible`** | H | 咖啡 |
| — | 自定义 404 | **gap** | live 404 = Next default；无 `not-found.tsx` | H | 咖啡 |
| — | Lang/theme chrome | OK | `SiteSwitcher.tsx`：`LanguageIcon`（非 globe）、单图标主题、40×40 | — | — |
| — | i18n flash gate | OK | `layout.tsx:180-184` + pending CSS | — | — |
| — | Hash nav | OK | `TopBar.tsx:34-48` in-page scroll | — | — |

---

## 3. P0 list（最多 5，按杠杆排序）

| Rank | Win | 手册映射 | 成功信号 | 预估 |
|---|---|---|---|---|
| 1 | 品牌 `not-found` + 明确回首页 CTA | 11 / 峰终 | 404 页 3 秒内可读懂 + 一点能回家 | 30–45m |
| 2 | `error.tsx`：发生了什么 + 重试/回家 | 11 | 客户端错误不再裸 framework 文案 | 20–30m |
| 3 | 文章 OG fallback → `/og-image.png` | 17 | 无 `ogImage` 的文章 HTML 仍带 og/twitter image | 15m |
| 4 | 分类筛空空状态：说明 + 清筛选 CTA | 13 | 空列表不再像 bug | 20m |
| 5 | `::selection` + `:focus-visible` + 文章页滚动进度（`prefers-reduced-motion` 关进度动画） | 附 A.5 / 22 / 附 A.1 | 选区/键盘焦点立刻可感；长文有位置感 | 45–60m |

---

## 4. Won't do（通不过三问 / 与本站冲突）

- **3 劳动幻觉假进度**、**14 Status Page**、**21 Cmd+K**、**20 分享插队**、**18 定价** — brief / 手册明确不适合静态内容站。
- **15 独立 Changelog 产品页** — 文章日期 + RSS 已是诚实「活着」信号；再做 changelog 是文档负债。
- **附 A 全套 one-pager**（reveal / 章节点 / 噪点）— 首页不是营销长页；WebGL 已占动效预算。
- **动态 per-article satori OG** — 真杠杆，但 > 一个下午；本轮只做默认图 fallback。
- **CSP 收紧 / HSTS** — 安全有价值，但需仔细测 GA/字体；非「3 秒可感」关键路径，本轮砍。
- **重写文章内容 / 新 design system / 新依赖** — out of scope。
- **Backend 条目 23–27、AI 34–35、埋点 28–29** — 无产品面。

Skills 优先于手册冲突点：语言图标用 `LanguageIcon`（非 globe）— 已符合，保持。

---

## 5. Stress-test note（手册帮助 vs 噪音）

**帮了忙：**
- **三问过滤器**直接砍掉 Cmd+K / Status / 假进度 / 全套附 A，避免把压力测试做成 redesign。
- **内容站 pack（17·13·附 A 按需）**精准命中本站真实缺口：分享 OG、空状态、阅读完成度。
- **#11 错误文案**把「没有 not-found/error」从「以后再说」抬成峰终 P0。

**噪音 / 摩擦：**
- SaaS/backend 大段（1–7、23–27）对本站几乎全 N/A — agent 仍需扫完，信噪比低；附 B pack 才是有效入口。
- **#15 Changelog** 对内容站语义模糊（产品 changelog vs 更新笔记）；易诱导向「再建一页」。
- **#17「动态 OG」**措辞偏 satori；对本站最高杠杆其实是「缺图时回落到真实 PNG」，不是立刻上动态渲染。

**结论：** 手册作为**过滤+选型**工具有效；作为**38 条 checklist 打勾**无效。Starter pack + 三问 > 全表扫描。

---

## 已改

PASS 2 已落地（5/5 P0）：

| P0 | 改动 | 文件 |
|---|---|---|
| 1 | 品牌 404 + 回首页 / 文章 CTA | `src/app/not-found.tsx`；i18n keys `not_found.*` |
| 2 | 错误页：事实 + 重试 + 回家 | `src/app/error.tsx`；i18n keys `error.*` |
| 3 | 文章 OG fallback → `/og-image.png` | `src/app/articles/[slug]/page.tsx` `generateMetadata` |
| 4 | 分类筛空：说明 +「显示全部」CTA | `ArticlesContent.tsx`；`articles.empty_filter` / `clear_filter` |
| 5 | `::selection`、`:focus-visible`、文章阅读进度（reduced-motion 隐藏） | `globals.css`；`ReadingProgress.tsx` → `ArticleContent.tsx` |

**未改（故意）：** `content/articles/*` 预存在 dirt；动态 per-article OG craft；CSP；Cmd+K；changelog 页。

---

## Stress report（PASS 3）

### 手册条目实际开火

- **#11** → not-found + error
- **#13** → articles filter empty
- **#17** → OG fallback（非 satori；诚实默认图）
- **附 A.1 / A.5 / #22** → progress + selection + focus-visible

### 验证

- `eslint` on touched TSX：pass
- `tsc --noEmit`：仅预存 `.next` → 已删 `preview/page` 残留报错（与本 diff 无关）
- **未**跑 full `next build`（低–中风险 chrome/metadata；CF Preview 为部署门）
- **未**在 deploy 后 curl 验证 live 404/OG（需 push 后）

### 手册压力测试 verdict

| 维度 | 结论 |
|---|---|
| 过滤力 | 强：三问 + 内容站 pack 把 38 条压到 5 个可感知 P0 |
| 噪音 | SaaS/backend 大段对本站几乎全 N/A；全表扫描浪费 |
| 措辞陷阱 | #17「动态 OG」易诱导向过度工程；本站真赢是 fallback |
| 与 skills | 无冲突；LanguageIcon / Lora+Poppins / 不碰文章内容均遵守 |
| 可证伪 | 推送后：404 HTML 非 `next-error-h1`；任一无 ogImage 文章 HTML 含 `og:image` → `/og-image.png` |

**Confidence：** high（缺口有 live/code 证据；改动面小）  
**Owner：** Liz（是否接受阅读进度条视觉权重）  
**Next checkpoint：** push 后 curl 404 + 一篇无 frontmatter ogImage 的文章 meta
