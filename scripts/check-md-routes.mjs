// Fails if a public page in src/app has no markdown renderer.
// Run with `npm run check:md` (Node 22.18+ loads the .ts imports natively).
import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { MARKDOWN_ROUTES, matchMarkdownRoute } from '../src/lib/md/routes.ts';
import { TABS } from '../src/types/panel.ts';

const APP_DIR = join(import.meta.dirname, '..', 'src', 'app');

// Pages deliberately without a markdown version, with the reason.
const SKIP = {};

// Dynamic segments whose concrete values come from a fixed list.
const EXPAND = {
  '/[panel]': TABS.map(tab => `/${tab.id}`),
};

function findPages(dir) {
  return readdirSync(dir).flatMap(name => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return name === 'api' ? [] : findPages(full);
    return name === 'page.tsx' ? [dir] : [];
  });
}

const routes = findPages(APP_DIR).map(dir => {
  const segments = relative(APP_DIR, dir).split(sep).filter(Boolean).filter(s => !/^\(.*\)$/.test(s));
  return `/${segments.join('/')}`;
});

const missing = routes
  .flatMap(route => EXPAND[route] ?? [route])
  .filter(route => !(route in SKIP))
  .filter(route => !MARKDOWN_ROUTES.includes(route) && !matchMarkdownRoute(route));

if (missing.length) {
  console.error('Pages without a markdown renderer (add them to src/lib/md/routes.ts + registry.ts, or to SKIP here with a reason):');
  for (const route of missing) console.error(`  ${route}`);
  process.exit(1);
}
console.log(`check:md ok - ${routes.length} page files, all covered.`);
