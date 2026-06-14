'use client';

import { useState } from 'react';
import { MathCanvas, type MathTab } from './MathCanvas';
import s from './panels.module.css';

const TABS: { id: MathTab; label: string }[] = [
  { id: 'waves',   label: 'WAVES'   },
  { id: 'fourier', label: 'FOURIER' },
  { id: 'sort',    label: 'SORT'    },
];

export function MathVisualizer() {
  const [tab, setTab] = useState<MathTab>('waves');

  return (
    <div className={s.mathWrap}>
      <div className={s.tabBar}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${s.tabBtn} ${tab === t.id ? s.tabBtnActive : ''}`}
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className={s.mathCanvas}>
        <MathCanvas mode={tab} />
      </div>
    </div>
  );
}
