---
publish: true
title: "Prompt 是一句话，Loop 是一个制度"
date: "2026-06-08"
description: "Peter Steinberger 说你不该再 prompting coding agents，而该 designing loops that prompt your agents。这不是否定 prompt，而是宣布 prompt 已经从主角降级为零件。"
tags: ["agent-loop", "loop-engineering", "coding-agents", "harness-engineering", "AI"]
---

Peter Steinberger 在 X 上说了一句话，听起来像那种每隔几个月就会出现的 AI 救世主宣言：

> Here's your monthly reminder that you shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents.

Greg Zunic 接了一句，带着找到圣杯的兴奋：

> Designing loops is hard but when you find the right one you can 1 shot 100k lines of Rust that just work perfectly!

然后 Armin Ronacher 转发了 Peter 的帖子，补了一句态度：

> I've no idea how to do this, but so far I haven't gone wrong as treating Peter of a glimpse into the future.

三条消息，三个图层。Peter 在说范式，Greg 在说效果，Armin 在说信任——"我不会做，但我信这个人看到的。"

这里先把证据边界摆出来：这篇文章讨论的是一个从公开英文技术圈里浮出来的方向性迁移。它不是全球行业普查，也不是组织级生产率报告。Peter 的 tweet 是触发事件，Peter 的两篇长文是作者自述，Simon Willison、Martin Fowler、Daniel Demmel 等人的文章是概念和实践线索，几篇 benchmark paper 只能作为风险 pattern evidence。中文生态、公司内部实践、团队级 ROI 案例，都还不在这份材料里。

Greg 那句 "100k lines that just work" 是真实的兴奋，但把它当事实引用会失焦。真正值得拆的是 Peter 那条："你不该再 prompting coding agents，你该 designing loops that prompt your agents。"

这句话的未来感来自哪里？不是因为它否定了 prompt。Peter 自己仍然写 prompt。未来感来自它宣布了一件事：**prompt 已经被降级了。**它不是不在了，而是不再是主角。它从一门手艺变成了一个零件。

这篇文章想把这个降级过程拆开看：agent loop 到底是什么，为什么它难，人的位置在哪里动，哪里会失败，以及 Peter 本人到底做了什么让他看起来像 "a glimpse into the future"。

---

## Loop 本体：比你想象的简单

Simon Willison 给过一个最干净的定义：agent = runs tools in a loop to achieve a goal。（[Designing agentic loops](https://simonwillison.net/2025/Sep/30/designing-agentic-loops/)）Steve Kinney 拆过多种 agent framework，发现它们收敛到同一个核心结构——一个 while-loop。（[The Anatomy of an Agent Loop](https://github.com/stevekinney/stevekinney.net/blob/main/writing/agent-loops.md)）追到源头，ReAct paper（[Yao et al., 2022](https://arxiv.org/abs/2210.03629)）已经把 reason → act → observe 的结构写得很清楚。

最小 loop 只需要四步：

1. 给模型一个目标。
2. 模型决定下一步行动——调用哪个工具、改哪段代码、跑哪个命令。
3. 环境返回观察结果——测试通过或失败、编译错误、日志输出、API 响应。
4. 模型根据观察更新自己的计划，回到第 2 步，直到满足终止条件。

这个结构本身没有任何神秘之处。一个 CS 本科生可以在十分钟内写出一个能跑的最小 agent loop。甚至更粗暴一点，最简可用版本真的可能只是一个脚本、一个任务文件、一个状态 Markdown：脚本把目标喂给 agent，agent 改文件或调用命令，测试输出再被喂回下一轮。

这也是“loop engineering 只是脚本夹吗？”这个质疑成立的地方：**demo 级 loop 可以只是脚本夹。**但这只说明 loop 的最小原语很小，不说明生产级 loop 很简单。生产级 loop 需要回答的不是“while 循环怎么写”，而是“谁触发、跑在哪、能碰什么、怎么停、失败怎么被看见、下一次怎么不重犯”。

真正昂贵的是**第七行之后的一切**：agent 能看见什么 context，能调用什么 tool，tool 的输出是否可解析、低噪声、可组合，失败是否被保留并转成下一步信息，验收是否可机械化执行，成本/时间/权限/文件系统是否有边界，多轮之后是否出现 drift、context rot、regression、code erosion。

Loop 的本体只有四步。Loop 的设计是另一件事。

---

## 真正难的不是 Loop，是 Loop 的周边

如果 agent loop 的代码只需要十行，那是什么让 "designing loops" 变得难？难在设计这些外围系统：

**工具接口。** agent 能碰什么？CLI、API、文件系统、数据库、浏览器、Git。每个工具的输入输出格式直接影响 agent 的判断质量。噪声大的工具输出（比如没有 `--json` flag 的日志、HTML 页面、非结构化错误信息）等于给 agent 喂噪音。

**触发和隔离。** loop 什么时候启动？手动命令、cron、CI、issue webhook、PR 更新，还是某个监控报警？启动之后跑在哪里？同一个工作树、临时 sandbox、Git worktree、独立分支，还是容器？生产级 loop 的第一层安全感来自隔离：每个 agent 有自己的 workspace、branch、日志和停止条件，而不是所有 agent 一起在主分支上抢方向盘。

**反馈质量。** agent 改完代码之后，它看见什么来决定对错？测试结果、lint 输出、typecheck、build 日志、浏览器 console、OpenTelemetry trace、数据库查询结果。Simon Willison 说 loop 适合的场景是 "需要大量试错且有明确验收标准"——重点是"明确验收标准"这六个字。没有清晰的 success signal，loop 就是在黑暗里走路。

**权限和 blast radius。** agent 能写文件吗？能 push 吗？能删数据库吗？能发网络请求吗？能读 `.env` 吗？Peter 反复强调 blast radius 这个词——不是控制 agent 不犯错，而是限制犯错的影响范围。这也是 Martin Fowler 在 "Humans and Agents in Software Engineering Loops" 里反复出现的概念：agent 需要足够权限来完成任务，但不能多到一次失误就炸掉整个系统。（[Humans and Agents in Software Engineering Loops](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html)）

**成本预算。** 每次 loop 迭代都在烧 token、烧时间、烧 API 费用。loop 可以无限跑下去，但如果第 5 轮之后边际收益趋近于零，你得有一个 stop condition。这个 stop condition 不能只是"模型觉得做完了"，必须是外部可验证的信号：测试全部通过、verifier 返回 true、或达到了最大迭代次数/token 上限/时间预算。

**Context 管理。** agent 在 loop 中积累的文本——代码、日志、工具输出、错误信息——会塞满 context window。更糟的是，早期尝试产生的错误代码和误导性日志可能一直留在 context 里，污染后续决策。Steve Kinney 把 context management 列为 loop 设计中最被低估的难点。

**记忆和学习。** 一次任务踩过的坑，下次 agent 还会再踩吗？如果每次 session 都是失忆实习生，那 loop 跑得再快也没用。这就引出了 Daniel Demmel 的 "outer loop" 概念：inner loop 是在单次 session 内修正，outer loop 是把经验从 session 里提取出来，沉淀到文档、skill、rule 里，成为下次 agent 启动时就能读到的 feedforward context。（[Feedback loop engineering](https://www.danieldemmel.me/blog/feedback-loop-engineering)）这里的“记忆”不一定玄学：最朴素的版本就是 `TODO.md`、`state.md`、`AGENTS.md`、`SKILL.md`、失败日志和已知坑清单。关键不是存得多，而是下一轮 agent 启动时能读到正确、去重、仍然有效的信息。

**协作和审批。** 一旦 loop 能自动开 PR、读 issue、发 Slack、改数据库、推分支，它就不再是“本地小脚本”，而是团队系统的一员。最小权限、人工确认点、审计日志、分支保护、失败升级路径，决定了 loop 是帮你处理重复劳动，还是在凌晨三点替你制造事故。

这六个外围系统听起来像什么？像好的工程基础设施。测试、日志、权限控制、成本管理、文档、onboarding。而 agent loop 的启示是：这些过去被当作"好习惯"的东西，现在变成了 agent 能不能工作的**环境条件**。你用不着 agent，可以容忍 CI 偶尔坏掉、文档过时三年、monitoring 缺失；但让 agent 在这种环境里跑 loop，它会精准地撞上每一堵看不见的墙。

---

## 人的位置：退出最内层，但不退出 Loop

Martin Fowler 那篇文章的标题直接用了 "on the loop"——人不完全在 loop 里面，也不完全在外面，而是站在 loop 的上方。

传统模式下，人的位置在最内层：

```text
人写 prompt → agent 写代码 → 人逐行审代码 → 人改代码或重写 prompt
```

Loop engineering 之后，人的位置上移：

```text
人定义目标和约束
人设计验证回路（什么算"完成"、什么算"失败"、什么必须人确认）
agent 在回路内反复试错
人审计 loop 失败的原因（为什么卡住了、为什么烧钱、为什么误判）
人改进 harness（改工具、改权限、改验收、改 context 结构）
```

人没有退出 loop。人退出的只是最内层的键盘劳动——不再逐行写代码，不再逐行审 diff。但人保留了：定义 why loop、设计 harness、设置 blast radius、决定 stop condition、审计失败模式、改进产生 artifact 的系统。

Martin Fowler 把这个叫 "on the loop"；Daniel Demmel 把这个叫 "harness engineering"；Peter 自己的实践是把判断从"这行代码对不对"移到"这个架构、这个依赖、这个测试、这个权限边界对不对"。

一个有用的类比：工厂主管不需要盯着每个工人做每个零件，但他需要确保工位设计合理、量具准确、流程清晰、异常有上报渠道。如果质检仪器坏了，好工人也会产出坏零件。如果流程不批露缺陷，效率越高，废品越多。

---

## 几种在跑的 Loop 形态

以下不是框架目录，而是从公开材料里可以看到的、正在被不同人独立实践的 loop 形态。

**CI / Test loop。** 最直接的形式：issue → agent 写/改测试 → agent 实现 → 跑 test/lint/typecheck/build → 失败信息喂回 → 重复直到全绿或 hit 上限。适合 bug fix、依赖升级、迁移、性能优化。前提是测试可机械执行、失败信息可读、且不能只跑 happy path。

**Ralph outer loop。** Vercel Labs 的 `ralph-loop-agent` 在 inner tool-using loop 外面包了一层验证回路：agent 跑完一轮后，`verifyCompletion` 检查任务是否真的完成，如果没完成，把原因当作 feedback 注入，再触发下一轮。关键设计不是让模型自己说 "done"，而是让外部 verifier 决定 "done"。（[ralph-loop-agent](https://github.com/vercel-labs/ralph-loop-agent)）

这个 pattern 的价值和风险在同一个地方：verifier 的质量决定一切。如果 verifier 设计得好（可机械验证、不容易被 bypass、覆盖真实成功条件），loop 会收敛。如果 verifier 是 LLM 自己打分、模糊的 PRD 文字、或写错的测试，outer loop 就是把方向错误往更多轮里强化。

**Claude Code dynamic workflow。** 这是我第一版 OSINT 漏掉的关键 reference，而且不能只作为 References 塞在文末。Claude Code 官方文档已经把 agent loop 写成产品架构：Claude 接收 prompt、system prompt、tool definitions 和 conversation history，先产生 `AssistantMessage`，其中可能包含 text 和 tool call；SDK 执行 tool，把 tool result 作为新的 `UserMessage` 喂回；这个“模型决策 → 工具执行 → 结果回灌”的 turn 一直重复，直到 Claude 产出没有 tool call 的最终回答，然后 SDK 返回带 final text、token usage、cost、session id、termination subtype 的 `ResultMessage`。（[How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop)）

这里有两个关键点。第一，loop 不是一个诗意比喻，而是 Claude Code / Agent SDK 的 runtime contract。它有 message types、turns、tool execution、permissions、hooks、context window、compaction、session resume、cost/budget accounting。第二，所谓 “designing loops” 在官方架构里已经变成可调参数：`max_turns` / `maxBudgetUsd` 决定 agent 什么时候停；`allowed_tools` / `disallowed_tools` / `permission_mode` 决定它能碰什么；hooks 可以在 `PreToolUse`、`PostToolUse`、`Stop`、`PreCompact` 等节点拦截、审计、改写或归档；context compaction 会在窗口接近上限时压缩旧历史，所以真正重要的规则应该进 `CLAUDE.md` / skills / project settings，而不是寄希望于最早那句 prompt 永远被完整保留。

这直接补上了 Peter 那句话的产品层含义：prompt 还在，但它只是 loop 的输入之一。Agent 的行为由 prompt、工具定义、权限规则、hook、上下文装载、预算上限、历史压缩、subagent 隔离共同决定。你只改 prompt，就像只改方向盘套；你改 loop，才是在改车的刹车、仪表盘、限速器、导航和维修记录。

更进一步，Anthropic 在 “A harness for every task” 里把 workflow 描述成 Claude 可以临时写出的 JavaScript harness：它可以 fan-out 到多个 subagents、合成结果、做 adversarial verification、generate-and-filter、tournament，甚至 “loop until done”。（[A harness for every task](https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code)）这篇文章的核心不是“Claude 又多了一个功能”，而是承认默认单 agent harness 在长任务里会遇到结构性失败：agentic laziness（做一半宣布完成）、self-preferential bias（偏爱自己的答案）、goal drift（多轮和 compaction 后忘掉原始约束）。Dynamic workflow 的解法不是让一个 agent 更努力，而是把问题拆进多个隔离 context，让一个 deterministic harness 承担调度、等待、合并、复核和停止条件。

这些 workflow pattern 值得完整写进 loop engineering 的谱系里：

- **Fan-out-and-synthesize**：把大任务拆成很多小任务，每个 subagent 用干净 context 独立完成，最后由 synthesis step 合并。它解决的是 context 污染和单窗口容量问题。
- **Adversarial verification**：每个产出都另开 verifier 按 rubric 查错，避免 agent 自己写、自己判、自己宣布成功。
- **Generate-and-filter / tournament**：不是一次性要一个“最佳答案”，而是生成多个候选，用比较、过滤、pairwise judging 收敛。
- **Loop until done**：当工作量未知时，不预设固定 pass 数，而是直到没有新发现、日志无新错误、rubric 满足，或预算/时间上限触发。
- **Classifier / model routing**：先判断任务类型、复杂度和所需工具，再决定走哪个 agent、哪个 model、哪个 effort level。

这也解释了为什么 “多 agent” 本身不是答案。Claude dynamic workflows 的价值不在“开了很多 agent”，而在 harness 提供了**结构性防偏机制**：隔离 context、并行探索、barrier synchronization、adversarial check、rubric-based selection、explicit stop condition。没有这些，多 agent 只是五个模型互相传话；有这些，它才接近一个可审计的工作系统。

但官方同样给了冷水：dynamic workflows token-heavy，适合复杂、高价值、长运行、并行、对抗性验证的任务，不适合每个小改动都开五个 reviewer。Anthropic 给的例子很能说明边界：偶发 flaky test 复现、最近 50 个 session 里挖反复犯的错、审计 blog post 每个技术 claim、从 80 份简历里排序并 double-check top 10、incident 归因、root-cause investigation。这些任务共同点不是“酷”，而是**单 context 容易懒、偏、漂、塞爆；任务本身又有可定义的 rubric 或 stop signal**。

所以 Claude Code 这组资料对本文的补强，是把 Peter 的个人判断从“一个高手的直觉”推进到“工具正在把这种直觉产品化”。Peter 说 design loops；Claude Code 文档说明默认 agent 本来就在 loop 里运行；dynamic workflows 则说明下一层竞争点是：谁能为不同任务临时生成更合适的 harness，而不是谁会写更玄的一句 prompt。

@trq212 那条 X 图文链接的也是这篇 dynamic workflows 文章；它不是另一份独立证据，但说明 Claude Code 团队正在主动把 "harness/workflow/loop" 作为产品语言推出。

**Observability loop。** 从"代码是否编译"升级到"系统行为是否正确"。agent 改代码或配置 → 触发 workflow → 读取日志/OpenTelemetry trace/浏览器 console/数据库状态 → 与 acceptance criteria 比对 → 继续修改。这适合前端、微服务、数据管道、性能优化——凡是不编译错误但行为错误的问题。

**Knowledge consolidation loop。** Session 结束 → 提取可复用的教训 → 去重和泛化 → 写入 AGENTS.md / CLAUDE.md / skill / 项目文档 → 后续 session 加载为 feedforward context。Daniel Demmel 管这个叫 outer loop；Peter 的 AGENTS.md 和 VISION.md 是同一思路的具体实现。

这些形态共享同一个骨架：行动 → 反馈 → 修正 → 重复。区别在于反馈和调度的来源——测试、外部 verifier、官方 SDK/tool runtime、dynamic workflow harness、真实系统行为，还是跨 session 的学习。好的 loop 通常不是单一反馈源，而是多个反馈源在不同时间尺度上同时运行。

如果要从零开始，顺序也应该反过来：不要先搭一个宏大的 agent 平台，先挑一个小而硬的任务，比如“修复一个已知失败测试”或“让依赖升级后 CI 重新变绿”；先定义完成条件，再让 agent 只读日志和写状态；确认它能正确分类问题后，再开放写权限；最后才接入自动 PR、定时触发和团队审批。Loop 工程不是一上来造机器人公司，而是先造一个不会撒谎的反馈闭环。

---

## Peter 到底做了什么

Peter 的未来感来自哪里，Armin 没说清楚，但 Peter 自己的两篇长文把答案摊在了桌面上。

在 "Just Talk To It"（[the no-bs way of agentic engineering](https://steipete.me/posts/just-talk-to-it)）和 "Shipping at Inference-Speed"（[2025](https://steipete.me/posts/2025/shipping-at-inference-speed)）里，他描述的不是一套 prompt 模板，而是一整套让 agent 能行动、能验证、被限制、能复盘的工作方式。先降级一句：这是 Peter 的自述工作流，不是经过对照实验验证的行业最佳实践。它的价值在于足够具体，可以让我们看见一个高水平操作者到底在调哪里。具体来说：

**CLI-first。** 他的工具设计原则是：agent 可以直接调用 CLI，读取结构化输出，验证结果。理由很清楚——模型对 text-in/text-out、Unix pipe、`--help`、`jq`、`rg`、`git` 这些接口极度熟悉。相比把一堆 MCP schema 塞进 context，CLI 的 context tax 更低、更可组合、人类也能直接调试。

**AGENTS.md / VISION.md。** 项目根目录下的这些文件不只是给人看的文档，是 agent 每次 session 的 boot context。相当于每次 agent 启动，先读一份"这个项目怎么工作、注意什么坑"的 onboarding 手册——而且这份手册会随项目演化被持续更新。

**多 agent 并行，但每个有边界。** Peter 日常同时跑 3 到 8 个 Codex CLI agent，各自负责独立任务。关键不是"多开"本身，而是每个 agent 有受控的 blast radius——不会互相踩文件、不会共享不安全的 context、各自有明确的退出条件。（据 Digg 对 X 原帖 replies 的二级聚合，Peter 回复提到 "I have my claw supervising my codex'es"，但这一点来自二级来源，未独立核实。）

**Oracle CLI。** 当 agent 卡在某个决策点，它不盲猜。Peter 设计了一个 oracle CLI，让 agent 把难题转发给更强的模型做判断，然后把判断结果作为新的 context 继续行动。这本质上是一个分层决策架构：routine decisions 本地做，high-stakes decisions 上浮。

**可验证输出优先。** 他在 "Shipping at Inference-Speed" 里专门解释了为什么很多工具从 CLI 开始：因为 agent can call it directly and verify output——closing the loop。可验证性是他的设计约束，不是事后补的测试。

这些做法的共同点：**不是在 prompt 层面优化措辞，而是在环境层面提供可操作、可验证、有边界的行动空间。** prompt 仍然存在，但它被夹在 AGENTS.md 的强 context、CLI 的工具接口、测试的反馈信号、oracle 的升级判断之间——它变成了这个机器里的一个零件。

---

## 反面：Loop 会放大错误

如果 loop 的本体是简单的，有人的位置是对的，有几种 pattern 看起来是可操作的，Peter 的做法看起来是合理的——那这篇文章很容易滑向一首 agent loop 的赞歌。以下的反面证据不是"预言失败"，而是指出 loop 的设计缺陷在哪里会暴露。

**"能跑通"不等于"可维护"。** 多个独立 benchmark 在不同维度上发现了同一类现象。SlopCodeBench 报告 agent 在多轮扩展自身代码时出现 structural erosion 和 verbosity，退化随检查点累积——而且没有一个 agent 完整解决了全部端到端问题。（[SlopCodeBench](https://arxiv.org/html/2603.24755)）EvoCode-Bench 报告强 agent 的 single-round 能力与 multi-turn 持续执行能力之间存在明显落差，许多 agent 到第 5 轮后表现大幅下降。（[EvoCode-Bench](https://arxiv.org/html/2605.24110)）SWE-CI 从 CI loop 的角度衡量 agent 在持续演化的 codebase 上保持 maintainability 的能力，发现单次 pass tests 不足以证明长期演化能力。（[SWE-CI](https://www.arxiv.org/pdf/2603.03823)）

这些 benchmark 的共同信号：agent 有能力把当前 checkpoint 拼过去，但在下一轮需求变化时暴露出架构脆弱、代码冗余、spec tracking 丢失。Loop 不只会修正错误——它也会放大早期架构选择的后果。AI 写代码成本趋近于零时，错误架构不是"慢慢积累"，而是可以在几个小时内扩建成一座贫民窟。

**Loop 是放大器，不是方向器。** 如果 verifier 是可靠的测试、真实的系统日志、可机械执行的验收标准，loop 会把好方向放大。如果 verifier 是 LLM 的自我评价、模糊的 PRD、错误的测试、或缺失的边界条件，loop 只是在高速制造精确的废品。重复本身不产生质量——可验证的反馈才会让重复收敛。这个判断没有直接的实验验证（目前 benchmark 关注的是 agent 能力退化，而非 verifier 质量对 loop 收敛性的影响），但它是一阶机制推理：任何反馈系统的输出质量不可能超过其 feedback signal 的质量。

**ROI 不会无限。** “loop 可以自己跑”很容易被讲成一种近似免费的人力复利，但真实账本不是这样算的。每一轮都消耗 token、时间、CI 资源、API quota、review 注意力，还会制造需要回滚和解释的失败状态。Loop 的投资回报来自把重复性、可验证、边界清晰的工作自动化：CI 修复、依赖升级、迁移、bug reproduction、日志驱动排障。它不来自让 agent 在开放式问题里无限探索。没有 budget、stop condition、human checkpoint 和成本监控，loop 不是复利机器，是自动烧钱机。

**多 agent 不天然等于更高级。** 将不同的判断角色拆成独立的 agent（planner、coder、reviewer、tester）听起来像软件工程的最佳实践直接映射，但多 agent 引入了新的失败模式：handoff 压缩导致信息丢失、agent 之间互相污染、token 消耗倍增、merge 协议脆弱。多 agent 架构只有在角色边界清晰、context 隔离有效、验收标准独立、合并协议明确时才有增量价值。在没有这些前提的情况下，多 agent loop 只是把一个不稳定的 loop 拆成五个互相污染的 loop。

**Benchmark 的边界。** 这里引用的 benchmark 结论来自论文摘要和二级分析，未逐篇核实 method section 的细节。使用的模型和 agent scaffold 可能不是最新版本；不同 benchmark 测试的是不同维度的退化（structural erosion vs spec tracking vs maintainability regression）。这些 benchmark 最适合作为 "pattern evidence"——多个独立来源在不同维度上发现了类似现象——而不是作为确定性的效果评估。

---

## Loop engineering 不是新发明，但需求正在转移

那篇文章开头的 objection 必须在这里正面回答：测试、日志、CLI、文档、权限控制——这些不都是几十年的软件工程基础设施吗？Loop engineering 到底"新"在哪里？

这是最强反驳，也是最值得保留的反驳。因为它基本成立。把 agent loop 说成一个凭空出现的新学科，很容易变成技术圈最常见的香火：旧东西换个英文名，点三炷香，宣布未来已来。

是的。CLI-first 是 Unix 哲学。CI/test loop 的骨架在 CI/CD 出现时就有了。Observability 是 SRE 的看家本事。Knowledge consolidation 和好的 onboarding 文档没有本质区别。

但有一件事变了：**这些工程基础设施的需求方变质了。**过去，好测试让人受益，坏测试让人受苦。人可以在坏测试的环境中靠经验和直觉绕过暗礁。现在，好测试是 agent 的 feedback signal，坏测试——agent 会信。它不知道你的测试写错了。它会勤奋地修改代码直到那个错误的测试通过。

需求方的变化改变了供给的 urgency。当 AI 能低成本产出代码时，测试不是 nice-to-have——它是 agent 的导航系统。当 agent 读取项目文档来决定架构方向时，过时的 AGENTS.md 不是在浪费人的阅读时间——它是在给 agent 喂错误的世界模型。这些不是新发明。但 agent 把这些东西从 "品德" 变成了 "基础设施"。你不需要品德就能造垃圾；但 agent 需要基础设施才能不造垃圾。

这就是为什么 "designing loops" 比 "writing prompts" 更接近问题的本质。写 prompt 是试图改变模型的回答。设计 loop 是改变模型所处的世界。

---

## 结尾

Prompt 没有死。它只是被收编了。

当 Peter 说 "you shouldn't be prompting coding agents anymore"，他显然还在写 prompt——他的博客里、AGENTS.md 里、CLI 的设计里到处是 prompt。但他把精力从"怎么写一句话"移到了"怎么造一个环境"：一个 agent 可以在里面行动、看见后果、被机械验证、被 blast radius 限制、被跨 session 学习、被人从上层接管的回路。

未来工程师的稀缺技能不是 prompt。Prompt 已经变成了一种基本 literacy——和写 commit message、写 code comment、写 bug report 类似的日常能力。稀缺的是：

- 把一个问题变成可被机器试错、可被现实反馈、可被人类接管的**回路设计**；
- 把工程判断做成 agent 能碰到的墙、能读懂的信号、能重复执行的**验收设计**；
- 让工具接口对机器可解析、对人类可调试的**接口设计**；
- 以及在整个系统跑的越来越快的时候，知道什么不能交给 agent、什么是人的最后一根刹车绳的**边界判断**。

这是控制权抽象层的迁移。不是人类退出软件开发，是人类从最内层的键盘劳动里退出来，去设计键盘所在的整个车间。

---

## References

- [Deep research report: Loop 工程综述](/sources/agent-loop/source-deep-research-report.md) — 本项目补充综述材料，含 Loop 工程术语、最简/生产级结构、ROI/成本、CI/CD、验证、安全协作与入门步骤
- Peter Steinberger, X 原帖 — https://x.com/steipete/status/2063697162748260627
- Peter Steinberger, "Just Talk To It — the no-bs Way of Agentic Engineering" — https://steipete.me/posts/just-talk-to-it
- Peter Steinberger, "Shipping at Inference-Speed" — https://steipete.me/posts/2025/shipping-at-inference-speed
- Simon Willison, "Designing agentic loops" — https://simonwillison.net/2025/Sep/30/designing-agentic-loops/
- Claude Code Docs, "How the agent loop works" — https://code.claude.com/docs/en/agent-sdk/agent-loop
- Anthropic / Claude, "A harness for every task: dynamic workflows in Claude Code" — https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code
- Thariq Shihipar / @trq212, X post linking dynamic workflows article — https://x.com/trq212/status/2061907337154367865
- Steve Kinney, "The Anatomy of an Agent Loop" — https://github.com/stevekinney/stevekinney.net/blob/main/writing/agent-loops.md
- Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models" — https://arxiv.org/abs/2210.03629
- Martin Fowler / Kief Morris, "Humans and Agents in Software Engineering Loops" — https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html
- Daniel Demmel, "Feedback loop engineering" — https://www.danieldemmel.me/blog/feedback-loop-engineering
- Vercel Labs, `ralph-loop-agent` — https://github.com/vercel-labs/ralph-loop-agent
- SlopCodeBench — https://arxiv.org/html/2603.24755
- EvoCode-Bench — https://arxiv.org/html/2605.24110
- SWE-CI — https://www.arxiv.org/pdf/2603.03823
- SWE-Cycle — https://arxiv.org/html/2605.13139
- Digg X thread mirror（二级来源） — https://digg.com/ai/7ifyvmb9
