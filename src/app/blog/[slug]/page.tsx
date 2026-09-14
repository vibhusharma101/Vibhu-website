import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { BlogShell } from '@/components/blog/BlogShell';
import { mdxComponents } from '@/components/blog/mdxComponents';
import styles from './blog-post.module.css';

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const { meta } = post;
  const resolvedTitle = `${meta.title} — Vibhanshu Sharma`;
  return {
    title: meta.title,
    description: meta.excerpt,
    keywords: meta.tags,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: resolvedTitle,
      description: meta.excerpt,
      url: `/blog/${slug}`,
      type: 'article',
      publishedTime: meta.date,
      tags: meta.tags,
    },
    twitter: {
      title: resolvedTitle,
      description: meta.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allPosts = getAllPosts();
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { meta, content } = post;

  const otherPosts = allPosts.filter(p => p.slug !== slug);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    description: meta.excerpt,
    datePublished: meta.date,
    author: { '@type': 'Person', name: 'Vibhanshu Sharma', url: 'https://www.viiforwin.in' },
    url: `https://www.viiforwin.in/blog/${slug}`,
    keywords: meta.tags.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogShell
        posts={allPosts}
        activeSlug={slug}
        tabFile={`${slug}.mdx`}
        statusLine={`Markdown · ${meta.readTime} · ${meta.date}`}
      >
        <div className={styles.article} data-article>
          <div className={styles.progressTrack} aria-hidden>
            <div className={styles.progressBar} />
          </div>

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

          <div className={styles.prose} data-prose>
            <MDXRemote
              source={content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkMath],
                  rehypePlugins: [
                    rehypeKatex as never,
                    [rehypePrettyCode as never, {
                      theme: 'one-dark-pro',
                      keepBackground: true,
                    }],
                  ],
                },
              }}
            />
          </div>

          {/* Next steps live at the end, where a finished reader wants them */}
          {otherPosts.length > 0 && (
            <div className={styles.moreReading}>
              <p className={styles.moreReadingHead}>Keep reading</p>
              <div className={styles.moreReadingGrid}>
                {otherPosts.slice(0, 4).map(p => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className={styles.moreReadingItem}>
                    <p className={styles.moreReadingTitle}>{p.title}</p>
                    <span className={styles.moreReadingMeta}>{p.date} · {p.readTime}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className={styles.backLink}>
            <Link href="/blog">← all posts</Link>
          </div>
        </div>
      </BlogShell>
    </>
  );
}
