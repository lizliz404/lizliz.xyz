/**
 * Public skill packs shown on the /skills index.
 * Content mirrors what the old per-skill landing pages shipped
 * (tagline + "What's inside" bullets), flattened into accordion items.
 * Each field has a zh twin — the accordion renders by active lang.
 */
export type SkillFeature = { label?: string; text: string };

export type SkillMeta = {
  slug: string;
  name: string;
  tagline: string;
  /** Chinese tagline — shown when the site lang is zh. */
  taglineZh: string;
  features: SkillFeature[];
  /** Chinese feature bullets — shown when the site lang is zh. */
  featuresZh: SkillFeature[];
  iconUrl: string;
  zipUrl: string;
};

/** Public GitHub mirror of the downloadable skill packs. */
export const SKILLS_REPO = "https://github.com/lizliz404/agent-skills";

export const SKILLS: SkillMeta[] = [
  {
    slug: "doubao-tts",
    name: "Doubao TTS",
    tagline:
      "Article voice, dual-speaker podcasts, and ASR — via Volcengine 豆包语音. Built for writing pipelines.",
    taglineZh:
      "把文章变成语音、双主播播客和 ASR 转写——基于火山引擎豆包语音，为写作管线而生。",
    features: [
      { label: "TTS", text: "Markdown → spoken article audio (豆包 V1 production route)" },
      { label: "Podcast", text: "dual-speaker conversation from an article or topic" },
      { label: "ASR", text: "Flash/Standard transcripts, optional diarization" },
      {
        text: "Scripts: tts-generate.py, podcast-generate.py, asr-transcribe.py, plus publish notes for lizliz.xyz",
      },
    ],
    featuresZh: [
      { label: "TTS", text: "Markdown → 文章语音音频（豆包 V1 生产路线）" },
      { label: "Podcast", text: "一篇文章或话题 → 双主播对话播客" },
      { label: "ASR", text: "Flash/Standard 转写，可选说话人分离" },
      {
        text: "脚本：tts-generate.py、podcast-generate.py、asr-transcribe.py，以及 lizliz.xyz 的发布笔记",
      },
    ],
    iconUrl: "/assets/icons/skills/doubao-tts.svg?v=2",
    zipUrl: "/doubao-tts-skill.zip",
  },
  {
    slug: "geo-job-hunt",
    name: "Geo Job Hunt",
    tagline:
      "Jobs inside a map radius — Amap fence + Liepin hiring, without endless platform scrolling.",
    taglineZh:
      "地图半径内找工作——高德围栏 + 猎聘，不用在招聘 App 里瞎刷。",
    features: [
      { label: "Forward hunt", text: "place → radius companies → open roles on Liepin" },
      { label: "Reverse check", text: "search jobs, confirm the company is inside the fence" },
      {
        label: "Watch + apply",
        text: "monitor new roles, track, batch apply with rate-limit guardrails",
      },
      {
        text: "Pack: production skill/ (v5.1.3) plus audit notes — stdlib-only Python scripts",
      },
    ],
    featuresZh: [
      { label: "正向找", text: "选地点 → 半径内公司 → 猎聘在招岗位" },
      { label: "反向查", text: "搜岗位，确认公司真的在围栏内" },
      { label: "监控 + 投递", text: "盯新岗位、跟踪、限速保护下批量投递" },
      {
        text: "包含生产版 skill/（v5.1.3）与审计笔记——纯 stdlib Python 脚本",
      },
    ],
    iconUrl: "/assets/icons/skills/geo-job-hunt.svg?v=2",
    zipUrl: "/geo-job-hunt.zip",
  },
  {
    slug: "landing-page-replication-v5",
    name: "Landing Replication v5",
    tagline:
      "Measurable landing-page fidelity — not vibes. Capture the runtime surface, pin density, prove interactions offline.",
    taglineZh:
      "可衡量的落地页复刻——不是玄学。抓运行时表面、钉死密度、离线验证交互。",
    features: [
      {
        label: "7-phase pipeline",
        text: "Capture → Signal → Skeleton → Density → Micro-parity → Behavior → Polish",
      },
      {
        label: "Machine gates",
        text: "IMR, scroll-length, offline behavior probes, reduced-motion, replica-only-motion blockers",
      },
      {
        label: "Scripts",
        text: "capture.py, capture-runtime.py, audit.py, token extractors, evals",
      },
      {
        text: "Notes on theater runtimes, IP/fonts, CJK sites, and cases (Linear / Attio / haoqi)",
      },
    ],
    featuresZh: [
      {
        label: "7 阶段管线",
        text: "采集 → 信号 → 骨架 → 密度 → 微对齐 → 行为 → 打磨",
      },
      {
        label: "机器闸门",
        text: "IMR、滚动长度、离线行为探测、减少动态、仅复刻页可动的限制",
      },
      {
        label: "脚本",
        text: "capture.py、capture-runtime.py、audit.py、token 提取器、评测",
      },
      {
        text: "关于 theater 运行时、IP/字体、CJK 站点与案例（Linear / Attio / haoqi）的笔记",
      },
    ],
    iconUrl: "/assets/icons/skills/landing-page-replication-v5.svg?v=2",
    zipUrl: "/landing-page-replication-v5.zip",
  },
  {
    slug: "video-script-conversion",
    name: "Video Script Conversion",
    tagline:
      "Article logic ≠ spoken logic. Rebuild, refine, and audit scripts for the spoken voice — five seconds decide if viewers stay.",
    taglineZh:
      "文章逻辑 ≠ 口语逻辑。重建、精修、审计适合「说出来」的脚本——前五秒决定观众留不留。",
    features: [
      {
        label: "4 modes",
        text: "rebuild from long-form, refine approved spoken raw, transcript cleanup (实录修整), patch assembly from settled feedback",
      },
      {
        label: "Hard-principle gate",
        text: "hook trio, the two questions (why me / what's in it), price hedging, compliance rewording — fixed by the author, not negotiable",
      },
      {
        label: "Voice preservation",
        text: "keeps the speaker's operator words and meta-cognitive asides; cuts only empty filler",
      },
      {
        label: "Scripts",
        text: "count_spoken_chars.py with dual metrics (spoken Chinese chars vs. total with punctuation) against the 850–950 target band",
      },
      {
        label: "References",
        text: "voice profile, anti-slop mantra, preemptive-rebuttal pattern, worked rebuild examples",
      },
    ],
    featuresZh: [
      {
        label: "4 种模式",
        text: "长文重建、已过稿口播精修、实录修整、按既定反馈拼装补丁",
      },
      {
        label: "硬原则闸门",
        text: "钩子三件套、两个问题（为什么是我 / 对我有什么好处）、价格对冲、合规改写——作者定死，不商量",
      },
      {
        label: "保留声音",
        text: "保住说话人的操作词与元认知插话；只删空话填充",
      },
      {
        label: "脚本",
        text: "count_spoken_chars.py 双指标（中文口语字数 vs 含标点总数）对齐 850–950 目标区间",
      },
      {
        label: "参考资料",
        text: "声音画像、反套话咒语、预先反驳模式、重建实战样例",
      },
    ],
    iconUrl: "/assets/icons/skills/video-script-conversion.svg?v=2",
    zipUrl: "/video-script-conversion-skill.zip",
  },
  {
    slug: "design-md-visual-system",
    name: "DESIGN.md Visual System",
    tagline:
      "Tokens give exact values; prose carries judgment. Write Genre-A DESIGN.md so agents ship UI without inventing taste.",
    taglineZh:
      "token 给出精确值，文字承载判断。写 Genre-A DESIGN.md，让 agent 不靠猜就能做出像样的 UI。",
    features: [
      {
        label: "Genre gate",
        text: "Visual system (A) vs brand/OG image brief (B); refuse thin vibe paragraphs; keep the two jobs split",
      },
      {
        label: "YAML-first workflow",
        text: "normative tokens, color aliases, role typography, components with description:; extract from real CSS/HTML, don't invent",
      },
      {
        label: "Signature Treatments",
        text: "non-optional moves when an element type appears, plus Defaults, Do/Don't, density philosophy",
      },
      {
        label: "Completeness bar",
        text: "CJK & International, Iteration Guide, Known Gaps, /10 rubric with audit blockquote",
      },
      {
        label: "References",
        text: "anatomy from the beautiful-html-templates gold corpus, quality rubric, fillable Genre A skeleton, 34 gold corpus design.md files under references/gold-corpus/",
      },
      {
        label: "Google CLI",
        text: "lint with @google/design.md; optional export to Tailwind theme or DTCG tokens.json",
      },
    ],
    featuresZh: [
      {
        label: "类型闸门",
        text: "视觉系统（A）vs 品牌/OG 生图 brief（B）；拒绝单薄 vibe 段落；两份工作分开",
      },
      {
        label: "先 YAML 再写",
        text: "规范 token、颜色别名、角色字体、带 description: 的组件；从真实 CSS/HTML 提取，不发明",
      },
      {
        label: "招牌处理",
        text: "元素类型出现时不可省略的 Signature Treatments，加上 Defaults、Do/Don't、密度哲学",
      },
      {
        label: "完整性门槛",
        text: "CJK 与国际化、迭代指南、已知缺口、带审计引文的 /10 评分",
      },
      {
        label: "参考资料",
        text: "beautiful-html-templates 金标的解剖、质量评分表、可填的 Genre-A 骨架、references/gold-corpus/ 下 34 份金标 design.md",
      },
      {
        label: "Google CLI",
        text: "用 @google/design.md lint；可选导出 Tailwind 主题或 DTCG tokens.json",
      },
    ],
    iconUrl: "/assets/icons/skills/design-md-visual-system.svg?v=2",
    zipUrl: "/design-md-visual-system-skill.zip",
  },
  {
    slug: "webgl-threejs-background-animation",
    name: "WebGL Three.js Background Animation",
    tagline:
      "WebGL that blends into the page — not a framed exhibit. Light, quiet, high perceived quality. Fix GPU cost first; add juice after.",
    taglineZh:
      "融入页面而非框起来展览的 WebGL。轻、安静、感知质量高。先修 GPU 成本，再加料。",
    features: [
      {
        label: "Design Preferences",
        text: "animation grows into the page (edge fade, full-viewport background, readable content over motion); framed-exhibit anti-patterns are banned",
      },
      {
        label: "Config-driven architecture",
        text: "one TUNING object + one CATEGORIES array; a fifth visual weight is one entry, not a refactor",
      },
      {
        label: "Dual-material dissolve + helix camera",
        text: "sketch→solid crossfade from hover, click, and idle auto-ramp; frame-rate-independent damping (1 − e^(−λ·dt))",
      },
      {
        label: "In-game motion craft",
        text: "dt-clamped loops, ViewRig cameras, juice (squash, halo, FOV kick), pooled particles, procedural worlds",
      },
      {
        label: "Lifecycle hygiene",
        text: "IntersectionObserver + visibilitychange + resize + reduced-motion + full dispose: zero GPU when invisible",
      },
      {
        label: "Visual levers & budgets",
        text: "fog, edge fade, parallax, colour hierarchy by perceived gain ÷ cost; draw-call and pixelRatio budgets",
      },
      {
        label: "Reference implementation",
        text: "examples/HeroCanvas.tsx: lizliz.xyz “Paper Ink Garden” full-page background (862 lines, three@0.185)",
      },
    ],
    featuresZh: [
      {
        label: "设计偏好",
        text: "动画长进页面里（边缘渐隐、整页背景、内容可读性优先）；禁止「框起来展览」反模式",
      },
      {
        label: "配置驱动架构",
        text: "一个 TUNING 对象 + 一个 CATEGORIES 数组；第五档视觉重量 = 加一条，不是重构",
      },
      {
        label: "双材质溶解 + 螺旋相机",
        text: "hover / click / 空闲自动渐变；帧率无关阻尼（1 − e^(−λ·dt)）",
      },
      {
        label: "游戏内动效工艺",
        text: "dt 钳制循环、ViewRig 相机、juice（挤压、光晕、FOV 踢）、粒子池、程序化世界",
      },
      {
        label: "生命周期",
        text: "IntersectionObserver + visibilitychange + resize + 减少动态 + 完整 dispose——不可见时零 GPU 占用",
      },
      {
        label: "视觉杠杆与预算",
        text: "雾、边缘渐隐、视差、按感知收益 ÷ 成本排序配色层级；draw call 与 pixelRatio 预算",
      },
      {
        label: "参考实现",
        text: "examples/HeroCanvas.tsx：lizliz.xyz「纸墨花园」整页背景（862 行，three@0.185）",
      },
    ],
    iconUrl: "/assets/icons/skills/webgl-threejs-background-animation.svg?v=2",
    zipUrl: "/webgl-threejs-background-animation-skill.zip",
  },
  {
    slug: "interactive-projects-stream",
    name: "Interactive Projects Stream",
    tagline:
      "Full-bleed interactive project stream — dual uneven rows, per-tile speed jitter, OG hover popup. Zero new deps.",
    taglineZh:
      "全宽交互式项目流——双行参差流动、逐卡速度抖动、OG 图悬停弹窗，零新增依赖。",
    features: [
      { label: "Dual rows", text: "two independent lanes with staggered speeds and phase offsets — no shelf feel" },
      { label: "Jitter", text: "deterministic hash per tile: speed ±42%, gap 16–44px, phase; sinusoidal wobble" },
      { label: "OG popup", text: "portaled hover card (Open Graph image + description) that follows moving tiles" },
      { label: "Full a11y", text: "reduced-motion static grid, keyboard-opened popup, aria-hidden duplicates, tabIndex=-1 copies" },
      { text: "Decision table vs react-fast-marquee / embla / FM / GSAP + falsifiable probe checklist; TUNING table; 6 real pitfalls with fixes" },
    ],
    featuresZh: [
      { label: "双行流", text: "两条独立泳道，速度与相位错开——没有货架感" },
      { label: "参差抖动", text: "每张卡哈希决定速度 ±42%、间距 16–44px、相位；正弦波动" },
      { label: "OG 弹窗", text: "portal 悬停卡片（Open Graph 图 + 简介），跟随流动中的卡片" },
      { label: "无障碍完备", text: "reduced-motion 静态网格、键盘弹窗、重复项 aria-hidden + tabIndex=-1" },
      { text: "vs react-fast-marquee / embla / FM / GSAP 的选型判据表 + 可证伪验收清单；TUNING 表；6 个真实陷阱及修法" },
    ],
    iconUrl: "/assets/icons/skills/interactive-projects-stream.svg?v=2",
    zipUrl: "/interactive-projects-stream-skill.zip",
  },
  {
    slug: "seo-master",
    name: "SEO Master",
    tagline:
      "Full-site SEO/GEO audit plus generative-engine citation measurement — one workflow, evidence over vibes.",
    taglineZh:
      "全站 SEO/GEO 审计 + 生成式引擎推流测量一体化——证据优先，不靠玄学。",
    features: [
      {
        label: "18 sections",
        text: "technical, on-page, E-E-A-T, keyword, JSON-LD, CWV, backlinks, GSC+GA4, SERP, rank — one audit pass",
      },
      {
        label: "GEO / AEO",
        text: "three-path source model (memory / retrieval / user-fetch) + platform matrix + frozen-query measurement protocol",
      },
      {
        label: "Evidence ladder",
        text: "E0–E4 claims: hypothesis → config → single run → fixed-corpus rate → outcomes",
      },
      {
        label: "GEO vs SEO",
        text: "priority table — crawl/index foundation first, then GEO experiments when AI discovery matters",
      },
      {
        label: "House rails",
        text: "Liz safety rails: GA4 ID lock, no fake GSC tokens, private-by-design skip, no brand redesign under SEO pretext",
      },
      {
        text: "V6: observable states over unsupported scores; V5→V6 change map in references/",
      },
    ],
    featuresZh: [
      {
        label: "18 节覆盖",
        text: "技术、页面、E-E-A-T、关键词、JSON-LD、CWV、外链、GSC+GA4、SERP、排名——一次审完",
      },
      {
        label: "GEO / AEO",
        text: "三路径来源模型（记忆 / 检索 / 用户拉取）+ 平台矩阵 + 冻结语料测量协议",
      },
      {
        label: "证据阶梯",
        text: "E0–E4 声明：假设 → 配置 → 单次观察 → 固定语料比率 → 业务结果",
      },
      {
        label: "GEO vs SEO",
        text: "优先级表——先打通抓取/索引地基，再在 AI 发现场景做 GEO 实验",
      },
      {
        label: "House 护栏",
        text: "Liz 安全轨：锁死 GA4 ID、不伪造 GSC token、私有站跳过、禁止借 SEO 改品牌资产",
      },
      {
        text: "V6：可观察状态替代无支撑打分；references/ 含 V5→V6 变更映射",
      },
    ],
    iconUrl: "/assets/icons/skills/seo-master.svg?v=2",
    zipUrl: "/seo-master-skill.zip",
  },
];
