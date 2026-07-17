# lizliz.xyz 全站结构化审计报告

**审计日期：** 2026-07-17  
**项目路径：** `/home/ubuntu/projects/lizliz.xyz`  
**生产域名：** https://lizliz.xyz  
**技术栈：** Next.js 16.2.4 + React 19.2.4 + Tailwind CSS 4 + TypeScript 5，Cloudflare Pages 静态导出（`output: "export"`，`trailingSlash: true`）  
**审计方式：** 只读源码审查 + 本地 `npm run build` / `typecheck` / `lint` + 生产环境 `curl` 抽样验证  

---

## 1. 执行摘要（5 条最关键发现）

| # | 发现 | 影响 | 位置 |
|---|------|------|------|
| **P0-1** | **RSS 已声明但不存在**：`layout.tsx` 声明 `alternates` 指向 `https://lizliz.xyz/rss.xml`，构建产物无此文件，线上返回 **404** | 订阅失效、爬虫/聚合器信任度下降、metadata 与真实资源不一致 | `src/app/layout.tsx:81-85`；线上 `curl -I` 验证 404 |
| **P0-2** | **全站 OG/Twitter 图片缺失**：根 `metadata.openGraph` 无 `images` 字段；`twitter.card` 设为 `summary_large_image` 却无对应图片 | 社交分享预览空白或降级，CTR 受损 | `src/app/layout.tsx:54-68` |
| **P0-3** | **安全响应头严重不足**：`public/_headers` 仅配置 `resume.pdf` 的 `Content-Disposition`；无 CSP、HSTS、X-Frame-Options、Permissions-Policy | XSS/点击劫持/嵌入风险无项目级防护；依赖 Cloudflare 默认头（仅见 `x-content-type-options`、`referrer-policy`） | `public/_headers:1-2` |
| **P0-4** | **Sitemap 遗漏播客页**：`sitemap.ts` 仅含 `/`、`/articles` 与文章 slug，不含 `/podcast/worth-a-lifetime` | 播客内容发现性弱，与 breadcrumb/schema 中引用的 `/podcast` 不一致 | `src/app/sitemap.ts:7-27` |
| **P0-5** | **Google Search Console 验证字段疑似填错**：`verification.google` 值为 `G-TXVLTJJ878`（GA4 Measurement ID 格式），非典型 Search Console 验证码 | 站点所有权验证可能从未成功 | `src/app/layout.tsx:87-89` |

**整体判断：** 站点内容质量与文章页 SEO 基础扎实（per-article metadata、JSON-LD、canonical 齐全），但**基础设施层（RSS、OG 图、安全头、sitemap 完整性、GSC 验证）存在多处「声明了但未交付」的缺口**。性能与 bundle 体积对个人站可接受；Three.js 背景在静态导出架构下可行，但应遵循 skill 中的轻量集成模式，而非 `/preview` 中的 CDN 流体仿真方案。

---

## 2. 逐维度详细分析

### 2.1 SEO / 元数据

#### 2.1.1 根布局 metadata

| 检查项 | 状态 | 说明 | 引用 |
|--------|------|------|------|
| `title` / `description` / `keywords` | ✅ 有 | 默认 title template、`description`、8 个 `keywords` | `src/app/layout.tsx:33-48` |
| `metadataBase` | ✅ | `https://lizliz.xyz` | `src/app/layout.tsx:32` |
| Open Graph | ⚠️ 缺图 | 有 `title`、`description`、`url`、`siteName`、`locale`、`type`，**无 `images`** | `src/app/layout.tsx:54-62` |
| Twitter Card | ⚠️ 配置矛盾 | `card: "summary_large_image"` 但无 `images` | `src/app/layout.tsx:63-68` |
| `robots` | ✅ | `index/follow`，含 `googleBot` 细项 | `src/app/layout.tsx:70-79` |
| `canonical` | ✅ | 根路径 canonical | `src/app/layout.tsx:81-82` |
| RSS alternate | ❌ 死链 | 声明 RSS，无生成逻辑/文件 | `src/app/layout.tsx:83-85` |
| Google 验证 | ❌ 疑似错误 | `G-TXVLTJJ878` 为 GA ID 格式 | `src/app/layout.tsx:87-89` |
| `html lang` | ⚠️ 静态默认 en | 根 `<html lang="en">`；中文依赖客户端 `LangProvider` 切换 | `src/app/layout.tsx:127-128`；`src/i18n/index.tsx:41-44` |
| `hreflang` | ❌ 无 | 双语站无 `hreflang` / `alternates.languages` | `src/app/layout.tsx:81-86` |

#### 2.1.2 文章页 metadata（质量较好）

- 每篇文章有独立 `generateMetadata`：`title`、`description`、`keywords`、`canonical`、`openGraph`、`twitter` | `src/app/articles/[slug]/page.tsx:124-175`
- 文章级 `ogImage` 可选；未设置时 OG 仍无图 | `src/app/articles/[slug]/page.tsx:153-155`
- JSON-LD：`Article` + `BreadcrumbList` | `src/app/articles/[slug]/page.tsx:194-246`、`250-260`
- ⚠️ `wordCount` 传入 schema 为**中文字符串**（如 `"5k 字"`），非 Schema.org 期望的整数 | `src/app/articles/[slug]/page.tsx:12-18`、`218`
- ⚠️ `publisher` 类型为 `Person` 而非 `Organization`/`NewsMediaOrganization` | `src/app/articles/[slug]/page.tsx:207-210`

#### 2.1.3 播客页 metadata

- 有完整 `generateMetadata`，含 `openGraph.audio` | `src/app/podcast/[slug]/page.tsx:89-143`
- ⚠️ `ogImage: ""` 空字符串写入 frontmatter，可能被当作无效图片 URL | `content/podcast/worth-a-lifetime.md:28`；`src/app/podcast/[slug]/page.tsx:118-120`
- ⚠️ `duration: "23:24"` 写入 schema 的 `timeRequired`/`duration` 字段，非 ISO 8601（应为 `PT23M24S`） | `content/podcast/worth-a-lifetime.md:6`；`src/app/podcast/[slug]/page.tsx:170-171`
- JSON-LD breadcrumb 引用 `https://lizliz.xyz/podcast`，**该路由不存在** | `src/app/podcast/[slug]/page.tsx:202-206`

#### 2.1.4 列表页 / 首页 metadata 缺口

| 页面 | metadata | 问题 |
|------|----------|------|
| `/` | 继承 layout 默认 | 无页面级 `export const metadata`；title 为 `"Home \| Liz"` 而非品牌 tagline | `src/app/page.tsx:1-11` |
| `/articles` | 继承 layout 默认 | 无独立 title/description/canonical | `src/app/articles/page.tsx:1-7` |
| `/preview` | 有独立 metadata | 实验模板页**可被索引**，与主站重复品牌内容 | `src/app/preview/page.tsx:3-7` |

#### 2.1.5 Sitemap

```7:27:src/app/sitemap.ts
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(), ... },
    { url: absoluteUrl("/articles"), ... },
  ];
  const articleRoutes = getArticles().map(...);
  return [...staticRoutes, ...articleRoutes];
```

- ✅ 36 篇文章 slug 均会进入 sitemap（build 输出 44 页含 36 文章）
- ❌ **无播客路由** `/podcast/worth-a-lifetime`
- ❌ 无 `/preview`（通常不应收录，可接受）
- ✅ `lastModified` 使用 `updatedDate || publishedDate` | `src/app/sitemap.ts:22`

#### 2.1.6 robots.txt

- ✅ `allow: "/"`，`sitemap` 指向 `absoluteUrl("/sitemap.xml")` | `src/app/robots.ts:7-13`
- ⚠️ 未 `disallow` `/preview` 或 `/resume.pdf`

#### 2.1.7 `_headers` / `_redirects`

**`_headers`** — 仅一条规则：

```1:2:public/_headers
/resume.pdf
  Content-Disposition: inline
```

缺失（项目级未配置）：`Content-Security-Policy`、`Strict-Transport-Security`、`X-Frame-Options` / `frame-ancestors`、`Permissions-Policy`、`X-XSS-Protection`（已废弃但仍有旧客户端）、全站 `Cache-Control` 策略。

**线上抽样**（2026-07-17）：`curl -sI https://lizliz.xyz/` 仅见 Cloudflare 默认的 `x-content-type-options: nosniff`、`referrer-policy: strict-origin-when-cross-origin`，**无 CSP/HSTS/X-Frame-Options**。

**`_redirects`**：

```1:1:public/_redirects
/resume /resume.pdf 301
```

- ✅ 简历短链重定向合理
- ⚠️ 无 `www` ↔ apex、无旧路径迁移规则（若未来有 URL 变更需补充）

#### 2.1.8 RSS

- ❌ 仓库内 **0** 个 `rss.xml` / `rss.ts` / feed 生成脚本
- ❌ `out/rss.xml` 构建后不存在
- ❌ 线上 https://lizliz.xyz/rss.xml → **HTTP 404**
- 声明位置：`src/app/layout.tsx:83-85`；`/preview` 页脚也链接 `/rss.xml` | `src/app/preview/page.tsx:963`

#### 2.1.9 Schema.org 质量

**Person schema** | `src/app/layout.tsx:92-107`

- ✅ 含 `name`、`url`、`sameAs`（GitHub/X/即刻）、`jobTitle`
- ⚠️ `worksFor.name` 为 `lizliz.xyz`（域名作组织名，语义略怪）

**WebSite schema** | `src/app/layout.tsx:109-118`

- ✅ 基本字段齐全
- ❌ `SearchAction` 目标 `https://lizliz.xyz/articles?q={search_term_string}` — **站内无搜索实现**，`/articles` 页无 `q` 查询处理 | `src/app/articles/ArticlesContent.tsx:11-18`

**文章 Article schema** — 见 2.1.2  
**播客 PodcastEpisode schema** — 见 2.1.3

#### 2.1.10 GEO（生成式引擎优化）观察

- 文章 `description` 质量普遍较高，利于 AI 摘要引用
- 缺少站点级 FAQ/HowTo 等结构化数据（非必须）
- 双语内容**未在 HTML 层区分**（仅客户端切换），爬虫默认抓取英文壳 + 英文 i18n 默认值 | `out/index.html` 预渲染为 `"building at the edge of agents, markets, and words."`
- `public/agents.md` 存在，可供 AI 爬虫读取（未在本次审计中逐行审查）

---

### 2.2 页面结构与路由

| 路由 | 实现 | 渲染模式 | SEO/结构问题 |
|------|------|----------|--------------|
| `/` | `page.tsx` → `HomeContent.tsx` | Server 取数 + Client 展示 | 预渲染 HTML **含** h1/tagline（build 验证 ✅）；i18n 仅客户端 | `src/app/page.tsx:6-10`；`src/app/HomeContent.tsx:64-85` |
| `/articles` | `ArticlesContent.tsx` | 同上 | 无页面 metadata；分类筛选为客户端 state | `src/app/articles/page.tsx:4-6` |
| `/articles/[slug]` | `page.tsx` + `ArticleContent.tsx` | SSG + 服务端 Markdown | 文章 metadata/JSON-LD 在 server 组件 ✅ | `src/app/articles/[slug]/page.tsx:178-287` |
| `/podcast/[slug]` | `page.tsx` + `PodcastContent.tsx` | SSG | 无 `/podcast` 索引页；breadcrumb 死链 | `src/app/podcast/[slug]/page.tsx:197-214` |
| `/preview` | 内联 ~1700 行 HTML + Three.js CDN | 静态 | 实验页可索引；与主站品牌重复 | `src/app/preview/page.tsx:9-16` |
| `/resume.pdf` | 静态文件 | — | TopBar 隐藏 | `src/components/TopBar.tsx:12` |

**首页 Client 组件 SEO 评估：**  
`HomeContent.tsx` 标有 `"use client"`，但 Next.js 静态导出仍将其**预渲染进 HTML**（`out/index.html` 含 `<h1>LizLiz</h1>` 与文章列表链接）。主要风险不在「爬虫看不到内容」，而在 **i18n/主题状态仅客户端生效**，导致中文用户与爬虫看到的默认语言不一致。

**路由完整性缺口：**

- ❌ 无 `src/app/podcast/page.tsx`（播客列表）
- ❌ 无站内搜索 `/articles?q=`
- ⚠️ `trailingSlash: true`（`next.config.ts:5`）— 外链需统一带尾斜杠，否则依赖 Cloudflare/Next 重定向行为

---

### 2.3 性能

#### 2.3.1 CSS

- `globals.css`：**507 行** | `src/app/globals.css:1-507`
- 构建后 CSS 约 **52KB**（未压缩传输体积需看 brotli/gzip）
- ⚠️ 含播客播放器样式（`.podcast-player-card` 等 ~80 行），但当前 `PodcastContent.tsx` **未使用这些 class**，属死代码 | `src/app/globals.css:426-507` vs `src/app/podcast/[slug]/PodcastContent.tsx`
- ✅ Tailwind v4 `@import "tailwindcss"` + `@theme inline` 结构清晰 | `src/app/globals.css:1-18`

#### 2.3.2 字体

三种 Google Font（`next/font`）：

| 字体 | 字重 | 变量 | 引用 |
|------|------|------|------|
| Poppins | 400, 500, 600 | `--font-poppins` | `src/app/layout.tsx:8-13` |
| Lora | 400, 500 | `--font-lora` | `src/app/layout.tsx:15-20` |
| Instrument Serif | 400 | `--font-instrument-serif` | `src/app/layout.tsx:22-27` |

- 构建时预加载 **5 个 woff2**（见 `out/index.html` link preload）
- **评估：** 三字体分工明确（UI / 正文 / 展示标题），对个人站合理；若追求极致 LCP 可考虑将 Poppins 600 减为 500-only，或 subset 增加 `latin-ext`（当前仅 `latin`）
- 正文字体为 Lora serif（`globals.css:80`），与 Poppins 混用 — 有意为之的设计选择

#### 2.3.3 首页 iframe 像素动画

```88:94:src/app/HomeContent.tsx
        <section className="home-animation-shell" aria-label="Forest path pixel animation">
          <iframe
            src="/assets/animations/forest-path-companions.html"
            ...
            loading="lazy"
          />
```

- iframe 文件 **28KB**（独立 canvas 动画，非 Three.js）| `public/assets/animations/forest-path-companions.html`
- `loading="lazy"`：对**首屏上方**的 iframe **几乎无效**（浏览器仍可能立即加载 above-the-fold iframe）；不应依赖其延迟加载 | `src/app/HomeContent.tsx:93`
- **CLS 风险：低** — CSS 已设 `aspect-ratio: 1/1` 与 `clamp` 宽度 | `src/app/globals.css:414-417`
- iframe 内动画使用 `requestAnimationFrame` 持续运行 — **额外 CPU/GPU 开销**，无 `prefers-reduced-motion` 门控（父页面有主题 reduced-motion 无关）| `public/assets/animations/forest-path-companions.html`
- `home-animation-shell::after` 使用 `backdrop-filter: blur` — 合成层开销 | `src/app/globals.css:405-406`

#### 2.3.4 JavaScript Bundle（静态导出）

本地 build 后 `out/_next/static/chunks` 合计约 **744KB**（未 gzip）；最大单 chunk **224KB**。

| Chunk | 大小 | 可能来源 |
|-------|------|----------|
| `0771~t619eth2.js` | 224K | React + Next runtime |
| `0a5vz1y9zqwm7.js` | 148K | 共享依赖 |
| `03~yq9q893hmn.js` | 112K | 客户端 hydration |

- 播客页引入 `@heroicons/react` 全套 outline 图标（9 个）— 树摇后仍增加播客路由 chunk | `src/app/podcast/[slug]/PodcastContent.tsx:5-15`
- 文章页 `react-markdown` + `rehype-raw` + `remark-gfm` 在 server 侧，不进入主 bundle ✅

#### 2.3.5 其他性能相关

| 项目 | 说明 | 引用 |
|------|------|------|
| 图片 | `images: { unoptimized: true }` — 无 Next Image 优化 | `next.config.ts:6` |
| 文章图 | 手动 avif/webp + `ARTICLE_IMAGE_SIZES` | `src/app/articles/[slug]/page.tsx:67-108` |
| GitHub heatmap | 客户端 `fetch("/github-heatmap.json")`，失败静默 | `src/components/GithubHeatmap.tsx:29-34` |
| 播客 MP3 | **16.8MB** | `public/audio/podcast/worth-a-lifetime.mp3` |
| GA | `afterInteractive` 加载，非阻塞 | `src/app/layout.tsx:161-170` |
| Lighthouse 预测问题点 | LCP（字体 preload 多）、TBT（首页 iframe 动画 + InkRipple）、CLS（低）、SEO（RSS/OG）、Best Practices（安全头） | 综合推断 |

---

### 2.4 安全

#### 2.4.1 `dangerouslySetInnerHTML`

| 位置 | 内容 | XSS 风险 |
|------|------|----------|
| `layout.tsx:136-144` | 主题初始化 IIFE（硬编码） | **低** — 无用户输入 |
| `layout.tsx:148-156` | `JSON.stringify(personSchema/websiteSchema)` | **低** — 静态对象 |
| `articles/[slug]/page.tsx:254-260` | 文章 JSON-LD | **低** — 来自 frontmatter，非用户提交 |
| `podcast/[slug]/page.tsx:223-229` | 播客 JSON-LD | **低** |
| `preview/page.tsx:12-14` | 巨大内联 HTML 字符串 | **低**（静态）但**维护风险极高** |

#### 2.4.2 Markdown XSS 面

- `rehype-raw` 允许文章 Markdown 内嵌原始 HTML | `src/app/articles/[slug]/page.tsx:276`
- 内容来源为**作者自有仓库**，非用户生成 — 风险可控，但任何未来「接受外部投稿」需移除 `rehype-raw` 或做 sanitize
- `remark-highlight.ts` 对 `==highlight==` 做了 HTML escape ✅ | `src/lib/remark-highlight.ts:41-46`

#### 2.4.3 环境变量 / 第三方脚本

- `NEXT_PUBLIC_GA_ID` 暴露 — **正常**，GA measurement ID 本就公开 | `src/app/layout.tsx:29`、`162-169`
- 无服务端 secret 硬编码 ✅
- GA 脚本来源 `googletagmanager.com` — 需 CSP 时加入 allowlist

#### 2.4.4 响应头 / 嵌入

- 项目 `_headers` 严重不足（见 2.1.7）
- 首页 iframe 加载**同源** `/assets/animations/...` — 无第三方 iframe 风险
- `/preview` 模板从 jsDelivr CDN 加载 Three.js — **若上线需 CSP `script-src` 允许 cdn.jsdelivr.net** | `src/app/preview/page.tsx:34-39`

#### 2.4.5 其他

- 外部链接普遍使用 `rel="noopener noreferrer"` ✅ | `src/app/HomeContent.tsx:36`、`src/app/articles/[slug]/page.tsx:58-59`
- 简历 easter egg：三连击跳转 `/resume.pdf` | `src/features/resume/ResumeEasterEgg.tsx:15-17` — 有意设计，非漏洞

---

### 2.5 代码质量

#### 2.5.1 TypeScript

- `npm run typecheck` — **通过** ✅
- 源码中**无** `: any` 类型 ✅（`grep` 全 `src/` 无匹配）
- `remark-highlight.ts` 使用 `unknown[]` 处理 AST 拼接 — 合理 | `src/lib/remark-highlight.ts:15-36`

#### 2.5.2 ESLint

```
src/app/articles/[slug]/page.tsx:31:11  warning  'node' is assigned a value but never used
src/app/articles/[slug]/page.tsx:36:5   warning  Unused eslint-disable directive
```

共 2 warnings，0 errors。

#### 2.5.3 React 模式

| 检查项 | 状态 | 引用 |
|--------|------|------|
| `key` prop | ✅ | 列表均用 `slug`/`url`/`index` | `HomeContent.tsx:118-119`、`GithubHeatmap.tsx:123-124` |
| `useEffect` 依赖 | ✅ 基本正确 | `PodcastContent.tsx:158-165`、`169-189` |
| StrictMode 双挂载 | ⚠️ 未显式防护 | 若未来加 Three.js 组件需 `initedRef` 守卫（见 skill） |
| 死代码 | ⚠️ | `globals.css` 播客样式未使用；i18n 部分 key 未引用 | 见 2.5.4 |

#### 2.5.4 i18n 完整性

`zh.ts` 通过 `Translations` 类型约束，与 `en.ts` **key 完全对齐** ✅ | `src/i18n/zh.ts:3-33`

**未使用的 i18n key（定义了但无组件引用）：**

- `nav.home`、`nav.articles` | `src/i18n/en.ts:5-6`
- `section.find_me` | `src/i18n/en.ts:13`
- `projects.pep_words.description`、`projects.brain_rush.description` | `src/i18n/en.ts:21-22`  
  （项目描述实际来自 `project-previews.json` | `src/lib/projects.ts:12-13`）

**硬编码未 i18n 的 UI 文案：**

| 文案 | 位置 |
|------|------|
| `Listen →` | `src/app/HomeContent.tsx:181` |
| `Older` / `Newer` / `You may like` / `min read` | `src/app/articles/[slug]/ArticleContent.tsx:66-98`、`133` |
| `Home` / `Podcast` / `Back to Home` / 播客 footer 中文 | `src/app/podcast/[slug]/PodcastContent.tsx:214-228`、`531`、`558-583` |
| GitHub heatmap 英文 | `src/components/GithubHeatmap.tsx:68-74` |
| 分类按钮 `心理/技术/社会/商业` | `src/app/articles/ArticlesContent.tsx:8-9` — **硬编码中文，英文界面也显示中文** |

#### 2.5.5 组件结构

- 清晰分层：`lib/` 数据、`components/` 通用、`features/resume/` 特性隔离 ✅
- ⚠️ 播客数据加载逻辑重复：`podcast/[slug]/page.tsx` 内联 `getPodcast` 与 `src/lib/podcast.ts` 部分重复 | 对比 `src/app/podcast/[slug]/page.tsx:69-78` vs `src/lib/podcast.ts:38-54`
- ⚠️ `preview/page.tsx` 单文件 ~1696 行 HTML 字符串 — 严重违反可维护性

#### 2.5.6 Accessibility

| 项目 | 状态 | 引用 |
|------|------|------|
| 动画 iframe `title` + `aria-label` | ✅ | `src/app/HomeContent.tsx:88-91` |
| 主题/语言切换 `aria-label` | ✅ | `src/components/SiteSwitcher.tsx:46-47`、`60-61` |
| 播客播放器控件 `aria-label` | ✅ | `PodcastContent.tsx:299`、`318`、`329-333` |
| 进度条 `role="slider"` | ✅ 但缺 `aria-orientation` | `PodcastContent.tsx:328-334` |
| 项目图标 `alt=""` + `aria-label` on parent | ✅ 模式正确 | `HomeContent.tsx:38-44` |
| 简历 easter egg `aria-label="Hidden resume trigger"` | ⚠️ 对屏幕阅读器可见 | `src/features/resume/ResumeEasterEgg.tsx:26` |
| 分类筛选 `<button>` 无 `aria-pressed` | ⚠️ | `src/app/articles/ArticlesContent.tsx:41-70` |
| 焦点可见性 | ⚠️ 部分按钮仅 `hover:opacity`，无 `focus-visible` 环 | 全站 inline style 按钮 |

---

### 2.6 内容质量

#### 2.6.1 文章 frontmatter 规范性

共 **36** 篇文章。

| 字段 | 覆盖情况 | 问题 |
|------|----------|------|
| `title` | 36/36 | — |
| `description` | 36/36 | 质量普遍高 |
| `date` / `published_date` | 混用 | 旧文用 `date`，新文两种都有；`articles.ts` 已兼容 | `src/lib/articles.ts:49-50` |
| `publish: true` | 21 篇有 | **代码不读取 `publish`**，仅读 `draft` | `src/lib/articles.ts:65` vs `content/articles/agent-loop.md:2` |
| `categories` | **16/36** | 20 篇文章无分类，在 `/articles` 筛选器中只能出现在「全部」 | `src/app/articles/ArticlesContent.tsx:15-17` |
| `tags` | 大部分有 | — |
| `keywords` | 部分有 | 未设置时 fallback 到 `tags` | `src/app/articles/[slug]/page.tsx:136` |
| `ogImage` | 极少 | 社交分享依赖默认（无图） |

**frontmatter 风格分裂：** 2025-05 批次文章用 YAML 无引号 + `published_date: '2026-05-13'`；2026 批次中文长文用 `publish: true` + 完整 `description`。建议统一 schema，但非功能性 bug。

#### 2.6.2 播客 frontmatter

`worth-a-lifetime.md` 规范度较高，但 `ogImage: ""` 应删除或填真实 URL | `content/podcast/worth-a-lifetime.md:28`

#### 2.6.3 i18n 翻译质量

- `zh.ts` 翻译自然，与 `en.ts` 语义对齐 ✅
- 站点 UI 大量英文硬编码未走 i18n（见 2.5.4）— **双语体验不完整**
- 文章内容本身主要为中文，与 UI 语言切换独立 — 合理

#### 2.6.4 英文拼写 / 语法（抽样）

文章内容以中文为主；英文片段抽样（如 `agent-loop.md`）语法正确。  
UI 硬编码英文无拼写错误。  
⚠️ `agent-loop.md:19`："treating Peter **of** a glimpse" — 原文引用 Armin Ronacher tweet，属**引用保留**，非站点 UI 错误。

---

### 2.7 Three.js Landing Background 可行性评估

#### 2.7.1 当前状态

| 项目 | 状态 |
|------|------|
| `package.json` 依赖 | **无** `three` | `package.json:14-24` |
| 首页背景 | iframe 像素 canvas 动画（28KB 独立 HTML） | `src/app/HomeContent.tsx:88-94` |
| Three.js 先例 | `/preview` 页内嵌 **CDN** `three@0.175.0` + GPU 流体仿真 (~全屏) | `src/app/preview/page.tsx:34-39`、`974-1506` |
| 静态导出 | `output: "export"` — **不阻碍** client-only WebGL 组件 | `next.config.ts:4` |

#### 2.7.2 技术可行性：**可行**

1. 新建 `"use client"` 组件（如 `Landing3DBackground.tsx`），在 `useEffect` 中初始化 `WebGLRenderer`
2. 静态导出时该组件随页面预渲染占位，hydration 后启动 rAF 循环 — 与现有 `GithubHeatmap`、`InkRipple` 模式一致
3. `npm install three` + named imports，bundle 增加约 **50–60KB gzip**（skill 估算）；避免 preview 的 CDN 全量导入（150KB+ 且破坏 CSP）

#### 2.7.3 与现有 iframe 动画的共存策略

| 方案 | 优点 | 缺点 | 建议 |
|------|------|------|------|
| **A. 替换 iframe** | 单一视觉焦点；减少 iframe 进程开销；风格统一 | 失去当前像素画审美 | **推荐** — 若目标是现代 WebGL 背景 |
| **B. 并存（动画上 + 3D 下）** | 保留像素画特色 | 视觉拥挤；双重 GPU/CPU 消耗 | 不推荐 |
| **C. 3D 全屏背景 + 简化 hero** | 大气；内容浮于其上 | 需重构 `HomeContent` 布局 | 长期方向，可参考 `/preview` 信息架构但非其实现 |
| **D. 仅 `/preview` 路线** | 已验证流体效果 | CDN Three、无 lifecycle 门控、无 dispose、违反 skill 全部 checklist | **不推荐生产照搬** |

#### 2.7.4 推荐集成方式（基于 `threejs-landing-background` skill）

参考实现：`/home/ubuntu/projects/retail-space-planner/frontend/src/components/Landing3DBackground.tsx`

**最小可行路径：**

1. `npm install three` `@types/three`
2. 新建 `src/components/Landing3DBackground.tsx`（或 `src/features/landing/`）
3. 采用 skill 架构：**批处理 `LineSegments` + `TUNING` 配置 + CSS 渐变 fallback**
4. 必须实现：
   - `IntersectionObserver` + `visibilitychange` 门控 rAF
   - `prefers-reduced-motion` 静态帧
   - 完整 `dispose()` + `webglcontextlost` 处理
   - `initedRef` 防 StrictMode 双初始化
   - `powerPreference: 'low-power'`，`pixelRatio` cap 1.5
5. 在 `HomeContent.tsx` 中用绝对定位容器包裹，**替换** `home-animation-shell` section | `src/app/HomeContent.tsx:87-95`
6. 保留 `InkRipple` 作为前景交互层 — 与 3D 背景互补

**不应采用：** preview 页的 GPU 流体求解器（每帧 7+ render pass + 16 RT）— 对个人站 hero 过重；skill 明确列为 over-optimization 反模式。

#### 2.7.5 预期性能影响

| 指标 | iframe 像素动画 | skill 推荐 LineSegments 背景 | preview 流体方案 |
|------|-----------------|------------------------------|------------------|
| 额外 JS | ~0（独立文档） | +50–60KB gzip | +150KB+ CDN |
| GPU | 低–中（单 canvas） | 低（线框） | 高 |
| 移动端 | 可接受 | 需 IO 门控 | 易降帧/发热 |
| CSP | 简单 | 简单 | 需允许 CDN |

---

### 2.8 其他发现

| # | 发现 | 严重性 | 引用 |
|---|------|--------|------|
| 1 | **`/podcast` 索引页缺失**，schema breadcrumb 指向死链 | P1 | `src/app/podcast/[slug]/page.tsx:206` |
| 2 | **`/preview` 应加 `robots: { index: false }`** | P1 | `src/app/preview/page.tsx:3-7` |
| 3 | **`publish: true` frontmatter 无效** — 与 `draft` 字段语义重复且未实现 | P2 | `content/articles/agent-loop.md:2`；`src/lib/articles.ts:65` |
| 4 | **播客 `ogImage: ""`** 可能导致 OG 解析异常 | P2 | `content/podcast/worth-a-lifetime.md:28` |
| 5 | **GitHub heatmap 加载失败时静默返回 `null`** — 无错误态/骨架屏 | P3 | `src/components/GithubHeatmap.tsx:33-36` |
| 6 | **`ClickRipple` 全局 z-50** 覆盖全页 — 不影响功能，但高于 TopBar(z-40) 的墨水效果可能遮挡交互感知 | P3 | `src/components/ClickRipple.tsx:90` |
| 7 | **构建产物含未修改的生成文件** `github-heatmap.json`、`project-previews.json` 在 git 中为 modified | 信息 | git status |
| 8 | **`pei-kan-bing-api-gateway.md` 日期格式** `published_date: 2026-05-27` 无引号 — YAML 可解析但风格不一致 | P3 | `content/articles/pei-kan-bing-api-gateway.md:5` |
| 9 | **WebSite SearchAction 虚假端点** — 可能误导 Google Sitelinks Search Box | P2 | `src/app/layout.tsx:114-118` |
| 10 | **resume easter egg 使用 `window.location.assign`** 而非 Next `router.push` — 全页刷新，可接受 | P3 | `src/features/resume/ResumeEasterEgg.tsx:17` |

---

## 3. 优先级分级表

| 优先级 | 问题 | 建议动作 | 主要引用 |
|--------|------|----------|----------|
| **P0** | RSS 404 | 新增 `src/app/rss.xml/route.ts` 或 build 脚本生成 `public/rss.xml`；或移除 `alternates` 声明 | `src/app/layout.tsx:83-85` |
| **P0** | 全站 OG 图缺失 | 制作 1200×630 默认 `og-image.png`，写入 `openGraph.images` 与 `twitter.images` | `src/app/layout.tsx:54-68` |
| **P0** | 安全头不足 | 扩展 `public/_headers`：CSP、HSTS、`X-Frame-Options`、`Permissions-Policy`、静态资源 `Cache-Control` | `public/_headers:1-2` |
| **P0** | Sitemap 缺播客 | `sitemap.ts` 增加 `getPodcasts()` 路由 | `src/app/sitemap.ts:7-27` |
| **P0** | GSC 验证字段错误 | 将 `verification.google` 换为 Search Console meta token；`G-TXVLTJJ878` 保留给 GA | `src/app/layout.tsx:87-89` |
| **P1** | `/podcast` 死链 | 新增 `src/app/podcast/page.tsx` 或修正 breadcrumb 指向 `/` | `src/app/podcast/[slug]/page.tsx:202-206` |
| **P1** | `/preview` 可索引 | 添加 `robots: { index: false, follow: false }` | `src/app/preview/page.tsx:3-7` |
| **P1** | `/articles` 无 metadata | 添加 `export const metadata`（title/description/canonical） | `src/app/articles/page.tsx:1-7` |
| **P1** | 首页无页面级 metadata | 自定义 title/description 以匹配品牌定位 | `src/app/page.tsx` |
| **P1** | i18n 硬编码英文/中文混杂 | 将 `ArticleContent`、`PodcastContent`、`HomeContent` 硬编码文案迁入 `en.ts`/`zh.ts` | 见 2.5.4 |
| **P1** | 分类筛选器仅中文 | 分类名 i18n 或改用 slug + 显示名映射 | `src/app/articles/ArticlesContent.tsx:8-9` |
| **P2** | 20 篇文章无 `categories` | 补全 frontmatter 或移除分类筛选功能 | `content/articles/` |
| **P2** | 虚假 SearchAction | 实现站内搜索或从 WebSite schema 移除 `potentialAction` | `src/app/layout.tsx:114-118` |
| **P2** | `rehype-raw` XSS 面 | 保持现状（自有内容）；若开放投稿则换 `rehype-sanitize` | `src/app/articles/[slug]/page.tsx:276` |
| **P2** | 播客 schema duration 格式 | 转为 ISO 8601 `PT23M24S` | `src/app/podcast/[slug]/page.tsx:170` |
| **P2** | 合并播客数据层 | `page.tsx` 改用 `src/lib/podcast.ts`，删除重复 `getPodcast` | `src/app/podcast/[slug]/page.tsx:69-78` |
| **P2** | 清理未使用 CSS | 删除或接入 `globals.css:426-507` 播客样式 | `src/app/globals.css:426-507` |
| **P2** | ESLint warnings | 移除未使用 `node` 解构 | `src/app/articles/[slug]/page.tsx:31` |
| **P3** | 首页 iframe `loading="lazy"` 无效 | 若保 iframe：改 `loading="eager"` 或移除非首屏；若换 Three.js：删除 iframe | `src/app/HomeContent.tsx:93` |
| **P3** | 播客 MP3 体积 16MB | 考虑更低码率版本或流式托管 | `public/audio/podcast/worth-a-lifetime.mp3` |
| **P3** | 字体 preload 过多 | 减字重或合并显示字体 | `src/app/layout.tsx:8-27` |
| **P3** | `publish` vs `draft` 语义 | 统一为 `draft: true/false` 并文档化 | `src/lib/articles.ts:65` |
| **P3** | GitHub heatmap 空态 | 加 skeleton 或「unavailable」提示 | `src/components/GithubHeatmap.tsx:36` |
| **P3** | hreflang | 若认真做双语 SEO，加 `alternates.languages` | `src/app/layout.tsx` |

---

## 4. Three.js 可行性专项结论

**结论：在 `output: "export"` 的 Next.js 个人站上，集成 Three.js landing background 完全可行，且已有 `/preview` 页作为视觉原型验证——但不应将 preview 的 CDN 流体仿真方案直接搬入生产首页。**

### 4.1 架构兼容性

- 静态导出 ≠ 禁用 WebGL；只需 client component + 浏览器端渲染
- 与现有 `"use client"` 组件（`InkRipple`、`GithubHeatmap`、`SiteSwitcher`）同一范式
- 无需 Cloudflare Workers / Edge runtime

### 4.2 推荐方案（一句话）

**用 `three` npm 包 + skill 规定的轻量 `LineSegments` 背景替换 `HomeContent` 中的 iframe 像素动画，保留 CSS 渐变 fallback 与 `InkRipple` 前景交互。**

### 4.3 实施检查清单（摘自 skill）

- [ ] `npm install three` — 禁止 CDN `importmap`
- [ ] `Landing3DBackground.tsx`：`TUNING` + `CATEGORIES` + 批处理几何
- [ ] `IntersectionObserver` + `visibilitychange` + `prefers-reduced-motion`
- [ ] 完整 dispose + `webglcontextlost`
- [ ] `initedRef` StrictMode 守卫
- [ ] `powerPreference: 'low-power'`，`maxPixelRatio: 1.5`
- [ ] CSS 渐变底层 — WebGL 失败时 `return null`
- [ ] 替换 `src/app/HomeContent.tsx:87-95` iframe section
- [ ] 扩展 `public/_headers` CSP 允许 `'self'`（无需 CDN）

### 4.4 不推荐方案

- 照搬 `preview/page.tsx` 的 FluidPush + LensFlare 多 pass 仿真（GPU 重、无 lifecycle、CDN 依赖）
- 与 iframe 像素动画并存（双重动画竞争注意力与资源）
- 引入 React Three Fiber（单场景而言过重，skill 明确不推荐）

### 4.5 工作量粗估

| 任务 | 估时 |
|------|------|
| 基于 skill 模板新建背景组件 | 4–8h |
| 接入首页 + 主题色/暗色适配 | 2–4h |
| CSP/headers 更新 + 跨浏览器测试 | 2h |
| 删除 iframe + 清理 CSS | 0.5h |
| **合计** | **~1–2 天** |

---

## 5. 验证记录

| 命令/检查 | 结果 |
|-----------|------|
| `npm run build` | ✅ 成功，44 静态页 |
| `npm run typecheck` | ✅ 无错误 |
| `npm run lint` | ⚠️ 2 warnings |
| `curl -sI https://lizliz.xyz/rss.xml` | ❌ 404 |
| `curl -sI https://lizliz.xyz/` 安全头 | ⚠️ 仅 `x-content-type-options`、`referrer-policy` |
| `out/index.html` 预渲染 | ✅ 含 h1、文章链接、tagline |
| JS chunks 总量 | ~744KB（`out/_next/static/chunks`） |
| CSS 总量 | ~52KB |

---

## 6. 未验证项 / 剩余风险

- 未运行 Lighthouse/PageSpeed Insights 实机评分
- 未逐篇审查 36 篇文章正文事实准确性
- 未验证 Cloudflare Pages 对 `_headers` 的完整应用范围（仅抽样首页）
- 未测试 GA `NEXT_PUBLIC_GA_ID` 在生产是否实际配置（无 `.env` 访问）
- 未审查 `public/agents.md` 与线上 AI 爬虫行为

---

*报告由只读审计生成，未修改任何源代码。*
