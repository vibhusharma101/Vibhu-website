'use client';

import { useState, useEffect, useRef } from 'react';

/* ═════════════════════════════════════════════════════════
   Shared shell primitives for the "How I built PRS" series.
   Same visual language as BlogMdxComponents: amber + magenta
   on pitch black, IBM Plex Mono, hard 1px borders.
   ═════════════════════════════════════════════════════════ */

const BOX: React.CSSProperties = {
  border: '1px solid var(--color-amber-deep)',
  margin: '32px 0',
  fontFamily: 'var(--font-mono)',
  background: 'var(--color-bg)',
};

const BAR: React.CSSProperties = {
  background: 'var(--color-bg2)',
  borderBottom: '1px solid var(--color-amber-deep)',
  padding: '8px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  flexWrap: 'wrap',
};

const TITLE: React.CSSProperties = {
  fontSize: 10,
  color: 'var(--color-amber-dim)',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
};

const BTN: React.CSSProperties = {
  background: 'var(--color-magenta)',
  color: '#000',
  border: 'none',
  padding: '5px 13px',
  fontSize: 10,
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.08em',
  cursor: 'pointer',
  fontWeight: 700,
};

const BTN_GHOST: React.CSSProperties = {
  background: 'transparent',
  color: 'var(--color-amber-dim)',
  border: '1px solid var(--color-amber-deep)',
  padding: '5px 13px',
  fontSize: 10,
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.08em',
  cursor: 'pointer',
};

/* ─────────────────────────────────────────────────────────
   1. PrsAuditScoreboard — score the reviewer yourself.

   Five comments in the shape of the four failure modes the
   real audit surfaced. The reader grades each one, then sees
   the audit's verdict and which failure mode it belongs to.
───────────────────────────────────────────────────────── */

type Verdict = 'good' | 'ok' | 'invalid';

const VERDICT_COLOR: Record<Verdict, string> = {
  good: '#4ec9b0',
  ok: 'var(--color-amber)',
  invalid: 'var(--color-magenta)',
};

const VERDICT_LABEL: Record<Verdict, string> = {
  good: 'GOOD',
  ok: 'OK',
  invalid: 'INVALID',
};

interface AuditCard {
  file: string;
  line: number;
  severity: string;
  body: string;
  verdict: Verdict;
  mode: string;
  why: string;
}

const AUDIT_CARDS: AuditCard[] = [
  {
    file: 'services/reportService.js',
    line: 142,
    severity: 'MAJOR',
    body: '`Report._id` is a String here, but the schema defines it as an ObjectId — this comparison will always evaluate false.',
    verdict: 'invalid',
    mode: 'Failure 1 — confident about code it cannot see',
    why: 'The schema was never in the prompt. A diff carries about three lines of context around each change, so the reviewer had no way to know the real type. It guessed, and it guessed wrong — but the sentence is written with total certainty.',
  },
  {
    file: 'routes/reports.js',
    line: 30,
    severity: 'MINOR',
    body: 'This handler wraps its return value in a response envelope unnecessarily. Return the object directly for a cleaner API.',
    verdict: 'invalid',
    mode: 'Failure 2 — flagging a mandated convention as a bug',
    why: 'The response wrapper is required by the repo\'s own written conventions. The reviewer flagged the mandated pattern as the bug and proposed "fixing" it into the exact thing the guidelines forbid. Inverted, and confident.',
  },
  {
    file: 'services/reportService.js',
    line: 88,
    severity: 'MAJOR',
    body: 'This switch handles DRAFT, ACTIVE and DELETED. An ARCHIVED report falls through and is silently excluded from the total.',
    verdict: 'good',
    mode: 'The kind of finding the whole system exists for',
    why: 'Specific, checkable in thirty seconds, and names the exact consequence. This is what a good comment looks like — and note that it is only possible if the reviewer actually knows every member of the Status enum.',
  },
  {
    file: 'services/reportService.js',
    line: 91,
    severity: 'MINOR',
    body: 'Possible null dereference on `report.owner` if the record has no assigned owner.',
    verdict: 'ok',
    mode: 'Failure 3 — the fifth restatement of one issue',
    why: 'Individually correct. But four other passes already said this about the same block, on slightly different lines, in slightly different words. One audited week carried roughly 90 duplicate findings. A wall of near-identical comments reads as noise even when every one of them is right.',
  },
  {
    file: '— whole PR —',
    line: 0,
    severity: 'APPROVE',
    body: 'No issues found. The changes look good and follow existing patterns.',
    verdict: 'invalid',
    mode: 'Failure 4 — the 2.5-second rubber stamp',
    why: 'This verdict came back on a 58,000-token review prompt in about 2.5 seconds, with 27 output tokens behind it. Nothing was actually read. A reviewer that quietly approves big changes is worse than no reviewer, because it manufactures confidence.',
  },
];

export function PrsAuditScoreboard() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Verdict | null>(null);
  const [agreed, setAgreed] = useState(0);
  const [done, setDone] = useState(false);

  const card = AUDIT_CARDS[idx];
  const revealed = picked !== null;

  function choose(v: Verdict) {
    if (revealed) return;
    setPicked(v);
    if (v === card.verdict) setAgreed(a => a + 1);
  }

  function next() {
    if (idx + 1 >= AUDIT_CARDS.length) {
      setDone(true);
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
  }

  function reset() {
    setIdx(0);
    setPicked(null);
    setAgreed(0);
    setDone(false);
  }

  if (done) {
    return (
      <div style={BOX}>
        <div style={BAR}>
          <span style={TITLE}>Audit complete — {AUDIT_CARDS.length} comments scored</span>
          <button onClick={reset} style={BTN_GHOST}>↺ SCORE AGAIN</button>
        </div>
        <div style={{ padding: 'clamp(18px,5vw,34px)', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--color-amber-dim)', letterSpacing: '0.1em', marginBottom: 10 }}>
            YOU AGREED WITH THE AUDIT ON
          </div>
          <div style={{ fontSize: 44, color: 'var(--color-amber)', fontWeight: 700, lineHeight: 1 }}>
            {agreed} / {AUDIT_CARDS.length}
          </div>
          <div style={{
            marginTop: 26,
            paddingTop: 22,
            borderTop: '1px solid var(--color-amber-deep)',
            fontSize: 13,
            color: 'var(--color-amber-text)',
            lineHeight: 1.65,
            maxWidth: 520,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            I did this by hand for roughly <strong style={{ color: 'var(--color-amber)' }}>350 comments</strong> across
            seven weeks of merged PRs. The result:
            <div style={{ fontSize: 34, color: 'var(--color-magenta)', fontWeight: 700, margin: '16px 0 6px' }}>
              81.2% useful
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-amber-dim)' }}>
              Which sounds decent, and isn&apos;t — a reviewer is judged on its worst comment, not its average.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={BOX}>
      <div style={BAR}>
        <span style={TITLE}>
          Score it yourself — comment {idx + 1} of {AUDIT_CARDS.length}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {AUDIT_CARDS.map((_, i) => (
            <span
              key={i}
              style={{
                width: 18,
                height: 3,
                background: i < idx || (i === idx && revealed)
                  ? 'var(--color-amber)'
                  : 'var(--color-amber-deep)',
                display: 'inline-block',
              }}
            />
          ))}
        </div>
      </div>

      {/* the comment itself */}
      <div style={{ padding: 'clamp(14px,4vw,22px)' }}>
        <div style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          fontSize: 10,
          color: 'var(--color-amber-dim)',
          marginBottom: 10,
          flexWrap: 'wrap',
        }}>
          <span style={{
            color: card.severity === 'APPROVE' ? '#4ec9b0' : 'var(--color-amber)',
            border: '1px solid var(--color-amber-deep)',
            padding: '2px 7px',
            letterSpacing: '0.08em',
          }}>
            {card.severity}
          </span>
          <span>{card.file}{card.line > 0 ? `:${card.line}` : ''}</span>
        </div>

        <div style={{
          fontSize: 13.5,
          color: 'var(--color-amber-text)',
          lineHeight: 1.65,
          borderLeft: '3px solid var(--color-amber-deep)',
          paddingLeft: 14,
        }}>
          {card.body}
        </div>

        {/* grading buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
          {(['good', 'ok', 'invalid'] as Verdict[]).map(v => {
            const isPick = picked === v;
            const isTruth = revealed && card.verdict === v;
            return (
              <button
                key={v}
                onClick={() => choose(v)}
                disabled={revealed}
                style={{
                  flex: '1 1 90px',
                  padding: '9px 10px',
                  background: isTruth ? VERDICT_COLOR[v] : 'transparent',
                  color: isTruth ? '#000' : isPick ? VERDICT_COLOR[v] : 'var(--color-amber-dim)',
                  border: `1px solid ${isPick || isTruth ? VERDICT_COLOR[v] : 'var(--color-amber-deep)'}`,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10.5,
                  letterSpacing: '0.1em',
                  fontWeight: isTruth ? 700 : 400,
                  cursor: revealed ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {VERDICT_LABEL[v]}
                {isPick && !isTruth ? '  ← you' : ''}
                {isTruth ? '  ← audit' : ''}
              </button>
            );
          })}
        </div>

        {/* reveal */}
        {revealed && (
          <div style={{
            marginTop: 18,
            paddingTop: 16,
            borderTop: '1px solid var(--color-amber-deep)',
          }}>
            <div style={{
              fontSize: 10,
              letterSpacing: '0.1em',
              color: VERDICT_COLOR[card.verdict],
              marginBottom: 8,
              textTransform: 'uppercase',
            }}>
              {card.mode}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--color-amber-dim)', lineHeight: 1.7 }}>
              {card.why}
            </div>
            <button onClick={next} style={{ ...BTN, marginTop: 16 }}>
              {idx + 1 >= AUDIT_CARDS.length ? 'SEE THE REAL NUMBER →' : 'NEXT COMMENT →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   2. PrsRubberStamp — the 2.5-second approval, dramatised.

   Every number here is from the real log line: a 58,000-token
   review prompt answered in ~2.5s with 27 output tokens.
───────────────────────────────────────────────────────── */

const INPUT_TOKENS = 58000;

export function PrsRubberStamp() {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'thinking' | 'done'>('idle');
  const [loaded, setLoaded] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);

  function clearAll() {
    timers.current.forEach(clearInterval);
    timers.current = [];
  }

  useEffect(() => clearAll, []);

  function run() {
    clearAll();
    setPhase('loading');
    setLoaded(0);
    setElapsed(0);

    // stream the prompt in
    const load = setInterval(() => {
      setLoaded(v => {
        const next = v + INPUT_TOKENS / 28;
        if (next >= INPUT_TOKENS) {
          clearInterval(load);
          setPhase('thinking');
          // the "thinking" that wasn't: 2.5 seconds on the clock
          const tick = setInterval(() => {
            setElapsed(e => {
              const t = +(e + 0.1).toFixed(1);
              if (t >= 2.5) {
                clearInterval(tick);
                setPhase('done');
                return 2.5;
              }
              return t;
            });
          }, 42);
          timers.current.push(tick);
          return INPUT_TOKENS;
        }
        return next;
      });
    }, 26);
    timers.current.push(load);
  }

  function reset() {
    clearAll();
    setPhase('idle');
    setLoaded(0);
    setElapsed(0);
  }

  const pct = Math.min(100, (loaded / INPUT_TOKENS) * 100);

  return (
    <div style={BOX}>
      <div style={BAR}>
        <span style={TITLE}>Deep Review — reasoning effort: default</span>
        {phase === 'idle' || phase === 'done' ? (
          <button onClick={phase === 'done' ? reset : run} style={phase === 'done' ? BTN_GHOST : BTN}>
            {phase === 'done' ? '↺ REPLAY' : '▶ SEND THE PROMPT'}
          </button>
        ) : (
          <span style={{ ...TITLE, color: 'var(--color-amber)' }}>running…</span>
        )}
      </div>

      <div style={{ padding: 'clamp(16px,4vw,26px)' }}>
        {/* input meter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--color-amber-dim)', letterSpacing: '0.08em', marginBottom: 7 }}>
          <span>INPUT PROMPT</span>
          <span style={{ color: pct >= 100 ? 'var(--color-amber)' : 'var(--color-amber-dim)' }}>
            {Math.round(loaded).toLocaleString()} tokens
          </span>
        </div>
        <div style={{ height: 8, background: 'var(--color-bg2)', border: '1px solid var(--color-amber-deep)' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: 'var(--color-amber)',
            transition: 'width 0.05s linear',
          }} />
        </div>

        {/* clock */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: 10,
          margin: '26px 0 6px',
          opacity: phase === 'idle' ? 0.25 : 1,
          transition: 'opacity 0.3s',
        }}>
          <span style={{
            fontSize: 52,
            fontWeight: 700,
            color: phase === 'done' ? 'var(--color-magenta)' : 'var(--color-amber)',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {elapsed.toFixed(1)}
          </span>
          <span style={{ fontSize: 14, color: 'var(--color-amber-dim)' }}>seconds of “thinking”</span>
        </div>

        {/* output */}
        {phase === 'done' && (
          <div style={{ marginTop: 24, animation: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--color-amber-dim)', letterSpacing: '0.08em', marginBottom: 7 }}>
              <span>OUTPUT</span>
              <span style={{ color: 'var(--color-magenta)' }}>27 tokens</span>
            </div>
            <div style={{
              border: '1px solid var(--color-magenta)',
              background: 'var(--color-magenta-soft)',
              padding: '12px 15px',
              fontSize: 13,
              color: 'var(--color-amber-text)',
            }}>
              <span style={{ color: '#4ec9b0' }}>verdict:</span> approve
              <div style={{ fontSize: 12, color: 'var(--color-amber-dim)', marginTop: 5 }}>
                “No issues found. The changes look good.”
              </div>
            </div>

            <div style={{
              marginTop: 18,
              paddingTop: 16,
              borderTop: '1px solid var(--color-amber-deep)',
              fontSize: 12.5,
              color: 'var(--color-amber-dim)',
              lineHeight: 1.7,
            }}>
              58,000 tokens in. 27 tokens out. Two and a half seconds between them — not enough time to
              read a paragraph, let alone a pull request. Reasoning models at default effort will skim a
              large prompt and tell you it&apos;s fine.
              <div style={{
                marginTop: 12,
                padding: '10px 13px',
                background: 'var(--color-bg2)',
                borderLeft: '3px solid var(--color-amber)',
                color: 'var(--color-amber-text)',
                fontSize: 12,
              }}>
                The fix was one line of config:&nbsp;
                <code style={{ color: 'var(--color-amber)' }}>&quot;reasoning&quot;: &#123;&quot;effort&quot;: &quot;high&quot;&#125;</code>
              </div>
            </div>
          </div>
        )}

        {phase === 'idle' && (
          <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--color-amber-dim)', marginTop: 10, lineHeight: 1.6 }}>
            A real log line from v1. Press send and watch a pull request get approved.
          </div>
        )}
      </div>
    </div>
  );
}
