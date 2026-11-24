import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { flush } from 'solid-js';
import { matchesPrerenderedPage, startPage } from '../src/bootstrap';

describe('static-host fallback initialization', () => {
  it('hydrates matching documents and a true 404 fallback, never home at another URL', () => {
    expect(matchesPrerenderedPage('/articles/', '/articles')).toBe(true);
    expect(matchesPrerenderedPage('/404/', '/this-route-should-not-exist/')).toBe(true);
    expect(matchesPrerenderedPage('/', '/this-route-should-not-exist/')).toBe(false);
    expect(matchesPrerenderedPage('/', '/articles/')).toBe(false);
  });
  it('recovers to readable 404 even when an SPA-only host serves homepage HTML with status 200', async () => {
    const html = await readFile('dist/index.html', 'utf8');
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    document.body.innerHTML = parsed.body.innerHTML;
    document.title = 'LizLiz';
    window.history.replaceState(null, '', '/this-route-should-not-exist/');
    const dispose = await startPage(); flush(); await new Promise(resolve => setTimeout(resolve, 25)); flush();
    expect(document.querySelector('main h1')?.textContent).toBe('这页跑丢了。');
    expect(document.querySelector('#projects')).toBeNull(); expect(document.title).toBe('404 — LizLiz');
    expect(window.location.pathname).toBe('/this-route-should-not-exist/');
    dispose();
  });
});
