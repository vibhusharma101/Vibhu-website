import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ShellPage } from '@/components/shell/ShellPage';
import type { PanelId } from '@/types/panel';
import { buildPanelMetadata, PANEL_META } from '@/lib/panel-metadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { WebSiteJsonLd } from '@/components/seo/WebSiteJsonLd';

// 'blog' is included so the shell's client-side tab state stays consistent, but the
// static route at src/app/blog/page.tsx always wins for the URL /blog — see that
// file for blog's actual metadata.
const PANELS: PanelId[] = ['home', 'work', 'projects', 'about', 'contact', 'blog'];

// Only the panels above exist. Any other single-segment path is a real 404 —
// redirecting it to /home made Google index junk URLs (e.g. paths it lifted
// from blog code samples) as "Page with redirect".
export const dynamicParams = false;

export function generateStaticParams() {
  return PANELS.map(panel => ({ panel }));
}

export async function generateMetadata({ params }: { params: Promise<{ panel: string }> }): Promise<Metadata> {
  const { panel } = await params;
  if (!PANELS.includes(panel as PanelId)) return {};
  return buildPanelMetadata(panel as PanelId, `/${panel}`);
}

export default async function PanelPage({ params }: { params: Promise<{ panel: string }> }) {
  const { panel } = await params;
  if (!PANELS.includes(panel as PanelId)) notFound();
  const panelId = panel as PanelId;

  const crumbs =
    panelId === 'home'
      ? [{ name: 'Home', path: '/home' }]
      : [{ name: 'Home', path: '/home' }, { name: PANEL_META[panelId].title ?? panelId, path: `/${panelId}` }];

  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />
      {panelId === 'home' && <WebSiteJsonLd />}
      <ShellPage initialPanel={panelId} />
    </>
  );
}
