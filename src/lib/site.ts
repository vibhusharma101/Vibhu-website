import { bio } from '@/data/bio';

/**
 * Site-level facts shared by metadata, JSON-LD, sitemap, robots.txt,
 * llms.txt and ai.txt. Change them here, not at the call sites.
 */
export const SITE_URL = 'https://www.viiforwin.in';

export const SITE_NAME = bio.name;

export const SITE_DESCRIPTION =
  'Vibhanshu Sharma is an AI engineer and founder in Bengaluru. He ships production AI — agents, RAG, and LLM products — and leads AI engineering at Powerplay, building software for the construction industry.';

export const PERSON_ID = `${SITE_URL}/#person`;

export function absoluteUrl(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
}
