# Architecture / why these choices

## Snapshot before implementation

Baseline: `origin/main` **cd2a911**, Next 16.2.4, React 19.2.4, Tailwind 4, Base UI. The site is already a static export, not a backend service: its product is original writing, shipped products, agent skill packs and reusable templates. Its identity is warm cream paper, burnt orange, Instrument Serif + Lora + Poppins and bilingual interface copy. Content is Markdown and checked-in data, not a CMS that needs replacing.

The parallel app therefore keeps the content repository as the source of truth. It does **not** bolt on Postgres, background jobs, authentication, a token-spending chatbot, or an “AI dashboard” just to look frontier. This is a distinct Vite package with its own JSX compiler and dependencies; Solid JSX is never fed to Next's React compiler.

## Data flow

```text
original Markdown / project-previews / skills / templates / translations / assets
     │ read-only (no network)
     ▼
content compiler: Zod frontmatter → marked → HTML allowlist sanitizer
     ├── typed catalog (metadata only)
     ├── article JSON / raw Markdown / optimized picture sources
     ├── separately loaded full-text search index
     ├── JSON Schemas / agent manifest / SHA-256 source provenance
     ▼
Solid SSR at build time → 50 static HTML pages → Solid 2 hydration
     │
     ├── URL query filters / deterministic multilingual search
     └── versioned browser-only reading workset ↔ JSON / cited Markdown exports
```

Articles aren't bundled into initial JavaScript. Each reader HTML contains its own article; navigation is a **native document navigation**, with normal deep links, reloads, history and back/forward support. An honest MPA is lower risk than inventing a router layer for a content site. Metadata and the small app shell hydrate; body HTML isn't reparsed from Markdown on the client. A whole-site search index is fetched only on opening search and cached in memory for that document. It is not a neural embedding or an LLM pretending to answer.

## Working frontier integrations

| Choice | Actual use | Cost / guardrail |
|---|---|---|
| Solid **2.0.3** + @solidjs/web **2.0.3** | Real DOM rendering, SSR, hydration, signals/memos and two-phase effects | Pin both runtimes; no Solid 1 compatibility assumption. Hydration DOM identity and interactive filter are tested against emitted production HTML. |
| @solidjs/vite-plugin **3.0.1**, Vite **8.3.8** | Hydratable client + SSR compilation via `ssr: true`, without Start/provider hosting | Own tiny entry/prerender boundary; no provider tie-in. Don't accidentally turn hydration off in test mode. |
| UI SDK Solid/Core **0.1.0-beta.16** | Real Button, modal global search, Accordion skill details; not Vercel AI SDK | Both versions pinned. Exclude core from optimizeDeps. Beta APIs may churn. Native top-layer/keyboard/focus correctness still needs actual browser tests. |
| StyleX/runtime + unplugin **0.19.2** | Component designs compiled to emitted atomic CSS; `stylex.attrs` for Solid | Build + ESLint validate definitions; CSS extraction is real. Prose/reset are semantic global CSS, not a second utility framework. No unsupported border shorthands. |
| Zod **Mini** on client | Validated article/index/workset boundaries, shared inferred domain types | Tree-shakeable validator, full Zod only in build/CLI. Own compiled catalog is validated too. No hand-rolled JSON shape guesses. |
| Vitest + jsdom + fast-check | Actual SDK/DOM flows, production hydration, bounded property-based retrieval/workset tests | jsdom lacks layout/WAAPI. Zero-animation and matchMedia shims are explicit; these are **not** native browser animation/focus proofs. |
| Agent-readable execution surface | Same retrieval/domain helpers drive CLI and UI. Read original Markdown, get cited context, structured search results, schemas and source hashes | No keys or autonomous tool execution; content is untrusted data. This supports real agent workflows without adding a deceptive chat UI. |

### What “AI-native” means here

An agent can discover a typed catalog, retrieve with the **same deterministic rules** as the site's full-text search, fetch the complete primary text and source URL, and export context with citations. The author can save a local workset and export it without entrusting browsing history or prose to a model provider. `npm run check` is one executable feedback loop for content integrity, compilation, DOM behavior, hydration and output references, not a prose instruction to “test thoroughly.” Provenance hashes allow an agent to notice source drift.

It **does not mean** the site has an AI assistant, semantic understanding, MCP server, offline application shell, or background sync. JSON contracts are not mislabeled as MCP. Local-first state here means reading-workset persistence only; full offline reading and cross-device synchronization are not implemented.

## Trust / content safety

- Sanitize generated Markdown HTML with an allowlist. Script, iframe, inline handler and dangerous URL schemes are dropped. Images retain dimensions and sibling AVIF/WebP only if files actually exist.
- Import only bounded version-1 reading lists; canonical slugs must exist in the published catalog. Failed persistence is visible and does not discard the in-memory list.
- Export uses canonical source links. Downloaded Markdown/context is data, never a shell prompt or executable tool call.
- Search normalizes Unicode and does no regex interpolation; tokens are ANDed. Sorting is deterministic. Empty/invalid filter states do not silently widen to all content.
- Existing social/project URLs are preserved. No third-party analytics or remote model requests are added. Existing project preview images may make external image requests.

## Portability / rollback

Static HTML/CSS/JS can run on any static host. No deployment file was introduced. The experiment has its own package-lock; the Next package/pnpm lock and production build scripts stay unchanged. Root TS/ESLint receive only package exclusion, not new application behavior. Replacing UI SDK later is localized to this app's component boundary; replacing the renderer would still be a real rewrite, not zero-cost portability.

Stop preview and return to the original worktree to revert the experiment. Before any public preview, inspect external Cloudflare Pages production/preview branch controls. Never infer safety merely because a branch is not named main.

## Primary integration sources (checked 2026-11-24, Asia/Shanghai)

- https://ui-sdk.dev/docs/solid/installation
- https://ui-sdk.dev/docs/solid
- https://github.com/vercel-labs/ui
- Installed SDK's canonical component docs: `node_modules/@ui-sdk/solid/docs/components/{dialog,accordion,button}.md`
- https://github.com/solidjs/solid
- https://www.npmjs.com/package/@solidjs/vite-plugin — manual-entry `ssr: true`, Solid 2 compiler/lifecycle notes
- https://stylexjs.com/docs/learn/installation/
- https://stylexjs.com/docs/learn/installation/vite/
- https://zod.dev/packages/mini
- https://vitest.dev/
- https://fast-check.dev/

Registry releases and installed type/API definitions were verified during implementation; the previous research screenshots were not treated as performance promises.
