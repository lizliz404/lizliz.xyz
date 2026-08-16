# Agent-friendliness audit — lizliz.xyz (2026-08-16)

**Live：** https://lizliz.xyz  
**方法：** 源码 + 线上 curl（子代理 2026-08-16）  
**不实现 MCP。**

## Verdict

人搜和静态 HTML 抽取够用。Agent 发现面只有薄 `llms.txt` + 错位的 `agents.md`。无 markdown 镜像。Cloudflare 管理段拦住主要 AI 训练爬虫。**MCP 不是现在的缺口。**

「Agent MCP」拆开是两件事：

1. **Agent 侧：** Cloudflare Browser Run 把 CDP 暴露给 `chrome-devtools-mcp`（Claude / Cursor 当远程浏览器）。那是浏览别人网站的工具，本站不用接。
2. **站点侧：** WebMCP / 可读 markdown / `llms.txt`。本站该做的是让人读、让 agent 读，不是给自己挂一个空 MCP 服务器。

## 已有

- `/robots.txt`：Allow + sitemap；线上另有 CF Content-Signals（`search=yes, ai-train=no`）
- `/sitemap.xml`、`/rss.xml`、`/llms.txt`
- 文章是静态 HTML，不是空壳 SPA
- Person / WebSite / Article JSON-LD
- 根仓库 `AGENTS.md`（给写代码的人，正确）

## 缺口

| 级 | 项 | 说明 |
|---|---|---|
| P0 | `public/agents.md` | 整份全局 coding AGENTS.md，含 `/home/ubuntu/...` 运维路径。`/AGENTS.md` 404 |
| P1 | `llms.txt` 太薄 | 只列入口 HTML，不链单篇、不链 `.md` |
| P1 | 无 markdown 镜像 | `content/articles` 不进 `public/` |
| P1 | RSS 可能落后 | 子代理见 lastBuild 停在 2026-07-22 |
| P1 | sitemap 尾斜杠 | 与 `trailingSlash: true` 不一致 → 308 |
| P2 | CF AI Crawl Control | GPTBot/ClaudeBot 等 Disallow；要被引用再在控制台放开 |
| P2 | Markdown for Agents | CF Pro/Business 边缘 `Accept: text/markdown` |
| won't | 空 MCP / A2A / `llms-full` 41 篇 | 假接口 |

## Cheap vs CF 产品

**源站可做：** 换掉 `agents.md`；扩 `llms.txt`；build 写出 `/articles/<slug>.md`；`rel=alternate type=text/markdown`；修 RSS / sitemap 斜杠；JSON-LD `wordCount` 用整数。

**控制台：** AI 爬虫政策；有 Pro 再开 Markdown for Agents。

**不要先做：** Workers 上的远程 MCP。没有「搜 Liz 文章」这种 tool 需求时，well-known MCP 卡是装。

## 建议顺序

1. 修 `agents.md` 泄露（本轮做）
2. 扩 llms + 以后单篇 `.md`
3. RSS / sitemap 斜杠
4. Liz 拍板 AI 爬虫
5. 有 Pro 再开边缘转 MD
6. 不要先做 MCP

**置信度：** 库存与 404 高；CF Markdown 开关低（未测 Accept）  
**Owner：** 源站 = 实现任务；爬虫政策 = Liz 控制台  
