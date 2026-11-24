import { readFile, readdir, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { JSDOM } from 'jsdom';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { z } from 'zod';
async function report(directory: string) {
  const html = await readFile(path.join(directory, 'index.html'));
  const page = new JSDOM(html.toString());
  const scripts = [...new Set(Array.from(page.window.document.querySelectorAll('script[src]:not([nomodule]),link[rel=modulepreload]')).map(el => el.getAttribute('src') ?? el.getAttribute('href')).filter((file): file is string => Boolean(file?.endsWith('.js'))))];
  const css = [...new Set(Array.from(page.window.document.querySelectorAll('link[rel=stylesheet]')).map(el => el.getAttribute('href')).filter((file): file is string => Boolean(file)))];
  const bytes = async (files: string[]) => Promise.all(files.map(async file => { const body = await readFile(path.join(directory, file)); return { file, bytes: body.length, gzipBytes: gzipSync(body).length }; }));
  const jsFiles = await bytes(scripts); const cssFiles = await bytes(css);
  const sum = (files: { bytes: number; gzipBytes: number }[]) => ({ bytes: files.reduce((n, file) => n + file.bytes, 0), gzipBytes: files.reduce((n, file) => n + file.gzipBytes, 0) });
  page.window.close();
  return { html: { bytes: html.length, gzipBytes: gzipSync(html).length }, declaredJs: sum(jsFiles), declaredCss: sum(cssFiles), jsFiles, cssFiles };
}
const manifest = z.record(z.string(), z.object({ file: z.string() })).parse(JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8')));
const currentJs = new Set(Object.values(manifest).map(entry => path.basename(entry.file)).filter(file => file.endsWith('.js')));
const emittedJs = await Promise.all((await readdir('dist/assets')).filter(file => file.endsWith('.js')).map(async file => { const bytes = await readFile(`dist/assets/${file}`); return { file, bytes: bytes.length, gzipBytes: gzipSync(bytes).length }; }));
const artifact = {
  metric: 'Static homepage declared bootstrap assets; gzip per emitted file, Node zlib defaults. Not a browser network trace, timing benchmark, or feature-equivalent comparison.',
  node: process.version, frontier: await report('dist'),
  ...(existsSync('../out/index.html') ? { nextBaseline: await report('../out') } : { baselineNote: 'Run pnpm exec next build in repository root to produce baseline; hooks deliberately omitted.' }),
  allFrontierJs: emittedJs.filter(entry => currentJs.has(entry.file)),
  retainedPreviousBuildJs: emittedJs.filter(entry => !currentJs.has(entry.file)),
  excluded: ['Fonts', 'Images', 'On-demand full-text index', 'User-triggered dynamic chunks', 'JS runtime/paint/interaction latency', 'Automatic baseline lazy chunks not declared in HTML'],
};
await writeFile('docs/bundle-report.json', JSON.stringify(artifact, null, 2) + '\n');
console.info(JSON.stringify(artifact, null, 2));
