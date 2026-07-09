'use client';

import { useState } from 'react';
import type { BlogPost } from '@/types/blog';
import s from './panels.module.css';

const PAGE_SIZE = 6;

interface Props {
  posts: BlogPost[];
  onSelectPost: (slug: string) => void;
}

export function BlogListPanel({ posts, onSelectPost }: Props) {
  const [page, setPage] = useState(0);

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

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const pageItems = posts.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className={s.blogGrid}>
      <div className={s.blogGridHeader}>
        <span className={s.blogComingSoonLabel}>{'// blog.md'}</span>
        <span className={s.blogPostCount}>{posts.length} posts</span>
      </div>

      <div className={s.blogScrollArea}>
        <div className={s.blogTileGrid}>
          {pageItems.map((post, i) => (
            <button
              key={post.slug}
              type="button"
              className={`${s.blogTile}${i === 0 && page === 0 ? ` ${s.blogTileLatest}` : ''}`}
              onClick={() => onSelectPost(post.slug)}
            >
              <div className={s.blogTileTop}>
                <span className={s.blogTileReadTime}>{post.readTime}</span>
                <div className={s.blogTileTagRow}>
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className={s.blogTileTag}>{tag}</span>
                  ))}
                </div>
              </div>

              <h2 className={s.blogTileTitle}>{post.title}</h2>
              <p className={s.blogTileExcerpt}>{post.excerpt}</p>

              <div className={s.blogTileMeta}>
                <time dateTime={post.date}>{post.date}</time>
                <span className={s.blogTileCta}>→ read</span>
              </div>
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div className={s.blogPagination}>
            <button
              className={s.blogPaginationBtn}
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              ‹ prev
            </button>
            <span className={s.blogPaginationIndicator}>{page + 1} / {totalPages}</span>
            <button
              className={s.blogPaginationBtn}
              disabled={page === totalPages - 1}
              onClick={() => setPage(p => p + 1)}
            >
              next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
