import { workex } from '@/data/workex';
import { projects } from '@/data/projects';
import { getAllPosts } from '@/lib/blog';
import { VSCodeShell } from '@/components/shell/VSCodeShell';

export default async function Home() {
  const posts = getAllPosts();
  return <VSCodeShell workex={workex} projects={projects} posts={posts} />;
}
