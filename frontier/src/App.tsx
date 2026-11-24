import { createEffect, createMemo, createSignal, For, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@ui-sdk/solid/button';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from '@ui-sdk/solid/accordion';
import { Dialog, DialogBackdrop, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@ui-sdk/solid/dialog';
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@ui-sdk/solid/menu';
import catalogData from './generated/catalog.json';
import en from '../../src/i18n/en';
import zh from '../../src/i18n/zh';
import { catalogSchema, filterArticles, parseRoute, search, searchIndexSchema, type Article, type ArticleMeta, type Catalog, type Language, type SearchDocument } from './model';
import { s } from './styles';
import { Icon } from './Icon';
import { installDialogTrace, traceDialogChange } from './dialog-trace';

export interface AppProps { path: string; article?: Article }
const catalog = catalogSchema.parse(catalogData);
function Section(props: { compact?: boolean; title: string; description?: string; href?: string; more?: string; children: JSX.Element; id?: string }) {
  return <section id={props.id} {...stylex.attrs(!props.compact && s.section)}><div {...stylex.attrs(s.sectionHead)}><div><h2 {...stylex.attrs(s.heading)}>{props.title}</h2><Show when={props.description}><p {...stylex.attrs(s.description)}>{props.description}</p></Show></div><Show when={props.href}><a href={props.href} {...stylex.attrs(s.small, s.noWrap)}>{props.more} <Icon name="ArrowRight"/></a></Show></div>{props.children}</section>;
}

function ProjectTile(props: { project: Catalog['projects'][number]; hidden?: boolean }) {
  return <a href={props.project.url} class="stream-tile" tabindex={props.hidden ? -1 : 0} aria-hidden={props.hidden ? 'true' : undefined} target={props.project.url.startsWith('http') ? '_blank' : undefined} rel={props.project.url.startsWith('http') ? 'noopener noreferrer' : undefined}><span class="stream-icon" aria-hidden="true"><img src={props.project.iconUrl} alt="" width="20" height="20" loading="lazy" decoding="async" /></span><span class="stream-title">{props.project.title}</span><span class="stream-arrow" aria-hidden="true"><Icon name="ArrowRight"/></span></a>;
}

export function App(props: AppProps) {
  const route = parseRoute(props.path);
  const [language, setLanguage] = createSignal<Language>('zh');
  const [theme, setTheme] = createSignal<'light' | 'dark'>('light');
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
  const active = route.kind === 'article' ? 'articles' : route.view;
  const filtered = createMemo(() => filterArticles(catalog.articles, query(), category()));
  const categories = [...new Set(catalog.articles.flatMap(article => article.categories))].sort();
  const categoryCount = (name: string) => catalog.articles.filter(article => article.categories.includes(name)).length;
  const siteProjects = catalog.projects.filter(project => project.kind === 'site');
  const streamRows = [siteProjects.filter((_, i) => i % 2 === 0), siteProjects.filter((_, i) => i % 2 === 1)];
  const hits = createMemo(() => { const value = index(); return value.kind === 'ready' ? search(value.documents, searchQuery()) : []; });

  createEffect(() => true, () => {
    try {
      const storedLanguage = localStorage.getItem('liz-frontier-language');
      if (storedLanguage === 'en' || storedLanguage === 'zh') setLanguage(storedLanguage);
      setTheme(document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
    } catch { /* Preferences are optional. */ }
    const stopTrace = installDialogTrace();
    const sync = () => { const params = new URLSearchParams(window.location.search); setQuery(params.get('q') ?? ''); const legacy = params.get('c'); setCategory(params.get('category') ?? (legacy === null ? '' : ({ psychology: '心理', tech: '技术', society: '社会', business: '商业' })[legacy] ?? legacy)); };
    sync();
    window.addEventListener('popstate', sync);
    const keys = (event: KeyboardEvent) => {
      if (event.key === '/' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement) && !searchOpen() && filterInput) { event.preventDefault(); filterInput.focus(); }
    };
    window.addEventListener('keydown', keys);
    return () => { stopTrace?.(); window.removeEventListener('popstate', sync); window.removeEventListener('keydown', keys); };
  });
  createEffect(() => language(), value => { document.documentElement.lang = value; });

  function setFilter(value: string, nextCategory = category()) {
    setQuery(value); setCategory(nextCategory);
    const url = new URL(window.location.href); url.searchParams.delete('c');
    if (value) url.searchParams.set('q', value); else url.searchParams.delete('q');
    if (nextCategory) url.searchParams.set('category', nextCategory); else url.searchParams.delete('category');
    window.history.replaceState(null, '', url);
  }
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
  const ArticleRows = (p: { articles: ArticleMeta[] }) => <ul {...stylex.attrs(s.list)}><For each={p.articles}>{article => <li {...stylex.attrs(s.articleRow)}><time {...stylex.attrs(s.date)} datetime={article.publishedDate}>{article.publishedDate}</time><div><a href={`/articles/${article.slug}/`} {...stylex.attrs(s.articleTitle)}>{article.title}</a><p {...stylex.attrs(s.description)}>{article.description}</p><time {...stylex.attrs(s.dateMobile)} datetime={article.publishedDate}>{article.publishedDate} · {article.minutes} {say('分钟', 'min')}</time></div></li>}</For></ul>;
  const PageHeading = (p: { title: string; description: string }) => <header><h1 {...stylex.attrs(s.pageTitle)}>{p.title}</h1><p {...stylex.attrs(s.lede)}>{p.description}</p></header>;
  const CategoryPills = () => <nav aria-label={say('分类', 'Categories')} {...stylex.attrs(s.pills)}><a href="/articles/" {...stylex.attrs(s.pill, !category() && s.pillActive)} aria-current={!category() ? 'page' : undefined} onClick={event => { event.preventDefault(); setFilter(query(), ''); }}>{say('全部', 'All')}<span {...stylex.attrs(s.pillCount)}>{catalog.articles.length}</span></a><For each={categories}>{item => <a href={`/articles/?category=${encodeURIComponent(item)}`} {...stylex.attrs(s.pill, category() === item && s.pillActive)} aria-current={category() === item ? 'page' : undefined} onClick={event => { event.preventDefault(); setFilter(query(), item); }}>{item}<span {...stylex.attrs(s.pillCount)}>{categoryCount(item)}</span></a>}</For></nav>;
  const Filters = () => <div {...stylex.attrs(s.filterBar)}><label {...stylex.attrs(s.inputWrap)}><span class="sr-only">{say('筛选文章', 'Filter articles')}</span><input ref={filterInput} {...stylex.attrs(s.input)} type="search" placeholder={say('搜索标题、摘要、标签…  /', 'Filter titles, summaries, tags…  /')} value={query()} onInput={event => { if (!event.isComposing) setFilter(event.currentTarget.value); }} onCompositionEnd={event => setFilter(event.currentTarget.value)} aria-keyshortcuts="/"/></label></div>;

  return <>
    <Show when={route.kind === 'page' && route.view === 'home'}><div class="paper-shell" aria-hidden="true"><div class="paper-fiber" /><div class="paper-veil" /></div></Show>
    <a class="skip" href="#main">{t()['a11y.skip_to_content']}</a>
    <header {...stylex.attrs(s.header)}><div {...stylex.attrs(s.shell, s.headerInner)}>
      <a href="/" {...stylex.attrs(s.brand)} aria-label="LizLiz — Home">LizLiz</a>
      <nav aria-label={t()['nav.primary']} {...stylex.attrs(s.nav)}>
        <a href="/#projects" {...stylex.attrs(s.navLink)}>{t()['nav.projects']}</a>
        <a href="/articles/" {...stylex.attrs(s.navLink, active === 'articles' && s.navCurrent)} aria-current={active === 'articles' ? 'page' : undefined}>{t()['nav.writing']}</a>
        <a href="/skills/" {...stylex.attrs(s.navLink, active === 'skills' && s.navCurrent)} aria-current={active === 'skills' ? 'page' : undefined}>Skills</a>
        <Menu><MenuTrigger {...stylex.attrs(s.navLink, s.navMenu)}>{say('联系', 'Connect')} <Icon name="NavArrowDown"/></MenuTrigger><MenuContent {...stylex.attrs(s.menu)}><MenuItem render={itemProps => <a {...itemProps} href="https://github.com/lizliz404" target="_blank" rel="noopener noreferrer" {...stylex.attrs(s.menuItem)}>GitHub <Icon name="OpenInWindow"/></a>}/><MenuItem render={itemProps => <a {...itemProps} href="https://x.com/lizliz404" target="_blank" rel="noopener noreferrer" {...stylex.attrs(s.menuItem)}>X <Icon name="OpenInWindow"/></a>}/><MenuItem render={itemProps => <a {...itemProps} href="https://okjk.co/znTaA1" target="_blank" rel="noopener noreferrer" {...stylex.attrs(s.menuItem)}>{say('即刻', 'Jike')} <Icon name="OpenInWindow"/></a>}/></MenuContent></Menu>
      </nav>
      <div {...stylex.attrs(s.tools)}>
        <Dialog closeOnOutsidePress={true} open={searchOpen()} onOpenChange={(open, details) => { traceDialogChange(open, details); setSearchOpen(open); if (open) void loadIndex(); }}>
          <DialogTrigger shortcut="mod+k" {...stylex.attrs(s.button, s.quiet, s.iconButton)} aria-label={say('搜索全站，Command 或 Control K', 'Search site, Command or Control K')}><Icon name="Search" size="lg"/></DialogTrigger>
          <DialogBackdrop {...stylex.attrs(s.backdrop)}/><DialogContent {...stylex.attrs(s.dialog)}>
            <div {...stylex.attrs(s.row, s.between)}><DialogTitle {...stylex.attrs(s.heading)}>{say('搜索 LizLiz', 'Search LizLiz')}</DialogTitle><DialogClose {...stylex.attrs(s.button, s.quiet)} aria-label={say('关闭搜索', 'Close search')}><Icon name="Xmark" size="lg"/></DialogClose></div>
            <DialogDescription {...stylex.attrs(s.small)}>{say('文章全文、项目与可复用工具。无需把查询发给任何服务。', 'Writing, projects and reusable tools. Your query stays in this browser.')}</DialogDescription>
            <label><span class="sr-only">{say('搜索词', 'Search query')}</span><input autofocus {...stylex.attrs(s.input)} type="search" value={searchQuery()} placeholder={say('搜一个想法、一项工具…', 'An idea, a tool, a question…')} onInput={event => { if (!event.isComposing) setSearchQuery(event.currentTarget.value); }} onCompositionEnd={event => setSearchQuery(event.currentTarget.value)}/></label>
            <div aria-live="polite" {...stylex.attrs(s.status)}><Show when={index().kind === 'loading'}>{say('正在载入全文索引…', 'Loading full-text index…')}</Show><Show when={index().kind === 'error'}>{say('索引未能载入。', 'Could not load the index.')} <Button {...stylex.attrs(s.button)} onClick={() => void loadIndex()}>{say('重试', 'Retry')}</Button></Show><Show when={index().kind === 'ready'}>{hits().length} {say('条结果', 'results')}{hits().length === 30 ? say('（显示前 30 条）', ' (first 30)') : ''}</Show></div>
            <div {...stylex.attrs(s.searchResults)}><For each={hits()}>{hit => <a href={hit.href} {...stylex.attrs(s.result)}><span {...stylex.attrs(s.small)}>{say(({ article: '文章', project: '项目', skill: '技能包', template: '模板' })[hit.kind], hit.kind)}</span><div {...stylex.attrs(s.resultTitle)}>{hit.title} <Icon name={hit.href.startsWith('/') ? 'ArrowRight' : 'OpenInWindow'}/></div><p {...stylex.attrs(s.description)}>{hit.description}</p></a>}</For><Show when={index().kind === 'ready' && hits().length === 0}><p {...stylex.attrs(s.description)}>{say('没有匹配，换个词试试。', 'No matches. Try a different word.')}</p></Show></div>
          </DialogContent>
        </Dialog>
        <Button {...stylex.attrs(s.button, s.quiet, s.iconButton)} onClick={changeLanguage} aria-label={isZh() ? 'Switch to English' : '切换中文'}><Icon name="Translate" size="lg"/></Button>
        <Button {...stylex.attrs(s.button, s.quiet, s.iconButton)} onClick={changeTheme} aria-label={theme() === 'light' ? t()['a11y.switch_theme_dark'] : t()['a11y.switch_theme_light']}><Icon name={theme() === 'light' ? 'HalfMoon' : 'SunLight'} size="lg"/></Button>
      </div>
    </div></header>
    <main id="main" tabindex="-1" {...stylex.attrs(s.shell, s.main)}>
      <Show when={route.kind === 'page' && route.view === 'home'}>
        <header {...stylex.attrs(s.hero)}><h1 {...stylex.attrs(s.title)}>LizLiz</h1><p {...stylex.attrs(s.lede)}>{t()['site.tagline']}</p><p {...stylex.attrs(s.now)}><span {...stylex.attrs(s.dot)}/><span {...stylex.attrs(s.nowLabel)}>{t()['section.now']}</span><span>{t()['now.text']}</span></p></header>
        <section id="projects" aria-labelledby="projects-heading" {...stylex.attrs(s.streamSection)}><div {...stylex.attrs(s.sectionHead)}><div><h2 id="projects-heading" {...stylex.attrs(s.heading)}>{t()['section.projects']}</h2><p {...stylex.attrs(s.description)}>{t()['section.projects.lede']}</p></div></div>
          <div class="stream">{streamRows.map((row, i) => <div class="stream-row" data-row={i}>{[...row, ...row].map((project, j) => <ProjectTile project={project} hidden={j >= row.length}/>)}</div>)}</div>
        </section>
      </Show>
      <Show when={route.kind === 'page' && route.view === 'articles'}>
        <PageHeading title={t()['section.writing']} description={t()['section.writing.lede']}/>
        <Filters/><CategoryPills/><p aria-live="polite" {...stylex.attrs(s.small)}>{filtered().length} {say('篇文章', 'articles')}</p>
        <Show when={filtered().length} fallback={<div {...stylex.attrs(s.empty)}><h2 {...stylex.attrs(s.heading)}>{say('没有匹配的文章', 'No matching articles')}</h2><p {...stylex.attrs(s.description)}>{say('试着换个词，或清除筛选。', 'Try another word or clear your filters.')}</p></div>}><ArticleRows articles={filtered()}/></Show>
      </Show>
      <Show when={route.kind === 'page' && route.view === 'skills'}>
        <PageHeading title="Skills" description={t()['section.skills.lede']}/><div {...stylex.attrs(s.actions)}><a href="https://github.com/lizliz404/agent-skills" {...stylex.attrs(s.button)}>GitHub <Icon name="OpenInWindow"/></a><a href="/templates/" {...stylex.attrs(s.button, s.quiet)}>{t()['skills.see_templates']}</a></div>
        <div {...stylex.attrs(s.section)}><Accordion><For each={catalog.skills}>{skill => <AccordionItem value={skill.slug} id={skill.slug} {...stylex.attrs(s.accordionItem)}><AccordionHeader {...stylex.attrs(s.accordionHeader)}><AccordionTrigger {...stylex.attrs(s.accordionTrigger)}><img src={skill.iconUrl} alt="" width="42" height="42" {...stylex.attrs(s.skillIcon)}/><span {...stylex.attrs(s.grow)}><span {...stylex.attrs(s.cardTitle)}>{skill.name}</span><span {...stylex.attrs(s.block, s.description)}>{isZh() ? skill.taglineZh : skill.tagline}</span></span><Icon name="NavArrowDown"/></AccordionTrigger></AccordionHeader><AccordionPanel {...stylex.attrs(s.panel)}><ul {...stylex.attrs(s.featureList)}><For each={isZh() ? skill.featuresZh : skill.features}>{feature => <li><Show when={feature.label}><strong>{feature.label} — </strong></Show>{feature.text}</li>}</For></ul><a href={skill.zipUrl} download {...stylex.attrs(s.button)}>{t()['skills.download']} <Icon name="Download"/></a></AccordionPanel></AccordionItem>}</For></Accordion></div>
      </Show>
      <Show when={route.kind === 'page' && route.view === 'templates'}>
        <PageHeading title={isZh() ? catalog.templates.nameZh : catalog.templates.name} description={isZh() ? catalog.templates.taglineZh : catalog.templates.tagline}/><div {...stylex.attrs(s.actions)}><a href={catalog.templates.zipUrl} download {...stylex.attrs(s.button)}>{t()['templates.download']} <Icon name="Download"/></a><a href="https://github.com/lizliz404/design-templates" {...stylex.attrs(s.button, s.quiet)}>GitHub <Icon name="OpenInWindow"/></a></div>
        <For each={catalog.templates.areas}>{area => <section {...stylex.attrs(s.pack)}><h2 {...stylex.attrs(s.heading)}>{isZh() ? area.nameZh : area.name}</h2><p {...stylex.attrs(s.description)}>{isZh() ? area.blurbZh : area.blurb}</p><ul {...stylex.attrs(s.featureList)}><For each={isZh() ? area.itemsZh : area.items}>{feature => <li><strong>{feature.label}</strong> — {feature.text}</li>}</For></ul></section>}</For>
        <Section title={t()['templates.how_to_use']}><ol {...stylex.attrs(s.featureList)}><For each={isZh() ? catalog.templates.howtoZh : catalog.templates.howto}>{step => <li>{step}</li>}</For></ol></Section>
      </Show>
      <Show when={props.article}>{article => <article {...stylex.attrs(s.reader)}><a href="/articles/" {...stylex.attrs(s.small)}>{t()['articles.back']}</a><h1 {...stylex.attrs(s.readerTitle)}>{article().title}</h1><div {...stylex.attrs(s.readerMeta)}><time datetime={article().publishedDate}>{article().publishedDate}</time><span>{article().minutes} {t()['articles.min_read']}</span><Show when={article().updatedDate !== article().publishedDate}><span>{say('更新', 'Updated')} {article().updatedDate}</span></Show></div><p {...stylex.attrs(s.readerLede)}>{article().description}</p><Show when={article().headings.filter(h => h.depth <= 3).length > 2}><nav aria-label={say('文章目录', 'On this page')} {...stylex.attrs(s.toc)}><h2 {...stylex.attrs(s.tocHeading)}>{say('本文目录', 'On this page')}</h2><ul {...stylex.attrs(s.tocList)}><For each={article().headings.filter(h => h.depth <= 3)}>{heading => <li {...stylex.attrs(heading.depth > 2 && s.tocIndent)}><a href={`#${heading.id}`}>{heading.text}</a></li>}</For></ul></nav></Show><div class="prose" innerHTML={article().html}/><section {...stylex.attrs(s.related)}><h2 {...stylex.attrs(s.relatedLabel)}>{t()['articles.related']}</h2><div class="related-scroller"><div {...stylex.attrs(s.relatedStrip)}><For each={catalog.articles.filter(other => other.slug !== article().slug).sort((a, b) => b.tags.filter(tag => article().tags.includes(tag)).length - a.tags.filter(tag => article().tags.includes(tag)).length).slice(0, 6)}>{related => <a href={`/articles/${related.slug}/`} {...stylex.attrs(s.relatedItem, s.relatedCard)}><span {...stylex.attrs(s.relatedTitle)}>{related.title}</span><span {...stylex.attrs(s.relatedDesc)}>{related.description}</span></a>}</For></div></div></section></article>}</Show>
      <Show when={(route.kind === 'article' && !props.article) || (route.kind === 'page' && route.view === 'missing')}><PageHeading title={t()['not_found.title']} description={t()['not_found.body']}/><a href="/" {...stylex.attrs(s.button)}>{t()['not_found.home']}</a></Show>
    </main>
    <footer {...stylex.attrs(s.shell, s.footer)}><div {...stylex.attrs(s.row, s.between)}><span>lizliz.xyz © 2026</span><a href="https://lizliz.xyz/rss.xml">RSS <Icon name="OpenInWindow"/></a></div></footer>
  </>;
}
