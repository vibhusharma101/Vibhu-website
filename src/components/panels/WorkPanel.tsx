import type { WorkExEntry } from '@/data/workex';
import s from './panels.module.css';

const OUTCOMES: Record<string, { num: string; label: string; badge?: string }> = {
  'powerplay-2025': { num: '5',     label: 'AI agents',  badge: 'ACTIVE' },
  'vignam':         { num: '20+',   label: 'team built' },
  'powerplay-2020': { num: '500k+', label: 'users' },
  'trucks24':       { num: '0→1',   label: 'solo build' },
};

interface Props {
  entries: WorkExEntry[];
}

export function WorkPanel({ entries }: Props) {
  return (
    <div className={s.panelBody}>
      <p className={s.codeComment}>experience.ts — professional history</p>
      <p className={s.codeComment} style={{ marginBottom: 36 }}>
        {entries.length} entries · most recent first
      </p>

      {entries.map((entry, i) => {
        const outcome = OUTCOMES[entry.id];
        return (
          <div key={entry.id} className={s.workEntry}>
            <span className={s.entryNum}>0{i + 1}</span>

            <div>
              <div className={s.entryYear}>{entry.period}</div>
              <div className={s.company}>{entry.company}</div>
              <div className={s.entryRole}>{entry.role}</div>
              <p className={s.entryDesc}>{entry.bullets[0]}</p>
            </div>

            <div className={s.outcome}>
              {outcome && (
                <>
                  <span className={s.outcomeNum}>{outcome.num}</span>
                  <span className={s.outcomeLabel}>{outcome.label}</span>
                  {outcome.badge && (
                    <div className={s.badge}>{outcome.badge}</div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
