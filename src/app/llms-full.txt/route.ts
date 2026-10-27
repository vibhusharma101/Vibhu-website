import { listMarkdownRoutes } from '@/lib/md/registry';
import { renderDocument } from '@/lib/md/format';
import { textResponse } from '@/lib/md/http';
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

export const dynamic = 'force-static';
export const revalidate = 86400;

const SIZE_WARNING = 500_000;

export async function GET() {
  const routes = await listMarkdownRoutes();
  const sections = routes.map(
    ({ info, page }) => `---\n<!-- source: ${absoluteUrl(info.path)} -->\n${renderDocument(page)}`
  );

  const body = [
    `# ${SITE_NAME} - full content`,
    `> ${SITE_DESCRIPTION}`,
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    ...sections,
  ].join('\n\n');

  if (body.length > SIZE_WARNING) {
    console.warn(`[llms-full.txt] ${body.length} chars — over the ${SIZE_WARNING} budget; cap the blog section.`);
  }

  return textResponse(body);
}
