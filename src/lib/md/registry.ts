import { MARKDOWN_ROUTES, matchMarkdownRoute, type MarkdownRoute } from './routes';
import type { MarkdownPage } from './format';
import {
  renderHome,
  renderWork,
  renderProjects,
  renderAbout,
  renderContact,
  renderBlogIndex,
} from './renderers/panels';
import { renderBlogPost, listBlogPostPaths } from './renderers/blog-post';

export type MarkdownSection = 'core' | 'blog';

interface RendererEntry {
  section: MarkdownSection;
  render: (params: Record<string, string>) => MarkdownPage | null | Promise<MarkdownPage | null>;
  /** Concrete paths for a dynamic route; static routes list themselves */
  paths?: () => string[];
  /** Alias of another route (e.g. / mirrors /home); left out of listings */
  alias?: boolean;
}

/**
 * Route → markdown renderer. To give a new page a markdown version, add
 * its route to MARKDOWN_ROUTES in ./routes.ts and a renderer here —
 * llms.txt, llms-full.txt and the catalog pick it up automatically.
 */
const RENDERERS: Record<MarkdownRoute, RendererEntry> = {
  '/':             { section: 'core', render: renderHome, alias: true },
  '/home':         { section: 'core', render: renderHome },
  '/work':         { section: 'core', render: renderWork },
  '/projects':     { section: 'core', render: renderProjects },
  '/about':        { section: 'core', render: renderAbout },
  '/contact':      { section: 'core', render: renderContact },
  '/blog':         { section: 'blog', render: renderBlogIndex },
  '/blog/[slug]':  { section: 'blog', render: renderBlogPost, paths: listBlogPostPaths },
};

export async function resolveMarkdownPage(path: string): Promise<MarkdownPage | null> {
  const match = matchMarkdownRoute(path);
  if (!match) return null;
  return RENDERERS[match.route].render(match.params);
}

export interface MarkdownRouteInfo {
  path: string;
  markdownUrl: string;
  title: string;
  summary: string;
  section: MarkdownSection;
  lastUpdated?: string;
}

/** Every addressable markdown page, core pages first. */
export async function listMarkdownRoutes(): Promise<{ info: MarkdownRouteInfo; page: MarkdownPage }[]> {
  const out: { info: MarkdownRouteInfo; page: MarkdownPage }[] = [];
  for (const route of MARKDOWN_ROUTES) {
    const entry = RENDERERS[route];
    if (entry.alias) continue;
    for (const path of entry.paths?.() ?? [route]) {
      const page = await resolveMarkdownPage(path);
      if (!page) continue;
      out.push({
        page,
        info: {
          path,
          markdownUrl: `${path}.md`,
          title: page.title,
          summary: page.summary,
          section: entry.section,
          lastUpdated: page.lastUpdated,
        },
      });
    }
  }
  return out;
}
