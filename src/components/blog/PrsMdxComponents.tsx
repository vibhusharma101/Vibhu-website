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

/* ─────────────────────────────────────────────────────────
   3. PrsFanOut — v1's sequential oracle vs v2's parallel panel.
───────────────────────────────────────────────────────── */

interface Stage {
  label: string;
  detail: string;
  kind: 'serial' | 'triage' | 'pass' | 'reduce' | 'gate' | 'post';
}

const V1_STAGES: Stage[] = [
  { label: 'Quick Scan', detail: 'broad sweep for obvious problems', kind: 'serial' },
  { label: 'Deep Review', detail: 'one prompt: security + correctness + perf + tests + style', kind: 'serial' },
  { label: 'Cross-File', detail: 'how the changed files connect', kind: 'serial' },
  { label: 'Post', detail: 'whatever came out, goes up', kind: 'post' },
];

const V2_STAGES: Stage[] = [
  { label: 'Triage', detail: 'cheap model picks which passes run — bounded by code', kind: 'triage' },
  { label: 'security · tenancy', detail: 'owns one concern, nothing else', kind: 'pass' },
  { label: 'data layer', detail: 'owns one concern, nothing else', kind: 'pass' },
  { label: 'testing · hygiene', detail: 'owns one concern, nothing else', kind: 'pass' },
  { label: 'performance · async', detail: 'owns one concern, nothing else', kind: 'pass' },
  { label: 'conventions · arch', detail: 'owns one concern, nothing else', kind: 'pass' },
  { label: '…and the rest of the panel', detail: 'roughly ten focused passes in parallel', kind: 'pass' },
  { label: 'Merge + dedup', detail: 'tiered similarity collapses restatements', kind: 'reduce' },
  { label: 'Comment budget', detail: 'overflow nits get clustered', kind: 'reduce' },
  { label: 'Verify gate', detail: 'every finding survives a refutation attempt', kind: 'gate' },
  { label: 'Post', detail: 'what is left has earned the space', kind: 'post' },
];

const STAGE_COLOR: Record<Stage['kind'], string> = {
  serial: 'var(--color-amber-dim)',
  triage: '#569cd6',
  pass: 'var(--color-amber)',
  reduce: '#dcdcaa',
  gate: '#4ec9b0',
  post: 'var(--color-magenta)',
};

export function PrsFanOut() {
  const [version, setVersion] = useState<'v1' | 'v2'>('v1');
  const [lit, setLit] = useState(0);

  const stages = version === 'v1' ? V1_STAGES : V2_STAGES;

  useEffect(() => {
    setLit(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setLit(i);
      if (i >= stages.length) clearInterval(id);
    }, version === 'v1' ? 380 : 170);
    return () => clearInterval(id);
  }, [version, stages.length]);

  return (
    <div style={BOX}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-amber-deep)' }}>
        {(['v1', 'v2'] as const).map(v => {
          const active = version === v;
          const color = v === 'v1' ? 'var(--color-amber-dim)' : 'var(--color-magenta)';
          return (
            <button
              key={v}
              onClick={() => setVersion(v)}
              style={{
                flex: 1,
                padding: '11px 14px',
                background: active ? 'var(--color-bg)' : 'var(--color-bg2)',
                border: 'none',
                borderBottom: active ? `2px solid ${color}` : '2px solid transparent',
                color: active ? color : 'var(--color-amber-dim)',
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.15s',
              }}
            >
              {v === 'v1' ? 'v1 — one oracle, in sequence' : 'v2 — a panel, in parallel'}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 'clamp(14px,4vw,22px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {stages.map((s, i) => {
            const on = i < lit;
            const color = STAGE_COLOR[s.kind];
            const indent = s.kind === 'pass' ? 22 : 0;
            return (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 11,
                  marginLeft: indent,
                  opacity: on ? 1 : 0.16,
                  transform: on ? 'translateX(0)' : 'translateX(-6px)',
                  transition: 'opacity 0.25s, transform 0.25s',
                }}
              >
                <span style={{
                  width: 9,
                  height: 9,
                  flexShrink: 0,
                  background: on ? color : 'transparent',
                  border: `1px solid ${color}`,
                  display: 'inline-block',
                  transform: 'translateY(1px)',
                }} />
                <span style={{ color, fontSize: 12.5, minWidth: 148, flexShrink: 0 }}>{s.label}</span>
                <span style={{ color: 'var(--color-amber-dim)', fontSize: 11.5, lineHeight: 1.5 }}>{s.detail}</span>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 20,
          paddingTop: 15,
          borderTop: '1px solid var(--color-amber-deep)',
          fontSize: 12,
          color: 'var(--color-amber-dim)',
          lineHeight: 1.7,
        }}>
          {version === 'v1' ? (
            <>
              <strong style={{ color: 'var(--color-amber)' }}>The failure mode is drift.</strong> One prompt
              asked to cover security, correctness, performance, tests and style starts on security, wanders
              into naming, and somewhere in the middle invents a finding that belongs to neither.
            </>
          ) : (
            <>
              <strong style={{ color: 'var(--color-magenta)' }}>Depth beats breadth</strong> when breadth means
              drift. A pass told “you own security tenancy, nothing else” goes deep and rarely invents findings
              outside its lane — and a pass that crashes writes an empty file and exits 0, so one flaky
              reviewer never takes down a review.
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   4. PrsEvidenceGate — file a finding, watch the contract
      mechanically price your speculation.
───────────────────────────────────────────────────────── */

const SEVERITY_LADDER = ['NIT', 'MINOR', 'MAJOR', 'CRITICAL'] as const;
type Severity = typeof SEVERITY_LADDER[number];

function downgrade(s: Severity, steps: number): Severity {
  const i = SEVERITY_LADDER.indexOf(s);
  return SEVERITY_LADDER[Math.max(0, i - steps)];
}

interface Slot {
  key: 'evidence' | 'scenario' | 'blast' | 'fix';
  label: string;
  requirement: string;
  penalty: string;
}

const SLOTS: Slot[] = [
  {
    key: 'evidence',
    label: 'Evidence',
    requirement: '1–3 verbatim quoted lines. A “missing X” claim must state where it searched.',
    penalty: 'Cannot be filled → cannot be posted.',
  },
  {
    key: 'scenario',
    label: 'Failing scenario',
    requirement: 'A concrete input → wrong output, reproducible in about thirty seconds.',
    penalty: 'Severity downgraded one level, automatically.',
  },
  {
    key: 'blast',
    label: 'Blast radius',
    requirement: 'Who is affected · which flow · what triggers it. “Could cause issues” is banned.',
    penalty: 'Severity downgraded one level.',
  },
  {
    key: 'fix',
    label: 'Self-checked fix',
    requirement: 'Must not delete a guard or reintroduce the bug the PR is fixing.',
    penalty: 'Labelled directional, confidence capped at 0.5.',
  },
];

export function PrsEvidenceGate() {
  const [filled, setFilled] = useState<Record<Slot['key'], boolean>>({
    evidence: true, scenario: true, blast: true, fix: true,
  });
  const [unverifiable, setUnverifiable] = useState(false);

  // start from the finding as claimed
  let severity: Severity = 'MAJOR';
  let confidence = 0.85;
  let category = 'DATA';
  const notes: string[] = [];

  const blocked = !filled.evidence;

  if (!filled.scenario) { severity = downgrade(severity, 1); notes.push('No failing scenario → severity downgraded one level.'); }
  if (!filled.blast)    { severity = downgrade(severity, 1); notes.push('No blast radius → severity downgraded one level.'); }
  if (!filled.fix)      { confidence = Math.min(confidence, 0.5); notes.push('Fix not self-checked → labelled directional, confidence capped at 0.5.'); }
  if (unverifiable) {
    confidence = Math.min(confidence, 0.4);
    category = `UNVERIFIED_${category}`;
    notes.push('Premise depends on a symbol not in the input → rule 10: phrase as a question, cap confidence at 0.4, no fix that hard-codes the guess.');
  }

  const dropped = confidence < 0.3;

  return (
    <div style={BOX}>
      <div style={BAR}>
        <span style={TITLE}>File a finding — the contract prices it for you</span>
        <button
          onClick={() => { setFilled({ evidence: true, scenario: true, blast: true, fix: true }); setUnverifiable(false); }}
          style={BTN_GHOST}
        >↺ RESET</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {/* left: the slots */}
        <div style={{ padding: 'clamp(14px,4vw,20px)', borderRight: '1px solid var(--color-amber-deep)' }}>
          <div style={{ ...TITLE, marginBottom: 12 }}>Required body template</div>

          {SLOTS.map(slot => {
            const on = filled[slot.key];
            return (
              <button
                key={slot.key}
                onClick={() => setFilled(f => ({ ...f, [slot.key]: !f[slot.key] }))}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  marginBottom: 9,
                  padding: '9px 11px',
                  background: on ? 'var(--color-amber-sub)' : 'transparent',
                  border: `1px solid ${on ? 'var(--color-amber-dim)' : 'var(--color-amber-deep)'}`,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: on ? '#4ec9b0' : 'var(--color-magenta)', fontSize: 12 }}>
                    {on ? '✓' : '✗'}
                  </span>
                  <span style={{ color: on ? 'var(--color-amber)' : 'var(--color-amber-dim)', fontSize: 11.5, letterSpacing: '0.05em' }}>
                    {slot.label}
                  </span>
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--color-amber-dim)', marginTop: 4, lineHeight: 1.5, paddingLeft: 20 }}>
                  {on ? slot.requirement : slot.penalty}
                </div>
              </button>
            );
          })}

          <button
            onClick={() => setUnverifiable(u => !u)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              marginTop: 14,
              padding: '9px 11px',
              background: unverifiable ? 'var(--color-magenta-soft)' : 'transparent',
              border: `1px solid ${unverifiable ? 'var(--color-magenta)' : 'var(--color-amber-deep)'}`,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ color: unverifiable ? 'var(--color-magenta)' : 'var(--color-amber-dim)', fontSize: 12 }}>
                {unverifiable ? '◉' : '○'}
              </span>
              <span style={{ color: unverifiable ? 'var(--color-magenta)' : 'var(--color-amber-dim)', fontSize: 11.5 }}>
                Rule 10 — premise rests on a symbol I cannot see
              </span>
            </div>
          </button>
        </div>

        {/* right: what actually gets posted */}
        <div style={{ padding: 'clamp(14px,4vw,20px)', background: 'var(--color-bg2)' }}>
          <div style={{ ...TITLE, marginBottom: 12 }}>What reaches the pull request</div>

          {blocked ? (
            <div style={{
              border: '1px solid var(--color-magenta)',
              background: 'var(--color-magenta-soft)',
              padding: '14px 15px',
            }}>
              <div style={{ color: 'var(--color-magenta)', fontSize: 12, letterSpacing: '0.08em', marginBottom: 6 }}>
                ✗ NOT POSTED
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--color-amber-dim)', lineHeight: 1.6 }}>
                No evidence, no finding. A vague hunch cannot quote three verbatim lines, so it never
                becomes a comment in the first place — it either gets sharpened into something real or
                it dies here. That is the entire point.
              </div>
            </div>
          ) : (
            <>
              <div style={{
                border: `1px solid ${dropped ? 'var(--color-amber-deep)' : 'var(--color-amber-dim)'}`,
                padding: '12px 14px',
                opacity: dropped ? 0.45 : 1,
                transition: 'opacity 0.2s',
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                  <span style={{
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    padding: '2px 7px',
                    border: '1px solid var(--color-amber-deep)',
                    color: severity === 'MAJOR' || severity === 'CRITICAL' ? 'var(--color-magenta)' : 'var(--color-amber)',
                  }}>{severity}</span>
                  <span style={{ fontSize: 10, color: unverifiable ? 'var(--color-magenta)' : 'var(--color-amber-dim)' }}>
                    {category}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--color-amber-dim)', marginLeft: 'auto' }}>
                    confidence {confidence.toFixed(2)}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-amber-text)', lineHeight: 1.6 }}>
                  {unverifiable
                    ? 'Confirm `Report._id` is an ObjectId — if it is a String, this comparison is fine as written.'
                    : 'This switch handles three of the four Status members; an ARCHIVED report falls through and is excluded from the total.'}
                </div>
                {!filled.fix && (
                  <div style={{ fontSize: 10, color: 'var(--color-amber-dim)', marginTop: 8, fontStyle: 'italic' }}>
                    suggested fix — directional, not verified
                  </div>
                )}
              </div>

              {dropped && (
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--color-magenta)', lineHeight: 1.6 }}>
                  ✗ Below the pass&apos;s <code>confidence_min</code> floor — dropped in code before the merge
                  step ever sees it.
                </div>
              )}
            </>
          )}

          {notes.length > 0 && !blocked && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--color-amber-deep)' }}>
              <div style={{ ...TITLE, marginBottom: 8 }}>Penalties applied</div>
              {notes.map(n => (
                <div key={n} style={{ fontSize: 11, color: 'var(--color-amber-dim)', lineHeight: 1.6, marginBottom: 6, display: 'flex', gap: 7 }}>
                  <span style={{ color: 'var(--color-magenta)', flexShrink: 0 }}>→</span>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          )}

          {notes.length === 0 && !blocked && (
            <div style={{ marginTop: 14, fontSize: 11.5, color: '#4ec9b0', lineHeight: 1.6 }}>
              ✓ Every slot filled. Posted at full severity and confidence — because it earned it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
