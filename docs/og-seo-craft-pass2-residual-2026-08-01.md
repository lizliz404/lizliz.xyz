# OG / SEO craft residual — 2026-08-01 (PASS 2)

Owner split: Cursor shipped source; Hermes owns commit / push / CF Pages Git per repo.

Continues PASS 1 (`docs/og-seo-craft-residual-2026-08-01.md`).

## Done in source (no commit/push)

### 1) holopinch — `/home/ubuntu/projects/holopinch`
| Item | Path / note |
|---|---|
| OG PNG | `public/og.png` 1200×630 (~136KB) — hands + crystal-bar; replaces ~9KB logo card |
| SVG source | `scripts/og-craft/holopinch-og.svg` |
| Meta | `index.html` — absolute og/twitter image + width/height/type/alt + og:url/site_name |
| Residual | `docs/og-seo-craft-pass2-2026-08-01.md` |

### 2) lead-radar — `/home/ubuntu/projects/lead-radar`
| Item | Path / note |
|---|---|
| Favicon | `web/public/favicon.svg` (+ `favicon-32.png`, `favicon.ico`, `apple-touch-icon.png`) |
| Icons meta | `web/app/layout.tsx` `metadata.icons` |
| OG | Kept existing strong `web/public/og-image.png` (1200×630 editorial) |
| JSON-LD | `web/app/page.tsx` SoftwareApplication + url/image/author |
| Residual | `docs/og-seo-craft-pass2-2026-08-01.md` |

### 3) vibe-gba — `/home/ubuntu/projects/vibe-gba`
| Item | Path / note |
|---|---|
| OG PNG | `site/og-image.png` 1200×630 (~158KB) designed card (not gameplay screenshot) |
| SVG source | `scripts/og-craft/vibe-gba-og.svg` |
| Meta | `site/index.html` — full OG/Twitter/canonical/robots + ROM disclaimer in descriptions |
| Favicon (bonus) | `site/favicon.svg` + `favicon-32.png` |
| Residual | `docs/og-seo-craft-pass2-2026-08-01.md` |

## Method
Hand-authored SVG → `rsvg-convert -w 1200 -h 630` → PNG (same as PASS 1). Fonts: Liberation Sans/Mono via system.

## Hermes checklist
- [ ] Commit + push **holopinch**; confirm `https://holopinch.lizliz.xyz/og.png` 1200×630
- [ ] Commit + push **lead-radar**; confirm favicon + OG live
- [ ] Commit + push **vibe-gba**; confirm `https://vibe-gba.lizliz.xyz/og-image.png`
- [ ] After lead-radar live: optionally flip lizliz `fetch-project-previews.cjs` FALLBACK `iconUrl` from `og-image.png` → `favicon.svg`
- [ ] After vibe-gba live: scrape/FALLBACK will pick new OG (and favicon)
- [ ] Still pending from PASS 1: **pausey** ship → then flip lizliz FALLBACK ogImage to `https://pausey.lizliz.xyz/og-image.png`

## Verify commands
```bash
# dims
python3 -c "from PIL import Image; print(Image.open('public/og.png').size)"  # in holopinch
python3 -c "from PIL import Image; print(Image.open('web/public/og-image.png').size)"  # lead-radar
python3 -c "from PIL import Image; print(Image.open('site/og-image.png').size)"  # vibe-gba

# live heads (post-deploy)
curl -sI https://holopinch.lizliz.xyz/og.png | head
curl -sI https://lead-radar.lizliz.xyz/favicon.svg | head
curl -sI https://vibe-gba.lizliz.xyz/og-image.png | head
```

## Not done (by design)
- No commit / push / wrangler / Direct Upload
- No lizliz showcase FALLBACK edits (optional after deploys)
- lead-radar OG not redesigned (already strong)
