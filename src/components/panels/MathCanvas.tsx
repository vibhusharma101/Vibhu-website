'use client';

import { useEffect, useRef } from 'react';

export type MathTab = 'waves' | 'fourier' | 'primes' | 'sort' | 'life';

const AMBER   = '#f5a623';
const MAGENTA = '#ff1463';
const GRID    = 'rgba(58, 37, 8, 0.45)';
const BG      = '#030201';
const DIM     = 'rgba(58,37,8,0.6)';
const MONO    = '"IBM Plex Mono", monospace';

interface Props { mode: MathTab; }

export function MathCanvas({ mode }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr  = window.devicePixelRatio || 1;
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const drawGrid = (w: number, h: number) => {
      ctx.strokeStyle = GRID;
      ctx.lineWidth = 0.5;
      const step = 32;
      for (let x = 0; x < w; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    };

    // ── WAVES ──────────────────────────────────────────────────────────────
    if (mode === 'waves') {
      let t = 0;
      const mouse = { x: -1, y: -1, active: false };
      let freqOffCur = 0, ampScaleCur = 1;

      const onMove  = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true; };
      const onLeave = () => { mouse.active = false; };
      canvas.addEventListener('mousemove', onMove);
      canvas.addEventListener('mouseleave', onLeave);

      const EQUATIONS = [
        { label: 'growth(t)',  expr: '500k · eˢⁱⁿ⁽ᵗ⁾',  color: AMBER   },
        { label: 'P(success)', expr: '1 − e⁻ᵏᵗ',          color: MAGENTA },
        { label: 'uptime',     expr: '1 − 0.0002',          color: AMBER   },
      ];

      const draw = () => {
        const w = canvas.offsetWidth, h = canvas.offsetHeight;
        const tFreq = mouse.active ? (mouse.x / w) * 0.03 : 0;
        const tAmp  = mouse.active ? 0.65 + (mouse.y / h) * 0.7 : 1;
        freqOffCur  += (tFreq - freqOffCur)  * 0.06;
        ampScaleCur += (tAmp  - ampScaleCur) * 0.06;

        ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);
        drawGrid(w, h);

        const cy = h * 0.5, amp1 = h * 0.22 * ampScaleCur, amp2 = h * 0.13 * ampScaleCur;
        const wv = (color: string, amp: number, freq: number, phase: number, lw: number, dash: number[] = []) => {
          ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = 10; ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash); ctx.beginPath();
          for (let x = 0; x <= w; x++) { const y = cy + Math.sin(x * (freq + freqOffCur) + phase) * amp; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
          ctx.stroke(); ctx.restore();
        };
        wv(AMBER, amp1, 0.022, t, 2); wv(MAGENTA, amp2, 0.018, t + 1.4, 1.5, [5, 6]); wv(AMBER, amp1 * 0.35, 0.046, t * 1.3, 1, [2, 8]);

        ctx.save(); ctx.strokeStyle = 'rgba(245,166,35,0.15)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke(); ctx.restore();

        ctx.font = `10px ${MONO}`;
        EQUATIONS.forEach((eq, i) => {
          const y = 18 + i * 18;
          ctx.fillStyle = DIM; ctx.globalAlpha = 1; ctx.fillText(`${eq.label} =`, 12, y);
          ctx.fillStyle = eq.color; ctx.globalAlpha = 0.75;
          ctx.fillText(eq.expr, 12 + ctx.measureText(`${eq.label} = `).width - 4, y);
          ctx.globalAlpha = 1;
        });

        if (mouse.active) {
          const lbl = `(${Math.round(mouse.x)}, ${Math.round(mouse.y)})`; const lw = ctx.measureText(lbl).width;
          ctx.font = `9px ${MONO}`; ctx.fillStyle = 'rgba(245,166,35,0.28)'; ctx.fillText(lbl, w - lw - 12, 16);
        }

        const stats = [{ k: 'users', v: '500,000+' }, { k: 'valuation', v: '$1,000,000' }, { k: 'uptime', v: '99.98%' }, { k: 'engineers', v: '20+' }];
        ctx.font = `9.5px ${MONO}`;
        stats.forEach((st, i) => { const y = h - 14 - (stats.length - 1 - i) * 16; ctx.fillStyle = DIM; ctx.fillText(`${st.k} `, 12, y); ctx.fillStyle = AMBER; ctx.fillText(`= ${st.v}`, 12 + ctx.measureText(`${st.k} `).width, y); });

        if (Math.floor(t * 2) % 2 === 0) { ctx.fillStyle = MAGENTA; ctx.fillRect(12, h - 8, 6, 1.5); }
        t += 0.018;
        raf = requestAnimationFrame(draw);
      };
      draw();
      return () => { cancelAnimationFrame(raf); ro.disconnect(); canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('mouseleave', onLeave); };
    }

    // ── FOURIER ────────────────────────────────────────────────────────────
    if (mode === 'fourier') {
      let frame = 0;
      // cycles through [1, 3, 5, 9, 15] harmonics
      const HARMONIC_STEPS = [1, 3, 5, 9, 15];
      const HOLD = 140;

      const draw = () => {
        const w = canvas.offsetWidth, h = canvas.offsetHeight;
        const step = Math.floor(frame / HOLD) % HARMONIC_STEPS.length;
        const numH = HARMONIC_STEPS[step];

        ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);
        drawGrid(w, h);

        const cy = h * 0.5;
        // draw individual harmonics dim
        for (let k = 1; k <= numH; k += 2) {
          const n = (k + 1) / 2;
          ctx.save(); ctx.strokeStyle = `rgba(245,166,35,${0.12 + 0.06 * (1 / n)})`; ctx.lineWidth = 0.8; ctx.setLineDash([3, 5]); ctx.beginPath();
          for (let x = 0; x <= w; x++) { const phase = (x / w) * Math.PI * 6; const y = cy + (Math.sin(k * phase) / k) * (h * 0.28); if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
          ctx.stroke(); ctx.restore();
        }
        // draw sum bright
        ctx.save(); ctx.shadowColor = AMBER; ctx.shadowBlur = 8; ctx.strokeStyle = AMBER; ctx.lineWidth = 2; ctx.setLineDash([]); ctx.beginPath();
        for (let x = 0; x <= w; x++) {
          const phase = (x / w) * Math.PI * 6;
          let sum = 0; for (let k = 1; k <= numH; k += 2) sum += Math.sin(k * phase) / k;
          const y = cy + sum * (h * 0.28);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke(); ctx.restore();

        // labels
        ctx.font = `10px ${MONO}`; ctx.fillStyle = DIM;
        ctx.fillText('f(x) =', 12, 18);
        ctx.fillStyle = AMBER; ctx.globalAlpha = 0.85;
        ctx.fillText('Σ sin((2k−1)x) / (2k−1)', 12 + ctx.measureText('f(x) = ').width, 18);
        ctx.globalAlpha = 1;
        ctx.fillStyle = DIM; ctx.font = `9px ${MONO}`;
        ctx.fillText(`k=1`, 12, 34);

        // harmonic counter bottom right
        ctx.font = `9.5px ${MONO}`; ctx.fillStyle = DIM; ctx.fillText('harmonics', w - 120, h - 28);
        ctx.fillStyle = MAGENTA; ctx.font = `13px ${MONO}`; ctx.fillText(`= ${numH}`, w - 120 + ctx.measureText('harmonics').width + 6, h - 28);

        // progress bar showing convergence
        const prog = (numH / 15);
        ctx.fillStyle = 'rgba(58,37,8,0.4)'; ctx.fillRect(12, h - 12, w - 24, 2);
        ctx.fillStyle = AMBER; ctx.fillRect(12, h - 12, (w - 24) * prog, 2);

        frame++;
        raf = requestAnimationFrame(draw);
      };
      draw();
      return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    }

    // ── PRIMES ─────────────────────────────────────────────────────────────
    if (mode === 'primes') {
      const MAX = 200;
      const sieve = new Array(MAX + 1).fill(true);
      sieve[0] = sieve[1] = false;
      const compositeOrder: number[] = [];
      for (let p = 2; p <= MAX; p++) {
        if (sieve[p]) { for (let m = p * p; m <= MAX; m += p) { if (sieve[m]) { sieve[m] = false; compositeOrder.push(m); } } }
      }

      let revealed = 0; // how many composites have been crossed out
      let frameCount = 0;
      const PACE = 3; // frames per cross-out
      const RESET_AT = (compositeOrder.length + 1) * PACE + 80;

      const draw = () => {
        const w = canvas.offsetWidth, h = canvas.offsetHeight;
        ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);

        const COLS = 14, ROWS = Math.ceil(MAX / COLS);
        const cellW = (w - 24) / COLS, cellH = Math.min(cellW * 0.9, (h - 60) / ROWS);
        const crossed = new Set(compositeOrder.slice(0, revealed));

        ctx.font = `bold ${Math.min(cellW * 0.38, 10)}px ${MONO}`;
        for (let n = 2; n <= MAX; n++) {
          const idx = n - 2;
          const col = idx % COLS, row = Math.floor(idx / COLS);
          const x = 12 + col * cellW + cellW / 2, y = 28 + row * cellH + cellH * 0.6;

          if (crossed.has(n)) {
            ctx.fillStyle = 'rgba(58,37,8,0.35)'; ctx.fillText(String(n), x - ctx.measureText(String(n)).width / 2, y);
          } else if (sieve[n]) {
            ctx.save(); ctx.shadowColor = AMBER; ctx.shadowBlur = 4; ctx.fillStyle = AMBER;
            ctx.fillText(String(n), x - ctx.measureText(String(n)).width / 2, y); ctx.restore();
          } else {
            ctx.fillStyle = 'rgba(58,37,8,0.25)'; ctx.fillText(String(n), x - ctx.measureText(String(n)).width / 2, y);
          }
        }

        // label
        ctx.font = `9px ${MONO}`; ctx.fillStyle = DIM;
        ctx.fillText('sieve of eratosthenes', 12, h - 24);
        const primeCount = Array.from({ length: MAX - 1 }, (_, i) => i + 2).filter(n => sieve[n] && !crossed.has(n)).length;
        ctx.fillStyle = MAGENTA; ctx.fillText(`  primes found = ${primeCount}`, 12 + ctx.measureText('sieve of eratosthenes').width, h - 24);

        if (frameCount % PACE === 0 && revealed < compositeOrder.length) revealed++;
        if (frameCount >= RESET_AT) { revealed = 0; frameCount = 0; }
        frameCount++;
        raf = requestAnimationFrame(draw);
      };
      draw();
      return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    }

    // ── SORT ───────────────────────────────────────────────────────────────
    if (mode === 'sort') {
      const N = 38;
      const seed = Array.from({ length: N }, (_, i) => i + 1);
      // fisher-yates with fixed seed
      const shuffle = (arr: number[]) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = (i * 2654435769) % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

      type SortState = { arr: number[]; comparing: [number, number] | null; done: boolean; steps: Array<{ arr: number[]; cmp: [number, number] | null }> };

      const buildQuick = (arr: number[]): SortState['steps'] => {
        const steps: SortState['steps'] = []; const a = [...arr];
        const qs = (lo: number, hi: number) => {
          if (lo >= hi) return; const pivot = a[hi]; let i = lo - 1;
          for (let j = lo; j < hi; j++) { steps.push({ arr: [...a], cmp: [j, hi] }); if (a[j] <= pivot) { i++; [a[i], a[j]] = [a[j], a[i]]; steps.push({ arr: [...a], cmp: [i, j] }); } }
          [a[i + 1], a[hi]] = [a[hi], a[i + 1]]; steps.push({ arr: [...a], cmp: null });
          qs(lo, i); qs(i + 2, hi);
        };
        qs(0, a.length - 1); steps.push({ arr: [...a], cmp: null }); return steps;
      };

      const buildBubble = (arr: number[]): SortState['steps'] => {
        const steps: SortState['steps'] = []; const a = [...arr];
        for (let i = 0; i < a.length - 1; i++) for (let j = 0; j < a.length - i - 1; j++) { steps.push({ arr: [...a], cmp: [j, j + 1] }); if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; steps.push({ arr: [...a], cmp: [j, j + 1] }); } }
        steps.push({ arr: [...a], cmp: null }); return steps;
      };

      const buildMerge = (arr: number[]): SortState['steps'] => {
        const steps: SortState['steps'] = []; const a = [...arr];
        const merge = (lo: number, mid: number, hi: number) => {
          const left = a.slice(lo, mid + 1), right = a.slice(mid + 1, hi + 1);
          let i = 0, j = 0, k = lo;
          while (i < left.length && j < right.length) { steps.push({ arr: [...a], cmp: [lo + i, mid + 1 + j] }); if (left[i] <= right[j]) a[k++] = left[i++]; else a[k++] = right[j++]; }
          while (i < left.length) a[k++] = left[i++];
          while (j < right.length) a[k++] = right[j++];
          steps.push({ arr: [...a], cmp: null });
        };
        const ms = (lo: number, hi: number) => { if (lo >= hi) return; const mid = (lo + hi) >> 1; ms(lo, mid); ms(mid + 1, hi); merge(lo, mid, hi); };
        ms(0, a.length - 1); steps.push({ arr: [...a], cmp: null }); return steps;
      };

      const shuffled = shuffle(seed);
      const qSteps = buildQuick(shuffled);
      const bSteps = buildBubble(shuffled);
      const mSteps = buildMerge(shuffled);

      const COLS = [
        { label: 'QUICKSORT',  steps: qSteps, color: AMBER },
        { label: 'MERGESORT',  steps: mSteps, color: MAGENTA },
        { label: 'BUBBLESORT', steps: bSteps, color: AMBER },
      ];

      let frame = 0;
      const PACE = 1;
      const RESET = Math.max(qSteps.length, bSteps.length, mSteps.length) * PACE + 60;

      const draw = () => {
        const w = canvas.offsetWidth, h = canvas.offsetHeight;
        ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);
        drawGrid(w, h);

        const colW = w / 3;
        const stepIdx = Math.floor(frame / PACE);
        const barH = (h - 56) / N;
        const barMaxW = colW - 24;

        COLS.forEach((col, ci) => {
          const x0 = ci * colW;
          const si = Math.min(stepIdx, col.steps.length - 1);
          const { arr, cmp } = col.steps[si];
          const done = si >= col.steps.length - 1;

          // column divider
          if (ci > 0) { ctx.save(); ctx.strokeStyle = 'rgba(58,37,8,0.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0, h); ctx.stroke(); ctx.restore(); }

          // label
          ctx.font = `9px ${MONO}`; ctx.fillStyle = done ? col.color : DIM;
          const lbl = done ? `${col.label} ✓` : col.label;
          ctx.fillText(lbl, x0 + 8, 16);

          // bars
          arr.forEach((val, i) => {
            const isCmp = cmp && (cmp[0] === i || cmp[1] === i);
            const bColor = done ? col.color : isCmp ? MAGENTA : 'rgba(58,37,8,0.8)';
            const bw = (val / N) * barMaxW;
            const by = 28 + i * barH;
            if (done || isCmp) { ctx.save(); ctx.shadowColor = isCmp ? MAGENTA : col.color; ctx.shadowBlur = isCmp ? 6 : 3; }
            ctx.fillStyle = bColor; ctx.fillRect(x0 + 8, by, bw, Math.max(barH - 1, 1));
            if (done || isCmp) ctx.restore();
          });

          // step counter bottom
          ctx.font = `8.5px ${MONO}`; ctx.fillStyle = DIM;
          ctx.fillText(`ops = ${Math.min(stepIdx, col.steps.length - 1)}`, x0 + 8, h - 10);
        });

        if (frame >= RESET) frame = 0; else frame++;
        raf = requestAnimationFrame(draw);
      };
      draw();
      return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    }

    // ── LIFE ───────────────────────────────────────────────────────────────
    if (mode === 'life') {
      const COLS = 60, ROWS = 38;
      let grid: boolean[][] = [];
      let gen = 0;
      let frameCount = 0;
      const STEP_EVERY = 5;

      const init = () => {
        grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => Math.random() < 0.28));
        gen = 0;
      };

      const step = () => {
        const next: boolean[][] = Array.from({ length: ROWS }, () => new Array(COLS).fill(false));
        for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
          let n = 0;
          for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { if (dr === 0 && dc === 0) continue; const nr = (r + dr + ROWS) % ROWS, nc = (c + dc + COLS) % COLS; if (grid[nr][nc]) n++; }
          next[r][c] = grid[r][c] ? (n === 2 || n === 3) : n === 3;
        }
        grid = next; gen++;
      };

      init();

      const draw = () => {
        const w = canvas.offsetWidth, h = canvas.offsetHeight;
        ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);

        const cellW = w / COLS, cellH = (h - 30) / ROWS;
        let alive = 0;
        for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
          if (grid[r][c]) {
            alive++;
            ctx.save(); ctx.shadowColor = AMBER; ctx.shadowBlur = 3;
            ctx.fillStyle = AMBER; ctx.fillRect(c * cellW + 0.5, r * cellH + 0.5, cellW - 1, cellH - 1);
            ctx.restore();
          }
        }

        // grid lines
        ctx.strokeStyle = 'rgba(58,37,8,0.3)'; ctx.lineWidth = 0.3;
        for (let c = 0; c <= COLS; c++) { ctx.beginPath(); ctx.moveTo(c * cellW, 0); ctx.lineTo(c * cellW, ROWS * cellH); ctx.stroke(); }
        for (let r = 0; r <= ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * cellH); ctx.lineTo(w, r * cellH); ctx.stroke(); }

        // labels
        ctx.font = `9px ${MONO}`;
        ctx.fillStyle = DIM; ctx.fillText(`gen = `, 12, h - 10);
        ctx.fillStyle = AMBER; ctx.fillText(String(gen), 12 + ctx.measureText('gen = ').width, h - 10);
        ctx.fillStyle = DIM; ctx.fillText(`  alive = `, 12 + ctx.measureText(`gen = ${gen}`).width, h - 10);
        ctx.fillStyle = MAGENTA; ctx.fillText(String(alive), 12 + ctx.measureText(`gen = ${gen}  alive = `).width, h - 10);

        if (alive === 0 || gen > 600) init();
        if (frameCount % STEP_EVERY === 0) step();
        frameCount++;
        raf = requestAnimationFrame(draw);
      };
      draw();
      return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    }

    return () => { ro.disconnect(); };
  }, [mode]);

  return (
    <canvas
      ref={ref}
      style={{ width: '100%', height: '100%', display: 'block', cursor: mode === 'waves' ? 'crosshair' : 'default' }}
      aria-hidden
    />
  );
}
