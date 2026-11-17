'use client';

import { useEffect, useRef } from 'react';
import type { VizRunner } from './math/shared';
import { runWaves } from './math/waves';
import { runFourier } from './math/fourier';
import { runSort } from './math/sort';

export type MathTab = 'waves' | 'fourier' | 'sort';

const RUNNERS: Record<MathTab, VizRunner> = {
  waves: runWaves,
  fourier: runFourier,
  sort: runSort,
};

interface Props { mode: MathTab; }

export function MathCanvas({ mode }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    // Resizing clears the canvas. Animated runners repaint next frame; under reduced
    // motion the runner draws a single still, so restart it after every resize.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stop = () => {};
    const start = () => { stop(); stop = RUNNERS[mode](canvas, ctx); };

    resize();
    const ro = new ResizeObserver(() => { resize(); if (reduced) start(); });
    ro.observe(canvas);
    start();

    return () => {
      stop();
      ro.disconnect();
    };
  }, [mode]);

  return (
    <canvas
      ref={ref}
      style={{ width: '100%', height: '100%', display: 'block', cursor: mode === 'waves' ? 'crosshair' : 'default' }}
      aria-hidden
    />
  );
}
