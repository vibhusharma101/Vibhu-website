// Shared palette + helpers for the hero math visualizations.

export const AMBER   = '#f5a623';
export const MAGENTA = '#ff1463';
export const GRID    = 'rgba(58, 37, 8, 0.45)';
export const BG      = '#030201';
export const DIM     = 'rgba(58,37,8,0.6)';
export const MONO    = '"IBM Plex Mono", monospace';

/** A self-contained animation. Receives a sized canvas + 2d context, returns a cleanup fn. */
export type VizRunner = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) => () => void;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Faint reference grid used by several visualizations. */
export function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, step = 32) {
  ctx.strokeStyle = GRID;
  ctx.lineWidth = 0.5;
  ctx.setLineDash([]);
  for (let x = 0; x < w; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
}

/** Interpolate amber → magenta by `frac` (0..1); used to colour values by magnitude. */
export function valColor(frac: number, alpha = 1) {
  const c = Math.max(0, Math.min(1, frac));
  const r = Math.round(245 + (255 - 245) * c);
  const g = Math.round(166 + (20 - 166) * c);
  const b = Math.round(35 + (99 - 35) * c);
  return `rgba(${r},${g},${b},${alpha})`;
}
