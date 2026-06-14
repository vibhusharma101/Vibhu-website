'use client';

import { useEffect, useRef } from 'react';
import type { VizRunner } from './math/shared';
import { runWaves } from './math/waves';
import { runFourier } from './math/fourier';
import { runPrimes } from './math/primes';
import { runSort } from './math/sort';
import { runLife } from './math/life';

export type MathTab = 'waves' | 'fourier' | 'primes' | 'sort' | 'life';

const RUNNERS: Record<MathTab, VizRunner> = {
  waves: runWaves,
  fourier: runFourier,
  primes: runPrimes,
  sort: runSort,
  life: runLife,
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
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const stop = RUNNERS[mode](canvas, ctx);

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
