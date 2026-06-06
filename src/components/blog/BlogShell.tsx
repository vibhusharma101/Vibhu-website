'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';
import s from '../shell/shell.module.css';

type Lang = 'tsx' | 'ts' | 'md' | 'sh';

const PAGE_FILES: Array<{ href: string; filename: string; lang: Lang }> = [
  { href: '/home',     filename: 'vibhanshu.tsx', lang: 'tsx' },
  { href: '/work',     filename: 'experience.ts', lang: 'ts'  },
  { href: '/projects', filename: 'projects.ts',   lang: 'ts'  },
  { href: '/about',    filename: 'about.md',      lang: 'md'  },
  { href: '/contact',  filename: 'contact.sh',    lang: 'sh'  },
];

const BADGE: Record<Lang, { color: string; bg: string }> = {
  tsx: { color: 'var(--color-tsx)',  bg: 'rgba(78,201,176,.12)'  },
  ts:  { color: 'var(--color-ts)',   bg: 'rgba(86,156,214,.12)'  },
  md:  { color: 'var(--color-md)',   bg: 'rgba(206,145,120,.12)' },
  sh:  { color: 'var(--color-sh)',   bg: 'rgba(255,20,99,.10)'   },
};

interface Props {
  posts: BlogPost[];
  activeSlug?: string | null;
  otherPosts?: BlogPost[];
  tabFile: string;
  statusLine: string;
  children: React.ReactNode;
}

export function BlogShell({ posts, activeSlug, otherPosts = [], tabFile, statusLine, children }: Props) {
  const [pagesOpen, setPagesOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(true);

  const tabName = tabFile.replace(/\.mdx?$/, '');

  return (
    <div className={s.shell}>

      {/* ══ SIDEBAR ══ */}
      <nav className={s.sidebar}>
        <div className={s.sidebarHead}>
          <span className={s.sidebarTitle}>Explorer</span>
        </div>

        <div className={s.sidebarScroll}>
          <div className={s.sidebarSection}>Portfolio.sys</div>

          {/* pages/ folder */}
          <button
            type="button"
            className={`${s.sidebarFolder} ${s.indent1}`}
            onClick={() => setPagesOpen(o => !o)}
          >
            <span className={s.folderArrow}>{pagesOpen ? '∨' : '›'}</span>
            <span>📁</span><span>pages</span>
          </button>

          {pagesOpen && PAGE_FILES.map(f => (
            <Link key={f.href} href={f.href} className={`${s.sidebarFile} ${s.indent2}`}>
              <LangBadge lang={f.lang} />
              <span className={s.fileName}>{f.filename}</span>
            </Link>
          ))}

          {/* blog/ folder */}
          <button
            type="button"
            className={`${s.sidebarFolder} ${s.indent1}`}
            onClick={() => setBlogOpen(o => !o)}
          >
            <span className={s.folderArrow}>{blogOpen ? '∨' : '›'}</span>
            <span>📁</span><span>blog</span>
          </button>

          {blogOpen && (
            <Link
              href="/blog"
              className={`${s.sidebarFile} ${s.indent2} ${activeSlug == null ? s.active : ''}`}
            >
              <LangBadge lang="md" />
              <span className={s.fileName}>index.md</span>
            </Link>
          )}

          {blogOpen && posts.map(p => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className={`${s.sidebarFile} ${s.indent2} ${activeSlug === p.slug ? s.active : ''}`}
            >
              <LangBadge lang="md" />
              <span className={s.fileName}>{p.slug}.mdx</span>
            </Link>
          ))}
        </div>

        <div className={s.sidebarBottom}>
          <span className={s.liveDot} />
          <span>active · <strong>powerplay</strong></span>
        </div>
      </nav>

      {/* ══ PAGE ══ */}
      <div className={s.page}>

        {/* Header */}
        <header className={s.header}>
          <div className={s.menubar}>
            <Link href="/home" className={s.brand}>Vibhanshu Sharma</Link>
            <ul className={s.tabList} role="tablist">
              <li className={`${s.tab} ${s.active}`} role="tab">
                <span className={s.tabLangDot} style={{ background: 'var(--color-md)' }} />
                <span>{tabName}</span>
                <span className={s.tabExt}>.mdx</span>
                <span className={s.tabClose} aria-hidden>×</span>
              </li>
            </ul>
            <div className={s.liveIndicator}>
              <span className={s.liveDot} />
              <span>active · <strong>powerplay</strong></span>
            </div>
          </div>
          <div className={s.subbar}>
            <div className={s.breadcrumb}>
              <Link href="/home">PORTFOLIO.SYS</Link>
              <span className={s.breadcrumbSep}>›</span>
              <span>content</span>
              <span className={s.breadcrumbSep}>›</span>
              <span>blog</span>
              <span className={s.breadcrumbSep}>›</span>
              <span className={s.breadcrumbCurrent}>{tabFile}</span>
            </div>
            <span>{statusLine}</span>
          </div>
        </header>

        {/* Main */}
        <main className={s.main}>
          <div className={s.panel}>
            <Gutter />
            {children}
            {otherPosts.length > 0 && (
              <aside className={s.articleSidebar}>
                <div className={s.articleSidebarHead}>{'// other posts'}</div>
                <div className={s.articleSidebarList}>
                  {otherPosts.map(p => (
                    <Link key={p.slug} href={`/blog/${p.slug}`} className={s.articleSidebarItem}>
                      <p className={s.articleSidebarItemTitle}>{p.title}</p>
                      <span className={s.articleSidebarItemMeta}>{p.date} · {p.readTime}</span>
                    </Link>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </main>

        {/* Status bar */}
        <footer className={s.statusbar}>
          <span>● READY</span>
          <span className={s.statusbarSep}>▪</span>
          <span>blog</span>
          <span className={s.statusbarSep}>▪</span>
          <span>Markdown</span>
          <span className={s.statusbarSpacer} />
          <span>UTF-8</span>
          <span className={s.statusbarSep}>▪</span>
          <span className={s.statusbarMode}>OPERATOR</span>
        </footer>
      </div>
    </div>
  );
}

function LangBadge({ lang }: { lang: Lang }) {
  const { color, bg } = BADGE[lang];
  return (
    <span style={{
      fontSize: '8px',
      fontWeight: 700,
      padding: '1px 3px',
      borderRadius: '2px',
      flexShrink: 0,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.03em',
      color,
      background: bg,
    }}>
      {lang}
    </span>
  );
}

function Gutter() {
  const lines = Array.from({ length: 80 }, (_, i) => i + 1);
  return (
    <div className={s.gutter} aria-hidden>
      {lines.map(n => <span key={n} className={s.gutterLine} />)}
    </div>
  );
}
