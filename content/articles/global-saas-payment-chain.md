---
title: "出海收款的完整链路：从用户付款到资金落袋，中间隔着什么"
date: "2026-07-30"
description: "Global SaaS 收款不是接一个支付按钮。从变现模式、商户责任、平台风控、跨境 payout 到银行/税务闭环——完整链路分析；含 2026 年中 AIGC MoR 景观更新。"
tags: ["出海", "支付", "SaaS", "独立开发", "合规", "AIGC"]
categories: ["商业"]
publish: true
---

**这篇文章不是老兵血泪史。** 我没有被 Stripe 封过号，没有从 Paddle 提过款，没有处理过银行问询。以下内容来自对平台官方文档、社区讨论和公开案例的系统性研究整理。MoR 景观以 **2026-07** 公开资料与社区报告为快照。

它的价值不在于"我亲自踩过所有坑"，而在于把三条通常被分开讨论的线索放回同一条资金链路里：

```text
前端怎么变现
  → 中间谁承担商户责任
  → 最后钱如何合规落袋
```

如果你在找"Stripe 开户教程"或"Paddle 接入指南"，这不是你要的文章。如果你想知道为什么钱到了 Stripe 还不一定是你的——往下看。


<a id="sec-1"></a>
## 1、不是一条直线

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


<a id="sec-2"></a>
## 2、资金从哪里来（简短版）

有三种进入方式，每一种决定了后续责任链的起点：

**广告（AdSense）**：你卖流量，不卖产品。你的客户是广告系统，不是访问者。AdSense 按月结算，约 21-26 日放款，门槛 $100。核心风险不是收入少，而是"有效性解释权"——平台说无效流量，钱就不一定是你的了。[1](#ref-1)

**用户直接付费**：订阅、买断、usage-based。关键在于：谁收钱，谁就承担后续责任。订阅不是躺赚——是用户每个月给你一次重新被淘汰的机会。Lifetime deal 不是现金流——是长期负债。点数/credits 在资金逻辑上接近预付资产，退款条款和消耗记录必须清楚。

**平台内购（IAP）**：Apple/Google 替你处理支付、部分税务、退款、分发信任。Apple 小企业计划 15%（年收入 <$1M），标准 30%。Google Play 首 $1M 15%，订阅 15%。[1](#ref-1) IAP 不是支付通道——是平台税，买的是用户信任和更低支付摩擦。


<a id="sec-3"></a>
## 3、真正的分水岭：谁是 Merchant of Record？

出海收款最重要的问题不是"Stripe 便宜还是 Paddle 贵"。

而是：**用户付款时，在法律和交易意义上，卖方是谁？**

这决定了税务、发票、拒付、欺诈、风控、封号时，锅在谁身上。


<a id="sec-4"></a>
## 4、PSP：你是商家，你背锅

代表：Stripe、PayPal。

```text
用户 → Stripe/PayPal 处理支付 → 你的商户主体收款 → 你承担全部责任
```

Stripe 美国线上卡常见费率 2.9% + $0.30。PayPal Checkout 常见 3.49% + fixed fee。国际交易、换汇、争议另算。[1](#ref-1)

很多人开始算账：Stripe 2.9% vs Paddle 5%——那肯定 Stripe 便宜啊。

这是第一层误判。

Stripe 便宜，是因为它没有替你承担全部责任。你还需要自己处理：VAT/GST/sales tax 计算与申报、全球发票合规、chargeback 应诉、欺诈损失、账户 review 时的材料准备、资金被 hold 时的现金流。Stripe Tax 可以帮你算税——但"帮你算税"不等于"替你承担税务责任"。

**PSP 的本质：你是商家。Stripe 是管道。管道不背锅。**

一条实用的财务对照：根据社区成本估算，在 $2,900 MRR 且有 40% 国际客户时，Stripe + Stripe Tax + 税务合规工具的总成本已接近 Paddle 的 5%。到 $24,500 MRR 且以美国客户为主时，Stripe 路径才明显更便宜。[2](#ref-2) 换句话说——在你达到一定规模之前，"省手续费"是一个会计幻觉。


<a id="sec-5"></a>
## 5、Stripe 真正的风险：解释权不在你

HN 上有一个 2026 年案例（thread 47565502）：瑞典 AI 图像/视频平台称 Stripe 因交易量激增触发 credit review，以 "unacceptable level of risk" 永久关闭账户，余额约 $85,000 被卡。创始人承认发生过技术问题：webhook 被 Cloudflare rate limit 导致 credits 未及时到账，基础设施故障导致 25 小时迁移。虽然后续修复，但 dispute 已经发生。[7](#ref-7)

**这是一个个案，不是统计数据。** 它说明的是机制，不是概率——从创始人视角看，这是真实业务、已修复问题、已交付服务。从支付风控视角看：交易量突然上升、交付失败、争议出现、AI 业务高风险——先关掉风险敞口。

你以为你在解释业务。系统把你看成一组风险信号。

这就引出一个残酷但真实的计算：**费率是诱饵，封号才是真成本。** 一个 $85k 的 hold 可能吞噬你多年省下的 2% 费率差。


<a id="sec-6"></a>
## 6、MoR：有人替你当卖方

代表：Paddle、Lemon Squeezy、FastSpring——以及后文会更新的 Creem、Waffo Pancake、Clink 等。

```text
用户 → MoR 作为卖方收款 → MoR 处理支付/税务/发票/拒付/欺诈 → MoR 扣费后 payout 给你
```

在用户那笔交易里，卖方不是你——是 MoR。你更像供应商。

Paddle 和 LS 常见费率 5% + $0.50。FastSpring 多为定制定价。[1](#ref-1) 贵吗？贵。但它卖的不仅是支付手续费：

- 全球 VAT/sales tax 处理、注册、申报、缴纳的责任转移
- 发票和收据体系
- 欺诈和拒付处理
- 账务简化：N 张面向全球用户的发票变成你和 MoR 之间的一两张收入凭证

对小团队来说，你真正缺的不是支付 API。你缺的是一个能让你少想几十个国家税法的缓冲层。

**MoR 的本质：你用更高费率买税务外包，同时把命门交给另一个平台。**

MoR 不是"自由"。Reddit 和 HN 上对 Paddle/LS 的常见抱怨：费率高、payout 汇损、支持不稳定、KYC/KYB 可能更严、也可能封号、集成后迁移成本高、B2B 场景下灵活性不足。[8](#ref-8)


<a id="sec-7"></a>
## 7、Stripe 收购 Lemon Squeezy，然后呢？

2024 年 7 月 26 日，Stripe 宣布收购 Lemon Squeezy。[3](#ref-3) Stripe CEO Patrick Collison 在 X 上表态："We're going to scale merchant of record selling in a big way."

表面看是支付巨头买了一个创作者工具。更深一层看，是 Stripe 在补 MoR 能力——因为独立开发者真正的痛不是支付 API，而是"我不想懂全球税务"。

但故事到这里还没完。

**2026 年 1 月，LS CEO 发布更新：** 承认因集中建设 Stripe Managed Payments 导致"slower support responses and less frequent product updates"，团队正在构建 LS 到 Stripe 的迁移路径。Stripe Managed Payments 已于 2026 年 2 月进入 public preview，定价 5% + $0.50。[4](#ref-4)

这意味着什么？LS 没有死，但它不再是一个独立产品的 roadmap。如果你今天选择 LS 作为 MoR，你实际上选的是一个处于迁移期的平台——它的未来形态是 Stripe Managed Payments。

**第二层机制：当你选的 MoR 被收购，你外包出去的风险就有了新的主人和新的优先级。** 这不一定是坏事（Stripe 的资源远大于 LS），但它是不确定性。选择 MoR 时，把"这个平台的独立性能维持多久"放进计算。

这条机制会在下一节再次出现——只不过这一次，不是收购，而是品类风控一夜收紧。


<a id="sec-8"></a>
## 8、钱到了平台 ≠ 进了口袋

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

**一个具体陷阱：万里汇 (WorldFirst) 不支持 SaaS。** 有开发者报告 Paddle → PayPal → 万里汇路径中 $1,000 被卡，因为万里汇要求提供"真实货物交易证明和物流信息"。SaaS 是服务贸易（服贸），不是货物贸易（货贸），万里汇的验证体系按货贸设计，数字产品无法提供物流凭证。[5](#ref-5) 如果你做 SaaS，走 Payoneer 或 Airwallex，不要走万里汇。

真正稳的是材料链的完整性：产品网站 → 订单记录 → 平台 payout 报表 → invoice/receipt → 服务合同/条款 → 公司主体文件 → 银行流水 → 换汇记录 → 纳税记录。你能把这条链讲清楚，钱才真正安全。


<a id="sec-9"></a>
## 9、为什么注册海外公司

不是因为酷。是因为它解决了几个具体问题。

**美国 LLC + Mercury/Brex + Stripe** 的典型路径：注册 LLC → 获 EIN → 开美国商业账户 → 接 Stripe/Paddle → 收美元。好处是更容易接入美国支付和银行体系，对 B2B 客户更可信。代价是注册维护成本、年度申报、税务复杂度、银行 KYB。

**香港公司 + Stripe HK + Payoneer/Airwallex** 是目前中国独立开发者走得最多的路径。优势：多币种账户、地理和金融体系近、离岸收入可能免税（需证明业务运营不在香港，建议找专业会计师）。[5](#ref-5)

**一个关键警告：ODI 备案。** 如果你内地有关联公司，香港公司利润以股息/服务费形式回流时，银行要求 ODI 备案文件。有深圳卖家年利润 500 万因无 ODI 备案被银行拒付，资金长期滞留香港。[5](#ref-5) 这不是 Stripe 的问题，是资本管制的问题。

**一个更直接的警告：不要用个人账户和香港公司之间随意转账。** 杭州卖家因此被判定违规换汇，账户冻结 3 个月。[5](#ref-5)

海外公司不是避税壳，不是收款万能钥匙。它是一个需要维护成本的法律实体。适合认真经营，不适合幻想隐身。


<a id="sec-10"></a>
## 10、2026年中：AIGC 收款的「答案」开始轮换

2026 年 5 月稿把 Creem 写成「对中国大陆身份最友好的 MoR，长期稳定性待观察」。到 2026 年 7 月，后半句已经不够用了——稳定性风险从假设变成了可观察的案例。以下不是亲测测评，是对公开文档、融资新闻与社区报告的整理；涉及在营平台的负面指控，一律按「社区旁证 / 未证实」处理。[9](#ref-9)

核心框架没变：费率仍是诱饵，封号与资金 hold 才是真成本；MoR 用更高费率买税务外包，同时把命门交给另一个平台。变的是具体出口——以及一种比硬封号更隐蔽的处置方式。

### Creem：从 indie 答案到品类级软封号

Creem 的基本事实仍然成立：面向独立开发者的 MoR，公开费率约 3.9% + $0.40，平台并未倒闭，2026 年 6–7 月仍在发博客、维护文档。[10](#ref-10) 变的是对 AIGC 品类的态度。官方文档已加码：AI 图像/视频需额外合规与 Moderation API，face-swap / deepfake / NSFW 营销可被 restrict 或 suspend。[11](#ref-11) AIGC 正在变成独立风控品类，而不只是「AI SaaS」四个字里的模糊子集。

时间线可以这样读：2024 年末上线、一度被视为中国独立开发者绕开 Stripe 的出口 → 2026 年 3 月已有 AI 换脸产品因合规事故被永久封号、余额冻 90 天的公开复盘 → 2026 年 5 月前后从业者称体验明显变差 → 2026 年 7 月中下旬，社区出现「支付成功率暴跌 / VISA 大量拒付 / 订阅砍半」的多源报告。[9](#ref-9)[12](#ref-12)

需要分开两层，别混成一句「Creem 凉了」：

- **风控收紧、成功率恶化（社区 Medium）**：方向与官方 AI 合规加码同向，但平台并未公开承认「对整类 AIGC 压成功率」。从业者转述的官方邮件口径是：违规则封号冻资 90 天；不违规则不封号，但把收款成功率压到奇低。邮件原文未公开，措辞只能标为 Single-source。
- **「5 月换掉 Stripe、自建风控」（Low）**：这是从业者猜测，本稿未找到官方确认——机制叙事可以引用，不能写成已核实事实。

更值得写进框架的，是机制本身：**不必硬封号冻资；把 decline rate 拉高，续费型业务等价半死。** 压成功率 ≈ 软封号。对订阅产品，这比「账户被关」更隐蔽——dashboard 还活着，老用户续费进不来，收入可以腰斩而表面上「并未违规」。硬封号至少强迫你立刻迁移；软封号让你在半死不活里耗掉几个月。

于是前面那句计算需要升级：**费率是诱饵；封号与压成功率，都是真成本。**

### Waffo Pancake vs Clink：分层，不是双推荐

2026 年中，中国开发者友好 MoR 从「Creem 一家独大」变成「多选手试错」。公开可核验的两家是 Waffo Pancake 与 Clink（clinkbill.com）——前者偏验证期、无公司主体；后者偏公司化与复杂订阅/Agent 叙事。下表只列对选择有意义的字段；未核实项明确标出。[13](#ref-13)[14](#ref-14)

| 维度 | Waffo Pancake | Clink |
|---|---|---|
| 主体要求 | 官网/文档：无需 LLC / 公司主体即可 | 更偏公司化；公开路径多为联系接入 / 邀请制（个人可否：未充分证实） |
| 公开费率 | **3.9% + $0.50**（官网） | **未公开价目表** |
| 支付方式 | Visa/Mastercard/Apple Pay/Google Pay；**官网明确不处理 Alipay / WeChat Pay** | 公司新闻稿称 100+ local methods，含 PayPal / Apple Pay / Google Pay 等（Medium，非独立审计） |
| Payout | 当前 **仅 CNY**（大陆银行卡或支付宝）；更多走廊在 roadmap | 公开细则不足 |
| AIGC | 从业者称 deepfake / 侵权 / NSFW 难接入（与行业 MoR 通行限制同向） | 同类限制被从业者转述；官方产品主打 Humans & Agents |
| 融资背书 | 母公司 Waffo：Illuminate + 高榕领投 A 轮，汇丰、BAI 等参投（High） | BV 百度风投 + Celtic 联合领投（High） |
| 证据等级 | 产品与费率 High；「支持微信支付」**已被官网否定** | 存在性/MoR/融资 High；客户名单与费率 **Low / Unverified** |

不要把上述对照读成背书。Waffo 融资新闻写的是母公司，Pancake 是面向开发者的产品线；CNY-only payout 对中国个人友好，对需要 USD 留存海外的主体未必够用。Clink 的客户名单（从业者文章中出现的若干品牌）尚未找到独立二级证据。邀请返佣链接属于来源方营销话术，与机制分析无关。[9](#ref-9)

### 2026-07 AIGC 产品：还活着的选项（分层，非清单推荐）

| 平台 | 对 AIGC / 中国开发者的大致位置 | 置信度语言 |
|---|---|---|
| **Stripe** | 当然可用；解释权不在你。AI/高风险封号有大量社区旁证。所谓「$10M ARR 才有客户经理」「标准罚 $25k/$50k」——从业者转述，**未证实，勿当政策** | 封号风险 Medium；罚款数字 Low |
| **Paddle** | 生成式媒体（image generators、deepfake、voice cloning 等）AUP 明确不友好；不等于「所有 AI SaaS 都被拒」 | 生成式媒体 High；「全部 AI 拒」Overstated [15](#ref-15) |
| **Creem** | 仍运营、费率友好；**AIGC 品类风控已收紧，成功率问题有社区多源**——不宜再写成默认首选 | 平台存在 High；品类恶化 Medium |
| **Waffo Pancake** | 无主体、公开价、CNY payout；可研究的验证期选项，非永久答案 | 产品/费率 High；AIGC 细则 Medium |
| **Clink** | 公司化 / 复杂订阅 / Agent 叙事更强；邀请制、费率不透明 | 存在与融资 High；接入门槛与定价 Medium–Low |
| **Lemon Squeezy** | Stripe 收购已确认；迁移期产品，风控「同源」属推断 | 收购 High；同源 Medium |
| **PayerMax / Dodo** | 景观中有名字；「AIGC 保证金」「任意封号」等主张证据不足，本稿不展开 | Low / Unverified |

Polar、Freemius、FastSpring、Stripe Managed Payments 仍在景观里，但费率/AIGC 政策未在本次充分核验前，不宜塞进「答案」栏。

### 机制课：通道是单点故障

Creem 这件事真正该带走的，不是「换哪一家」，而是：**收款通道是出海产品的命脉，命脉不能只有一条。**[9](#ref-9) 两年前某个 MoR 可以是圈子里的答案；两年后同一家可以一夜变脸——变的是品类策略与 decline rate，不是你产品突然变坏。平台仍在发博客、仍在收文档流量，并不妨碍它对你这个品类变得难用。

「不要把鸡蛋放在一个篮子里」在这里不是鸡汤，是单点故障管理：有条件就接两条互为备份，哪怕平时只把一条当主通道。今天任何「推荐」，理论上都没有永远——包括尚未被社区打穿的新名字。费率诱饵 vs 封号/压成功率真成本，这条框架没变；变的是具体出口。把出口写死成唯一答案，本身就是下一轮风险。


<a id="sec-11"></a>
## 11、中国开发者：钱能出去，也要能解释清楚回来

中国开发者的特殊性不在于"能不能收到钱"——Stripe HK、Paddle、Creem、以及新出现的 Waffo/Clink 等都有（或声称有）路径。特殊性在于**最后那一公里**——以及「有路径 ≠ 对你的品类稳定可用」：

1. **结汇额度**：个人年度便利化额度 5 万美元。但持续收全球商业收入后，它不再像偶发稿费，更像经营性收入。金额越大、频率越高，越需要公司化和税务化。

2. **服贸 vs 货贸**：银行和 PSP 的验证体系经常按货物贸易设计（要求物流凭证）。SaaS/数字产品是服务贸易，天生没有物流。选错通道（如万里汇），资金会被卡住。

3. **银行问询**：银行看的是模式——高频、小额、多来源、跨境、平台打款、用途模糊，都可能触发问询。你需要的是被问到时能说清楚，而不是"绕过问询"。[5](#ref-5)

4. **材料链**：中国 Stripe 卖家社区总结的防冻经验：平稳养号（新账户前 30 天避免交易暴增）、信息一致（公司主体、域名 WHOIS、银行账户、法人身份统一）、多通道备份、低拒付率（<1%）、固定 IP 登录。[6](#ref-6) 这些不是玄学，是风控信号管理。

**关于 Paddle 和 Creem（2026-07 更新）：** Paddle 接受中国个人注册（Business Type 选 Individual），但审批周期可能长达一个月，且社区报告过针对中国用户的大规模关户；其对生成式媒体品类的 AUP 限制，使 AIGC 产品更不应默认走这条路。[5](#ref-5)[15](#ref-15) Creem 费率仍是 3.9% + $0.40，也曾是对中国大陆身份相对友好的 MoR——但 2026 年中起，社区多源报告 AIGC 品类支付成功率恶化；官方文档对 AI 图像/视频加码合规。稳定性风险已从「待观察」变成「已观察到品类级收紧」。详细时间线与替代选项见[第十节](#sec-10)。


<a id="sec-12"></a>
## 12、选择框架

以下不是"照着做就没事"的指南。是帮助你在信息不完备的情况下做更清醒的选择。

**产品验证期（< $3k MRR，无公司主体）：**

MoR 优先——原因不是你选 MoR 就完美，而是你没有能力接住 PSP 省下来的责任。早期最贵的不是手续费，是注意力被烂事吃掉。但 **2026-07 起，名单要按品类分流，不能再默认「Paddle / Creem / LS」三件套**：

- 非 AIGC / 低敏 SaaS：仍可讨论 Paddle、LS（迁移中）、Stripe Managed Payments 等，各自带证据边界。
- AIGC 生成式媒体：**不要默认 Paddle**（AUP 对 image generators / deepfake / voice cloning 等不友好）；**不要默认 Creem 为首选**（品类风控已收紧）。
- 可研究新选项（**非背书**）：Waffo Pancake（无 LLC、公开 3.9%+$0.50、当前 payout 仅 CNY）；Clink（偏公司主体 / 邀请制、Agent+Billing、费率未公开）。自行核验合规与 AUP，不要把从业者推荐文当尽职调查。

硬规则：**通道不能只有一条。** 单 MoR = 单点故障——硬封号或压成功率都足以让订阅收入腰斩。

**注意：** 如果 80%+ 客户在美国，且你愿意自己处理 US sales tax，Stripe + Stripe Tax 也合理。MoR 不是道德正确——它是一个算账问题。

**稳定运营期（>$10k MRR，有海外公司主体）：**

PSP + 税务体系（Stripe/PayPal + Stripe Tax/Anrok/TaxJar + accountant）。这时 PSP 的低费率才开始有意义——因为你已经有组织能力接住它省下来的责任。仍然建议保留一条 MoR 或第二 PSP 作备份。

**AI / AIGC 特殊提醒：**

AI 产品除了 MRR，还要监控 dispute rate、refund rate、failed delivery rate、chargeback exposure、payout delay——以及 **支付成功率与续费健康度**。交易量暴涨 + 生成失败 + 退款上升 = 支付平台的高风险信号。[1](#ref-1)[7](#ref-7) Dashboard 还活着、续费却进不来，可能比「已被封号」更危险——因为你更晚才会迁移。


<a id="sec-13"></a>
## 13、最后

出海收款不是一个支付按钮问题。它是商业责任、平台风控、税务合规和现金流安全的交叉点。

最危险的新手心态不是"不知道"，而是"先接 Stripe，赚钱了再说"——或者「先接某一个当下最火的 MoR，赚钱了再说」。

更稳的心态是：**先选一条当前阶段能承受责任的资金链路；有条件就准备第二条。**

真正的闭环不是用户付款成功。真正的闭环是：

```text
用户付了钱 → 平台放了款 → 银行接了钱 → 税务说得清 → 你能安心花
```

在那之前，收入只是账面幻觉。

钱不是进了 Stripe 就算你的。钱只有穿过整条责任链，最后还能被解释清楚，才算真正落袋为安。


## Sources

本文采用研究整理立场，非亲历者叙述。所有社区案例标记为个案，不作为统计证据。不构成法律、税务或合规建议。MoR 景观快照：2026-07。

<a id="ref-1"></a>1. **Platform official docs**: Google AdSense Help (payment timelines), Apple Small Business Program, Google Play Service Fees, Stripe Pricing, PayPal Checkout fees, Paddle/LS pricing pages — inspected 2026-05；终稿复核至 2026-07。
↩ Cited in: [二](#sec-2)、[四](#sec-4)、[六](#sec-6)、[十二](#sec-12)

<a id="ref-2"></a>2. **Fee crossover analysis**: dev.to community comparisons (2026), Stripe vs Paddle vs LS fee breakdown with tax compliance factored in. Crossover point ~$3k MRR for parity, ~$25k MRR for clear Stripe advantage.
↩ Cited in: [四](#sec-4)

<a id="ref-3"></a>3. **Stripe acquires Lemon Squeezy**: TechCrunch (2024-07-26), LS official blog post at lemonsqueezy.com/blog/stripe-acquires-lemon-squeezy — both live as of 2026-05-19. Stripe newsroom URL returned 404; use TechCrunch or LS blog.
↩ Cited in: [七](#sec-7)

<a id="ref-4"></a>4. **LS 2026 Update**: "2026 Update: Lemon Squeezy + Stripe Managed Payments," LS blog (2026-01-28), and "Stripe + Lemon Squeezy Update: A Big Milestone Reached" (2025-04-29). Both live.
↩ Cited in: [七](#sec-7)

<a id="ref-5"></a>5. **China developer cases**: V2EX threads (2024-2025) — WorldFirst blocks SaaS payout, personal→HK transfer risks; LINUX DO community guide (2025); Shenzhen ODI case via szsscr.com; Hangzhou illegal FX case. All web-search surfaced; individual accounts, not systematic survey data.
↩ Cited in: [八](#sec-8)、[九](#sec-9)、[十一](#sec-11)

<a id="ref-6"></a>6. **Stripe freeze cases (China sellers)**: 10100.com — three documented cases with timelines: transaction spike → 90-day freeze, counterfeit goods → permanent ban, high chargeback rate → 60-day restriction. Seller-side accounts.
↩ Cited in: [十一](#sec-11)

<a id="ref-7"></a>7. **HN discussions**: Thread 47565502 (Stripe $85k case, 2026-03-29), Thread 43298663 (VAT/Sales Tax for B2C SaaS, 2025-03-11). Founder/practitioner accounts.
↩ Cited in: [五](#sec-5)、[十二](#sec-12)

<a id="ref-8"></a>8. **Reddit r/SaaS**: Threads 1mjge8v (payment processor comparison, 2025-08), 1op85aw (LS migration rationale, 2025-11). Individual preference reports.
↩ Cited in: [六](#sec-6)

<a id="ref-9"></a>9. **刘小排 — Creem之后，AI产品收款用这两家** (2026-07)：从业者视角的 Creem 风控收紧叙述与 Waffo/Clink 推荐；含邀请/返佣动机，**非中立测评**。本地存档：[source-xiaopai-creem-mor-2026-07.md](./source-xiaopai-creem-mor-2026-07.md)。「换掉 Stripe 自建风控」「官方压成功率邮件」等为当事人/转述，本稿未独立证实原文。
↩ Cited in: [十](#sec-10)

<a id="ref-10"></a>10. **Creem official**: [Pricing](https://www.creem.io/pricing)（3.9% + $0.40）；[Getting Started](https://docs.creem.io/getting-started/introduction)；blog posts 2026-06-09 / 2026-07-20（平台仍在公开运营）。
↩ Cited in: [十](#sec-10)

<a id="ref-11"></a>11. **Creem AI compliance**: [AI Wrapper Compliance](https://docs.creem.io/merchant-of-record/account-reviews/ai-wrapper-compliance)；[Moderation API](https://docs.creem.io/features/moderation) — AI 图像/视频额外合规；deepfake/NSFW 限制；不合规可 restrict/suspend。
↩ Cited in: [十](#sec-10)

<a id="ref-12"></a>12. **Creem community cases (2026)**: 孟健《Creem 被封了！》(2026-03-31) [腾讯云开发者社区](https://cloud.tencent.com/developer/article/2648513) — AI 换脸产品封号、冻资 90 天；Niko (2026-07-27) 称「Creem被VISA封杀、订阅砍半」；V2EX [t/1225561](https://www.v2ex.com/t/1225561) (2026-07) — Creem 收银台流失讨论。均为个案/社区报告。
↩ Cited in: [十](#sec-10)

<a id="ref-13"></a>13. **Waffo Pancake**: [waffo.ai](https://www.waffo.ai/en) / [docs.waffo.ai](https://docs.waffo.ai/) — MoR，3.9%+$0.50，无 LLC，**不支持 Alipay/WeChat Pay**，payout 当前仅 CNY；融资：腾讯新闻 / 上证报 (2026-02-04) — A 轮超 $15M，Illuminate + 高榕领投，汇丰、BAI Capital 参投。
↩ Cited in: [十](#sec-10)

<a id="ref-14"></a>14. **Clink (clinkbill.com)**: [Terms](https://www.clinkbill.com/terms) — Clink Technology Inc.，明确 Merchant of Record；BV 百度风投专访 (2026-04-07) 称 Celtic + BV 联合领投；[GlobeNewswire](https://www.globenewswire.com/news-release/2026/04/30/3284590/0/en/Clink-Launches-the-World-s-First-Fiat-Agentic-Payment-Skill-Letting-Any-Merchant-Get-Paid-by-AI-Agents.html) (2026-04-30) Agentic Payment Skill。客户名单与公开费率：**未充分核实**。
↩ Cited in: [十](#sec-10)

<a id="ref-15"></a>15. **Paddle AIGC / AUP**: [Paddle Help — What am I not allowed to sell](https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle)；Freemius [Payment platform restrictions for AI apps](https://freemius.com/blog/payment-platform-restrictions-ai-apps/) — Paddle 对 AI image generators、deepfake、voice cloning 等明确不友好。
↩ Cited in: [十](#sec-10)、[十一](#sec-11)
