import { BlogCard } from '@/components/blog/BlogCard';
import { blogPosts } from '@/data/blog';

export default function Blog() {
  return (
    <main style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px' }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-tight)', marginBottom: '48px' }}>
        Blog
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {blogPosts.map((post) => (
          <BlogCard
            key={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            date={post.date}
            slug={post.slug}
            tags={post.tags}
          />
        ))}
      </div>
    </main>
  );
}
