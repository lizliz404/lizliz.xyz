---
title: "我搭服务器养了四个 AI agent，然后 Grok Bot 把这件事做成了商品"
date: "2026-08-13"
description: "Cursor 被 600 亿美金收购后，和 Grok 合并出的第一刀砍向了 agent 基础设施：Grok Bot。我还在自己买服务器分 profile 养 agent，它已经把整条复杂度封装成一个月费。"
tags: ["Grok Bot", "AI Agent", "Cursor", "SpaceXAI", "复杂度封装", "agent infrastructure"]
categories: ["技术"]
publish: true
---

如果你也在自己搭 AI agent，最近这条新闻应该让你心情复杂：8 月 11 日，SpaceXAI 发布了 Grok Bot——每只 bot 有一台属于自己的云电脑，24/7 干活，关掉笔记本它还在跑，没有 API 也能操作你的软件，因为它像人一样看屏幕、点鼠标、打字。

翻译成人话：**我把「养 agent」这件事亲手做了一遍，然后它把整条路做成了商品。**

## 1/ 先说我现在的姿势

我的操作是：自己买一台腾讯云服务器，放在外网，然后在上面分 profile 建了很多 Hermes agent——jett、Orin、riven、lyric，每个 profile 一套环境、一套记忆、一套工具权限，各管一摊。

听起来很工程师，实际很保姆：

- 服务器要续费，环境要维护；
- 每个 agent 要喂上下文、要调工具权限；
- 跑挂了要救，token 额度要盯着；
- 多个 agent 之间的协作，得靠我自己当中转站。

这套东西我搭了很久，也一直在用。但我心里清楚：**我花的大头时间，不是在「让 agent 干活」，而是在「让 agent 有个地方干活」。**

写到这里有点尴尬——我吐槽的这套复杂度，其实是我自己选的。没人逼我买服务器，也没人逼我当编排层。只是当时想用 agent，市面上没有别的路。

## 2/ Grok Bot 封装了什么

Grok Bot 的官方定位是一句话：your team of always-on agents——一群永远在线的 AI 同事。

对着我上面的痛苦清单看，它每一条都精准命中：

| 我自己搭的 | Grok Bot 给的 |
|---|---|
| 买腾讯云服务器 | 每只 bot 一台专属云电脑 |
| 分 profile 建 agent | 发消息建 bot，像拉同事进群 |
| 我当中转站协调 jett/Orin/riven/lyric | Chief of Staff bot 管 specialist bots，bot 之间自己互发消息 |
| 把流程写进 skill 教 agent | 演示一遍，它存成 routine，接受纠正后自己复跑 |
| 精打细算 token 额度 | 订阅里直接给足量 |

这就是你说的「复杂度封装」：它把运维、配置、编排、额度管理这一整层，折叠成一个月费。你不需要懂服务器，不需要懂 profile，不需要懂路由——你只需要会发消息。

Lenny Rachitsky 的反馈很能说明问题：「像 OpenClaw，但是超级简单、可靠、不吓人。」OpenClaw 是现在圈子里流行的自托管 agent 管家——也就是我们这种人在跑的东西。Grok Bot 做的事情，就是把这套自托管体验做成了开箱即用的商品，连「自己装」都省了。

## 3/ 为什么是现在：Cursor 和 Grok 合体后的第一刀

这件事单看是一个产品，放在公司层面看是一个信号。

6 月，SpaceX 宣布 600 亿美金收购 Cursor（Anysphere），和 xAI 合并成 SpaceXAI——这是历史上最大的一笔 startup 收购。合并之后，两家公司没有慢慢磨合，而是整建制搬家：一周之内，Cursor Router（模型智能路由）、iPad + Inbox、Google Workspace 插件、Mixture-of-Kittens 开源、Grok Imagine 2.0、Origin 代码评审平台、Grok Bot、Grok 4.6（匹配 GPT-5.6 Sol），连发。

Grok Bot 是合并后第一个跨产品线的商品：下载、onboarding、销售全走 Cursor 的渠道，Cursor 品牌在新产品上逐步退场。官方还演示了 bot 之间互相交接：工程 bot 复现 bug、建档，然后转给调试 bot。多 agent 协作不再是实验室 demo，而是产品默认形态。

一个 600 亿美金的合并，第一刀砍向的不是模型，不是 IDE，而是 **agent 基础设施的商品化**。这个优先级本身就很说明问题。

## 4/ 值得优化的地方也明摆着

我不是来吹的。beta 阶段的问题很具体：

- **安全边界变薄了。** 它要的是你账号的登录凭据，不是可单独吊销的 API token。没有 API 层 = 没有摩擦，也少了一道安全边界。一个 agent 拿着你的密码去操作生产系统，出错就不是「改答案」而是「运营事故」。
- **模型是黑盒。** 你不能选模型，router 在后端自动路由。Matt Shumer 测下来直说 router "wasn't great"。
- **没有 benchmark，还在 beta。** 官方没发布 agentic 任务的性能数据。
- **贵。** 个人 $200/月，团队 $120/席/月，SuperGrok Heavy $300/月。

但这些都不影响我的判断：**复杂度正在变成商品，判断力还没有。**

## 5/ 我的结论

我自己搭的 jett、Orin、riven、lyric 不会失业。Grok Bot 买得到「跑起来」，买不到「你为什么这么跑」——你的流程、你的 taste、你教给 agent 的边界，这些是封装不掉的部分，而且会越来越值钱。

但下一次，我会先问自己：这件事，是买还是搭？

省下来的运维时间，正好拿来想清楚到底要让 agent 干什么。这才是真正没人替你封装的部分。
