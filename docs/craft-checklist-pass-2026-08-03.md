# Craft checklist pass — 2026-08-03

Product: **lizliz.xyz** (selective: adventurex-2026 + skill landings)  
Type: **personal site / narrative deck + short skill LPs**  
Starter: 附 A light on skills; fill real gaps on adventurex (site main surfaces already strong)

## Already present

### adventurex-2026
- Top `#progress` bar (pink→lemon→sage)
- One-shot slide reveal (first slide immediate; IO one-shot)
- SVG `feTurbulence` noise (`body::after`)
- `::selection`, smooth scroll, mobile flow layout
- OG + Twitter + JSON-LD
- Chapter dots + custom scrollbar intentionally removed (Liz R2 feedback)

### Skill landings (doubao-tts, geo-job-hunt)
- Site globals: `::selection`, `:focus-visible`, smooth scroll, prm kill on reading progress elsewhere
- OG + Twitter + JSON-LD + download CTA
- Section headings / brand accent tokens

### Out of scope (unchanged)
- Homepage / articles (already strong 附 A / ReadingProgress)
- `content/articles/**`

## Implemented this pass

| Item | Files |
|---|---|
| adventurex: hide progress + skip listener under prm | `public/adventurex-2026/index.html` |
| adventurex: `:focus-visible` keyboard finish | same |
| 附 A light on skills: progress + noise + one-shot reveal | `src/styles/premium-one-pager.css`, `src/lib/premium-one-pager.ts`, `src/components/SkillLandingCraft.tsx`, `src/app/skills/layout.tsx` |
| Brand tokens (terracotta `#b14e22`, not default sage) | `src/styles/premium-one-pager.css` |
| Skip chapter dots (short pages) | `initPremiumOnePager({ enableChapters: false })` |
| Hero LCP static; reveal only on What’s inside / Install | `src/app/skills/doubao-tts/page.tsx`, `src/app/skills/geo-job-hunt/page.tsx` |
| CTA press feedback (≤100ms) + prm off | `.skill-download-cta` in craft CSS + pages |
| Scoped scrollbar / selection under `.skill-landing` (no whole-site restyle) | craft CSS |
| Unmount cleanup for body-mounted progress/noise | `SkillLandingCraft.tsx` |

## Explicitly skipped

- **Chapter dots on adventurex** — previously removed per Liz; do not reintroduce
- **Custom scrollbar on adventurex** — same R2 decision
- **Chapter dots on skills** — &lt;3 meaningful long sections; short LP
- **Homepage / articles restyle** — scope lock; already has ReadingProgress + selection + prm
- **OG regen** — both surfaces already have OG
- Undo / autosave / Cmd+K / labor-illusion loading — wrong product type (static pages)

## Residual P2/P3 (do not implement now)

- Optional shared `data-chapter` rail if adventurex ever restores desktop section nav (would need Liz OK)
- Skill pages: if content grows past ~2 viewports, reconsider chapter rail
- Noise z-index vs TopBar layering polish on skills (currently fixed overlay, pointer-events none)
- adventurex: progress still uses `scrollTop` on `documentElement` — fine for current stack; nested scroller unlikely

## Verify

- `npm run typecheck` — passed after TS/CSS wire
- No commit / push / deploy (per brief)
