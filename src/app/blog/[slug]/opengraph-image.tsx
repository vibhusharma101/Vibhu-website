import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/blog';
import { renderOgImage, ogImageSize } from '@/lib/og-image';

export const alt = 'Vibhanshu Sharma — Blog';
export const size = ogImageSize;
export const contentType = 'image/png';

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return new ImageResponse(
    renderOgImage({
      eyebrow: `${slug}.mdx`,
      heading: post?.meta.title ?? 'Vibhanshu Sharma',
      subheading: post?.meta.excerpt ?? '',
      tag: post?.meta.readTime,
    }),
    { ...size }
  );
}
