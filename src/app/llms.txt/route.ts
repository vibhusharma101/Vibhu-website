// Keep in sync with /robots.txt and /ai.txt — all three read src/lib/site.ts.
import { bio } from '@/data/bio';
import { listMarkdownRoutes } from '@/lib/md/registry';
import { linkList } from '@/lib/md/format';
import { textResponse } from '@/lib/md/http';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

export const dynamic = 'force-static';
export const revalidate = 86400;

const MAX_POSTS = 50;

export async function GET(request: Request) {
  const routes = await listMarkdownRoutes();
  const toLinks = (section: 'core' | 'blog') =>
    routes
      .filter(r => r.info.section === section)
      .map(r => ({ title: r.info.title, url: r.info.markdownUrl, description: r.info.summary }));

  const blog = toLinks('blog');
  const body = [
    `# ${SITE_NAME}`,
    `> ${SITE_DESCRIPTION}`,
    `${bio.name} — ${bio.currentRole}. Based in ${bio.location}. ${bio.awards.join('. ')}. ` +
      `${bio.stats.companiesFounded} companies founded, ${bio.stats.yearsShipping} years shipping software, ` +
      `products used by ${bio.stats.usersReached} users. Contact: ${bio.email}.`,
    `## Core pages\n\n${linkList(toLinks('core'))}`,
    `## Blog\n\n${linkList(blog.slice(0, MAX_POSTS))}` +
      (blog.length > MAX_POSTS ? `\n\nShowing ${MAX_POSTS} of ${blog.length}; the full list is at /blog.md.` : ''),
    `## Machine-readable\n\n${linkList([
      { title: 'Full content', url: '/llms-full.txt', description: 'every page above in one file' },
      { title: 'Markdown catalog', url: '/api/md/_catalog', description: 'JSON list of every markdown page' },
      { title: 'Sitemap', url: '/sitemap.xml' },
      { title: 'AI usage policy', url: '/ai.txt' },
    ])}`,
  ];

  return textResponse(request, `${body.join('\n\n')}\n`);
}
