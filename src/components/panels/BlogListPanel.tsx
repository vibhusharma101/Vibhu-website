'use client';

import type { BlogPost } from '@/types/blog';
import s from './panels.module.css';

interface Props {
  posts: BlogPost[];
  onSelectPost?: (slug: string) => void;
}

function PostCard({ post, onSelect, className }: { post: BlogPost; onSelect?: () => void; className: string }) {
  const inner = (
    <>
      <span className={s.blogFeaturedLabel}>{'// featured'}</span>
      <h2 className={s.blogFeaturedTitle}>{post.title}</h2>
      <p className={s.blogFeaturedExcerpt}>{post.excerpt}</p>
      <div className={s.blogFeaturedMeta}>
        <time>{post.date}</time>
        <span>·</span>
        <span>{post.readTime}</span>
        {post.tags.map(t => <span key={t} className={s.blogTag}>{t}</span>)}
      </div>
      <span className={s.blogFeaturedCta}>read article →</span>
    </>
  );
  return onSelect
    ? <button className={className} onClick={onSelect}>{inner}</button>
    : <a href={`/blog/${post.slug}`} className={className}>{inner}</a>;
}

function SideItem({ post, onSelect }: { post: BlogPost; onSelect?: () => void }) {
  const inner = (
    <div className={s.blogSideItemInner}>
      <span className={s.blogSideDot} />
      <div>
        <p className={s.blogSideTitle}>{post.title}</p>
        <p className={s.blogSideExcerpt}>{post.excerpt}</p>
        <span className={s.blogSideMeta}>{post.date} · {post.readTime}</span>
      </div>
    </div>
  );
  return onSelect
    ? <button className={s.blogSideItem} onClick={onSelect}>{inner}</button>
    : <a href={`/blog/${post.slug}`} className={s.blogSideItem}>{inner}</a>;
}

export function BlogListPanel({ posts, onSelectPost }: Props) {
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
        <PostCard
          post={featured}
          onSelect={onSelectPost ? () => onSelectPost(featured.slug) : undefined}
          className={s.blogFeatured}
        />

        <div className={s.blogSideList}>
          <div className={s.blogSideHeader}>{'// top stories'}</div>
          {rest.map(post => (
            <SideItem
              key={post.slug}
              post={post}
              onSelect={onSelectPost ? () => onSelectPost(post.slug) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
