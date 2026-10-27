import { NextResponse, type NextRequest } from 'next/server';
import { matchMarkdownRoute } from '@/lib/md/routes';

const NEGOTIATED_HEADER = 'x-md-negotiated'; // mirrors src/lib/md/http.ts (not edge-safe to import)

const DESCRIBED_BY = ['/llms.txt', '/llms-full.txt', '/ai.txt']
  .map(path => `<${path}>; rel="describedby"`)
  .join(', ');

/**
 * Serve markdown only when text/markdown is asked for explicitly and
 * outranks HTML. A missing Accept or a bare `*\/*` always gets HTML, so
 * browsers, curl and link previews are unaffected.
 */
function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const q: Record<string, number> = {};
  for (const part of accept.split(',')) {
    const [type, ...params] = part.trim().toLowerCase().split(';');
    const qParam = params.map(p => p.trim()).find(p => p.startsWith('q='));
    const value = qParam ? Number(qParam.slice(2)) : 1;
    q[type.trim()] = Number.isNaN(value) ? 0 : value;
  }
  const markdown = q['text/markdown'] ?? 0;
  const html = q['text/html'] ?? q['text/*'] ?? q['*/*'] ?? 0;
  return markdown > 0 && markdown > html;
}

function toMarkdownHandler(request: NextRequest, path: string, negotiated: boolean) {
  const url = request.nextUrl.clone();
  url.pathname = `/api/md${path === '/' ? '/index' : path}`;
  const headers = new Headers(request.headers);
  if (negotiated) headers.set(NEGOTIATED_HEADER, '1');
  return NextResponse.rewrite(url, { request: { headers } });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /pricing.md → markdown of /pricing; unknown paths get a markdown 404
  if (pathname.endsWith('.md')) {
    const path = pathname.slice(0, -3);
    return toMarkdownHandler(request, path === '/index' ? '/' : path, false);
  }

  const isContentRoute = matchMarkdownRoute(pathname) !== null;
  if (isContentRoute && prefersMarkdown(request.headers.get('accept'))) {
    return toMarkdownHandler(request, pathname, true);
  }

  const response = NextResponse.next();
  response.headers.set('Link', DESCRIBED_BY);
  if (isContentRoute) response.headers.set('Vary', 'Accept');
  return response;
}

export const config = {
  // Skip API routes, Next internals, .well-known and any file with an extension other than .md
  matcher: ['/((?!api/|_next/|\\.well-known/)(?!.*\\.(?!md$)[a-z0-9]+$).*)'],
};
