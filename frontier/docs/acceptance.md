# Acceptance evidence / next QA

Verified on 2026-11-24, Asia/Shanghai, in the isolated worktree. The parent must still do real-browser visual acceptance; no screenshot or native mobile proof is claimed here.

## Executed

- `npm run check`: **PASS** — anchored content compilation, strict TypeScript, ESLint including StyleX validation, real production client+SSR build, 19 tests across three files, static artifact audit.
- **50 prerendered HTML pages**, including all **44** published articles; 14 original project links, nine original downloadable skill packs and template resources. **228 local asset references**, zero missing in artifact audit.
- Tests exercise original content (not filler), Unicode-normalized deterministic title/tag/body retrieval, no-match states, composed saved/category/text filters, bounded adversarial queries, schema/version rejection, JSON import merge, exports with canonical citations, save/remove persistence, cross-tab storage updates, language/theme, Chinese IME and legacy category URLs, real UI SDK accordion and modal search.
- Production HTML hydration test asserts the **same h1 DOM node survives** and that the filter becomes interactive, with no console errors/warnings. The plugin's Vitest test-mode non-hydratable default was diagnosed and explicitly overridden; this test is not just a CSR render of a new tree.
- Agent CLI `search Loop` returns the canonical agent-loop article first and real cited results. `context agent-loop` emits real complete source text plus canonical URL, not a generated paraphrase.
- `npm audit --omit=dev`: zero known runtime vulnerabilities at verification. This is not a security audit.
- Existing Next app: `pnpm exec next build` **PASS** (61 static outputs); `pnpm run typecheck` **PASS**; `pnpm run lint` exits zero with **five existing warnings** in the original application. No content-fetch/prebuild hooks were run for the baseline.
- Original `/workspace/lizliz.xyz` remained on **25700056ec87a8a647869e3ae371c3ef1cd1e49b**. Its three pre-existing modified files have identical before/after SHA-256:
  - github-heatmap.json: `9db69048d6f79681ba7cf91e1389b3eed6b40a1d22727546d7c4130cd6d948b7`
  - llms.txt: `b4a2d730f8cc465b9474f883a66916c19b45d2b4173f588d5d48b85cf80198ec`
  - rss.xml: `822653e2b9e5489347f5d4f9824eb0f71547386103660245d20b57a6cf527ad2`

## Asset measurement (not a speedup claim)

`npm run report:bundle` measures the JavaScript explicitly declared by each generated homepage's script/modulepreload tags, plus CSS, by emitted file byte count and Node zlib gzip. Node 24.22.1; shared box was lightly loaded (~0.24 one-minute load, eight cores). Full file list and exclusions are in `bundle-report.json`.

| Static homepage declared bytes | Parallel edition | Next baseline cd2a911 |
|---|---:|---:|
| JS, raw | 324,619 B | 574,375 B |
| JS, gzip per file | 117,246 B | 167,820 B |
| CSS, gzip per file | 3,986 B | 18,589 B |
| HTML, gzip | 6,818 B | 10,243 B |

This is **not a feature-equivalent comparison**, not total downloaded bytes, not an execution-time/paint/interaction benchmark and not proof that Solid causes a given improvement. Parallel home has a static product grid, no WebGL shader or React marquee, and adds new retrieval/reading-list behavior. Runtime-triggered chunks, fonts, images, search-index fetch and browser CPU are outside this metric. Vite's own gzip display differs slightly because compressor settings differ; this report consistently uses Node zlib for both sides. No reuse of the supplied screenshots' numbers.

## Parent browser QA — required

Production preview: **http://localhost:4179/**. Use **1440px desktop and 390px mobile**, and capture screenshots of initial + opened/toggled states. No browser automation has been run by the executor.

1. Home: warm editorial identity, serif title, two-column desktop / one-column mobile projects, correctly scaled real images, no clipped nav or horizontal overflow. Click a project and return. Scroll Writing/Skills/Templates.
2. `/articles/`: type `Prompt 是一句话`, verify the one article and query URL; category selector; clear; no-match; actual Chinese IME; `/` filter shortcut. Check 390px description/title hierarchy and hit targets.
3. **Search icon and ⌘K/Ctrl+K**: type `制度`, open result; verify UI SDK modal top-layer placement, background inertness, initial input focus, Tab/Shift+Tab containment, Escape/outside-close, focus return and page scroll restoration. Capture open state on both sizes. Test slow/offline index loading and retry.
4. `/articles/agent-loop/`: full original body; TOC jumps; Markdown download; save `+`; related articles. Also open an image-heavy article to check AVIF/WebP/dimensions and table/code overflow.
5. `/reading/`: saved item appears after full document navigation and reload. Export JSON + cited Markdown, remove, re-import, verify merge/dedup and invalid-file message. Confirm download focus and keyboard access to file input. Cross-tab storage event behavior is unit tested; verify actual two tabs if convenient.
6. `/skills/`: open/close Doubao TTS with pointer, Enter and Space; ensure hidden panels leave tab order. Download exact existing zip; capture expanded state. `/templates/`: resource links and zip.
7. Switch English and dark, navigate/reload and back; confirm preferences survive, headings stay darker/stronger than short descriptions, body/links readable. Reduced-motion preference should disable scrolling/transitions.
8. Unknown URL: actual host/preview 404 behavior and readable fallback. All experimental HTML stays noindex. Existing public site must be unchanged.

## Deliberate gaps / not an in-place migration

- No faithful WebGL paper animation, moving project river, hidden interactive résumé UI, GitHub heatmap, podcast player/transcript, workbook or `/share/*` page rewrites. Existing résumé PDF is copied; privacy/terms/RSS link to canonical production, not newly invented pages. These remain in the original app.
- No article translation, model-generated answer, embedding index, account, cloud sync, service-worker/offline app, deployment or production domain switch.
- Original semantic Markdown/GFM is rendered safely, but the original custom `==highlight==` extension is not yet replicated. External embeds/iframes are intentionally stripped instead of trusting arbitrary active content.
- Search uses deterministic weighted substring scoring, not fuzzy segmentation/typo-tolerant/semantic ranking. It loads the whole full-text corpus only when requested; if the catalog grows substantially, revisit index format/worker or compact inverted index with evaluations.
- SDK adapter is beta and compatibility still needs native-browser proof. Current `App.tsx` is the small application's composition boundary; if more specialized routes are migrated, extract route modules before adding cross-route state/frameworks.
- JavaScript is still substantial for a content site. Route/lazy behavioral boundaries and measured browser profiles are the next optimization, not a claim that the stack itself guarantees a light app.

## Remote safety

GitHub's current main has a successful **Cloudflare Pages** check and the regular CI check. Repository workflow has no deployment step, but Pages' production/preview branch controls are external and not readable from the checkout; the deployments API returned no useful branch policy. Thus **do not infer branch-push safety**. This implementation is committed locally only until those controls can be verified; no PR, remote branch, deploy, merge or production change was made.
