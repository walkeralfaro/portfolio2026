import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { extname, join, normalize } from 'node:path';

const CONTENT_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

export function startStaticServer(root: string, port: number): Promise<Server> {
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', `http://localhost:${port}`);
    const pathname = decodeURIComponent(url.pathname);
    const candidate = normalize(join(root, pathname));

    if (!candidate.startsWith(normalize(root))) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    let file = candidate;

    if (existsSync(file) && statSync(file).isDirectory()) {
      file = join(file, 'index.html');
    }

    if (!existsSync(file) && !extname(file)) {
      const html = `${file}.html`;
      if (existsSync(html)) file = html;
    }

    if (!existsSync(file)) {
      const notFound = join(root, '404.html');
      response.writeHead(404, { 'content-type': CONTENT_TYPES['.html'] });
      if (existsSync(notFound)) {
        createReadStream(notFound).pipe(response);
      } else {
        response.end('Not found');
      }
      return;
    }

    response.writeHead(200, {
      'content-type': CONTENT_TYPES[extname(file)] ?? 'application/octet-stream',
    });
    createReadStream(file).pipe(response);
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}
