'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { BlogPost } from '@/types/blog';
import styles from '@/app/blog/[slug]/blog-post.module.css';
import s from '@/components/shell/shell.module.css';

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
    scrollRef.current?.scrollTo({ top: 0 });
  }, [post.slug]);

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

      {/* ── Article ── */}
      <div ref={scrollRef} className={styles.article}>
        {/* Cover image */}
        {post.cover && (
          <div style={{
            position: 'relative',
            width: '100%',
            height: 260,
            overflow: 'hidden',
            marginBottom: 32,
            borderBottom: '1px solid var(--color-amber-deep)',
          }}>
            <Image
              src={post.cover}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 1024px) 100vw, 70vw"
              priority
            />
          </div>
        )}

        {/* Back + meta row */}
        <div className={styles.postMeta}>
          <button
            onClick={onBack}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-magenta)', fontSize: 11,
              fontFamily: 'var(--font-mono)', padding: 0,
            }}
          >
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

        <div className={styles.prose}>{content}</div>

        <div className={styles.backLink}>
          <button
            onClick={onBack}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-amber-dim)', fontFamily: 'var(--font-mono)',
              fontSize: 12, padding: 0,
            }}
          >
            ← back to blog
          </button>
        </div>
      </div>

      {/* ── Other posts sidebar ── */}
      {otherPosts.length > 0 && (
        <aside className={s.articleSidebar}>
          <div className={s.articleSidebarHead}>{'// other posts'}</div>
          <div className={s.articleSidebarList}>
            {otherPosts.map(op => (
              <button
                key={op.slug}
                onClick={() => onSelectPost(op.slug)}
                className={s.articleSidebarItem}
                style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', background: 'none' }}
              >
                <p className={s.articleSidebarItemTitle}>{op.title}</p>
                <span className={s.articleSidebarItemMeta}>{op.date} · {op.readTime}</span>
              </button>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
