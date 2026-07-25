'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import katex from 'katex';

/* ─────────────────────────────────────────────────────────
   1. ComparisonToggle — CLAUDE.md (handbook) vs Hooks (gate)
───────────────────────────────────────────────────────── */

const HANDBOOK_STEPS = [
  { icon: '📖', text: 'Claude reads your rules at session start' },
  { icon: '🧠', text: 'Rules become part of working memory' },
  { icon: '⚡', text: 'Claude gets deep into building a feature…' },
  { icon: '📉', text: 'Your rule from line 3 loses salience vs. the immediate problem' },
  { icon: '❌', text: 'Custom component written — rule quietly ignored' },
];

const HOOK_STEPS = [
  { icon: '✍️', text: 'Claude is about to write a file' },
  { icon: '⚙️', text: 'PreToolUse hook fires automatically — every single time' },
  { icon: '🔍', text: 'Script scans: "is this a custom Button?"' },
  { icon: '🚫', text: 'Violation found → exit 1 → action is blocked' },
  { icon: '✅', text: 'Claude reads the error and retries with Mantine' },
];

export function ComparisonToggle() {
  const [active, setActive] = useState<'handbook' | 'hook'>('handbook');
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    const steps = active === 'handbook' ? HANDBOOK_STEPS : HOOK_STEPS;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setVisible(i);
      if (i >= steps.length) clearInterval(id);
    }, 320);
    return () => clearInterval(id);
  }, [active]);

  const steps = active === 'handbook' ? HANDBOOK_STEPS : HOOK_STEPS;
  const accent = active === 'handbook' ? 'var(--color-amber)' : 'var(--color-magenta)';

  return (
    <div style={{
      border: `1px solid var(--color-amber-deep)`,
      margin: '32px 0',
      fontFamily: 'var(--font-mono)',
      background: 'var(--color-bg2)',
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-amber-deep)' }}>
        {(['handbook', 'hook'] as const).map(tab => {
          const isActive = active === tab;
          const color = tab === 'handbook' ? 'var(--color-amber)' : 'var(--color-magenta)';
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              style={{
                flex: 1,
                padding: '11px 16px',
                background: isActive ? 'var(--color-bg)' : 'var(--color-bg2)',
                border: 'none',
                borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
                color: isActive ? color : 'var(--color-amber-dim)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.15s',
                textTransform: 'uppercase',
              }}
            >
              {tab === 'handbook' ? '📋  CLAUDE.md — Advisory' : '⚡  Hooks — Enforced'}
            </button>
          );
        })}
      </div>

      {/* Step list */}
      <div style={{ padding: 'clamp(14px, 4vw, 24px) clamp(14px, 4vw, 28px)', minHeight: 180 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((step, i) => (
            <div
              key={step.text}
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                opacity: i < visible ? 1 : 0,
                transform: i < visible ? 'translateX(0)' : 'translateX(-8px)',
                transition: 'opacity 0.25s, transform 0.25s',
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0, width: 24 }}>{step.icon}</span>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{
                  fontSize: 9,
                  color: 'var(--color-amber-dim)',
                  width: 22,
                  textAlign: 'right',
                  flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 13, color: 'var(--color-amber-dim)', lineHeight: 1.45 }}>
                  {step.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {visible >= steps.length && (
          <div style={{
            marginTop: 20,
            padding: '10px 14px',
            borderLeft: `3px solid ${accent}`,
            fontSize: 12,
            color: 'var(--color-amber-dim)',
            background: 'var(--color-bg)',
            animation: 'fadeIn 0.3s ease',
          }}>
            Nature:{' '}
            <strong style={{ color: accent }}>
              {active === 'handbook' ? 'Advisory — like a speed limit sign' : 'Mechanical — like a speed bump'}
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────
   2. HookTrace — animated terminal trace of a hook firing
───────────────────────────────────────────────────────── */

type TraceType = 'ai' | 'tool' | 'hook' | 'error' | 'success';

const TRACE_STEPS: { label: string; text: string; type: TraceType }[] = [
  { label: 'claude', text: 'I need a Button component here, let me create one…', type: 'ai' },
  { label: 'tool',   text: 'Write → src/components/Foo.tsx', type: 'tool' },
  { label: 'hook',   text: 'PreToolUse firing: check-mantine.js', type: 'hook' },
  { label: 'hook',   text: 'Scanning content for custom component patterns…', type: 'hook' },
  { label: 'hook',   text: 'FOUND: function Button( — Mantine rule violated!', type: 'error' },
  { label: 'hook',   text: 'exit 1 → write is BLOCKED', type: 'error' },
  { label: 'claude', text: '[HOOK] Mantine rule violated. Use <Button> from @mantine/core', type: 'ai' },
  { label: 'claude', text: 'Understood. Retrying with Mantine…', type: 'ai' },
  { label: 'tool',   text: 'Write → src/components/Foo.tsx', type: 'tool' },
  { label: 'hook',   text: 'PreToolUse firing: check-mantine.js', type: 'hook' },
  { label: 'hook',   text: 'Scanning content… no violations found.', type: 'hook' },
  { label: 'hook',   text: 'exit 0 → write is ALLOWED ✓', type: 'success' },
  { label: 'tool',   text: 'File written: src/components/Foo.tsx ✓', type: 'success' },
];

const TRACE_COLOR: Record<TraceType, string> = {
  ai:      'var(--color-amber-text)',
  tool:    'var(--color-amber-dim)',
  hook:    '#7ec8e3',
  error:   'var(--color-magenta)',
  success: '#7ec87e',
};

const TRACE_PREFIX: Record<TraceType, string> = {
  ai:      '❯',
  tool:    '▸',
  hook:    '⚙',
  error:   '✗',
  success: '✓',
};

export function HookTrace() {
  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playing && shown < TRACE_STEPS.length) {
      intervalRef.current = setInterval(() => {
        setShown(s => {
          if (s + 1 >= TRACE_STEPS.length) {
            setPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
          return s + 1;
        });
      }, 480);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, shown]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [shown]);

  const reset = () => {
    setShown(0);
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const done = shown >= TRACE_STEPS.length;

  return (
    <div style={{
      border: '1px solid var(--color-amber-deep)',
      margin: '32px 0',
      fontFamily: 'var(--font-mono)',
      background: 'var(--color-bg)',
    }}>
      {/* Terminal title bar */}
      <div style={{
        background: 'var(--color-bg2)',
        borderBottom: '1px solid var(--color-amber-deep)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-magenta)', display: 'inline-block' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-amber)', display: 'inline-block' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-amber-dim)', display: 'inline-block' }} />
          <span style={{ marginLeft: 10, fontSize: 10, color: 'var(--color-amber-dim)', letterSpacing: '0.1em' }}>
            hook-trace — bash
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!done ? (
            <button
              onClick={() => setPlaying(p => !p)}
              style={{
                background: 'var(--color-magenta)',
                color: '#000',
                border: 'none',
                padding: '4px 12px',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              {playing ? '⏸ PAUSE' : shown === 0 ? '▶ RUN DEMO' : '▶ RESUME'}
            </button>
          ) : (
            <button
              onClick={reset}
              style={{
                background: 'transparent',
                color: 'var(--color-amber-dim)',
                border: '1px solid var(--color-amber-deep)',
                padding: '4px 12px',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                cursor: 'pointer',
              }}
            >
              ↺ RESET
            </button>
          )}
        </div>
      </div>

      {/* Trace output */}
      <div style={{
        padding: 'clamp(12px, 3vw, 16px) clamp(12px, 3vw, 20px)',
        minHeight: 220,
        maxHeight: 320,
        overflowY: 'auto',
        fontSize: 12,
        lineHeight: 1.7,
      }}>
        {shown === 0 && (
          <span style={{ color: 'var(--color-amber-dim)', fontSize: 11 }}>
            Press ▶ RUN DEMO to see how a hook intercepts Claude in real-time…
          </span>
        )}
        {TRACE_STEPS.slice(0, shown).map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 2 }}>
            <span style={{ color: 'var(--color-amber-dim)', width: 22, textAlign: 'right', flexShrink: 0, fontSize: 10, paddingTop: 2 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{ color: TRACE_COLOR[step.type], flexShrink: 0, width: 14 }}>
              {TRACE_PREFIX[step.type]}
            </span>
            <span style={{ color: 'var(--color-amber-dim)', fontSize: 9, width: 46, flexShrink: 0, paddingTop: 2, letterSpacing: '0.05em' }}>
              [{step.label}]
            </span>
            <span style={{ color: TRACE_COLOR[step.type] }}>
              {step.text}
            </span>
          </div>
        ))}
        {playing && shown < TRACE_STEPS.length && (
          <div style={{ color: 'var(--color-amber-dim)', fontSize: 11, marginTop: 4 }}>
            <BlinkCursor />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Legend */}
      <div style={{
        borderTop: '1px solid var(--color-amber-deep)',
        padding: '8px 20px',
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
      }}>
        {([
          { type: 'ai', label: 'Claude' },
          { type: 'tool', label: 'Tool call' },
          { type: 'hook', label: 'Hook' },
          { type: 'error', label: 'Blocked' },
          { type: 'success', label: 'Allowed' },
        ] as { type: TraceType; label: string }[]).map(({ type, label }) => (
          <div key={type} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <span style={{ color: TRACE_COLOR[type], fontSize: 10 }}>{TRACE_PREFIX[type]}</span>
            <span style={{ color: 'var(--color-amber-dim)', fontSize: 9, letterSpacing: '0.08em' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlinkCursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn(o => !o), 500);
    return () => clearInterval(id);
  }, []);
  return <span style={{ opacity: on ? 1 : 0 }}>█</span>;
}


/* ─────────────────────────────────────────────────────────
   3. TryItChecklist — interactive step tracker
───────────────────────────────────────────────────────── */

const CHECKLIST_STEPS = [
  {
    label: 'Add a visibility hook',
    desc: 'Add the echo hook to .claude/settings.json so you can see when PreToolUse fires.',
    code: `"hooks": { "PreToolUse": [{ "matcher": "Write", "hooks": [{ "type": "command", "command": "echo \\'[HOOK] About to write a file\\'" }] }] }`,
  },
  {
    label: 'Run Claude and watch the log',
    desc: 'Ask Claude to write any file. You should see [HOOK] appear in the output — that\'s the hook firing.',
    code: null,
  },
  {
    label: 'Log what Claude is writing',
    desc: 'Replace the echo with a script that logs the full content Claude is about to write.',
    code: `cat - >> .claude/write-log.txt\nexit 0`,
  },
  {
    label: 'Write your first enforcement',
    desc: 'Add a pattern check that exits 1 when Claude violates a rule. Start small — one rule, one pattern.',
    code: `const code = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'))?.tool_input?.content ?? '';\nif (/function\\s+Button\\s*\\(/.test(code)) { console.error('[HOOK] Use Mantine <Button>'); process.exit(1); }\nprocess.exit(0);`,
  },
];

export function TryItChecklist() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState<number | null>(0);

  const toggle = (i: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const allDone = checked.size === CHECKLIST_STEPS.length;

  return (
    <div style={{
      border: '1px solid var(--color-amber-deep)',
      margin: '32px 0',
      fontFamily: 'var(--font-mono)',
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--color-bg2)',
        borderBottom: '1px solid var(--color-amber-deep)',
        padding: '10px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 10, color: 'var(--color-amber)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {'// try it yourself'}
        </span>
        <span style={{ fontSize: 10, color: allDone ? '#7ec87e' : 'var(--color-amber-dim)' }}>
          {checked.size}/{CHECKLIST_STEPS.length} done
        </span>
      </div>

      {/* Steps */}
      <div>
        {CHECKLIST_STEPS.map((step, i) => {
          const isChecked = checked.has(i);
          const isOpen = expanded === i;
          return (
            <div
              key={i}
              style={{ borderBottom: i < CHECKLIST_STEPS.length - 1 ? '1px solid var(--color-amber-deep)' : 'none' }}
            >
              {/* Step row */}
              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                  padding: '13px 18px',
                  background: isChecked ? 'rgba(126,200,126,0.04)' : 'transparent',
                  cursor: 'pointer',
                }}
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                {/* Checkbox */}
                <button
                  onClick={e => { e.stopPropagation(); toggle(i); }}
                  style={{
                    width: 18,
                    height: 18,
                    border: `1px solid ${isChecked ? '#7ec87e' : 'var(--color-amber-dim)'}`,
                    background: isChecked ? 'rgba(126,200,126,0.18)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    color: '#7ec87e',
                    fontSize: 11,
                  }}
                >
                  {isChecked ? '✓' : ''}
                </button>

                <span style={{
                  fontSize: 12,
                  color: isChecked ? 'var(--color-amber-dim)' : 'var(--color-amber-text)',
                  textDecoration: isChecked ? 'line-through' : 'none',
                  flex: 1,
                  letterSpacing: '0.02em',
                }}>
                  <span style={{ color: 'var(--color-magenta)', marginRight: 8 }}>
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  {step.label}
                </span>

                <span style={{ color: 'var(--color-amber-dim)', fontSize: 10 }}>
                  {isOpen ? '▲' : '▼'}
                </span>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{
                  padding: '0 clamp(12px, 3vw, 18px) 16px clamp(16px, 5vw, 50px)',
                  background: 'var(--color-bg2)',
                  borderTop: '1px dashed var(--color-amber-deep)',
                }}>
                  <p style={{ fontSize: 12, color: 'var(--color-amber-dim)', margin: '12px 0 10px', lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                  {step.code && (
                    <pre style={{
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-amber-deep)',
                      padding: '12px 14px',
                      fontSize: 11,
                      color: 'var(--color-amber-text)',
                      overflowX: 'auto',
                      margin: 0,
                      lineHeight: 1.65,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                    }}>
                      {step.code}
                    </pre>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion message */}
      {allDone && (
        <div style={{
          borderTop: '1px solid var(--color-amber-deep)',
          padding: '14px 18px',
          background: 'rgba(126,200,126,0.06)',
          fontSize: 12,
          color: '#7ec87e',
          letterSpacing: '0.05em',
        }}>
          ✓ You&apos;ve got hooks. Your rules are enforced now, not just written.
        </div>
      )}
    </div>
  );
}


/* ─────────────────────────────────────────────────────────
   4. LayerModel — three-layer defence-in-depth diagram
───────────────────────────────────────────────────────── */

const LAYERS = [
  {
    num: '01',
    tool: 'CLAUDE.md',
    tagline: 'Context & orientation',
    what: 'Tells the AI about your project, stack, and style preferences.',
    badge: 'ADVISORY',
    accent: 'var(--color-amber)',
    accentSoft: 'rgba(217,119,6,0.08)',
    borderStyle: 'dashed' as const,
    use: 'Your tech stack, naming conventions, style guide, tone. Claude genuinely reads and uses this as context — it shapes how it thinks about your project.',
    icon: '📋',
    enforcedLabel: 'No',
    enforcedSub: 'Claude may deprioritize rules under deep context',
  },
  {
    num: '02',
    tool: 'Hooks',
    tagline: 'Mechanical enforcement',
    what: 'Shell commands that fire before/after every tool use.',
    badge: 'ENFORCED',
    accent: 'var(--color-magenta)',
    accentSoft: 'rgba(255,20,99,0.07)',
    borderStyle: 'solid' as const,
    use: 'Rules that must never be broken. Exit code 1 blocks Claude entirely — it reads your error message and retries correctly.',
    icon: '⚡',
    enforcedLabel: 'Yes',
    enforcedSub: 'Fires automatically on every tool call, no exceptions',
  },
  {
    num: '03',
    tool: 'Tests & CI',
    tagline: 'Final verification gate',
    what: 'Proves the output is correct, not just rule-compliant.',
    badge: 'BLOCKING',
    accent: '#7ec87e',
    accentSoft: 'rgba(126,200,126,0.07)',
    borderStyle: 'solid' as const,
    use: 'Catch logic errors, regressions, and anything that slipped through the layers above. Build fails = nothing ships.',
    icon: '🧪',
    enforcedLabel: 'Yes',
    enforcedSub: 'Hard gate — failing tests block the entire deploy',
  },
];

/* ─────────────────────────────────────────────────────────
   5. MidpointProof — step-by-step algebraic derivation
───────────────────────────────────────────────────────── */

function KaTeXEq({ math, display = false }: { math: string; display?: boolean }) {
  const html = katex.renderToString(math, { throwOnError: false, displayMode: display });
  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ display: display ? 'block' : 'inline' }}
    />
  );
}

const PROOF_STEPS = [
  {
    eq: String.raw`low + \frac{high - low}{2}`,
    label: 'Safe formula (starting point)',
    note: 'This is what production code uses. We want to prove it equals the standard formula.',
    highlight: false,
  },
  {
    eq: String.raw`= \frac{2 \cdot low}{2} + \frac{high - low}{2}`,
    label: 'Find a common denominator',
    note: 'Rewrite "low" as 2·low/2 so both terms share denominator 2.',
    highlight: false,
  },
  {
    eq: String.raw`= \frac{2 \cdot low + high - low}{2}`,
    label: 'Combine the fractions',
    note: 'Both fractions share the same denominator — merge them into one.',
    highlight: false,
  },
  {
    eq: String.raw`= \frac{low + high}{2} \checkmark`,
    label: 'Simplify',
    note: '2·low − low = low. Identical to the standard formula — just overflow-safe.',
    highlight: true,
  },
];

export function MidpointProof() {
  const [shown, setShown] = useState(1);
  const allDone = shown >= PROOF_STEPS.length;

  return (
    <div style={{
      border: '1px solid var(--color-amber-deep)',
      margin: '32px 0',
      fontFamily: 'var(--font-mono)',
      background: 'var(--color-bg)',
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--color-bg2)',
        borderBottom: '1px solid var(--color-amber-deep)',
        padding: '10px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 10, color: 'var(--color-amber)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {'// proof: safe formula = standard formula'}
        </span>
        <span style={{ fontSize: 10, color: 'var(--color-amber-dim)' }}>
          {shown}/{PROOF_STEPS.length} steps
        </span>
      </div>

      {/* Steps */}
      <div style={{ padding: 'clamp(14px, 3vw, 24px) clamp(14px, 3vw, 28px)' }}>
        {PROOF_STEPS.slice(0, shown).map((step, i) => (
          <div
            key={i}
            style={{
              marginBottom: i < shown - 1 ? 20 : 0,
              opacity: 1,
              animation: 'fadeIn 0.25s ease',
            }}
          >
            <div style={{
              padding: '10px 14px',
              background: step.highlight ? 'rgba(126,200,126,0.07)' : 'var(--color-bg2)',
              border: `1px solid ${step.highlight ? '#7ec87e' : 'var(--color-amber-deep)'}`,
              marginBottom: 6,
              overflowX: 'auto',
            }}>
              <KaTeXEq math={step.eq} display />
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 9, color: 'var(--color-magenta)', letterSpacing: '0.1em', flexShrink: 0, paddingTop: 2 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <span style={{ fontSize: 11, color: step.highlight ? '#7ec87e' : 'var(--color-amber)', fontWeight: 600, display: 'block', marginBottom: 2 }}>
                  {step.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-amber-dim)', lineHeight: 1.5 }}>
                  {step.note}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Next / Done button */}
        <div style={{ marginTop: 20 }}>
          {!allDone ? (
            <button
              onClick={() => setShown(s => Math.min(s + 1, PROOF_STEPS.length))}
              style={{
                background: 'var(--color-magenta)',
                color: '#000',
                border: 'none',
                padding: '7px 18px',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Next step →
            </button>
          ) : (
            <div style={{
              padding: '10px 14px',
              borderLeft: '3px solid #7ec87e',
              background: 'rgba(126,200,126,0.06)',
              fontSize: 12,
              color: '#7ec87e',
            }}>
              Q.E.D. — both formulas compute the same midpoint. The safe version just avoids the overflow.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────
   6. ComplexityTable — interactive n vs log₂(n) explorer
───────────────────────────────────────────────────────── */

const TABLE_ROWS = [
  { n: 8,            k: 3  },
  { n: 64,           k: 6  },
  { n: 1_024,        k: 10 },
  { n: 1_000_000,    k: 20 },
  { n: 1_000_000_000, k: 30 },
];

export function ComplexityTable() {
  const [n, setN] = useState(1024);
  const bSteps = Math.ceil(Math.log2(Math.max(n, 2)));
  const ratio = Math.round(n / bSteps);

  return (
    <div style={{
      border: '1px solid var(--color-amber-deep)',
      margin: '32px 0',
      fontFamily: 'var(--font-mono)',
      background: 'var(--color-bg)',
    }}>
      <div style={{
        background: 'var(--color-bg2)',
        borderBottom: '1px solid var(--color-amber-deep)',
        padding: '10px 18px',
      }}>
        <span style={{ fontSize: 10, color: 'var(--color-amber)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {'// O(log n) — steps to search n elements'}
        </span>
      </div>

      {/* Static table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 12,
          color: 'var(--color-amber-dim)',
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-amber-deep)' }}>
              {['Array size (n)', 'Linear steps', 'Binary steps k = log₂(n)', 'Ratio'].map(h => (
                <th key={h} style={{
                  padding: '8px 16px',
                  textAlign: 'left',
                  fontSize: 9,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-amber-dim)',
                  fontWeight: 400,
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(row => (
              <tr
                key={row.n}
                style={{ borderBottom: '1px solid var(--color-amber-deep)' }}
              >
                <td style={{ padding: '9px 16px', color: 'var(--color-amber-text)' }}>
                  {row.n.toLocaleString()}
                </td>
                <td style={{ padding: '9px 16px', color: 'var(--color-amber-dim)' }}>
                  {row.n.toLocaleString()}
                </td>
                <td style={{ padding: '9px 16px', color: 'var(--color-magenta)', fontWeight: 700 }}>
                  {row.k}
                </td>
                <td style={{ padding: '9px 16px', color: '#7ec87e' }}>
                  {Math.round(row.n / row.k).toLocaleString()}×
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive slider */}
      <div style={{
        borderTop: '1px solid var(--color-amber-deep)',
        padding: 'clamp(14px, 3vw, 20px) clamp(14px, 3vw, 20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, color: 'var(--color-amber-dim)', letterSpacing: '0.08em', flexShrink: 0 }}>
            try any n:
          </span>
          <input
            type="range"
            min={2}
            max={1048576}
            step={1}
            value={n}
            onChange={e => setN(Number(e.target.value))}
            style={{ flex: 1, minWidth: 120, accentColor: 'var(--color-amber)' }}
          />
          <span style={{ fontSize: 12, color: 'var(--color-amber)', minWidth: 80, textAlign: 'right' }}>
            n = {n.toLocaleString()}
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 8,
        }}>
          {[
            { label: 'Linear worst case', value: `${n.toLocaleString()} steps`, color: 'var(--color-amber-dim)' },
            { label: 'Binary worst case', value: `${bSteps} steps`, color: 'var(--color-magenta)' },
            { label: 'Binary is faster by', value: `${ratio.toLocaleString()}×`, color: '#7ec87e' },
          ].map(stat => (
            <div key={stat.label} style={{
              padding: '10px 14px',
              background: 'var(--color-bg2)',
              border: '1px solid var(--color-amber-deep)',
            }}>
              <div style={{ fontSize: 9, color: 'var(--color-amber-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 15, color: stat.color, fontWeight: 700 }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────
   7. SearchRaceVisualizer — linear vs binary search race
───────────────────────────────────────────────────────── */

const RACE_SIZE = 16;
const RACE_ARR = Array.from({ length: RACE_SIZE }, (_, i) => i + 1);
const RACE_SPEEDS = { slow: 700, normal: 350, fast: 120 };

type LinearStep = { idx: number; found: boolean };
type BinaryStep = { low: number; high: number; mid: number; found: boolean };

function computeLinear(target: number): LinearStep[] {
  const steps: LinearStep[] = [];
  for (let i = 0; i < RACE_SIZE; i++) {
    steps.push({ idx: i, found: RACE_ARR[i] === target });
    if (RACE_ARR[i] === target) break;
  }
  return steps;
}

function computeBinary(target: number): BinaryStep[] {
  const steps: BinaryStep[] = [];
  let lo = 0, hi = RACE_SIZE - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    steps.push({ low: lo, high: hi, mid, found: RACE_ARR[mid] === target });
    if (RACE_ARR[mid] === target) break;
    else if (RACE_ARR[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return steps;
}

export function SearchRaceVisualizer() {
  const [target, setTarget] = useState(14);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [playing, setPlaying] = useState(false);
  const [lStep, setLStep] = useState(-1);
  const [bStep, setBStep] = useState(-1);

  const linearSteps = useMemo(() => computeLinear(target), [target]);
  const binarySteps = useMemo(() => computeBinary(target), [target]);

  const maxL = linearSteps.length - 1;
  const maxB = binarySteps.length - 1;
  const lDone = lStep >= maxL && lStep >= 0;
  const bDone = bStep >= maxB && bStep >= 0;
  const bothDone = lDone && bDone;

  const reset = () => {
    setPlaying(false);
    setLStep(-1);
    setBStep(-1);
  };

  const handleTarget = (t: number) => { setTarget(t); reset(); };

  useEffect(() => {
    if (!playing) return;
    const ml = linearSteps.length - 1;
    const mb = binarySteps.length - 1;
    const id = setInterval(() => {
      setLStep(prev => (prev >= ml ? prev : prev + 1));
      setBStep(prev => (prev >= mb ? prev : prev + 1));
    }, RACE_SPEEDS[speed]);
    return () => clearInterval(id);
  }, [playing, speed, linearSteps.length, binarySteps.length]);

  useEffect(() => {
    if (playing && lStep >= maxL && bStep >= maxB) setPlaying(false);
  }, [playing, lStep, bStep, maxL, maxB]);

  const curL = lStep >= 0 ? linearSteps[Math.min(lStep, maxL)] : null;
  const curB = bStep >= 0 ? binarySteps[Math.min(bStep, maxB)] : null;

  const lColor = (i: number) => {
    if (!curL) return 'var(--color-bg2)';
    if (i === curL.idx) return curL.found ? 'rgba(126,200,126,0.22)' : 'rgba(217,119,6,0.28)';
    if (i < curL.idx) return 'rgba(80,80,80,0.18)';
    return 'var(--color-bg2)';
  };
  const lBorder = (i: number) => {
    if (!curL) return 'var(--color-amber-deep)';
    if (i === curL.idx) return curL.found ? '#7ec87e' : 'var(--color-amber)';
    if (i < curL.idx) return 'rgba(80,80,80,0.3)';
    return 'var(--color-amber-deep)';
  };
  const lText = (i: number) => {
    if (!curL) return 'var(--color-amber-dim)';
    if (i === curL.idx) return curL.found ? '#7ec87e' : 'var(--color-amber)';
    if (i < curL.idx) return 'rgba(100,100,100,0.45)';
    return 'var(--color-amber-dim)';
  };

  const bColor = (i: number) => {
    if (!curB) return 'var(--color-bg2)';
    if (i === curB.mid) return curB.found ? 'rgba(126,200,126,0.22)' : 'rgba(126,200,227,0.22)';
    if (i < curB.low || i > curB.high) return 'rgba(40,40,40,0.5)';
    return 'var(--color-bg2)';
  };
  const bBorder = (i: number) => {
    if (!curB) return 'var(--color-amber-deep)';
    if (i === curB.mid) return curB.found ? '#7ec87e' : '#7ec8e3';
    if (i < curB.low || i > curB.high) return 'rgba(70,70,70,0.3)';
    return 'var(--color-amber-deep)';
  };
  const bText = (i: number) => {
    if (!curB) return 'var(--color-amber-dim)';
    if (i === curB.mid) return curB.found ? '#7ec87e' : '#7ec8e3';
    if (i < curB.low || i > curB.high) return 'rgba(90,90,90,0.4)';
    return 'var(--color-amber-dim)';
  };

  const lStatusText = !curL
    ? 'press ▶ RACE to start'
    : curL.found
    ? `found ${target} at index ${curL.idx} ✓`
    : `checking index ${curL.idx} → value ${RACE_ARR[curL.idx]}`;

  const bStatusText = !curB
    ? 'waiting...'
    : curB.found
    ? `found ${target} at index ${curB.mid} ✓`
    : `mid=${curB.mid} (value ${RACE_ARR[curB.mid]}), ${RACE_ARR[curB.mid] < target ? 'target is right →' : 'target is left ←'}`;

  return (
    <div style={{
      border: '1px solid var(--color-amber-deep)',
      margin: '32px 0',
      fontFamily: 'var(--font-mono)',
      background: 'var(--color-bg)',
    }}>
      {/* Controls */}
      <div style={{
        background: 'var(--color-bg2)',
        borderBottom: '1px solid var(--color-amber-deep)',
        padding: '10px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 10, color: 'var(--color-amber)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {'// search-race — sorted array [1…16]'}
        </span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--color-amber-dim)' }}>target:</span>
          {[4, 10, 14, 16].map(t => (
            <button key={t} onClick={() => handleTarget(t)} style={{
              padding: '3px 8px', fontSize: 10, fontFamily: 'var(--font-mono)',
              background: target === t ? 'var(--color-amber)' : 'transparent',
              color: target === t ? '#000' : 'var(--color-amber-dim)',
              border: `1px solid ${target === t ? 'var(--color-amber)' : 'var(--color-amber-deep)'}`,
              cursor: 'pointer',
            }}>{t}</button>
          ))}
          <span style={{ fontSize: 10, color: 'var(--color-amber-dim)', marginLeft: 4 }}>speed:</span>
          {(['slow', 'normal', 'fast'] as const).map(s => (
            <button key={s} onClick={() => setSpeed(s)} style={{
              padding: '3px 8px', fontSize: 10, fontFamily: 'var(--font-mono)',
              background: speed === s ? 'var(--color-bg)' : 'transparent',
              color: speed === s ? 'var(--color-amber)' : 'var(--color-amber-dim)',
              border: `1px solid ${speed === s ? 'var(--color-amber-deep)' : 'transparent'}`,
              cursor: 'pointer',
            }}>{s}</button>
          ))}
          {!bothDone ? (
            <button onClick={() => setPlaying(p => !p)} style={{
              background: 'var(--color-magenta)', color: '#000', border: 'none',
              padding: '4px 14px', fontSize: 10, fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em', fontWeight: 700, cursor: 'pointer',
            }}>
              {playing ? '⏸ PAUSE' : lStep < 0 ? '▶ RACE' : '▶ RESUME'}
            </button>
          ) : (
            <button onClick={reset} style={{
              background: 'transparent', color: 'var(--color-amber-dim)',
              border: '1px solid var(--color-amber-deep)',
              padding: '4px 14px', fontSize: 10, fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em', cursor: 'pointer',
            }}>↺ RESET</button>
          )}
        </div>
      </div>

      {/* Tracks */}
      <div style={{ padding: 'clamp(14px, 3vw, 22px)' }}>
        {/* Linear */}
        <div style={{ marginBottom: 26 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--color-amber)', letterSpacing: '0.1em' }}>LINEAR SEARCH</span>
              {bothDone && linearSteps.length > binarySteps.length && (
                <span style={{ fontSize: 9, color: 'var(--color-amber-dim)', border: '1px solid var(--color-amber-deep)', padding: '1px 6px' }}>SLOWER</span>
              )}
            </div>
            <span style={{ fontSize: 11, color: 'var(--color-amber-dim)' }}>
              {lStep + 1} step{lStep + 1 !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
            {RACE_ARR.map((val, i) => (
              <div key={i} style={{
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600,
                background: lColor(i), border: `1px solid ${lBorder(i)}`, color: lText(i),
                transition: 'all 0.18s', flexShrink: 0,
              }}>{val}</div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-amber-dim)', fontStyle: 'italic', minHeight: 14 }}>
            {lStatusText}
          </div>
        </div>

        {/* Binary */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#7ec8e3', letterSpacing: '0.1em' }}>BINARY SEARCH</span>
              {bothDone && (
                <span style={{ fontSize: 9, color: '#7ec87e', border: '1px solid #7ec87e', padding: '1px 6px' }}>WINNER</span>
              )}
            </div>
            <span style={{ fontSize: 11, color: '#7ec8e3' }}>
              {bStep + 1} step{bStep + 1 !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
            {RACE_ARR.map((val, i) => (
              <div key={i} style={{
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600,
                background: bColor(i), border: `1px solid ${bBorder(i)}`, color: bText(i),
                transition: 'all 0.18s', flexShrink: 0,
              }}>{val}</div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-amber-dim)', fontStyle: 'italic', minHeight: 14 }}>
            {bStatusText}
          </div>
        </div>

        {/* Result */}
        {bothDone && (
          <div style={{
            marginTop: 20, padding: '12px 16px',
            borderLeft: '3px solid #7ec87e',
            background: 'rgba(126,200,126,0.06)',
            fontSize: 12, color: '#7ec87e',
          }}>
            Binary found <strong>{target}</strong> in <strong>{binarySteps.length} step{binarySteps.length !== 1 ? 's' : ''}</strong>.
            Linear needed <strong>{linearSteps.length}</strong>. That&apos;s{' '}
            <strong>{Math.round(linearSteps.length / binarySteps.length)}× fewer comparisons</strong>.
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{
        borderTop: '1px solid var(--color-amber-deep)',
        padding: '8px 16px',
        display: 'flex', gap: 18, flexWrap: 'wrap',
      }}>
        {[
          { color: 'var(--color-amber)', label: 'linear: current' },
          { color: 'rgba(100,100,100,0.5)', label: 'already checked' },
          { color: '#7ec8e3', label: 'binary: mid' },
          { color: 'rgba(50,50,50,0.8)', label: 'eliminated half' },
          { color: '#7ec87e', label: 'found!' },
        ].map(({ color, label }) => (
          <span key={label} style={{ fontSize: 9, color: 'var(--color-amber-dim)', letterSpacing: '0.08em' }}>
            <span style={{ color }}>■</span> {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function LayerModel() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div style={{ margin: '32px 0', fontFamily: 'var(--font-mono)' }}>
      {LAYERS.map((layer, i) => {
        const isOpen = expanded === i;
        return (
          <div key={layer.num}>
            {/* ── Layer card ── */}
            <div
              onClick={() => setExpanded(isOpen ? null : i)}
              style={{
                borderLeft: `3px ${layer.borderStyle} ${layer.accent}`,
                border: `1px solid var(--color-amber-deep)`,
                borderLeftWidth: 3,
                borderLeftStyle: layer.borderStyle,
                borderLeftColor: layer.accent,
                background: isOpen ? layer.accentSoft : 'var(--color-bg2)',
                cursor: 'pointer',
                transition: 'background 0.18s',
              }}
            >
              {/* Header row */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                padding: 'clamp(12px, 3vw, 18px) clamp(12px, 3vw, 20px)',
                gap: 'clamp(8px, 2vw, 16px)',
              }}>
                {/* Layer number */}
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(24px, 5vw, 32px)',
                  fontWeight: 700,
                  color: layer.accent,
                  lineHeight: 1,
                  opacity: 0.7,
                  letterSpacing: '-0.03em',
                  flexShrink: 0,
                }}>
                  {layer.num}
                </div>

                {/* Tool name + description */}
                <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 4,
                    flexWrap: 'wrap',
                  }}>
                    <span style={{ fontSize: 14 }}>{layer.icon}</span>
                    <span style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(15px, 3vw, 18px)',
                      fontWeight: 700,
                      color: layer.accent,
                      letterSpacing: '-0.01em',
                    }}>
                      {layer.tool}
                    </span>
                    <span style={{
                      fontSize: 9,
                      color: 'var(--color-amber-dim)',
                      letterSpacing: '0.12em',
                      borderLeft: '1px solid var(--color-amber-deep)',
                      paddingLeft: 8,
                      textTransform: 'uppercase',
                    }}>
                      {layer.tagline}
                    </span>
                  </div>
                  <p style={{
                    fontSize: 12,
                    color: 'var(--color-amber-dim)',
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                    {layer.what}
                  </p>
                </div>

                {/* Badge + toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    color: layer.badge === 'ADVISORY' ? 'var(--color-amber-dim)' : layer.accent,
                    border: `1px solid ${layer.badge === 'ADVISORY' ? 'var(--color-amber-deep)' : layer.accent}`,
                    padding: '3px 8px',
                  }}>
                    {layer.badge}
                  </span>
                  <span style={{ color: 'var(--color-amber-dim)', fontSize: 10 }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{
                  borderTop: `1px dashed var(--color-amber-deep)`,
                  padding: 'clamp(12px, 3vw, 16px) clamp(12px, 3vw, 20px) clamp(14px, 3vw, 18px)',
                }}>
                  {/* Enforced status */}
                  <div style={{
                    display: 'flex',
                    gap: 16,
                    marginBottom: 14,
                    flexWrap: 'wrap',
                  }}>
                    <div>
                      <div style={{ fontSize: 9, color: 'var(--color-amber-dim)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 3 }}>
                        Enforced
                      </div>
                      <div style={{ fontSize: 12, color: layer.accent, fontWeight: 700 }}>
                        {layer.enforcedLabel}
                      </div>
                    </div>
                    <div style={{ borderLeft: '1px solid var(--color-amber-deep)', paddingLeft: 16, flex: 1 }}>
                      <div style={{ fontSize: 9, color: 'var(--color-amber-dim)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 3 }}>
                        How it works
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--color-amber-dim)', lineHeight: 1.5 }}>
                        {layer.enforcedSub}
                      </div>
                    </div>
                  </div>

                  {/* Use this for */}
                  <div style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-amber-deep)',
                    padding: '12px 14px',
                  }}>
                    <span style={{ fontSize: 9, color: layer.accent, letterSpacing: '0.16em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                      → Use this for
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--color-amber-text)', lineHeight: 1.6 }}>
                      {layer.use}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ── Connector between layers ── */}
            {i < LAYERS.length - 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 20px',
                borderLeft: '3px solid transparent',
              }}>
                <div style={{
                  width: 1,
                  height: 28,
                  background: 'var(--color-amber-deep)',
                  marginLeft: 26,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 10,
                  color: 'var(--color-amber-dim)',
                  letterSpacing: '0.06em',
                  fontStyle: 'italic',
                }}>
                  {i === 0
                    ? 'rules not enforced here may slip through ↓'
                    : 'code that passes hooks gets verified by ↓'}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


/* ─────────────────────────────────────────────────────────
   8. JobStateVisualizer — DB-backed job queue state machine
───────────────────────────────────────────────────────── */

type JobStatus = 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED' | 'STALE';
type JobRow = { id: string; status: JobStatus; note?: string };

const JOB_STATUS_COLOR: Record<JobStatus, string> = {
  PENDING: 'var(--color-amber-dim)',
  RUNNING: 'var(--color-amber)',
  DONE:    '#7ec87e',
  FAILED:  'var(--color-magenta)',
  STALE:   '#ff8c42',
};
const JOB_STATUS_BG: Record<JobStatus, string> = {
  PENDING: 'rgba(217,119,6,0.06)',
  RUNNING: 'rgba(217,119,6,0.15)',
  DONE:    'rgba(126,200,126,0.10)',
  FAILED:  'rgba(255,20,99,0.10)',
  STALE:   'rgba(255,140,66,0.10)',
};
const JOB_STATUS_ICON: Record<JobStatus, string> = {
  PENDING: '○', RUNNING: '◉', DONE: '✓', FAILED: '✗', STALE: '⚠',
};

const JOB_SCENARIOS: { label: string; desc: string; frames: JobRow[][] }[] = [
  {
    label: 'Normal flow',
    desc: 'Worker atomically claims a PENDING row in one findOneAndUpdate (PENDING → RUNNING), then finalizes to a terminal state.',
    frames: [
      [{ id: 'sync_4821', status: 'PENDING' }, { id: 'sync_4822', status: 'PENDING' }],
      [{ id: 'sync_4821', status: 'RUNNING', note: 'claimed by worker_1' }, { id: 'sync_4822', status: 'PENDING' }],
      [{ id: 'sync_4821', status: 'RUNNING', note: 'processing...' }, { id: 'sync_4822', status: 'RUNNING', note: 'claimed by worker_2' }],
      [{ id: 'sync_4821', status: 'DONE', note: 'completed in 8.3s' }, { id: 'sync_4822', status: 'DONE', note: 'completed in 12.1s' }],
    ],
  },
  {
    label: 'Dedup',
    desc: 'User clicks "Sync" twice. Second click finds an in-flight run and coalesces — no duplicate work runs.',
    frames: [
      [{ id: 'sync_4821', status: 'PENDING', note: 'first click' }],
      [{ id: 'sync_4821', status: 'RUNNING', note: 'claimed' }],
      [{ id: 'sync_4821', status: 'RUNNING', note: 'running...' }, { id: 'sync_4821_dup', status: 'PENDING', note: 'second click → already in-flight, dropped' }],
      [{ id: 'sync_4821', status: 'DONE', note: 'one run, both clicks covered' }],
    ],
  },
  {
    label: 'Stale recovery',
    desc: 'Worker dies mid-job. Next cron tick finds the row stuck in RUNNING > 15min → marks FAILED → re-enqueues for retry.',
    frames: [
      [{ id: 'sync_4821', status: 'RUNNING', note: 'started 18min ago — worker died' }],
      [{ id: 'sync_4821', status: 'STALE', note: 'cron tick: running > 15min threshold' }],
      [{ id: 'sync_4821', status: 'FAILED', note: 'marked FAILED by recovery sweep' }],
      [{ id: 'sync_4821', status: 'PENDING', note: 're-enqueued for retry' }],
      [{ id: 'sync_4821', status: 'RUNNING', note: 'claimed by healthy worker' }],
      [{ id: 'sync_4821', status: 'DONE', note: 'completed successfully' }],
    ],
  },
];

export function JobStateVisualizer() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  const scenario = JOB_SCENARIOS[scenarioIdx];
  const frame = scenario.frames[frameIdx];
  const done = frameIdx >= scenario.frames.length - 1;

  const reset = (sIdx = scenarioIdx) => { setScenarioIdx(sIdx); setFrameIdx(0); setPlaying(false); };

  useEffect(() => {
    if (!playing || done) { if (done) setPlaying(false); return; }
    const id = setTimeout(() => setFrameIdx(f => f + 1), 900);
    return () => clearTimeout(id);
  }, [playing, frameIdx, done]);

  return (
    <div style={{ border: '1px solid var(--color-amber-deep)', margin: '32px 0', fontFamily: 'var(--font-mono)', background: 'var(--color-bg)' }}>
      <div style={{ background: 'var(--color-bg2)', borderBottom: '1px solid var(--color-amber-deep)', display: 'flex', flexWrap: 'wrap' }}>
        {JOB_SCENARIOS.map((s, i) => (
          <button key={i} onClick={() => reset(i)} style={{
            padding: '10px 16px', fontSize: 10, fontFamily: 'var(--font-mono)',
            background: scenarioIdx === i ? 'var(--color-bg)' : 'transparent',
            color: scenarioIdx === i ? 'var(--color-amber)' : 'var(--color-amber-dim)',
            border: 'none', borderBottom: scenarioIdx === i ? '2px solid var(--color-amber)' : '2px solid transparent',
            cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>{s.label}</button>
        ))}
      </div>
      <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--color-amber-deep)', background: 'var(--color-bg2)' }}>
        <span style={{ fontSize: 11, color: 'var(--color-amber-dim)', lineHeight: 1.5 }}>{scenario.desc}</span>
      </div>
      <div style={{ padding: 'clamp(12px,3vw,20px)', minHeight: 100 }}>
        {frame.map((job, i) => (
          <div key={`${job.id}-${i}`} style={{
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            padding: '10px 14px', marginBottom: 8,
            background: JOB_STATUS_BG[job.status],
            border: `1px solid ${JOB_STATUS_COLOR[job.status]}44`,
            transition: 'all 0.3s',
          }}>
            <span style={{ fontSize: 14, color: JOB_STATUS_COLOR[job.status], flexShrink: 0 }}>{JOB_STATUS_ICON[job.status]}</span>
            <span style={{ fontSize: 11, color: 'var(--color-amber-text)', fontWeight: 600, flex: '1 1 100px' }}>{job.id}</span>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: JOB_STATUS_COLOR[job.status], border: `1px solid ${JOB_STATUS_COLOR[job.status]}`, padding: '2px 8px', flexShrink: 0 }}>
              {job.status}
            </span>
            {job.note && <span style={{ fontSize: 10, color: 'var(--color-amber-dim)', fontStyle: 'italic' }}>{job.note}</span>}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--color-amber-deep)', padding: '10px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--color-amber-dim)' }}>tick {frameIdx + 1} / {scenario.frames.length}</span>
        {!done ? (
          <button onClick={() => setPlaying(p => !p)} style={{ background: 'var(--color-magenta)', color: '#000', border: 'none', padding: '4px 14px', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', fontWeight: 700, cursor: 'pointer' }}>
            {playing ? '⏸ PAUSE' : frameIdx === 0 ? '▶ SIMULATE' : '▶ RESUME'}
          </button>
        ) : (
          <button onClick={() => reset()} style={{ background: 'transparent', color: 'var(--color-amber-dim)', border: '1px solid var(--color-amber-deep)', padding: '4px 14px', fontSize: 10, fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>↺ RESET</button>
        )}
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────
   9. SecurityLayerDiagram — RSA + SSM + IAM layer view
───────────────────────────────────────────────────────── */

const SEC_LAYERS = [
  {
    label: 'Browser',
    icon: '🌐',
    accent: '#7ec8e3',
    holds: 'RSA public key + plaintext secret (before encryption)',
    action: 'Encrypts with RSA-OAEP — plaintext never leaves the browser',
    iam: null as string | null,
    detail: 'SubtleCrypto.importKey() + SubtleCrypto.encrypt() runs entirely in the browser. The Network tab shows only ciphertext. The server never sees the plaintext.',
  },
  {
    label: 'API Server (internet-facing)',
    icon: '⚡',
    accent: 'var(--color-amber)',
    holds: 'RSA ciphertext in transit · SSM path in the database',
    action: 'WRITE-ONLY to SSM — cannot read stored secrets',
    iam: 'ssm:PutParameter' as string | null,
    detail: "The public-facing role is write-only on SSM. A fully compromised API server still cannot exfiltrate stored credentials — the IAM policy physically prevents the read.",
  },
  {
    label: 'AWS SSM Parameter Store',
    icon: '🔐',
    accent: 'var(--color-magenta)',
    holds: 'Plaintext secret encrypted at rest via KMS (SecureString)',
    action: 'KMS-encrypted storage — decryptable only by worker role',
    iam: 'ssm:GetParameter — worker role only' as string | null,
    detail: 'SecureString parameters are envelope-encrypted by KMS. Only the background worker IAM role has ssm:GetParameter. Your DB holds only the SSM path — never the secret value.',
  },
  {
    label: 'Database',
    icon: '🗄️',
    accent: '#7ec87e',
    holds: 'SSM path pointer only (e.g. /prod/integrations/acme/api_key)',
    action: 'Stores pointer, not the credential',
    iam: null as string | null,
    detail: 'A database breach yields a path string — not a usable credential. The actual value lives in SSM behind KMS + IAM. Rotate the secret in SSM without touching the DB record.',
  },
];

export function SecurityLayerDiagram() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div style={{ margin: '32px 0', fontFamily: 'var(--font-mono)' }}>
      {SEC_LAYERS.map((layer, i) => (
        <div key={i}>
          <div
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{
              border: '1px solid var(--color-amber-deep)',
              borderLeft: `3px solid ${layer.accent}`,
              background: expanded === i ? `${layer.accent}18` : 'var(--color-bg2)',
              cursor: 'pointer', transition: 'background 0.18s',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: 'clamp(10px,2vw,16px) clamp(12px,3vw,20px)', gap: 12 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{layer.icon}</span>
              <div style={{ flex: '1 1 200px' }}>
                <div style={{ fontSize: 12, color: layer.accent, fontWeight: 700, marginBottom: 3 }}>{layer.label}</div>
                <div style={{ fontSize: 11, color: 'var(--color-amber-dim)' }}>{layer.holds}</div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
                {layer.iam && (
                  <span style={{ fontSize: 9, color: layer.accent, border: `1px solid ${layer.accent}`, padding: '2px 8px', letterSpacing: '0.1em' }}>
                    {layer.iam}
                  </span>
                )}
                <span style={{ fontSize: 10, color: 'var(--color-amber-dim)' }}>{expanded === i ? '▲' : '▼'}</span>
              </div>
            </div>
            {expanded === i && (
              <div style={{ borderTop: '1px dashed var(--color-amber-deep)', padding: 'clamp(10px,2vw,14px) clamp(12px,3vw,20px)', background: 'var(--color-bg)' }}>
                <div style={{ fontSize: 11, color: layer.accent, marginBottom: 6, fontWeight: 600 }}>→ {layer.action}</div>
                <div style={{ fontSize: 11, color: 'var(--color-amber-dim)', lineHeight: 1.6 }}>{layer.detail}</div>
              </div>
            )}
          </div>
          {i < SEC_LAYERS.length - 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 22px' }}>
              <div style={{ width: 1, height: 24, background: 'var(--color-amber-deep)', marginLeft: 10, flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: 'var(--color-amber-dim)', fontStyle: 'italic', letterSpacing: '0.06em' }}>encrypted hand-off ↓</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


/* ─────────────────────────────────────────────────────────
   10. FailModeCompare — fail-open vs fail-closed patterns
───────────────────────────────────────────────────────── */

const FAIL_PATTERNS = [
  {
    title: 'Output fields: deny-list vs allow-list',
    bad:  { label: 'Deny-list (fail open)',  risk: 'A new field you forget to deny gets leaked to callers.',                              code: 'const res = { ...allFields };\ndelete res.internal_id;\n// new field added next sprint → silently leaked' },
    good: { label: 'Allow-list (fail closed)', safe: 'A field you forget to add gets dropped, never leaked.',                           code: "const res = { id: doc.id, name: doc.name, status: doc.status };\n// forget to map a field → it's dropped, not exposed" },
  },
  {
    title: 'Missing encryption key: silent downgrade vs throw',
    bad:  { label: 'Fail open',  risk: 'No RSA key configured → silently stores credentials as plaintext in production.',                code: 'if (!process.env.RSA_PUBLIC_KEY) {\n  return storeAsPlaintext(secret); // silent downgrade in prod!\n}' },
    good: { label: 'Fail closed', safe: 'No RSA key in production → throws immediately. Deploy fails loud.',                            code: "if (!process.env.RSA_PUBLIC_KEY) {\n  if (isProduction()) throw new Error('RSA_PUBLIC_KEY required');\n  return storeAsPlaintext(secret); // local-only escape hatch\n}" },
  },
  {
    title: 'Missing SSM prefix: wrong namespace vs throw',
    bad:  { label: 'Fail open',  risk: 'Missing env var → silently writes prod secrets to /dev namespace.',                             code: "const prefix = process.env.SSM_PREFIX ?? '/dev/fallback';\n// prod deploy without SSM_PREFIX → secrets land in /dev" },
    good: { label: 'Fail closed', safe: 'Missing prefix → throws at startup. No silent misfiring.',                                     code: "const prefix = process.env.SSM_PREFIX;\nif (!prefix) throw new Error('SSM_PREFIX is required');\n// no default. Missing = broken = obvious." },
  },
  {
    title: 'Error messages: internals vs safe user copy',
    bad:  { label: 'Fail open (leaks internals)', risk: 'Raw error in response body. Attacker sees env var names, file paths, stack traces.', code: "res.status(500).json({ error: err.message });\n// 'SSM_PREFIX not set at /app/src/secrets.ts:42'" },
    good: { label: 'Fail closed', safe: 'Generic copy to user. Full detail to server log only.',                                         code: "console.error('[secrets] config error:', err);\nres.status(500).json({ error: 'Service misconfigured — contact support' });\n// attacker learns nothing. on-call gets everything." },
  },
];

export function FailModeCompare() {
  const [active, setActive] = useState(0);
  const [side, setSide] = useState<'bad' | 'good'>('bad');
  const pattern = FAIL_PATTERNS[active];
  const current = pattern[side];
  const isBad = side === 'bad';

  return (
    <div style={{ border: '1px solid var(--color-amber-deep)', margin: '32px 0', fontFamily: 'var(--font-mono)', background: 'var(--color-bg)' }}>
      <div style={{ background: 'var(--color-bg2)', borderBottom: '1px solid var(--color-amber-deep)', overflowX: 'auto' }}>
        <div style={{ display: 'flex', minWidth: 'max-content' }}>
          {FAIL_PATTERNS.map((p, i) => (
            <button key={i} onClick={() => { setActive(i); setSide('bad'); }} style={{
              padding: '10px 14px', fontSize: 9, fontFamily: 'var(--font-mono)',
              background: active === i ? 'var(--color-bg)' : 'transparent',
              color: active === i ? 'var(--color-amber)' : 'var(--color-amber-dim)',
              border: 'none', borderBottom: active === i ? '2px solid var(--color-amber)' : '2px solid transparent',
              cursor: 'pointer', letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              {String(i + 1).padStart(2, '0')}. {p.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--color-amber-deep)', background: 'var(--color-bg2)' }}>
        <span style={{ fontSize: 11, color: 'var(--color-amber)', fontWeight: 600 }}>{pattern.title}</span>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-amber-deep)' }}>
        {(['bad', 'good'] as const).map(s => (
          <button key={s} onClick={() => setSide(s)} style={{
            flex: 1, padding: '9px 16px', fontSize: 10, fontFamily: 'var(--font-mono)',
            background: side === s ? 'var(--color-bg)' : 'var(--color-bg2)',
            color: side === s ? (s === 'bad' ? 'var(--color-magenta)' : '#7ec87e') : 'var(--color-amber-dim)',
            border: 'none', borderBottom: side === s ? `2px solid ${s === 'bad' ? 'var(--color-magenta)' : '#7ec87e'}` : '2px solid transparent',
            cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            {s === 'bad' ? '✗  Fail Open (dangerous)' : '✓  Fail Closed (safe)'}
          </button>
        ))}
      </div>
      <div style={{ padding: 'clamp(14px,3vw,20px)' }}>
        <div style={{
          padding: '8px 12px', marginBottom: 14,
          borderLeft: `3px solid ${isBad ? 'var(--color-magenta)' : '#7ec87e'}`,
          background: isBad ? 'rgba(255,20,99,0.06)' : 'rgba(126,200,126,0.06)',
          fontSize: 12, color: isBad ? 'var(--color-magenta)' : '#7ec87e',
        }}>
          {isBad ? `⚠ Risk: ${'risk' in current ? current.risk : ''}` : `✓ Safe: ${'safe' in current ? current.safe : ''}`}
        </div>
        <pre style={{ background: 'var(--color-bg2)', border: '1px solid var(--color-amber-deep)', padding: '12px 14px', fontSize: 11, color: 'var(--color-amber-text)', overflowX: 'auto', margin: 0, lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {current.code}
        </pre>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────
   11. ManifestMapper — field id → internal path demo
───────────────────────────────────────────────────────── */

const MANIFEST_FIELDS = [
  { id: 'customer_name', path: 'cust_dn',           category: 'Account'   },
  { id: 'email_address', path: 'contact.primary',   category: 'Contact'   },
  { id: 'account_tier',  path: 'billing.plan_code', category: 'Billing'   },
  { id: 'signup_date',   path: 'meta.created_at',   category: 'Lifecycle' },
  { id: 'region',        path: 'geo.region_code',   category: 'Location'  },
  { id: 'status',        path: 'state.current',     category: 'Lifecycle' },
];

export function ManifestMapper() {
  const [selected, setSelected] = useState<number | null>(null);
  const [renaming, setRenaming] = useState(false);

  const fields = renaming
    ? MANIFEST_FIELDS.map(f => f.id === 'customer_name' ? { ...f, path: 'cust_dn_v2' } : f)
    : MANIFEST_FIELDS;

  return (
    <div style={{ border: '1px solid var(--color-amber-deep)', margin: '32px 0', fontFamily: 'var(--font-mono)', background: 'var(--color-bg)' }}>
      <div style={{ background: 'var(--color-bg2)', borderBottom: '1px solid var(--color-amber-deep)', padding: '10px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 10, color: 'var(--color-amber)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{'// field manifest — click a row'}</span>
        <button onClick={() => { setRenaming(r => !r); setSelected(0); }} style={{
          fontSize: 9, padding: '3px 10px', fontFamily: 'var(--font-mono)',
          background: renaming ? 'rgba(126,200,126,0.15)' : 'transparent',
          color: renaming ? '#7ec87e' : 'var(--color-amber-dim)',
          border: `1px solid ${renaming ? '#7ec87e' : 'var(--color-amber-deep)'}`,
          cursor: 'pointer', letterSpacing: '0.08em',
        }}>
          {renaming ? '✓ rename applied' : 'simulate DB rename →'}
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-amber-deep)' }}>
              {['Public field_id', 'Internal DB path', 'Category'].map(h => (
                <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-amber-dim)', fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((f, i) => (
              <tr key={f.id} onClick={() => setSelected(selected === i ? null : i)} style={{
                borderBottom: '1px solid var(--color-amber-deep)',
                background: selected === i ? 'rgba(217,119,6,0.08)' : 'transparent',
                cursor: 'pointer', transition: 'background 0.15s',
              }}>
                <td style={{ padding: '9px 14px', color: 'var(--color-amber)', fontWeight: 600 }}>{f.id}</td>
                <td style={{ padding: '9px 14px', color: renaming && f.id === 'customer_name' ? '#7ec87e' : 'var(--color-magenta)' }}>
                  {f.path}
                  {renaming && f.id === 'customer_name' && <span style={{ fontSize: 9, color: '#7ec87e', marginLeft: 8 }}>← renamed</span>}
                </td>
                <td style={{ padding: '9px 14px', color: 'var(--color-amber-dim)', fontSize: 10 }}>{f.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected !== null && (
        <div style={{ borderTop: '1px solid var(--color-amber-deep)', padding: 'clamp(12px,3vw,18px)', background: 'var(--color-bg2)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ padding: '10px 12px', background: 'var(--color-bg)', border: '1px solid var(--color-amber-deep)' }}>
              <div style={{ fontSize: 9, color: 'var(--color-amber-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>What the partner/user maps</div>
              <div style={{ fontSize: 13, color: 'var(--color-amber)', fontWeight: 700 }}>{fields[selected].id}</div>
            </div>
            <div style={{ padding: '10px 12px', background: 'var(--color-bg)', border: '1px solid var(--color-amber-deep)' }}>
              <div style={{ fontSize: 9, color: 'var(--color-amber-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>What the DB actually accesses</div>
              <div style={{ fontSize: 13, color: 'var(--color-magenta)', fontWeight: 700 }}>{fields[selected].path}</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-amber-dim)', lineHeight: 1.6 }}>
            The consumer never sees <span style={{ color: 'var(--color-magenta)' }}>{fields[selected].path}</span>.{' '}
            {renaming && fields[selected].id === 'customer_name'
              ? 'You renamed the DB field — one line changed in the manifest. Every integration still works.'
              : 'Rename the DB field tomorrow — update one line in the manifest. No consumer breaks.'}
          </div>
        </div>
      )}
    </div>
  );
}


/* ─────────────────────────────────────────────────────────
   12. URLRiskChecker — SSRF threat model for admin URLs
───────────────────────────────────────────────────────── */

type RiskLevel = 'BLOCKED' | 'ALLOWED' | 'ALLOWED*';

const URL_PRESETS: { url: string; resolvedIP: string; risk: RiskLevel; reason: string; category: string }[] = [
  { url: 'http://169.254.169.254/latest/meta-data/', resolvedIP: '169.254.169.254', risk: 'BLOCKED',  reason: 'Cloud metadata endpoint — retrieves IAM credentials and instance tokens', category: 'metadata'    },
  { url: 'http://localhost:8080/internal/',           resolvedIP: '127.0.0.1',       risk: 'BLOCKED',  reason: 'Loopback — SSRF pivot to services on the same host',                  category: 'loopback'    },
  { url: 'http://0.0.0.0/api/',                      resolvedIP: '0.0.0.0',         risk: 'BLOCKED',  reason: 'Unspecified address — maps to all local interfaces',                   category: 'loopback'    },
  { url: 'http://10.0.0.1/admin/',                   resolvedIP: '10.0.0.1',        risk: 'BLOCKED',  reason: 'RFC 1918 private IP — not on the ops-controlled allowlist',            category: 'private'     },
  { url: 'http://192.168.1.100/internal/',           resolvedIP: '192.168.1.100',   risk: 'ALLOWED*', reason: 'On-prem service on LAN — allowed because this specific IP is allowlisted', category: 'allowlisted' },
  { url: 'https://api.partner.com/v2/',              resolvedIP: '93.184.216.34',   risk: 'ALLOWED',  reason: 'Public hostname on approved allowlist, resolved IP is non-private',    category: 'safe'        },
];

const RISK_COLOR: Record<RiskLevel, string> = {
  BLOCKED:   'var(--color-magenta)',
  ALLOWED:   '#7ec87e',
  'ALLOWED*':'#ff8c42',
};

export function URLRiskChecker() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div style={{ border: '1px solid var(--color-amber-deep)', margin: '32px 0', fontFamily: 'var(--font-mono)', background: 'var(--color-bg)' }}>
      <div style={{ background: 'var(--color-bg2)', borderBottom: '1px solid var(--color-amber-deep)', padding: '10px 18px' }}>
        <span style={{ fontSize: 10, color: 'var(--color-amber)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{'// ssrf risk checker — click a URL to inspect'}</span>
      </div>
      {URL_PRESETS.map((preset, i) => (
        <div key={i} onClick={() => setSelected(selected === i ? null : i)} style={{
          borderBottom: i < URL_PRESETS.length - 1 ? '1px solid var(--color-amber-deep)' : 'none',
          cursor: 'pointer', background: selected === i ? `${RISK_COLOR[preset.risk]}11` : 'transparent', transition: 'background 0.15s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'clamp(9px,2vw,12px) clamp(12px,3vw,18px)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', flexShrink: 0, color: RISK_COLOR[preset.risk], border: `1px solid ${RISK_COLOR[preset.risk]}`, padding: '2px 8px', minWidth: 72, textAlign: 'center' }}>
              {preset.risk}
            </span>
            <span style={{ fontSize: 11, color: 'var(--color-amber-text)', flex: '1 1 200px', wordBreak: 'break-all' }}>{preset.url}</span>
            <span style={{ fontSize: 10, color: 'var(--color-amber-dim)', flexShrink: 0 }}>{selected === i ? '▲' : '▼'}</span>
          </div>
          {selected === i && (
            <div style={{ padding: 'clamp(10px,2vw,14px) clamp(12px,3vw,18px)', borderTop: '1px dashed var(--color-amber-deep)', background: 'var(--color-bg2)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 8, marginBottom: 12 }}>
                <div style={{ padding: '8px 12px', background: 'var(--color-bg)', border: '1px solid var(--color-amber-deep)' }}>
                  <div style={{ fontSize: 9, color: 'var(--color-amber-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>Resolved IP</div>
                  <div style={{ fontSize: 12, color: RISK_COLOR[preset.risk], fontWeight: 700 }}>{preset.resolvedIP}</div>
                </div>
                <div style={{ padding: '8px 12px', background: 'var(--color-bg)', border: '1px solid var(--color-amber-deep)' }}>
                  <div style={{ fontSize: 9, color: 'var(--color-amber-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>Category</div>
                  <div style={{ fontSize: 12, color: 'var(--color-amber)', fontWeight: 700 }}>{preset.category}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-amber-dim)', lineHeight: 1.6, borderLeft: `3px solid ${RISK_COLOR[preset.risk]}`, paddingLeft: 12 }}>
                {preset.reason}
                {preset.risk === 'ALLOWED*' && (
                  <div style={{ marginTop: 6, color: '#ff8c42', fontSize: 10 }}>
                    * On-prem exception: RFC 1918 is normally blocked, but this IP is on the ops-controlled allowlist. The allowlist lives in config — an admin cannot self-approve their own endpoint.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      <div style={{ borderTop: '1px solid var(--color-amber-deep)', padding: '8px 16px', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        {(['BLOCKED', 'ALLOWED', 'ALLOWED*'] as RiskLevel[]).map(r => (
          <span key={r} style={{ fontSize: 9, color: 'var(--color-amber-dim)', letterSpacing: '0.08em' }}>
            <span style={{ color: RISK_COLOR[r] }}>■</span> {r}
          </span>
        ))}
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────
   13. KodemuxRouterDemo — a live, faithful port of kodemux's
   real deterministic router (src/router.ts + src/classify.ts).
   Not a mock: same term lists, same thresholds, same math.
───────────────────────────────────────────────────────── */

type KTier = 'simple' | 'standard' | 'complex' | 'frontier';
type KMode = 'single' | 'plan' | 'multi-agent' | 'read-only';

const K_TIERS: KTier[] = ['simple', 'standard', 'complex', 'frontier'];

const K_TIER_SPECS: Record<KTier, { model: string; efforts: [string, string] | [null, null]; blurb: string; color: string }> = {
  simple:   { model: 'claude-haiku-4-5',  efforts: [null, null],       blurb: 'mechanical, low-risk edits',                     color: 'var(--color-amber-dim)' },
  standard: { model: 'claude-sonnet-5',   efforts: ['medium', 'high'], blurb: 'everyday features & fixes',                      color: '#7ec8e3' },
  complex:  { model: 'claude-opus-4-8',   efforts: ['high', 'xhigh'],  blurb: 'hard, multi-file, autonomous work',              color: 'var(--color-amber)' },
  frontier: { model: 'claude-fable-5',    efforts: ['xhigh', 'max'],   blurb: 'most demanding reasoning & long-horizon work',   color: 'var(--color-magenta)' },
};

const K_POLICY = {
  thresholds: { standard: 2, complex: 5, frontier: 9 },
  riskFloor: 'complex' as KTier,
  escalateBelowConfidence: 0.6,
  criticalPaths: ['**/auth/**', '**/migrations/**', 'infra/**', '.env*', '**/secrets/**', '**/payment*/**'],
};

type KIntent = 'docs' | 'test' | 'bugfix' | 'feature' | 'refactor' | 'architecture' | 'security';
const K_INTENTS: KIntent[] = ['docs', 'test', 'bugfix', 'feature', 'refactor', 'architecture', 'security'];
const K_DEFAULT_INTENT: KIntent = 'feature';
const K_INTENT_KEYWORDS: Record<KIntent, string[]> = {
  security: ['security', 'secure', 'audit', 'vulnerability', 'vulnerabilities', 'vuln', 'exploit', 'owasp', 'pentest', 'threat', 'cve', 'injection', 'xss', 'csrf', 'auth', 'authentication', 'authorization'],
  architecture: ['architecture', 'architect', 'redesign', 'system design', 'rearchitect', 'greenfield', 'from scratch', 'scaffold a', 'design a', 'design the'],
  refactor: ['refactor', 'restructure', 'decouple', 'modularize', 'rewrite', 'overhaul', 'migrate', 'migration', 'clean up', 'extract'],
  bugfix: ['fix', 'bug', 'patch', 'hotfix', 'repair', 'broken', 'crash', 'regression', 'error', 'exception', 'failing', 'debug', 'root cause'],
  test: ['test', 'tests', 'unit test', 'coverage', 'spec', 'e2e', 'fixture'],
  docs: ['docs', 'doc', 'documentation', 'readme', 'comment', 'comments', 'changelog', 'typo', 'jsdoc', 'docstring', 'wording'],
  feature: ['add', 'implement', 'build', 'create', 'feature', 'support', 'introduce', 'new', 'endpoint', 'component'],
};
const K_INTENT_PRIORITY: KIntent[] = ['security', 'architecture', 'refactor', 'feature', 'bugfix', 'test', 'docs'];
const K_INTENT_FLOOR: Partial<Record<KIntent, KTier>> = { bugfix: 'standard', feature: 'standard', refactor: 'standard', architecture: 'complex' };

const K_COMPLEXITY_TERMS = ['distributed', 'concurrency', 'concurrent', 'race condition', 'deadlock', 'threading', 'multithread', 'async', 'parallel', 'algorithm', 'optimize', 'optimization', 'performance', 'scalability', 'throughput', 'latency', 'architecture', 'redesign', 'design', 'migrate', 'migration', 'rewrite', 'overhaul', 'protocol', 'consensus', 'cryptography', 'encryption', 'compiler', 'parser', 'state machine', 'memory leak', 'end-to-end', 'pipeline', 'orchestrate', 'rearchitect', 'from scratch'];
const K_SIMPLICITY_TERMS = ['typo', 'rename', 'comment', 'formatting', 'lint', 'whitespace', 'bump', 'changelog', 'readme', 'spelling', 'wording', 'indent', 'reword', 'one-liner', 'trivial'];
const K_SCOPE_TERMS = ['entire', 'whole', 'across the', 'codebase', 'system-wide', 'everywhere', 'all files', 'throughout', 'every module', 'end-to-end'];
const K_RISK_SECURITY_TERMS = ['security', 'secure', 'auth', 'authentication', 'authorization', 'vulnerability', 'vulnerabilities', 'exploit', 'owasp', 'cve', 'injection', 'xss', 'csrf', 'crypto', 'cryptography', 'password', 'secret', 'token', 'payment', 'pii', 'gdpr'];
const K_COMPLEXITY_MAX = 14;

const kEsc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const kCount = (text: string, term: string) => (text.match(new RegExp(`\\b${kEsc(term)}\\b`, 'gi')) || []).length;
const kAnyMatch = (text: string, terms: string[]) => terms.filter(t => kCount(text, t) > 0);

interface KAnalysis {
  intent: KIntent; complexity: number; risks: string[]; scopeWide: boolean; multiStep: boolean;
  steps: number; complexityHits: string[]; simplicityHits: string[]; reasons: string[];
}

function kAnalyze(prompt: string, criticalPath: boolean): KAnalysis {
  const text = (prompt || '').toLowerCase();
  const reasons: string[] = [];

  const iScore: Record<string, number> = {};
  K_INTENTS.forEach(i => { iScore[i] = 0; });
  for (const intent of K_INTENTS) for (const kw of K_INTENT_KEYWORDS[intent]) {
    const n = kCount(text, kw);
    if (n > 0) iScore[intent] += n;
  }
  let intent: KIntent = K_DEFAULT_INTENT, best = -1;
  for (const cand of K_INTENT_PRIORITY) if (iScore[cand] > best) { best = iScore[cand]; intent = cand; }
  if (best <= 0) intent = K_DEFAULT_INTENT;

  let complexity = 0;
  const complexityHits = kAnyMatch(text, K_COMPLEXITY_TERMS); complexity += complexityHits.length * 2;
  const simplicityHits = kAnyMatch(text, K_SIMPLICITY_TERMS); complexity -= simplicityHits.length * 2;
  const scopeHits = kAnyMatch(text, K_SCOPE_TERMS); const scopeWide = scopeHits.length > 0;
  if (scopeWide) { complexity += 2; reasons.push(`wide scope (${scopeHits.slice(0, 2).join(', ')}) → +complexity`); }
  const connectors = (text.match(/\b(and then|then|also|afterwards|followed by)\b|;/gi) || []).length;
  const multiStep = connectors >= 1;
  if (multiStep) { const b = Math.min(3, connectors); complexity += b; reasons.push(`multi-step request (${connectors} connector${connectors > 1 ? 's' : ''}) → +${b}`); }
  if (complexityHits.length) reasons.unshift(`complexity signals: ${complexityHits.slice(0, 4).join(', ')}`);
  if (simplicityHits.length) reasons.push(`simplicity signals: ${simplicityHits.slice(0, 4).join(', ')}`);
  complexity = Math.max(0, Math.min(K_COMPLEXITY_MAX, complexity));

  const risks: string[] = [];
  const secHits = kAnyMatch(text, K_RISK_SECURITY_TERMS);
  if (secHits.length) { risks.push('security'); reasons.push(`security-sensitive (${secHits.slice(0, 2).join(', ')})`); }
  if (criticalPath) { risks.push('critical'); reasons.push('critical path touched (src/auth/session.ts) → +risk'); }

  return { intent, complexity, risks, scopeWide, multiStep, steps: connectors, complexityHits, simplicityHits, reasons };
}

function kTierFromComplexity(c: number): KTier {
  if (c >= K_POLICY.thresholds.frontier) return 'frontier';
  if (c >= K_POLICY.thresholds.complex) return 'complex';
  if (c >= K_POLICY.thresholds.standard) return 'standard';
  return 'simple';
}
const kMaxTier = (a: KTier, b: KTier) => (K_TIERS.indexOf(a) >= K_TIERS.indexOf(b) ? a : b);

function kChooseMode(a: KAnalysis, tier: KTier): KMode {
  const idx = K_TIERS.indexOf(tier);
  if (idx >= K_TIERS.indexOf('complex') && (a.scopeWide || a.multiStep)) return 'multi-agent';
  if (idx >= K_TIERS.indexOf('standard') && (a.multiStep || a.intent === 'feature' || a.intent === 'refactor' || a.intent === 'architecture')) return 'plan';
  return 'single';
}

function kRecommendParallelism(a: KAnalysis, mode: KMode): number {
  if (mode !== 'multi-agent') return 1;
  let n = 2;
  n += Math.min(2, Math.max(0, a.steps - 1));
  if (a.scopeWide) n += 1;
  return Math.max(2, Math.min(6, n));
}

interface KRoute {
  intent: KIntent; complexity: number; tier: KTier; risks: string[];
  model: string; effort: string | null; mode: KMode; agents: number;
  confidence: number; escalation: { model: string; tier: KTier } | null; reasons: string[];
}

function kRoute(prompt: string, criticalPath: boolean): KRoute {
  const a = kAnalyze(prompt, criticalPath);
  const isAudit = /\baudit\b|\breview\b|\bassess\b/.test(prompt.toLowerCase()) && a.intent === 'security';

  let tier = kTierFromComplexity(a.complexity);
  const floor = K_INTENT_FLOOR[a.intent];
  if (floor) tier = kMaxTier(tier, floor);
  if (a.risks.length) tier = kMaxTier(tier, K_POLICY.riskFloor);

  const spec = K_TIER_SPECS[tier];
  const upperBand = a.complexity >= (K_POLICY.thresholds.frontier + K_POLICY.thresholds.complex) / 2;
  const boost = a.risks.length > 0 || upperBand || (a.multiStep && K_TIERS.indexOf(tier) >= K_TIERS.indexOf('complex'));
  const effort = spec.efforts[boost ? 1 : 0] ?? spec.efforts[0];

  const mode: KMode = isAudit ? 'read-only' : kChooseMode(a, tier);
  const agents = kRecommendParallelism(a, mode);

  let conf = 0.5;
  conf += Math.min(0.35, 0.07 * a.reasons.length);
  if (a.complexityHits.length && a.simplicityHits.length) conf -= 0.2;
  if (a.simplicityHits.length && !a.complexityHits.length) conf += 0.12;
  if (a.complexityHits.length >= 3 && !a.simplicityHits.length) conf += 0.12;
  const bounds = [K_POLICY.thresholds.standard, K_POLICY.thresholds.complex, K_POLICY.thresholds.frontier];
  if (Math.min(...bounds.map(b => Math.abs(a.complexity - b))) <= 1) conf -= 0.15;
  if (a.complexity === 0 && a.reasons.length === 0) conf = 0.25;
  const confidence = Math.max(0.05, Math.min(0.97, Number(conf.toFixed(2))));

  let escalation: { model: string; tier: KTier } | null = null;
  const idx = K_TIERS.indexOf(tier);
  if (idx < K_TIERS.length - 1 && confidence < K_POLICY.escalateBelowConfidence) {
    const next = K_TIERS[idx + 1];
    escalation = { model: K_TIER_SPECS[next].model, tier: next };
  }

  const reasons = [...a.reasons];
  if (mode === 'multi-agent') reasons.push(`parallelizable work → fan out to ${agents} agents`);
  reasons.unshift(`complexity ${a.complexity} + ${a.risks.length ? `risk[${a.risks.join(',')}] ` : ''}intent ${a.intent} → ${tier} tier`);

  return { intent: a.intent, complexity: a.complexity, tier, risks: a.risks, model: spec.model, effort, mode, agents, confidence, escalation, reasons };
}

const K_EXAMPLES = [
  'fix a typo in the README',
  'add a dark mode toggle to the settings page',
  'audit the payment flow for security vulnerabilities',
  'rewrite the entire data pipeline across the whole codebase, then migrate the schema, then add integration tests',
];

export function KodemuxRouterDemo() {
  const [prompt, setPrompt] = useState(K_EXAMPLES[0]);
  const [criticalPath, setCriticalPath] = useState(false);
  const r = useMemo(() => kRoute(prompt, criticalPath), [prompt, criticalPath]);
  const tierColor = K_TIER_SPECS[r.tier].color;

  return (
    <div style={{ border: '1px solid var(--color-amber-deep)', margin: '32px 0', fontFamily: 'var(--font-mono)', background: 'var(--color-bg)' }}>
      <div style={{ background: 'var(--color-bg2)', borderBottom: '1px solid var(--color-amber-deep)', padding: '10px 18px' }}>
        <span style={{ fontSize: 10, color: 'var(--color-amber)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {'// kodemux router — try any prompt, this is the real logic'}
        </span>
      </div>

      <div style={{ padding: 'clamp(14px,3vw,20px)' }}>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={2}
          style={{
            width: '100%', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: 13,
            color: 'var(--color-amber-text)', background: 'var(--color-bg2)',
            border: '1px solid var(--color-amber-deep)', padding: '10px 12px', lineHeight: 1.5,
          }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {K_EXAMPLES.map(ex => (
            <button key={ex} onClick={() => setPrompt(ex)} style={{
              fontSize: 10, fontFamily: 'var(--font-mono)', cursor: 'pointer', padding: '5px 10px',
              background: prompt === ex ? 'var(--color-amber-sub)' : 'transparent',
              color: prompt === ex ? 'var(--color-amber)' : 'var(--color-amber-dim)',
              border: `1px solid ${prompt === ex ? 'var(--color-amber)' : 'var(--color-amber-deep)'}`,
            }}>
              {ex.length > 42 ? ex.slice(0, 42) + '…' : ex}
            </button>
          ))}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 11, color: 'var(--color-amber-dim)', cursor: 'pointer' }}>
          <input type="checkbox" checked={criticalPath} onChange={e => setCriticalPath(e.target.checked)} style={{ accentColor: 'var(--color-magenta)' }} />
          the real diff touches <code style={{ color: 'var(--color-amber-text)' }}>src/auth/session.ts</code> (try this even on an innocuous prompt)
        </label>
      </div>

      <div style={{ borderTop: '1px solid var(--color-amber-deep)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 1, background: 'var(--color-amber-deep)' }}>
        {[
          { label: 'intent', value: r.intent },
          { label: 'complexity', value: `${r.complexity} / 14` },
          { label: 'tier', value: r.tier, color: tierColor },
          { label: 'confidence', value: r.confidence.toFixed(2), color: r.confidence >= 0.6 ? '#7ec87e' : '#ff8c42' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--color-bg)', padding: '10px 14px' }}>
            <div style={{ fontSize: 9, color: 'var(--color-amber-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: stat.color ?? 'var(--color-amber-text)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {r.risks.length > 0 && (
        <div style={{ padding: '8px 18px', background: 'var(--color-magenta-soft)', borderTop: '1px solid var(--color-amber-deep)', fontSize: 11, color: 'var(--color-magenta)' }}>
          risk flags: {r.risks.join(' · ')}
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--color-amber-deep)', padding: 'clamp(14px,3vw,20px)' }}>
        {[
          { k: 'model', v: r.model },
          { k: 'effort', v: r.effort ?? 'n/a (Haiku has no effort control)' },
          { k: 'mode', v: r.mode },
          {
            k: 'agents',
            v: r.mode === 'multi-agent'
              ? `${r.agents} in parallel — genuinely parallelizable`
              : `1 — don't parallelize this`,
            color: r.mode === 'multi-agent' ? 'var(--color-magenta)' : undefined,
          },
        ].map((row, i) => (
          <div key={row.k} style={{
            display: 'flex', gap: 12, fontSize: 12.5, padding: '7px 0',
            borderLeft: `3px solid ${tierColor}`, paddingLeft: 12,
            animation: 'fadeIn 0.25s ease both', animationDelay: `${i * 0.05}s`,
          }}>
            <span style={{ color: 'var(--color-amber-dim)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', minWidth: 60, paddingTop: 1 }}>{row.k}</span>
            <span style={{ color: row.color ?? 'var(--color-amber-text)', fontWeight: 600 }}>{row.v}</span>
          </div>
        ))}
      </div>

      {r.escalation && (
        <div style={{ padding: '10px 18px', background: 'rgba(192,144,47,0.1)', borderTop: '1px solid var(--color-amber-deep)', fontSize: 11, color: '#e8b86d' }}>
          ↑ escalate to <b>{r.escalation.model}</b> ({r.escalation.tier}) if the agent stalls or the change proves bigger than it looked
        </div>
      )}

      <div style={{ borderTop: '1px dashed var(--color-amber-deep)', padding: 'clamp(14px,3vw,20px)' }}>
        <div style={{ fontSize: 9, color: 'var(--color-amber-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>why</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {r.reasons.map((reason, i) => (
            <li key={i} style={{ fontSize: 11.5, color: 'var(--color-amber-dim)', marginBottom: 4, lineHeight: 1.5 }}>{reason}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────
   14. KodemuxGuardTrace — hooks-as-enforcement, applied:
   kodemux's PreToolUse hook blocking a risky commit live.
───────────────────────────────────────────────────────── */

type KTraceType = 'ai' | 'tool' | 'hook' | 'error' | 'success';
const KG_TRACE_COLOR: Record<KTraceType, string> = {
  ai: 'var(--color-amber-text)', tool: 'var(--color-amber-dim)', hook: '#7ec8e3',
  error: 'var(--color-magenta)', success: '#7ec87e',
};
const KG_TRACE_PREFIX: Record<KTraceType, string> = { ai: '❯', tool: '▸', hook: '⚙', error: '✗', success: '✓' };

const KG_STEPS: { label: string; text: string; type: KTraceType }[] = [
  { label: 'claude', text: "Done — running `git commit -m \"quick fix\"` on main…", type: 'ai' },
  { label: 'tool', text: 'Bash → git commit -m "quick fix"', type: 'tool' },
  { label: 'hook', text: 'PreToolUse firing: kodemux hook pre-tool-use', type: 'hook' },
  { label: 'hook', text: "kodemux guard: branch 'main' is protected.", type: 'error' },
  { label: 'hook', text: 'exit 2 → commit is BLOCKED', type: 'error' },
  { label: 'claude', text: 'Understood — creating a feature branch first…', type: 'ai' },
  { label: 'tool', text: 'Bash → git checkout -b fix/quick-thing && git commit -m "quick fix"', type: 'tool' },
  { label: 'hook', text: 'PreToolUse firing: kodemux hook pre-tool-use', type: 'hook' },
  { label: 'hook', text: 'kodemux scan: 1 potential secret found — leak.env:1 [github-token]', type: 'error' },
  { label: 'hook', text: 'exit 2 → commit is BLOCKED again', type: 'error' },
  { label: 'claude', text: 'Removing the leaked token, retrying…', type: 'ai' },
  { label: 'tool', text: 'Bash → git commit -m "quick fix"', type: 'tool' },
  { label: 'hook', text: 'kodemux guard + scan: clean. exit 0 → ALLOWED ✓', type: 'success' },
  { label: 'tool', text: 'Commit succeeded on fix/quick-thing ✓', type: 'success' },
];

export function KodemuxGuardTrace() {
  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playing && shown < KG_STEPS.length) {
      intervalRef.current = setInterval(() => {
        setShown(s => {
          if (s + 1 >= KG_STEPS.length) { setPlaying(false); if (intervalRef.current) clearInterval(intervalRef.current); }
          return s + 1;
        });
      }, 420);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, shown]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [shown]);

  const reset = () => { setShown(0); setPlaying(false); if (intervalRef.current) clearInterval(intervalRef.current); };
  const done = shown >= KG_STEPS.length;

  return (
    <div style={{ border: '1px solid var(--color-amber-deep)', margin: '32px 0', fontFamily: 'var(--font-mono)', background: 'var(--color-bg)' }}>
      <div style={{ background: 'var(--color-bg2)', borderBottom: '1px solid var(--color-amber-deep)', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-magenta)', display: 'inline-block' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-amber)', display: 'inline-block' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-amber-dim)', display: 'inline-block' }} />
          <span style={{ marginLeft: 10, fontSize: 10, color: 'var(--color-amber-dim)', letterSpacing: '0.1em' }}>kodemux-guard — bash</span>
        </div>
        {!done ? (
          <button onClick={() => setPlaying(p => !p)} style={{ background: 'var(--color-magenta)', color: '#000', border: 'none', padding: '4px 12px', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', cursor: 'pointer', fontWeight: 700 }}>
            {playing ? '⏸ PAUSE' : shown === 0 ? '▶ RUN DEMO' : '▶ RESUME'}
          </button>
        ) : (
          <button onClick={reset} style={{ background: 'transparent', color: 'var(--color-amber-dim)', border: '1px solid var(--color-amber-deep)', padding: '4px 12px', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', cursor: 'pointer' }}>↺ RESET</button>
        )}
      </div>

      <div style={{ padding: 'clamp(12px,3vw,16px) clamp(12px,3vw,20px)', minHeight: 220, maxHeight: 340, overflowY: 'auto', fontSize: 12, lineHeight: 1.7 }}>
        {shown === 0 && (
          <span style={{ color: 'var(--color-amber-dim)', fontSize: 11 }}>
            Press ▶ RUN DEMO — this is the exact PreToolUse hook `kodemux hooks install` wires up, blocking on a protected branch and then a leaked secret before finally letting a clean commit through.
          </span>
        )}
        {KG_STEPS.slice(0, shown).map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 2 }}>
            <span style={{ color: 'var(--color-amber-dim)', width: 22, textAlign: 'right', flexShrink: 0, fontSize: 10, paddingTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{ color: KG_TRACE_COLOR[step.type], flexShrink: 0, width: 14 }}>{KG_TRACE_PREFIX[step.type]}</span>
            <span style={{ color: 'var(--color-amber-dim)', fontSize: 9, width: 46, flexShrink: 0, paddingTop: 2, letterSpacing: '0.05em' }}>[{step.label}]</span>
            <span style={{ color: KG_TRACE_COLOR[step.type] }}>{step.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ borderTop: '1px solid var(--color-amber-deep)', padding: '8px 20px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {([{ type: 'ai', label: 'Claude' }, { type: 'tool', label: 'Tool call' }, { type: 'hook', label: 'Hook' }, { type: 'error', label: 'Blocked' }, { type: 'success', label: 'Allowed' }] as { type: KTraceType; label: string }[]).map(({ type, label }) => (
          <div key={type} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <span style={{ color: KG_TRACE_COLOR[type], fontSize: 10 }}>{KG_TRACE_PREFIX[type]}</span>
            <span style={{ color: 'var(--color-amber-dim)', fontSize: 9, letterSpacing: '0.08em' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
