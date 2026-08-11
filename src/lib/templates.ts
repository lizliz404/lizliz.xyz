/**
 * Public templates pack shown on the /templates page.
 * Mirrors the /skills structure (tagline + features with zh twins),
 * but as a single resource pack: one zip, three content areas.
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
    "Reusable design systems, landing templates, UI micro-patterns, and craft checklists — extracted from shipped projects. Download, unzip, reuse.",
  taglineZh:
    "从已上线项目里沉淀的可复用资产:设计系统、落地页模板、UI 微模式、工艺清单。下载、解压、直接用。",
  iconUrl: "/assets/icons/templates.svg",
  zipUrl: "/templates-pack.zip",
  howto: [
    "Download the zip and unzip it — you get a templates/ folder with a README index.",
    "Or clone the GitHub repo and copy what you need; git pull keeps it in sync on any machine.",
    "Every item is self-contained: read its DESIGN.md or README, lift the parts you need.",
  ],
  howtoZh: [
    "下载 zip 并解压——得到一个 templates/ 文件夹,内含 README 索引。",
    "或克隆 GitHub 仓库按需拷贝;在任意机器上 git pull 即可长期同步。",
    "每项资产自包含:读它的 DESIGN.md 或 README,按需取用。",
  ],
  areas: [
    {
      name: "Design systems & landing templates",
      nameZh: "设计系统与落地页模板",
      blurb:
        "design/ — full visual systems with DESIGN.md tokens plus working HTML/CSS/TSX you can lift.",
      blurbZh: "design/ — 完整视觉系统(DESIGN.md token)+ 可直接移植的 HTML/CSS/TSX。",
      items: [
        {
          label: "lead-radar",
          text: "Editorial SaaS landing system — warm paper, Lora + Poppins, honest positioning copy. DESIGN.md + landing-page.tsx + globals.css.",
        },
        {
          label: "liz-personal-compact",
          text: "Compact personal/landing variants (landing.html, v2, v3 + CSS/JS).",
        },
        {
          label: "uhoh-inspired-service-entry",
          text: "Monochrome comic service-entry template — index.html + DESIGN.md + EVIDENCE.md.",
        },
        {
          label: "hanzilla-personal-site",
          text: "Warm editorial personal-site study — DESIGN.md + EVIDENCE.md + screenshots.",
        },
        {
          label: "beautiful-ui-ai-interfaces",
          text: "19 AI-native UI primitives — thinking traces, streaming text, approval cards, tool chips, composer — rebuilt from observation with full DOM + screenshots.",
        },
        {
          label: "vercel-geist",
          text: "Geist-oriented design notes for Vercel-adjacent UI tone.",
        },
      ],
      itemsZh: [
        {
          label: "lead-radar",
          text: "编辑部风 SaaS 落地页系统——暖纸质感、Lora + Poppins、诚实的定位文案。DESIGN.md + landing-page.tsx + globals.css。",
        },
        {
          label: "liz-personal-compact",
          text: "紧凑型个人站/落地页变体(landing.html、v2、v3 + CSS/JS)。",
        },
        {
          label: "uhoh-inspired-service-entry",
          text: "单色漫画风服务承接页模板——index.html + DESIGN.md + EVIDENCE.md。",
        },
        {
          label: "hanzilla-personal-site",
          text: "暖色编辑部风个人站研究——DESIGN.md + EVIDENCE.md + 截图。",
        },
        {
          label: "beautiful-ui-ai-interfaces",
          text: "19 个 AI-native UI 原语——思考轨迹、流式文本、人工审批卡、工具 chips、聊天输入框——观察重建,含完整 DOM 与截图。",
        },
        {
          label: "vercel-geist",
          text: "面向 Vercel 系 UI 语感的 Geist 设计笔记。",
        },
      ],
    },
    {
      name: "UI micro-patterns",
      nameZh: "UI 微模式",
      blurb:
        "ui-patterns/ — small named patterns with portable snippets, not full pages.",
      blurbZh: "ui-patterns/ — 小而有名的模式 + 可直接移植的代码片段,不是整页。",
      items: [
        {
          label: "Typing placeholder",
          text: "typing / rotating placeholder animation — .ts/.css snippets.",
        },
        {
          label: "Atomic island chrome",
          text: "persistent floating chrome island with portable layout tokens.",
        },
        {
          label: "Premium one-pager",
          text: "premium one-pager pattern + TS/CSS snippets.",
        },
      ],
      itemsZh: [
        {
          label: "打字占位符",
          text: "typing / rotating placeholder 动画——.ts/.css 片段。",
        },
        {
          label: "原子岛 chrome",
          text: "常驻悬浮 chrome 岛模式 + 可移植的布局 token。",
        },
        {
          label: "高级一页站",
          text: "premium one-pager 模式 + TS/CSS 片段。",
        },
      ],
    },
    {
      name: "Craft docs",
      nameZh: "工艺文档",
      blurb: "Checklists and conventions distilled from real pipelines.",
      blurbZh: "从真实管线里蒸馏出的清单与约定。",
      items: [
        {
          label: "High-leverage craft checklist",
          text: "38 mechanics, grouped — a craft handbook, not a skill; history kept in archive/.",
        },
        {
          label: "Typography preferences",
          text: "design-typography-font-preferences.md — font pairing conventions.",
        },
        {
          label: "i18n + Iconify",
          text: "i18n-iconify-lang-switcher.md — language switcher notes.",
        },
      ],
      itemsZh: [
        {
          label: "高杠杆工艺清单",
          text: "38 条机制分组——工艺手册(非 Skill),历史版本在 archive/。",
        },
        {
          label: "字体偏好",
          text: "design-typography-font-preferences.md——字体搭配约定。",
        },
        {
          label: "i18n + Iconify",
          text: "i18n-iconify-lang-switcher.md——语言切换器笔记。",
        },
      ],
    },
  ],
};
