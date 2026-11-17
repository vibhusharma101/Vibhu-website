// Keyboard and accessibility checks for the shell, run against a live server.
//   npm run dev            (in another terminal)
//   npm run check:a11y     (or: node scripts/check-a11y.mjs http://localhost:3000)
// Uses the installed Chrome when present, otherwise Playwright's bundled Chromium.
import { chromium } from 'playwright';

const BASE = (process.argv[2] || process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const failures = [];
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) failures.push(msg); };

const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/home`, { waitUntil: 'networkidle' });

  // ── P0: tablist keyboard navigation ──
  const selected = () => page.$eval('[role="tab"][aria-selected="true"]', el => el.id);
  const focused = () => page.evaluate(() => document.activeElement?.id);

  await page.focus('#tab-home');
  await page.keyboard.press('ArrowRight');
  check(await selected() === 'tab-work', 'ArrowRight selects the next tab');
  check(await focused() === 'tab-work', 'ArrowRight moves focus with the selection');
  check(new URL(page.url()).pathname === '/work', 'URL follows the keyboard tab change');

  await page.keyboard.press('End');
  check(await selected() === 'tab-blog', 'End selects the last tab');
  await page.keyboard.press('ArrowRight');
  check(await selected() === 'tab-home', 'ArrowRight wraps from last to first');
  await page.keyboard.press('ArrowLeft');
  check(await selected() === 'tab-blog', 'ArrowLeft wraps from first to last');
  await page.keyboard.press('Home');
  check(await selected() === 'tab-home', 'Home selects the first tab');
  check(await page.isVisible('#panel-home'), 'the selected tab shows its panel');
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nall checks passed');
