'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

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

const PROOF_STEPS = [
  {
    eq: 'low + (high − low) / 2',
    label: 'Safe formula (starting point)',
    note: 'This is what production code uses. We want to prove it equals the standard (low + high) / 2.',
    highlight: false,
  },
  {
    eq: '= (2·low) / 2  +  (high − low) / 2',
    label: 'Find a common denominator',
    note: 'Rewrite "low" as "2·low / 2" so both terms share denominator 2.',
    highlight: false,
  },
  {
    eq: '= (2·low + high − low) / 2',
    label: 'Combine the fractions',
    note: 'Both fractions share the same denominator — merge them into one.',
    highlight: false,
  },
  {
    eq: '= (low + high) / 2  ✓',
    label: 'Simplify',
    note: '2·low − low = low. This is exactly the standard formula — just computed safely.',
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
              fontSize: 'clamp(13px, 2.5vw, 16px)',
              color: step.highlight ? '#7ec87e' : 'var(--color-amber-text)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.03em',
              padding: '10px 14px',
              background: step.highlight ? 'rgba(126,200,126,0.07)' : 'var(--color-bg2)',
              border: `1px solid ${step.highlight ? '#7ec87e' : 'var(--color-amber-deep)'}`,
              marginBottom: 6,
              wordBreak: 'break-word',
            }}>
              {step.eq}
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
