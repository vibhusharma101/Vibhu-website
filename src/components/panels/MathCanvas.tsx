'use client';

import { useEffect, useRef } from 'react';

const AMBER   = '#f5a623';
const MAGENTA = '#ff1463';
const GRID    = 'rgba(58, 37, 8, 0.45)';
const BG      = '#030201';

const EQUATIONS = [
  { label: 'growth(t)',  expr: '500k · eˢⁱⁿ⁽ᵗ⁾',  color: AMBER   },
  { label: 'P(success)', expr: '1 − e⁻ᵏᵗ',          color: MAGENTA },
  { label: 'uptime',     expr: '1 − 0.0002',          color: AMBER   },
];

export function MathCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let t = 0;

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

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      // Background
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = GRID;
      ctx.lineWidth = 0.5;
      const step = 32;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      const cy = h * 0.5;
      const amp1 = h * 0.22;
      const amp2 = h * 0.13;

      // Glow helper
      const wave = (
        color: string,
        amp: number,
        freq: number,
        phase: number,
        width: number,
        dash: number[] = [],
      ) => {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur  = 10;
        ctx.strokeStyle = color;
        ctx.lineWidth   = width;
        ctx.setLineDash(dash);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 1) {
          const y = cy + Math.sin(x * freq + phase) * amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      };

      // Primary sine — amber
      wave(AMBER,   amp1, 0.022, t,       2,   []);
      // Secondary cosine — magenta dashed
      wave(MAGENTA, amp2, 0.018, t + 1.4, 1.5, [5, 6]);
      // Third harmonic — faint amber
      wave(AMBER,   amp1 * 0.35, 0.046, t * 1.3, 1, [2, 8]);

      // Center axis
      ctx.save();
      ctx.strokeStyle = 'rgba(245,166,35,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy);
      ctx.stroke();
      ctx.restore();

      // Equation labels (top-left)
      ctx.font = '10px "IBM Plex Mono", monospace';
      EQUATIONS.forEach((eq, i) => {
        const y = 18 + i * 18;
        ctx.fillStyle = 'rgba(58,37,8,0.8)';
        ctx.fillText(`${eq.label} =`, 12, y);
        ctx.fillStyle = eq.color;
        ctx.globalAlpha = 0.75;
        ctx.fillText(eq.expr, 12 + ctx.measureText(`${eq.label} = `).width - 4, y);
        ctx.globalAlpha = 1;
      });

      // Live stats — bottom right
      const stats = [
        { k: 'users',    v: '500,000+' },
        { k: 'valuation', v: '$1,000,000' },
        { k: 'uptime',   v: '99.98%' },
        { k: 'engineers', v: '20+' },
      ];
      ctx.font = '9.5px "IBM Plex Mono", monospace';
      stats.forEach((st, i) => {
        const y = h - 14 - (stats.length - 1 - i) * 16;
        ctx.fillStyle = 'rgba(58,37,8,1)';
        ctx.fillText(`${st.k} `, 12, y);
        ctx.fillStyle = AMBER;
        ctx.fillText(`= ${st.v}`, 12 + ctx.measureText(`${st.k} `).width, y);
      });

      // Blinking cursor
      if (Math.floor(t * 2) % 2 === 0) {
        ctx.fillStyle = MAGENTA;
        ctx.fillRect(12, h - 8, 6, 1.5);
      }

      t += 0.018;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden
    />
  );
}
