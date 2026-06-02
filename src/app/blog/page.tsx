import { getAllPosts } from '@/lib/blog';
import { BlogShell } from '@/components/blog/BlogShell';
import s from '@/components/panels/panels.module.css';

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <BlogShell posts={posts} activeSlug={null} tabFile="index.md" statusLine="Markdown · blog index">
      <div className={s.panelBody}>
        <p className={s.codeComment}>blog — thoughts on engineering, startups, and building</p>
        <div style={{ height: 28 }} />

        {posts.length === 0 ? (
          <p style={{ color: 'var(--color-amber-dim)', fontSize: 13 }}>
            {'// no posts yet — check back soon'}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 680 }}>
            {posts.map(post => (
              <a key={post.slug} href={`/blog/${post.slug}`} className={s.blogCard}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                  <time style={{ fontSize: 11, color: 'var(--color-amber-dim)' }}>{post.date}</time>
                  <span style={{ fontSize: 11, color: 'var(--color-amber-dim)' }}>·</span>
                  <span style={{ fontSize: 11, color: 'var(--color-amber-dim)' }}>{post.readTime}</span>
                  {post.tags.map(t => (
                    <span key={t} style={{
                      fontSize: 9.5,
                      color: 'var(--color-amber-dim)',
                      border: '1px solid var(--color-amber-deep)',
                      padding: '1px 6px',
                      letterSpacing: '0.06em',
                    }}>{t}</span>
                  ))}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 18,
                  color: 'var(--color-amber-text)',
                  marginBottom: 6,
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}>{post.title}</h3>
                <p style={{
                  fontSize: 13,
                  color: 'var(--color-amber-dim)',
                  lineHeight: 1.65,
                  marginBottom: 10,
                }}>{post.excerpt}</p>
                <span style={{ fontSize: 11, color: 'var(--color-magenta)' }}>read →</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </BlogShell>
  );
}
