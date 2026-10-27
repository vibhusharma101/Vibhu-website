import { listMarkdownRoutes, resolveMarkdownPage } from '@/lib/md/registry';
import { renderDocument, link } from '@/lib/md/format';
import { markdownResponse, preflightResponse, CORS_HEADERS } from '@/lib/md/http';
import { absoluteUrl } from '@/lib/site';

type Context = { params: Promise<{ path?: string[] }> };

function notFoundBody(path: string): string {
  return `# Not found\n\nNo page exists at \`${path}\`, so there is no markdown version of it.\n\nSee ${link('llms.txt', '/llms.txt')} for every page on this site.\n`;
}

export async function GET(request: Request, { params }: Context) {
  const segments = (await params).path ?? [];

  if (segments.length === 1 && segments[0] === '_catalog') {
    const routes = await listMarkdownRoutes();
    const catalog = routes.map(({ info }) => ({
      url: absoluteUrl(info.path),
      markdown: absoluteUrl(info.markdownUrl),
      title: info.title,
      summary: info.summary,
      section: info.section,
      ...(info.lastUpdated ? { lastUpdated: info.lastUpdated } : {}),
    }));
    return Response.json(catalog, {
      headers: { ...CORS_HEADERS, 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  }

  // /index.md is the homepage
  const path = segments.length === 1 && segments[0] === 'index' ? '/' : `/${segments.join('/')}`;
  const page = await resolveMarkdownPage(path);
  if (!page) return markdownResponse(request, notFoundBody(path), { status: 404, maxAge: 60 });

  return markdownResponse(request, renderDocument(page), {
    canonicalPath: page.path,
    lastModified: page.lastUpdated,
    maxAge: page.lastUpdated ? 3600 : 86400,
  });
}

export const HEAD = GET;

export function OPTIONS() {
  return preflightResponse();
}
