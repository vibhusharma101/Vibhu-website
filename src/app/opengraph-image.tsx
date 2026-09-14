import { ImageResponse } from 'next/og';
import { bio } from '@/data/bio';
import { renderOgImage, ogImageSize } from '@/lib/og-image';

export const alt = 'Vibhanshu Sharma — AI Engineer & Founder';
export const size = ogImageSize;
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    renderOgImage({
      eyebrow: 'vibhanshu.tsx',
      heading: bio.name,
      subheading: 'AI Engineer & 2x Founder',
      tag: bio.currentRole,
    }),
    { ...size }
  );
}
