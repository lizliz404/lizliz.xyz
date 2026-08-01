# OG craft sources (PASS 1)

Method: hand-authored SVG cards → `rsvg-convert -w 1200 -h 630` → PNG.

- `doubao-tts-og.svg` → `public/og/skills/doubao-tts.png`
- `geo-job-hunt-og.svg` → `public/og/skills/geo-job-hunt.png`

Paper system: cream `#FAF9F5`, ink `#141413`, rust `#B14E22`, Liberation Serif/Sans (+ Noto CJK for secondary line).

Re-rasterize:

```bash
rsvg-convert -w 1200 -h 630 scripts/og-craft/doubao-tts-og.svg -o public/og/skills/doubao-tts.png
rsvg-convert -w 1200 -h 630 scripts/og-craft/geo-job-hunt-og.svg -o public/og/skills/geo-job-hunt.png
```
