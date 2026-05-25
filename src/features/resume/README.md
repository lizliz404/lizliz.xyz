# Resume GitOps environment variables

Cloudflare Pages `_worker.js` powers the private resume editor while the Next.js site remains `output: "export"`. The worker is stored at `public/_worker.js` so `next build` copies it into `out/_worker.js` for Pages advanced-mode deployment.

Required production variables:

- `RESUME_ADMIN_PASSWORD`: password for unlocking the editor tab.
- `GITHUB_PAT`: GitHub token with permission to update repository contents. Prefer the narrowest available fine-grained token.
- `GITHUB_REPO`: full GitHub repo name, e.g. `lizliz404/lizliz.xyz`.

Optional:

- `GITHUB_BRANCH`: defaults to `main`.
- `GITHUB_RESUME_PATH`: defaults to `src/features/resume/resume.json`.

Flow:

1. Client opens `/resume`.
2. Rendered resume and editor read the static JSON bundled at build time.
3. Hidden editor mode posts password + JSON to `/api/resume-save`.
4. Cloudflare Pages `_worker.js` verifies `RESUME_ADMIN_PASSWORD`, validates minimal JSON shape, then calls GitHub Contents API with `GITHUB_PAT`.
5. GitHub commit updates `src/features/resume/resume.json` and triggers the connected Cloudflare Pages rebuild.
6. The build runs `scripts/generate-resume-pdf.cjs`, producing `public/resume.pdf` from the same JSON source.
7. The visible `Save PDF` button navigates directly to `/resume.pdf`; browser behavior is a normal PDF open/download flow, not `window.print()`.
