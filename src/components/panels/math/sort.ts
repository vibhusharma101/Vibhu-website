import { AMBER, MAGENTA, BG, DIM, MONO, valColor, type VizRunner } from './shared';

type Op = { type: 'cmp' | 'swap'; i: number; j: number };

const N = 40;

const makeShuffle = () => {
  const a = Array.from({ length: N }, (_, i) => i + 1);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Each generator replays a sort over a copy of `start`, recording every
// comparison and swap as a slot-indexed op. Swaps are what physically move bars.
const quickOps = (start: number[]): Op[] => {
  const ops: Op[] = []; const a = [...start];
  const qs = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const pivot = a[hi]; let i = lo;
    for (let j = lo; j < hi; j++) {
      ops.push({ type: 'cmp', i: j, j: hi });
      if (a[j] < pivot) {
        if (i !== j) { [a[i], a[j]] = [a[j], a[i]]; ops.push({ type: 'swap', i, j }); }
        i++;
      }
    }
    if (i !== hi) { [a[i], a[hi]] = [a[hi], a[i]]; ops.push({ type: 'swap', i, j: hi }); }
    qs(lo, i - 1); qs(i + 1, hi);
  };
  qs(0, a.length - 1);
  return ops;
};

const heapOps = (start: number[]): Op[] => {
  const ops: Op[] = []; const a = [...start]; const n = a.length;
  const sift = (root: number, end: number) => {
    while (2 * root + 1 <= end) {
      const child = 2 * root + 1; let swp = root;
      ops.push({ type: 'cmp', i: swp, j: child });
      if (a[swp] < a[child]) swp = child;
      if (child + 1 <= end) {
        ops.push({ type: 'cmp', i: swp, j: child + 1 });
        if (a[swp] < a[child + 1]) swp = child + 1;
      }
      if (swp === root) return;
      [a[root], a[swp]] = [a[swp], a[root]];
      ops.push({ type: 'swap', i: root, j: swp });
      root = swp;
    }
  };
  for (let s = Math.floor(n / 2) - 1; s >= 0; s--) sift(s, n - 1);
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    ops.push({ type: 'swap', i: 0, j: end });
    sift(0, end - 1);
  }
  return ops;
};

const bubbleOps = (start: number[]): Op[] => {
  const ops: Op[] = []; const a = [...start];
  for (let i = 0; i < a.length - 1; i++)
    for (let j = 0; j < a.length - 1 - i; j++) {
      ops.push({ type: 'cmp', i: j, j: j + 1 });
      if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; ops.push({ type: 'swap', i: j, j: j + 1 }); }
    }
  return ops;
};

const ALGOS = [
  {
    label: 'QUICK SORT',
    gen: quickOps,
    big: 'Θ(n log n) avg · O(n²) worst',
    desc: 'pick a pivot, push smaller values left, then recurse each side',
  },
  {
    label: 'HEAP SORT',
    gen: heapOps,
    big: 'Θ(n log n) always',
    desc: 'build a max-heap, repeatedly pull the largest to the end',
  },
  {
    label: 'BUBBLE SORT',
    gen: bubbleOps,
    big: 'Θ(n²) avg · O(n) best',
    desc: 'compare neighbours and swap if out of order, pass after pass',
  },
];

/**
 * One full-width bar chart, height + colour encode value. Every value is a
 * persistent bar whose x-position eases toward its current slot, so a swap is
 * two bars sliding past each other — never a snap. Each algorithm is normalized
 * to a fixed duration (followable regardless of op count); the comparison/swap
 * counters expose the real cost gap. Finishes with a left→right "sorted" sweep,
 * then smoothly re-shuffles for the next algorithm.
 */
export const runSort: VizRunner = (canvas, ctx) => {
  let raf = 0;

  let algoIdx = 0;
  let order = makeShuffle();
  let ops = ALGOS[algoIdx].gen(order);
  let opPtr = 0;
  let opAccum = 0;
  let comparisons = 0;
  let swaps = 0;
  let phase: 'shuffle' | 'sorting' | 'done' = 'sorting';
  let phaseTimer = 0;
  let cmpA = -1, cmpB = -1;
  let initialized = false;

  const displayX = new Float32Array(N + 1); // pixel centre per value (1..N)

  const DURATION = 660;       // frames to complete a sort (slower = followable)
  const HOLD = 120;           // frames holding the sorted state
  const SHUFFLE_SETTLE = 40;  // frames for bars to glide into a new shuffle

  const draw = () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);

    const padX = 16, topPad = 54, botPad = 22;
    const barW = (w - padX * 2) / N;
    const baseline = h - botPad;
    const maxBarH = baseline - topPad;

    const slotOf = new Array<number>(N + 1);
    for (let s = 0; s < N; s++) slotOf[order[s]] = s;

    if (!initialized) {
      for (let v = 1; v <= N; v++) displayX[v] = padX + slotOf[v] * barW + barW / 2;
      initialized = true;
    }

    // ── advance the simulation ──
    if (phase === 'sorting') {
      opAccum += ops.length / DURATION;
      while (opAccum >= 1 && opPtr < ops.length) {
        const op = ops[opPtr++];
        opAccum -= 1;
        cmpA = op.i; cmpB = op.j;
        if (op.type === 'cmp') { comparisons++; }
        else { const t = order[op.i]; order[op.i] = order[op.j]; order[op.j] = t; swaps++; }
      }
      if (opPtr >= ops.length) { phase = 'done'; phaseTimer = 0; cmpA = -1; cmpB = -1; }
    } else if (phase === 'done') {
      phaseTimer++;
      if (phaseTimer > HOLD) {
        algoIdx = (algoIdx + 1) % ALGOS.length;
        order = makeShuffle();
        ops = ALGOS[algoIdx].gen(order);
        opPtr = 0; opAccum = 0; comparisons = 0; swaps = 0;
        phase = 'shuffle'; phaseTimer = 0;
      }
    } else {
      phaseTimer++;
      if (phaseTimer > SHUFFLE_SETTLE) { phase = 'sorting'; phaseTimer = 0; }
    }

    // slots may have changed after swaps
    for (let s = 0; s < N; s++) slotOf[order[s]] = s;

    // baseline axis
    ctx.strokeStyle = 'rgba(245,166,35,0.14)'; ctx.lineWidth = 1; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(padX, baseline + 0.5); ctx.lineTo(w - padX, baseline + 0.5); ctx.stroke();

    const done = phase === 'done';
    const sweepSlot = done ? Math.floor((phaseTimer / HOLD) * N) : -1;

    // ── bars ──
    for (let v = 1; v <= N; v++) {
      const target = padX + slotOf[v] * barW + barW / 2;
      displayX[v] += (target - displayX[v]) * 0.22;
      const bx = displayX[v] - barW / 2 + 0.6;
      const bw = Math.max(1.5, barW - 1.2);
      const bh = (v / N) * maxBarH;
      const by = baseline - bh;
      const frac = (v - 1) / (N - 1);
      const s = slotOf[v];
      const isCmp = !done && (s === cmpA || s === cmpB);
      const swept = done && s <= sweepSlot;

      if (isCmp) {
        ctx.save(); ctx.shadowColor = MAGENTA; ctx.shadowBlur = 10;
        ctx.fillStyle = MAGENTA; ctx.fillRect(bx, by, bw, bh); ctx.restore();
      } else if (swept) {
        ctx.save(); ctx.shadowColor = valColor(frac); ctx.shadowBlur = 6;
        ctx.fillStyle = valColor(frac, 1); ctx.fillRect(bx, by, bw, bh); ctx.restore();
      } else {
        ctx.fillStyle = valColor(frac, 0.85);
        ctx.fillRect(bx, by, bw, bh);
      }
    }

    // ── labels (all at the top) ──
    const al = ALGOS[algoIdx];

    // line 1: algorithm name + live progress
    ctx.font = `11px ${MONO}`;
    ctx.fillStyle = done ? MAGENTA : AMBER;
    ctx.fillText(done ? `${al.label}  ✓ sorted` : al.label, padX, 16);

    if (phase === 'sorting') {
      const p = `${Math.round((opPtr / ops.length) * 100)}%`;
      ctx.font = `9px ${MONO}`; ctx.fillStyle = DIM;
      ctx.fillText(p, w - padX - ctx.measureText(p).width, 16);
    }

    // line 2: live counters (numbers in amber so they pop as they climb)
    ctx.font = `9px ${MONO}`;
    const seg = (label: string, value: string, x: number) => {
      ctx.fillStyle = DIM; ctx.fillText(label, x, 31);
      const lw = ctx.measureText(label).width;
      ctx.fillStyle = AMBER; ctx.fillText(value, x + lw, 31);
      return x + lw + ctx.measureText(value).width;
    };
    let lx = seg('comparisons ', String(comparisons), padX);
    lx = seg('    swaps ', String(swaps), lx);
    seg('    n ', String(N), lx);

    // line 3: time complexity
    ctx.fillStyle = 'rgba(245,166,35,0.6)';
    ctx.fillText(`time complexity  ${al.big}`, padX, 45);

    // bottom: plain-english strategy
    ctx.fillStyle = DIM;
    ctx.fillText(al.desc, padX, h - 9);

    raf = requestAnimationFrame(draw);
  };
  draw();

  return () => cancelAnimationFrame(raf);
};
