export type PanelId = 'home' | 'work' | 'projects' | 'about' | 'contact' | 'blog';

export interface Tab {
  id: PanelId;
  filename: string;
  lang: 'tsx' | 'ts' | 'md' | 'json' | 'sh';
  langColor: string;
}

export const TABS: Tab[] = [
  { id: 'home',     filename: 'vibhanshu.tsx',  lang: 'tsx',  langColor: 'var(--color-tsx)' },
  { id: 'work',     filename: 'experience.ts',  lang: 'ts',   langColor: 'var(--color-ts)' },
  { id: 'projects', filename: 'projects.ts',    lang: 'ts',   langColor: 'var(--color-ts)' },
  { id: 'about',    filename: 'about.md',       lang: 'md',   langColor: 'var(--color-md)' },
  { id: 'contact',  filename: 'contact.sh',     lang: 'sh',   langColor: 'var(--color-sh)' },
  { id: 'blog',     filename: 'blog.md',        lang: 'md',   langColor: 'var(--color-md)' },
];

export const LANG_LABEL: Record<Tab['lang'], string> = {
  tsx:  'TypeScript JSX',
  ts:   'TypeScript',
  md:   'Markdown',
  json: 'JSON',
  sh:   'Shell Script',
};
