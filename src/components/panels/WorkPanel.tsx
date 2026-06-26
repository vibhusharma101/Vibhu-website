'use client';

import { useState } from 'react';
import type { WorkExEntry } from '@/data/workex';
import s from './panels.module.css';

const OUTCOMES: Record<string, { num: string; label: string; badge?: string }> = {
  'powerplay-2025': { num: '3',     label: 'tools built',  badge: 'ACTIVE' },
  'vignam':         { num: '20+',   label: 'team built' },
  'powerplay-2020': { num: '500k+', label: 'users' },
  'trucks24':       { num: '0→1',   label: 'solo build' },
};

interface Props {
  entries: WorkExEntry[];
}

export function WorkPanel({ entries }: Props) {
  const [open, setOpen] = useState<WorkExEntry | null>(null);

  return (
    <div className={s.panelBody}>
      <p className={s.codeComment}>experience.ts — professional history</p>
      <p className={s.codeComment} style={{ marginBottom: 36 }}>
        {entries.length} entries · click any entry for details
      </p>

      {entries.map((entry, i) => {
        const outcome = OUTCOMES[entry.id];
        return (
          <div
            key={entry.id}
            className={s.workEntry}
            style={{ cursor: 'pointer' }}
            onClick={() => setOpen(entry)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setOpen(entry)}
          >
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

      {/* ── Detail dialog ── */}
      {open && (
        <div className={s.dialogOverlay} onClick={() => setOpen(null)}>
          <div className={s.dialog} onClick={e => e.stopPropagation()}>

            {/* Title bar */}
            <div className={s.dialogTitlebar}>
              <div className={s.dialogTitleLeft}>
                <span className={s.dialogFile}>experience.ts</span>
                <span className={s.dialogSep}>›</span>
                <span className={s.dialogEntry}>{open.company}</span>
              </div>
              <button
                className={s.dialogClose}
                onClick={() => setOpen(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className={s.dialogBody}>
              <div className={s.dialogMeta}>
                <span>{open.period}</span>
                <span className={s.dialogSep}>·</span>
                <span>{open.location}</span>
              </div>
              <div className={s.dialogCompany}>{open.company}</div>
              <div className={s.dialogRole}>{open.role}</div>

              <ul className={s.dialogBullets}>
                {open.bullets.map((b, i) => (
                  <li key={i} className={s.dialogBullet}>
                    <span className={s.dialogBulletDot}>▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className={s.dialogSkills}>
                {open.skills.map(skill => (
                  <span key={skill} className={s.dialogSkillBadge}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
