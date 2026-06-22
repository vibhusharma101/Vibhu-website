import type { BlogPost } from '@/types/blog';
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

  const [featured, ...rest] = posts;

  return (
    <div className={s.blogGrid}>
      <div className={s.blogGridHeader}>
        <span className={s.blogComingSoonLabel}>{'// blog.md'}</span>
      </div>

      <div className={s.blogGridMain}>
        {/* ── Featured post ── */}
        <button
          type="button"
          className={s.blogFeatured}
          onClick={() => onSelectPost(featured.slug)}
        >
          <span className={s.blogFeaturedLabel}>LATEST POST</span>
          <h2 className={s.blogFeaturedTitle}>{featured.title}</h2>
          <p className={s.blogFeaturedExcerpt}>{featured.excerpt}</p>
          <div className={s.blogFeaturedMeta}>
            <time>{featured.date}</time>
            <span>·</span>
            <span>{featured.readTime}</span>
            {featured.tags.map(tag => (
              <span key={tag} className={s.blogTag}>{tag}</span>
            ))}
          </div>
          <span className={s.blogFeaturedCta}>→ read post</span>
        </button>

        {/* ── Side list ── */}
        {rest.length > 0 && (
          <aside className={s.blogSideList}>
            <div className={s.blogSideHeader}>MORE POSTS</div>
            {rest.map(post => (
              <button
                key={post.slug}
                type="button"
                className={s.blogSideItem}
                onClick={() => onSelectPost(post.slug)}
                style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', background: 'none' }}
              >
                <div className={s.blogSideItemInner}>
                  <span className={s.blogSideDot} />
                  <div>
                    <p className={s.blogSideTitle}>{post.title}</p>
                    <p className={s.blogSideExcerpt}>{post.excerpt}</p>
                    <span className={s.blogSideMeta}>{post.date} · {post.readTime}</span>
                  </div>
                </div>
              </button>
            ))}
          </aside>
        )}
      </div>
    </div>
  );
}
