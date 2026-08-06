'use client';

import { useEffect, useRef } from 'react';
import type { BlogPost } from '@/types/blog';
import { ReadingRail } from '@/components/blog/ReadingRail';
import styles from '@/app/blog/[slug]/blog-post.module.css';

interface Props {
  post: BlogPost;
  content: React.ReactNode;
  otherPosts: BlogPost[];
  onBack: () => void;
  onSelectPost: (slug: string) => void;
}

export function BlogPostPane({ post, content, otherPosts, onBack, onSelectPost }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 'instant' matters: .article opts into scroll-behavior: smooth, which
    // would otherwise animate a post switch back through the whole article.
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [post.slug]);

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

      {/* ── Article ── */}
      <div ref={scrollRef} className={styles.article} data-article>
        <div className={styles.progressTrack} aria-hidden>
          <div className={styles.progressBar} />
        </div>

        <div className={styles.postMeta}>
          <button type="button" onClick={onBack} className={styles.metaBack}>
            ← blog.md
          </button>
          <span>·</span>
          <time>{post.date}</time>
          <span>·</span>
          <span>{post.readTime}</span>
          {post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>

        <h1 className={styles.postTitle}>{post.title}</h1>
        <p className={styles.postExcerpt}>{post.excerpt}</p>
        <hr className={styles.divider} />

        <div className={styles.prose} data-prose>{content}</div>

        {/* Next steps live at the end, where a finished reader wants them */}
        {otherPosts.length > 0 && (
          <div className={styles.moreReading}>
            <p className={styles.moreReadingHead}>Keep reading</p>
            <div className={styles.moreReadingGrid}>
              {otherPosts.slice(0, 4).map(op => (
                <button
                  key={op.slug}
                  type="button"
                  onClick={() => onSelectPost(op.slug)}
                  className={styles.moreReadingItem}
                >
                  <p className={styles.moreReadingTitle}>{op.title}</p>
                  <span className={styles.moreReadingMeta}>{op.date} · {op.readTime}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.backLink}>
          <button type="button" onClick={onBack}>← all posts</button>
        </div>
      </div>

      {/* ── Table of contents + progress ── */}
      <ReadingRail slug={post.slug} />
    </div>
  );
}
