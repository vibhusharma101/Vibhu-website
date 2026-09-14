import { ImageResponse } from 'next/og';
import { bio } from '@/data/bio';

export const alt = 'Vibhanshu Sharma — AI Engineer & Founder';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0d1117',
          padding: '80px',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 16, height: 16, borderRadius: 999, background: '#ff5f56' }} />
            <div style={{ width: 16, height: 16, borderRadius: 999, background: '#ffbd2e' }} />
            <div style={{ width: 16, height: 16, borderRadius: 999, background: '#27c93f' }} />
          </div>
          <span style={{ color: '#8b949e', fontSize: 24 }}>vibhanshu.tsx</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span style={{ color: '#58a6ff', fontSize: 30 }}>const engineer = &#123;</span>
          <span style={{ color: '#e6edf3', fontSize: 72, fontWeight: 700, paddingLeft: 40 }}>
            {bio.name}
          </span>
          <span style={{ color: '#a5d6ff', fontSize: 34, paddingLeft: 40, maxWidth: 1000 }}>
            AI Engineer &amp; 2x Founder
          </span>
          <span style={{ color: '#7ee787', fontSize: 28, paddingLeft: 40 }}>
            {bio.currentRole}
          </span>
          <span style={{ color: '#58a6ff', fontSize: 30 }}>&#125;;</span>
        </div>

        <span style={{ color: '#8b949e', fontSize: 26 }}>www.viiforwin.in</span>
      </div>
    ),
    { ...size }
  );
}
