import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { BlogShell } from '@/components/blog/BlogShell';
import styles from './blog-post.module.css';

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.meta.title} — Vibhanshu Sharma`,
    description: post.meta.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getPostBySlug(slug), Promise.resolve(getAllPosts())]);
  if (!post) notFound();

  const { meta, content } = post;

  return (
    <BlogShell
      posts={allPosts}
      activeSlug={slug}
      tabFile={`${slug}.mdx`}
      statusLine={`Markdown · ${meta.readTime} · ${meta.date}`}
    >
      <div className={styles.article}>
        <div className={styles.postMeta}>
          <time>{meta.date}</time>
          <span>·</span>
          <span>{meta.readTime}</span>
          <div className={styles.tags}>
            {meta.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>

        <h1 className={styles.postTitle}>{meta.title}</h1>
        <p className={styles.postExcerpt}>{meta.excerpt}</p>
        <hr className={styles.divider} />

        <div className={styles.prose}>
          <MDXRemote
            source={content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  [rehypePrettyCode as never, {
                    theme: 'one-dark-pro',
                    keepBackground: true,
                  }],
                ],
              },
            }}
          />
        </div>

        <div className={styles.backLink}>
          <Link href="/blog">← back to blog</Link>
        </div>
      </div>
    </BlogShell>
  );
}
