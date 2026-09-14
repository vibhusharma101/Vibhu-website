import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { TABS } from '@/types/panel';

const BASE_URL = 'https://www.viiforwin.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const panelRoutes: MetadataRoute.Sitemap = TABS.map(tab => ({
    url: `${BASE_URL}/${tab.id}`,
    lastModified: new Date(),
    changeFrequency: tab.id === 'blog' ? 'weekly' : 'monthly',
    priority: tab.id === 'home' ? 1 : 0.7,
  }));

  const posts = getAllPosts();
  const postRoutes: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...panelRoutes, ...postRoutes];
}
