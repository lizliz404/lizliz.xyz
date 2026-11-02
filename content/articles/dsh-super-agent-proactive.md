---
title: "DeepSeek 的 Super-agent：让 agent 主动接活，难的不是并发，是授权"
date: "2026-11-01"
description: "DeepSeek Harness 公开了 Super-agent 架构探索和研究原型。它不是新模型，而是一套「一个人怎么同时管很多 agent」的系统设计。最值得拿走的，是从信号到接单的那条管线，以及“找到的文字不等于授权”这条底线。"
tags: ["DeepSeek", "Super-agent", "AI Agent", "multi-agent", "agent orchestration", "harness-engineering"]
categories: ["技术"]
publish: true
---

10 月 31 日，DeepSeek Harness 团队发了一篇长文《Super-agent 设计探索：迈向更自主的 Agent 系统》（[知乎](https://zhuanlan.zhihu.com/p/2099987320443237060)，[英文版](https://x.com/DeepSeekHarness/status/2116857257245987236)），同时开源了一个 MIT 协议的研究原型 [dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype)。

先说清楚它**不是**什么：不是新模型，也不是正式产品。仓库 README 第一段就写着 "Research prototype for reference only, not an official DeepSeek product"，并说明原型和内部版本、和文章描述的实现都不完全一致。英文帖一天多就有一百多万曝光，仓库也很快涨到近八千 star；网上流传的“DeepSeek 发布新模型对标 Claude Code”这种说法，是错的。

我自己也在跑一小队 agent，所以我读它不是为了打分，而是想看能拿走什么。我最缺的是**主动**：我随口提过的事，要等我再说一遍才有人去做。

## 1/ 它想解决的问题

文章的出发点是一个经验判断：一个人同时能盯住的活跃 agent 会话，大概只有三到五个。再多，人的注意力就成了瓶颈。原型的哲学文档把目标写成一句话：用尽可能少的人类注意力（`docs/000-philosophy.md`）。

它给的答案是两层结构：

- **Router**：常驻的一层，接收所有外部信号，决定接不接、交给谁；
- **Worker**：一张工单一个独立会话、独立工作目录，专心干活。

原型的形态是一个面向单个 GitHub 仓库的“主动 coding agent”：监听 GitHub（可选飞书），开工单，Web 面板只显示需要人处理的事。

## 2/ 最值得拿走的：从“信号”到“接单”的管线

DSH 把 IM、邮件、日程、GitHub Review、CI 结果统称为 Trigger，处理分三步：

1. **Gate**：先用确定性规则过一遍，看来源、群组、白名单。这一步便宜，不调模型；
2. **Assessment**：通过 Gate 的，再交给模型做语义判断；
3. **Router 决定**：每个信号单独决定 accept（开新工单）、attach（归到已有工单）、ignore。

同一个 PR 或同一个话题算一个 Thread。工单订阅 Thread 之后，后续事件直接送到负责的 Worker，不再绕回 Router。这几部分在原型里都有代码（`docs/001-domain.md`、`docs/002-authorization.md`）。

这条管线的价值在于，它把“主动”拆成了可以分别调的零件：哪些来源值得听，什么样的话算“想让人做点事”，谁来判断，判断完交给谁。如果你想让自己的 agent 从“被叫才动”变成“提到就接”，这个形状几乎可以直接照搬，而且最小版本不需要一个常驻系统：一个只看新增内容的规则脚本，加上一次模型判断，就能跑起来。

## 3/ 最关键的一条：找到的文字不等于授权

“主动”最危险的地方，不在并发，而在授权。

DSH 的授权文档开篇就把这件事讲死了：权限只能来自主人的明确表态，消息本身不能改变权限（`docs/002-authorization.md` 第 5 行）。它把授权分成 explicit 和 inferred 两种。默认的接单模式是 `observe`：只记录“这件事我本来会接”，不动手；人看过这些记录、觉得靠谱之后，才切到 `auto`。

我觉得这是整套设计里最该抄的部分。落到实践上，大概是这样：

- 从笔记、issue、聊天里捡到的事，一律算 **inferred**；
- inferred 的事，不问就能做的只有低风险、可逆的部分：只读调研、诊断、复现 bug、在新分支上起草；
- 合并到主干、写生产环境、删除、对外发消息、花钱，**永远**先提议，等人点头；
- 新接入一个来源，先只提议、不动手，跑一段时间，回头看记录再决定放不放宽。

还有两条小规矩也很实用：搁置的工单恢复前要**重新核验**授权和上下文（第 125-129 行）；人叫停的工单**永久结束**，不会被下一条消息悄悄唤醒。

## 4/ 几个顺手能拿的小机制

- **投机执行，但别打扰人。** 文章提出先动手、结果有价值才通知人。原型只落地了一部分（就是上面的 observe/auto）。我的理解是：在低风险范围内先做，没做出东西就安静记一笔，不发通知。
- **异步执行。** 原型里 Worker 的前台命令超过 5 秒就转后台，后台最长 30 分钟（`docs/003-execution.md`）。好处是 agent 在跑长任务时，依然能收到新消息。
- **看进度，不只看死活。** 文章设计了一个 Watchdog，用模型判断 worker 是否真的有进展、有没有跑偏。原型没有实现它，但思路成立：一个 agent 状态显示“工作中”、输出却很久没变，就值得有人看一眼。
- **只问一个问题。** Worker 需要人介入时，只提一个具体问题；报告带明确的状态（完成、受阻、失败、放弃）。

## 5/ 不必照搬的部分

- **存算分离、自带机器的 daemon**：文章里的方向，原型没有实现。
- **实验数字**：比如完整版 p50 12.4 分钟、单会话方案 20.4 分钟，都来自合成负载和简化环境。原文自己就说“仅作为初步参考”，不能当成代码质量的证明。
- **权限姿态**：部署文档里 Worker 以 `danger-full-access` 运行，跑在操作者的系统用户下（`docs/006-deployment.md`）。[ctfiot 的审计](https://www.ctfiot.com/314686.html)指出，本机管理 API 只校验一个请求头，我在代码里核对过，确实如此（`src/app/http.ts`）。再叠上“公开仓库里任何评论都能进入 Worker 的上下文”，风险就很明显了。所以如果你照搬这条管线，低风险通道里就不该有发送、推送、删除这类动作。

## 6/ 外界怎么看

批评里最有代表性的是 [0xcherry 的精读](https://x.com/0xcherry/status/2116740089724207555)。他认为这更像“一篇 PRD，不是 Paper”：双层结构和几家大厂的 bot 产品形态很像；全双工交互是主流 harness 的标配；存算分离像在为卖云服务铺路；实验“设计不太完善，但至少有实验”。这些是他个人的判断，但大体站得住，尤其是对实验的保留。

我的看法是：这篇东西的新意，确实不在单个技术点上。它的价值在于，它把“一个人管很多 agent”讲成了一套完整的设计，各个零件的边界画得很清楚。其中授权那一章，是我认为最值得任何想让 agent“主动起来”的人先读的。

---

**来源**

- 官方中文：[知乎《Super-agent 设计探索》](https://zhuanlan.zhihu.com/p/2099987320443237060)；英文：[@DeepSeekHarness X Article](https://x.com/DeepSeekHarness/status/2116857257245987236)
- 原型仓库：[deepseek-ai/dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype)（本文引用的是 commit 6337fc8）
- DeepSeek Harness：[GitHub](https://github.com/deepseek-ai/deepseek-harness)
- 第三方：[0xcherry 精读](https://x.com/0xcherry/status/2116740089724207555)、[ctfiot 安全审计](https://www.ctfiot.com/314686.html)
