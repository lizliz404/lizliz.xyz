import { readFile, access } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { catalogSchema } from '../src/model';
const catalog = catalogSchema.parse(JSON.parse(await readFile('public/catalog.json', 'utf8')));
const routes = ['', 'articles', 'skills', 'templates', 'reading', '404', ...catalog.articles.map(article => `articles/${article.slug}`)];
let checkedReferences = 0;
for (const route of routes) {
  const html = await readFile(`dist/${route ? `${route}/` : ''}index.html`, 'utf8');
  const page = new JSDOM(html); const doc = page.window.document;
  if (!doc.querySelector('h1')?.textContent || !doc.querySelector('meta[name=robots]')?.getAttribute('content')?.includes('noindex')) throw new Error(`Invalid static page: /${route}`);
  const initial = doc.getElementById('initial-state'); if (!initial?.textContent) throw new Error(`No hydration data: /${route}`);
  JSON.parse(initial.textContent);
  for (const element of Array.from(doc.querySelectorAll('script[src],link[rel=stylesheet],link[rel=modulepreload],img[src],source[srcset],a[download]'))) {
    const reference = element.getAttribute('src') ?? element.getAttribute('href') ?? element.getAttribute('srcset');
    if (!reference || !reference.startsWith('/') || reference.startsWith('//')) continue;
    await access(`dist${reference.split('?')[0]}`); checkedReferences++;
  }
  if (route.startsWith('articles/') && !doc.querySelector('.prose')?.textContent?.trim()) throw new Error(`Empty article: ${route}`);
  page.window.close();
}
await access('dist/agent-manifest.json'); await access('dist/404.html');
console.info(JSON.stringify({ event: 'artifact-audit-passed', routes: routes.length, localAssetReferences: checkedReferences, errors: 0 }));
