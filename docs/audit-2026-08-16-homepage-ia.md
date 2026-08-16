# 首页 IA / 视觉密度审计 — 2026-08-16

**日期：** 2026-08-16  
**只读证据：** `HomeContent.tsx`、`HomeV5.tsx`、未挂载的 V1/V3/V4、`ProjectsMarquee`、`GithubHeatmap`、`src/i18n`、`docs/DESIGN.md`、`public/llms.txt`  
**关键校正：** 生产背景是 **HomeV5 Canvas 2D**，不是 Three.js。`HeroCanvas`（three）仍在仓库，首页没有 import。

## Verdict

Liz 说得对。首页不是丰富，是没剪过的样片：身份、作品集、技能店、文集、社交证明叠在同一条卷轴上，再加一层永远在动的背景。

## 1. 区块清单

| 区 | 装了什么 |
|---|---|
| chrome | 橙条、固定 TopBar（名字 + 三跳转 + 主题/语言） |
| 背景 | `HomeV5` 力场线，rAF 常驻；内容再盖磨砂纸 |
| `#top` | h1 LizLiz（三连击跳简历）、tagline、Now、三词复读 |
| `#projects` | 双行无限河，约 14 个站 + 水纹 + hover OG |
| `#skills` | 嵌在 projects 里；8 skill + templates 再一条河 |
| `#writing` | 最新 5 篇 + 播客再套一遍列表 |
| `#connect` | GitHub / X / 即刻 + 全年热力图 |

`/skills`、`/templates`、`/articles` 已经是完整页。首页在零售一遍。

## 2. 第一屏在抢什么

顶栏名字、全屏蠕动背景、又写一遍的 h1、tagline / now / 三词（同一句话拆三次）、探进来的项目河。没有主 CTA。没有「先看这个」。

## 3. 机制

1. **产品线混装。** 上线产品、skill 下载、模板、长文、播客、社交证明同级。
2. **动效预算超支。** DESIGN.md 只允许微动效。现状：背景场 + 两条 marquee + 水纹 + 热力图。WebGL 卸了，「整页永远在演」这个职位还在。
3. **身份复读。** 顶栏、h1、tagline、now、what I do。
4. **热力图是第二套视觉语言。** Connect 自称 secondary，面积不是。
5. **版本层没死干净。** V1 Three.js、V3、V4、V5 同目录。每轮加氛围，没人删货架。

`llms.txt` 把首页定义成 writing + shipped projects。页面自己没守。`DESIGN.md` 写着 homepage 围绕一句 thesis。也没守。

## 4. IA 砍法

首页只做：**谁 + 一句 + 两样证据（做成的 / 写过的）。**

**留：** 一个名字（顶栏或 h1，删掉一个）；一句 tagline；可选一行 Now；精选 3–5 个站（静列表）；3 篇最新文章；GitHub / X / 即刻。

**迁回已有路由：** skills、templates、文章库、播客。不要新开 `/projects` 博物馆。

**杀：** 整页氛围画布；双河 + 水纹 + 弹层；首页热力图；h1 简历彩蛋按钮；what_i_do 三词；空 lede。

## 5. 不做什么

- 新设计系统
- 新 `/projects` 馆
- 再做 V6 氛围

## 6. 验收

首屏 3 秒能说出「谁 + 一句 + 去哪」。首页无 rAF 背景、无双河、无热力图、无 skill 零售。

**风险：** 精选哪 3–5 个站是产品判断，要 Liz 点头。未点头前不改首页货架。

**置信度：** 高（机制）；精选名单 **低**（要 Liz）  
**Owner：** Liz 点精选 → 再实现  
**Next checkpoint：** Liz 回复精选站名单后，再动 `HomeContent.tsx`
