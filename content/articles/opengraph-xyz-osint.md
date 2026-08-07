---
title: "OpenGraph.xyz 深度竞调：一个「10万月活」SaaS 的真实体量"
date: "2026-07-22"
description: "OSINT 全方位调查：OpenGraph.xyz 的真实 MAU、MRR、市场漏斗与创始人真相。首页「100k+ 月活」是营销话术，免费 SEO 流量≠付费 SaaS 收入。"
tags: ["OSINT", "SaaS", "竞品调研", "Open Graph", "MRR"]
categories: ["商业"]
publish: true
---


**Investigation date:** 2026-07-22 (UTC)  
**Target:** https://www.opengraph.xyz / https://opengraph.xyz  
**Core question:** What are OpenGraph.xyz's actual MAU and MRR? Is the product's apparent scale plausible given the niche it serves?

**Method note:** Direct HTTP from this environment consistently hit Vercel Security Checkpoint (HTTP 429), including social crawler user-agents. Site content was obtained via Exa fetch (rendered markdown), WordPress.org API, GitHub API, WHOIS, DNS, Hypestat aggregation of SimilarWeb/SEMrush, founder primary sources, and HN Algolia. Where a data point rests on a single tool, that is stated explicitly.

---

## 1. Executive Summary

- **The “100,000+ monthly users” claim on the homepage is not credible as SaaS MAU.** Independent traffic estimates cluster around **~35k–70k monthly visits** to the free checker site; the team's own advertise page still says **~45k unique visitors**. “Users” here almost certainly means free-tool visitors, and even that number looks inflated vs. third-party estimates.
- **Paying scale is small.** Best estimate: **MRR $1,000–$6,000 (central ~$2,500–$4,000)**, with **~20–120 paying accounts**. WordPress plugin has only **100+ active installs** after 26+ months. No public revenue disclosure from current owners. Pre-acquisition MRR was **$0**.
- **The product is real, not a parked domain.** Live Stripe (`pk_live_…`), active dashboard, pricing at $29 / $59 / $199, WordPress plugin updated **2026-07-21**, API/CDN surfaces (`api.opengraph.xyz`, `ogcdn.net`). Technical depth is mid-tier SaaS (templates + automation), not a thin landing page.
- **Team is authentic but split-attention.** Bought for **$20,000 in Dec 2023** by Bob Singor / WITH LOVE INTERNET (Benjamin “Ariel” Siegal, Antonio Schmitter). Bob’s public energy is on **EmbedPDF**, not OpenGraph. LinkedIn company page: **2 followers**.
- **Niche funnel hypothesis holds.** Free OG *checking* has real SEO demand; **paid** OG *automation* is a thin slice (agencies, multi-page publishers). Free DIY (`@vercel/og`, Canva, CMS plugins) caps willingness to pay. Apparent “scale” is mostly free SEO traffic, not SaaS ARR.

### 中文摘要

- 首页「10万+月活用户」不可信；第三方流量约 **3.5–7万次访问/月**，官网广告页自称约 **4.5万独立访客**——基本是免费检测工具流量，不是付费 SaaS 用户。
- 付费体量很小：估计 **MRR $1k–$6k（中枢约 $2.5k–$4k）**，付费账户大约几十到一百出頭；WordPress 插件仅 **100+** 活跃安装；收购前 **MRR = $0**，售价仅 **$2万**。
- 产品本身是真的（Stripe 正式环境、定价页、持续更新的 WP 插件），但市场极窄；「看起来很大」主要来自精确匹配域名带来的免费 checker SEO，而非经常性收入。

---

## 2. Phase 1: Evidence Card

### 2.1 Product Reality

| Question | Finding | Sources (≥2) |
|---|---|---|
| What does it do? | Free URL scanner/preview of social cards **plus** paid automation: AI brand-matched OG templates, programmatic image generation, short links with custom previews, metadata audits, WP plugin. | Exa fetch of homepage; Exa fetch of `/automated-open-graph-images`, `/sharing-links`, `/about` |
| Thin wrapper or real product? | **Real enough for micro-SaaS.** Not OSS framework; hosted template engine + CDN (`ogcdn.net`) + dashboard + WP bridge. Depth ≈ “Bannerbear-lite for OG,” not `@vercel/og` infrastructure. | WP plugin API (v1.6.0, external services documented); DNS/API headers (Vercel marketing, Render Express API, Cloudflare) |
| Pricing tiers | **3 public tiers + enterprise:** Starter **$29/mo** (signup `plan=lite`), Growth **$59/mo** (`plan=pro`, “Most popular”), Scale **$199/mo** (`plan=agency`). Yearly −20%. 7-day trial, **credit card required**. | Exa `/pricing`; signup URLs on pricing CTAs |
| Integrations | WordPress plugin (required account); HTTP APIs (`api.opengraph.xyz`); image CDN `ogcdn.net`. **No** first-party Chrome extension found. No Zapier mention on fetched pages. | WP.org plugin page + API; HTTP headers for api/ogcdn; Chrome Web Store search (third-party “OpenGraph Preview” tools only) |
| Open source / GitHub | Org `opengraph-xyz` created **2024-01-02**; **1 public repo** (`opengraph-wp`), **0 stars**, 1 follower. Contributors: AdamDiament (69), pinktonio/Antonio (41), bobsingor (14). **No npm package** under the brand. | GitHub API org/repos/contributors; npm search |
| Product evolution | Domain created **2019-11-29**. Original product = free checker + ads. Sold **~Dec 2023**. Post-sale: SaaS packaging, WP plugin (added **2024-05-02**), AI templates, short links. Wayback CDX was rate-limited (429) from this IP; evolution reconstructed from seller post + current site. | WHOIS; Yuyu sale posts (yuurrific + Medium); WP `added` date; GitHub org create date |
| Dogfooding | **Fail / at-risk.** (1) HN comment **2025-08-15** reported missing social share preview image on their homepage while linking Cyberdesk through opengraph.xyz. (2) As of 2026-07-22, **Twitterbot, LinkedInBot, and facebookexternalhit all receive Vercel Security Checkpoint 429** — social crawlers may not see OG tags at all. Direct `curl` and Jina also 429. Exa could render marketing copy but did not expose a clean `og:*` tag dump. | HN Algolia comment; live crawler fetches (this investigation); curl/Jina 429 |

**Verdict — product reality:** ★★★★☆ as a shipped micro-product; ★☆☆☆☆ as a dogfooded OG showcase (ironic for an OG company).

### 2.2 Traffic & User Estimates

#### Third-party traffic (convergent)

| Source | Monthly visits / users | Notes |
|---|---|---|
| Hypestat aggregation | **~69.1k visits**; SimilarWeb slice **~67.7k**; SEMrush visits **~65.2k** / unique **~37.1k** | Also: ~2.3k daily visitors; desktop ~97.5%; search ~58% of traffic |
| Seller (Yuyu), ~Dec 2023 | **~44k unique visitors**, **~120k pageviews** | First-party Simple Analytics era |
| Advertise page (still live) | **>45k unique visitors**, **>130k pageviews** | Links to Simple Analytics; API now returns subscription-expired / non-public |
| Homepage claim | **“Loved by 100,000+ monthly users”** | **Conflicts** with advertise page and third parties |
| Antonio Schmitter LinkedIn | “bootstrapped … **100K+ monthly users**” | Repeats homepage claim; not independent |

**Cross-check:** Three estimator families (Hypestat/SimilarWeb/SEMrush) + historical first-party numbers all sit in **~35k–70k visits / ~35k–50k uniques**. The **100k** figure is an outlier by ~1.5–3× and is **not** corroborated.

#### Indexed pages & backlinks

| Signal | Value | Sources |
|---|---|---|
| Google index (Hypestat) | ~1,590 pages | Hypestat |
| Bing index (Hypestat) | ~34 pages | Hypestat |
| Backlinks | ~879 links / **214 referring domains** | Hypestat |
| Domain age | Since 2019-11-29; Cloudflare NS; apex → Vercel | WHOIS + dig |

#### Social proof (weak for “big SaaS”)

| Channel | Signal | Sources |
|---|---|---|
| Product Hunt | **No working product/post page found** (403/empty via Exa) | Exa PH URLs |
| Hacker News | **1** story (2021-12-11, 1 point); ~5 comment mentions as a free checker | HN Algolia |
| Indie Hackers | No live product page with revenue | IH fetch |
| LinkedIn company | **2 followers** | LinkedIn HTML scrape |
| GitHub | 0 stars on only public repo | GitHub API |
| WP plugin | **100+ active installs**, **4,621 downloads**, **2 reviews** (5★) | WP.org API + advanced page |
| Chrome Web Store | No official OpenGraph.xyz extension | CWS search |

**WP review integrity flag:** One of two reviews (2024-05-02, launch day) is by **Benjamin Siegal** — the product’s **COO / co-founder** (WordPress handle `arielwli`). That is self-review, not customer proof. The Dec 2025 review by Horacio Stjeward (Key News) looks more like a real publisher customer.

#### Competitive landscape (traffic context)

| Competitor / alternative | Role | Pricing / notes |
|---|---|---|
| metatags.io | Free preview/edit | Direct free competitor to checker |
| Facebook / LinkedIn official debuggers | Free, platform-native | Zero willingness-to-pay |
| `@vercel/og` / Next.js ImageResponse | Free DIY for developers | Kills paid demand among technical users |
| opengraph.io | Link-preview / scrape **API** | Free → $100–$250/mo API plans (different job) |
| Bannerbear / Placid / etc. | General image automation | Broader TAM than OG-only |
| OG Kit (Peter Suhm) | Dynamic OG SaaS | **~$250 MRR, ~40 customers** (founder-disclosed) |
| Linkshot / ogimg.xyz / others | Niche OG generators | Early / small revenue publicly |

OpenGraph.xyz’s **distribution moat is the exact-match domain + SEO for “open graph checker”**, not unique generation tech. Competitors freely clone the checker UX; paid differentiation is automation + WP + agency workflow.

### 2.3 MRR & Revenue Estimation

#### Hard facts

1. **Pre-sale (to ~Dec 2023):** **$0 MRR.** Revenue = BuySellAds **~$120–$150/mo** + sponsored slots. Sale price **$20,000** via Escrow. (Yuyu primary posts on yuurrific.com and Medium/ehandbook — two publications, same author narrative.)
2. **Post-sale billing:** Dashboard JS contains Stripe **`pk_live_51OOPaU…`** → **live mode**, not test. Subscriptions are wired.
3. **No public MRR claim** from Bob/Ariel/Antonio for OpenGraph SaaS (contrast: Bob discloses CloudPDF/Latka history and EmbedPDF sponsorship goals elsewhere).
4. **Customer logos / case studies:** Not found on fetched marketing pages. Social proof = “100k users” copy + sparse WP reviews.
5. **Advertise-with-us page still sells display ads** to the free-tool audience — consistent with traffic-monetization DNA, not “we’re drowning in SaaS ARR.”

#### Bottom-up MRR model

**Assumptions (explicit):**

| Input | Pessimistic | Central | Optimistic |
|---|---|---|---|
| Monthly unique free visitors | 35,000 | 45,000 | 70,000 |
| Register / start trial | 0.3% → 105 | 0.8% → 360 | 1.5% → 1,050 |
| Trial→paid (CC required helps & hurts) | 15% → **16** | 20% → **72** | 25% → **263** |
| Blended ARPU (mix of $29/$59/$199; mostly Starter/Growth) | $40 | $55 | $75 |
| Agency channel bump (WLI clients) | +$0 | +$500–$1,500 | +$3,000 |
| **Implied MRR** | **~$640** | **~$4,000–$5,500** | **~$20k** |

**Reality check against WP installs:** 100+ active installs after >2 years is a **hard ceiling signal**. Even if *every* install were a paid seat at $29, that is only **~$2,900 MRR** from WP — and many installs will be trials, churned, or free-tier leftovers. Non-WP customers exist, but without logos/API testimonials they are unlikely to 10× this.

**Peer check:** OG Kit founder-disclosed **~$250 MRR / 40 customers**. PlanMySaaS category ceiling for OG generators **$3k–$15k MRR**. OpenGraph.xyz has better SEO distribution than most peers, so it can outperform OG Kit — but not escape the category ceiling without enterprise API deals we cannot observe.

| Scenario | Paying accounts | MRR | Confidence |
|---|---|---|---|
| Pessimistic | 15–40 | **$800–$2,000** | Medium |
| **Central** | **40–100** | **$2,500–$5,000** | **Medium** |
| Optimistic | 120–250 | **$8,000–$15,000** | Low |
| Implausible “startup narrative” | 500+ | $30k+ | Rejected |

**Team / LinkedIn:** WITH LOVE INTERNET lists ~8–11 people; OpenGraph About lists **3**. No OpenGraph-specific job postings found. Consistent with **agency side-product**, not a funded growth company.

### 2.4 Founder & Team

| Person | Role (About page) | Verification | Commitment signal |
|---|---|---|---|
| **Bob Singor** | CEO | GitHub `bobsingor`; WLI co-founder/CTO; buyer named “Bob” in Yuyu’s sale post; Dutch entrepreneur (OpenBook B.V.) | **Split focus:** public identity = **EmbedPDF** creator (npm packages with large download counts; GitHub Sponsors goal **$30k/mo**). Also historically CloudPDF (~$42k ARR on Latka). OpenGraph is one of several bets. |
| **Ariel Siegal** = **Benjamin Siegal** | COO | LinkedIn: “COO/Co-Founder @ OpenGraph.xyz”; WLI CEO; WP profile `arielwli`; wrote launch-day plugin review | Marketing/agency operator; “Ariel” appears to be used name / brand identity overlapping Benjamin |
| **Antonio Schmitter** | CTO | GitHub `pinktonio`; LinkedIn CTO @ OpenGraph; WLI senior developer | Engineering lead; repeats 100k-user claim |
| **Adam Diament** | Not on About page | Top contributor to `opengraph-wp` (69 commits); known from Elephone era with Bob/Ariel | Quiet builder; team page incomplete |

**Structure:** Solo? **No.** Small team? **Yes (3 named + agency bench).** Funded startup? **No evidence** of VC; acquisition was a **$20k** bootstrap buyout.

**Last observable product activity:** WP plugin **1.6.0 on 2026-07-21** (day before this report) — **not silent**. Marketing social presence, however, is thin (LinkedIn 2 followers; no strong PH/IH build-in-public trail for the SaaS era).

### 2.5 Activity & Silence Timeline

| Date | Event | Signal |
|---|---|---|
| 2019-11-29 | Domain registered | Birth |
| 2019–2023 | Free checker grows via EMD SEO; ads monetization | Yuyu narrative |
| 2021-12-11 | HN submission (1 point) | Minimal |
| ~Dec 2023 | Sold to Bob for $20k; $0 MRR at sale | Primary source |
| 2024-01-02 | GitHub org + WP repo created | Ownership transfer |
| 2024-05-02 | WP plugin launched; Siegal self-review | SaaS packaging |
| 2024–2026 | Continuous plugin versions through 1.6.0 | Engineering alive |
| 2025-08-15 | HN user notes **missing OG image on opengraph.xyz homepage** | Dogfood fail |
| 2026-07 | Homepage still claims 100k users; advertise page still claims 45k | **Internal contradiction** |
| 2026-07-21 | Plugin update | Recent |

**Silence analysis:** No multi-year dead product. Gap is not “abandoned code” — it is **abandoned transparency / growth narrative**. No Indie Hackers MRR charts, no PH launch splash for the SaaS pivot, no customer logo wall. For a site claiming 100k MAU, that silence is evidence **against** a breakout revenue story.

---

## 3. Phase 2: Market Funnel Analysis

### 3.1 TAM (Top-Down)

| Layer | Estimate | Basis |
|---|---|---|
| Websites (total / active) | ~1.1B / ~200M often cited | Industry ballpark (treat as order-of-magnitude) |
| Web developers worldwide | ~27M (often-cited Stack Overflow / slashdata order) | Order-of-magnitude |
| Marketers / founders who ship web pages | Tens of millions | Broad |
| People who **know** “Open Graph” | **Very small** vs. “website owners” | Niche protocol term; demand concentrated in SEO/dev tools SERP |
| Search demand for checker cluster | **Implied ~50k–200k monthly searches globally** for head + long-tail | Back-solved from #1 site capturing ~35–40k organic visits (Hypestat search share ~58% of ~65k) — **not** Keyword Planner exacts (unavailable here) |

Google Trends / Keyword Planner exact volumes were **not** successfully retrieved (Trends 429; KE requires paid key). Demand inference therefore uses **traffic × SERP share**, which is enough to show the checker market is **real but niche**, not consumer-scale.

### 3.2 Quantified Funnel

| Layer | Population | % of previous | Evidence |
|---|---|---|---|
| Active websites / builders who might care about sharing | ~50M (order-of-mag) | 100% | Broad web economy |
| Know what Open Graph is | ~2–5M | ~5–10% | Devs + SEOs + growth marketers; search niche |
| Actively optimize OG tags | ~200k–800k | ~10–20% of knowers | Most CMS defaults “good enough”; audits show many sites still broken |
| Willing to use a **third-party** tool | ~50k–150k /mo globally | ~15–40% of optimizers | Explains opengraph.xyz + metatags.io + free debuggers traffic combined |
| Willing to **pay** for OG tooling | ~2k–15k | ~3–10% of tool users | DIY free options dominate; OG Kit’s 40 customers as floor anecdote |
| Actually paying **OpenGraph.xyz** | **~40–100 (central)** | ~1–5% of payers | WP installs, pricing, silence, peer MRR |

**Reading:** The free checker sits near the top of a healthy niche funnel. The **paid** product sits at the bottom. Conflating those layers is the core narrative trick.

### 3.3 Who Actually Pays?

**Primary paying personas (most plausible):**

1. **Marketing agencies / WLI-like shops** managing many client sites — maps to Scale $199 and “agency roots” story.
2. **Content-heavy WordPress publishers** (news, resources, listings) — maps to WP plugin + Key News-style review.
3. **Growth marketers** who A/B test link previews via short links.

**“土老板” non-technical owner who cares about previews but can’t code:** Exists, but **weak at scale**. They usually: (a) ignore OG, (b) use Canva once, or (c) rely on CMS/theme defaults. They do **not** search “open graph checker” weekly. Credit-card-gated $29–$59 after a free checker visit is a steep jump for a problem they barely named.

**Technical users:** Default to `@vercel/og`, Cloudinary, or one static PNG. Lowest willingness to pay.

**Counter-argument that survives:** Agency + multi-page automation is a real wedge. It does **not** produce consumer-app MAU; it produces **dozens-to-low-hundreds of seats**.

---

## 4. Phase 3: Falsifiability Framework

| Claim | Source | Confidence now | Falsification condition | Absence / counter-evidence that already hurts it |
|---|---|---|---|---|
| “100,000+ monthly users” | Homepage; Antonio LinkedIn | **Low** | First-party analytics showing ≥100k **unique** humans/mo for 3 consecutive months | Advertise page 45k; Hypestat/SW/SEMrush ~65–70k visits; pre-sale 44k uniques |
| Site is a top OG checker with meaningful SEO traffic | Advertise page; Yuyu; Hypestat | **High** | Rankings collapse for “open graph checker” cluster | Still cited as checker in 2026 guides |
| SaaS has material MRR (e.g. >$20k) | Implied by “100k users” marketing | **Very low** | Stripe dashboard / public IH chart | $20k acquisition at $0 MRR; WP 100+ installs; no logos; founder focus elsewhere |
| Central MRR $2.5k–$5k | This report’s model | **Medium** | Public disclosure outside band | Would be falsified by audited Stripe >$15k or <$500 sustained |
| Team of 3 ships weekly | About page | **Medium-High** | Plugin/changelog freeze >6 months | Plugin updated 2026-07-21 |
| Product dogfoods OG well | Brand expectation | **Low** | Clean `og:*` for socialbots | HN 2025 miss; 2026 socialbots get Vercel 429 |
| Self-review isn’t a customer | WP review by Benjamin Siegal | **High** it is insider | Proof Siegal is unrelated | LinkedIn + WLI identity match |
| Stripe live billing exists | Dashboard JS `pk_live_` | **High** | Key revoked / only test mode | Live key present in register bundles |

---

## 5. Phase 4: Synthesis & Final Verdict

### 5.1 Multi-Dimensional Scoring

| Dimension | Score | Evidence |
|---|---|---|
| Product reality | ★★★★☆ | Real dashboard, pricing, WP, CDN, live Stripe |
| Revenue credibility | ★★☆☆☆ | No disclosure; proxies imply micro-MRR; 100k-user implication is false |
| Team authenticity | ★★★★☆ | Identities verify (Bob, Benjamin/Ariel, Antonio, Adam); agency pedigree real |
| Growth sustainability | ★★★☆☆ | SEO moat durable for free tool; paid conversion structurally capped |
| Narrative water content | ★★★★☆ (high water) | “100k users” vs 45k advertise vs ~65k third-party; self-review; LinkedIn echo |
| Platform risk | ★★★☆☆ | Vercel bot wall may break social crawlers (OG irony); SEO competition rising (many free checkers) |

### 5.2 Final MAU / MRR Estimate

**Define terms:**

- **Site MAU** = monthly unique visitors to the free web property.
- **Product MAU** = monthly active **logged-in** SaaS users.
- **MRR** = recurring subscription revenue (ex-ads).

| Metric | Interval | Confidence |
|---|---|---|
| **Site MAU** | **35,000 – 70,000** (central **~40,000–50,000**) | **~75%** that truth lies in this band |
| **Product MAU (logged-in)** | **200 – 2,000** (central **~400–800**) | **~55%** (wide; weak instrumentation) |
| **Paying customers** | **20 – 120** (central **~50–80**) | **~60%** |
| **MRR** | **$1,000 – $6,000** (central **~$2,500 – $4,000**) | **~60%** |
| Homepage “100k+ monthly users” as SaaS MAU | **Rejected** | **~85%** confidence it is misleading |

Ads/sponsorship on the free tool may still add low hundreds of dollars/month (historical $120–$150), immaterial vs. subscription narrative.

### 5.3 Bullshit Detector

**Single most suspicious metric:** Homepage **“Loved by 100,000+ monthly users.”**

To believe the product’s *apparent* scale as a paid business, a reader must also believe:

1. Free-tool visitors ≈ customers, and  
2. A WordPress plugin with 100+ installs somehow sits beside a nine-or-ten-thousand-customer SaaS, and  
3. Founders who publicly grind EmbedPDF sponsorships are quietly sitting on a large OpenGraph ARR without mentioning it.

**Simplest explanation of the discrepancy:** Exact-match domain SEO built a **popular free checker**. New owners bolted on a **paid automation SaaS** and reused traffic vanity metrics as social proof. The niche pays a little — not a lot. Narrative water comes from **metric category laundering** (visits → “users” → implied revenue).

### 5.4 Counter-Narrative Steelman

**Strongest bull case:**

- Owning #1 for “open graph checker” is a permanent top-of-funnel machine competitors pay for in ads.
- Agencies need programmatic OG for listings/resources; $199 Scale seats + enterprise custom could punch above WP install counts.
- API/CDN usage by sites that never install the WP plugin is invisible to WP.org stats.
- Credit-card trial + AI templates + short-link A/B could lift conversion vs. pure DIY.
- Quiet B2B products often under-index on PH/HN while printing cash.

**Critique — does it survive?**

Partially. The SEO funnel is real; some agency revenue is plausible; API-only customers are a genuine blind spot. It does **not** survive as a path to **$50k+ MRR** without evidence: still no logos, 100+ WP installs, $20k acquisition basis, founder attention elsewhere, and category peers disclosing hundreds—not tens of thousands—of dollars MRR. Invisible API whales are possible but **should not be the base case**.

**Final judgment:** OpenGraph.xyz is a **credible micro-SaaS attached to a strong free SEO property**, not a scaled ARR business. Treat **100k MAU as marketing fiction**; treat **~$3k MRR ± factor of ~2** as the working estimate until Stripe-level evidence appears.

---

## 6. Appendix: Data Sources

Timestamps are investigation day **2026-07-22** unless noted.

### Primary / first-party

| Source | URL / artifact | Used for |
|---|---|---|
| Homepage (Exa render) | https://www.opengraph.xyz | Product claims, 100k users |
| Pricing (Exa) | https://www.opengraph.xyz/pricing | $29/$59/$199 tiers |
| About (Exa) | https://www.opengraph.xyz/about | Team |
| Advertise (Exa) | https://www.opengraph.xyz/advertise-with-us | 45k visitors claim; Simple Analytics link |
| Automated OG / Sharing links (Exa search) | site pages | Feature set, trial terms |
| Dashboard JS | https://dashboard.opengraph.xyz/register bundles | `pk_live_51OOPaU…` Stripe key |
| WHOIS | opengraph.xyz | Created 2019-11-29; updated 2026-06-10 |
| DNS | dig | Cloudflare NS; Vercel DNS |
| WP plugin API | `api.wordpress.org/plugins/info/1.0/opengraph-xyz.json` | installs, downloads, dates, changelog |
| WP advanced page (Exa) | wordpress.org/plugins/opengraph-xyz/advanced/ | 100+ installs, ratings |
| GitHub org/repos/users API | github.com/opengraph-xyz, bobsingor, pinktonio, AdamDiament | OSS footprint, identities |

### Founder / sale narrative

| Source | URL | Used for |
|---|---|---|
| Yuyu sale post | https://www.yuurrific.com/indie-hacking/selling-opengraph (2023-12-27) | $20k sale, 0 MRR, 44k uniques |
| Medium republication | https://ehandbook.com/my-journey-of-building-and-selling-opengraph-xyz-for-20-000-75fc26442948 | Cross-verify sale story |
| WLI about | https://www.withloveinternet.com/about | Bob, Benjamin, Antonio |
| Bob GitHub / EmbedPDF | github.com/bobsingor ; embedpdf.com | Attention allocation |
| Latka CloudPDF | getlatka.com/companies/cloudpdf.io | Bob’s other SaaS scale |

### Traffic / SEO / social

| Source | URL / tool | Used for |
|---|---|---|
| Hypestat | https://hypestat.com/info/opengraph.xyz | SW/SEMrush estimates, backlinks, index |
| HN Algolia | hn.algolia.com API | Mentions; 2025-08-15 dogfood comment |
| LinkedIn company HTML | linkedin.com/company/opengraph-xyz | 2 followers |
| Chrome Web Store search | chromewebstore.google.com | No official extension |
| Competitor pricing | opengraph.io/pricing ; metatags.io ; OG Kit essay | Category comps |

### Failed / blocked attempts (transparency)

| Attempt | Result |
|---|---|
| curl / Jina / Twitterbot / LinkedInBot / facebookexternalhit → opengraph.xyz | **Vercel 429 Security Checkpoint** |
| Wayback CDX / availability API | **429** from this IP |
| Simple Analytics public JSON | Subscription expired / not publicly readable |
| SimilarWeb website HTML + data API | Blocked / empty / 403 |
| Google Trends explore | 429 |
| Product Hunt product URLs | 403 via Exa |
| Exact Keyword Planner / Ahrefs volumes | Not accessible without paid keys |

### Methodology compliance checklist

1. **≥2 sources per major data point** — done for traffic, sale, pricing, team, WP installs; flagged where single-source (Stripe key shape; Hypestat backlink counts).  
2. **Cross-verify rendering** — Exa + curl (+ socialbots) + WP/GitHub APIs; parked-domain risk rejected (consistent product across sources).  
3. **Stars ≠ revenue** — explicitly separated.  
4. **Silence mapped** — timeline in §2.5.  
5. **Uncertainty quantified** — ranges + confidence in §5.2.  
6. **Contradictions preserved** — 100k vs 45k vs ~65k left unresolved in favor of third parties.  
7. **Dogfood test** — executed; result negative / blocked.

---

*End of report.*
