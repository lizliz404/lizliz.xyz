import { afterEach, describe, expect, it, vi } from 'vitest';
import { hydrate } from '@solidjs/web';
import { flush } from 'solid-js';
import { readFile } from 'node:fs/promises';
import { App } from '../src/App';
let dispose: (() => void) | undefined;
afterEach(() => { dispose?.(); vi.restoreAllMocks(); document.body.replaceChildren(); });
describe('production static HTML → Solid 2 hydration', () => {
  it('claims existing markup and makes it interactive without replacing the page', async () => {
    const errors = vi.spyOn(console, 'error'); const warnings = vi.spyOn(console, 'warn');
    const html = await readFile('dist/articles/index.html', 'utf8');
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    document.body.innerHTML = parsed.body.innerHTML;
    for (const script of Array.from(parsed.querySelectorAll('script:not([src])'))) {
      if (script.textContent?.includes('_$HY')) window.eval(script.textContent);
    }
    const root = document.getElementById('root'); if (!root) throw new Error('Missing prerendered root');
    const originalHeading = root.querySelector('h1');
    dispose = hydrate(() => <App path="/articles/"/>, root);
    flush(); await new Promise(resolve => setTimeout(resolve, 80)); flush();
    expect(root.querySelector('h1')).toBe(originalHeading);
    const input = root.querySelector<HTMLInputElement>('main input[type=search]'); if (!input) throw new Error('Missing hydrated filter');
    input.value = 'Prompt 是一句话'; input.dispatchEvent(new Event('input', { bubbles: true }));
    flush(); await new Promise(resolve => setTimeout(resolve, 30)); flush();
    expect(root.querySelectorAll('main ul > li').length).toBe(1);
    expect(errors).not.toHaveBeenCalled(); expect(warnings).not.toHaveBeenCalled();
  });
});
