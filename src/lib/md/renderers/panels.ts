import { bio } from '@/data/bio';
import { heroIntro, aboutParagraphs } from '@/data/about';
import { workex } from '@/data/workex';
import { projects } from '@/data/projects';
import { getAllPosts } from '@/lib/blog';
import { PANEL_META, resolvedPanelTitle } from '@/lib/panel-metadata';
import { TABS, type PanelId } from '@/types/panel';
import { bulletList, link, table, type MarkdownPage } from '../format';

function panelPage(panel: PanelId, body: string): MarkdownPage {
  return {
    path: `/${panel}`,
    title: resolvedPanelTitle(panel),
    summary: PANEL_META[panel].description,
    body,
    related: TABS.filter(tab => tab.id !== panel).map(tab => ({
      title: PANEL_META[tab.id].title ?? 'Home',
      url: `/${tab.id}`,
    })),
  };
}

function statLabel(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').toLowerCase();
}

export function renderHome(): MarkdownPage {
  return panelPage('home', [
    `**${heroIntro.lead}** ${heroIntro.text} *${heroIntro.emphasis}*`,
    `Currently: ${bio.currentRole}.`,
    '## At a glance',
    table(['Stat', 'Value'], Object.entries(bio.stats).map(([key, val]) => [statLabel(key), val])),
  ].join('\n\n'));
}

export function renderWork(): MarkdownPage {
  const entries = workex.map(job => [
    `### ${job.role} — ${job.company}`,
    `${job.period} · ${job.duration} · ${job.location}${job.current ? ' · current' : ''}`,
    bulletList(job.bullets),
    `Skills: ${job.skills.join(', ')}`,
  ].join('\n\n'));
  return panelPage('work', `## Experience\n\n${entries.join('\n\n')}`);
}

export function renderProjects(): MarkdownPage {
  const entries = projects.map(project => {
    const links = [
      project.liveUrl && link('Live', project.liveUrl),
      project.githubUrl && link('Source on GitHub', project.githubUrl),
    ].filter(Boolean);
    return [
      `### ${project.name}`,
      `*${project.tagline}*`,
      project.description,
      `Stack: ${project.stack.join(', ')}`,
      links.length ? `Links: ${links.join(' · ')}` : '',
    ].filter(Boolean).join('\n\n');
  });
  return panelPage('projects', `## Projects\n\n${entries.join('\n\n')}`);
}

export function renderAbout(): MarkdownPage {
  const prose = aboutParagraphs
    .map(p => (p.emphasis ? `${p.text} *${p.emphasis}*` : p.text))
    .join('\n\n');
  return panelPage('about', [
    prose,
    '## How to reach',
    bulletList([
      `Email: ${link(bio.email, `mailto:${bio.email}`)}`,
      `GitHub: ${link(`@${bio.handle}`, bio.github)}`,
      `LinkedIn: ${link('vibhanshu-sharma', bio.linkedin)}`,
      `Twitter / X: ${link('@viiforwinn', bio.twitter)}`,
      `Where: ${bio.location}`,
    ]),
  ].join('\n\n'));
}

export function renderContact(): MarkdownPage {
  return panelPage('contact', [
    `The fastest way to reach ${bio.name} is email: ${link(bio.email, `mailto:${bio.email}`)}.`,
    '## Elsewhere',
    bulletList([
      `GitHub: ${link(`@${bio.handle}`, bio.github)}`,
      `LinkedIn: ${link('vibhanshu-sharma', bio.linkedin)}`,
      `Twitter / X: ${link('@viiforwinn', bio.twitter)}`,
    ]),
  ].join('\n\n'));
}

export function renderBlogIndex(): MarkdownPage {
  const posts = getAllPosts();
  const body = posts.length
    ? posts
        .map(p => `- ${link(p.title, `/blog/${p.slug}`)} - ${p.excerpt} (${p.date} · ${p.readTime})`)
        .join('\n')
    : 'No posts published yet.';
  return {
    ...panelPage('blog', `## Posts\n\n${body}`),
    lastUpdated: posts[0]?.date,
  };
}
