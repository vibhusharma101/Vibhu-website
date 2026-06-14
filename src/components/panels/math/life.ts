import { AMBER, MAGENTA, BG, DIM, MONO, type VizRunner } from './shared';

// Gosper glider gun, as [col, row] offsets. Emits a glider every 30 generations.
const GUN: [number, number][] = [
  [24, 0],
  [22, 1], [24, 1],
  [12, 2], [13, 2], [20, 2], [21, 2], [34, 2], [35, 2],
  [11, 3], [15, 3], [20, 3], [21, 3], [34, 3], [35, 3],
  [0, 4], [1, 4], [10, 4], [16, 4], [20, 4], [21, 4],
  [0, 5], [1, 5], [10, 5], [14, 5], [16, 5], [17, 5], [22, 5], [24, 5],
  [10, 6], [16, 6], [24, 6],
  [11, 7], [15, 7],
  [12, 8], [13, 8],
];

/**
 * Conway's Game of Life seeded with a Gosper glider gun (plus a little random
 * soup) so there's perpetual, recognizable motion — a stream of gliders. Dead
 * cells fade out rather than vanish, leaving comet-like trails; newborn cells
 * flash magenta. Non-wrapping so gliders fly cleanly off the edge.
 */
export const runLife: VizRunner = (canvas, ctx) => {
  const COLS = 64, ROWS = 40;
  const idx = (r: number, c: number) => r * COLS + c;
  let grid = new Uint8Array(COLS * ROWS);
  let bright = new Float32Array(COLS * ROWS);
  let age = new Uint16Array(COLS * ROWS);
  let gen = 0;
  let frame = 0;
  let raf = 0;
  const STEP = 6;

  const seed = () => {
    grid = new Uint8Array(COLS * ROWS);
    bright = new Float32Array(COLS * ROWS);
    age = new Uint16Array(COLS * ROWS);
    gen = 0;
    const ox = 2, oy = 2;
    for (const [c, r] of GUN) {
      const cc = c + ox, rr = r + oy;
      if (cc < COLS && rr < ROWS) grid[idx(rr, cc)] = 1;
    }
    for (let r = Math.floor(ROWS * 0.62); r < ROWS; r++)
      for (let c = Math.floor(COLS * 0.5); c < COLS; c++)
        if (Math.random() < 0.16) grid[idx(r, c)] = 1;
  };

  const step = () => {
    const next = new Uint8Array(COLS * ROWS);
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        let n = 0;
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const rr = r + dr, cc = c + dc;
            if (rr < 0 || cc < 0 || rr >= ROWS || cc >= COLS) continue;
            n += grid[idx(rr, cc)];
          }
        const alive = grid[idx(r, c)];
        next[idx(r, c)] = alive ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
      }
    grid = next;
    gen++;
    for (let i = 0; i < grid.length; i++) { if (grid[i]) age[i]++; else age[i] = 0; }
  };

  seed();

  const draw = () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);

    const bot = 26;
    const cellW = w / COLS, cellH = (h - bot) / ROWS;

    let alive = 0;
    for (let i = 0; i < grid.length; i++) {
      if (grid[i]) { bright[i] = 1; alive++; } else { bright[i] *= 0.78; }
    }

    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        const i = idx(r, c);
        const b = bright[i];
        if (b < 0.05) continue;
        const born = grid[i] === 1 && age[i] <= 1;
        ctx.globalAlpha = Math.min(b, 1);
        ctx.fillStyle = born ? MAGENTA : AMBER;
        ctx.fillRect(c * cellW + 0.4, r * cellH + 0.4, cellW - 0.8, cellH - 0.8);
      }
    ctx.globalAlpha = 1;

    ctx.strokeStyle = 'rgba(58,37,8,0.22)'; ctx.lineWidth = 0.3;
    for (let c = 0; c <= COLS; c++) { ctx.beginPath(); ctx.moveTo(c * cellW, 0); ctx.lineTo(c * cellW, h - bot); ctx.stroke(); }
    for (let r = 0; r <= ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * cellH); ctx.lineTo(w, r * cellH); ctx.stroke(); }

    ctx.font = `9px ${MONO}`; ctx.fillStyle = DIM;
    ctx.fillText("conway's game of life · gosper gun", 12, h - 11);
    const stat = `gen ${gen}  alive ${alive}`;
    ctx.fillStyle = AMBER;
    ctx.fillText(stat, w - ctx.measureText(stat).width - 12, h - 11);

    if (alive === 0 || gen > 900) seed();
    if (frame % STEP === 0) step();
    frame++;
    raf = requestAnimationFrame(draw);
  };
  draw();

  return () => cancelAnimationFrame(raf);
};
