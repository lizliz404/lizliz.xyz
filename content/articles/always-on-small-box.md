---
title: "四美元的小机和一套 ERP，买的是同一件东西"
date: "2026-08-20"
description: "2026 年还叫「云」的，其实是三张账单：会话算力、个人工作台、守护进程。AI 平台把前两层做成了订阅，第三层还得自己买。这套切分在一台四美元的小机上看得最清楚，放大到 ERP 也成立——变的是法域、认证目录和合同，不是机制。"
tags: ["VPS", "云计算", "Grok Bot", "Cursor", "ERP", "数据合规"]
categories: ["技术"]
publish: true
---

有人问过我一个特别合理的问题：你自己不就跑在一台十几 G 内存加 CPU 的机器上吗？我把 Bot 一直开着，不就等于有服务器了？

不行。但理由既不是「不允许」，也不是「不够快」。RAM 从来不是那个瓶颈。

这个问题有一个放大一万倍的版本：一家公司要把 ERP 放在哪儿。两道题差着好几个数量级，缺的却是同一件东西。

先说清楚这篇写什么。写的是**那台机器**这个对象，不是「独立开发者」那个人群。「小」在这里是量程，不是身份。四美元的机器值得写，恰恰因为在这个价位上，法务、采购、合同全都不在场，机制是裸着的，你能一眼看见自己到底在买什么。往上加几个零，买的还是那件东西，只是外面裹了六十页合同。

<a id="sec-1"></a>
## 一、云已经裂成三层

| | 你买到的 | 谁在卖 | 合上笔记本之后 |
|---|---|---|---|
| **L1 守护进程** | 一个不属于任何一次会话的地址，加一块盘 | VPS、轻量云、企业 IaaS | 还活着，**该找到它的人还找得到它** |
| **L2 会话算力** | 一次任务用的隔离机器 | Cursor Cloud Agent、Codex cloud、Copilot cloud agent | 任务做完或超时，销毁 |
| **L3 个人工作台** | 给你自己用的持久机器 | Grok Bot Computer | 还活着，但只有你自己进得去 |

分界不在 RAM，在最后一列。拿 L2/L3 的十几 G 去和 L1 的 2G 比「谁更像服务器」，是量错了单位。

<a id="sec-2"></a>
## 二、后两层已经被做成订阅了，官方还把边界写得很清楚

Cursor Cloud Agent 跑在隔离的 Ubuntu VM 上，不要求你本机联网。它的 Builds 快照的是磁盘——官方原话是 running processes、shell exports、in-memory caches 在快照时全部停止。[1](#ref-1) 你上一趟 agent 里起的服务，不会跟着进下一趟。

Codex cloud 每次 chat 建一个容器，容器状态最多缓存 12 小时；setup 阶段能联网装依赖，**agent 阶段默认断网**，secrets 在 agent 阶段开始前就被撤走。[2](#ref-2)

Copilot cloud agent 最干脆：GitHub Actions 上的一次性环境，每段 session 最长 59 分钟，官方写明这是硬限制，不能延长也绕不过去。[3](#ref-3)

Grok Bot 是第三层，也是最容易被误读的一层。它确实是 persistent cloud computer：关掉应用、合上笔记本，云端的活不停。[4](#ref-4) 这一点我上一版低估了。但同一批文档还写了三件事，连起来读才看得清它到底是什么货：

- 一个账号一台电脑，你所有 Bot 共用浏览器 cookie、文件和命令行凭据；每个 Bot 有自己的屏幕，而官方明说，屏幕是工作面，**不是安全边界**。[4](#ref-4)
- 企业文档给的是**静态出口 IP**，用途是让你在自己的服务上给它放行。[5](#ref-5) 那是出方向的身份，不是入方向的身份。
- 同一页 FAQ 顺手承认：电脑被重建、或者它的网络地址变了，里面的登录会掉。[5](#ref-5)

所以它不是「公网入口还没做」，是产品定义本来就长在出方向。它卖的是「agent 自己得有台电脑」，不是「你的服务得有个门牌号」。

这件事上说得最直白的反而是 OpenAI。它的文档里那句话是：需要持续可达的时候，Add an always-on computer or SSH host。[6](#ref-6) 平台自己清楚，那一层在它外面。

<a id="sec-3"></a>
## 三、第一层卖的不是「公网」，是一个不属于任何一次会话的地址

我上一版把 L1 定义成「进程还活、全世界打得进来、盘还在」。中间那半句是错的——或者说，只对我这种人成立。

一家工厂的 ERP，最不需要的就是「全世界打得进来」。对它来说公网 IP 是负债不是资产：财务在内网点开就能用，供应商从一条专线接进来，别人打不进来，这才叫合格。

所以第一层真正的商品是：**一个不属于任何一次会话的地址，外加一条「谁被允许找到它」的策略。** 可达性是策略，不是属性。同一件商品，在个人手里长成一条 A 记录，在企业手里长成一段私网网段加一条专线。

把这半句改对，同一个模型才跑得动从四美元到 ERP 的全程。

这也顺手解释了隧道。Cloudflare Quick Tunnel 卖的是一个临时入口身份，官方写得很清楚：仅供测试和开发，不保证 SLA 与可用性，并发硬顶 200 个在途请求，不支持 SSE。[7](#ref-7) 你把 localhost 挂上去，源站还在你的会话里，客户端一关就没了。那不是部署，是演示。

有意思的是，企业那头在做同一个动作的镜像：也是用出站连接换可达性，也是为了不暴露源站，只不过换成了专线和零信任网络。技术形状一模一样。差别只有一样——出事的时候，有没有一份能追责的合同。

<a id="sec-4"></a>
## 四、为什么订阅永远不会顺手送你这一层

一个我没在任何官方页面见过、但机制上说得通的解释（这是我的推断，不是厂商说法）：**后两层能塞进订阅，是因为它们可以超卖。**

会话算力有波峰波谷，一百个人不会同时跑满，闲下来的时间可以卖第二遍。守护进程不行，它 24 小时占着那个坑，谁也别想卖第二遍。会话算力是酒店，常开机是租房。酒店可以超订，租房不能。

这不是道德问题，是定价模型问题。所以别指望哪家订阅哪天顺手把常驻源站送给你。

这个推断有一个免费层的旁证，而且相当刺眼。Oracle 的 Always Free 大概是 2026 年还能白拿的最肥的常开机，官方当前规格是 Ampere A1 折合 2 OCPU / 12 GB。[8](#ref-8) 同一份文档里写着回收判据：如果连续 7 天，CPU 的 95 分位利用率、网络利用率、内存利用率**三项都低于 20%**，实例可能被 Oracle 收回。[8](#ref-8)

把这三条连起来读一遍——那正好是一台「常开但很闲」的守护进程的自画像。**免费的常开层最不欢迎的，恰恰是它名字里的那个 always。** 占着坑不用是要付租金的，只不过这里收租的方式，是把机器搬走。

所以它可以当第二台实验机，不能当唯一那台。

<a id="sec-5"></a>
## 五、把同一道题放大一万倍：ERP 该放哪儿

工程师选云是从下往上：先看机器，再看网络，最后问价。企业选云是从上往下，而且前面几道门是布尔的——不是打分项，是过不过。

**第一道门：法域。**

这道门有个工程师常搞错的事实。AWS 中国（北京）区由光环新网运营，（宁夏）区由西云数据运营，官方页面白纸黑字：China Regions' operations are separate from Amazon Web Services Global Regions，你必须单开一个和全球账号 distinct and separate 的中国账号。[9](#ref-9) Azure 中国由世纪互联运营，微软官方措辞是 a physically separated instance of cloud services located in China，而且企业合同 OSPA 是和世纪互联签的，不是和微软签的。[10](#ref-10)

所以「AWS 还是阿里云」在中国不是一道题，是两道。你以为在比技术栈，实际上在比两个法人、两份合同、两套控制台。

顺带把备案说清楚，AWS 中国自己的页面转述得最准：非经营性互联网信息服务实行备案制，经营性实行许可制，两样都没有就不得提供互联网信息服务。[9](#ref-9) 这不是「多填一张表」，这是境内节点和境外节点之间那道真实的分界线——也正是为什么个人的境外小机能整套免掉。

标题里那四美元就是这么来的：腾讯云新加坡的 Starter 2C2G，官方价 $4.20 一个月。代价写在同一份官方文档里——境外套餐给的公网带宽是「峰值」，不是承诺指标，从大陆访问可能出现明显延迟和丢包；而境内区域那一栏写的是 stable BGP。[11](#ref-11) 你省下的备案，就是在这里付掉的。

**第二道门：数据出不出境。**

这不是一个「能不能」的开关，是一道分档的梯子。2024 年那份《促进和规范数据跨境流动规定》把档位写得很直白，档位只取决于**人数**和**你是不是关键信息基础设施运营者**，跟你的技术方案毫无关系：[12](#ref-12)

- 关基以外的处理者，当年累计向境外提供不满 10 万人个人信息（不含敏感）——评估、标准合同、认证，**三样全免**。
- 10 万到不满 100 万人（不含敏感），或不满 1 万人敏感个人信息——要订个人信息出境标准合同，或者过个人信息保护认证。
- 100 万人以上（不含敏感）、1 万人以上敏感、或者涉及重要数据——申报数据出境安全评估。
- 而**关键信息基础设施运营者**只要向境外提供个人信息或者重要数据，不看量，直接顶格评估。

看最后一条：它没有阈值。这就是「布尔的门」的意思——身份一变，整条梯子作废，你直接站在顶上。

也别把它想成一堵墙。同一份规定第三条写着：国际贸易、跨境运输、学术合作、跨国生产制造和市场营销这类活动里收集和产生的数据，**只要不含个人信息和重要数据**，三样也全免。所以「ERP 一律不能出境」同样是错的——决定档位的是数据里装着什么，不是系统叫什么名字。

而这两端离得比想象中近：你那台小机落在第一档「三样全免」，ERP 落在最后一档。同一部规定，两级台阶——没有对个人网开一面，只是分了档。档一跳，架构就得改：能不能有一个全球统一的库，是在这儿定的，不是在架构评审会上。

**第三道门：最先关上的那道，往往不是云厂商的，是软件商的。**

SAP 维护一份 Certified and Supported SAP HANA Hardware Directory，Certified IaaS Platforms 是里面单列的一类。最能说明力度的不是 SAP 自己怎么说，是**微软自己的文档怎么说**：要在 Azure 上跑生产环境的 HANA，去查「SAP published Certified IaaS Platforms list」，SAP 列了哪些机型你才能用哪些。[13](#ref-13)

也就是说，候选集是 ERP 厂商先划好的，云厂商只能进来投标，而且云厂商自己承认这件事。原因很朴素——系统半夜挂了，你要打电话找的是 SAP，不是云。工程师的直觉是先比云、再装软件；真实顺序是反的。

**第四道门：合同。这里要拆掉一个流传很广的误会——SLA 不是保险。**

翻一下 AWS 的 Amazon Compute SLA：单实例的月度可用性承诺是 **99.5%**；没做到，赔的是 Service Credit。合同还写了两句关键的：Service Credits will not entitle you to any refund or other payment from AWS，以及 this SLA sets forth your sole and exclusive remedies。[14](#ref-14)

翻译一下：单台机一个月躺三个多小时，还在承诺之内；真躺穿了，退给你的是**你自己付过的钱的一个百分比**，而且这是唯一救济。停产损失算不算？微软的在线服务 SLA 把话说得更死：service credit 不用于补偿任何其他形式的损失，明确点名 lost revenue、operational costs 和间接损失。[14](#ref-14)

**SLA 是折扣券，不是保险单。** 那企业花的那笔钱到底买了什么？买的是一个有名字、会派人来、并且怕丢掉你这个客户的对手方，外加发票、账期、审计权和退出条款。合同的分量在这些地方，不在 SLA 那一页。

四道门过完，才轮到性能和价格。而价格是谈出来的。

<a id="sec-6"></a>
## 六、什么能往上搬，什么不能

那公开价目表对超大客户还有意义吗？有，但意义只是**锚**，不是价格。看两个官方机制就够了。

AWS Marketplace 的 private offer，官方定义是 negotiated terms used to purchase a product，紧接着一句：**These terms aren't publicly available。**[15](#ref-15) 成交价你从外面根本看不到。微软那边的 MACC 是 a contractual agreement where your organization commits to spending a specific amount on Azure over a defined period，符合条件的 Marketplace 采购会自动冲抵这笔承诺额，合作伙伴的产品按税前金额 100% 计入。[16](#ref-16) 换句话说，云账单已经不只是机器钱，它同时是一条软件采购通道。

同一页上还有一句注意事项，最能说明问题：**在 Marketplace 上直接刷信用卡买，不计入承诺额；必须在 Azure portal 里用挂在公司协议下的订阅买，才算。**[16](#ref-16) 同一个货架，两个结账通道，只有一条通向那份合同。个人永远走的是另一条。

再加上 Enterprise Support 里那位 designated Technical Account Manager。[17](#ref-17) 到这一层，「云」这个词指的已经不是机器了，是一份采购关系。

这里要拦一个顺手的推论：**别默认四家都长一样。** 上面这套「合同级总承诺额 + 云市场采购按额度抵扣」，我只在 AWS 和微软的官方文档里查到对应构造；阿里云、腾讯云我没找到同类东西——它们有节省计划、资源包这类**产品级预付**，那不是一回事。这是「我没查到」，不是「它们没有」；但在查到之前，别把美国那套采购叙事直接套到国内。

所以要把两件事分开。

**能往上搬的是机制。**

- 三层切分本身。企业照样是三层：ERP 和数据库是 L1，CI runner 和批处理是 L2，云桌面是 L3。价签差几个数量级，形状一模一样。
- 「别把守护进程放进会话机」。这条企业每天都在犯——那个跑在某台构建机上、谁也不敢删的 cron，就是把 L1 的活塞进了 L2 的机器。
- 第三节那个定义：一个不属于任何一次会话的地址，加一条谁能找到它的策略。四美元和一份主服务协议，买的是同一件商品的两个尺码。

**不能往上搬的是购物清单。**

- SKU 和标价。
- 采购路径：信用卡自助结账，和招投标、入围目录、账期、增值税发票，是两个世界。
- 合规：没人会要求你给自己的 blog 做网络安全等级保护定级。
- 故障成本：你这边是「烦」，那边是「今天开不出票」。
- 支持形态：一张工单，和一个有名字的人。

一句话：**机制向上兼容，购物清单不向上兼容。** 任何一篇声称能替你决定 SAP 该上 AWS 还是阿里云的文章，都在卖它兑现不了的东西——那个决定先被法域砍一刀，再被认证目录砍一刀，最后在一份你从外面看不见的合同里定下来。这篇不干那个。

<a id="sec-7"></a>
## 七、所以是不是「管好自家这一亩三分地」就完了

是。但理由得换一个。

不是「我只配管这么大」。是这台四美元的机器，是这道题的**最小可复现样本**：一个下午就能推翻重来，ERP 迁移不能。你在这台机器上验过的判断，是唯一你真拿证据换来的那部分，剩下的都是转述。

而分层真正的尺子，从头到尾都不是 RAM，也不是月费，是这一句：**它挂了，谁被叫醒，谁能被追责。**

- 没人打电话 → 四美元的共享 CPU 小机就够了，别升级，把钱省下来。想换 Vultr、DO 或者随便谁都行，换的是控制台和计费粒度；第三节那件商品换不掉。
- 用户会打电话 → 你需要一个像样的区域和一份 SLA，同时清楚那份 SLA 只是折扣券。
- 财务关不了账 → 你需要的是法域、认证目录和合同，价格是最后一个变量。

三档之间不是「预算够不够」的关系，是三种不同的商品。把第三档的严肃搬到第一档，你会给一台跑 agent 的小机做等保定级；把第一档的随意搬到第三档，你会把公司的进销存挂在一条 quick tunnel 上。

后面这件事我自己干过。把 Next 挂到 `*.trycloudflare.com`，链接一发，演示很成功；然后从杭州点一下登录，等了十秒左右，因为流量绕了一趟美国。演示成立，部署一次都没发生。

**压缩：** 2026 年的「云」裂成三层。AI 平台把会话算力和个人工作台做成了订阅，剩下那层——一个不属于任何一次会话的地址——还得单独买。四美元买它，或者一份主服务协议买它，商品是同一件。

三条：

1. 用 Cursor / Codex / Copilot 买任务，用 Grok Bot 买工作台，用 VPS 或 IaaS 买那个地址。三张账单，别指望一张顶三张。
2. 免费常开层先读回收条款。Oracle 的判据正好是一台闲着的守护进程的画像——当第二台实验机可以，当唯一那台不行。
3. 往上一层，先问法域和认证目录，再问价；往下一层，先问「挂了谁被叫醒」，再问配置。

**只能记一句：** 十几 G 的会话机，救不了一个没有长期地址的守护进程；一份 SLA，也救不了一个没有法域的系统。

## 参考文献

<a id="ref-1"></a>
1. Cursor. *Cloud Agents*; *Cloud Agent Builds*. 2026-08-20 抓取. [cursor.com/docs/cloud-agent](https://cursor.com/docs/cloud-agent) · [builds](https://cursor.com/docs/cloud-agent/builds.md)
   隔离 VM，「do not require your local machine to be connected to the internet」；Builds 页原话「Builds preserve disk state only. Running processes, shell exports, and in-memory caches stop when Cursor snapshots the machine.」
   ↩ Cited in: [二](#sec-2)

<a id="ref-2"></a>
2. OpenAI. *Codex cloud environments*. 2026-08-20 抓取. [developers.openai.com/codex/cloud/environments](https://developers.openai.com/codex/cloud/environments)
   每次 chat 建容器；「Codex caches container state for up to 12 hours」；「Agent internet access is off by default」；secrets「are removed before the agent phase starts」。
   ↩ Cited in: [二](#sec-2)

<a id="ref-3"></a>
3. GitHub. *About GitHub Copilot cloud agent*. 2026-08-20 抓取. [docs.github.com/copilot/concepts/agents/cloud-agent/about-cloud-agent](https://docs.github.com/copilot/concepts/agents/cloud-agent/about-cloud-agent)
   「its own ephemeral development environment, powered by GitHub Actions」；「Each Copilot cloud agent session has a maximum execution time of 59 minutes. This is a hard limit that cannot be extended or bypassed.」
   ↩ Cited in: [二](#sec-2)

<a id="ref-4"></a>
4. xAI. *Grok Bot: Use the computer and apps*. 2026-08-20 抓取. [docs.x.ai/grok-bot/computer-and-apps](https://docs.x.ai/grok-bot/computer-and-apps)
   「Grok Bot works from a persistent cloud computer」；「Closing the Grok Bot app or your laptop does not stop cloud work」；「Every Bot on your account uses the same computer」（共享 cookie / 文件 / 命令行凭据）；「The screens are separate work surfaces, not separate security boundaries.」
   ↩ Cited in: [二](#sec-2)

<a id="ref-5"></a>
5. xAI. *Grok Bot for teams and enterprises*. 2026-08-20 抓取. [docs.x.ai/grok-bot/teams-and-enterprises](https://docs.x.ai/grok-bot/teams-and-enterprises)
   「Computers reach the internet through static egress IP addresses.」——出方向身份。FAQ：「Sign-in sessions inside the computer can drop when the computer is recreated or its network address changes.」Kill 删除运行中的 VM，durable storage 保留。
   ↩ Cited in: [二](#sec-2)

<a id="ref-6"></a>
6. OpenAI. *Codex / ChatGPT remote connections*. 2026-08-20 抓取. [developers.openai.com/codex/remote-connections](https://developers.openai.com/codex/remote-connections)
   「Add an always-on computer or SSH host when you need continuous access or a different environment.」
   ↩ Cited in: [二](#sec-2)

<a id="ref-7"></a>
7. Cloudflare. *Quick Tunnels (TryCloudflare)*. 页面标注 Last updated 2026-04-20，2026-08-20 抓取. [developers.cloudflare.com/cloudflare-one/…/trycloudflare](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/)
   「Quick Tunnels are intended for testing and development only.」「We don't guarantee any SLA or uptime of TryCloudflare」；并发硬顶 200 in-flight requests，超限 429；「Quick Tunnels do not support Server-Sent Events (SSE).」
   ↩ Cited in: [三](#sec-3)

<a id="ref-8"></a>
8. Oracle. *Always Free Resources*. 2026-08-20 抓取. [docs.oracle.com/…/freetier_topic-Always_Free_Resources.htm](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)
   Ampere A1：「the first 1,500 OCPU hours and 9,000 GB hours per month」，「For Always Free tenancies, this is equivalent to 2 OCPUs and 12 GB of memory.」回收判据原话：「Idle Always Free compute instances may be reclaimed by Oracle」——7 天内 CPU 95 分位 < 20%、网络 < 20%、内存 < 20%（内存仅适用 A1）。另有「out of host capacity」提示。
   ↩ Cited in: [四](#sec-4)

<a id="ref-9"></a>
9. Amazon Web Services. *Amazon Web Services China*. 2026-08-20 抓取. [amazonaws.cn/en/about-aws/china](https://www.amazonaws.cn/en/about-aws/china/)
   北京区由 Sinnet（北京光环新网）运营，宁夏区由 NWCD（宁夏西云数据）运营；「a set of credentials that are distinct and separate from other Amazon Web Services global Accounts」；「China Regions' operations are separate from Amazon Web Services Global Regions.」备案：「the State subjects non-commercial internet information services to a record-filing system and commercial internet information services to a permit system.」
   ↩ Cited in: [五](#sec-5)

<a id="ref-10"></a>
10. Microsoft. *Microsoft Azure in China*. 2026-08-20 抓取. [learn.microsoft.com/azure/china/overview-operations](https://learn.microsoft.com/en-us/azure/china/overview-operations)
    「Microsoft Azure operated by 21Vianet (Azure in China) is a physically separated instance of cloud services located in China. It's independently operated and transacted by Shanghai Blue Cloud Technology Co., Ltd.」企业合同：OSPA Direct「You sign OSPA with 21Vianet」。
    ↩ Cited in: [五](#sec-5)

<a id="ref-11"></a>
11. Tencent Cloud. *Lighthouse: Region and Network Connectivity*; *Pricing Details*. 页面标注 2025-03-24 / 2025-06-23，2026-08-20 抓取. [region](https://intl.cloud.tencent.com/document/product/1103/41266) · [pricing](https://intl.cloud.tencent.com/document/product/1103/47794)
    官方原话：境外区域「The public network bandwidth provided represents the peak bandwidth, which is not considered a guaranteed service metric. Users may experience significant latency and packet loss when accessing Lighthouse from the Chinese mainland」；境内区域则写「Stable BGP network access is provided」。价表：新加坡 / 东京等 Starter Linux 2C2G / 40GB / 20Mbps / 512GB 流量 = **$4.20 每月**（本文标题里那四美元）。
    ↩ Cited in: [五](#sec-5)

<a id="ref-12"></a>
12. 国家互联网信息办公室. *促进和规范数据跨境流动规定*（国家互联网信息办公室令第 16 号，2024-03-22 公布施行）. 2026-08-20 抓取. [cac.gov.cn/2024-03/22/c_1712776611775634.htm](https://www.cac.gov.cn/2024-03/22/c_1712776611775634.htm)
    第五条（四）：关基以外的数据处理者当年累计向境外提供不满 10 万人个人信息（不含敏感）「免予申报数据出境安全评估、订立个人信息出境标准合同、通过个人信息保护认证」。第八条：10 万人以上不满 100 万人（不含敏感）或不满 1 万人敏感，订标准合同或过认证。第七条：关基向境外提供个人信息或重要数据（无阈值），以及关基以外提供重要数据 / 累计 100 万人以上（不含敏感）/ 1 万人以上敏感，申报安全评估。第三条：国际贸易、跨境运输、学术合作、跨国生产制造和市场营销等活动中收集和产生、不含个人信息或重要数据的，三项全免。第九条：评估结果有效期 3 年。
    ↩ Cited in: [五](#sec-5)

<a id="ref-13"></a>
13. SAP. *Certified and Supported SAP HANA Hardware Directory*. 2026-08-20 抓取. [sap.com/dmc/exp/2014-09-02-hana-hardware/enEN](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/)
    SAP 官方维护的受支持硬件目录，Certified IaaS Platforms 与 Appliances、Enterprise Storage、HCI 等并列为其中一类（目录本体是前端渲染的 hash 路由页）。云厂商侧的印证更直接——微软 *SAP HANA infrastructure configurations and operations on Azure*：「For the usage of Azure VMs for production scenarios, check for SAP HANA certified VMs in the SAP published Certified IaaS Platforms list.」[learn.microsoft.com/azure/sap/workloads/hana-vm-operations](https://learn.microsoft.com/en-us/azure/sap/workloads/hana-vm-operations)
    ↩ Cited in: [五](#sec-5)

<a id="ref-14"></a>
14. Amazon Web Services. *Amazon Compute Service Level Agreement*. 页面标注 Last Updated 2022-05-25，2026-08-20 抓取. [aws.amazon.com/compute/sla](https://aws.amazon.com/compute/sla/)
    Instance-Level SLA：单实例月度可用性 99.5%，未达标按档赔 10% / 30% / 100% Service Credit。「Service Credits will not entitle you to any refund or other payment from AWS.」「this SLA sets forth your sole and exclusive remedies, and AWS' sole and exclusive obligations, for any unavailability…」
    微软说得更死——*Service Level Agreement for Microsoft Online Services*：「Service Credits are your sole and exclusive remedy」「Service Credits will not be awarded to compensate for any other forms of loss, including but not limited to lost revenue, operational costs, or any indirect losses.」[microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services)
    ↩ Cited in: [五](#sec-5)

<a id="ref-15"></a>
15. Amazon Web Services. *Private offers in AWS Marketplace*（Buyer Guide）. 2026-08-20 抓取. [docs.aws.amazon.com/marketplace/latest/buyerguide/buyer-private-offers.html](https://docs.aws.amazon.com/marketplace/latest/buyerguide/buyer-private-offers.html)
    「The AWS Marketplace seller private offer feature enables you to receive product pricing and EULA terms from a seller. **These terms aren't publicly available.** You negotiate pricing and terms with the seller…」卖家侧文档同样写明 private offer 是「negotiated terms used to purchase a product from AWS Marketplace」。
    ↩ Cited in: [六](#sec-6)

<a id="ref-16"></a>
16. Microsoft. *Azure Consumption Commitment Benefit*. 2026-08-20 抓取. [learn.microsoft.com/marketplace/azure-consumption-commitment-benefit](https://learn.microsoft.com/en-us/marketplace/azure-consumption-commitment-benefit)
    「The Microsoft Azure Consumption Commitment (MACC) is a contractual agreement where your organization commits to spending a specific amount on Azure over a defined period. Eligible Microsoft Marketplace purchases automatically count toward fulfilling this commitment.」「when you purchase Azure benefit-eligible offers from Microsoft partners through Marketplace, 100% of the pretax purchase amount also contributes toward your commitment.」结账通道那一句：「purchases made directly on Microsoft Marketplace via credit card do not contribute to your MACC.」
    ↩ Cited in: [六](#sec-6)

<a id="ref-17"></a>
17. Amazon Web Services. *AWS Enterprise Support*. 2026-08-20 抓取. [aws.amazon.com/premiumsupport/plans/enterprise](https://aws.amazon.com/premiumsupport/plans/enterprise/)
    「Your designated Technical Account Manager provides strategic guidance and deep AWS knowledge.」
    ↩ Cited in: [六](#sec-6)
