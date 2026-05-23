---
title: "用 Hermes Agent 满一个月：把 AI 接到一台真正的电脑之后"
date: "2026-05-23"
description: "深度复盘 Hermes Agent 一个月的真实使用体验。详细介绍如何利用海外云服务器、Telegram、GitHub 与 MCP/CLI 工具构建轻量化个人工作台，探讨避免 Agent 迎合倾向（Sycophancy）的长期配置方法及 Harness Engineering 实践。"
tags: ["Hermes Agent", "AI Agent", "Telegram Bot", "GitHub", "MCP", "个人知识管理 (PKM)", "Prompt Engineering", "高效工具"]
---

# 用 Hermes Agent 满一个月：把 AI 接到一台真正的电脑之后

0/ 默认假设：大家都已经内化了【万事问 AI】这一观念。其次，下方很多个人经验都带有强主观和偏见，请辩证吸收，欢迎交流讨论。虽然本人已经尽力消除“知识诅咒”，但由于千人千面，所以如遇到理解困难，请参考本条第一句话。大家可交叉验证学习，例如本人在初期就是逐字逐句阅读了刘小排老师和夙愿学长关于 OpenClaw 的文章[^12][^13]。

1/ Agent 全副武装后，相当于：你拥有一个掌握着一台电脑的实习生，Fully command（全权控制）。基本上人类加电脑能做的事，它都能做。除了一些需要 OAuth（开放授权） 的场景会比较麻烦，可能需要你自己在命令行里折腾两下。

2/ 天天看人劝你“快用 OpenClaw / Hermes”，或者“不必跟风、学得慢就不用学啦，好好用 Claude、ChatGPT（高级一点，用上 Claude Code、Codex）就够了”，甚至在几个 Agent 之间还要拉踩……你一旦起了情绪，被吸引了注意力，他们就得逞了。没办法，对立的、有冲突的、带情绪的，就是更容易赢得流量。

（金句来了）当你把大家的屁股分得干净、数清楚场上的椅子，你就能搞清状况。

无非就三种人：
一是屁股已经焊死在椅子上的（既得利益者，他们的“真诚”天然带着结构性偏差）；
二是正在拼命抢椅子的（叫得最大声的那批，因为他们必须制造噪音才有机会）；
三是站着看戏的（看似清醒，但不下场永远不知道椅子啥样）。

听他们说话之前，先看他们屁股在哪。当还没坐稳时，容易被这些人忽悠。而等你把椅子都坐过一遍后，俗称小马过河，就明白什么是适合自己的。

拿我个人体感来说：若有一定基础，Hermes 这类 Agent 未尝不可。无法拒绝的点在于：开源、数据可迁移（之后有更好的就换，丝毫不让屁股决定脑袋），而且她自己就能调用 Codex + CC，本就可以套娃。[^1]

3/ 看到这里，估计有些人已经没耐心了。没事，直接 Ctrl+A 全选、复制粘贴给 ChatGPT / Claude，让他帮忙罗列、甚至让他直接帮你干。大致就是：买云服务器、进 Token、一行命令行下载 Hermes、手动连接 IM（Instant Messaging，即时通讯软件）……齐活。且在 Hermes 一开始配置好的那一刻，另外的脏活累活就全都丢给他去干（一样是复制粘贴😉）。如果连这都懒得做，那说明你还没遇到真痛点 / 找到好奇心，建议先去找。

4/ 要想菜煮得好，原材料的质量是关键，关于 API 的个人体感是：

DeepSeek 开放平台，使用起来最简洁好上手（这几天不是刚好也宣布了 V4 的长期折扣吗）；
Kimi 不是很推荐，具体见文章“究竟有谁在用 Kimi Code 等国产？”[^2]；
对于海外御三家，本人因支付问题，订阅官方有困难，因此选择了“暂时使用中转站”，这里建议大家用中转站测评平台检查一下质量。[^3]

5/ 一个有意思的结论：Telegram 比 VS Code 轻。这听起来像句废话，IM 当然比 IDE（集成开发环境） 轻。但结果就是，我的沟通介质和整个工作台，彻底变成了 Telegram。反正到最后都是跟 AI 对话交流嘛。

6/ 这样一来，你不用再担心流量和魔法问题（经受过“流量卡啦 / 机场挂啦 / 节点不稳啦”折磨的人都懂）。要点是：把云服务器买在海外，这样就不存在“墙”。所以我不理解把云服务器部署在国内的人，可能他们真的没有这方面的需求吧。

配置方面，二核 4G + 60G + 200 Max Mbps，腾讯云最便宜（我已经比过），60 块钱一个月（截至26/5）。建议都先从低配置买起，因为配置后面能升而不能降，小马过河。让海外云服务器上的 AI 去做 Web Search，就像国内用百度一样自然。

把 Agent 部署在云服务器上的另外一个原因：主动制造隔离沙盒。万一在本地操作把系统搞崩了怎么办？本地环境往往充满了人类愚蠢操作造成的“熵增”，为什么不给 AI 提供一个清爽的 Workspace 呢？

7/ Telegram 是很好的介质（“守护世界上最好的 Telegram”🥵）。从长远和更多选择权的视角考虑，本人选了海外友好型的 IM。

虽然它可能遇到“拿国内 +86 号码无法注册”的门槛，需要 5SIM 等接码平台曲线救国。如果你嫌麻烦，Discord 也是个选择，对电话号限制没那么死。

像 Hermes 这样的 Agent 在连接方面做得很好，基本点点鼠标、命令行操作一下，就能把 IM 和主流 Token 供应商连起来。[^4]

8/ 为什么跟 IM 桥接起来？最朴素的原因是：IM 比 CLI（命令行）友好太多。你希望和同事在哪进行工作交流？总不会是命令行吧。这时候 Telegram 就显得非常自然。

9/ 关于配置长期文件，可参考：OpenClaw 官方的 SOUL 文件模板[^5]，以及我个人的 Agents.md。[^6] 这里有个专门的概念是【语言税】[^7]，所以我明确规定了 Default Language 为 English，顺便当学英语喽。

10/ 当前的实践：只要能接入 MCP 或 CLI 的，全上，能交给 AI 的，尽量不自己做。

不仅仅是很多具体的工作，甚至对于“如何使用、管理、如何最大化 Hermes 本身”，你都可以直接通过跟它交流来达成。

例如，当时跟他讨论“如何再搓另外几个 Agent”，最轻松的方式是，先直接拿 default profile 复制粘贴，再给他们配好各自的 Telegram Bot；再依据长期发展，让这些不同的定位要求、不同类型的场景，使得 Agent 自己修修改改，进化出属于自己的一系列配置文件。正所谓“发展论者”💁‍♀️

11/ 至于 Obsidian、Notion 这种个人知识管理工具，我进一步弃用了。折腾这些我觉得并不好玩，在我看来是复杂度的堆砌。

现在的流程是：豆包输入法的语音转文字作为输入，IM 作为介质 bridge，后续处理全交由 AI。为什么不让 AI 去做？如果要查看或搜索，直接用 GitHub。有什么要记、要写、要改的，直接放在 GitHub 上，后续随时可以提交修改。

12/ 【本人不用再直面这些工具的复杂度了】。无非是单体文件加文件夹结构，保持多端同步、增删改查。如果只是这些标准，GitHub 根本没有对手。现在每次要记笔记或写作，就把想法输入 Telegram 跟它交流，Agent 替我在相应的仓库里整理好。为了方便管理，需要遵循一定的命名规则，像 ISO 格式加 slug 这种最佳实践（例如：`liz-writing/2026-05-10/pkm-agent-workflow-article/raw-human.md`），学一下就能搞定。到最后甚至全程无需接手，直接看成品即可。如果要发布到公开平台，自己还是需要 Audit（审核）一下。

又反思了一下：上面说的这些，对于熟悉 Git 和 GitHub 的人来说成立。但对于其他人，“GitHub 毫无移动端编辑的体验”、“非文本类资源如图片视频难管理”，可能成问题。但如上我所描述的路径，已经完美绕过“直接操作笔记”，所以【人】难用与否无所谓，反正是 Agent 去搞。主要是，本人太容易当盲目自嗨的“笔记侠”了😭，折腾这些就像在通关游戏。且在 AI 时代，掌握 GitHub 难道不是刚需吗？

13/ 美妙之处在于，逃离了没必要的复杂度，让 AI 来承担。就像现在没几个人会先去搞定编程语言的“八股文”，再去学 AI 编程一样。反正当初我就是拿着锤子找钉子，最后终于发现了更好用的锤子，也终于搞明白自己到底要敲什么样的钉子。

14/ 刚开始的前几天，我非常执着，想着把云服务器的命令行接到我本地终端 + 本地 VS Code。但 Windows 连 SSH 特别麻烦，不仅延迟明显，而且整个感觉非常重。过度追求掌控感可能是毒。本地终端和云端 Web 终端，本质上都是命令行，没差嘛。所以我现在直接拿腾讯云的 Web 端连接服务器（第一次用的话，可以在设置里把登录限制改松一些，否则每次都要微信扫码，且 30 分钟不操作就会掉线再登😅）。

所有的云平台看起来都极其复杂，它本来就不是给单体个人设计的，而是为了企业 IT。只不过现在个体全部涌上来，自然会觉得平台设计反人类。我的经验是，用着用着就熟练了。

15/ 只要能接入命令行、给它足够的权限，能干的事情太多了。

给它配好工具，比如 Web Search。体验很棒的是 Jina，可以直接把网页内容抓取为 Markdown；Exa 最近也接了这个，两个都有免费额度，且市场反馈都不错。其次是更原生的 CURL，用于分析网页结构。[^8]

例如：以前在后台看数据其实很累，因为数据是隔了一层屏幕的，而且你是用人脑处理，现在把它跟 Google Analytics 连起来，人脑和 AI 一起处理，效率不可同日而语。这里强烈推荐大佬 benn 的“agent 营销 CLI 工具集”。[^9][^10]

16/ 说到这，不禁想到国内大厂推出的“一键安装”，简直像新一代的老年人领鸡蛋活动，怎么可能一键完成？所有的抽象都被黑盒封装了，不透明，导致它们可以为所欲为地绑定自家产品。但说实话，对大多数人来说这又是合理需求，因为他们图的并不是效率本身。（封装和抽象，降低了门槛，但也降低了天花板，算是有舍有得。）

17/ 坦白说，这样用下来我也会产生恍惚感，分不清虚实。直到真的做出一些东西，接受了外界反馈和检验，进入了 RLHF（人类反馈强化学习） 的循环，我才意识到这一切是真实存在的——包括云服务器、Agent 和 Token。所以，为了避免虚无感，寻求外界反馈是必要的手段。

18/ 另外，Agent 的结构值得深入了解。最常见的情况是上下文（Context）超载导致 AI 变蠢。我的做法是：把与 Context 和 Agent Identity 相关的长期配置文件（我将其称之为“宪法级”😉）单独抽出来做成一个 Repo 仓库，方便长期管理。

19/ 虽然 AI 如此强大，但也要给它设定一套“宪法”。我前段时间写的是：当用户出现一厢情愿（Wishful thinking），把 Agent 当阿拉丁神灯时，AI 需要触发类似 CBT（认知行为疗法）的制止机制。要避免她“迎合用户（Sycophancy）”的倾向，让 Agent 主动打断、质疑并引导回到现实（Goal-oriented），这里笑来老师的提示词值得推荐。[^11]

这里又想到 dont 栋哥最近说的，在这里是同理：“最近新增的这个 `/goal` 命令，算是一面照妖镜”。照出来的是什么？是没有目标，还是说目标本身就不现实？

20/ Harness Engineering，就像把 Token 做成好吃的菜。直接生啃原食材（直接调用 API）不是不行，但会难吃很多；而 Harness Engineering 就是进行加工，把 API 塞进 Agent 的流程和配置里，效果天差地别。其底层也就是一些 JSON 配置文件、Python 启动文件和用于存内容的 Markdown 文件。这是一个极其朴素的设计，却做出了极其伟大的效果。当然，也可能是因为我当前的理解过于浅薄。

21/ 最后碎碎念：现在想来，当时 AI Agent 刚火的时候，我为什么没跟风？可能是没看到对自己有什么好处。当时很多人吹捧的案例，大都是脱了裤子放屁（多此一举），卖铲子卖得不亦乐乎，但事实上没什么金矿。只有少数人是真的“脱了裤子拉 S”——有硬需求在支撑。但现在深入接触 AI Agent 后，真心觉得这太美妙了，甚至开始为未来人与人之间的关系感到恐慌。

---

## Further reading

Markdown 的 footnotes 会被渲染到页面底部，所以真正的正文引用说明放在最后；下面这些不是我逐篇读完、审核过的 reference，更准确地说，它们是可以丢给你自己的 Agent 继续查的入口，让她读原文、总结、交叉验证、判断是否适合你的场景，然后开干。

- 刘小排老师关于 OpenClaw 的文章 — 更像是“个人为什么要上手 Agent / OpenClaw”的经验入口，可以让自己的 agent 读完后提炼安装路径、使用门槛和适用人群： https://mp.weixin.qq.com/s/bI8xqK5QLBorA-Dob0xRSw
- 夙愿学长关于 OpenClaw 的文章 — 偏实操 / 文档型参考，适合让 agent 对照 Hermes、OpenClaw、IM bridge、工具接入这些概念做横向比较： https://zi6nfl20s5u.feishu.cn/wiki/TMEMwCmueiMFjVkPlWtc9mvAnVe
- Hermes Agent — 官方文档总入口，适合让 agent 查安装、provider、tools、skills、cron、profiles、gateway、MCP 等配置细节： https://hermes-agent.nousresearch.com/docs
- Hermes Messaging — 如果你关心“为什么 IM 可以变成工作台”，可以让 agent 重点读 gateway / messaging 这一块： https://hermes-agent.nousresearch.com/docs/user-guide/messaging/
- Model Context Protocol — 理解 MCP 为什么会变成“工具接入层”的基础资料，适合让 agent 帮你画出 MCP server / client / tool call 的关系： https://modelcontextprotocol.io/docs
- Claude Code Docs — 用来理解 CC 作为 agentic coding tool 的边界、权限、workflow 和适用场景： https://docs.anthropic.com/en/docs/claude-code
- OpenAI Codex Docs — 用来理解 Codex 这类 coding agent / CLI 工具如何进入开发流程： https://developers.openai.com/codex/
- GitHub Git basics — 如果你不熟 Git，可以让 agent 从这里开始给你拆“为什么 GitHub 适合做文本底座”： https://docs.github.com/en/get-started/using-git
- GitHub CLI Manual — 如果要让 agent 操作 repo、issue、PR、release，这个比网页后台更适合变成可执行 workflow： https://cli.github.com/manual/
- Jina Reader — 适合让 agent 把网页变成 Markdown，再进入摘要、审稿、研究或证据链流程： https://jina.ai/reader/
- Exa Docs — 适合让 agent 研究 search / extraction API，尤其是想把 web search 接进自动化工作流时： https://docs.exa.ai/

---

[^1]: Hermes Agent Docs: https://hermes-agent.nousresearch.com/docs — Hermes Agent 官方文档入口。这里主要用于指向 Hermes 的基本定位、安装、provider、tools、skills、gateway、profiles 等机制。

[^2]: “究竟有谁在用 Kimi Code 等国产？”: https://mp.weixin.qq.com/s/-zqohUGEnir2rC_so_dXsQ — 用来补充“Kimi体验差异”的外部讨论语境。本文这里只引用为个人选择的旁证，不把它当成稳定测评结论。

[^3]: “挑选靠谱的中转站”: https://hvoy.ai — 一个用于比较 / 检查中转站质量的入口。中转站质量波动很大，读者如果使用，最好让自己的 agent 交叉检查延迟、可用模型、价格、日志与隐私条款。

[^4]: Hermes Agent Messaging Docs: https://hermes-agent.nousresearch.com/docs/user-guide/messaging/ — Hermes 官方 messaging / gateway 文档，用来支撑“把 Agent 接到 Telegram、Discord 等 IM”这一段。不同平台账号状态、地区限制和 bot 权限会导致实际难度不同。

[^5]: OpenClaw 官方 SOUL 文件模板: https://docs.openclaw.ai/reference/templates/SOUL — SOUL / persona / identity 类长期配置文件的参考模板。这里引用的是“把 Agent 长期人格、边界和工作方式写成可维护文本”的思路。

[^6]: 我的 Agents.md: https://lizliz.xyz/agents.md — 我自己的长期 agent context / constitution 示例。不是通用最佳实践，只是展示我如何把偏好、边界、工作流和反迎合规则写进长期配置。

[^7]: 李笑来老师关于 “AI Prompt 的语言税” 的文章: https://vmark.app/zh-CN/guide/users-as-developers/prompt-refinement.html — 用来解释为什么很多 prompt / agent 配置会默认使用 English，核心不是崇洋，而是模型训练语料与工具生态带来的“语言税”。

[^8]: Jina Reader: https://jina.ai/reader/ — 网页转 Markdown / 给 agent 读取网页的工具入口。本文提到的是“让 AI 把网页内容转成可处理文本”的体验，不等于所有页面都能被稳定抽取。

[^9]: benn / Bin-Huang “agent 营销 CLI 工具集”即刻帖: https://web.okjike.com/u/b6f8811d-a1e5-40a3-8f30-ba94cd73e18f/post/69d50c57800201ac68286c9e — 用来指向对 agent + marketing CLI 的介绍。

[^10]: camoufox-cli: https://github.com/Bin-Huang/camoufox-cli — 相关 GitHub 项目入口。适合让 agent 进一步查看 CLI 工具、browser automation、marketing workflow 等具体实现。

[^11]: 李笑来老师 “严肃使用 LLM 为什么需要一个北极星提示词”: https://lixiaolai.com/articles/2026-04-26/why-serious-llm-use-needs-a-north-star-prompt — 用来补充“给 AI 设定北极星 / 反迎合 / goal-oriented 边界”的思路。

[^12]: 刘小排老师关于 OpenClaw 的文章: https://mp.weixin.qq.com/s/bI8xqK5QLBorA-Dob0xRSw — 关于 OpenClaw / Agent 使用体验的外部参照。

[^13]: 夙愿学长关于 OpenClaw 的文章: https://zi6nfl20s5u.feishu.cn/wiki/TMEMwCmueiMFjVkPlWtc9mvAnVe — 关于 OpenClaw / Agent 使用体验的外部参照。
