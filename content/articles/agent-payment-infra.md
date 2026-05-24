---
title: Agent Payment 基础设施：AI 支付不是让模型花钱这么简单
description: >-
  拆解 agent payment 的核心问题：identity、mandate、scoped credential、settlement 和 audit
  如何重组 AI commerce 基础设施。
keywords:
  - agent payment
  - AI commerce
  - payment infrastructure
  - scoped credential
  - mandate
  - settlement
  - audit
  - Stripe Link
  - Claude
  - agent commerce
published_date: '2026-05-01'
updated_date: '2026-05-01'
tags:
  - AI Agent
  - 支付
  - AI Commerce
  - 基础设施
  - Stripe
  - 协议
---

# Agent Payment 的真正问题不是「让 AI 花钱」

当 Patrick Collison 发推说 Claude 用 Link CLI 给自己买了一份 HTTPZine 的时候，大部分人的反应是「AI 可以花钱了」。这句话没错，但它是这个方向上最无聊、最没有信息量的一句话。

「AI 花钱」是 checkout 层的终态。真正在发生的事比这大得多：identity、mandate、scoped payment credential、service catalog、account provisioning、API credential issuance、settlement、receipt/audit、dispute/liability 正在被重新打包成一套新的 infrastructure layer。agent 正在成为 economic actor，而 infrastructure 的回应不是「给 agent 一张卡」，而是把上述每一层都重做一遍。

叫它「agent payment」是低估了它。叫它「agent commerce / provisioning infrastructure」才接近真相。

这篇文章试图把这个正在形成的 infrastructure 拆清楚：谁在做什么、各自拿的是什么牌、以及为什么当前最理性的判断是「值得持续研究，不值得把 demo 当 adoption，把 protocol spec 当 market，把 partner logo 当 scale」。

---

## 1. 一个 permissioned capability system，不是一张 AI 信用卡

Stripe Link CLI 是一个公开的 TypeScript monorepo（`stripe/link-cli`，MIT 协议，最新 release `@stripe/link-cli@0.4.1`，2026-04-30）。它做的事情可以被一句话说清楚：让 agent 请求一个**有边界的、一次性的购买能力凭证**，然后等人 approve。

Agent 不持有卡号。Agent 创建一个 spend request，用户在自己的 Link app 或 approval URL 里 confirm（Face ID / passkey），confirm 之后 credential 才被 mint。Credential 分两种：

- **一次性虚拟卡**（virtual card / PAN）：给普通 web checkout 用。agent 拿到 number / cvc / exp / billing address，用完即废。
- **Shared Payment Token（SPT）**：给支持 Machine Payments Protocol（MPP）的 merchant 用。SPT 是 one-time-use，且被密码学地绑定到 merchant 的 Stripe Business Profile——token 换一个 merchant 就解不开。

关键设计不是「agent 能花钱」，而是 credential 的 issuance 条件：

- 人 approve 之前，credential 不存在。
- credential 是一次性的，或被 scope 到特定 merchant 和金额上限。
- merchant identity 被绑定到 credential 上，不是 agent 说去哪花就去哪花。
- 原始卡号不进入 agent 的 context window，不进入 chat log。
- 当前 README 明确写了单次 `amount` 不超过 50000 cents（$500）。

Steve Kaliski（Stripe 内部）的 launch 文章进一步确认：虚拟卡的限额走 Stripe Issuing，SPT 的限额在 token issuance 时确定；购买意图上下文（merchant、line items、amounts）出现在用户审批 UI 里，并用于 scope 最终生成的 credential。

这不是一张信用卡加了一层 API。这是一个 **permissioned capability system**。无聊但准确的词是 `capability`；花哨但危险的词是「AI 信用卡」。

---

## 2. 从支付扩展到「成为客户」：Stripe Projects + Cloudflare

如果 Link CLI 解决的是「agent 怎么付钱」，那 Stripe Projects 解决的是一个更根本的问题：「agent 怎么成为一个服务的客户」。

Cloudflare 的 partner blog 是截至目前最完整的公开案例。它描述了一个三组件协议：

1. **Discovery**：agent 通过 catalog API 查询可用的 service。
2. **Authorization**：platform（这里是 Stripe）证明 user identity；provider（这里是 Cloudflare）据此 provision 或 link 账户，发放 credential 给 agent。
3. **Payment**：platform 提供 payment token，provider 用它完成 billing。原始支付信息不暴露给 agent。默认每月 spending limit 是 $100/provider。

操作上这意味着什么？一个 agent 可以从「用户没有任何 Cloudflare 账户」走到：

- Cloudflare 账户自动 provision
- API token 返回给 agent
- 通过 Stripe Projects CLI 购买 domain
- 部署应用到生产环境

如果用户的 Stripe 登录邮箱已经关联了 Cloudflare 账户，走的是 OAuth grant 流程。如果没有，Cloudflare 自动创建。全程没有人在 dashboard 里手动操作、手动复制 token、手动输入卡号。

这不是支付创新。这是 **agent customer onboarding**：discovery + account creation/linking + credential issuance + billing + API access。商业原语不是 `pay`，而是 `become a customer and operate the service`。对 coding agent 来说，这比 checkout 重要得多——deploy 需要的不只是一次支付，而是一个 account + payment method + API token + resource purchase 的 bundle。

Cloudflare 说任何有 signed-in user 的平台都可以充当「Orchestrator」角色，走同样的协议接入。这意味着这个模式的设计意图是可复制的，不只是 Cloudflare 和 Stripe 之间的一次性 demo。但目前它是一个 partner launch blog——证明了一个 provider flow 和公开意图，不能证明协议已经标准化、被广泛采用、在对抗性 agent 环境下安全、或者产生了经济上有意义的量。

---

## 3. 协议层：A2A、MCP、AP2、ACP、MPP、x402，各自在干什么

当多个协议同时在宣传材料里出现时，很容易被混成一锅粥。把它们放对位置，比罗列功能重要得多。

### A2A 不是支付协议

A2A（Agent2Agent）是 Google 推出的 agent interoperability / delegation protocol。它解决的问题是：一个 agent 怎么发现另一个 agent、理解对方能力、交付任务、跟踪长任务状态、接收 artifact。Google 2025-04 公布 A2A 时明确说它 complement MCP：MCP 是 agent-to-tool/resource，A2A 是 agent-to-agent。

A2A 的关键原语包括 Agent Card（能力发现）、task lifecycle、message parts、artifact、SSE / JSON-RPC / HTTP、长任务状态更新、多模态协商。A2A 已被贡献到 Linux Foundation，有官方 docs、GitHub repo 和 Python / Go / JS / Java / .NET SDK。

A2A 为什么跟支付有关？不是因为 A2A 能付款。而是因为：一旦 agent 可以 delegation 给其他 agent，payment / authorization / liability 就变得不可避免。A2A 制造了 multi-agent delegation chain 的场景，而这个场景需要 AP2 来回答「谁授权了谁、谁对这笔交易负责」。

**MCP**（Model Context Protocol，Anthropic 推出）是 agent-to-tool/resource。它让 agent 调用外部工具和数据源。MCP 本身不处理支付，但 MCP server 可以暴露付费资源（x402 Bazaar 已经这么做了）。

**AP2**（Agent Payments Protocol，Google 推出）才是支付授权层。核心原语是 **Mandate**——用户签署的密码学指令/数字合约。Mandate 区分两种场景：human-present approval 和 human-not-present delegated constraints。AP2 使用可验证数字凭证（SD-JWT / VC-style authorization），设计为安全/问责层，不是 settlement rail。Google 声称 60+ 组织参与，包括 Adyen、Amex、Coinbase、Etsy、Mastercard、PayPal、UnionPay 等，并将 AP2 捐给 FIDO Alliance 作为标准化路径。

**ACP**（Agentic Commerce Protocol，OpenAI + Stripe 联合推动）是 agent ↔ business checkout 的开放标准。ChatGPT Instant Checkout 是第一个实现：买家在 chat 里发现商品，确认购买，merchant 后端通过 ACP 接收订单。Merchant 仍然是 merchant of record——fulfillment、退货、客服、税务关系都留在 merchant 侧。Stripe 的 SPT 是支付原语。当前范围是美国用户从美国 Etsy 商家购买，OpenAI 说超过一百万 Shopify merchant「即将」接入，Shopify 已经有官方的 Agentic Storefronts 页面。

Stripe 2025-12-11 的 Agentic Commerce Suite 进一步暴露了真实摩擦：merchant 要自己维护 ACP endpoint、catalog specs、agent API requirements，可能每个新 agent 要花到 6 个月。Stripe 的方案是 hosted ACP endpoint + catalog upload/syndication + checkout/payment/fraud/order events。它宣布 onboarding brands 包括 URBN、Etsy、Ashley Furniture、Coach、Kate Spade、Nectar、Revolve、Halara、Abt，并通过 Wix、WooCommerce、BigCommerce、Squarespace、commercetools、Akeneo、Cymbio、Logicbroker、Mirakl、Pipe17、Rithum 等渠道 rollout。这比 launch demo 强，因为它承认了 integration pain 并给出 merchant onboarding/product packaging；但仍有 waitlist 和 rollout 语言。

**MPP 和 x402** 都复活了 `HTTP 402 Payment Required` 状态码，但定位不同。MPP（Stripe 主导）是 payment-method agnostic 的 HTTP auth 层：client 请求付费资源 → server 返回 `402 Payment Required` → client 授权支付并重试 → server 返回 resource + receipt。MPP 使用 `WWW-Authenticate: Payment` / `Authorization: Payment` / `Payment-Receipt` 语义，一个 endpoint 可以同时接受 Tempo stablecoin、Stripe cards/wallets via SPT、Lightning、card network token 或自定义 method。Cloudflare 明确说 MPP backward-compatible with x402。

x402（Coinbase 等推动）偏 crypto/stablecoin-native，使用 `PAYMENT-REQUIRED` / `PAYMENT-SIGNATURE` / `PAYMENT-RESPONSE` header，靠 facilitator 验证和结算链上支付。x402 有 Bazaar discovery layer：agent 可通过 `search_resources` 和 `proxy_tool_call` 搜索并调用付费 resource。Bazaar 不是手工黄页——resource 要经 CDP Facilitator 完成至少一次 successful settlement 才会被索引，搜索排序还会用 facilitator-side objective signals（buyer reach、transaction volume、recency、metadata quality）。

这些协议的共同状态是：spec 存在，部分 reference implementation 存在，但都不是 production default。AP2 强在协议设计和组织背书，弱在缺少公开 transaction volume 和 dispute 处理证据。ACP 的价值在于把 merchant checkout 标准化了，但「coming soon」不等于 live volume。MPP/x402 解决的是 agent 为 API 和资源付费的问题，不是完整 commerce UX。

---

## 4. Network 层：Visa / Mastercard / PayPal 在干什么

Network 层的玩家不是从零开始定义协议。它们的策略是在现有 card/payment rail 上铺一层 agent-compatible credential 和 policy。

**Visa** 的方向是让 merchant 识别「approved agent with commerce intent」，避免 agent 被 bot protection / fraud system 当成爬虫。Visa Developer 文档里出现了 agent-specific payment token、authentication / passkey、payment instructions / signals（确保 credential request 与用户 authenticated instruction 对齐，让 VisaNet authorization 与原始 instruction 对齐），以及用于 dispute resolution 的 signals（记录用户原始指令和 authorized purchase details）。Visa MCP Server 把 Visa Intelligent Commerce / VTS / Visa Developer Platform API 通过 MCP 暴露给 agent workflow。Visa 同时写了重要的 caveat：product is in process of development and deployment；features may not be available in all markets。

**Mastercard** 推 Agent Pay、Agentic Tokens、Payment Passkeys、Agent Toolkit/MCP。press release 说 all U.S. Mastercard cardholders will be enabled for Agent Pay by holiday season，global rollout later；Citi / U.S. Bank cardholders、PayOS、Firmly.AI、Basis Theory 等会先体验。Mastercard 和 FIDO Payments Working Group 一起做 verifiable credential standard。

**PayPal** 的 Store Sync 把 product catalog 和 commerce API 接到 PayPal agentic commerce services，让 AI agents 可以 discover products、create/manage carts、complete purchases。Agent Ready 则是把 existing PayPal / Braintree integration 接到 AI platforms。对 Braintree merchant，ChatGPT app 通过 `requestCheckout()` 触发 checkout，PayPal/Braintree 生成 one-time-use token（payment method nonce），绑定 merchant ID，受 amount / currency / expiry 约束。PayPal/Braintree 交易里会有 `transaction.facilitator_details.oauth_application_name`（例如 `ChatGPT`），merchant 可以在 Control Panel 或 API 里按 AI platform 搜索——这是 adoption 研究的潜在硬信号。

这些 network 层的优势是已有 merchant 覆盖和清算基础设施。劣势是：这些 credential 机制是不是真的被 agent developer 采用，还是只在 press release 里存在，需要独立证据。

---

## 5. OKX APP：概念最大，但「coming soon」太多

OKX APP 的核心 pitch 是：agent commerce 不只是 pay-per-request，而是 quote、negotiate、escrow、meter usage、settle、resolve disputes 的 full business cycle。stack 包括 OKX Agentic Wallet（self-custodial、TEE-secured、session keys、20+ chains）、Payment SDK（单笔、batch、pay-as-you-go，escrow coming soon）、APP protocol（agent-to-agent、agent-to-MCP、instant/delayed settlement，escrow coming soon）。

这条路的想象力比 ACP/MPP 更宽，但证据更弱。escrow 和 dispute resolution 仍是 coming soon。Stripe 有 card network merchant coverage 作为 adoption bridge；OKX 需要 partner integration、reference implementation、broker activity 和链上可追踪 activity 才能证明这条路走得通。目前它还是 high-concept protocol launch，不是 adoption。

---

## 6. 七个正在发生的趋势

把所有这些拉在一起看，以下趋势不是「可能发生」，而是已经有 artifact 证明基础设施原语正在形成：

**1. Checkout 正在扩展成 infrastructure。** Link CLI 和 ACP 的第一个动作是让 agent 完成 checkout，但真正的产品形态是 credential issuance + approval + merchant identity binding + settlement 的完整 stack。checkout 是入口，不是终局。

**2. 授权从 click-to-buy 变成 signed mandate chain。** AP2 的 Mandate、Link CLI 的 Face ID / passkey confirmation、PayPal 的 AP2-style signed mandate——授权不再是一个 session cookie，而是一串可审计的密码学指令。human-present 和 human-not-present 的边界被正式编码进协议。

**3. Payment credential 正在变成 scoped capability，不是 raw card。** 一次性虚拟卡、SPT、payment method nonce、agent-specific payment token——共同特征是 scope（merchant、amount、expiry）、one-time-use 或 narrow scope、不暴露原始支付信息给 agent。这是从「持卡人」到「capability holder」的迁移。

**4. Catalog / discovery 正在成为控制点。** Stripe Projects 的 service catalog、x402 Bazaar 的 resource discovery、ACP 的 product feed、PayPal Store Sync 的 catalog 接入——谁能把 service 和 product 放入 agent 可发现的范围，谁就掌握了一个关键控制点。Bazaar 更进一步：不是手工黄页，而是 settlement-gated + quality-scored indexing。

**5. HTTP 402 正在作为 paid resource access 回归。** MPP 和 x402 都在复活 `402 Payment Required`，但它的新用途不是 full shopping UX，而是 agent 为 API 调用、MCP tool、付费资源按次付费。这是 infrastructure 层的收费，不是消费者层的购物。

**6. Card network 在重建 token/risk/dispute 层以适配 agent。** Visa 和 Mastercard 不是袖手旁观。它们在 agent identity、token、authentication signal、dispute evidence 上投入，目的是让现有清算网络能处理 agent-originated transaction，同时不被 agent fraud 冲垮。

**7. Merchant integration 正在被产品化。** Stripe Agentic Commerce Suite 的 hosted ACP endpoint + catalog sync + order events + token exchange + fraud + dashboard enablement + participation process 表明：merchant 接入 agent commerce 不是一个 side project，而是一个需要 product packaging 的 onboarding 流程。PayPal Store Sync 和 Shopify Agentic Storefronts 是同一条线上的产物。

---

## 7. 真正的问题：十层堆栈里，谁掌握控制点

Agent commerce 可以分解成至少十层：

1. **Intent capture** — 用户到底授权 agent 做什么。
2. **Mandate / consent proof** — 签名的指令、passkey/biometric 确认、VC/SD-JWT 记录。
3. **Identity layer** — 用户身份、agent 身份、merchant/provider 身份、wallet/account 身份。
4. **Discovery layer** — 产品 catalog、service catalog、付费 API/MCP tool registry。
5. **Policy layer** — 预算、spending cap、允许的 merchant、时间、地域、风险标记。
6. **Credential issuance** — 一次性卡、SPT、payment token、wallet signature、API token。
7. **Execution layer** — checkout、API call、service provisioning、account creation、domain/resource purchase。
8. **Settlement rail** — card network、Stripe、PayPal、stablecoin/on-chain、bank transfer、Lightning。
9. **Receipt / audit trail** — payment receipt、mandate chain、order record、delivery proof。
10. **Dispute / liability layer** — fraud、退款、chargeback、agent 错误归因。

投资和研究上真正的问题不是「agent 会不会花钱」。agent 显然会花钱——demo 已经到处都是。真正的问题是：

> 这十层里，哪一层成为控制点，哪一层被 commoditize？

Candidate control points 包括：

- **consumer wallet / identity provider**：Link、PayPal、Visa、Mastercard。谁持有用户身份和支付方式，谁就有最大的 leverage。
- **agent surface**：ChatGPT、Claude、Perplexity、browser agent。用户在哪，购买意图从哪发起。
- **merchant integration layer**：Shopify、Stripe ACP、PayPal Store Sync。谁能把 merchant catalog 接入 agent 可发现的范围。
- **protocol/security layer**：AP2、ACP、MPP、x402。谁定义 interoperability 的标准。
- **fraud/risk layer**：Forter、Stripe Radar、network risk engine。agent 场景下的 fraud 和 identity 问题可能比传统电商更严重——adversarial agent 不是科幻设定。
- **cloud/provisioning layer**：Stripe Projects + Cloudflare-style orchestrator。对 coding agent 最直接有用的一层。

目前没有人同时掌握所有这些层。Stripe 的布局最广（Link CLI + Projects + ACP + SPT + MPP），但 adoption 证据停留在 launch 阶段。Google 有最强协议设计能力和 FIDO 标准化路径，但缺少 consumer wallet 起点。OKX 有最激进的协议想象力，但缺少 merchant coverage 和 fiat 入口。Visa / Mastercard 有清算网络，但 agent-specific credential 的 developer adoption 未经验证。

---

## 8. 证据层级：什么是已知的，什么不是

当前阶段的 evidence ladder 是清晰的：

- **Level 1 — Artifact exists**：repo / spec / SDK / MCP server 存在。ACP、AP2、x402、MPP、Mastercard Toolkit、Visa MCP 都满足。
- **Level 2 — Lifecycle documented**：approval、credential issuance、settlement、receipt、revocation 或 dispute signal 有文档。Stripe Link / SPT / MPP、AP2、PayPal Agent Ready、Visa VIC 满足一部分。
- **Level 3 — Controlled demo / launch partner flow**：OpenAI Instant Checkout、Cloudflare + Stripe Projects、OKX APP launch、Visa/Mastercard demos。真实，但局限于受控环境。
- **Level 4 — External developer integration**：GitHub examples、third-party wrappers、MCP integrations、merchant test apps。目前零散出现，质量参差。
- **Level 5 — Merchant self-serve or platform-native adoption**：merchant 能在 Shopify / Stripe / PayPal / Braintree / Mastercard / Visa developer dashboard 自助开启，并接到真实 agent surface。证据不足。
- **Level 6 — Catalog / provider expansion with observable inventory**：Stripe Projects provider catalog、x402 Bazaar resources、PayPal Store Sync catalogs、ACP merchant catalog 出现持续扩张且可观测。尚未发生。
- **Level 7 — Real usage / transaction volume / repeat provisioning**：真实用户、真实 agent、真实订单或 service provisioning 的重复使用数据。**公开证据仍然稀缺。**

全行业目前卡在 Level 3–4 之间。Demo 是真实的，screenshot 是真实的，repo 是真实的。但 Level 5、6、7 是另一回事。

最值得盯的不是谁发了新协议，而是谁把 Level 6 做成可抓取的 inventory，谁先披露 Level 7。

---

## 9. 当前判断

这是一个真实的 infrastructure 方向，不是一个纯 crypto narrative 或一个纯 PR campaign。Stripe、Google、OpenAI、Cloudflare、Visa、Mastercard、PayPal、OKX 各自从不同的筹码出发，在画不同的地图，但地图的底层 terrain 是同一片：identity、mandate、credential、catalog、provisioning、settlement 正在被重新定义，因为 **consumer 从人变成了 agent**。

但目前阶段最危险的错误是把 demo 当成 adoption，把 protocol spec 当成 market，把 partner logo 当成 scale。

资本主义在这方面是 stubbornly evidence-based：直到真实用户在真实场景中通过 agent 完成了真实交易——不只是 demo video——这个领域才值得从「研究/watchlist」升级为「投资/仓位」。

在那之前，值得做的只有一件事：持续盯着 artifacts、catalog growth、merchant integration 和真实 usage，不被 launch demo 骗。

---

## Evidence boundary / 证据边界

本文所有具体事实描述来自以下公开可核验材料，不包含内部数据或未公开信息：

- Stripe Link CLI GitHub repo（`stripe/link-cli`，v0.4.1，MIT），2026-04-30 确认
- Link agents 页面（link.com/en-sg/agents）
- Steve Kaliski X Article：How we built the Link CLI（2026-04-29）
- Cloudflare blog：Agents can now create Cloudflare accounts, buy domains, and deploy（2026-04-29）
- Google AP2 官方公告、ap2-protocol.org、GitHub（`google-agentic-commerce/AP2`）、A2A 官方 docs 和 Linux Foundation 公告
- OpenAI Instant Checkout 公告、ACP 文档（agenticcommerce.dev）、ACP GitHub、Stripe ACP/SPT/UCP docs、Stripe Agentic Commerce Suite blog（2025-12-11）
- Stripe MPP docs、Cloudflare MPP/x402 docs、MPP 官方 spec（mpp.dev）、Coinbase CDP x402 Bazaar docs、x402 Foundation GitHub
- Visa Intelligent Commerce / Trusted Agent Protocol developer docs（含 product in deployment caveat）
- Mastercard Agent Pay press release / Agent Toolkit docs
- PayPal Store Sync / Agent Ready developer docs
- OKX Agent Payments Protocol 公开 announcement 和 whitepaper
- Shopify Agentic Storefronts 官方页面

以下信号需要后续跟进核验，本文未将其作为事实陈述：

- Stripe Projects catalog 的实际 provider 数量（非 launch partner）
- MPP/SPT 在非 Stripe 控制 merchant 中的实际采用
- AP2 的 FIDO 标准化进展和 member org 的实际 implementation
- ACP Shopify merchant 实际上线数量（vs「coming soon」）
- OKX APP 的 reference implementation 和链上 activity
- Visa/Mastercard/PayPal agent-ready credential 的实际 developer adoption 数据
- 各协议的 dispute/liability 规则（目前公开材料中几乎空白）
- 任何一方的实际 transaction volume 或 GMV 数据
