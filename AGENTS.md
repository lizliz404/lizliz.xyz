# AGENTS.md — lizliz.xyz

This repository is the Next.js personal site for lizliz.xyz. Follow the global agent rules, plus these site-specific rules.

## Article Image Publishing

Article Markdown is rendered by `src/app/articles/[slug]/page.tsx`. JPG/PNG Markdown images are wrapped in a `<picture>` element, and browsers try sibling `.avif` and `.webp` files before falling back to the original image.

When adding article images:

1. Put source images under:

   ```text
   public/images/articles/<article-slug>/<image-name>.png
   ```

2. Reference them in Markdown with absolute site paths:

   ```markdown
   ![Alt text](/images/articles/<article-slug>/<image-name>.png)
   ```

3. Run image optimization before commit:

   ```bash
   node scripts/optimize-images.cjs
   ```

   This generates the `.avif` and `.webp` files the renderer will request.

4. Add stable dimensions to `ARTICLE_IMAGE_SIZES` in `src/app/articles/[slug]/page.tsx` for any new article images.

5. Verify the live deployed URLs after push, not just local files:

   ```bash
   curl -I https://lizliz.xyz/images/articles/<article-slug>/<image-name>.png
   curl -I https://lizliz.xyz/images/articles/<article-slug>/<image-name>.avif
   curl -I https://lizliz.xyz/images/articles/<article-slug>/<image-name>.webp
   ```

Important: `/articles/<slug>/<image-name>.png` is not the default URL for article images. That path only works if a compatibility copy exists under `public/articles/<slug>/`. The canonical path is `/images/articles/<slug>/<image-name>.png`.

A PNG URL returning `200` is not enough proof that the article page image is fixed. Inspect the rendered HTML or verify the `.avif`/`.webp` URLs too, because the browser may request those first.

## Deployment

For this Cloudflare Pages project, deploy by committing and pushing to GitHub. Do not use direct Cloudflare upload unless Liz explicitly asks for that path.
