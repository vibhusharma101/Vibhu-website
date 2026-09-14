import { ImageResponse } from 'next/og';
import { PANEL_META, resolvedPanelTitle } from '@/lib/panel-metadata';
import { renderOgImage, ogImageSize } from '@/lib/og-image';
import type { PanelId } from '@/types/panel';

const PANELS: PanelId[] = ['home', 'work', 'projects', 'about', 'contact', 'blog'];

export const alt = 'Vibhanshu Sharma';
export const size = ogImageSize;
export const contentType = 'image/png';

export default async function OpengraphImage({ params }: { params: Promise<{ panel: string }> }) {
  const { panel } = await params;
  const panelId = (PANELS.includes(panel as PanelId) ? panel : 'home') as PanelId;
  const meta = PANEL_META[panelId];
  const heading = resolvedPanelTitle(panelId).replace(' — Vibhanshu Sharma', '');

  return new ImageResponse(
    renderOgImage({
      eyebrow: `${panelId}.tsx`,
      heading,
      subheading: meta.description.split('. ')[0] + '.',
    }),
    { ...size }
  );
}
