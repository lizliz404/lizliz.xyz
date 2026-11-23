import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import matter from 'gray-matter';
import { catalogSchema, searchIndexSchema, search, sourceUrl, exportContext } from '../src/model';
process.chdir(fileURLToPath(new URL('..', import.meta.url)));
const catalog = catalogSchema.parse(JSON.parse(await readFile('public/catalog.json', 'utf8')));
const argumentsSchema = z.discriminatedUnion('command', [
  z.object({ command: z.literal('search'), values: z.array(z.string()).min(1) }),
  z.object({ command: z.literal('read'), values: z.tuple([z.string().regex(/^[a-z0-9-]+$/)]) }),
  z.object({ command: z.literal('context'), values: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1).max(44) }),
]);
const result = argumentsSchema.safeParse({ command: process.argv[2], values: process.argv.slice(3) });
if (!result.success) {
  process.stderr.write('Usage: npm run agent -- search <terms> | read <slug> | context <slug...>\n'); process.exitCode = 1;
} else {
  const args = result.data;
  if (args.command === 'search') {
    const documents = searchIndexSchema.parse(JSON.parse(await readFile('public/search-index.json', 'utf8')));
    process.stdout.write(JSON.stringify({ query: args.values.join(' '), results: search(documents, args.values.join(' ')).map(({ text: _text, ...hit }) => { void _text; return hit; }) }, null, 2) + '\n');
  } else {
    const articles = args.values.map(slug => {
      const article = catalog.articles.find(article => article.slug === slug);
      if (!article) throw new Error(`Unknown published article: ${slug}`);
      return article;
    });
    if (args.command === 'read') process.stdout.write(await readFile(`public/content/${args.values[0]}.md`, 'utf8'));
    else {
      process.stdout.write(exportContext(articles) + '\n---\n\n');
      for (const article of articles) {
        const raw = await readFile(`public/content/${article.slug}.md`, 'utf8');
        process.stdout.write(`# ${article.title}\n\nSource: ${sourceUrl(article.slug)}\n\n${matter(raw).content}\n\n---\n\n`);
      }
    }
  }
}
