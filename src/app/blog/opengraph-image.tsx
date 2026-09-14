import { ImageResponse } from 'next/og';
import { PANEL_META, resolvedPanelTitle } from '@/lib/panel-metadata';
import { renderOgImage, ogImageSize } from '@/lib/og-image';

export const alt = 'Blog — Vibhanshu Sharma';
export const size = ogImageSize;
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const meta = PANEL_META.blog;
  const heading = resolvedPanelTitle('blog').replace(' — Vibhanshu Sharma', '');

  return new ImageResponse(
    renderOgImage({
      eyebrow: 'blog.md',
      heading,
      subheading: meta.description.split('. ')[0] + '.',
    }),
    { ...size }
  );
}
