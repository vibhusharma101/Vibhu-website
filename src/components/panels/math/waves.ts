import { AMBER, MAGENTA, BG, DIM, MONO, drawGrid, type VizRunner } from './shared';

const EQUATIONS = [
  { label: 'growth(t)',  expr: '500k · eˢⁱⁿ⁽ᵗ⁾', color: AMBER   },
  { label: 'P(success)', expr: '1 − e⁻ᵏᵗ',        color: MAGENTA },
  { label: 'uptime',     expr: '1 − 0.0002',        color: AMBER   },
];

const STATS = [
  { k: 'ai agents',  v: '5 live' },
  { k: 'est. time',  v: '−95%' },
  { k: 'users',      v: '500,000+' },
  { k: 'uptime',     v: '99.98%' },
];

/** Animated, mouse-interactive sine waves — the original hero visual. */
export const runWaves: VizRunner = (canvas, ctx) => {
  let raf = 0;
  let t = 0;
  const mouse = { x: -1, y: -1, active: false };
  let freqOffCur = 0;
  let ampScaleCur = 1;

  const onMove = (e: MouseEvent) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.active = true;
  };
  const onLeave = () => { mouse.active = false; };
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseleave', onLeave);

  const draw = () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    const tFreq = mouse.active ? (mouse.x / w) * 0.03 : 0;
    const tAmp  = mouse.active ? 0.65 + (mouse.y / h) * 0.7 : 1;
    freqOffCur  += (tFreq - freqOffCur)  * 0.06;
    ampScaleCur += (tAmp  - ampScaleCur) * 0.06;

    ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);
    drawGrid(ctx, w, h);

    const cy = h * 0.5, amp1 = h * 0.22 * ampScaleCur, amp2 = h * 0.13 * ampScaleCur;
    const wv = (color: string, amp: number, freq: number, phase: number, lw: number, dash: number[] = []) => {
      ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = 10; ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash); ctx.beginPath();
      for (let x = 0; x <= w; x++) { const y = cy + Math.sin(x * (freq + freqOffCur) + phase) * amp; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
      ctx.stroke(); ctx.restore();
    };
    wv(AMBER, amp1, 0.022, t, 2);
    wv(MAGENTA, amp2, 0.018, t + 1.4, 1.5, [5, 6]);
    wv(AMBER, amp1 * 0.35, 0.046, t * 1.3, 1, [2, 8]);

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
      const lbl = `(${Math.round(mouse.x)}, ${Math.round(mouse.y)})`;
      ctx.font = `9px ${MONO}`;
      ctx.fillStyle = 'rgba(245,166,35,0.28)';
      ctx.fillText(lbl, w - ctx.measureText(lbl).width - 12, 16);
    }

    ctx.font = `9.5px ${MONO}`;
    STATS.forEach((st, i) => {
      const y = h - 14 - (STATS.length - 1 - i) * 16;
      ctx.fillStyle = DIM; ctx.fillText(`${st.k} `, 12, y);
      ctx.fillStyle = AMBER; ctx.fillText(`= ${st.v}`, 12 + ctx.measureText(`${st.k} `).width, y);
    });

    if (Math.floor(t * 2) % 2 === 0) { ctx.fillStyle = MAGENTA; ctx.fillRect(12, h - 8, 6, 1.5); }
    t += 0.018;
    raf = requestAnimationFrame(draw);
  };
  draw();

  return () => {
    cancelAnimationFrame(raf);
    canvas.removeEventListener('mousemove', onMove);
    canvas.removeEventListener('mouseleave', onLeave);
  };
};
