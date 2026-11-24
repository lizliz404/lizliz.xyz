import { z } from 'zod/mini';

const date = z.string().check(z.regex(/^\d{4}-\d{2}-\d{2}$/));
export const articleMetaSchema = z.object({
  slug: z.string().check(z.regex(/^[a-z0-9-]+$/)), title: z.string().check(z.minLength(1)),
  description: z.string(), publishedDate: date, updatedDate: date,
  tags: z.array(z.string()), categories: z.array(z.string()), minutes: z.number().check(z.int(), z.positive()),
});
export const articleSchema = z.extend(articleMetaSchema, {
  html: z.string(), headings: z.array(z.object({ id: z.string(), text: z.string(), depth: z.number() })),
});
export const projectSchema = z.object({
  title: z.string(), url: z.url(), description: z.string(), iconUrl: z.string(), ogImage: z.optional(z.string()),
  kind: z._default(z.enum(['site', 'skill', 'templates']), 'site'),
});
const feature = z.object({ label: z.optional(z.string()), text: z.string() });
export const skillSchema = z.object({
  slug: z.string(), name: z.string(), tagline: z.string(), taglineZh: z.string(),
  features: z.array(feature), featuresZh: z.array(feature), iconUrl: z.string(), repoUrl: z.string(),
});
export const templatesSchema = z.object({
  name: z.string(), nameZh: z.string(), tagline: z.string(), taglineZh: z.string(), iconUrl: z.string(), repoUrl: z.string(),
  howto: z.array(z.string()), howtoZh: z.array(z.string()),
  areas: z.array(z.object({ name: z.string(), nameZh: z.string(), blurb: z.string(), blurbZh: z.string(), items: z.array(feature), itemsZh: z.array(feature) })),
});
export const catalogSchema = z.object({
  articles: z.array(articleMetaSchema), projects: z.array(projectSchema), skills: z.array(skillSchema),
  templates: templatesSchema,
});
export const searchDocumentSchema = z.object({
  id: z.string(), kind: z.enum(['article', 'project', 'skill', 'template']), title: z.string(),
  description: z.string(), href: z.string(), text: z.string(), tags: z.array(z.string()),
});
export const searchIndexSchema = z.array(searchDocumentSchema);
export type ArticleMeta = z.infer<typeof articleMetaSchema>;
export type Article = z.infer<typeof articleSchema>;
export type Catalog = z.infer<typeof catalogSchema>;
export type SearchDocument = z.infer<typeof searchDocumentSchema>;
export type Language = 'zh' | 'en';
export type View = 'home' | 'articles' | 'skills' | 'templates' | 'missing';
export type Route = { kind: 'page'; view: View } | { kind: 'article'; slug: string };
export function parseRoute(path: string): Route {
  const segments = path.split('/').filter(Boolean);
  if (segments[0] === 'articles' && segments.length === 2 && /^[a-z0-9-]+$/.test(segments[1] ?? '')) {
    return { kind: 'article', slug: segments[1] ?? '' };
  }
  const first = segments[0] ?? '';
  const view = first === '' ? 'home' : first === 'articles' || first === 'skills' || first === 'templates' ? first : 'missing';
  return { kind: 'page', view: segments.length > 1 ? 'missing' : view };
}
export const sourceUrl = (slug: string) => `https://lizliz.xyz/articles/${slug}/`;
export function normalize(text: string) { return text.normalize('NFKC').toLocaleLowerCase().trim(); }
export function search(documents: SearchDocument[], query: string): SearchDocument[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return documents.slice(0, 12);
  return documents.map((document, index) => {
    const title = normalize(document.title), description = normalize(document.description), tags = normalize(document.tags.join(' '));
    const body = normalize(document.text);
    if (!terms.every(term => `${title} ${description} ${tags} ${body}`.includes(term))) return { document, index, score: -1 };
    const score = terms.reduce((total, term) => total + (title.includes(term) ? 12 : 0) + (tags.includes(term) ? 6 : 0) + (description.includes(term) ? 3 : 0) + (body.includes(term) ? 1 : 0), 0);
    return { document, index, score };
  }).filter(hit => hit.score > 0).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 30).map(hit => hit.document);
}
export function filterArticles(articles: ArticleMeta[], query: string, category: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return articles.filter(article => (!category || article.categories.includes(category) || article.tags.includes(category)) && terms.every(term => normalize(`${article.title} ${article.description} ${article.tags.join(' ')}`).includes(term)));
}
export function exportContext(articles: ArticleMeta[]): string {
  return ['# LizLiz — reading context', '', ...articles.flatMap(article => [
    `## ${article.title}`, `Source: ${sourceUrl(article.slug)}`, `Published: ${article.publishedDate}`, `Tags: ${article.tags.join(', ')}`, '', article.description, '',
  ])].join('\n');
}
