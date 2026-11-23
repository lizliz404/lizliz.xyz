import { hydrate, render } from '@solidjs/web';
import { App, type AppProps } from './App';
import { articleSchema } from './model';
import { z } from 'zod/mini';
import './global.css';

const initialSchema = z.object({ path: z.string(), article: z.optional(articleSchema) });
async function start() {
  const root = document.getElementById('root');
  if (!root) throw new Error('Missing application root');
  const state = document.getElementById('initial-state');
  if (state?.textContent) {
    const raw: unknown = JSON.parse(state.textContent);
    const initial = initialSchema.parse(raw);
    hydrate(() => <App {...initial}/>, root);
  } else {
    const initial: AppProps = { path: window.location.pathname };
    const slug = /^\/articles\/([a-z0-9-]+)\/?$/.exec(initial.path)?.[1];
    if (slug) {
      try {
        const response = await fetch(`/content/${slug}.json`);
        if (response.ok) { const raw: unknown = await response.json(); initial.article = articleSchema.parse(raw); }
      } catch { /* A readable missing-page state remains available. */ }
    }
    render(() => <App {...initial}/>, root);
  }
}
void start().catch(error => {
  console.error(JSON.stringify({ event: 'site-start-failed', message: error instanceof Error ? error.message : String(error) }));
  const root = document.getElementById('root');
  if (root && !root.textContent?.trim()) root.textContent = '页面未能载入。请刷新重试，或访问 https://lizliz.xyz';
});
