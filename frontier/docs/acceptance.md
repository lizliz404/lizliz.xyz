# Acceptance evidence / next QA

Verified on **2026-11-24, Asia/Shanghai**, in the isolated experiment. **Acceptance remains BLOCKED** on native mobile dismissal and desktop selection/click-through. The executor has not operated or automated a browser. This iteration fixes verified asset lifetime behavior and adds diagnostic evidence; it does **not** claim a new native gesture fix.

## Current t197u visible core-page pass

Official **Geist Serif Regular** replaces the initially requested Geist Sans; Inter covers Latin reading/UI, with main's Chinese fallback policy retained. Canonical Iconoir regular replaces hand-authored/Unicode UI icons. Home hero/gallery, Writing hierarchy, resource grouping and reader composition received a coherent editorial pass. See [actual visible changes and provenance](identity.md).

Type/lint and production build pass; one parent1440/390 visual spotcheck is pending. **Do not resume the diagnostic recheck instructions below**: gesture investigation is paused by user direction, and its known defects are unchanged. Historical full32-test results below are not a newly rerun whole-suite gate.

## Parent real-Chrome results at `60795c8`

Initial desktop1440/mobile390 QA passed filters/search/TOC/save/export/import/skills/language/theme, with zero console errors/warnings **in that initial pass only**. Parent's subsequent native recheck found:

| Contract | Desktop 1440 | Mobile 390×985 |
|---|---|---|
| Outside press beside/below | Pass; focus/scroll restored | **FAIL: stays open**; panel x14,y112.5,347×760 |
| Intro text drag beyond panel | **FAIL: closes and activates underlying Writing/Reading/Skills links** | Pass: stays open |
| Escape and 25 Tabs containment | Pass | Pass |
| Unknown paths: HTTP404, reload, recovery links | Pass | Pass |

That recheck also reported **two strict-MIME stylesheet errors** for `/assets/index-D4JkG4r0.css` after unintended Reading/Skills navigation. Do not carry forward the initial zero-error result as current acceptance.

Evidence: `/workspace/lizliz-frontier-qa/recheck-*`, specifically `recheck-desktop-backdrop-closed-scrolled.webp`, `recheck-desktop-drag-clickthrough.webp`, `recheck-mobile-side-tap-still-open.webp`, `recheck-mobile-below-tap-still-open.webp`, `recheck-mobile-drag-preserved.webp`, and both `recheck-*-404.png`. Initial screenshots and real JSON/Markdown exports remain in that directory.

## Dismissal: failed premise, stronger semantic tests, native evidence still needed

The earlier CSS-layer ordering correction is retained, but **was not a complete fix**. The previous premise—passing jsdom mouse sequences proves native outside gestures—was false. Those tests omitted pointer type and concluding compatibility click and exercised a portal fallback, not actual native top-layer behavior. See [dismissal investigation](debug/dismissal-premise.md).

Canonical [Dialog](https://ui-sdk.dev/docs/solid/components/dialog) and [Popups](https://ui-sdk.dev/docs/solid/popups) documentation, plus installed `@ui-sdk/core` **0.1.0-beta.16** sources, were checked: default modal shielding consumes an outside press; dismissal requires starting and releasing outside; inside→outside text selection stays open. The release uses touch `pointerdown` + a subsequent `click` with a movement threshold; mouse uses pending outside-down then outside-up. No newer registry release was available when checked.

Six new semantic cases use the **real App and SDK**: panel/backdrop non-inert with background nav inert; full touch taps beside/below (including compatibility click cancellation); native-`::backdrop` retarget to a panel outside its bounds; mouse/touch intro-text drag through the concluding click with dialog remaining open and background nav inert. They **pass without another gesture implementation change**, so they do not reproduce or resolve the native failures. A capability shim selects the SDK native branch, but jsdom does not implement native top-layer hit testing, trusted pointer capture, inert hit rejection, native text selection, or link default activation. Background-inert assertions are a semantic safeguard, **not proof of no native click-through**.

No homemade dismissal handler/focus trap or speculative CSS workaround was added. Escape/focus/scroll behavior remains SDK-owned. Opt-in read-only tracing now captures the missing native boundary: trusted pointer types/targets, capture, hit-test stack, native-open state and bounds, inert ancestors, cancellation after the event task, SDK close reason, stylesheet/script URLs and selection length. It stores no selected text, performs no network request, and is disabled without `?traceDialog=1`. Tracing itself adds observation/storage overhead; reproduce once without it if timing changes.

## Stylesheet investigation and verified local correction

Actual preview request to the reported **D4** URL returned **404, text/plain, nosniff**. Current `/reading/` and `/skills/` output instead referenced **`/assets/index-D6g8SyeZ.css`**, which exists. Thus the reported request named an **obsolete build asset**, not the stylesheet URL emitted by the current pages. A missing stylesheet correctly produces a strict-MIME refusal. This does **not** establish whether its old reference came from BFCache, another cached document or an already-open pre-rebuild page; the trace records resource URLs to distinguish the next occurrence.

Vite's default clean build deletes prior hashed assets even while older documents may still reference them. Builds now retain only `dist/assets/`, remove old documents/catalogs/content, then generate fresh HTML. Local preview serves documents as **no-store**, old/current hashed assets with their correct types and immutable cache headers, and missing assets as genuine non-HTML 404s. Serving documents in the preview plugin is necessary: Vite's later index middleware otherwise overwrites an earlier no-store header with no-cache. A regression test performs **two real Vite builds with different CSS**, deletes a stale article, then checks old CSS still returns **200 text/css with the original body**, and fresh document GET/HEAD return **200 no-store**. Existing real-preview tests preserve readable unknown-route HTTP404. Restarted port4179 HTTP evidence is recorded in `debug/preview-http-evidence.json`: root/Reading/Skills200 + no-store with D6 CSS, D6 CSS200 text/css, retained previous main JS200, missing D4 CSS404 text/plain + nosniff, and unknown-route GET/HEAD404.

Previously deleted D4 bytes cannot be recovered by retention. **Hard-reload once** before this recheck to discard pre-retention documents; D4 deliberately remains 404, not a fake CSS200 or HTML fallback. Retained assets accumulate in this local experiment. Do not automatically prune them while old documents may exist; see README. No external hosting/cache/deployment settings changed. Bundle reporting identifies current files from the Vite manifest and lists retained JS separately, avoiding a false current-bundle increase.

## Targeted parent-only native diagnostic recheck

Preview: **http://localhost:4179/**. Use **http://localhost:4179/?traceDialog=1** and hard-reload. Capture each failing gesture separately (reload starts a fresh bounded trace), preserving desktop1440 and mobile390×985:

1. Mobile: open search, tap visible backdrop at approximately **(5,500)** beside, then in a separate run **(190,930)** below. Expected: dismiss, restore focus/scroll, no underlying navigation. If it still fails, that is an open defect, not a successful fix.
2. Desktop: open search, select/drag intro text beyond the panel and release over the underlying navigation. Expected: **stay open, no navigation**. Record whether DevTools touch emulation is enabled; the trace—not the cursor screenshot—must establish `pointerType`.
3. After each attempt, copy the trace from DevTools: `copy(sessionStorage.getItem('liz-frontier-dialog-trace'))`. Save the JSON with the screenshot in the QA evidence directory. It survives an unintended same-tab navigation; a non-tracing destination does not overwrite it. `window.__lizDialogTrace` is also available while still on the traced page. No credentials or external service are involved.
4. After a genuine corrective patch based on that trace, recheck Escape, 25 Tabs/Shift+Tab containment, focus restoration and scrolling on both sizes. These passed `60795c8`, but must not be silently assumed after a gesture fix. Capture actual open/closed states.
5. For CSS, hard-reload `/reading/` and `/skills/`; verify current D6 stylesheet200, no stale D4 request and no console error. A previously loaded document's still-existing hashed CSS must remain200 after a rebuild. Unknown-path behavior already passed native QA; a brief reload/status smoke check suffices after this preview change.

**Needed next evidence:** trusted event traces for mobile outside tap and desktop inside→outside drag. Synthetic tests cannot supply that native evidence under the no-browser-automation constraint. Native acceptance is not complete.

## Earlier implementation gate — before t197u

- `npm run check`: **PASS** — anchored content compilation, strict TypeScript, ESLint including StyleX validation, real production client+SSR build, 32 tests across seven files, static artifact audit.
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

`npm run report:bundle` measures the JavaScript explicitly declared by each generated homepage's script/modulepreload tags, plus CSS, by emitted file byte count and Node zlib gzip. Node version is recorded in bundle-report.json. This is an emitted-byte report, not a timing measurement. Full file list and exclusions are in `bundle-report.json`.

| Static homepage declared bytes | Parallel edition | Next baseline cd2a911 |
|---|---:|---:|
| JS, raw | 335,069 B | 574,375 B |
| JS, gzip per file | 120,118 B | 167,820 B |
| CSS, gzip per file | 5,225 B | 18,589 B |
| HTML, gzip | 7,901 B | 10,243 B |

This is **not a feature-equivalent comparison**, not total downloaded bytes, not an execution-time/paint/interaction benchmark and not proof that Solid causes a given improvement. Parallel home has an image-led static project gallery, no WebGL shader or React marquee, and adds new retrieval/reading-list behavior. Runtime-triggered chunks, fonts, images, search-index fetch and browser CPU are outside this metric. Vite's own gzip display differs slightly because compressor settings differ; this report consistently uses Node zlib for both sides. No reuse of the supplied screenshots' numbers.

## Broader QA reference — initial pass completed; native gesture acceptance blocked

Production preview: **http://localhost:4179/**. The parent used **1440px desktop and 390px mobile** for the initial pass. Retain this as the full checklist; use the focused diagnostic recheck above for the unresolved gestures. No browser automation has been run by the executor.

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
