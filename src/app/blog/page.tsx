import { getAllPosts } from '@/lib/blog';
import { BlogShell } from '@/components/blog/BlogShell';
import { BlogListPanel } from '@/components/panels/BlogListPanel';

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <BlogShell posts={posts} activeSlug={null} tabFile="index.md" statusLine="Markdown · blog index">
      <BlogListPanel posts={posts} />
    </BlogShell>
  );
}
