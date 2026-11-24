// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, writeFile, readFile, rm, access } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { build, preview } from 'vite';
import { prepareBuild } from '../scripts/build-assets';
import { staticNotFound } from '../scripts/preview-fallback';
describe('cached-document asset lifetime across actual Vite builds', () => {
  it('retains earlier hashed CSS while replacing documents and avoids an HTML/MIME fallback', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'liz-asset-lifetime-'));
    try {
      const out = path.join(root, 'dist');
      await writeFile(path.join(root, 'index.html'), '<!doctype html><link rel="stylesheet" href="/main.css"><h1>First</h1>');
      await writeFile(path.join(root, 'main.css'), 'body { color: red }');
      const buildApp = () => build({ root, configFile: false, logLevel: 'silent', build: { emptyOutDir: false } });
      await prepareBuild(out); await buildApp();
      const first = await readFile(path.join(out, 'index.html'), 'utf8');
      const oldCss = /href="([^"]+\.css)"/.exec(first)?.[1]; if (!oldCss) throw new Error('First build has no CSS');
      await mkdir(path.join(out, 'stale-article')); await writeFile(path.join(out, 'stale-article/index.html'), 'removed');
      await writeFile(path.join(root, 'main.css'), 'body { color: blue }');
      await prepareBuild(out); await buildApp();
      await expect(access(path.join(out, 'stale-article/index.html'))).rejects.toThrow();
      expect(await readFile(path.join(out, 'index.html'), 'utf8')).not.toContain(oldCss);
      const server = await preview({ root, configFile: false, plugins: [staticNotFound()], logLevel: 'silent', preview: { host: '127.0.0.1', port: 0, strictPort: true } });
      try {
        const address = server.httpServer.address(); if (!address || typeof address === 'string') throw new Error('No TCP preview');
        const response = await fetch(`http://127.0.0.1:${address.port}${oldCss}`);
        expect(response.status).toBe(200); expect(response.headers.get('content-type')).toContain('text/css');
        expect(response.headers.get('cache-control')).toContain('immutable'); expect(await response.text()).toContain('red');
        const current = await fetch(`http://127.0.0.1:${address.port}/`);
        expect(current.status).toBe(200); expect(current.headers.get('cache-control')).toBe('no-store');
        expect(await current.text()).not.toContain(oldCss);
        const head = await fetch(`http://127.0.0.1:${address.port}/`, { method: 'HEAD' });
        expect(head.status).toBe(200); expect(head.headers.get('cache-control')).toBe('no-store'); expect(await head.text()).toBe('');
      } finally { await new Promise<void>((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve())); }
    } finally { await rm(root, { recursive: true, force: true }); }
  });
});
