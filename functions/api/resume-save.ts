const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlToBytes(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function base64Url(input: ArrayBuffer) {
  let binary = "";
  new Uint8Array(input).forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function hmacSha256(message: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", key, encoder.encode(message));
}

async function verifyToken(token: string, secret: string) {
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) return false;

  const expected = base64Url(await hmacSha256(`${header}.${body}`, secret));
  if (signature !== expected) return false;

  const payload = JSON.parse(decoder.decode(base64UrlToBytes(body))) as { exp?: number; scope?: string };
  const now = Math.floor(Date.now() / 1000);
  return Boolean(payload.exp && payload.exp > now && payload.scope === "resume:write");
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function toBase64Utf8(value: string) {
  let binary = "";
  encoder.encode(value).forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

async function githubRequest(env: Env, path: string, init: RequestInit = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${env.GITHUB_PAT}`,
      "Content-Type": "application/json",
      "User-Agent": "lizliz-resume-gitops",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || `GitHub API failed: ${response.status}`);
  }
  return payload;
}

function validateResume(value: unknown) {
  if (!value || typeof value !== "object") throw new Error("Resume must be a JSON object");
  const resume = value as { basics?: { name?: unknown } };
  if (!resume.basics || typeof resume.basics.name !== "string" || !resume.basics.name.trim()) {
    throw new Error("Resume must include basics.name");
  }
}

export async function onRequestPost(context: EventContext<Env, string, unknown>) {
  const env = context.env;
  const missing = [
    "RESUME_JWT_SECRET",
    "GITHUB_PAT",
    "GITHUB_OWNER",
    "GITHUB_REPO",
  ].filter((key) => !env[key as keyof Env]);
  if (missing.length) {
    return jsonResponse({ error: `Missing environment variables: ${missing.join(", ")}` }, 500);
  }

  const auth = context.request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";
  if (!token || !(await verifyToken(token, env.RESUME_JWT_SECRET!))) {
    return jsonResponse({ error: "Invalid or expired token" }, 401);
  }

  try {
    const body = await context.request.json() as { resume?: unknown };
    validateResume(body.resume);

    const owner = env.GITHUB_OWNER!;
    const repo = env.GITHUB_REPO!;
    const branch = env.GITHUB_BRANCH || "main";
    const resumePath = env.GITHUB_RESUME_PATH || "src/features/resume/resume.json";
    const content = JSON.stringify(body.resume, null, 2) + "\n";

    const current = await githubRequest(
      env,
      `/repos/${owner}/${repo}/contents/${encodeURIComponent(resumePath).replace(/%2F/g, "/")}?ref=${encodeURIComponent(branch)}`,
    ) as { sha: string };

    const result = await githubRequest(
      env,
      `/repos/${owner}/${repo}/contents/${encodeURIComponent(resumePath).replace(/%2F/g, "/")}`,
      {
        method: "PUT",
        body: JSON.stringify({
          message: "chore(resume): update structured resume data",
          content: toBase64Utf8(content),
          sha: current.sha,
          branch,
        }),
      },
    );

    return jsonResponse({ ok: true, commit: result.commit, content: result.content });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : "Resume save failed" }, 400);
  }
}
