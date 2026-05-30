import type { PanelId } from '@/types/panel';
import { bio } from '@/data/bio';
import s from './panels.module.css';

interface Props {
  onNavigate: (panel: PanelId) => void;
}

export function HomePanel({ onNavigate }: Props) {
  return (
    <div className={s.heroBody}>
      <p className={s.codeComment}>personal-os v2026.05 · operator mode</p>
      <div style={{ height: 20 }} />

      <div className={s.bootLog}>
        <span className={s.bootPrompt}>$ </span>
        <span className={s.bootValue}>ssh vibhanshu@2026 --mode=operator</span>
        <br />
        <span className={s.bootPrompt}>→ </span>
        <span className={s.bootOk}>✓ </span>
        <span className={s.bootValue}>2x_founder · iitr_gold_medalist · tech_generalist</span>
        <br />
        <span className={s.bootPrompt}>→ </span>
        <span className={s.bootValue}>currently: AI automation @ powerplay · bengaluru</span>
      </div>

      <h1 className={s.heroName}>
        Vibhanshu<br />
        Sharma.<span className={s.cursor} aria-hidden />
      </h1>

      <p className={s.tagline}>
        <b>Tech generalist. Two-time founder. IIT Roorkee gold medalist.</b>{' '}
        Three companies from zero — <em>no template, no vapor.</em>
      </p>

      <div className={s.statsBar} role="list">
        {Object.entries(bio.stats).map(([key, val]) => (
          <div key={key} className={s.statBox} role="listitem">
            <span className={s.statNum}>{val}</span>
            <span className={s.statLabel}>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
          </div>
        ))}
      </div>

      <div className={s.ctaRow}>
        <button className={s.btn} onClick={() => onNavigate('contact')}>
          get in touch
        </button>
        <button className={`${s.btn} ${s.btnGhost}`} onClick={() => onNavigate('work')}>
          see my work
        </button>
      </div>
    </div>
  );
}
