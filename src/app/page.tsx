import { workex } from '@/data/workex';
import { projects } from '@/data/projects';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { VSCodeShell } from '@/components/shell/VSCodeShell';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';

export default async function Home() {
  const posts = getAllPosts();

  // Pre-render every post's MDX on the server so the shell can switch
  // between them instantly with no navigation or network request.
  const blogContents: { slug: string; content: React.ReactNode }[] =
    await Promise.all(
      posts.map(async (post) => {
        const data = await getPostBySlug(post.slug);
        if (!data) return { slug: post.slug, content: null };
        return {
          slug: post.slug,
          content: (
            <MDXRemote
              source={data.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    [rehypePrettyCode as never, { theme: 'one-dark-pro', keepBackground: true }],
                  ],
                },
              }}
            />
          ),
        };
      })
    );

  return (
    <VSCodeShell
      workex={workex}
      projects={projects}
      posts={posts}
      blogContents={blogContents}
    />
  );
}
