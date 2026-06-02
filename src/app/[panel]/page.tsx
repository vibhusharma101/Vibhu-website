import { redirect } from 'next/navigation';
import { ShellPage } from '@/components/shell/ShellPage';
import type { PanelId } from '@/types/panel';

const PANELS: PanelId[] = ['home', 'work', 'projects', 'about', 'contact', 'blog'];

export function generateStaticParams() {
  return PANELS.map(panel => ({ panel }));
}

export default async function PanelPage({ params }: { params: Promise<{ panel: string }> }) {
  const { panel } = await params;
  if (!PANELS.includes(panel as PanelId)) redirect('/home');
  return <ShellPage initialPanel={panel as PanelId} />;
}
