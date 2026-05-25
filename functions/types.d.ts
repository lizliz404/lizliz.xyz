type EventContext<Env, Params extends string, Data> = {
  request: Request;
  env: Env;
  params: Record<Params, string>;
  data: Data;
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
  next(input?: Request | string, init?: RequestInit): Promise<Response>;
};

type Env = {
  RESUME_ADMIN_PASSWORD?: string;
  RESUME_JWT_SECRET?: string;
  GITHUB_PAT?: string;
  GITHUB_OWNER?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
  GITHUB_RESUME_PATH?: string;
};
