import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { articleSchema, catalogSchema, type Article } from '../src/model';
const catalog = catalogSchema.parse(JSON.parse(await readFile('src/generated/catalog.json', 'utf8')));
const template = await readFile('dist/index.html', 'utf8');
const { renderPage }: typeof import('../src/entry-server') = await import(pathToFileURL(path.resolve('.ssr/entry-server.js')).href);
const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const routes = ['/', '/articles/', '/skills/', '/templates/', '/404/', ...catalog.articles.map(article => `/articles/${article.slug}/`)];
for (const route of routes) {
  const slug = /^\/articles\/([a-z0-9-]+)\/$/.exec(route)?.[1];
  const article: Article | undefined = slug ? articleSchema.parse(JSON.parse(await readFile(`public/content/${slug}.json`, 'utf8'))) : undefined;
  const initial = { path: route, ...(article ? { article } : {}) };
  const { html, hydration } = renderPage(initial);
  const title = article ? `${article.title} — LizLiz` : route === '/' ? 'LizLiz' : `${({ '/articles/': '写作', '/skills/': 'Skills', '/templates/': '设计模板' })[route] ?? '404'} — LizLiz`;
  const state = `<script type="application/json" id="initial-state">${JSON.stringify(initial).replaceAll('<', '\\u003c')}</script>`;
  const result = template.replace('<!--app-->', html).replace('<!--state-->', state).replace('</head>', `${hydration}</head>`).replace('<title>LizLiz</title>', `<title>${escape(title)}</title>`);
  const directory = path.join('dist', route);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), result);
  if (route === '/404/') await writeFile('dist/404.html', result);
}
console.info(JSON.stringify({ event: 'prerender-complete', routes: routes.length }));
