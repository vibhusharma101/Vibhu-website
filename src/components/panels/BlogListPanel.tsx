'use client';

import type { BlogPost } from '@/types/blog';
import { buildBlogSidebarTree } from '@/lib/blog-groups';
import s from './panels.module.css';

interface Props {
  posts: BlogPost[];
  onSelectPost: (slug: string) => void;
}

export function BlogListPanel({ posts, onSelectPost }: Props) {
  if (posts.length === 0) {
    return (
      <div className={s.blogComingSoon}>
        <p className={s.codeComment}>blog.md</p>
        <div className={s.blogComingSoonBody}>
          <span className={s.blogComingSoonLabel}>{'// status'}</span>
          <p className={s.blogComingSoonTitle}>Coming Soon.</p>
          <p className={s.blogComingSoonSub}>
            Writing in progress — thoughts on building companies,{' '}
            AI, and the craft of software. Check back soon.
          </p>
          <div className={s.blogComingSoonMeta}>
            <span className={s.bootPrompt}>→ </span>
            <span className={s.bootValue}>estimated_eta = &quot;soon™&quot;</span>
          </div>
        </div>
      </div>
    );
  }

  const { groups } = buildBlogSidebarTree(posts);

  // Helper to recursively flatten posts for a group display and attach the label
  const flattenGroupPostsWithLabel = (
    group: typeof groups[0],
    parentLabel: string = ''
  ): (BlogPost & { categoryLabel: string })[] => {
    const label = parentLabel ? `${parentLabel} / ${group.label}` : group.label;
    const childPosts = group.subgroups
      ? group.subgroups.flatMap(sg => flattenGroupPostsWithLabel(sg, label))
      : [];
    const directPosts = group.posts.map(p => ({ ...p, categoryLabel: label }));
    return [...directPosts, ...childPosts];
  };

  const allPosts = groups
    .flatMap(g => flattenGroupPostsWithLabel(g))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className={s.blogGrid}>
      {/* Sticky header */}
      <div className={s.blogGridHeader}>
        <span className={s.blogComingSoonLabel}>{'// blog.md'}</span>
        <span className={s.blogPostCount}>{posts.length} posts</span>
      </div>

      <div className={s.blogTileGrid}>
        {allPosts.map(post => (
          <button
            key={post.slug}
            type="button"
            className={s.blogTile}
            onClick={() => onSelectPost(post.slug)}
          >
            <h3 className={s.blogTileTitle}>{post.title}</h3>
            <p className={s.blogTileExcerpt}>{post.excerpt}</p>
            <div className={s.blogTileMeta}>
              <span>
                <span className={s.blogTileCategory}>{post.categoryLabel}</span>
                <time dateTime={post.date}>{post.date}</time>
                {' · '}
                {post.readTime}
              </span>
              <span className={s.blogTileCta}>→ read</span>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom spacer so chat button doesn't cover last card */}
      <div style={{ height: 80, flexShrink: 0 }} />
    </div>
  );
}
