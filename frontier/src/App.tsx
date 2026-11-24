import { createEffect, createMemo, createSignal, For, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@ui-sdk/solid/button';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from '@ui-sdk/solid/accordion';
import { Dialog, DialogBackdrop, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@ui-sdk/solid/dialog';
import catalogData from './generated/catalog.json';
import en from '../../src/i18n/en';
import zh from '../../src/i18n/zh';
import { catalogSchema, filterArticles, parseRoute, readWorkset, search, searchIndexSchema, sourceUrl, exportContext, type Article, type ArticleMeta, type Language, type SearchDocument } from './model';
import { s } from './styles';
import { installDialogTrace, traceDialogChange } from './dialog-trace';

export interface AppProps { path: string; article?: Article }
const catalog = catalogSchema.parse(catalogData);
const allowed = new Set(catalog.articles.map(a => a.slug));
const worksetKey = 'liz-frontier-workset-v1';
function download(filename: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Section(props: { title: string; description?: string; href?: string; more?: string; children: JSX.Element; id?: string }) {
  return <section id={props.id} {...stylex.attrs(s.section)}><div {...stylex.attrs(s.sectionHead)}><div><h2 {...stylex.attrs(s.heading)}>{props.title}</h2><Show when={props.description}><p {...stylex.attrs(s.description)}>{props.description}</p></Show></div><Show when={props.href}><a href={props.href} {...stylex.attrs(s.small, s.noWrap)}>{props.more} ↗</a></Show></div>{props.children}</section>;
}

export function App(props: AppProps) {
  const route = parseRoute(props.path);
  const [language, setLanguage] = createSignal<Language>('zh');
  const [theme, setTheme] = createSignal<'light' | 'dark'>('light');
  const [saved, setSaved] = createSignal<string[]>([]);
  const [notice, setNotice] = createSignal('');
  const [query, setQuery] = createSignal('');
  const [category, setCategory] = createSignal('');
  const [searchQuery, setSearchQuery] = createSignal('');
  type IndexState = { kind: 'idle' } | { kind: 'loading' } | { kind: 'ready'; documents: SearchDocument[] } | { kind: 'error' };
  const [index, setIndex] = createSignal<IndexState>({ kind: 'idle' });
  const [searchOpen, setSearchOpen] = createSignal(false);
  let filterInput: HTMLInputElement | undefined;
  const t = () => language() === 'zh' ? zh : en;
  const isZh = () => language() === 'zh';
  const say = (chinese: string, english: string) => isZh() ? chinese : english;
  const savedSet = createMemo(() => new Set(saved()));
  const isReading = route.kind === 'page' && route.view === 'reading';
  const active = route.kind === 'article' ? 'articles' : route.view;
  const filtered = createMemo(() => filterArticles(catalog.articles, query(), category(), isReading ? savedSet() : undefined));
  const categories = [...new Set(catalog.articles.flatMap(article => article.categories))].sort();
  const selected = createMemo(() => catalog.articles.filter(article => savedSet().has(article.slug)));
  const hits = createMemo(() => { const value = index(); return value.kind === 'ready' ? search(value.documents, searchQuery()) : []; });

  createEffect(() => true, () => {
    try {
      setSaved(readWorkset(localStorage.getItem(worksetKey), allowed));
      const storedLanguage = localStorage.getItem('liz-frontier-language');
      if (storedLanguage === 'en' || storedLanguage === 'zh') setLanguage(storedLanguage);
      setTheme(document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
    } catch { setNotice(say('浏览器不允许本地存储，阅读清单仍可在本页使用。', 'Storage unavailable. Your reading list works for this page only.')); }
    const stopTrace = installDialogTrace();
    const sync = () => { const params = new URLSearchParams(window.location.search); setQuery(params.get('q') ?? ''); const legacy = params.get('c'); setCategory(params.get('category') ?? (legacy === null ? '' : ({ psychology: '心理', tech: '技术', society: '社会', business: '商业' })[legacy] ?? legacy)); };
    sync();
    window.addEventListener('popstate', sync);
    const storage = (event: StorageEvent) => { if (event.key === worksetKey) setSaved(readWorkset(event.newValue, allowed)); };
    window.addEventListener('storage', storage);
    const keys = (event: KeyboardEvent) => {
      if (event.key === '/' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement) && !searchOpen() && filterInput) { event.preventDefault(); filterInput.focus(); }
    };
    window.addEventListener('keydown', keys);
    return () => { stopTrace?.(); window.removeEventListener('popstate', sync); window.removeEventListener('storage', storage); window.removeEventListener('keydown', keys); };
  });
  createEffect(() => language(), value => { document.documentElement.lang = value; });

  function setFilter(value: string, nextCategory = category()) {
    setQuery(value); setCategory(nextCategory);
    const url = new URL(window.location.href); url.searchParams.delete('c');
    if (value) url.searchParams.set('q', value); else url.searchParams.delete('q');
    if (nextCategory) url.searchParams.set('category', nextCategory); else url.searchParams.delete('category');
    window.history.replaceState(null, '', url);
  }
  function persist(next: string[]) {
    setSaved(next);
    try { localStorage.setItem(worksetKey, JSON.stringify({ version: 1, slugs: next })); }
    catch { setNotice(say('未能保存到浏览器，请导出阅读清单以保留。', 'Could not persist. Export your reading list to keep it.')); }
  }
  function toggle(slug: string) { persist(savedSet().has(slug) ? saved().filter(item => item !== slug) : [...saved(), slug]); }
  async function loadIndex() {
    if (index().kind === 'ready' || index().kind === 'loading') return;
    setIndex({ kind: 'loading' });
    try {
      const response = await fetch('/search-index.json'); if (!response.ok) throw new Error('Search index unavailable');
      const raw: unknown = await response.json(); setIndex({ kind: 'ready', documents: searchIndexSchema.parse(raw) });
    } catch { setIndex({ kind: 'error' }); }
  }
  function changeLanguage() {
    const next = isZh() ? 'en' : 'zh'; setLanguage(next);
    try { localStorage.setItem('liz-frontier-language', next); } catch { /* Preference is optional. */ }
  }
  function changeTheme() {
    const next = theme() === 'light' ? 'dark' : 'light'; setTheme(next); document.documentElement.dataset.theme = next;
    try { localStorage.setItem('liz-frontier-theme', next); } catch { /* Preference is optional. */ }
  }
  async function importList(file: File | undefined) {
    if (!file) return;
    if (file.size > 100_000) { setNotice(say('文件太大，请选择本站导出的 JSON 清单。', 'File too large. Choose an exported JSON reading list.')); return; }
    try {
      const raw = await file.text();
      const { worksetSchema } = await import('./model');
      const decoded: unknown = JSON.parse(raw); const parsed = worksetSchema.parse(decoded);
      const valid = parsed.slugs.filter(slug => allowed.has(slug));
      persist([...new Set([...saved(), ...valid])]);
      setNotice(say(`已合并 ${valid.length} 篇文章；不认识的条目未导入。`, `Merged ${valid.length} articles; unknown entries were skipped.`));
    } catch { setNotice(say('无法导入：需要本站导出的 version 1 JSON 清单。', 'Import failed: expected a version 1 reading-list JSON.')); }
  }
  const Save = (p: { article: ArticleMeta }) => <Button {...stylex.attrs(s.button, s.quiet, s.iconButton, savedSet().has(p.article.slug) && s.accent)} aria-pressed={savedSet().has(p.article.slug) ? 'true' : 'false'} aria-label={`${savedSet().has(p.article.slug) ? say('移出阅读清单', 'Remove from reading list') : say('加入阅读清单', 'Save to reading list')}: ${p.article.title}`} onClick={() => toggle(p.article.slug)}>{savedSet().has(p.article.slug) ? '−' : '+'}</Button>;
  const ArticleRows = (p: { articles: ArticleMeta[] }) => <ul {...stylex.attrs(s.list)}><For each={p.articles}>{article => <li {...stylex.attrs(s.articleRow)}><time {...stylex.attrs(s.date)} datetime={article.publishedDate}>{article.publishedDate}</time><div><a href={`/articles/${article.slug}/`} {...stylex.attrs(s.articleTitle)}>{article.title}</a><p {...stylex.attrs(s.description)}>{article.description}</p><time {...stylex.attrs(s.dateMobile)} datetime={article.publishedDate}>{article.publishedDate} · {article.minutes} {say('分钟', 'min')}</time></div><Save article={article}/></li>}</For></ul>;
  const PageHeading = (p: { title: string; description: string }) => <header><h1 {...stylex.attrs(s.pageTitle)}>{p.title}</h1><p {...stylex.attrs(s.lede)}>{p.description}</p></header>;
  const Filters = () => <div {...stylex.attrs(s.filterBar)}><label {...stylex.attrs(s.inputWrap)}><span class="sr-only">{say('筛选文章', 'Filter articles')}</span><input ref={filterInput} {...stylex.attrs(s.input)} type="search" placeholder={say('搜索标题、摘要、标签…  /', 'Filter titles, summaries, tags…  /')} value={query()} onInput={event => { if (!event.isComposing) setFilter(event.currentTarget.value); }} onCompositionEnd={event => setFilter(event.currentTarget.value)} aria-keyshortcuts="/"/></label><label><span class="sr-only">{say('分类', 'Category')}</span><select {...stylex.attrs(s.select)} value={category()} onChange={event => setFilter(query(), event.currentTarget.value)}><option value="">{say('全部分类', 'All categories')}</option><Show when={category() && !categories.includes(category())}><option value={category()}>{category()}</option></Show><For each={categories}>{item => <option value={item}>{item}</option>}</For></select></label><Show when={query() || category()}><Button {...stylex.attrs(s.button, s.quiet)} onClick={() => setFilter('', '')}>{say('清除', 'Clear')}</Button></Show></div>;

  return <>
    <a class="skip" href="#main">{t()['a11y.skip_to_content']}</a>
    <header {...stylex.attrs(s.header)}><div {...stylex.attrs(s.shell, s.headerInner)}>
      <a href="/" {...stylex.attrs(s.brand)} aria-label="LizLiz — Home">LizLiz</a>
      <nav aria-label={t()['nav.primary']} {...stylex.attrs(s.nav)}>
        <a href="/#projects" {...stylex.attrs(s.navLink)}>{t()['nav.projects']}</a>
        <a href="/articles/" {...stylex.attrs(s.navLink, active === 'articles' && s.navCurrent)} aria-current={active === 'articles' ? 'page' : undefined}>{t()['nav.writing']}</a>
        <a href="/skills/" {...stylex.attrs(s.navLink, active === 'skills' && s.navCurrent)} aria-current={active === 'skills' ? 'page' : undefined}>Skills</a>
        <a href="/templates/" {...stylex.attrs(s.navLink, active === 'templates' && s.navCurrent)} aria-current={active === 'templates' ? 'page' : undefined}>{say('模板', 'Templates')}</a>
        <a href="/reading/" {...stylex.attrs(s.navLink, active === 'reading' && s.navCurrent)} aria-current={active === 'reading' ? 'page' : undefined}>{say('阅读清单', 'Saved')}<Show when={saved().length}> ({saved().length})</Show></a>
      </nav>
      <div {...stylex.attrs(s.tools)}>
        <Dialog closeOnOutsidePress={true} open={searchOpen()} onOpenChange={(open, details) => { traceDialogChange(open, details); setSearchOpen(open); if (open) void loadIndex(); }}>
          <DialogTrigger shortcut="mod+k" {...stylex.attrs(s.button, s.quiet, s.iconButton)} aria-label={say('搜索全站，Command 或 Control K', 'Search site, Command or Control K')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></DialogTrigger>
          <DialogBackdrop {...stylex.attrs(s.backdrop)}/><DialogContent {...stylex.attrs(s.dialog)}>
            <div {...stylex.attrs(s.row, s.between)}><DialogTitle {...stylex.attrs(s.heading)}>{say('搜索 LizLiz', 'Search LizLiz')}</DialogTitle><DialogClose {...stylex.attrs(s.button, s.quiet)} aria-label={say('关闭搜索', 'Close search')}>Esc ×</DialogClose></div>
            <DialogDescription {...stylex.attrs(s.small)}>{say('文章全文、项目与可复用工具。无需把查询发给任何服务。', 'Writing, projects and reusable tools. Your query stays in this browser.')}</DialogDescription>
            <label><span class="sr-only">{say('搜索词', 'Search query')}</span><input autofocus {...stylex.attrs(s.input)} type="search" value={searchQuery()} placeholder={say('搜一个想法、一项工具…', 'An idea, a tool, a question…')} onInput={event => { if (!event.isComposing) setSearchQuery(event.currentTarget.value); }} onCompositionEnd={event => setSearchQuery(event.currentTarget.value)}/></label>
            <div aria-live="polite" {...stylex.attrs(s.status)}><Show when={index().kind === 'loading'}>{say('正在载入全文索引…', 'Loading full-text index…')}</Show><Show when={index().kind === 'error'}>{say('索引未能载入。', 'Could not load the index.')} <Button {...stylex.attrs(s.button)} onClick={() => void loadIndex()}>{say('重试', 'Retry')}</Button></Show><Show when={index().kind === 'ready'}>{hits().length} {say('条结果', 'results')}{hits().length === 30 ? say('（显示前 30 条）', ' (first 30)') : ''}</Show></div>
            <div {...stylex.attrs(s.searchResults)}><For each={hits()}>{hit => <a href={hit.href} {...stylex.attrs(s.result)}><span {...stylex.attrs(s.small)}>{say(({ article: '文章', project: '项目', skill: '技能包', template: '模板' })[hit.kind], hit.kind)}</span><div {...stylex.attrs(s.resultTitle)}>{hit.title} ↗</div><p {...stylex.attrs(s.description)}>{hit.description}</p></a>}</For><Show when={index().kind === 'ready' && hits().length === 0}><p {...stylex.attrs(s.description)}>{say('没有匹配，换个词试试。', 'No matches. Try a different word.')}</p></Show></div>
          </DialogContent>
        </Dialog>
        <Button {...stylex.attrs(s.button, s.quiet, s.iconButton)} onClick={changeLanguage} aria-label={isZh() ? 'Switch to English' : '切换中文'}>{isZh() ? 'EN' : '中'}</Button>
        <Button {...stylex.attrs(s.button, s.quiet, s.iconButton)} onClick={changeTheme} aria-label={theme() === 'light' ? t()['a11y.switch_theme_dark'] : t()['a11y.switch_theme_light']}>{theme() === 'light' ? '◐' : '◑'}</Button>
      </div>
    </div></header>
    <main id="main" tabindex="-1" {...stylex.attrs(s.shell, s.main)}>
      <Show when={route.kind === 'page' && route.view === 'home'}>
        <header {...stylex.attrs(s.hero)}><h1 {...stylex.attrs(s.title)}>LizLiz</h1><p {...stylex.attrs(s.lede)}>{t()['site.tagline']}</p><div {...stylex.attrs(s.now)}><span {...stylex.attrs(s.dot)}/><span>{t()['now.text']}</span></div><div {...stylex.attrs(s.actions)}><a href="/articles/" {...stylex.attrs(s.button)}>{t()['nav.writing']} ↗</a><a href="https://github.com/lizliz404" {...stylex.attrs(s.button, s.quiet)}>GitHub ↗</a><a href="https://x.com/lizliz404" {...stylex.attrs(s.button, s.quiet)}>X ↗</a><a href="https://okjk.co/znTaA1" {...stylex.attrs(s.button, s.quiet)}>即刻 ↗</a></div></header>
        <Section id="projects" title={t()['section.projects']} description={t()['section.projects.lede']}><div {...stylex.attrs(s.grid)}><For each={catalog.projects.filter(project => project.kind === 'site')}>{project => <article {...stylex.attrs(s.card)}><a href={project.url} tabindex="-1" aria-hidden="true"><Show when={project.ogImage}><img src={project.ogImage} alt="" width="600" height="314" loading="lazy" {...stylex.attrs(s.cardImage)}/></Show></a><div {...stylex.attrs(s.cardBody)}><h3 {...stylex.attrs(s.cardTitle)}><a href={project.url}>{project.title} ↗</a></h3><p {...stylex.attrs(s.description)}>{project.description}</p></div></article>}</For></div></Section>
        <Section title={t()['section.writing']} description={t()['section.writing.lede']} href="/articles/" more={say('全部文章', 'All writing')}><ArticleRows articles={catalog.articles.slice(0, 5)}/></Section>
        <div {...stylex.attrs(s.grid)}><Section title="Skills" description={t()['section.skills.lede']} href="/skills/" more={say('浏览', 'Explore')}><p {...stylex.attrs(s.description)}>{catalog.skills.map(skill => skill.name).slice(0, 4).join(' · ')}</p></Section><Section title={say('设计模板', 'Design Templates')} description={t()['section.templates.lede']} href="/templates/" more={say('浏览', 'Explore')}><p {...stylex.attrs(s.description)}>{isZh() ? catalog.templates.taglineZh : catalog.templates.tagline}</p></Section></div>
      </Show>
      <Show when={route.kind === 'page' && (route.view === 'articles' || route.view === 'reading')}>
        <PageHeading title={isReading ? say('阅读清单', 'Reading list') : t()['section.writing']} description={isReading ? say('想读的留在这里。只保存在你的浏览器，随时导出带走。', 'Keep what you want to read. Stored in your browser, portable whenever you need.') : t()['section.writing.lede']}/>
        <Show when={isReading}><div {...stylex.attrs(s.actions)}><Button {...stylex.attrs(s.button)} disabled={!saved().length} onClick={() => download('lizliz-reading-list.json', JSON.stringify({ version: 1, slugs: saved() }, null, 2), 'application/json')}>{say('导出清单 JSON', 'Export list JSON')}</Button><Button {...stylex.attrs(s.button)} disabled={!saved().length} onClick={() => download('lizliz-reading-context.md', exportContext(selected()), 'text/markdown')}>{say('导出引用摘要 Markdown', 'Export cited context Markdown')}</Button><label {...stylex.attrs(s.button)}>{say('导入清单', 'Import list')}<input type="file" accept="application/json,.json" class="sr-only" onChange={event => { void importList(event.currentTarget.files?.[0]); event.currentTarget.value = ''; }}/></label></div></Show>
        <Filters/><p aria-live="polite" {...stylex.attrs(s.small)}>{filtered().length} {say('篇文章', 'articles')}</p>
        <Show when={filtered().length} fallback={<div {...stylex.attrs(s.empty)}><h2 {...stylex.attrs(s.heading)}>{isReading && !saved().length ? say('把想读的文章放进来', 'Make room for a good read') : say('没有匹配的文章', 'No matching articles')}</h2><p {...stylex.attrs(s.description)}>{isReading && !saved().length ? say('在文章旁点「+」即可加入。', 'Use the + beside an article to save it here.') : say('试着换个词，或清除筛选。', 'Try another word or clear your filters.')}</p><a href="/articles/" {...stylex.attrs(s.button)}>{say('浏览全部文章', 'Browse all writing')} ↗</a></div>}><ArticleRows articles={filtered()}/></Show>
      </Show>
      <Show when={route.kind === 'page' && route.view === 'skills'}>
        <PageHeading title="Skills" description={t()['section.skills.lede']}/><div {...stylex.attrs(s.actions)}><a href="https://github.com/lizliz404/agent-skills" {...stylex.attrs(s.button)}>GitHub ↗</a><a href="/templates/" {...stylex.attrs(s.button, s.quiet)}>{t()['skills.see_templates']}</a></div>
        <div {...stylex.attrs(s.section)}><Accordion><For each={catalog.skills}>{skill => <AccordionItem value={skill.slug} id={skill.slug} {...stylex.attrs(s.accordionItem)}><AccordionHeader {...stylex.attrs(s.accordionHeader)}><AccordionTrigger {...stylex.attrs(s.accordionTrigger)}><img src={skill.iconUrl} alt="" width="42" height="42" {...stylex.attrs(s.skillIcon)}/><span {...stylex.attrs(s.grow)}><span {...stylex.attrs(s.cardTitle)}>{skill.name}</span><span {...stylex.attrs(s.block, s.description)}>{isZh() ? skill.taglineZh : skill.tagline}</span></span><span aria-hidden="true">+</span></AccordionTrigger></AccordionHeader><AccordionPanel {...stylex.attrs(s.panel)}><ul {...stylex.attrs(s.featureList)}><For each={isZh() ? skill.featuresZh : skill.features}>{feature => <li><Show when={feature.label}><strong>{feature.label} — </strong></Show>{feature.text}</li>}</For></ul><a href={skill.zipUrl} download {...stylex.attrs(s.button)}>{t()['skills.download']} ↓</a></AccordionPanel></AccordionItem>}</For></Accordion></div>
      </Show>
      <Show when={route.kind === 'page' && route.view === 'templates'}>
        <PageHeading title={isZh() ? catalog.templates.nameZh : catalog.templates.name} description={isZh() ? catalog.templates.taglineZh : catalog.templates.tagline}/><div {...stylex.attrs(s.actions)}><a href={catalog.templates.zipUrl} download {...stylex.attrs(s.button)}>{t()['templates.download']} ↓</a><a href="https://github.com/lizliz404/design-templates" {...stylex.attrs(s.button, s.quiet)}>GitHub ↗</a></div>
        <For each={catalog.templates.areas}>{area => <section {...stylex.attrs(s.pack)}><h2 {...stylex.attrs(s.heading)}>{isZh() ? area.nameZh : area.name}</h2><p {...stylex.attrs(s.description)}>{isZh() ? area.blurbZh : area.blurb}</p><ul {...stylex.attrs(s.featureList)}><For each={isZh() ? area.itemsZh : area.items}>{feature => <li><strong>{feature.label}</strong> — {feature.text}</li>}</For></ul></section>}</For>
        <Section title={t()['templates.how_to_use']}><ol {...stylex.attrs(s.featureList)}><For each={isZh() ? catalog.templates.howtoZh : catalog.templates.howto}>{step => <li>{step}</li>}</For></ol></Section>
      </Show>
      <Show when={props.article}>{article => <article {...stylex.attrs(s.reader)}><a href="/articles/" {...stylex.attrs(s.small)}>{t()['articles.back']}</a><h1 {...stylex.attrs(s.readerTitle)}>{article().title}</h1><div {...stylex.attrs(s.readerMeta)}><time datetime={article().publishedDate}>{article().publishedDate}</time><span>{article().minutes} {t()['articles.min_read']}</span><Show when={article().updatedDate !== article().publishedDate}><span>{say('更新', 'Updated')} {article().updatedDate}</span></Show></div><p {...stylex.attrs(s.lede)}>{article().description}</p><div {...stylex.attrs(s.row, s.readerActions)}><Save article={article()}/><span {...stylex.attrs(s.small)}>{savedSet().has(article().slug) ? say('已加入阅读清单', 'Saved for later') : say('稍后读', 'Read later')}</span><a href={`/content/${article().slug}.md`} download {...stylex.attrs(s.button, s.quiet)}>Markdown ↓</a><a href={sourceUrl(article().slug)} {...stylex.attrs(s.button, s.quiet)}>{say('原站链接', 'Original')} ↗</a></div><Show when={article().headings.filter(h => h.depth <= 3).length > 2}><nav aria-label={say('文章目录', 'On this page')} {...stylex.attrs(s.toc)}><h2 {...stylex.attrs(s.cardTitle)}>{say('本文目录', 'On this page')}</h2><ul {...stylex.attrs(s.tocList)}><For each={article().headings.filter(h => h.depth <= 3)}>{heading => <li {...stylex.attrs(heading.depth > 2 && s.tocIndent)}><a href={`#${heading.id}`}>{heading.text}</a></li>}</For></ul></nav></Show><div class="prose" innerHTML={article().html}/><section {...stylex.attrs(s.related)}><h2 {...stylex.attrs(s.heading)}>{t()['articles.related']}</h2><ArticleRows articles={catalog.articles.filter(other => other.slug !== article().slug).sort((a, b) => b.tags.filter(tag => article().tags.includes(tag)).length - a.tags.filter(tag => article().tags.includes(tag)).length).slice(0, 3)}/></section></article>}</Show>
      <Show when={(route.kind === 'article' && !props.article) || (route.kind === 'page' && route.view === 'missing')}><PageHeading title={t()['not_found.title']} description={t()['not_found.body']}/><a href="/" {...stylex.attrs(s.button)}>{t()['not_found.home']}</a></Show>
      <p role="status" {...stylex.attrs(s.status)}>{notice()}</p>
    </main>
    <footer {...stylex.attrs(s.shell, s.footer)}><div {...stylex.attrs(s.row, s.between)}><span>lizliz.xyz © 2026</span><div {...stylex.attrs(s.row)}><a href="https://github.com/lizliz404">GitHub ↗</a><a href="https://lizliz.xyz/privacy/">{say('隐私', 'Privacy')}</a><a href="https://lizliz.xyz/terms/">{say('条款', 'Terms')}</a><a href="https://lizliz.xyz/rss.xml">RSS ↗</a></div></div></footer>
  </>;
}
