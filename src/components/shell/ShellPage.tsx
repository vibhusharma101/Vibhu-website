import { workex } from '@/data/workex';
import { projects } from '@/data/projects';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { VSCodeShell } from './VSCodeShell';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { PanelId } from '@/types/panel';
import { ComparisonToggle, HookTrace, TryItChecklist, LayerModel, MidpointProof, ComplexityTable, SearchRaceVisualizer, JobStateVisualizer, SecurityLayerDiagram, FailModeCompare, ManifestMapper, URLRiskChecker } from '@/components/blog/BlogMdxComponents';

const mdxComponents = { ComparisonToggle, HookTrace, TryItChecklist, LayerModel, MidpointProof, ComplexityTable, SearchRaceVisualizer, JobStateVisualizer, SecurityLayerDiagram, FailModeCompare, ManifestMapper, URLRiskChecker };

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
                  remarkPlugins: [remarkGfm, remarkMath],
                  rehypePlugins: [
                    rehypeKatex as never,
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
