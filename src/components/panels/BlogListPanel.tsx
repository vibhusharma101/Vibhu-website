'use client';

import { useEffect, useRef, useState } from 'react';
import type { BlogPost } from '@/types/blog';
import s from './panels.module.css';

const PAGE_SIZE = 6;

interface Props {
  posts: BlogPost[];
  onSelectPost: (slug: string) => void;
}

export function BlogListPanel({ posts, onSelectPost }: Props) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(v => Math.min(v + PAGE_SIZE, posts.length));
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [posts.length]);

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

  const [featured, ...rest] = posts;
  const visibleRest = rest.slice(0, visible - 1);
  const hasMore = visible < posts.length;

  return (
    <div className={s.blogGrid}>
      {/* Sticky header */}
      <div className={s.blogGridHeader}>
        <span className={s.blogComingSoonLabel}>{'// blog.md'}</span>
        <span className={s.blogPostCount}>{posts.length} posts</span>
      </div>

      {/* Featured — latest post, full width */}
      <button
        type="button"
        className={s.blogFeaturedStrip}
        onClick={() => onSelectPost(featured.slug)}
      >
        <div className={s.blogFeaturedStripInner}>
          <div className={s.blogFeaturedStripLeft}>
            <span className={s.blogFeaturedLabel}>LATEST POST</span>
            <h2 className={s.blogFeaturedStripTitle}>{featured.title}</h2>
            <p className={s.blogFeaturedStripExcerpt}>{featured.excerpt}</p>
          </div>
          <div className={s.blogFeaturedStripRight}>
            <div className={s.blogFeaturedStripMeta}>
              <time dateTime={featured.date}>{featured.date}</time>
              <span>·</span>
              <span>{featured.readTime}</span>
            </div>
            <div className={s.blogTileTagRow}>
              {featured.tags.slice(0, 3).map(tag => (
                <span key={tag} className={s.blogTileTag}>{tag}</span>
              ))}
            </div>
            <span className={s.blogFeaturedStripCta}>→ read post</span>
          </div>
        </div>
      </button>

      {/* Tile grid — all remaining visible posts */}
      {visibleRest.length > 0 && (
        <div className={s.blogTileGrid}>
          {visibleRest.map(post => (
            <button
              key={post.slug}
              type="button"
              className={s.blogTile}
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
              <h3 className={s.blogTileTitle}>{post.title}</h3>
              <p className={s.blogTileExcerpt}>{post.excerpt}</p>
              <div className={s.blogTileMeta}>
                <time dateTime={post.date}>{post.date}</time>
                <span className={s.blogTileCta}>→ read</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className={s.blogInfiniteLoader}>
          <span className={s.blogLoadingDot} />
          <span className={s.blogLoadingDot} />
          <span className={s.blogLoadingDot} />
        </div>
      )}

      {/* Bottom spacer so chat button doesn't cover last card */}
      <div style={{ height: 80, flexShrink: 0 }} />
    </div>
  );
}
