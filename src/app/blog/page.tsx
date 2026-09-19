import type { Metadata } from 'next';
import { ShellPage } from '@/components/shell/ShellPage';
import { buildPanelMetadata } from '@/lib/panel-metadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = buildPanelMetadata('blog', '/blog');

const crumbs = [
  { name: 'Home', path: '/home' },
  { name: 'Blog', path: '/blog' },
];

export default function BlogPage() {
  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />
      <ShellPage initialPanel="blog" />
    </>
  );
}
