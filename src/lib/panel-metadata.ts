import type { PanelId } from '@/types/panel';
import { bio } from '@/data/bio';

// aiSummary feeds <meta name="ai-summary">; it falls back to description.
export const PANEL_META: Record<PanelId, { title?: string; description: string; aiSummary?: string }> = {
  home: {
    description: bio.tagline,
    aiSummary: `Homepage of ${bio.name}, an AI engineer and 2x founder (${bio.currentRole}). Links to his work history, projects, writing and contact details.`,
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
    aiSummary:
      'Index of every published blog post by Vibhanshu Sharma, newest first, covering AI agents, AI code review, security, system design and algorithms.',
  },
};

export function resolvedPanelTitle(panel: PanelId): string {
  const title = PANEL_META[panel].title;
  return title ? `${title} — Vibhanshu Sharma` : 'Vibhanshu Sharma — AI Engineer & Founder';
}

export function buildPanelMetadata(panel: PanelId, path: string) {
  const meta = PANEL_META[panel];
  const resolvedTitle = resolvedPanelTitle(panel);
  return {
    ...(meta.title ? { title: meta.title } : {}),
    description: meta.description,
    alternates: { canonical: path, types: { 'text/markdown': `${path}.md` } },
    openGraph: { title: resolvedTitle, description: meta.description, url: path },
    twitter: { title: resolvedTitle, description: meta.description },
    other: { 'ai-summary': meta.aiSummary ?? meta.description },
  };
}
