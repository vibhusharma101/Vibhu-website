import type { Metadata } from 'next';
import { ShellPage } from '@/components/shell/ShellPage';
import { buildPanelMetadata } from '@/lib/panel-metadata';

export const metadata: Metadata = buildPanelMetadata('blog', '/blog');

export default function BlogPage() {
  return <ShellPage initialPanel="blog" />;
}
