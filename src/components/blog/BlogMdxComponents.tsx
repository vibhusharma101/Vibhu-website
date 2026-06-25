'use client';

import { useState, useEffect, useRef } from 'react';

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
