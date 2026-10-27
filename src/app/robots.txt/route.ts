// Keep in sync with /llms.txt and /ai.txt — all three read src/lib/site.ts.
// A plain route instead of robots.ts because MetadataRoute.Robots can't emit comments.
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

// AI search / user-fetch crawlers: these decide whether answer engines can cite the site.
const AI_SEARCH_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User'];

// AI training crawlers: allowed by choice. Blocking them would not affect the search bots above.
const AI_TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bytespider'];

// A crawler that matches a named group ignores `*`, so every group repeats these rules.
const RULES = ['Allow: /', 'Allow: /api/md/', 'Disallow: /api/'];

function group(agents: string[]): string {
  return [...agents.map(agent => `User-agent: ${agent}`), ...RULES].join('\n');
}

export function GET() {
  const body = [
    `# AI-readable site map: ${SITE_URL}/llms.txt`,
    `# AI usage policy: ${SITE_URL}/ai.txt`,
    `# Every page has a markdown version at <url>.md (noindex; the HTML page is canonical).`,
    '',
    '# AI search and user-fetch crawlers',
    group(AI_SEARCH_BOTS),
    '',
    '# AI training crawlers',
    group(AI_TRAINING_BOTS),
    '',
    group(['*']),
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
