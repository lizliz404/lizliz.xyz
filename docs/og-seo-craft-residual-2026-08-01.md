# OG / SEO craft residual — 2026-08-01 (PASS 1)

Owner split: Cursor shipped source; Hermes owns commit / push / CF Pages / multi-repo.

## Shipped in lizliz.xyz (PASS 1)

### Skill packs as products
- Landing pages:
  - `/skills/doubao-tts/` → `src/app/skills/doubao-tts/page.tsx`
  - `/skills/geo-job-hunt/` → `src/app/skills/geo-job-hunt/page.tsx`
- Each has: title + 150–160 char description, canonical, robots, full Open Graph + Twitter `summary_large_image`, H1 + value prop + zip contents + download CTA, JSON-LD `SoftwareApplication` + `DownloadAction`
- Zips unchanged: `/doubao-tts-skill.zip`, `/geo-job-hunt.zip`

### Crafted icons (replaced hasty SVGs)
- `public/assets/icons/skills/doubao-tts.svg` — dual speakers + center waveform
- `public/assets/icons/skills/geo-job-hunt.svg` — map pin + radius rings
- Designed for ~20×20 legibility in project cards

### Crafted OG PNGs (1200×630)
Method: hand SVG → `rsvg-convert` (sources in `scripts/og-craft/`)

| Asset | Bytes | Notes |
|---|---|---|
| `public/og/skills/doubao-tts.png` | ~80KB | paper + rust, dual-speaker motif |
| `public/og/skills/geo-job-hunt.png` | ~85KB | paper + pin/radius motif |
| `public/og/pausey.png` | ~83KB | interim host for showcase until pausey deploys |
| Home `public/og-image.png` | left alone | current dark card is coherent; not refreshed |

### Showcase data
- `scripts/fetch-project-previews.cjs` `SKILL_PACKS` now point `url` at landing pages; include `ogImage`
- Pausey fallback `ogImage` → `https://lizliz.xyz/og/pausey.png` (interim)
- Regenerated `src/generated/project-previews.json` (16 entries)

### Portfolio SEO polish
- Homepage keeps solid title/desc/OG/Twitter/canonical; added `ItemList` JSON-LD of showcase projects (landing URLs for skills)
- Root layout already has `Person` + `WebSite` JSON-LD (unchanged)
- Project cards: same-origin skill landings (no `download` attr, keep ↓); external sites still ↗; subtle OG thumbnail strip for site cards with `ogImage`
- Sitemap includes both skill landings

### Pausey (touched outside lizliz, no commit)
- `/home/ubuntu/projects/pausey/public/og-image.png` (1200×630)
- `/home/ubuntu/projects/pausey/index.html` — description + full OG/Twitter meta pointing at `/og-image.png`
- **Not deployed.** Showcase uses lizliz-hosted interim OG until Hermes ships pausey.

### Verification
- PNG dims confirmed 1200×630 via PIL
- `pnpm exec tsc --noEmit`: only stale `.next` noise about missing `src/app/preview/page.js` (unrelated)
- No commit / push / deploy (per job)

## PASS 2+ recommended order (Hermes / multi-repo)

1. **pausey** — commit + push so `https://pausey.lizliz.xyz/og-image.png` goes live; then flip lizliz FALLBACK `ogImage` from `lizliz.xyz/og/pausey.png` → `pausey.lizliz.xyz/og-image.png` (or leave scrape to pick it up)
2. **holopinch** — weak ~9KB OG; redesign 1200×630 card in that repo
3. **lead-radar** — favicon missing (icon falls back to OG); add real favicon/icon
4. **vibe-gba** — screenshot-as-OG → designed card
5. Others only if clearly broken (acriva / reddit-viral / agent-crm audited OK in PASS1 inventory)

## Audit notes (PASS1 live scrape, not redesigned)
- Sites with existing OG left as-is: acriva, reddit-viral, agent-crm, cutting-die, shelfplan, brainrush, pep-words, carver, bitcoin-whitepaper, adventurex-2026
- lead-radar still uses OG as icon (PASS2)
- holopinch OG weak (PASS2)
- vibe-gba screenshot OG (PASS2)

## Hermes checklist
- [ ] Commit + push **lizliz.xyz** (this PASS1 source)
- [ ] Confirm CF Pages preview: skill landings, OG URLs, project cards
- [ ] Commit + push **pausey** OG + meta; verify live `og:image`
- [ ] After pausey live, optionally drop interim `public/og/pausey.png` or keep as CDN mirror
- [ ] Schedule PASS2 for holopinch → lead-radar → vibe-gba
