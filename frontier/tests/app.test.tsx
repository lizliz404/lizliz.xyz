import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@solidjs/web';
import { flush } from 'solid-js';
import { App } from '../src/App';
import { articleSchema } from '../src/model';
import { readFile } from 'node:fs/promises';
import { File as NodeFile } from 'node:buffer';
let dispose: (() => void) | undefined;
const settle = async () => { flush(); await new Promise(resolve => setTimeout(resolve, 25)); flush(); };
const mount = async (path: string) => {
  const root = document.createElement('div'); document.body.append(root);
  dispose = render(() => <App path={path}/>, root); await settle(); return root;
};
beforeEach(() => { localStorage.clear(); window.history.replaceState(null, '', '/'); });
afterEach(() => { dispose?.(); document.body.replaceChildren(); vi.restoreAllMocks(); });
function clickNamed(root: ParentNode, name: string) {
  const element = Array.from(root.querySelectorAll('button')).find(button => button.getAttribute('aria-label')?.includes(name) || button.textContent?.includes(name));
  expect(element, `button ${name}`).toBeDefined(); element?.click();
}

describe('real Solid 2 DOM flows (jsdom, not a browser)', () => {
  it('renders original home identity, real product links and latest writing', async () => {
    const root = await mount('/');
    expect(root.querySelector('h1')?.textContent).toBe('LizLiz');
    expect(root.querySelectorAll('#projects article').length).toBe(14);
    expect(root.querySelector('a[href="https://holopinch.lizliz.xyz/"]')).not.toBeNull();
    expect(root.textContent).toContain('写东西，做有趣有用的小产品。');
    expect(root.textContent).not.toMatch(/Solid 2|StyleX|UI SDK/);
  });
  it('filters real article metadata, updates shareable URL, and persists saved selection', async () => {
    const root = await mount('/articles/');
    const input = root.querySelector<HTMLInputElement>('main input[type=search]'); expect(input).not.toBeNull();
    if (!input) return; input.value = 'Prompt 是一句话'; input.dispatchEvent(new Event('input', { bubbles: true })); await settle();
    expect(new URLSearchParams(window.location.search).get('q')).toBe('Prompt 是一句话');
    expect(root.querySelectorAll('main ul > li').length).toBe(1);
    expect(root.textContent).toContain('Prompt 是一句话，Loop 是一个制度');
    clickNamed(root, '加入阅读清单'); await settle();
    expect(JSON.parse(localStorage.getItem('liz-frontier-workset-v1') ?? '{}')).toEqual({ version: 1, slugs: ['agent-loop'] });
    expect(root.querySelector('button[aria-pressed=true]')).not.toBeNull();
    clickNamed(root, '移出阅读清单'); await settle();
    expect(JSON.parse(localStorage.getItem('liz-frontier-workset-v1') ?? '{}').slugs).toEqual([]);
    input.value = 'certainly-not-present-xyz'; input.dispatchEvent(new Event('input', { bubbles: true })); await settle();
    expect(root.textContent).toContain('没有匹配的文章');
  });
  it('does not filter intermediate Chinese IME composition, and accepts legacy category links', async () => {
    window.history.replaceState(null, '', '/articles/?c=tech');
    const root = await mount('/articles/');
    const select = root.querySelector<HTMLSelectElement>('main select'); expect(select?.value).toBe('技术');
    const input = root.querySelector<HTMLInputElement>('main input[type=search]'); if (!input) throw new Error('Missing filter');
    input.value = '还在输入'; input.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true })); await settle();
    expect(new URLSearchParams(window.location.search).get('q')).toBeNull();
    input.value = 'Loop'; input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true })); await settle();
    expect(new URLSearchParams(window.location.search).get('q')).toBe('Loop');
    expect(new URLSearchParams(window.location.search).has('c')).toBe(false);
  });
  it('loads saved workset across page mounts and follows another tab storage changes', async () => {
    localStorage.setItem('liz-frontier-workset-v1', JSON.stringify({ version: 1, slugs: ['agent-loop'] }));
    const root = await mount('/reading/');
    expect(root.textContent).toContain('Prompt 是一句话，Loop 是一个制度');
    expect(root.querySelectorAll('main ul > li').length).toBe(1);
    window.dispatchEvent(new StorageEvent('storage', { key: 'liz-frontier-workset-v1', newValue: '{"version":1,"slugs":[]}' })); await settle();
    expect(root.textContent).toContain('把想读的文章放进来');
  });
  it('merges portable imports, skips unknown IDs, and reports malformed imports', async () => {
    const root = await mount('/reading/');
    const input = root.querySelector<HTMLInputElement>('input[type=file]'); if (!input) throw new Error('Missing file import');
    const importFile = async (text: string) => {
      Object.defineProperty(input, 'files', { configurable: true, value: [new NodeFile([text], 'reading.json', { type: 'application/json' })] });
      input.dispatchEvent(new Event('change', { bubbles: true })); await settle();
    };
    await importFile('{"version":1,"slugs":["agent-loop","not-a-real-slug","agent-loop"]}');
    expect(JSON.parse(localStorage.getItem('liz-frontier-workset-v1') ?? '{}').slugs).toEqual(['agent-loop']);
    expect(root.querySelectorAll('main ul > li').length).toBe(1);
    await importFile('{"version":999}');
    expect(root.querySelector('[role=status]')?.textContent).toContain('无法导入');
    expect(JSON.parse(localStorage.getItem('liz-frontier-workset-v1') ?? '{}').slugs).toEqual(['agent-loop']);
  });
  it('switches language and theme with persisted preferences', async () => {
    const root = await mount('/');
    clickNamed(root, 'Switch to English'); await settle(); expect(document.documentElement.lang).toBe('en');
    expect(root.textContent).toContain('I write, and I make things that are interesting and useful.');
    clickNamed(root, 'Switch to dark theme'); await settle();
    expect(document.documentElement.dataset.theme).toBe('dark'); expect(localStorage.getItem('liz-frontier-language')).toBe('en');
  });
  it('uses UI SDK accordion to expose real skill features and downloads', async () => {
    const root = await mount('/skills/');
    const trigger = root.querySelector<HTMLButtonElement>('#doubao-tts button'); expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    trigger?.click(); await settle();
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    const panelId = trigger?.getAttribute('aria-controls'); expect(panelId).toBeTruthy();
    expect(root.querySelector('a[href="/doubao-tts-skill.zip"]')).not.toBeNull();
    trigger?.click(); await settle(); expect(trigger?.getAttribute('aria-expanded')).toBe('false');
  });
  it('renders full article, real TOC and markdown source download', async () => {
    const article = articleSchema.parse(JSON.parse(await readFile('public/content/agent-loop.json', 'utf8')));
    const root = document.createElement('div'); document.body.append(root); dispose = render(() => <App path="/articles/agent-loop/" article={article}/>, root); await settle();
    expect(root.querySelector('h1')?.textContent).toBe(article.title);
    expect(root.querySelector('.prose')?.textContent?.length).toBeGreaterThan(1000);
    expect(root.querySelectorAll('nav[aria-label="文章目录"] a').length).toBeGreaterThan(2);
    expect(root.querySelector('a[download][href="/content/agent-loop.md"]')).not.toBeNull();
  });
  it('opens UI SDK search and retrieves real indexed body text', async () => {
    const documents: unknown = JSON.parse(await readFile('public/search-index.json', 'utf8'));
    // Only the HTTP boundary is replaced; the real generated index and SDK dialog run.
    const request = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(documents), { headers: { 'Content-Type': 'application/json' } }));
    const root = await mount('/');
    clickNamed(root, '搜索全站'); await settle();
    expect(request).toHaveBeenCalledWith('/search-index.json');
    const dialog = document.querySelector('[role=dialog],dialog'); expect(dialog).not.toBeNull();
    const input = dialog?.querySelector<HTMLInputElement>('input[type=search]'); expect(input).not.toBeNull();
    if (!input) return; input.value = '制度'; input.dispatchEvent(new Event('input', { bubbles: true })); await settle();
    expect(dialog?.textContent).toContain('Prompt 是一句话，Loop 是一个制度');
    expect(dialog?.querySelector('a[href="/articles/agent-loop/"]')).not.toBeNull();
    clickNamed(document, '关闭搜索'); await settle();
  });
  it('renders an honest missing-page state', async () => {
    const root = await mount('/missing-route'); expect(root.textContent).toContain('这页跑丢了。');
  });
});
