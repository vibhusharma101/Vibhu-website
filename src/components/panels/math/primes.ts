import { AMBER, MAGENTA, BG, DIM, MONO, type VizRunner } from './shared';

/**
 * Sieve of Eratosthenes, animated step by step. The current base prime `p` is
 * boxed in magenta; its multiples get struck through one at a time; survivors
 * glow amber as confirmed primes. Holds on completion, then restarts.
 */
export const runPrimes: VizRunner = (canvas, ctx) => {
  const MAX = 180;
  const eliminated = new Array<boolean>(MAX + 1).fill(false);
  let current = 2;     // base prime being processed
  let mark = 4;        // next multiple to strike
  let lastStruck = -1; // most recently eliminated cell (for the pulse)
  let done = false;
  let holdTimer = 0;
  let frame = 0;
  let raf = 0;
  const PACE = 4;

  const reset = () => {
    eliminated.fill(false);
    current = 2; mark = 4; lastStruck = -1; done = false; holdTimer = 0;
  };

  const tick = () => {
    if (done) {
      holdTimer++;
      if (holdTimer > 130) reset();
      return;
    }
    if (mark <= MAX) {
      eliminated[mark] = true;
      lastStruck = mark;
      mark += current;
    } else {
      let next = current + 1;
      while (next <= MAX && eliminated[next]) next++;
      if (next > MAX || next * next > MAX) { done = true; lastStruck = -1; }
      else { current = next; mark = current * current; }
    }
  };

  const primesFound = () => {
    let c = 0;
    for (let n = 2; n <= MAX; n++) if (!eliminated[n]) c++;
    return c;
  };

  const draw = () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);

    const COLS = 15;
    const ROWS = Math.ceil((MAX - 1) / COLS);
    const padX = 14, padTop = 42, padBot = 34;
    const cellW = (w - padX * 2) / COLS;
    const cellH = Math.min(cellW * 0.82, (h - padTop - padBot) / ROWS);
    const fontPx = Math.min(cellW * 0.34, 11);

    ctx.textBaseline = 'middle';
    for (let n = 2; n <= MAX; n++) {
      const idx = n - 2;
      const col = idx % COLS, row = Math.floor(idx / COLS);
      const cx = padX + col * cellW + cellW / 2;
      const cy = padTop + row * cellH + cellH / 2;
      const label = String(n);

      if (eliminated[n]) {
        ctx.font = `${fontPx}px ${MONO}`;
        ctx.fillStyle = 'rgba(58,37,8,0.5)';
        ctx.fillText(label, cx - ctx.measureText(label).width / 2, cy);
        ctx.strokeStyle = 'rgba(255,20,99,0.22)'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - cellW * 0.32, cy + cellH * 0.18);
        ctx.lineTo(cx + cellW * 0.32, cy - cellH * 0.18);
        ctx.stroke();
      } else if (n === current && !done) {
        ctx.fillStyle = 'rgba(255,20,99,0.16)';
        ctx.fillRect(cx - cellW * 0.46, cy - cellH * 0.46, cellW * 0.92, cellH * 0.92);
        ctx.strokeStyle = MAGENTA; ctx.lineWidth = 1;
        ctx.strokeRect(cx - cellW * 0.46, cy - cellH * 0.46, cellW * 0.92, cellH * 0.92);
        ctx.fillStyle = MAGENTA; ctx.font = `bold ${Math.min(cellW * 0.36, 12)}px ${MONO}`;
        ctx.fillText(label, cx - ctx.measureText(label).width / 2, cy);
      } else {
        const confirmed = n < current || done;
        ctx.save();
        ctx.shadowColor = AMBER; ctx.shadowBlur = confirmed ? 5 : 2;
        ctx.fillStyle = confirmed ? AMBER : 'rgba(245,166,35,0.5)';
        ctx.font = `${fontPx}px ${MONO}`;
        ctx.fillText(label, cx - ctx.measureText(label).width / 2, cy);
        ctx.restore();
      }

      if (n === lastStruck) {
        ctx.strokeStyle = MAGENTA; ctx.lineWidth = 1.5;
        ctx.strokeRect(cx - cellW * 0.46, cy - cellH * 0.46, cellW * 0.92, cellH * 0.92);
      }
    }
    ctx.textBaseline = 'alphabetic';

    // Header + status line.
    ctx.font = `10px ${MONO}`; ctx.fillStyle = DIM;
    ctx.fillText('sieve of eratosthenes', padX, 22);

    ctx.font = `9.5px ${MONO}`;
    if (done) {
      ctx.fillStyle = AMBER;
      ctx.fillText(`complete · primes ≤ ${MAX} = ${primesFound()}`, padX, h - 14);
    } else {
      const pre = 'striking multiples of ';
      ctx.fillStyle = DIM; ctx.fillText(pre, padX, h - 14);
      ctx.fillStyle = MAGENTA; ctx.fillText(String(current), padX + ctx.measureText(pre).width, h - 14);
    }

    if (frame % PACE === 0) tick();
    frame++;
    raf = requestAnimationFrame(draw);
  };
  draw();

  return () => cancelAnimationFrame(raf);
};
