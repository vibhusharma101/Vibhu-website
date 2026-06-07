'use client';

import { useEffect, useState } from 'react';
import { IconHome } from '@tabler/icons-react';
import type { WorkExEntry } from '@/data/workex';
import type { Project } from '@/data/projects';
import type { BlogPost } from '@/types/blog';
import { TABS, type PanelId, type Tab } from '@/types/panel';
import { HomePanel } from '@/components/panels/HomePanel';
import { WorkPanel } from '@/components/panels/WorkPanel';
import { ProjectsPanel } from '@/components/panels/ProjectsPanel';
import { AboutPanel } from '@/components/panels/AboutPanel';
import { ContactPanel } from '@/components/panels/ContactPanel';
import { BlogListPanel } from '@/components/panels/BlogListPanel';
import { BlogPostPane } from '@/components/panels/BlogPostPane';
import { ChatWidget } from '@/components/chat/ChatWidget';
import s from './shell.module.css';

interface Props {
  initialPanel?: PanelId;
  workex: WorkExEntry[];
  projects: Project[];
  posts: BlogPost[];
  blogContents: { slug: string; content: React.ReactNode }[];
}

const LANG_LABEL: Record<Tab['lang'], string> = {
  tsx:  'TypeScript JSX',
  ts:   'TypeScript',
  md:   'Markdown',
  json: 'JSON',
  sh:   'Shell Script',
};

export function VSCodeShell({ initialPanel = 'home', workex, projects, posts, blogContents }: Props) {
  const [activePanel, setActivePanel] = useState<PanelId>(initialPanel);
  const [pagesOpen, setPagesOpen] = useState(true);
  const [blogOpen, setBlogOpen] = useState(true);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (panel: PanelId) => {
    setActivePanel(panel);
    setSidebarOpen(false);
  };

  /* Sync URL pathname ↔ active panel (no hashes) */
  useEffect(() => {
    window.history.pushState(null, '', `/${activePanel}`);
  }, [activePanel]);

  useEffect(() => {
    const handlePop = () => {
      const panel = window.location.pathname.replace('/', '') as PanelId;
      if (TABS.some(t => t.id === panel)) setActivePanel(panel);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const currentTab = TABS.find(t => t.id === activePanel)!;

  const pageFiles: Array<{ id: PanelId; filename: string; lang: Tab['lang']; git?: 'M' | 'U' }> = [
    { id: 'home',     filename: 'vibhanshu.tsx',  lang: 'tsx', git: 'M' },
    { id: 'work',     filename: 'experience.ts',  lang: 'ts' },
    { id: 'projects', filename: 'projects.ts',    lang: 'ts',  git: 'U' },
    { id: 'about',    filename: 'about.md',       lang: 'md' },
    { id: 'contact',  filename: 'contact.sh',     lang: 'sh' },
    { id: 'blog',     filename: 'blog.md',        lang: 'md' },
  ];

  return (
    <div className={s.shell}>

      {/* ══════ SIDEBAR ══════ */}
      {sidebarOpen && (
        <div className={s.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
      )}
      <nav className={`${s.sidebar} ${sidebarOpen ? s.sidebarOpen : ''}`}>
        <div className={s.sidebarHead}>
          <span className={s.sidebarTitle}>Explorer</span>
          <div className={s.sidebarActions}>
            <button aria-label="New file">+</button>
            <button aria-label="Collapse">⊟</button>
          </div>
        </div>

        <div className={s.sidebarScroll}>
          <div className={s.sidebarSection}>Portfolio.sys</div>

          {/* ── Home shortcut ── */}
          <SidebarFile
            filename="home"
            lang="tsx"
            active={activePanel === 'home'}
            indent={1}
            icon={<IconHome size={13} style={{ color: 'var(--color-amber)', flexShrink: 0 }} />}
            onClick={() => navigate('home')}
          />

          {/* ── pages/ folder ── */}
          <button
            type="button"
            className={`${s.sidebarFolder} ${s.indent1}`}
            onClick={() => setPagesOpen(o => !o)}
          >
            <span className={s.folderArrow}>{pagesOpen ? '∨' : '›'}</span>
            <span>📁</span><span>pages</span>
          </button>

          {pagesOpen && pageFiles.map(f => (
            <SidebarFile
              key={`page-${f.id}`}
              filename={f.filename}
              lang={f.lang}
              git={f.git}
              active={activePanel === f.id}
              indent={2}
              onClick={() => navigate(f.id)}
            />
          ))}

          {/* ── blog/ folder ── */}
          <button
            type="button"
            className={`${s.sidebarFolder} ${s.indent1}`}
            onClick={() => setBlogOpen(o => !o)}
          >
            <span className={s.folderArrow}>{blogOpen ? '∨' : '›'}</span>
            <span>📁</span><span>blog</span>
          </button>

        </div>

        <div className={s.sidebarBottom}>
          <span className={s.liveDot}></span>
          <span>active · <strong>powerplay</strong></span>
        </div>
      </nav>

      {/* ══════ PAGE ══════ */}
      <div className={s.page}>

        {/* Header */}
        <header className={s.header}>
          <div className={s.menubar}>
            <button
              className={s.hamburger}
              onClick={() => setSidebarOpen(o => !o)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
            <div className={s.brand}>Vibhanshu Sharma</div>

            <ul className={s.tabList} role="tablist">
              {TABS.map(tab => (
                <li
                  key={tab.id}
                  role="tab"
                  aria-selected={activePanel === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  className={`${s.tab} ${activePanel === tab.id ? s.active : ''}`}
                  onClick={() => setActivePanel(tab.id)}
                  tabIndex={activePanel === tab.id ? 0 : -1}
                >
                  <span className={s.tabLangDot} style={{ background: tab.langColor }} />
                  <span>{tab.filename.replace(/\.[^.]+$/, '')}</span>
                  <span className={s.tabExt}>.{tab.lang === 'tsx' ? 'tsx' : tab.lang === 'md' ? 'md' : tab.lang === 'sh' ? 'sh' : 'ts'}</span>
                  <span className={s.tabClose} aria-hidden>×</span>
                </li>
              ))}
            </ul>

            <div className={s.liveIndicator}>
              <span className={s.liveDot}></span>
              <span>active · <strong>powerplay</strong></span>
            </div>
          </div>

          <div className={s.subbar} aria-label="breadcrumb">
            <div className={s.breadcrumb}>
              <span>PORTFOLIO.SYS</span>
              <span className={s.breadcrumbSep}>›</span>
              <span>src</span>
              <span className={s.breadcrumbSep}>›</span>
              <span>app</span>
              <span className={s.breadcrumbSep}>›</span>
              <span className={s.breadcrumbCurrent}>{currentTab.filename}</span>
            </div>
            <span>{LANG_LABEL[currentTab.lang]} · UTF-8 · LF</span>
          </div>
        </header>

        {/* Panel area */}
        <main className={s.main} id="panel-area">
          {TABS.map(tab => (
            <div
              key={tab.id}
              id={`panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              className={`${s.panel} ${activePanel !== tab.id ? s.hidden : ''}`}
            >
              {/* Blog panel has its own full-width layout — no gutter */}
              {tab.id !== 'blog' && <Gutter />}

              {tab.id === 'home'     && <HomePanel onNavigate={setActivePanel} />}
              {tab.id === 'work'     && <WorkPanel entries={workex} />}
              {tab.id === 'projects' && <ProjectsPanel projects={projects} />}
              {tab.id === 'about'    && <AboutPanel />}
              {tab.id === 'contact'  && <ContactPanel />}
              {tab.id === 'blog' && (
                selectedBlogSlug
                  ? <BlogPostPane
                      key={selectedBlogSlug}
                      post={posts.find(p => p.slug === selectedBlogSlug)!}
                      content={blogContents.find(b => b.slug === selectedBlogSlug)?.content ?? null}
                      otherPosts={posts.filter(p => p.slug !== selectedBlogSlug)}
                      onBack={() => setSelectedBlogSlug(null)}
                      onSelectPost={setSelectedBlogSlug}
                    />
                  : <BlogListPanel />
              )}
            </div>
          ))}
        </main>

        {/* Status bar */}
        <footer className={s.statusbar} aria-label="status bar">
          <span>● READY</span>
          <span className={s.statusbarSep}>▪</span>
          <span>Git: develop</span>
          <span className={s.statusbarSep}>▪</span>
          <span>Ln 1, Col 1</span>
          <span className={s.statusbarSpacer} />
          <span>{LANG_LABEL[currentTab.lang]}</span>
          <span className={s.statusbarSep}>▪</span>
          <span>UTF-8</span>
          <span className={s.statusbarSep}>▪</span>
          <span className={s.statusbarMode}>OPERATOR</span>
        </footer>
      </div>

      {/* Chat widget — always visible */}
      <ChatWidget />
    </div>
  );
}

/* ── Sidebar file row ── */
function SidebarFile({
  filename,
  lang,
  git,
  active,
  indent = 1,
  icon,
  onClick,
}: {
  filename: string;
  lang: Tab['lang'];
  git?: 'M' | 'U';
  active?: boolean;
  indent?: 1 | 2 | 3;
  icon?: React.ReactNode;
  onClick: () => void;
}) {
  const indentClass = indent === 1 ? s.indent1 : indent === 2 ? s.indent2 : s.indent3;

  return (
    <button
      type="button"
      className={`${s.sidebarFile} ${indentClass} ${active ? s.active : ''}`}
      onClick={onClick}
      aria-label={filename}
    >
      {icon ?? <LangBadge lang={lang} />}
      <span className={s.fileName}>{filename}</span>
      {git && (
        <span className={`${s.gitBadge} ${git === 'M' ? s.gitM : s.gitU}`}>{git}</span>
      )}
      {!git && active && <span className={s.modDot} />}
    </button>
  );
}

/* ── Language badge ── */
function LangBadge({ lang }: { lang: Tab['lang'] }) {
  const styles: Record<Tab['lang'], { color: string; bg: string; label: string }> = {
    tsx:  { color: 'var(--color-tsx)',  bg: 'rgba(78,201,176,.12)',   label: 'tsx' },
    ts:   { color: 'var(--color-ts)',   bg: 'rgba(86,156,214,.12)',   label: 'ts' },
    md:   { color: 'var(--color-md)',   bg: 'rgba(206,145,120,.12)',  label: 'md' },
    json: { color: 'var(--color-json)', bg: 'rgba(220,220,170,.10)', label: '{}' },
    sh:   { color: 'var(--color-sh)',   bg: 'rgba(255,20,99,.10)',    label: 'sh' },
  };
  const st = styles[lang];
  return (
    <span style={{
      fontSize: '8px',
      fontWeight: 700,
      padding: '1px 3px',
      borderRadius: '2px',
      flexShrink: 0,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.03em',
      color: st.color,
      background: st.bg,
    }}>
      {st.label}
    </span>
  );
}

/* ── Line-number gutter ── */
function Gutter() {
  const lines = Array.from({ length: 60 }, (_, i) => i + 1);
  return (
    <div className={s.gutter} aria-hidden>
      {lines.map(n => (
        <span key={n} className={s.gutterLine} />
      ))}
    </div>
  );
}
