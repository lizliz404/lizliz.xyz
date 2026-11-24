import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import type { Plugin } from 'vite';

/** Honor the same 404.html contract as static hosts, before Vite's HTML fallback. */
export function staticNotFound(): Plugin {
  return {
    name: 'lizliz-static-not-found',
    configurePreviewServer(server) {
      const output = path.resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use(async (request, response, next) => {
        if (request.method !== 'GET' && request.method !== 'HEAD') return next();
        let pathname: string;
        try { pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://preview.invalid').pathname); }
        catch { response.statusCode = 400; response.end('Bad request'); return; }
        const file = path.resolve(output, `.${pathname}`);
        const inside = file === output || file.startsWith(output + path.sep);
        let found = false;
        if (inside) {
          try {
            const entry = await stat(file);
            found = entry.isFile() || (entry.isDirectory() && (await stat(path.join(file, 'index.html'))).isFile());
          } catch { /* Missing filesystem entry is an ordinary 404. */ }
        }
        if (found && !['/404/', '/404', '/404.html'].includes(pathname)) return next();
        const html = request.headers.accept?.includes('text/html') || !path.extname(pathname) || pathname.endsWith('.html');
        try {
          const body = html ? await readFile(path.join(output, '404.html')) : 'Not found';
          response.statusCode = 404;
          response.setHeader('Content-Type', html ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8');
          response.setHeader('X-Robots-Tag', 'noindex, nofollow');
          response.setHeader('X-Content-Type-Options', 'nosniff');
          response.end(request.method === 'HEAD' ? undefined : body);
        } catch (error) { next(error); }
      });
    },
  };
}
