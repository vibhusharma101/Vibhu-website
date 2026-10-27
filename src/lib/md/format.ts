import { absoluteUrl } from '@/lib/site';

export interface MarkdownLink {
  title: string;
  url: string;
  description?: string;
}

/** A page's markdown version, before it is wrapped by renderDocument(). */
export interface MarkdownPage {
  /** Canonical HTML path, e.g. /blog/my-post */
  path: string;
  title: string;
  summary: string;
  lastUpdated?: string;
  body: string;
  related?: MarkdownLink[];
}

export function escapeText(text: string): string {
  return text.replace(/([\\[\]*_`])/g, '\\$1');
}

export function link(title: string, url: string): string {
  const href = url.startsWith('/') ? absoluteUrl(url) : url;
  return `[${escapeText(title)}](${href})`;
}

export function linkList(items: MarkdownLink[]): string {
  return items
    .map(item => `- ${link(item.title, item.url)}${item.description ? ` - ${item.description}` : ''}`)
    .join('\n');
}

export function bulletList(items: readonly string[]): string {
  return items.map(item => `- ${item}`).join('\n');
}

export function table(headers: string[], rows: string[][]): string {
  const cell = (value: string) => value.replace(/\|/g, '\\|');
  return [
    `| ${headers.map(cell).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map(row => `| ${row.map(cell).join(' | ')} |`),
  ].join('\n');
}

export function renderDocument(page: MarkdownPage): string {
  const parts = [
    `# ${page.title}`,
    `> ${page.summary}`,
    [`Canonical: ${absoluteUrl(page.path)}`, page.lastUpdated && `Last updated: ${page.lastUpdated}`]
      .filter(Boolean)
      .join('\n'),
    page.body.trim(),
  ];
  if (page.related?.length) parts.push(`## Related\n\n${linkList(page.related)}`);
  return `${parts.join('\n\n')}\n`;
}
