import { hydrate, render } from '@solidjs/web';
import { App, type AppProps } from './App';
import { articleSchema, parseRoute } from './model';
import { z } from 'zod/mini';

const initialSchema = z.object({ path: z.string(), article: z.optional(articleSchema) });
export function matchesPrerenderedPage(prerenderedPath: string, requestedPath: string): boolean {
  const normalize = (value: string) => value.replace(/\/+$/, '') || '/';
  return normalize(prerenderedPath) === '/404' || normalize(prerenderedPath) === normalize(requestedPath);
}

export async function startPage() {
  const root = document.getElementById('root');
  if (!root) throw new Error('Missing application root');
  const state = document.getElementById('initial-state');
  if (state?.textContent) {
    const raw: unknown = JSON.parse(state.textContent);
    const initial = initialSchema.parse(raw);
    if (matchesPrerenderedPage(initial.path, window.location.pathname)) {
      return hydrate(() => <App {...initial}/>, root);
    }
  }
  const initial: AppProps = { path: window.location.pathname };
  const slug = /^\/articles\/([a-z0-9-]+)\/?$/.exec(initial.path)?.[1];
  if (slug) {
    try {
      const response = await fetch(`/content/${slug}.json`);
      if (response.ok) { const raw: unknown = await response.json(); initial.article = articleSchema.parse(raw); }
    } catch { /* A readable missing-page state remains available. */ }
  }
  // An SPA-only host may rewrite unknown URLs to the prerendered home. Never hydrate that lie.
  root.replaceChildren();
  const route = parseRoute(initial.path);
  if ((route.kind === 'page' && route.view === 'missing') || (route.kind === 'article' && !initial.article)) document.title = '404 — LizLiz';
  else if (initial.article) document.title = `${initial.article.title} — LizLiz`;
  return render(() => <App {...initial}/>, root);
}
