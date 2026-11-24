/**
 * Public templates pack shown on the /templates page.
 * Mirrors the /skills structure (tagline + features with zh twins),
 * as a single resource pack: one zip, content grouped the same way
 * the pack's own router (templates/README.md) groups it.
 */
export type TemplateFeature = { label?: string; text: string };

export type TemplateArea = {
  name: string;
  nameZh: string;
  blurb: string;
  blurbZh: string;
  items: TemplateFeature[];
  itemsZh: TemplateFeature[];
};

/** Public GitHub mirror of the templates pack (long-term sync source). */
export const TEMPLATES_REPO = "https://github.com/lizliz404/design-templates";

export const TEMPLATES_PACK = {
  slug: "templates",
  name: "Design Templates",
  nameZh: "设计模板资源包",
  tagline:
    "A working library of design assets distilled from shipped projects — page systems, UI micro-patterns, agent chrome, deck & diagram recipes, and craft checklists. templates/README.md routes each task to the smallest useful asset.",
  taglineZh:
    "从已上线项目沉淀的设计资产工作库——页面系统、UI 微模式、Agent 氛围件、deck/图示配方与工艺清单。templates/README.md 主路由按任务选最小够用的一件。",
  iconUrl: "/assets/icons/templates.svg",
  zipUrl: "/templates-pack.zip",
  howto: [
    "Download the zip and unzip it — you get a templates/ folder whose README.md is the single task router.",
    "Or clone the GitHub repo and copy what you need; git pull keeps it in sync on any machine.",
    "Write down a selection record, read the smallest matching asset, then verify against a real screenshot — every item is self-contained with its own DESIGN.md or README.",
  ],
  howtoZh: [
    "下载 zip 并解压——得到 templates/ 文件夹，其中 README.md 是唯一任务主路由。",
    "或克隆 GitHub 仓库按需拷贝;在任意机器上 git pull 即可长期同步。",
    "先记一条复用选择记录，读最小匹配资产，再用真实界面截图验收——每项资产自带 DESIGN.md 或 README。",
  ],
  areas: [
    {
      name: "Design systems & page studies",
      nameZh: "设计系统与页面研究",
      blurb:
        "design/ — full visual studies with DESIGN.md tokens, evidence and liftable HTML/CSS/TSX.",
      blurbZh: "design/ — 完整视觉研究(DESIGN.md token + 证据),含可直接移植的 HTML/CSS/TSX。",
      items: [
        {
          label: "lead-radar",
          text: "Editorial SaaS landing system — warm paper, Lora + Poppins, honest positioning copy.",
        },
        {
          label: "liz-personal-compact",
          text: "Compact personal-site variants — the system this site runs on (landing.html, v2, v3 + CSS/JS).",
        },
        {
          label: "beautiful-ui-ai-interfaces",
          text: "21 AI-native UI primitives — thinking traces, streaming, approval cards, tool chips, composer — upstream TSX under MIT.",
        },
        {
          label: "uhoh / hanzilla",
          text: "Monochrome comic service-entry and warm editorial personal-site studies, each with DESIGN.md + EVIDENCE.md.",
        },
        {
          label: "anduril-saronic / franklin-offshore / kami-document",
          text: "Brand and document DNAs with evidence packs — real token values, not inferred palettes.",
        },
        {
          label: "b2b-brochure-sites / glass-motion-landscape / vercel-geist / fonts",
          text: "B2B brochure-site exemplars, glass-motion notes, Vercel-adjacent tone notes, hosted font files.",
        },
      ],
      itemsZh: [
        {
          label: "lead-radar",
          text: "编辑部风 SaaS 落地页系统——暖纸质感、Lora + Poppins、诚实的定位文案。",
        },
        {
          label: "liz-personal-compact",
          text: "紧凑型个人站变体——本站自己在跑的同一套系统(landing.html、v2、v3 + CSS/JS)。",
        },
        {
          label: "beautiful-ui-ai-interfaces",
          text: "21 个 AI-native UI 原语——思考轨迹、流式文本、审批卡、工具 chips、聊天输入框——上游 TSX,MIT 许可。",
        },
        {
          label: "uhoh / hanzilla",
          text: "单色漫画风服务承接页与暖色编辑部风个人站研究,各含 DESIGN.md + EVIDENCE.md。",
        },
        {
          label: "anduril-saronic / franklin-offshore / kami-document",
          text: "品牌与文档 DNA + 证据包——实测 token 值,不是猜出来的色板。",
        },
        {
          label: "b2b-brochure-sites / glass-motion-landscape / vercel-geist / fonts",
          text: "B2B 宣传站样本、玻璃动效笔记、Vercel 系语感笔记与自托管字体文件。",
        },
      ],
    },
    {
      name: "UI micro-patterns",
      nameZh: "UI 微模式",
      blurb:
        "ui-patterns/ — 36 named patterns with contracts and portable snippets, not full pages.",
      blurbZh: "ui-patterns/ — 36 个有名有姓的模式 + 合同与可移植片段,不是整页。",
      items: [
        {
          label: "ai-thinking-orb",
          text: "Thinking-orb skill — FluidOrb / Liquid Orb, both upstream sources vendored with licenses.",
        },
        {
          label: "ai-workspace-surfaces + agent-interaction-guidelines",
          text: "Agent rails, workspace surfaces, session/activity contracts.",
        },
        {
          label: "ai-native-visual-workbench",
          text: "Multi-pane workbench scroll/interaction contract — shell locks viewport, panes self-scroll, overscroll chains cut.",
        },
        {
          label: "data-dense-app-craft + data-dense-b2b-app",
          text: "Dense B2B tables, records, diffs and filters grammar.",
        },
        {
          label: "search-craft / searchable-filter-choice / publish-calendar",
          text: "Search UX, filter-choice rules, and a month-calendar publish workbench.",
        },
        {
          label: "Playful set",
          text: "hamster cookie consent, stretchy-dog password meter, isometric empty states, hand-drawn controls — playful surfaces only.",
        },
        {
          label: "Steady set",
          text: "typing placeholder, atomic-island chrome, premium one-pager, footer craft, icon-system craft and 20+ more.",
        },
      ],
      itemsZh: [
        {
          label: "ai-thinking-orb",
          text: "思考 orb skill——FluidOrb / Liquid Orb 二选一,两份上游源码带许可收进包。",
        },
        {
          label: "ai-workspace-surfaces + agent-interaction-guidelines",
          text: "Agent 侧栏、工作台表面、Session/Activity 契约。",
        },
        {
          label: "ai-native-visual-workbench",
          text: "多栏工作台滚动/交互合同——壳锁视口、栏自滚、overscroll 断链。",
        },
        {
          label: "data-dense-app-craft + data-dense-b2b-app",
          text: "数据密集 B2B 的表格、records、diff 与筛选语法。",
        },
        {
          label: "search-craft / searchable-filter-choice / publish-calendar",
          text: "搜索体验、筛选选型规则与月历发布工作台。",
        },
        {
          label: "Playful 一组",
          text: "仓鼠 cookie 同意、腊肠狗密码条、等距空状态、手绘控件——只上 playful 表面。",
        },
        {
          label: "稳重一组",
          text: "typing 占位符、原子岛 chrome、premium one-pager、footer 工艺、图标系统工艺等 20+ 项。",
        },
      ],
    },
    {
      name: "Agent & motion chrome",
      nameZh: "Agent 与动态氛围件",
      blurb:
        "paper-shaders/ + motion patterns — ambient shaders, heroes and cues for AI surfaces; one live atmosphere per view.",
      blurbZh: "paper-shaders/ + 动效模式——AI 表面的氛围 shader、hero 与提示音;同一视图最多一套动态大气。",
      items: [
        {
          label: "paper-shaders",
          text: "Paper / mesh / veil background shaders — recipes, stills, scripts; ambience, not state.",
        },
        {
          label: "threeui-hero-adapter / drafting-resolve-hero",
          text: "Two real hero options — ThreeUI one-hero and a batched line-drawing resolve hero.",
        },
        {
          label: "vgpu-webgpu-effects",
          text: "vercel-labs WebGPU effects notes — typed WGSL, versioned byte budgets; WebGPU-only, no fallback.",
        },
        {
          label: "isometric-figures / still-to-webgl-theater",
          text: "Hairline isometric-object engine and still→WebGL theater builds.",
        },
        {
          label: "liquid-glass-island-wheels / uisfx-semantic-cues",
          text: "Liquid-glass wheel survey with license checks, and semantic UI sound cues.",
        },
      ],
      itemsZh: [
        {
          label: "paper-shaders",
          text: "纸张 / mesh / veil 背景 shader——配方、静帧、脚本;是氛围不是状态。",
        },
        {
          label: "threeui-hero-adapter / drafting-resolve-hero",
          text: "两套真实 hero——ThreeUI one-hero 与 batched 线稿 resolve hero。",
        },
        {
          label: "vgpu-webgpu-effects",
          text: "vercel-labs WebGPU 特效笔记——typed WGSL、版本化体积预算;仅 WebGPU,无兜底。",
        },
        {
          label: "isometric-figures / still-to-webgl-theater",
          text: "Hairline 等距物体引擎与静帧→WebGL 剧场搭建。",
        },
        {
          label: "liquid-glass-island-wheels / uisfx-semantic-cues",
          text: "液态玻璃轮子验真表(带许可实核)与语义化 UI 音效。",
        },
      ],
    },
    {
      name: "Decks, diagrams & visuals",
      nameZh: "Deck、图示与视觉资产",
      blurb:
        "decks/ + visual playbooks — presentation decks, diagram routing and illustration assets.",
      blurbZh: "decks/ + 视觉 playbook——演示 deck、图示路由与插画资产。",
      items: [
        {
          label: "visual-economy",
          text: "Diagram routing rule — prose first, then ASCII, then Mermaid; React/Three only when earned.",
        },
        {
          label: "decks/",
          text: "HTML presentation deck templates plus beautiful-html-templates / frontend-slides overlays.",
        },
        {
          label: "diagram-skills / visual-explainer-method",
          text: "12 diagram skills compared, and the method doc for explainer SVGs and self-contained HTML.",
        },
        {
          label: "visual-footer-gallery",
          text: "Curated illustrated-footer samples for scenic page endings.",
        },
        {
          label: "Scroll & video playbooks",
          text: "center-dwell step-scroll, image-text gallery dance, hero background-video and web-video-player due diligence.",
        },
      ],
      itemsZh: [
        {
          label: "visual-economy",
          text: "图示路由规则——先 prose,再 ASCII、Mermaid;挣到了才上 React/Three。",
        },
        {
          label: "decks/",
          text: "HTML 演示 deck 模板 + beautiful-html-templates / frontend-slides 覆盖层。",
        },
        {
          label: "diagram-skills / visual-explainer-method",
          text: "12 个 diagram skill 对比表,以及说明型 SVG / 自包含 HTML 的方法文件。",
        },
        {
          label: "visual-footer-gallery",
          text: "目视精选的插画 footer 样本,收尾用风景页脚。",
        },
        {
          label: "滚动与视频 playbook",
          text: "停驻分步滚动、图文共舞、hero 背景视频选型与网页播放器尽调。",
        },
      ],
    },
    {
      name: "Cases, brand & reference captures",
      nameZh: "案例、品牌与参照捕获",
      blurb:
        "cases/ + brand-identity/ + telegram-web-chat/ + lab/ — teardowns and reference captures with evidence, not moodboards.",
      blurbZh: "cases/ + brand-identity/ + telegram-web-chat/ + lab/——带证据的拆解与参照捕获,不是灵感图库。",
      items: [
        {
          label: "cases/idea-box + cases/microsoft-ai",
          text: "Product case studies with recon notes and docs.",
        },
        {
          label: "brand-identity",
          text: "Logo / favicon / OG / share-card contract plus measured reference captures.",
        },
        {
          label: "telegram-web-chat",
          text: "Fixed-version Telegram Web study — drafts, read position, attachment ownership — with an offline prototype.",
        },
        {
          label: "GitHub only, outside the zip",
          text: "Repo root also keeps REA teardowns (grok.com, vercel, anduril, fugro, saronic, replyarc) and lab/refs.",
        },
      ],
      itemsZh: [
        {
          label: "cases/idea-box + cases/microsoft-ai",
          text: "产品案例研究,含侦察笔记与文档。",
        },
        {
          label: "brand-identity",
          text: "Logo / favicon / OG / 分享名片合同 + 实测参照捕获。",
        },
        {
          label: "telegram-web-chat",
          text: "固定版本 Telegram Web 研究——草稿、阅读位置、附件所有权——附离线原型。",
        },
        {
          label: "只在 GitHub,不在 zip",
          text: "仓库根目录另存 REA 拆解(grok.com、vercel、anduril、fugro、saronic、replyarc)与 lab/refs。",
        },
      ],
    },
    {
      name: "Craft docs & reading notes",
      nameZh: "工艺文档与读记",
      blurb:
        "Top-level checklists, preference contracts and curated reading — the pack's working rules.",
      blurbZh: "顶层清单、偏好合同与策展读记——这个 pack 自己的工作规则。",
      items: [
        {
          label: "high-leverage-craft-checklist",
          text: "The craft handbook — disclosure single-source and decoupling budgets included; history in archive/.",
        },
        {
          label: "Typography & color",
          text: "design-typography-font-preferences, web-font-subset-optimization, design-color-surface-preferences.",
        },
        {
          label: "i18n pair",
          text: "i18n-iconify-lang-switcher for the switcher, i18n-translation-survival for the survival typesetting rules.",
        },
        {
          label: "IA & decisions",
          text: "ia-user-journey, site/ui-stack-decision, rendering-strategy-map, chrome-controls-placement, sibling-routes.",
        },
        {
          label: "Audits & generation contracts",
          text: "spacing-audit-checklist, element-picker-playbook, on-brand-ai-generation-craft.",
        },
        {
          label: "Agent UI tier tables",
          text: "agentic-ui-primitives, artifacts-canvas-workbench, agent-context-compaction.",
        },
        {
          label: "reading-notes/ + inspiration-sources",
          text: "Curated reading notes and task-keyed inspiration bookmarks — check, then return to the router.",
        },
      ],
      itemsZh: [
        {
          label: "高杠杆工艺清单",
          text: "工艺手册——含披露真源与解耦预算;历史版本在 archive/。",
        },
        {
          label: "字体与颜色",
          text: "design-typography-font-preferences、web-font-subset-optimization、design-color-surface-preferences。",
        },
        {
          label: "i18n 一对",
          text: "切换器看 i18n-iconify-lang-switcher,存活排版规则看 i18n-translation-survival。",
        },
        {
          label: "IA 与决策",
          text: "ia-user-journey、site/ui-stack-decision、rendering-strategy-map、chrome-controls-placement、sibling-routes。",
        },
        {
          label: "审计与生成合同",
          text: "spacing-audit-checklist、element-picker-playbook、on-brand-ai-generation-craft。",
        },
        {
          label: "Agent UI 分级表",
          text: "agentic-ui-primitives、artifacts-canvas-workbench、agent-context-compaction。",
        },
        {
          label: "reading-notes/ + inspiration-sources",
          text: "策展读记与任务化灵感书签——查完回主路由,不镜像外站。",
        },
      ],
    },
  ],
};
