import type { BlogPost } from '@/types/blog';

export interface BlogGroup {
  id: string;
  label: string;
  posts: BlogPost[];
}

export interface BlogSidebarTree {
  groups: BlogGroup[];
  standalone: BlogPost[];
}

/*
 * Priority-ordered: a post is claimed by the first group whose tag it
 * carries. A group only becomes a folder once it actually groups
 * something (>= 2 posts) — a "folder" holding one file is just an
 * extra click to the same content.
 */
const GROUP_DEFS: { id: string; label: string; tag: string; sort: 'slug' | 'date' }[] = [
  { id: 'prs-series',     label: 'prs-series',     tag: 'prs-series', sort: 'slug' },
  { id: 'security',       label: 'security',       tag: 'security',   sort: 'date' },
  { id: 'claude-code',    label: 'claude-code',    tag: 'claude-code', sort: 'date' },
  { id: 'systems-design', label: 'systems-design', tag: 'architecture', sort: 'date' },
];

export function buildBlogSidebarTree(posts: BlogPost[]): BlogSidebarTree {
  const used = new Set<string>();

  const groups: BlogGroup[] = GROUP_DEFS.map(def => {
    const matched = posts.filter(p => p.tags.includes(def.tag) && !used.has(p.slug));
    const sorted = [...matched].sort((a, b) =>
      def.sort === 'slug' ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)
    );
    sorted.forEach(p => used.add(p.slug));
    return { id: def.id, label: def.label, posts: sorted };
  }).filter(g => g.posts.length >= 2);

  const standalone = posts.filter(p => !used.has(p.slug));

  return { groups, standalone };
}
