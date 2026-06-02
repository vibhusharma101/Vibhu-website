'use client';

import type { BlogPost } from '@/types/blog';
import s from './panels.module.css';

interface Props {
  posts: BlogPost[];
}

export function BlogListPanel({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <div className={s.panelBody}>
        <p className={s.codeComment}>blog.md — no posts yet, check back soon</p>
      </div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div className={s.blogGrid}>
      <div className={s.blogGridHeader}>
        <span className={s.codeComment}>blog.md — {posts.length} article{posts.length !== 1 ? 's' : ''}</span>
      </div>

      <div className={s.blogGridMain}>
        {/* ── Featured post ── */}
        <a href={`/blog/${featured.slug}`} className={s.blogFeatured}>
          <span className={s.blogFeaturedLabel}>{'// featured'}</span>
          <h2 className={s.blogFeaturedTitle}>{featured.title}</h2>
          <p className={s.blogFeaturedExcerpt}>{featured.excerpt}</p>
          <div className={s.blogFeaturedMeta}>
            <time>{featured.date}</time>
            <span>·</span>
            <span>{featured.readTime}</span>
            {featured.tags.map(t => (
              <span key={t} className={s.blogTag}>{t}</span>
            ))}
          </div>
          <span className={s.blogFeaturedCta}>read article →</span>
        </a>

        {/* ── Top stories sidebar ── */}
        <div className={s.blogSideList}>
          <div className={s.blogSideHeader}>{'// top stories'}</div>
          {rest.map(post => (
            <a key={post.slug} href={`/blog/${post.slug}`} className={s.blogSideItem}>
              <div className={s.blogSideItemInner}>
                <span className={s.blogSideDot} />
                <div>
                  <p className={s.blogSideTitle}>{post.title}</p>
                  <p className={s.blogSideExcerpt}>{post.excerpt}</p>
                  <span className={s.blogSideMeta}>{post.date} · {post.readTime}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
