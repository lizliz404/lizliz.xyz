# Resume GitOps environment variables

Cloudflare Pages Functions power the private resume editor while the Next.js site remains `output: "export"`.

Required production variables:

- `RESUME_ADMIN_PASSWORD`: password for unlocking the editor tab.
- `RESUME_JWT_SECRET`: long random secret for signing short-lived editor JWTs.
- `GITHUB_PAT`: GitHub token with permission to update repository contents. Prefer the narrowest available fine-grained token.
- `GITHUB_OWNER`: `lizliz404` or the actual repository owner.
- `GITHUB_REPO`: `lizliz.xyz`.

Optional:

- `GITHUB_BRANCH`: defaults to `main`.
- `GITHUB_RESUME_PATH`: defaults to `src/features/resume/resume.json`.

Flow:

1. Client opens `/resume`.
2. Rendered and raw JSON tabs read the static JSON bundled at build time.
3. Editor tab posts password to `/api/resume-auth`.
4. Cloudflare Pages Function verifies `RESUME_ADMIN_PASSWORD` and returns a 15-minute HMAC-signed JWT.
5. Save posts JSON + JWT to `/api/resume-save`.
6. Function validates token and minimal JSON shape, then calls GitHub Contents API with `GITHUB_PAT`.
7. GitHub commit updates `src/features/resume/resume.json` and triggers the connected Cloudflare Pages rebuild.
