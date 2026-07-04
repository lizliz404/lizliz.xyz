---
title: "ZK 小白书：如何证明你知道一件事，却不把它说出来"
date: "2026-06-13"
description: "从一则寓言开始，理解零知识证明的最少必要知识：它是什么、为什么重要、怎么工作、行业正在怎么用，以及它不能解决什么。"
tags: ["zero-knowledge", "ZK", "cryptography", "Web3", "verifiable computation"]
categories: ["商业"]
publish: true
---

# ZK 小白书：如何证明你知道一件事，却不把它说出来

我们通常以为，"证明"意味着展示证据。

证明你知道密码，就输入密码。证明你有钱，就公开余额。证明你完成了一次计算，就让别人重算一遍。证明你合规，就交出身份材料、流水、底稿、日志。

但有些时候，证据本身就是不能交出去的东西。

密码不能交出去。私钥不能交出去。完整身份资料不该到处上传。商业数据不该裸奔。用户的交易、年龄、居住地、资格证明，也不该为了每一次验证都被永久复制一份。

于是问题变成了：

> 有没有一种办法，让我向你证明"我知道""我满足条件""我算对了"，但不把秘密本身交给你？

先别急着记定义。我们先看一个故事。

## 一、寓言：《盲帝与织女》

在古老的夜阑国，流传着一种名为"天星蓝"的绝世染料。传说只有用"天星蓝"染出的丝绸，才能在祭祀时得到神明的回应。然而，夜阑国的国君渊帝，身上带着家族的遗传诅咒——他患有奇特的眼疾，在他的眼里，珍贵的"天星蓝"与最廉价的"凡尘蓝"毫无区别，两者看起来都是灰暗的颜色。

皇家宝库里一直珍藏着两匹布，一匹是历代相传的真正"天星蓝"，另一匹是普通的"凡尘蓝"。它们有着严格的标记。

一天，一位名叫云娘的织女来到宫殿，声称自己在一本失传的古籍中找回了"天星蓝"的配方。

渊帝坐在高高的王座上，冷冷地看着她："历代声称能染出天星蓝的骗子不计其数。把你的配方交出来，让宫廷画师和染匠去验证。如果是真的，朕赐你黄金万两；如果是假的，朕要你的命。"

云娘不卑不亢地摇了摇头："陛下，这配方是我的身家性命。如果我现在交出配方，您手下的染匠学会了，您大可随便找个理由将我处死。我绝不会透露配方中的哪怕一味草药。"

渊帝大怒："荒谬！你不交出配方，朕怎么知道你真的能分辨并染出'天星蓝'？朕凭什么相信你？"

大殿内的气氛降到了冰点，卫兵们的刀已经拔出了一半。

这时，云娘微微一笑："陛下，我不交出配方，也依然能向您证明我拥有这门技艺。我们来做一个游戏。"

渊帝皱起眉头："什么游戏？"

"请陛下让人把宝库里那两匹有标记的布拿来，去掉标记，只保留您自己能识别的暗记。"云娘说道，"然后，请陛下将这两匹布拿到屏风后面。您在屏风后，可以自由决定是'左右手互换这两匹布'，还是'保持原样不换'。接着，您拿着布从屏风后走出来，我来告诉您，您刚才在屏风后面，到底有没有互换它们。"

渊帝觉得有些可笑。在他眼里，这两匹布一模一样。如果云娘是个骗子，她看这两匹布也该是一模一样的。

"如果你瞎猜，你有一半的机会猜中。"渊帝冷笑。

"是的，"云娘平静地回答，"但如果我每次都能猜中呢？"

渊帝被激起了好奇心。他拿起两匹布走到屏风后，偷偷把左右手的布换了位置，然后走出来。

"你换了。"云娘看了一眼，立刻说道。因为在她眼里，一匹闪烁着如星空般的蓝光，另一匹只是暗淡的粗布，这简直一目了然。

渊帝心里微微一惊，但他面不改色："运气罢了。再来。"

他又走到屏风后，这一次他故意没有互换，原样拿了出来。

"您没有换。"云娘再次轻松答道。

第三次，换了。云娘答对。
第十次，没换。云娘答对。
第二十次，换了。云娘依然答对。

当第四十次云娘毫无迟疑地给出正确答案时，渊帝的双手微微颤抖了。他是个聪明人，心里很清楚：如果云娘看不出两匹布的区别，她连续四十次全凭运气猜中的概率，比夜阑国立刻天降陨石的概率还要小得多。

渊帝放下丝绸，深深地叹了一口气。他挥退了卫兵，命人搬来赐座。

他完全确信了云娘掌握着"天星蓝"的秘密。

然而，在这个过程中，云娘没有透露任何关于染料配方的信息，渊帝也依然不知道"天星蓝"到底长什么样。渊帝在**没有获得任何新知识**的情况下，获得了**百分之百的信任**。

## 二、故事里发生了什么

这个故事讲的，就是零知识证明（Zero-Knowledge Proof，ZKP）。

最短的定义：

> 零知识证明是一种密码学协议：证明者可以让验证者相信某个陈述为真，同时不泄露除了"这个陈述为真"之外的任何额外信息。[^2]

关键不在"零"，而在"额外"。

渊帝最后知道了什么？他知道云娘没骗他——她确实能分辨天星蓝。但他不知道配方，不知道染料从哪里来，甚至不知道天星蓝在她眼里到底是什么颜色。

所以：**零知识不是零信息，是零额外信息。**

一个合格的零知识证明，必须同时满足三个条件。故事里其实已经全出现了。

**完备性（Completeness）：真话能被证明。** 如果云娘真的能分辨天星蓝，她就能答对每一轮。真话不应该被系统冤枉。密码学语言：如果陈述为真，证明者拥有真实证据，双方按协议执行，验证者应当接受证明。[^3]

**健全性（Soundness）：假话骗不过去。** 如果云娘是骗子，看不出两匹布的区别，她每一轮只能猜。一轮猜中概率是 1/2。十轮连续猜中是 1/1024。四十轮是 1/2^40 ——约一万亿分之一。这里的"信任"不是人情信任，是把欺骗概率压到现实上不可行。[^4]

**零知识性（Zero-Knowledge）：证明不泄密。** 渊帝最终相信了云娘，但没有学到配方。验证结束后，验证者除了"命题为真"，不获得关于秘密的额外信息。密码学里用 simulator 来严格定义这一点：如果一个不知道秘密的人，也能生成一份和真实交互过程无法区分的记录，那么这段交互本身就没有携带秘密。[^5]

## 三、公开的命题，隐藏的证据

故事里，"云娘能分辨天星蓝"是公开的命题；配方是什么，是隐藏的证据。

在现代 ZK 里，这两个东西有明确的名字：

- **Statement**：公开要证明的命题。
- **Witness**：让命题成立的私密证据，不公开。

所有 ZK 证明，本质上在说同一句话：**我知道一个 witness，它能让这个公开 statement 成立。但我不把 witness 给你。**

举几个例子：

- Statement：我知道某个哈希值的原像。Witness：那个原像。
- Statement：我知道某个账户的私钥。Witness：私钥本身。
- Statement：我的余额足够支付。Witness：完整余额和账户路径。
- Statement：我属于某个合格用户集合。Witness：我的身份凭证。
- Statement：这段程序已按规则运行，结果是 X。Witness：完整计算过程和输入。[^6]

一个特别容易误会的点：ZK 不是"证明一件神秘的事但不告诉你那件事是什么"。多数时候，**statement 是公开的，真正隐藏的是 witness。**

不是：我证明一个秘密的事是真的，但不告诉你什么事。

而是：我证明一个公开条件成立，但不透露让它成立的私密数据。

## 四、为什么 Web3 这么需要 ZK

区块链有一个根本性的矛盾：链是公开的，验证依赖公开数据；但人和机构不想把全部数据公开。

ZK 恰好能拆开这两件事：验证成立，数据不公开。

在 Web3 里，ZK 主要走两条线。

**第一条：隐私。** 我满足条件，但你不必看见全部数据。隐私支付系统（如 Zcash）用 ZK 证明"没有双花、资产守恒、花费有效"，同时隐藏部分交易细节。[^7] 身份场景里，用 ZK 证明"我满 18 岁"而不暴露生日，证明"我已 KYC"而不交出证件照片。

**第二条：扩容和可验证计算。** 我算完了，你不用重算。这是今天很多带"zk"前缀的项目的真实主线。以 zk-rollup 为例：L2 在链下执行大量交易，生成一个 validity proof，L1 只验证这个 proof，不必重跑所有交易。[^8] 这时候 ZK 的价值不是藏秘密，而是**把很重的计算压缩成很轻的验证。**

这两条线经常被混淆。看见"zk-rollup"就以为所有交易都隐私了——这是错的。很多 zk-rollup 用的是 validity proof，目标是扩容，不一定隐藏交易内容。**"带 zk 前缀"不等于"有隐私"。**

## 五、行业现在怎么用 ZK

**zk-rollup：扩容为主，隐私是副产品。** 当前最主流的 ZK 工业应用。核心流程：L2 链下执行 → prover 生成 validity proof → L1 verifier 合约验证 proof → L1 接受结果。但证明系统只解决一部分问题。一个 rollup 的真实安全性还取决于：数据可用性、bridge 合约、sequencer 和 prover 的去中心化程度、升级权限、安全委员会、用户能否退出。[^9]

**隐私支付：ZK 是工具，不是隐身衣。** Zcash 的 shielded transaction 是隐私支付的重要生产实践。NU5 / Orchard 用 Halo 2 降低了传统 trusted setup 的风险。[^7] 但隐私不只看 proof system。用户从透明地址转入再转出、钱包默认行为、地址复用、交易时机、匿名集大小、网络层元数据，都能让隐私漏光。ZK 是最小披露的关键工具，不是隐身斗篷。

**身份凭证：证明资格，不交出人生档案。** Semaphore、World ID 等系统让用户证明自己属于某个集合，同时用 nullifier 防止同一身份在同一场景重复使用。[^10] 投票系统只需要知道你有投票资格。网站只需要知道你是真人。但一条重要的设计原则：nullifier 范围要清楚。如果把 nullifier 设计成跨场景永久 ID，ZK 身份反而会变成更高级的追踪器。

**zkVM：降低电路编写门槛，不消灭安全问题。** 手写电路容易出错。zkVM 试图让开发者用更接近普通程序的方式写可证明计算。但 zkVM 不是魔法：输入验证、public output 绑定、proof 绑定上下文、replay 防护、guest code 依赖可信度、外部 I/O 和随机性，这些仍然需要开发者自己把关。ZK 能证明程序按规则运行，不能证明规则本身写对了。

## 六、最容易踩的五个坑

**1. "零知识"不是"什么都不知道"。** 验证者至少知道命题为真。记住这句：零知识 = 零额外知识。

**2. ZK 不是加密。** 加密是把数据变成密文，授权者可以解密。ZK 是不给你数据，只给你一个可验证的结论。两者都和隐私有关，机制不同。

**3. ZK 不是区块链独有技术。** 它是密码学概念，不是币圈发明。只是区块链把对公开验证和隐私保护的需求放大了。

**4. ZK 不能证明"现实数据是真的"。** 如果系统证明"此人已 KYC"，ZK 只能证明某个凭证关系成立。它不能单独证明：发证机构诚实、原始身份材料真实、凭证没被转借、监管一定接受这种形式的证明。

**5. ZK 工程安全很难。** 最常见的大坑叫 under-constrained circuit：电路约束没写完整，攻击者能构造假的 witness 但继续通过证明。[^11] 粗暴翻译：**代码里算过，不等于电路里约束过。** ZK 安全不能只看 proof system，还要看电路、witness generator、verifier contract、bridge、升级权限、前端钱包交互。

此外，验证便宜不代表生成证明便宜。对 rollup、zkML、复杂程序证明来说，prover 可能需要 GPU、FPGA、批处理、递归聚合、prover 市场、队列调度。**ZK 把信任成本变成计算成本；但这个计算成本有时非常高。**

## 七、SNARK、STARK……这些名字是什么

刚学 ZK 不需要立刻记住这些缩写。先知道它们是不同的证明系统路线，取舍不同。

极简版：

- **SNARK**：证明短，验证快，链上友好；部分系统需要 trusted setup。
- **STARK**：通常不需要 trusted setup，透明性更强；证明往往更大。
- **PLONK-ish / Halo2**：更像一族电路表达和工程优化路线，支持 custom gates、lookup、递归等。[^12]

不要排座次。没有"STARK 一定比 SNARK 安全"，也没有"SNARK 一定更先进"。实际选择取决于证明大小、验证成本、生成成本、硬件、递归、审计成熟度和信任假设。

严格密码学里，很多现代系统其实是 argument of knowledge，安全性依赖计算假设。小白阶段可以统称"证明"，但要知道存在严格定义差异。[^13]

如果你以后深入，这些选择的权衡自然会展开。现在不必纠缠。

## 八、看 ZK 项目要问的五个问题

不要只问"这个项目是不是 zk？"问五个更具体的问题：

**1. 它到底证明什么？** statement 是什么？是证明交易有效？身份有效？余额足够？程序运行正确？statement 说不清楚的项目，它的 ZK 叙事多半也说不清楚。

**2. 它隐藏什么，公开什么？** public input 有哪些？private witness 有哪些？如果它公开了交易双方和金额，只证明状态转换正确——那是扩容型 ZK，不是隐私型 ZK。

**3. 它信任谁？** ZK 减少了一部分信任，但不会让信任消失。trusted setup、prover 是否中心化、sequencer、issuer 是否可信、verifier contract 是否可升级、安全委员会权限多大、用户有没有退出路径——都要看。

**4. 证明成本谁承担？** 验证快很好。但 proof 谁来生成？多贵？多慢？失败怎么办？排队怎么办？prover 成本高到无法稳定生产的系统，数学再漂亮也不是好产品。

**5. 审计覆盖哪里？** ZK 审计不能只看智能合约。还要看电路、witness generator、prover/verifier 实现细节、参数设置、bridge、升级权限、前端输入绑定。ZK 的安全边界比普通应用更立体。[^9]

## 九、未来：ZK 会改什么，不会改什么

ZK 最好的未来图景，不是一个"没人知道任何事"的世界。那不现实。

更好的图景是：**数字社会从"默认披露全部数据"，变成"只证明必要事实"。**

**私密身份。** 不再每进一家店都复印身份证。证明满 18 岁不暴露生日，证明 KYC 不交出证件。门口只亮绿灯：合格。但发行方可信度、凭证撤销、设备丢失、转借风险、监管是否承认——这些 ZK 单独解决不了。

**合规但不监控。** 监管方验证必要事实，而不是通读所有数据。证明客户通过 KYC、交易低于限额、储备满足要求。[^14] 但法律可能仍要求留存、审计底稿、可追责、可调取。ZK 可以减少监控式合规，不能单方面改写法律制度。

**可验证云计算。** 云可以算，但不能只靠云说了算。复杂计算在云端或链下完成，用户只验证证明。[^15] 但 prover 基础设施可能集中到少数公司，证明生成成本高，外包 proving 可能泄露 witness。系统工程不会因为数学漂亮而消失。

**zkML：证明 AI 做过某件事，不是证明 AI 是好人。** ZK 可以证明某个模型版本确实运行了、推理过程没被替换、输入满足某些规则，同时不暴露模型权重或用户数据。[^16] 但它不能证明 AI 善良、公平、没有偏见、不会胡说。这些仍然需要模型评估、数据治理、法律责任和产品约束。ZK 让一部分 AI 行为更可验证，不替代我们对 AI 系统的判断。

## 十、回到那匹布

现在再看《盲帝与织女》，结构很清楚：

- 云娘是 Prover，证明者。
- 渊帝是 Verifier，验证者。
- "我能分辨天星蓝"是公开 statement。
- "我怎么分辨、配方是什么"是 private witness。
- 渊帝在屏风后换或不换，是随机挑战。
- 云娘回答换没换，是证明响应。
- 重复四十次，是把骗子蒙混过关的概率压到不可行。
- 渊帝最终只知道"云娘确实知道"，不知道配方，不知道颜色本身。

这就是 ZK 的骨架。

它不是玄学，也不是"相信我"。恰恰相反：

> **不要相信我。验证我。**
> **但验证我的时候，不要顺手拿走我不该交出的东西。**

我们正在把越来越多生活搬进数字系统：身份、金融、工作、AI、社交、医疗、教育、供应链。旧的默认方式是，为了让系统相信你，你先把自己交出去。

ZK 代表另一种可能：只交出必要结论。剩下的，留给自己。

## 如果继续学

非数学背景的读者，可以按这条路走，不需要一次学完：

1. **理解交互式证明和挑战-响应模型**——读完这个故事，这一步你已经完成了。
2. **理解基础积木**：承诺（commitment）、哈希、Merkle tree、有限域。
3. **理解"把程序变成约束"**：电路、R1CS、arithmetization。
4. **区分证明系统**：SNARK、STARK、Bulletproofs 的取舍。
5. **看应用**：zk-rollup、隐私支付、身份凭证、可验证计算、zkML。

没必要一开始就跳进椭圆曲线和多项式。先建立直觉，再看形式化。

## Footnotes

[^1]: Prompt：你随便挑一个领域，从中选一个Expert 层级的概念。然后给我写一则寓言， 用间接的方式把这个概念讲透。别急着点题，让答案在故事快收尾时才浮现出来。故事结束之后，再解释这个概念，以及里面的隐喻分别对应什么。

[^2]: ZKProof Community Reference, "Zero-Knowledge Proofs: Reference": https://docs.zkproof.org/reference.pdf ; Ethereum.org, "Zero-knowledge proofs": https://ethereum.org/zero-knowledge-proofs/

[^3]: Stanford Crypto Notes, "Zero-Knowledge Proof Systems": https://crypto.stanford.edu/pbc/notes/crypto/zk.html ; Stanford CS355 Lecture 3: https://crypto.stanford.edu/cs355/18sp/lec3.pdf

[^4]: Chainlink, "Zero-Knowledge Proof Explained": https://chain.link/education/zero-knowledge-proof-zkp ; Ali Baba cave interactive proof lecture: https://www.usna.edu/Users/cs/choi/it432/lec/l18/lec.html

[^5]: Matthew Green, "Zero Knowledge Proofs: An illustrated primer, Part 2": https://blog.cryptographyengineering.com/2017/01/21/zero-knowledge-proofs-an-illustrated-primer-part-2/

[^6]: Ethereum.org 对 witness / statement 的入门解释：https://ethereum.org/zero-knowledge-proofs/

[^7]: Zcash NU5 protocol spec: https://zips.z.cash/protocol/nu5.pdf ; ZIP 224 Orchard: https://zips.z.cash/zip-0224 ; Electric Coin Co., "Explaining Halo 2": https://electriccoin.co/blog/explaining-halo-2/

[^8]: Ethereum.org, "Zero-knowledge rollups": https://ethereum.org/en/developers/docs/scaling/zk-rollups/

[^9]: Quantstamp, "L2 Security Framework": https://github.com/quantstamp/l2-security-framework

[^10]: Semaphore technical reference: https://docs.semaphore.pse.dev/technical-reference/circuits ; World ID on-chain verification docs: https://docs.world.org/world-id/idkit/onchain-verification

[^11]: zkSecurity, "Underconstrained bugs": https://blog.zksecurity.xyz/posts/underconstrain-bugs/ ; "Circom pitfalls and how to avoid them": https://blog.zksecurity.xyz/posts/circom-pitfalls-1/ and https://blog.zksecurity.xyz/posts/circom-pitfalls-2/

[^12]: StarkWare, "Scaling Blockchains with ZK Proofs": https://starkware.co/blog/scaling-blockchains-with-zk-proofs/ ; Electric Coin Co., "Explaining Halo 2": https://electriccoin.co/blog/explaining-halo-2/

[^13]: Ethereum Foundation, "zkSNARKs in a nutshell": https://blog.ethereum.org/2016/12/05/zksnarks-in-a-nutshell ; ZKProof Community Reference: https://docs.zkproof.org/reference.pdf

[^14]: Deutsche Bank / Nethermind, "Zero-Knowledge Proofs in Blockchain Finance: Opportunity vs Reality": https://corporates.db.com/files/documents/publications/Zero-Knowledge-Proofs-in-Blockchain-Finance-Opportunity-vs-Reality.pdf?language_id=1 ; Policy Review, digital identity wallets and ZKPs: https://policyreview.info/articles/analysis/impact-zero-knowledge-proofs

[^15]: "A Two-Part Approach to Understanding ZK Coprocessors": https://www.symbolic.capital/writing/a-two-part-approach-to-understanding-zk-coprocessors ; USENIX Security 2023, privacy-preserving proving outsourcing: https://www.usenix.org/system/files/usenixsecurity23-chiesa.pdf

[^16]: ZKML survey: https://arxiv.org/html/2502.18535v2 ; "zkML: An Overview": https://dl.acm.org/doi/10.1145/3627703.3650088 ; "zkML Tradeoffs": https://np.engineering/posts/zkml-tradeoffs/
