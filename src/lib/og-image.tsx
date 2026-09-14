export const ogImageSize = { width: 1200, height: 630 };

export function renderOgImage({
  eyebrow,
  heading,
  subheading,
  tag,
}: {
  eyebrow: string;
  heading: string;
  subheading: string;
  tag?: string;
}) {
  return (
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
        <span style={{ color: '#8b949e', fontSize: 24 }}>{eyebrow}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <span style={{ color: '#58a6ff', fontSize: 30 }}>const post = &#123;</span>
        <span style={{ color: '#e6edf3', fontSize: 60, fontWeight: 700, paddingLeft: 40, maxWidth: 1000 }}>
          {heading}
        </span>
        <span style={{ color: '#a5d6ff', fontSize: 30, paddingLeft: 40, maxWidth: 1000 }}>
          {subheading}
        </span>
        {tag && (
          <span style={{ color: '#7ee787', fontSize: 26, paddingLeft: 40 }}>
            {tag}
          </span>
        )}
        <span style={{ color: '#58a6ff', fontSize: 30 }}>&#125;;</span>
      </div>

      <span style={{ color: '#8b949e', fontSize: 26 }}>www.viiforwin.in</span>
    </div>
  );
}
