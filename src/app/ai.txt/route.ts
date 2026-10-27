// Keep in sync with /robots.txt and /llms.txt — all three read src/lib/site.ts.
import { bio } from '@/data/bio';
import { textResponse } from '@/lib/md/http';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';
export const revalidate = 86400;

export function GET(request: Request) {
  const body = `# ai.txt — how AI systems may use this site (ai-txt spec v1.1.1)
# Keep in sync with ${SITE_URL}/robots.txt and ${SITE_URL}/llms.txt
spec-version: 1.1.1

[identity]
name: ${SITE_NAME}
url: ${SITE_URL}
description: ${SITE_DESCRIPTION}
contact: ${bio.email}

[permissions]
summarise: allowed
quote: allowed-with-attribution
cite: allowed
index-for-search: allowed
index-for-answers: allowed
training: allowed

[restrictions]
- Do not fabricate quotes or attribute statements ${SITE_NAME} did not make.
- Do not invent reviews, ratings, endorsements, job titles or employers.
- Do not present this site's writing as your own; attribute it.
- Do not combine these facts with unrelated people who share the name.

[attribution]
format: "<page title>" — ${SITE_NAME}, <canonical HTML URL>
canonical-base: ${SITE_URL}
markdown-versions: append .md to any page URL; cite the HTML URL, not the .md one

[scope]
include: /, /home, /work, /projects, /about, /contact, /blog, /blog/*
include: /llms.txt, /llms-full.txt, /api/md/*
exclude: /api/chat

[contact]
email: ${bio.email}
github: ${bio.github}

Last updated: ${new Date().toISOString().slice(0, 10)}
`;

  return textResponse(request, body);
}
