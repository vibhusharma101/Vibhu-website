import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { absoluteUrl } from '@/lib/site';
import { bulletList, type MarkdownPage } from '../format';

// A self-closing interactive MDX component on its own line, e.g. <PrsFanOut />
const COMPONENT_LINE = /^\s*<([A-Z]\w*)\b[^>]*\/>\s*$/;
const FENCE = /^\s*(```|~~~)/;

/**
 * MDX source → plain markdown. Interactive components can't be shown as
 * text, so each becomes a pointer to the HTML page. Code blocks are
 * passed through untouched.
 */
export function mdxToMarkdown(source: string, htmlUrl: string): string {
  let inFence = false;
  return source
    .split(/\r?\n/)
    .flatMap(line => {
      if (FENCE.test(line)) inFence = !inFence;
      if (inFence) return [line];
      const component = COMPONENT_LINE.exec(line);
      if (component) return [`> *Interactive demo (${component[1]}) — open the [HTML version](${htmlUrl}) to use it.*`];
      if (/^(import|export)\s/.test(line) || /^\s*\{\/\*.*\*\/\}\s*$/.test(line)) return [];
      return [line];
    })
    .join('\n');
}

export function listBlogPostPaths(): string[] {
  return getAllPosts().map(p => `/blog/${p.slug}`);
}

export async function renderBlogPost({ slug }: Record<string, string>): Promise<MarkdownPage | null> {
  const posts = getAllPosts();
  // getAllPosts() only returns published posts, so drafts 404 here
  const meta = posts.find(p => p.slug === slug);
  const post = meta && (await getPostBySlug(slug));
  if (!meta || !post) return null;

  const path = `/blog/${slug}`;
  const header = [
    `${meta.date} · ${meta.readTime}${meta.tags.length ? ` · Tags: ${meta.tags.join(', ')}` : ''}`,
    meta.tldr.length ? `## TL;DR\n\n${bulletList(meta.tldr)}` : '',
  ].filter(Boolean).join('\n\n');

  return {
    path,
    title: meta.title,
    summary: meta.excerpt,
    lastUpdated: meta.date,
    body: `${header}\n\n${mdxToMarkdown(post.content, absoluteUrl(path)).trim()}`,
    related: [
      ...posts.filter(p => p.slug !== slug).slice(0, 4).map(p => ({ title: p.title, url: `/blog/${p.slug}` })),
      { title: 'All posts', url: '/blog' },
    ],
  };
}
