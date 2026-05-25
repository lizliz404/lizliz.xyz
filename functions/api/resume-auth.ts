const encoder = new TextEncoder();
const TOKEN_TTL_SECONDS = 15 * 60;

function base64Url(input: string | ArrayBuffer) {
  const bytes = typeof input === "string" ? encoder.encode(input) : new Uint8Array(input);
  let binary = "";
  bytes.forEach((byte) => {
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

async function signToken(payload: Record<string, unknown>, secret: string) {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64Url(JSON.stringify(payload));
  const signature = base64Url(await hmacSha256(`${header}.${body}`, secret));
  return `${header}.${body}.${signature}`;
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export async function onRequestPost(context: EventContext<Env, string, unknown>) {
  const { RESUME_ADMIN_PASSWORD, RESUME_JWT_SECRET } = context.env;
  if (!RESUME_ADMIN_PASSWORD || !RESUME_JWT_SECRET) {
    return jsonResponse({ error: "Resume admin environment variables are not configured" }, 500);
  }

  const body = await context.request.json().catch(() => null) as { password?: string } | null;
  if (!body?.password || body.password !== RESUME_ADMIN_PASSWORD) {
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
    RESUME_JWT_SECRET,
  );

  return jsonResponse({ token, expiresIn: TOKEN_TTL_SECONDS });
}
