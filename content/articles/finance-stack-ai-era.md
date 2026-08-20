---
title: "AI 改写的是账本的前传，不是责任链"
date: "2026-08-20"
description: "AI 时代真正变重的不是账本，是账本前面那一层：预算、审批、报销、票据、数据入口。前台会越来越像飞书和 Ramp，正式记账内核不会消失——中国把它写进了软件功能规范，美国把它写进了内控举证。同一条边界，两种保证方式。"
tags: ["财务系统", "会计系统", "ERP", "飞书", "Ramp", "数电发票", "代理记账", "finance-stack"]
categories: ["商业"]
publish: true
---

如果今天重新给一家公司搭财务系统，最容易犯的错不是选错产品，是把问题问错。

常见的问法有三种：AI 时代还需要传统财务软件吗？飞书、多维表格、审批、AI 识票，不就够了吗？最前沿的 AI 公司，是不是早就不用那些有灰尘味的会计系统了？

这三个问法有同一个毛病：把「界面新不新」当成了「系统够不够」。这套直觉不荒唐——过去两年真正有时代感的东西，确实不是老派财务软件的 landing page，而是协同工具、工作流、AI 节点、OCR、自动化集成。但只要把问题从「怎么先跑起来」换成「怎么把钱、票、税、责任链管起来」，答案立刻就不轻盈了。

<a id="sec-0"></a>
我的判断很直接：**AI 时代没有消灭账本。变重的是账本前面那一层——预算、审批、报销、票据、协同、数据入口。** 前台会越来越像飞书、Ramp、自动化工作台[10](#ref-10)；后台仍然需要一个正式记账内核。中美都成立，区别只在制度压力和默认搭法。

压缩成一句：**表格是思考和协同的界面，账本是责任的基础设施；AI 改写的是前传，不是责任链本身。**

<a id="sec-1"></a>
## 一、四层，讲一次就够

| | 这一层负责 | 典型形态 |
|---|---|---|
| **L1 协同与流程前台** | 预算申请、报销审批、项目收支、付款流转、单据归档、提醒与工作流 | 飞书 / 多维表格 / Ramp / Brex |
| **L2 票据、费控与集成** | 发票识别验真、审批结果同步、字段映射、预算占用、单据推凭证、ERP 对接 | 费控产品、伙伴方案、连接器 |
| **L3 正式会计内核** | 凭证、账簿、过账、结账、报表、审计轨迹、票税衔接、责任追溯 | 会计系统 / 财务云 / ERP |
| **L4 服务交付** | 记账、报税、归档的人力交付 | 代理记账 / outsourced controller / FaaS |

分层之后，很多争论自动消失。「飞书还是财务软件」「Excel 还是 ERP」都不是真问题。真问题是：**哪一层归协同工具，哪一层归集成，哪一层归正式账本，哪一层归服务交付。**

<a id="sec-2"></a>
## 二、最 AI-native 的公司，没有把账本做轻

先说证据等级：下面三家全部来自公开招聘页。招聘页说明的是招聘意图，以及公司愿意承认自己有什么系统，不等于内部架构公告。这一节按这个折扣读。

**OpenAI** 的 Core Financials 岗位把 Oracle Fusion 当既有系统写——own Oracle Fusion Financials configuration and support，涵盖 GL、Subledger Accounting、Financial Reporting Center，还要求这个人做 Oracle Fusion 的 close and consolidation application administrator。另一个 Accounting Manager 岗位写的是 Oracle Fusion preferred 加 advanced Excel skills。[1](#ref-1) 这两句话的分量不一样：前者在描述一个正在跑的系统，后者只是候选人偏好。别把后者说成「他们在生产环境跑 Oracle Fusion」。

**Anthropic** 的多个岗位写着 based on our recent go live on Workday Financials，更早的岗位写的是 managing the NetSuite financial ERP。[2](#ref-2) 方向不是去会计化，是把核心平台做重、把自动化做深。

**Cursor** 最有信息量，而且信息不在品牌上。Billing 工程岗原文：Evolve our ledger system that serves as the source of truth for customer balances, credits, overages, and adjustments——with the correctness guarantees that financial systems require。同一页还写明这个岗位不管税务合规和通用财务基础设施。[3](#ref-3) 也就是说，产品侧先长出了一个自己的不可逆账本，它和财务侧的 GL 是两件东西。Revenue Accounting 岗那句更直白：要让产品和管子里出来的东西，和 GL 对得上。

三家的共同信息不是「用了哪个品牌」，是：**最 AI-native 的公司没有去账本化，它们把账本工程化了。** 顺带一个反推：如果你的产品本身会产生金钱事件（用量、额度、超额、退款），那你的工程团队已经在做会计了，只是还没这么叫它。

<a id="sec-3"></a>
## 三、中国：制度把内核焊死了

中国这边最硬的不是厂商宣传，是财政部的文件。

《会计软件基本功能和服务规范》（财会〔2024〕12号）第二十一条第（三）项原文：会计软件应当提供**不可逆的记账**功能，不得提供对已记账凭证的删除和插入功能，确保对同类已记账凭证的**连续编号**，不得提供对已记账凭证日期、币种、汇率、金额、科目、**操作人**等的修改功能。[4](#ref-4)

读一遍它的语法。这不是「建议你严谨一点」，是**规定产品不得提供某些功能**。同一份规范第五条更直接：不得有违背国家统一的会计制度的功能设计。全世界的企业软件都在卷「更灵活、更能改、更好协作」，只有这一类，规范里写的是不能改。

所以飞书多维表格和会计软件的差别不是成熟度，是符号相反：一个的设计中心是让你能改，一个是让你改不了。你没法靠加功能把前者变成后者，你得给它减权限——减到那个程度它就不是它了。

这条也顺手划出了 AI 的天花板，而且不用讲道德：**不能修改的字段里有「操作人」。** 账上永久钉着一个人。同一条第（一）项允许审签程序自动化，但要求自动审核规则可查询、可校验、可追溯，并且要用户对特定自动化处理「进行授权操作」。翻译过来就是：AI 可以出草稿，签字的还得是人。

还有两个时间点值得记。这份规范 2025 年 1 月 1 日施行，替换的是 1994 年那份《会计核算软件基本功能规范》——上一版管了三十年。而财政部的印发通知写明，施行前已投入使用但不达标的会计软件，应当自施行之日起 3 年内升级完善；财会〔2025〕9号 又把这个 3 年期限和电子凭证会计数据标准的适配绑在一起。[4](#ref-4)[5](#ref-5) 2028 年初是个硬日子。

前台隔几年就换一代，内核三十年才换一版。**分层的真正依据是变化速率，不是新旧。** 把这两种东西塞进同一个系统，等于让折旧周期差一个数量级的东西共用一套代码。

另外两步补齐了这条链：数电发票全国推广（全国统一赋号、单一联次数字形态、税务数字账户）[6](#ref-6)，和电子凭证会计数据标准的全国推广——把接收、验签验真、解析、报销、入账、归档拉成一条标准流程，财政部还直接发免费工具包做验签和解析。[5](#ref-5) 所以 L2 这一层的产品差异会被标准慢慢压平，别把它当护城河。

最后是中国特有的第四层。代账不是「买不起软件」的将就，是把签字权合法外包：《会计法》第三十四条把「委托经批准设立从事会计代理记账业务的中介机构代理记账」列为组织会计工作的方式之一，而代账机构须经县级以上财政部门批准、领取代理记账许可证书。[7](#ref-7) 这一层是**持牌的**。

<a id="sec-4"></a>
## 四、美国：同一条边界，换了一种保证方式

美国不是没有这条边界，是保证方式不同。约束主要写在内控和举证上：SOX 404 要求管理层评估财务报告内控的有效性并保留支持评估的证据，再由会计师事务所出具鉴证意见。[8](#ref-8) 落点是流程、证据、可审计性，不是「软件必须有／不得有哪些功能」。

所以美国最敏感的东西是 month-end close、controls、revenue recognition、审计证据链。财务现代化的比法不是「谁先不用账本」，是**谁 close 更快、证据更全、revrec 更稳**。

搭法上，美国最稳定的形状是：GL core 很老实（QuickBooks、NetSuite，有时 Sage Intacct），spend 和 workflow 层在外面（Ramp、Brex、Bill.com、Expensify），分析层在表格里。不是一个现代产品通吃。

而且美国也有第四层，别装作没有。很多早期公司不会一开始就自建 finance systems 团队，而是把 QuickBooks / Xero / NetSuite 和 outsourced bookkeeping、outsourced controller、FaaS 组合起来。差别在于：**中国的第四层是持牌的，美国的第四层是合同约束的。**

这一层还有一个容易被忽略的经济学。中国代账市场按收入算的第一名，市场份额只有 0.5%。[9](#ref-9) 软件的边际成本趋零，所以软件市场会集中；这个市场没有集中。原因不难猜——这一层卖的不只是做账，是**有人愿意在你账上署名**。AI 能把做账的边际成本压到很低，压不低署名的价格。

<a id="sec-5"></a>
## 五、表格永远重要，也永远不够

强在：预算、预测、差异分析、bridge schedule、ad hoc 管理视图、轻量流程。

弱在：不可逆记账、正式过账、连续编号、期间关闭、审计轨迹、责任链。

所以正确的说法不是「表格过时了」，而是：**表格强在思考和解释，弱在正式记录和追责。**

AI 首先吃掉的也是这一侧——第一轮录入、重复搬运、手工整理票据、跨系统抄字段、大量低价值追问。这些动作有一个共同点：错了可以免费重来。这就给了一把很好用的尺子：**一个 AI 动作值不值得上，先问它错了能不能免费重来。** 能，就放开用；不能，就只让它出草稿。

<a id="sec-6"></a>
## 六、真要选

**美国公司**

- 很早期：QuickBooks / Xero + outsourced bookkeeping 或 controller + 表格
- 成长期 SaaS：NetSuite / Sage Intacct + Ramp / Brex / Bill.com + revrec 与 close 工具 + 表格
- 复杂 AI / SaaS：ERP + billing/revrec 层 + 很可能再自建 ledger 和集成层

**中国公司**

- 很小：飞书做预算、审批、报销、单据收集 + 代账或正式会计系统承接记账、报税、归档
- 成长期：飞书前台 + 费控／票档／集成层 + 正式记账内核
- 更复杂：更重的财务云或 ERP 当记录系统，飞书当操作台，集成层把两边接起来

比清单更值得记的是一个诊断：**多数公司的问题不是该不该上 ERP，是边界画错了。** 在 ERP 里做预算假设分析，慢得让人放弃；在多维表格里做正式账，审计时说不清。两种病的症状相反，根因是同一条线画错。

**只能记一句：** 表格是思考的界面，账本是责任的基础设施。AI 让前传几乎免费，署名一分没便宜。

## 参考来源

<a id="ref-1"></a>
1. OpenAI. *Business Systems, Core Financials*；*Accounting Manager*. 2026-08-20 核对。[core financials](https://openai.com/careers/business-systems-core-financials/) · [accounting manager](https://openai.com/careers/accounting-manager-san-francisco/)
   前者原文「own Oracle Fusion Financials configuration and support」、「Serve as the Oracle Fusion close and consolidation application administrator」，模块含 GL / Subledger Accounting / Financial Reporting Center；后者原文「Design and maintain SOX-ready controls」「Proficiency with ERP systems (Oracle Fusion preferred) and advanced Excel skills」。SOX-ready 与 advanced Excel 出自 Accounting Manager 岗，不是 Core Financials 岗。
   ↩ Cited in: [二](#sec-2)

<a id="ref-2"></a>
2. Anthropic. *Senior Business Systems Analyst, Finance Systems*（含 Assets & Lease Management）；早期 *Finance Systems Engineer*. 2026-08-20 核对。[greenhouse 4991194008](https://job-boards.greenhouse.io/anthropic/jobs/4991194008) · [greenhouse 5301883008](https://job-boards.greenhouse.io/anthropic/jobs/5301883008)
   原文「based on our recent go live on Workday Financials」「Building on our recent go live on Workday Financials」；早期岗位原文「responsible for managing the NetSuite financial ERP」。NetSuite → Workday 的迁移是基于新旧两代岗位的推断，不是公司公告。
   ↩ Cited in: [二](#sec-2)

<a id="ref-3"></a>
3. Cursor. *Software Engineer, Billing*；*Revenue Accounting*. 2026-08-20 核对。[billing](https://cursor.com/careers/software-engineer-billing) · [revenue accounting](https://cursor.com/careers/revenue-accounting)
   Billing 岗原文「Evolve our ledger system that serves as the source of truth for customer balances, credits, overages, and adjustments — with the correctness guarantees that financial systems require」，并明确该岗不负责「tax compliance, or general finance infrastructure unless it intersects directly with the billing system」。Revenue Accounting 岗原文「so that what the product and pipes produce is what the GL reflects」；同页 NetSuite 出现在「Help select, implement, and improve billing and revenue systems (e.g., NetSuite, Stripe, or similar)」与候选人经验要求里——是选型候选和候选人技能，**不是已装栈证据**。
   ↩ Cited in: [二](#sec-2)

<a id="ref-4"></a>
4. 财政部. *关于印发《会计软件基本功能和服务规范》的通知*（财会〔2024〕12号，2024-07-29）. 2026-08-20 核对原文。[国务院公报](https://www.gov.cn/gongbao/2024/issue_11606/202409/content_6976924.html) · [PDF](https://www.gov.cn/zhengce/zhengceku/202408/P020240808443343747614.pdf)
   第二十一条（三）逐字引用见正文。另：第五条「不得有违背国家统一的会计制度的功能设计」；第二十一条（一）「会计软件的自动审核规则应当可查询、可校验、可追溯。会计软件应当支持用户针对特定审签程序的系统自动化处理进行授权操作」；第四十七条本规范自 2025-01-01 施行，同时废止《会计核算软件基本功能规范》（财会字〔1994〕27号）；印发通知「本规范施行前已经投入使用但不符合本规范有关要求的会计软件，应当自本规范施行之日起 3 年内进行升级完善，达到要求」。
   ↩ Cited in: [三](#sec-3)

<a id="ref-5"></a>
5. 财政部等九部门. *关于推广应用电子凭证会计数据标准的通知*（财会〔2025〕9号，2025-05-09）. 2026-08-20 核对原文。[gov.cn](https://www.gov.cn/zhengce/zhengceku/202505/content_7024318.htm) · [税务总局法规库](https://fgk.chinatax.gov.cn/zcfgk/c102416/c5240524/content.html)
   原文「单位配备的会计软件和会计软件服务商提供的会计软件，应当自两项规范施行之日起 3 年内完成升级，达到适配电子凭证会计数据标准的相关要求」（「两项规范」指财会〔2024〕11号、12号）；标准覆盖「接收（含验签或验真、解析）、报销、入账、归档等全流程各环节」；「使用财政部发布的免费工具包或自主开发工具包」；小微企业可委托符合标准的服务平台或代理记账机构处理。
   ↩ Cited in: [三](#sec-3)

<a id="ref-6"></a>
6. 国家税务总局. *关于全面数字化的电子发票有关事项的公告*（2024年第11号）. [税务总局法规库](https://fgk.chinatax.gov.cn/zcfgk/c100012/c5236067/content.html)
   号码全国统一赋予、数字化形态（单一联次）、税务数字账户、入账标识、20 位号码。注：公告全文无「数字签名」表述，前稿该处已删。
   ↩ Cited in: [三](#sec-3)

<a id="ref-7"></a>
7. 《中华人民共和国会计法》（2024 修正）第三十四条第（三）项；财政部令第80号《代理记账管理办法》（2016-05-01 施行）第三条。[会计法](https://fgk.chinatax.gov.cn/zcfgk/c100009/c5211790/content.html) · [代理记账管理办法](https://www.gov.cn/gongbao/content/2016/content_5074059.htm)
   会计法原文「委托经批准设立从事会计代理记账业务的中介机构代理记账」；第80号令第三条「除会计师事务所以外的机构从事代理记账业务应当经县级以上地方人民政府财政部门批准，领取由财政部统一规定样式的代理记账许可证书」。
   ↩ Cited in: [三](#sec-3)

<a id="ref-8"></a>
8. U.S. Securities and Exchange Commission. *Management's Report on Internal Control Over Financial Reporting…*（SOX 404 实施规则，2003）. [sec.gov](https://www.sec.gov/rules-regulations/2003/03/managements-report-internal-control-over-financial-reporting-certification-disclosure-exchange-act)
   管理层须评估并报告财务报告内控的有效性、保留支持该评估的证据，注册会计师事务所出具 attestation report。
   ↩ Cited in: [四](#sec-4)

<a id="ref-9"></a>
9. 慧算账（SATP Holding Inc.）港交所招股书数据，经财经媒体转述。[经济观察网](http://www.eeo.com.cn/2025/0312/715925.shtml) · [新浪财经](https://finance.sina.com.cn/stock/stockzmt/2025-03-08/doc-inenyfth1529988.shtml)
   招股书引弗若斯特沙利文口径：2021—2023 年按总收入计，慧算账为中国最大的中小微企业财税解决方案提供商，2023 年市场份额 **0.5%**。**本条为二手转述，未核到招股书原文**；此处只用「第一名份额仍是个位数以下」这一量级，不依赖具体小数。
   ↩ Cited in: [四](#sec-4)

<a id="ref-10"></a>
10. 飞书官方材料（前台层定位）。[多维表格搭轻量预算管理系统](https://www.feishu.cn/content/article/7579175238592793797) · [同步审批数据到多维表格](https://www.feishu.cn/hc/zh-CN/articles/276492308920) · [业财票档全场景解决方案](https://www.feishu.cn/content/yecaipiaodan-full-scenario-solution) · [飞书+ERP 系统解决方案](https://www.feishu.cn/content/feishu-erp-system-solution)
    官方自我定位落在预算、审批同步、费控分析、单据归档与「前端协同 + 后端入账」，不含会计核算内核——这是本文把它放在 L1 而不是 L3 的依据。
    ↩ Cited in: [开头](#sec-0)
