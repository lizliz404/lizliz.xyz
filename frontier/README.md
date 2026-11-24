# LizLiz / parallel edition

A working, **isolated** Solid 2 + UI SDK + StyleX version of the real personal site. Not a migration of production and not a framework showroom.

## Run

Node **22.12+** (verified with 24.22.1). From this folder:

```sh
npm ci
npm run content        # validate existing repository content, generate assets/catalog
npm run dev            # http://localhost:4179
# OR production HTML + hydration:
npm run build
npm run preview        # http://localhost:4179 (stop dev first)
```

Everything needed by the new build is in this package's own lockfile. The root app remains Next/React; do not install this app's dependencies into root or render Solid components inside Next.

```sh
npm run check          # content → strict TS → ESLint/StyleX → production build → tests → artifact audit
npm run agent -- search "Loop"
npm run agent -- read agent-loop
npm run agent -- context agent-loop productivity-slot-machine
npm run report:bundle  # scoped asset report, optional Next baseline if ../out exists
```

`npm run build` reads tracked content, translations, skill definitions and existing assets from the parent repository; it makes no content-service request. Project previews can load their **existing remote images** in the visitor's browser. No analytics, backend, model endpoint, key or database is needed.

## Current visual pass

The core homepage, project gallery, Writing list and reader now share a calmer editorial hierarchy and spacing. Latin: **Inter** for reading/UI, official **Geist Serif Regular** for display titles—not Geist Sans. Chinese retains main’s role-specific browser/OS fallback policy. Authored UI icons use canonical **Iconoir7.12.2 regular**, matching main’s stroke1.5 and14/16/20px sizes; original artwork stays intact. [Changes, assets and quick visual acceptance](docs/identity.md).

## Use

- Home: real identity, 14 shipped project links and latest writing.
- Writing: all 44 published articles, title/summary/tag search, category filter, shareable `?q=&category=` URLs; legacy `?c=tech` links work too. `/` focuses the filter. Chinese IME commits only at composition end.
- Reader: full original content, stable generated TOC, optimized AVIF/WebP picture sources where available, original links, related writing and raw Markdown download.
- Search icon / **⌘K or Ctrl+K**: UI SDK modal, lazy-loaded full-text index of writing, projects, skills and templates; queries stay in-browser. Explicit loading/error/retry/empty states. Normal Tab navigation for results.
- **+ / −** saves articles to a local reading list. Reading list merges JSON imports, exports portable JSON or source-cited Markdown summaries. No remote write or AI call. Other tabs receive storage updates. Browser storage is optional; exports remain available when persistence fails.
- Skills: nine real downloadable packs, UI SDK accordion, exact existing descriptions. Templates: all original areas, instructions and resource links.
- Chinese/English interface and light/dark preference. Article bodies retain the author's original language; there is no invented translation.

## Safety / deployment

The experiment lives on `experiment/solid2-ui-sdk-stylex`, based on `origin/main` at `cd2a911`. Root production scripts, Next config, hosting configuration and domains are unchanged. Root TS/ESLint only exclude this separately compiled Solid package.

**Do not push/deploy blindly.** The repository uses Cloudflare Pages Git integration, whose production/preview branch settings are external to this checkout. No new production target, Pages project, domain, deploy hook, PR or CI workflow has been created. Local commit/worktree is sufficient for this experiment until hosting branch settings have been checked.

Generated app output is `frontier/dist` and `.ssr` (rebuildable, ignored). Generated content/assets live in `frontier/public` and `src/generated` (ignored); **never run the content compiler against root `public`**. Script paths are anchored to their own file location. Every generated page is `noindex,nofollow`; `_headers` also sets `X-Robots-Tag`. This is defense in depth, **not** deployment authorization or an access-control boundary.

Rebuilds retain prior hashed `dist/assets/` files so an already-open document does not lose its CSS/JS. Old HTML/catalog/content are removed. Preview documents are `no-store`; existing hashed assets are immutable. This is local preview behavior, not a change to external hosting. Retained assets consume disk over repeated builds; only clean the generated output once the preview is stopped and old tabs/documents have been discarded. Previously deleted assets are not recreated: hard-reload once after updating from the pre-retention build. Bundle reports separate retained JS from the current manifest.

To roll back locally, stop the preview and use the original Next worktree. Nothing points production at this build; no merge or production rollback is required.

## Evidence / decisions

- [Architecture and compatibility decisions](docs/architecture.md)
- [Acceptance and parity](docs/acceptance.md)
- [Production asset report](docs/bundle-report.json)
- [Agent instructions](AGENTS.md)

Parent Chrome recheck of `60795c8` passed 404s, desktop outside presses and keyboard containment, but **mobile outside taps and desktop inside→outside drag/click-through remain unresolved**. Two obsolete-CSS MIME errors were also reported; asset retention/fresh document serving is now regression-tested, with native recheck pending. Opt-in `?traceDialog=1` captures read-only local event evidence; see acceptance doc for exact capture steps. Preview serves built `404.html` with status 404; generic SPA-only hosting can recover the visible missing-page state but its HTTP status still requires correct host behavior. No external host configuration was changed.

The jsdom suite proves core DOM behavior and **hydration of real production HTML**. It does **not** prove actual browser layout, native top layer/focus trapping, CPU/paint speed, or mobile touch behavior. Desktop 1440px and mobile 390px browser QA are required before acceptance. This is a usable core-site slice, not a claim of complete URL parity.
