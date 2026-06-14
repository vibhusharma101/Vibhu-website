import { AMBER, MAGENTA, BG, DIM, MONO, drawGrid, type VizRunner } from './shared';

/**
 * Fourier series as rotating epicycles. A chain of phasors — one per odd
 * harmonic, radius ∝ 1/k — rotates; the pen at the chain's tip traces a square
 * wave to the right. The number of vectors slowly grows so the trace visibly
 * sharpens toward a true square wave (Gibbs ears and all).
 */
export const runFourier: VizRunner = (canvas, ctx) => {
  let raf = 0;
  let time = 0;
  let frame = 0;
  let terms = 3;            // active odd harmonics
  const trail: number[] = []; // recent pen-Y samples, newest first

  const draw = () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);
    drawGrid(ctx, w, h);

    // Grow the harmonic count on a slow loop to show convergence.
    if (frame > 0 && frame % 260 === 0) terms = terms >= 9 ? 2 : terms + 1;

    const scale  = Math.min(h * 0.2, w * 0.14);
    const r1     = scale * (4 / Math.PI);          // radius of the first (largest) phasor
    const originX = r1 + 22;
    const originY = h * 0.5;
    const waveStartX = originX + r1 + 28;

    // Reference axis through the wave region.
    ctx.save();
    ctx.strokeStyle = 'rgba(245,166,35,0.12)'; ctx.lineWidth = 1; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(waveStartX, originY); ctx.lineTo(w, originY); ctx.stroke();
    ctx.restore();

    // Walk the phasor chain, drawing each circle + arm.
    let x = originX, y = originY;
    for (let n = 0; n < terms; n++) {
      const k = 2 * n + 1;
      const r = scale * (4 / (Math.PI * k));
      const px = x, py = y;
      x += r * Math.cos(k * time);
      y += r * Math.sin(k * time);

      ctx.strokeStyle = 'rgba(245,166,35,0.16)'; ctx.lineWidth = 1; ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.stroke();

      ctx.strokeStyle = 'rgba(245,166,35,0.55)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
      ctx.fillStyle = 'rgba(245,166,35,0.7)';
      ctx.beginPath(); ctx.arc(x, y, 1.4, 0, Math.PI * 2); ctx.fill();
    }

    const penY = y;
    trail.unshift(penY);
    const maxLen = Math.max(2, Math.floor(w - waveStartX));
    if (trail.length > maxLen) trail.length = maxLen;

    // Connector from pen tip to the leading edge of the trace.
    ctx.save();
    ctx.strokeStyle = 'rgba(255,20,99,0.45)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(waveStartX, penY); ctx.stroke();
    ctx.restore();

    // The traced waveform, scrolling right.
    ctx.save();
    ctx.shadowColor = AMBER; ctx.shadowBlur = 8; ctx.strokeStyle = AMBER; ctx.lineWidth = 2; ctx.setLineDash([]);
    ctx.beginPath();
    for (let i = 0; i < trail.length; i++) {
      const sx = waveStartX + i, sy = trail[i];
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.restore();

    // Pen tip.
    ctx.fillStyle = MAGENTA;
    ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill();

    // Labels.
    ctx.font = `10px ${MONO}`; ctx.fillStyle = DIM;
    ctx.fillText('fourier series', 12, 16);
    ctx.fillStyle = AMBER; ctx.globalAlpha = 0.8;
    ctx.fillText('Σ (4/π) · sin((2k−1)θ)/(2k−1)', 12, 30);
    ctx.globalAlpha = 1;

    ctx.font = `9.5px ${MONO}`; ctx.fillStyle = DIM;
    const cap = 'rotating vectors = ';
    ctx.fillText(cap, 12, h - 12);
    ctx.fillStyle = MAGENTA; ctx.font = `12px ${MONO}`;
    ctx.fillText(String(terms), 12 + ctx.measureText(cap).width + 2, h - 11);

    time += 0.02; frame++;
    raf = requestAnimationFrame(draw);
  };
  draw();

  return () => cancelAnimationFrame(raf);
};
