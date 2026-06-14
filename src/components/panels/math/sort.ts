import { MAGENTA, BG, DIM, MONO, drawGrid, valColor, type VizRunner } from './shared';

type Step = { arr: number[]; cmp: [number, number] | null };

const shuffle = (arr: number[]) => {
  const a = [...arr];
  // deterministic shuffle so every run starts identically across the 3 columns
  for (let i = a.length - 1; i > 0; i--) {
    const j = (i * 2654435769) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildQuick = (arr: number[]): Step[] => {
  const steps: Step[] = []; const a = [...arr];
  const qs = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const pivot = a[hi]; let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      steps.push({ arr: [...a], cmp: [j, hi] });
      if (a[j] <= pivot) { i++; [a[i], a[j]] = [a[j], a[i]]; steps.push({ arr: [...a], cmp: [i, j] }); }
    }
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    steps.push({ arr: [...a], cmp: null });
    qs(lo, i); qs(i + 2, hi);
  };
  qs(0, a.length - 1);
  steps.push({ arr: [...a], cmp: null });
  return steps;
};

const buildBubble = (arr: number[]): Step[] => {
  const steps: Step[] = []; const a = [...arr];
  for (let i = 0; i < a.length - 1; i++)
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ arr: [...a], cmp: [j, j + 1] });
      if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; steps.push({ arr: [...a], cmp: [j, j + 1] }); }
    }
  steps.push({ arr: [...a], cmp: null });
  return steps;
};

const buildMerge = (arr: number[]): Step[] => {
  const steps: Step[] = []; const a = [...arr];
  const merge = (lo: number, mid: number, hi: number) => {
    const left = a.slice(lo, mid + 1), right = a.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      steps.push({ arr: [...a], cmp: [lo + i, mid + 1 + j] });
      if (left[i] <= right[j]) a[k++] = left[i++]; else a[k++] = right[j++];
    }
    while (i < left.length) a[k++] = left[i++];
    while (j < right.length) a[k++] = right[j++];
    steps.push({ arr: [...a], cmp: null });
  };
  const ms = (lo: number, hi: number) => { if (lo >= hi) return; const mid = (lo + hi) >> 1; ms(lo, mid); ms(mid + 1, hi); merge(lo, mid, hi); };
  ms(0, a.length - 1);
  steps.push({ arr: [...a], cmp: null });
  return steps;
};

/**
 * Three algorithms sorting the same shuffled array, side by side. Playback is
 * time-normalized so all three finish together (the op counter reveals the real
 * cost gap); bar widths lerp toward their targets so swaps glide instead of
 * snapping, and the same lerp absorbs the loop reset smoothly.
 */
export const runSort: VizRunner = (canvas, ctx) => {
  const N = 30;
  const shuffled = shuffle(Array.from({ length: N }, (_, i) => i + 1));
  const algos = [
    { label: 'QUICKSORT',  steps: buildQuick(shuffled)  },
    { label: 'MERGESORT',  steps: buildMerge(shuffled)  },
    { label: 'BUBBLESORT', steps: buildBubble(shuffled) },
  ];
  const DURATION = 560; // frames spent sorting
  const HOLD = 130;     // frames holding the finished state
  const disp = algos.map(() => [...shuffled]); // currently displayed widths
  let frame = 0;
  let raf = 0;

  const draw = () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);
    drawGrid(ctx, w, h);

    const colW = w / 3, top = 30, bot = 24;
    const barH = (h - top - bot) / N;
    const maxW = colW - 26;
    const progress = Math.min(frame / DURATION, 1);
    const done = progress >= 1;

    algos.forEach((al, ci) => {
      const x0 = ci * colW;
      const si = Math.floor(progress * (al.steps.length - 1));
      const { arr, cmp } = al.steps[si];

      if (ci > 0) {
        ctx.strokeStyle = 'rgba(58,37,8,0.6)'; ctx.lineWidth = 1; ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0, h); ctx.stroke();
      }

      ctx.font = `9px ${MONO}`;
      ctx.fillStyle = done ? MAGENTA : DIM;
      ctx.fillText(done ? `${al.label} ✓` : al.label, x0 + 12, 16);

      for (let i = 0; i < N; i++) {
        disp[ci][i] += (arr[i] - disp[ci][i]) * 0.25;
        const val = disp[ci][i];
        const bw = Math.max(2, (val / N) * maxW);
        const by = top + i * barH;
        const isCmp = !done && cmp != null && (cmp[0] === i || cmp[1] === i);
        if (isCmp) {
          ctx.save(); ctx.shadowColor = MAGENTA; ctx.shadowBlur = 8;
          ctx.fillStyle = MAGENTA; ctx.fillRect(x0 + 12, by, bw, Math.max(barH - 1.2, 1));
          ctx.restore();
        } else {
          ctx.fillStyle = valColor((val - 1) / (N - 1), done ? 0.95 : 0.82);
          ctx.fillRect(x0 + 12, by, bw, Math.max(barH - 1.2, 1));
        }
      }

      ctx.font = `8.5px ${MONO}`; ctx.fillStyle = DIM;
      ctx.fillText(`ops ${si}`, x0 + 12, h - 10);
    });

    frame++;
    if (frame > DURATION + HOLD) frame = 0; // reset; lerp glides bars back to shuffled
    raf = requestAnimationFrame(draw);
  };
  draw();

  return () => cancelAnimationFrame(raf);
};
