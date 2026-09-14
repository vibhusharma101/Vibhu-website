import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ShellPage } from '@/components/shell/ShellPage';
import type { PanelId } from '@/types/panel';
import { buildPanelMetadata } from '@/lib/panel-metadata';

// 'blog' is included so the shell's client-side tab state stays consistent, but the
// static route at src/app/blog/page.tsx always wins for the URL /blog — see that
// file for blog's actual metadata.
const PANELS: PanelId[] = ['home', 'work', 'projects', 'about', 'contact', 'blog'];

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
  if (!PANELS.includes(panel as PanelId)) redirect('/home');
  return <ShellPage initialPanel={panel as PanelId} />;
}
