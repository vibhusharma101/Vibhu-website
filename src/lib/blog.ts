import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { BlogPost } from '@/types/blog';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(filename => {
      const slug    = filename.replace(/\.mdx$/, '');
      const raw     = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
      const { data } = matter(raw);
      const rt      = readingTime(raw);
      return {
        slug,
        title:     data.title    ?? slug,
        excerpt:   data.excerpt  ?? '',
        date:      data.date     ?? '',
        readTime:  data.readTime ?? rt.text,
        tags:      data.tags     ?? [],
        published: data.published ?? false,
        cover:     data.cover    ?? undefined,
      } satisfies BlogPost;
    })
    .filter(p => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<{ meta: BlogPost; content: string } | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw      = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const rt       = readingTime(raw);

  const meta: BlogPost = {
    slug,
    title:     data.title    ?? slug,
    excerpt:   data.excerpt  ?? '',
    date:      data.date     ?? '',
    readTime:  data.readTime ?? rt.text,
    tags:      data.tags     ?? [],
    published: data.published ?? false,
    cover:     data.cover    ?? undefined,
  };

  return { meta, content };
}
