import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { catalogSchema, articleSchema, searchIndexSchema, parseRoute, search, filterArticles, exportContext } from '../src/model';
import data from '../src/generated/catalog.json';
import { readFile, readdir } from 'node:fs/promises';
const catalog = catalogSchema.parse(data);
const ids = new Set(catalog.articles.map(article => article.slug));

describe('real catalog contracts', () => {
  it('contains published original content, not filler', () => {
    expect(catalog.articles.length).toBe(44); expect(catalog.projects.filter(p => p.kind === 'site').length).toBe(14); expect(catalog.skills.length).toBe(9);
    expect(ids.size).toBe(catalog.articles.length); expect(catalog.articles.find(a => a.slug === 'agent-loop')?.title).toBe('Prompt 是一句话，Loop 是一个制度');
  });
  it('every article body validates, has unique TOC targets, and no active script', async () => {
    for (const file of (await readdir('public/content')).filter(file => file.endsWith('.json'))) {
      const article = articleSchema.parse(JSON.parse(await readFile(`public/content/${file}`, 'utf8')));
      expect(ids.has(article.slug)).toBe(true);
      expect(article.html).not.toMatch(/<script|<iframe|onerror\s*=|javascript:/i);
      expect(new Set(article.headings.map(h => h.id)).size).toBe(article.headings.length);
      for (const heading of article.headings) expect(article.html).toContain(`id="${heading.id}"`);
    }
  });
  it('only valid page and article routes are accepted', () => {
    expect(parseRoute('/articles/agent-loop/')).toEqual({ kind: 'article', slug: 'agent-loop' });
    expect(parseRoute('/skills')).toEqual({ kind: 'page', view: 'skills' });
    expect(parseRoute('/articles/../../foo')).toEqual({ kind: 'page', view: 'missing' });
    expect(parseRoute('/skills/private')).toEqual({ kind: 'page', view: 'missing' });
  });
});

describe('bounded deterministic multilingual retrieval', () => {
  it('finds Chinese body text and English project names with source links', async () => {
    const docs = searchIndexSchema.parse(JSON.parse(await readFile('public/search-index.json', 'utf8')));
    expect(search(docs, 'Loop')[0]?.href).toBe('/articles/agent-loop/');
    expect(search(docs, 'HoloPinch')[0]?.kind).toBe('project');
    expect(search(docs, '制度').some(hit => hit.id === 'article:agent-loop')).toBe(true);
    expect(search(docs, '豆包').some(hit => hit.kind === 'skill')).toBe(true);
    expect(search(docs, 'this_string_cannot_be_in_the_corpus_0x123456')).toEqual([]);
    expect(search(docs, 'Ｌｏｏｐ')).toEqual(search(docs, 'loop'));
  });
  it('handles adversarial input without regex interpretation or unbounded results', () => {
    fc.assert(fc.property(fc.string({ maxLength: 300 }), query => {
      const docs = catalog.articles.map(article => ({ id: article.slug, kind: 'article' as const, title: article.title, description: article.description, text: '', tags: article.tags, href: `/articles/${article.slug}/` }));
      const found = search(docs, query);
      expect(found.length).toBeLessThanOrEqual(30); expect(search(docs, query)).toEqual(found);
      expect(found.every(hit => ids.has(hit.id))).toBe(true);
    }), { numRuns: 120 });
  });
  it('composes category and text filters rather than silently broadening', () => {
    expect(filterArticles(catalog.articles, '', 'unknown-category')).toEqual([]);
    expect(filterArticles(catalog.articles, 'Loop', '').some(a => a.slug === 'agent-loop')).toBe(true);
    expect(filterArticles(catalog.articles, 'zzzzzzz', '')).toEqual([]);
    expect(filterArticles(catalog.articles, '', '技术').every(a => a.categories.includes('技术'))).toBe(true);
  });
  it('keeps exported context source-grounded', () => {
    const context = exportContext(catalog.articles.filter(a => a.slug === 'agent-loop'));
    expect(context).toContain('https://lizliz.xyz/articles/agent-loop/');
    expect(context).toContain('Prompt 是一句话，Loop 是一个制度');
  });
});
