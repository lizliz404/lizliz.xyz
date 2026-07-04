---
title: 出海 SaaS 收款链路：从用户付款到跨境到账的完整流程
description: 系统拆解出海 SaaS 收款链路：支付按钮、商户责任、平台风控、跨境 payout、银行入账和税务合规分别解决什么问题。
categories: ["技术"]
tags:
  - 出海
  - SaaS 收款
  - 跨境支付
  - Paddle
  - Stripe
  - 合规
keywords:
  - SaaS payment
  - global payment
  - cross-border payout
  - Stripe
  - Paddle
  - merchant of record
  - compliance
  - 出海收款
  - 独立开发
  - payment infrastructure
published_date: '2026-05-19'
updated_date: '2026-05-19'
---

**这篇文章不是老兵血泪史。** 我没有被 Stripe 封过号，没有从 Paddle 提过款，没有处理过银行问询。以下内容来自对平台官方文档、社区讨论和公开案例的系统性研究整理。

它的价值不在于"我亲自踩过所有坑"，而在于把三条通常被分开讨论的线索放回同一条资金链路里：

```text
前端怎么变现
  → 中间谁承担商户责任
  → 最后钱如何合规落袋
```

如果你在找"Stripe 开户教程"或"Paddle 接入指南"，这不是你要的文章。如果你想知道为什么钱到了 Stripe 还不一定是你的——往下看。


## 不是一条直线

很多独立开发者第一次做 Global SaaS，想象的链路很简单：

```text
用户付钱 → Stripe/Paddle 收款 → 钱到账 → 提现 → 变成自己的钱
```

真实世界不是直线。真实世界是：

```text
用户愿意付钱
  → 支付通道愿意处理这笔钱
  → 风控系统认为你不是风险
  → 税务责任有人承担
  → 拒付和欺诈没有把账户打爆
  → 平台愿意放款
  → 银行愿意接钱
  → 外汇路径说得清楚
  → 税务上能解释
  → 最后你才敢说：这钱落袋了
```

中间任何一个节点断掉，收入都只是 dashboard 里的数字。

这就是本文的核心主张：**赚钱不是交易完成，而是资金链路完整闭环。** 这不是法律条文，而是一个分析框架——用它来审视你的收款路径，而不是用它来做合规决策。


## 资金从哪里来（简短版）

有三种进入方式，每一种决定了后续责任链的起点：

**广告（AdSense）**：你卖流量，不卖产品。你的客户是广告系统，不是访问者。AdSense 按月结算，约 21-26 日放款，门槛 $100。核心风险不是收入少，而是"有效性解释权"——平台说无效流量，钱就不一定是你的了。[[1]](#sources)

**用户直接付费**：订阅、买断、usage-based。关键在于：谁收钱，谁就承担后续责任。订阅不是躺赚——是用户每个月给你一次重新被淘汰的机会。Lifetime deal 不是现金流——是长期负债。点数/credits 在资金逻辑上接近预付资产，退款条款和消耗记录必须清楚。

**平台内购（IAP）**：Apple/Google 替你处理支付、部分税务、退款、分发信任。Apple 小企业计划 15%（年收入 <$1M），标准 30%。Google Play 首 $1M 15%，订阅 15%。[[1]](#sources) IAP 不是支付通道——是平台税，买的是用户信任和更低支付摩擦。


## 真正的分水岭：谁是 Merchant of Record？

出海收款最重要的问题不是"Stripe 便宜还是 Paddle 贵"。

而是：**用户付款时，在法律和交易意义上，卖方是谁？**

这决定了税务、发票、拒付、欺诈、风控、封号时，锅在谁身上。


## PSP：你是商家，你背锅

代表：Stripe、PayPal。

```text
用户 → Stripe/PayPal 处理支付 → 你的商户主体收款 → 你承担全部责任
```

Stripe 美国线上卡常见费率 2.9% + $0.30。PayPal Checkout 常见 3.49% + fixed fee。国际交易、换汇、争议另算。[[1]](#sources)

很多人开始算账：Stripe 2.9% vs Paddle 5%——那肯定 Stripe 便宜啊。

这是第一层误判。

Stripe 便宜，是因为它没有替你承担全部责任。你还需要自己处理：VAT/GST/sales tax 计算与申报、全球发票合规、chargeback 应诉、欺诈损失、账户 review 时的材料准备、资金被 hold 时的现金流。Stripe Tax 可以帮你算税——但"帮你算税"不等于"替你承担税务责任"。

**PSP 的本质：你是商家。Stripe 是管道。管道不背锅。**

一条实用的财务对照：根据社区成本估算，在 $2,900 MRR 且有 40% 国际客户时，Stripe + Stripe Tax + 税务合规工具的总成本已接近 Paddle 的 5%。到 $24,500 MRR 且以美国客户为主时，Stripe 路径才明显更便宜。[[2]](#sources) 换句话说——在你达到一定规模之前，"省手续费"是一个会计幻觉。


## Stripe 真正的风险：解释权不在你

HN 上有一个 2026 年案例（thread 47565502）：瑞典 AI 图像/视频平台称 Stripe 因交易量激增触发 credit review，以 "unacceptable level of risk" 永久关闭账户，余额约 $85,000 被卡。创始人承认发生过技术问题：webhook 被 Cloudflare rate limit 导致 credits 未及时到账，基础设施故障导致 25 小时迁移。虽然后续修复，但 dispute 已经发生。[[1]](#sources)

**这是一个个案，不是统计数据。** 它说明的是机制，不是概率——从创始人视角看，这是真实业务、已修复问题、已交付服务。从支付风控视角看：交易量突然上升、交付失败、争议出现、AI 业务高风险——先关掉风险敞口。

你以为你在解释业务。系统把你看成一组风险信号。

这就引出一个残酷但真实的计算：**费率是诱饵，封号才是真成本。** 一个 $85k 的 hold 可能吞噬你多年省下的 2% 费率差。


## MoR：有人替你当卖方

代表：Paddle、Lemon Squeezy、FastSpring。

```text
用户 → MoR 作为卖方收款 → MoR 处理支付/税务/发票/拒付/欺诈 → MoR 扣费后 payout 给你
```

在用户那笔交易里，卖方不是你——是 MoR。你更像供应商。

Paddle 和 LS 常见费率 5% + $0.50。FastSpring 多为定制定价。[[1]](#sources) 贵吗？贵。但它卖的不仅是支付手续费：

- 全球 VAT/sales tax 处理、注册、申报、缴纳的责任转移
- 发票和收据体系
- 欺诈和拒付处理
- 账务简化：N 张面向全球用户的发票变成你和 MoR 之间的一两张收入凭证

对小团队来说，你真正缺的不是支付 API。你缺的是一个能让你少想几十个国家税法的缓冲层。

**MoR 的本质：你用更高费率买税务外包，同时把命门交给另一个平台。**

MoR 不是"自由"。Reddit 和 HN 上对 Paddle/LS 的常见抱怨：费率高、payout 汇损、支持不稳定、KYC/KYB 可能更严、也可能封号、集成后迁移成本高、B2B 场景下灵活性不足。


## Stripe 收购 Lemon Squeezy，然后呢？

2024 年 7 月 26 日，Stripe 宣布收购 Lemon Squeezy。[[3]](#sources) Stripe CEO Patrick Collison 在 X 上表态："We're going to scale merchant of record selling in a big way."

表面看是支付巨头买了一个创作者工具。更深一层看，是 Stripe 在补 MoR 能力——因为独立开发者真正的痛不是支付 API，而是"我不想懂全球税务"。

但故事到这里还没完。

**2026 年 1 月，LS CEO 发布更新：** 承认因集中建设 Stripe Managed Payments 导致"slower support responses and less frequent product updates"，团队正在构建 LS 到 Stripe 的迁移路径。Stripe Managed Payments 已于 2026 年 2 月进入 public preview，定价 5% + $0.50。[[4]](#sources)

这意味着什么？LS 没有死，但它不再是一个独立产品的 roadmap。如果你今天选择 LS 作为 MoR，你实际上选的是一个处于迁移期的平台——它的未来形态是 Stripe Managed Payments。

**第二层机制：当你选的 MoR 被收购，你外包出去的风险就有了新的主人和新的优先级。** 这不一定是坏事（Stripe 的资源远大于 LS），但它是不确定性。选择 MoR 时，把"这个平台的独立性能维持多久"放进计算。


## 钱到了平台 ≠ 进了口袋

真正的难题在 payout 之后的链路：

```text
Stripe/Paddle/LS/PayPal 余额
  → 海外银行账户 / 虚拟收款账户
  → Payoneer / Wise / Airwallex 等
  → 换汇 / 结汇
  → 国内公司或个账户
  → 税务申报 / 留痕
```

这里的关键词不是"怎么转"，而是**"怎么解释"**。

银行和税务不关心你的 Product Hunt 排名。它们关心：钱从哪里来、谁付的、为什么付、对应什么合同/invoice、你的主体是谁、收款主体和经营主体是否一致、是否纳税。

**一个具体陷阱：万里汇 (WorldFirst) 不支持 SaaS。** 有开发者报告 Paddle → PayPal → 万里汇路径中 $1,000 被卡，因为万里汇要求提供"真实货物交易证明和物流信息"。SaaS 是服务贸易（服贸），不是货物贸易（货贸），万里汇的验证体系按货贸设计，数字产品无法提供物流凭证。[[5]](#sources) 如果你做 SaaS，走 Payoneer 或 Airwallex，不要走万里汇。

真正稳的是材料链的完整性：产品网站 → 订单记录 → 平台 payout 报表 → invoice/receipt → 服务合同/条款 → 公司主体文件 → 银行流水 → 换汇记录 → 纳税记录。你能把这条链讲清楚，钱才真正安全。


## 为什么注册海外公司

不是因为酷。是因为它解决了几个具体问题。

**美国 LLC + Mercury/Brex + Stripe** 的典型路径：注册 LLC → 获 EIN → 开美国商业账户 → 接 Stripe/Paddle → 收美元。好处是更容易接入美国支付和银行体系，对 B2B 客户更可信。代价是注册维护成本、年度申报、税务复杂度、银行 KYB。

**香港公司 + Stripe HK + Payoneer/Airwallex** 是目前中国独立开发者走得最多的路径。优势：多币种账户、地理和金融体系近、离岸收入可能免税（需证明业务运营不在香港，建议找专业会计师）。[[5]](#sources)

**一个关键警告：ODI 备案。** 如果你内地有关联公司，香港公司利润以股息/服务费形式回流时，银行要求 ODI 备案文件。有深圳卖家年利润 500 万因无 ODI 备案被银行拒付，资金长期滞留香港。[[5]](#sources) 这不是 Stripe 的问题，是资本管制的问题。

**一个更直接的警告：不要用个人账户和香港公司之间随意转账。** 杭州卖家因此被判定违规换汇，账户冻结 3 个月。[[5]](#sources)

海外公司不是避税壳，不是收款万能钥匙。它是一个需要维护成本的法律实体。适合认真经营，不适合幻想隐身。


## 中国开发者：钱能出去，也要能解释清楚回来

中国开发者的特殊性不在于"能不能收到钱"——Stripe HK、Paddle、Creem 都有路径。特殊性在于**最后那一公里**：

1. **结汇额度**：个人年度便利化额度 5 万美元。但持续收全球商业收入后，它不再像偶发稿费，更像经营性收入。金额越大、频率越高，越需要公司化和税务化。

2. **服贸 vs 货贸**：银行和 PSP 的验证体系经常按货物贸易设计（要求物流凭证）。SaaS/数字产品是服务贸易，天生没有物流。选错通道（如万里汇），资金会被卡住。

3. **银行问询**：银行看的是模式——高频、小额、多来源、跨境、平台打款、用途模糊，都可能触发问询。你需要的是被问到时能说清楚，而不是"绕过问询"。[[5]](#sources)

4. **材料链**：中国 Stripe 卖家社区总结的防冻经验：平稳养号（新账户前 30 天避免交易暴增）、信息一致（公司主体、域名 WHOIS、银行账户、法人身份统一）、多通道备份、低拒付率（<1%）、固定 IP 登录。[[6]](#sources) 这些不是玄学，是风控信号管理。

**关于 Paddle 和 Creem**：Paddle 接受中国个人注册（Business Type 选 Individual），但审批周期可能长达一个月，且社区报告过针对中国用户的大规模关户。Creem 是目前对中国大陆身份注册最友好的 MoR（3.9% + $0.40），但作为新平台，长期稳定性待观察。[[5]](#sources)


## 选择框架

以下不是"照着做就没事"的指南。是帮助你在信息不完备的情况下做更清醒的选择。

**产品验证期（< $3k MRR，无公司主体）：**

MoR 优先（Paddle / Creem / LS 视当前迁移状态）。原因不是你选 MoR 就完美——而是你没有能力接住 PSP 省下来的责任。早期最贵的不是手续费，是注意力被烂事吃掉。

**注意：** 如果 80%+ 客户在美国，且你愿意自己处理 US sales tax，Stripe + Stripe Tax 也合理。MoR 不是道德正确——它是一个算账问题。

**稳定运营期（>$10k MRR，有海外公司主体）：**

PSP + 税务体系（Stripe/PayPal + Stripe Tax/Anrok/TaxJar + accountant）。这时 PSP 的低费率才开始有意义——因为你已经有组织能力接住它省下来的责任。

**AI SaaS 特殊提醒：**

AI 产品除了 MRR，还要监控 dispute rate、refund rate、failed delivery rate、chargeback exposure、payout delay——这些才决定你的钱能不能出来。交易量暴涨 + 生成失败 + 退款上升 = 支付平台的高风险信号。[[1]](#sources)


## 最后

出海收款不是一个支付按钮问题。它是商业责任、平台风控、税务合规和现金流安全的交叉点。

最危险的新手心态不是"不知道"，而是"先接 Stripe，赚钱了再说"。

更稳的心态是：**先选一条当前阶段能承受责任的资金链路。**

真正的闭环不是用户付款成功。真正的闭环是：

```text
用户付了钱 → 平台放了款 → 银行接了钱 → 税务说得清 → 你能安心花
```

在那之前，收入只是账面幻觉。

钱不是进了 Stripe 就算你的。钱只有穿过整条责任链，最后还能被解释清楚，才算真正落袋为安。


## Sources

本文采用研究整理立场，非亲历者叙述。所有社区案例标记为个案，不作为统计证据。不构成法律、税务或合规建议。

1. **Platform official docs**: Google AdSense Help (payment timelines), Apple Small Business Program, Google Play Service Fees, Stripe Pricing, PayPal Checkout fees, Paddle/LS pricing pages — inspected 2026-05.
2. **Fee crossover analysis**: dev.to community comparisons (2026), Stripe vs Paddle vs LS fee breakdown with tax compliance factored in. Crossover point ~$3k MRR for parity, ~$25k MRR for clear Stripe advantage.
3. **Stripe acquires Lemon Squeezy**: TechCrunch (2024-07-26), LS official blog post at lemonsqueezy.com/blog/stripe-acquires-lemon-squeezy — both live as of 2026-05-19. Stripe newsroom URL returned 404; use TechCrunch or LS blog.
4. **LS 2026 Update**: "2026 Update: Lemon Squeezy + Stripe Managed Payments," LS blog (2026-01-28), and "Stripe + Lemon Squeezy Update: A Big Milestone Reached" (2025-04-29). Both live.
5. **China developer cases**: V2EX threads (2024-2025) — WorldFirst blocks SaaS payout, personal→HK transfer risks; LINUX DO community guide (2025); Shenzhen ODI case via szsscr.com; Hangzhou illegal FX case. All web-search surfaced; individual accounts, not systematic survey data.
6. **Stripe freeze cases (China sellers)**: 10100.com — three documented cases with timelines: transaction spike → 90-day freeze, counterfeit goods → permanent ban, high chargeback rate → 60-day restriction. Seller-side accounts.
7. **HN discussions**: Thread 47565502 (Stripe $85k case, 2026-03-29), Thread 43298663 (VAT/Sales Tax for B2C SaaS, 2025-03-11). Founder/practitioner accounts.
8. **Reddit r/SaaS**: Threads 1mjge8v (payment processor comparison, 2025-08), 1op85aw (LS migration rationale, 2025-11). Individual preference reports.
