import { absoluteUrl } from '@/lib/site';

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Accept',
};

/** Set by middleware when it served markdown because of the Accept header. */
export const NEGOTIATED_HEADER = 'x-md-negotiated';

interface MarkdownResponseOptions {
  status?: number;
  /** Canonical HTML path of the page this markdown mirrors */
  canonicalPath?: string;
  lastModified?: string;
  /** s-maxage in seconds */
  maxAge?: number;
}

export function markdownResponse(request: Request, body: string, opts: MarkdownResponseOptions = {}) {
  const { status = 200, canonicalPath, lastModified, maxAge = 3600 } = opts;
  const headers = new Headers({
    ...CORS_HEADERS,
    'Content-Type': 'text/markdown; charset=utf-8',
    'X-Markdown-Tokens': String(Math.ceil(body.length / 4)),
    // The HTML page stays canonical so search engines don't index duplicates
    'X-Robots-Tag': 'noindex, follow',
    'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=86400`,
  });
  if (canonicalPath) {
    const canonical = absoluteUrl(canonicalPath);
    headers.set('Content-Location', canonical);
    headers.set('Link', `<${canonical}>; rel="canonical"`);
  }
  if (lastModified) {
    const date = new Date(lastModified);
    if (!Number.isNaN(date.getTime())) headers.set('Last-Modified', date.toUTCString());
  }
  if (request.headers.get(NEGOTIATED_HEADER)) headers.set('Vary', 'Accept');

  return new Response(request.method === 'HEAD' ? null : body, { status, headers });
}

// For force-static routes: don't read the Request there — static prerendering
// can't access it, and Next answers HEAD for static routes itself.
export function textResponse(body: string, contentType = 'text/plain; charset=utf-8') {
  return new Response(body, {
    headers: {
      ...CORS_HEADERS,
      'Content-Type': contentType,
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}

export function preflightResponse() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
