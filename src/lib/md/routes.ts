/**
 * Content routes that have a markdown version.
 *
 * Kept free of imports on purpose: the edge middleware and
 * scripts/check-md-routes.mjs both load this file directly. The
 * renderer for each route lives in ./registry.ts — its Record type
 * fails the typecheck if a route here has no renderer.
 */
export const MARKDOWN_ROUTES = [
  '/',
  '/home',
  '/work',
  '/projects',
  '/about',
  '/contact',
  '/blog',
  '/blog/[slug]',
] as const;

export type MarkdownRoute = (typeof MARKDOWN_ROUTES)[number];

export interface RouteMatch {
  route: MarkdownRoute;
  params: Record<string, string>;
}

export function matchMarkdownRoute(path: string): RouteMatch | null {
  const parts = path.split('/').filter(Boolean);
  for (const route of MARKDOWN_ROUTES) {
    const pattern = route.split('/').filter(Boolean);
    if (pattern.length !== parts.length) continue;
    const params: Record<string, string> = {};
    const ok = pattern.every((seg, i) => {
      const dynamic = /^\[(\w+)\]$/.exec(seg);
      if (dynamic) {
        params[dynamic[1]] = decodeURIComponent(parts[i]);
        return true;
      }
      return seg === parts[i];
    });
    if (ok) return { route, params };
  }
  return null;
}
