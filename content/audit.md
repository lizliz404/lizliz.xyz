# lizliz.xyz SEO Audit

Date: 2026-05-12
Scope: `lizliz.xyz` article SEO foundation, content metadata, crawlability, semantic HTML, internal linking, and monitoring readiness.

## Executive judgment

Current status: **foundation partially fixed locally, content SEO not yet done at article level**.

The site is capable of being indexed, but several items from the checklist are still missing or only implemented locally. The largest current blockers are:

1. `sitemap.xml` is not live yet until the pending code changes are committed, pushed, and deployed.
2. Existing articles mostly have no internal links.
3. Existing article titles/descriptions are written more like essays than search-intent landing pages.
4. Markdown bodies often include a top-level `#` title, which previously produced duplicate `<h1>` in generated HTML. This has been fixed in rendering by mapping markdown `h1` to `h2`, but older article source structure should still be normalized over time.
5. Google Search Console monitoring/submission is not verifiable from this server because no GSC credentials or env are present.

## Checklist status

### 1. Submit `sitemap.xml` in Google Search Console and confirm no severe crawl errors

Status: **not complete / external action required**.

Observed:

- Local build now generates `/sitemap.xml` and `/robots.txt`.
- Current live `https://lizliz.xyz/sitemap.xml` returned `404` during audit, so the sitemap is not deployed live yet.
- No Search Console credentials/env were found on this server, so GSC submission and crawl-error verification cannot be confirmed programmatically here.

Required next step:

- Deploy pending site changes.
- In Google Search Console, submit: `https://lizliz.xyz/sitemap.xml`.
- Check Pages / Indexing for severe errors: `Blocked by robots.txt`, `Submitted URL not found (404)`, `Duplicate without user-selected canonical`, `Crawled - currently not indexed`.

### 2. Article URL slugs use English keyword hyphen format

Status: **mostly complete**.

Result:

- All current article filenames pass `^[a-z0-9]+(-[a-z0-9]+)*$`.
- No pure numeric or unordered ID slugs found.

Current slugs:
- `agent-payment-infra` — OK
- `ai-model-choice-rlhf` — OK
- `doubao-input-method` — OK
- `fitbit-air-google-health` — OK
- `ga4-service-account-ui-bug` — OK
- `payment-platforms-selection` — OK
- `pkm-agent-workflow` — OK
- `platform-incentive-vs-building` — OK
- `productivity-slot-machine` — OK

Rule going forward:

- Good: `creem-payment-china-indie-developer`, `ga4-service-account-accessbindings`, `ai-agent-payment-infra`
- Bad: `001`, `post-1`, `my-thoughts`, `20260512`

### 3. Rewrite YAML metadata using pain-point + solution + keyword formula

Status: **not complete**.

The technical system now reads article `title`, `description`, `date`, and `tags`, and generates per-article SEO metadata from them. But the existing content metadata has not been fully rewritten around search intent.

Needs work:
- `agent-payment-infra.md` — title not search-intent enough, missing tags
- `ai-model-choice-rlhf.md` — title not search-intent enough, description likely too short/generic
- `doubao-input-method.md` — title not search-intent enough, description likely too short/generic, missing tags
- `payment-platforms-selection.md` — description likely too short/generic
- `productivity-slot-machine.md` — title not search-intent enough, description likely too short/generic, missing tags

Recommended YAML shape:

```yaml
title: "痛点：解法 + 核心关键词"
date: "YYYY-MM-DD"
description: "写给谁，遇到什么问题，这篇文章具体解决什么，包含哪些关键词/场景。"
tags: ["core-keyword", "secondary-keyword", "topic"]
search_intent: "用户搜索这篇文章时真正想解决的问题"
keywords:
  - "主关键词"
  - "长尾关键词 1"
  - "长尾关键词 2"
  - "长尾关键词 3"
```

Note: `search_intent` and `keywords` are recommended editorial fields; the renderer does not currently use them yet.

### 4. Each article has one search intent and 3-5 long-tail keywords in subheadings

Status: **not complete**.

Observed:

- Most articles have strong ideas, but headings are mostly essay-native, not search-native.
- Search intent is implicit, not declared.
- Long-tail keyword coverage is uneven.

Fix rule:

- Before publishing, define one primary search intent.
- Add 3-5 `##` / `###` headings that include natural long-tail phrases.
- Do not keyword-stuff. Use headings people would actually search.

Example:

```md
## Creem 适合中国独立开发者吗
## Creem 和 Stripe 的手续费差异
## Creem 支付审核被拒怎么办
## SaaS 产品如何接入 Creem Webhook
```

### 5. Images have descriptive alt text with target keyword

Status: **not applicable currently / enforce going forward**.

Observed:

- Current markdown articles contain no markdown images.
- Therefore no missing alt text was found, but no image SEO exists either.

Rule going forward:

```md
![Creem 支付接入后台配置截图：Webhook 和产品价格设置](./images/creem-webhook-price-config.png)
```

Bad:

```md
![](image.png)
![screenshot](image.png)
```

### 6. Internal linking mechanism: each new article links to 2 old posts, old posts link back to new post

Status: **not complete**.

Observed:

- Existing articles mostly have `0` internal article links.
- Article page footer currently only links back to `/articles`; it does not provide previous/next/similar article switcher.

Articles below 2 internal links:
- `agent-payment-infra.md` — 0 internal links
- `ai-model-choice-rlhf.md` — 0 internal links
- `doubao-input-method.md` — 0 internal links
- `fitbit-air-google-health.md` — 0 internal links
- `ga4-service-account-ui-bug.md` — 0 internal links
- `payment-platforms-selection.md` — 0 internal links
- `pkm-agent-workflow.md` — 0 internal links
- `platform-incentive-vs-building.md` — 0 internal links
- `productivity-slot-machine.md` — 0 internal links

Recommended implementation:

1. Editorial rule: every new article includes at least two contextual internal links in the body.
2. Product rule: add previous/next article navigation at the bottom of each article.
3. Optional later: add tag/topic-based related posts.

### 7. HTML semantic structure: exactly one `<h1>`, correct `h2` / `h3` nesting

Status: **partially fixed locally**.

Observed from generated HTML before fix:

- Most articles had 2 `<h1>` because `ArticleContent` renders the article title as `<h1>` and markdown body often starts with `# title`.
- The renderer has been patched locally to map markdown `#` to `<h2>`, leaving the page title as the only `<h1>`.

Remaining cleanup:

- Normalize source markdown over time: remove duplicate top-level `# title` from article bodies, or enforce renderer behavior permanently.
- Keep hierarchy: page title = `h1`; major sections = `h2`; subsections = `h3`.

Source articles still containing markdown `#` headings:
- `agent-payment-infra.md` — 1 markdown H1
- `ai-model-choice-rlhf.md` — 1 markdown H1
- `doubao-input-method.md` — 1 markdown H1
- `fitbit-air-google-health.md` — 1 markdown H1
- `pkm-agent-workflow.md` — 1 markdown H1
- `platform-incentive-vs-building.md` — 1 markdown H1
- `productivity-slot-machine.md` — 1 markdown H1

### 8. Ongoing Google Search Console reporting: CTR and average position

Status: **not complete / needs process**.

No GSC API credentials are present on this server. Until that exists, reporting is manual.

Weekly report fields:

- Top queries by clicks
- Top pages by clicks
- CTR by query/page
- Average position change vs previous week
- Pages with impressions but low CTR
- Pages with position 8-20 that can be improved by rewriting title/description
- New indexing/crawl errors

## One-person company / monetization implication

The site should not optimize for vanity traffic. The SEO goal should support the one-person company experiment:

- attract high-intent readers around AI agents, indie building, payments, tooling, and writing systems;
- convert attention into reputation, opportunities, product validation, consulting/project leads, or distribution;
- use Search Console data to decide what to double down on, not to endlessly polish metadata.

Success metrics:

- Indexed pages count increasing
- Search impressions for target topics increasing
- CTR above 2-5% on relevant queries
- Average position moving toward top 10 for long-tail terms
- At least one external signal within 30 days: inbound link, DM, subscriber, product lead, consulting lead, or collaboration

## Immediate next actions

1. Deploy the pending SEO infrastructure changes so `/sitemap.xml` and `/robots.txt` go live.
2. Submit `https://lizliz.xyz/sitemap.xml` in Google Search Console.
3. Add bottom previous/next article switcher.
4. Rewrite metadata for the highest-commercial-intent articles first:
   - `payment-platforms-selection.md`
   - `agent-payment-infra.md`
   - future Creem article
5. Add at least 2 internal links per article, starting with the payments/agent cluster.
6. Create a weekly GSC report workflow once credentials/access are available.
