# Visible core-page pass — t196u / corrected by t197u

## What changed for readers

- Homepage: a real editorial hero with the existing intro and separate Hangzhou/Now note; shared alignment and a stronger primary Writing action. No added slogan, metric, badge or feature.
- Projects: larger two-column desktop / one-column mobile image-led figures, complete uncropped original previews, quieter unboxed captions, stronger titles and more space between projects. All original links remain.
- Writing: larger darker article titles, aligned dates, quieter summaries, clearer filter grouping and more generous row rhythm. Skills/Templates form a distinct, aligned resource pair rather than another repeated card grid.
- Reader: a720px reading column, clearer title/metadata/actions hierarchy, darker body copy, more paragraph/heading space, and a quiet side-rule TOC instead of a heavy box. Main's warm paper/ink/accent palette remains.
- Controls: consistent compact Inter labels, a clear primary action, calmer borders and canonical Iconoir affordances. No UI behavior or route/state architecture changed.

## Correct font decision: Inter + Geist Serif, NOT Geist Sans

**Geist Serif exists officially.** Vercel describes it as a high-contrast display serif. Source: https://vercel.com/font and https://github.com/vercel/geist-font/releases/tag/v1.9.2 . It is not yet on Google Fonts. The committed46,904-byte `GeistSerif-Regular.woff2` is extracted from the official `geist@1.9.2` npm release. Regular is real weight400; do not pretend it has a weight axis or synthesize a bold serif. The variable Serif file varies shape (ELSH), not weight.

- Inter: Latin body/reading and UI/navigation/button/section labels; official Google Fonts normal+genuine italic variable100–900 Latin/Latin-ext subsets.
- Geist Serif Regular: Latin wordmark, hero/page/reader display titles at400 with font synthesis disabled. No decorative heart/triangle variants and no Geist Sans face or family assignment remains.
- Chinese: main ordinary pages have no downloaded Chinese font. Their `next/font/local` Latin faces fall through role-specific local Arial faces to browser/OS glyph fallback. That policy is retained—not replaced with Noto/Songti/Georgia or a new CJK webfont. Fallback aliases copy the existing generated main CSS metrics: body95.74/26.08/0/105.08%; UI92.83/30.94/8.84/113.11%; display128.92/40.37/0/76.79% (ascent/descent/gap/size). Reader title retains the body fallback lineage. Main's unrelated `/share` stack is not imported.
- Actual Chinese glyph choice remains browser/OS-dependent as on main; same-browser comparison is a visual acceptance item, not something jsdom proves.

Assets/provenance/SHA256: `assets/fonts/sources.json`. Five self-hosted WOFF2 files,479,336 bytes total including optional Latin-ext/italic subsets; this is disk size, not a measured page download. Both licenses are SIL OFL1.1, served with the fonts. Builds/runtime make no Google font request; no font package/runtime dependency was added.

## Iconoir identity restored

Read original site migration `df6bad29c94151af0d0d39d322f543218f28f78c` and `src/lib/icons.ts`: Iconoir7.12.2 **regular**, stroke1.5/currentColor, viewBox24, sizes14/16/20px. Canonical SVGs are vendored with their MIT license and source/output hashes in `assets/iconoir/`. Ten are direct serializations of the already-used canonical package; ArrowRight is the same tagged upstream SVG. Artwork/paths are not hand-drawn. No React or incompatible icon adapter enters the Solid runtime.

Authored interface mapping: Search/Xmark20; Translate20; HalfMoon/SunLight20; Plus/Minus16 for save state; OpenInWindow16 for external links; ArrowRight16 for internal navigation; Download16; NavArrowDown16 for disclosure/category selection. WebKit's existing search-clear action uses canonical Xmark as its mask. Accessible labels/pressed state remain. Skill/project artwork, logos and favicons are unchanged; original article text and browser-owned media controls are not redrawn.

## Acceptance boundaries

Focused type/lint and production client+SSR build pass. Identity regression checks only; no new modal investigation, benchmark, refactor or broad debugging cycle. Earlier native mobile dismissal and desktop drag/click-through defects are unchanged and paused by user direction.

Parent's one visual pass: hard-reload4179 at1440/390, review home hero + two project rows, Writing filters/rows, one article (title/body/bold/italic/TOC), expanded Skills, language/theme and icon consistency. Check Inter and Geist Serif load from same-origin URLs; compare Chinese with main in the same browser. Executor has not operated/automated a browser or claimed visual acceptance.
