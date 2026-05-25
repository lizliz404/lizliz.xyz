const encoder = new TextEncoder();
const decoder = new TextDecoder();
const TOKEN_TTL_SECONDS = 15 * 60;

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function base64UrlFromBytes(bytes) {
  let binary = "";
  new Uint8Array(bytes).forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlFromString(value) {
  return base64UrlFromBytes(encoder.encode(value));
}

function base64UrlToBytes(input) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmacSha256(message, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", key, encoder.encode(message));
}

async function signToken(payload, secret) {
  const header = base64UrlFromString(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlFromString(JSON.stringify(payload));
  const signature = base64UrlFromBytes(await hmacSha256(`${header}.${body}`, secret));
  return `${header}.${body}.${signature}`;
}

async function verifyToken(token, secret) {
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) return false;

  const expected = base64UrlFromBytes(await hmacSha256(`${header}.${body}`, secret));
  if (signature !== expected) return false;

  const payload = JSON.parse(decoder.decode(base64UrlToBytes(body)));
  const now = Math.floor(Date.now() / 1000);
  return Boolean(payload.exp && payload.exp > now && payload.scope === "resume:write");
}

function toBase64Utf8(value) {
  let binary = "";
  encoder.encode(value).forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function validateResume(value) {
  if (!value || typeof value !== "object") throw new Error("Resume must be a JSON object");
  if (!value.basics || typeof value.basics.name !== "string" || !value.basics.name.trim()) {
    throw new Error("Resume must include basics.name");
  }
}

async function githubRequest(env, path, init = {}) {
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

async function handleAuth(request, env) {
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);
  if (!env.RESUME_ADMIN_PASSWORD || !env.RESUME_JWT_SECRET) {
    return jsonResponse({ error: "Resume admin environment variables are not configured" }, 500);
  }

  const body = await request.json().catch(() => null);
  if (!body?.password || body.password !== env.RESUME_ADMIN_PASSWORD) {
    return jsonResponse({ error: "Invalid password" }, 401);
  }

  const now = Math.floor(Date.now() / 1000);
  const token = await signToken(
    {
      sub: "resume-admin",
      iat: now,
      exp: now + TOKEN_TTL_SECONDS,
      scope: "resume:write",
    },
    env.RESUME_JWT_SECRET,
  );

  return jsonResponse({ token, expiresIn: TOKEN_TTL_SECONDS });
}

async function handleSave(request, env) {
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const missing = ["RESUME_JWT_SECRET", "GITHUB_PAT", "GITHUB_OWNER", "GITHUB_REPO"].filter((key) => !env[key]);
  if (missing.length) {
    return jsonResponse({ error: `Missing environment variables: ${missing.join(", ")}` }, 500);
  }

  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";
  if (!token || !(await verifyToken(token, env.RESUME_JWT_SECRET))) {
    return jsonResponse({ error: "Invalid or expired token" }, 401);
  }

  try {
    const body = await request.json();
    validateResume(body.resume);

    const owner = env.GITHUB_OWNER;
    const repo = env.GITHUB_REPO;
    const branch = env.GITHUB_BRANCH || "main";
    const resumePath = env.GITHUB_RESUME_PATH || "src/features/resume/resume.json";
    const encodedPath = encodeURIComponent(resumePath).replace(/%2F/g, "/");
    const content = JSON.stringify(body.resume, null, 2) + "\n";

    const current = await githubRequest(env, `/repos/${owner}/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`);
    const result = await githubRequest(env, `/repos/${owner}/${repo}/contents/${encodedPath}`, {
      method: "PUT",
      body: JSON.stringify({
        message: "chore(resume): update structured resume data",
        content: toBase64Utf8(content),
        sha: current.sha,
        branch,
      }),
    });

    return jsonResponse({ ok: true, commit: result.commit, content: result.content });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : "Resume save failed" }, 400);
  }
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/resume-auth") return handleAuth(request, env);
    if (url.pathname === "/api/resume-save") return handleSave(request, env);

    return env.ASSETS.fetch(request);
  },
};

export default worker;
