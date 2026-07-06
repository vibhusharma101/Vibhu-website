import { workex } from '@/data/workex';
import { projects } from '@/data/projects';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { VSCodeShell } from './VSCodeShell';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import type { PanelId } from '@/types/panel';
import { ComparisonToggle, HookTrace, TryItChecklist, LayerModel, MidpointProof, ComplexityTable, SearchRaceVisualizer } from '@/components/blog/BlogMdxComponents';

const mdxComponents = { ComparisonToggle, HookTrace, TryItChecklist, LayerModel, MidpointProof, ComplexityTable, SearchRaceVisualizer };

interface Props {
  initialPanel: PanelId;
}

export async function ShellPage({ initialPanel }: Props) {
  const posts = getAllPosts();

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
              components={mdxComponents}
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
      initialPanel={initialPanel}
      workex={workex}
      projects={projects}
      posts={posts}
      blogContents={blogContents}
    />
  );
}
