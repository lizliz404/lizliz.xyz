// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { preview, type PreviewServer } from 'vite';
import { readFile, readdir } from 'node:fs/promises';
let server: PreviewServer;
let origin: string;
beforeAll(async () => {
  server = await preview({ root: process.cwd(), logLevel: 'silent', preview: { host: '127.0.0.1', port: 0, strictPort: true } });
  const address = server.httpServer.address();
  if (!address || typeof address === 'string') throw new Error('Preview server did not bind a TCP port');
  origin = `http://127.0.0.1:${address.port}`;
});
afterAll(async () => { if (server) await new Promise<void>((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve())); });

describe('built static host behavior', () => {
  it('returns readable HTML with HTTP 404 for unknown routes rather than home', async () => {
    for (const route of ['/this-route-should-not-exist/', '/articles/not-a-real-post/', '/unknown.html']) {
      const response = await fetch(origin + route, { headers: { Accept: 'text/html' } });
      expect(response.status, route).toBe(404);
      const html = await response.text();
      expect(html).toContain('这页跑丢了。'); expect(html).toContain('404 — LizLiz');
      expect(html).not.toContain('id="projects"');
      expect(response.headers.get('x-robots-tag')).toContain('noindex');
    }
    const head = await fetch(origin + '/missing/', { method: 'HEAD' });
    expect(head.status).toBe(404); expect(await head.text()).toBe('');
  });
  it('keeps existing documents and assets available, and missing JS non-HTML', async () => {
    for (const route of ['/', '/articles/agent-loop/', '/skills/', '/catalog.json']) expect((await fetch(origin + route)).status, route).toBe(200);
    const missing = await fetch(origin + '/assets/not-present.js');
    expect(missing.status).toBe(404); expect(missing.headers.get('content-type')).not.toContain('text/html');
  });
  it('puts SDK reset styles below app atomic layers even when SDK injects styles at open time', async () => {
    const files = (await readdir('dist/assets')).filter(file => file.endsWith('.css'));
    const css = (await Promise.all(files.map(file => readFile(`dist/assets/${file}`, 'utf8')))).join('\n');
    expect(css.indexOf('@layer ui-sdk')).toBeGreaterThanOrEqual(0);
    expect(css.indexOf('@layer ui-sdk')).toBeLessThan(css.indexOf('@layer priority1'));
  });
});
