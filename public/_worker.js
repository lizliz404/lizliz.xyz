const encoder = new TextEncoder();

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
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
  if (!value.basic_info || typeof value.basic_info.name !== "string" || !value.basic_info.name.trim()) {
    throw new Error("Resume must include basic_info.name");
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

async function handleResumeSave(request, env) {
  if (request.method !== "POST") return jsonResponse({ ok: false, error: "Method not allowed" }, 405);

  if (!env.RESUME_ADMIN_PASSWORD || !env.GITHUB_PAT || !env.GITHUB_REPO) {
    return jsonResponse({ ok: false, error: "Resume GitOps environment is not configured" }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
  }

  if (!body.password || body.password !== env.RESUME_ADMIN_PASSWORD) {
    return jsonResponse({ ok: false, error: "Invalid password" }, 401);
  }

  try {
    validateResume(body.resume);

    const branch = env.GITHUB_BRANCH || "main";
    const resumePath = env.GITHUB_RESUME_PATH || "src/features/resume/resume.json";
    const encodedPath = encodeURIComponent(resumePath).replace(/%2F/g, "/");
    const content = JSON.stringify(body.resume, null, 2) + "\n";

    const current = await githubRequest(env, `/repos/${env.GITHUB_REPO}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`);
    const result = await githubRequest(env, `/repos/${env.GITHUB_REPO}/contents/${encodedPath}`, {
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
    return jsonResponse({ ok: false, error: error instanceof Error ? error.message : "Resume save failed" }, 400);
  }
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/resume-save") return handleResumeSave(request, env);

    return env.ASSETS.fetch(request);
  },
};

export default worker;
