import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
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
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { meta, content } = post;

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.menubar}>
          <Link href="/#home" className={styles.brand}>⟦ Vibhanshu Sharma ⟧</Link>
          <div className={styles.tabBar}>
            <span className={styles.tab}>
              <span className={styles.tabDot} style={{ background: 'var(--color-md)' }} />
              {meta.slug}.mdx
            </span>
          </div>
        </div>
        <div className={styles.subbar}>
          <div className={styles.breadcrumb}>
            <Link href="/#home">PORTFOLIO.SYS</Link>
            <span>›</span>
            <span>content</span>
            <span>›</span>
            <span>blog</span>
            <span>›</span>
            <span className={styles.breadcrumbCurrent}>{meta.slug}.mdx</span>
          </div>
          <span>Markdown · {meta.readTime} · {meta.date}</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.gutter} aria-hidden>
          {Array.from({ length: 80 }, (_, i) => (
            <span key={i} className={styles.gutterLine} />
          ))}
        </div>

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
            <Link href="/#home">← back to portfolio</Link>
          </div>
        </div>
      </main>

      <footer className={styles.statusbar}>
        <span>● READY</span>
        <span>·</span>
        <span>Markdown</span>
        <span>·</span>
        <span>{meta.readTime}</span>
        <span style={{ flex: 1 }} />
        <span className={styles.statusMode}>OPERATOR</span>
      </footer>
    </div>
  );
}
