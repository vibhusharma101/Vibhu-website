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

  // ── P1: status-bar contrast ──
  const ratio = await page.evaluate(() => {
    const lum = c => {
      const [r, g, b] = c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map(v => {
        v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const el = [...document.querySelectorAll('footer span')].find(s => s.textContent === 'OPERATOR');
    const cs = getComputedStyle(el);
    const [a, b] = [lum(cs.color), lum(cs.backgroundColor)].sort((x, y) => y - x);
    return (a + 0.05) / (b + 0.05);
  });
  check(ratio >= 4.5, `OPERATOR badge contrast ${ratio.toFixed(2)}:1 is at least 4.5:1`);

  // ── P1: fonts are self-hosted ──
  const fontPage = await browser.newPage();
  const external = [];
  fontPage.on('request', r => { if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) external.push(r.url()); });
  await fontPage.goto(`${BASE}/home`, { waitUntil: 'networkidle' });
  check(external.length === 0, 'no requests to Google Fonts (fonts are self-hosted)');
  check(await fontPage.evaluate(() => document.fonts.check('16px ' + getComputedStyle(document.body).fontFamily.split(',')[0])),
    'the body font is loaded');

  // ── P1: reduced motion ──
  const calm = await browser.newPage({ reducedMotion: 'reduce' });
  await calm.goto(`${BASE}/home`, { waitUntil: 'networkidle' });
  await calm.waitForTimeout(300);
  const running = await calm.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length);
  check(running === 0, `no running CSS animations under prefers-reduced-motion (found ${running})`);
  const painted = await calm.evaluate(() => {
    const c = document.querySelector('#panel-home canvas');
    const { data } = c.getContext('2d').getImageData(0, 0, c.width, c.height);
    let lit = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i] > 120) lit++; // amber/magenta strokes, not the near-black bg
    return lit;
  });
  check(painted > 500, `hero visualizer still draws a still frame under reduced motion (${painted} lit px)`);
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nall checks passed');
