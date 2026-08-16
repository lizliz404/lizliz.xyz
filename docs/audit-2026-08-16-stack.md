# lizliz.xyz 技术栈审计 — 2026-08-16

**日期：** 2026-08-16  
**源码：** `C:\Users\Lenovo\lizliz.xyz`（sparse：`src/` `docs/` 配置层；不含 `content/articles` 与 public 音频）  
**生产：** https://lizliz.xyz  
**方法：** 只读源码 + 既有审计。不重复 SEO。  
**范围外：** GA4 / GSC / OG 文案（见 08-07、08-08）

## Verdict

**Stay on Next static export. 不要迁 TanStack Start。**

机制一句话：Next 在这里只是 SSG 壳；Cloudflare Pages 托管静态文件。TanStack Start 是把 acriva 的 Workers+D1 叙事套到一个已经静态导出的个人站上。

## 1. 当前机制

- `next.config.ts`：`output: "export"` + `trailingSlash: true` + `images.unoptimized: true`
- 无 `wrangler.toml`、无 `functions/`、无 D1/R2、无 API route
- 边缘行为：`public/_headers`、`public/_redirects`
- 路由：`/`、`/articles`、`/articles/[slug]`、`/podcast/[slug]`、`/skills`、`/templates`
- 用到的 Next API 全是 build-time 或浏览器 chrome（Metadata、sitemap/robots、`next/font`、`next/script`、client 组件）
- **未使用：** SSR、RSC 流、Server Actions、middleware、`app/api`、`next/image` 优化器、ISR

## 2. Next 在本站的真实成本

不是 Vercel 账单，不是 SSR 算力。是：

1. App Router 的 server/client 边界，对纯静态站是演戏
2. `trailingSlash` / hash 丢失 / 中文 hydrate 闪屏 — 静态导出的疤
3. 锁进 Metadata / `next/font` / `_next/static` 缓存头
4. 构建比「Markdown → HTML」重一个数量级（含未使用的 `three`）

**不是成本：** 运行时 Node、D1、Workers CPU、Image CDN。

## 3. 对照

| 方案 | 得到 | 打碎 | 部署 |
|---|---|---|---|
| 留 Next SSG | 零迁移 | 壳偏重 | Pages Git（现状） |
| 纯 HTML + 脚本 | 最朴素 | metadata / sitemap / MD 管线要自建 | Pages |
| Astro | 内容站更贴 | 全站重写 | Pages |
| TanStack Start | 类型路由 + server fn | 全站 + 部署模型 | Workers（官方） |

acriva 用 Start + Workers + D1 是那个产品的机制。复制到本站无负载。

若哪天真受不了 Next 壳：目标是 **Astro + 仍走 Pages 静态**，不是 TanStack Start。

## 4. 什么情况下才重开讨论

本域出现写路径 / 鉴权 / D1。否则 kill。

## 5. 不做什么

- 不迁 Start
- 不迁 Workers
- 不把 i18n 改成 `/zh/`（除非产品要爬中文壳）
- 可选、可逆：删未被页面引用的 `HeroCanvas` / `three`

**置信度：** 高  
**Owner：** Liz  
**Next checkpoint：** 只有明确要在本域加服务端写路径时，才重开栈讨论。
