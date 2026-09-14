import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ShellPage } from '@/components/shell/ShellPage';
import type { PanelId } from '@/types/panel';
import { bio } from '@/data/bio';

const PANELS: PanelId[] = ['home', 'work', 'projects', 'about', 'contact', 'blog'];

const PANEL_META: Record<PanelId, { title?: string; description: string }> = {
  home: {
    description: bio.tagline,
  },
  work: {
    title: 'Work Experience',
    description:
      'Vibhanshu Sharma’s work history — founding team at Powerplay, solo founder of Vignam Labs, and founding engineer roles across AI, full-stack, Android, and iOS.',
  },
  projects: {
    title: 'Projects',
    description:
      'AI agents, developer tools, and full-stack products built by Vibhanshu Sharma, including vii-stack, kodemux, Think-In-HTML, and Recyclink.',
  },
  about: {
    title: 'About',
    description: `About ${bio.name} — ${bio.currentRole}. ${bio.awards.join('. ')}.`,
  },
  contact: {
    title: 'Contact',
    description: `Get in touch with ${bio.name} — email, GitHub, LinkedIn, and X.`,
  },
  blog: {
    title: 'Blog',
    description:
      'Vibhanshu Sharma writes about production AI engineering — agents, code review systems, security, and systems design.',
  },
};

export function generateStaticParams() {
  return PANELS.map(panel => ({ panel }));
}

export async function generateMetadata({ params }: { params: Promise<{ panel: string }> }): Promise<Metadata> {
  const { panel } = await params;
  if (!PANELS.includes(panel as PanelId)) return {};
  const meta = PANEL_META[panel as PanelId];
  const resolvedTitle = meta.title ? `${meta.title} — Vibhanshu Sharma` : 'Vibhanshu Sharma — AI Engineer & Founder';
  return {
    ...(meta.title ? { title: meta.title } : {}),
    description: meta.description,
    alternates: { canonical: `/${panel}` },
    openGraph: { title: resolvedTitle, description: meta.description, url: `/${panel}` },
    twitter: { title: resolvedTitle, description: meta.description },
  };
}

export default async function PanelPage({ params }: { params: Promise<{ panel: string }> }) {
  const { panel } = await params;
  if (!PANELS.includes(panel as PanelId)) redirect('/home');
  return <ShellPage initialPanel={panel as PanelId} />;
}
