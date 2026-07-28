'use client';

import { useState, useEffect, useRef, Fragment } from 'react';

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
   0. PrsV1Pipeline — the original three-pass reviewer, and
      the ceiling each pass ran into.
───────────────────────────────────────────────────────── */

interface V1Pass {
  name: string;
  job: string;
  sees: string;
  ceiling: string;
}

const V1_PASSES: V1Pass[] = [
  {
    name: 'Quick Scan',
    job: 'A fast, broad sweep for obvious problems.',
    sees: 'The diff. Roughly three lines of context around each changed line.',
    ceiling: 'Broad and shallow by construction. It catches what is visible on the changed line itself — and almost nothing that depends on knowing what the surrounding code actually is.',
  },
  {
    name: 'Deep Review',
    job: 'A slower, more careful read: security, correctness, performance, tests, style.',
    sees: 'The same diff. Nothing more.',
    ceiling: 'Five concerns in one prompt means it drifts — starts on security, wanders into naming. And with no schema, no enum members and no base class in front of it, its most valuable observations were guesses it stated as facts.',
  },
  {
    name: 'Cross-File',
    job: 'How the changed files connect to each other.',
    sees: 'Only the files inside this diff.',
    ceiling: 'The name promises a repo-wide view; the input is just the changed files. It cannot tell you who *else* in the codebase calls the function you changed, because that caller was never in the prompt.',
  },
];

export function PrsV1Pipeline() {
  const [sel, setSel] = useState(0);
  const p = V1_PASSES[sel];

  return (
    <div style={BOX}>
      <div style={BAR}>
        <span style={TITLE}>v1 — three passes, in sequence</span>
        <span style={{ ...TITLE, color: 'var(--color-amber-dim)' }}>click a pass</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', padding: 'clamp(16px,4vw,24px) clamp(13px,4vw,20px)', gap: 4, flexWrap: 'wrap' }}>
        {V1_PASSES.map((pass, i) => (
          <Fragment key={pass.name}>
            <button
              onClick={() => setSel(i)}
              style={{
                flex: '1 1 90px',
                padding: '13px 8px',
                background: sel === i ? 'var(--color-amber)' : 'transparent',
                color: sel === i ? '#000' : 'var(--color-amber-dim)',
                border: `1px solid ${sel === i ? 'var(--color-amber)' : 'var(--color-amber-deep)'}`,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: sel === i ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {pass.name}
            </button>
            {i < V1_PASSES.length - 1 && (
              <span style={{ color: 'var(--color-amber-deep)', fontSize: 13, flexShrink: 0 }}>→</span>
            )}
          </Fragment>
        ))}
      </div>

      <div style={{ padding: '0 clamp(13px,4vw,20px) clamp(16px,4vw,22px)' }}>
        <div style={{ fontSize: 12.5, color: 'var(--color-amber-text)', lineHeight: 1.7, marginBottom: 14 }}>
          {p.job}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px,1fr))', gap: 12 }}>
          <div style={{ border: '1px solid var(--color-amber-deep)', padding: '11px 13px' }}>
            <div style={{ ...TITLE, color: '#4ec9b0', marginBottom: 7 }}>What it could see</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-amber-dim)', lineHeight: 1.65 }}>{p.sees}</div>
          </div>
          <div style={{ border: '1px solid var(--color-magenta)', background: 'var(--color-magenta-soft)', padding: '11px 13px' }}>
            <div style={{ ...TITLE, color: 'var(--color-magenta)', marginBottom: 7 }}>Where it hit a ceiling</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-amber-dim)', lineHeight: 1.65 }}>{p.ceiling}</div>
          </div>
        </div>

        <div style={{
          marginTop: 15,
          paddingTop: 13,
          borderTop: '1px solid var(--color-amber-deep)',
          fontSize: 11.5,
          color: 'var(--color-amber-dim)',
          lineHeight: 1.7,
        }}>
          All three passes read the same narrow window. Stacking more prompts on the same input
          gets you more <em>opinions</em> — not more <em>information</em>.
        </div>
      </div>
    </div>
  );
}

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

            <div style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop: '1px solid var(--color-amber-deep)',
              textAlign: 'left',
            }}>
              <div style={{ ...TITLE, color: 'var(--color-magenta)', marginBottom: 8 }}>
                And the half this number cannot see
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-amber-dim)', lineHeight: 1.7 }}>
                A precision audit only grades the comments the reviewer <em>did</em> write. It is
                structurally blind to the ones it should have written and didn&apos;t — the real bug
                three files away that nobody was ever told about. On a typical PR the bot left a
                handful of comments where a careful human would have left more, and no amount of
                re-scoring the existing ones would have surfaced that.
              </div>
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
   2b. PrsRepoManifest — one engine, four codebases, four
       sets of house rules. The repo owns its own config.
───────────────────────────────────────────────────────── */

interface RepoPass {
  slug: string;
  floor: string;
  minConf: number;
}

interface RepoConfig {
  key: string;
  label: string;
  lang: string;
  color: string;
  passes: RepoPass[];
  rules: string[];
}

const REPOS: RepoConfig[] = [
  {
    key: 'backend', label: 'Backend', lang: 'Node.js', color: '#4ec9b0',
    passes: [
      { slug: 'security_tenancy', floor: 'MINOR', minConf: 0.3 },
      { slug: 'data_layer', floor: 'MINOR', minConf: 0.3 },
      { slug: 'performance_async', floor: 'MAJOR', minConf: 0.5 },
      { slug: 'testing_hygiene', floor: 'MINOR', minConf: 0.4 },
      { slug: 'conventions_arch', floor: 'MINOR', minConf: 0.4 },
    ],
    rules: [
      'Handlers must return through the shared response wrapper — never the bare object.',
      'Write paths run inside the transaction discipline the repo defines; a bare write is the bug, not the wrapper.',
      'Request scoping is derived, never taken from client input. Code that re-derives it is correct by design.',
    ],
  },
  {
    key: 'web', label: 'Web', lang: 'React / TypeScript', color: '#569cd6',
    passes: [
      { slug: 'security_tenancy', floor: 'MAJOR', minConf: 0.5 },
      { slug: 'performance_async', floor: 'MINOR', minConf: 0.3 },
      { slug: 'testing_hygiene', floor: 'MINOR', minConf: 0.4 },
      { slug: 'conventions_arch', floor: 'MINOR', minConf: 0.3 },
    ],
    rules: [
      'Shared component primitives are mandated over hand-rolled equivalents.',
      'Data fetching goes through the established client layer, not ad-hoc calls in components.',
    ],
  },
  {
    key: 'android', label: 'Android', lang: 'Kotlin', color: '#dcdcaa',
    passes: [
      { slug: 'architecture_layering', floor: 'MAJOR', minConf: 0.5 },
      { slug: 'performance_async', floor: 'MINOR', minConf: 0.4 },
      { slug: 'testing_hygiene', floor: 'MINOR', minConf: 0.4 },
      { slug: 'conventions_arch', floor: 'MINOR', minConf: 0.3 },
    ],
    rules: [
      'MVVM / Clean layering is mandated — a ViewModel reaching past its layer is the finding, not the abstraction.',
      'Dependency injection follows the repo idiom; manual construction in a screen is the exception worth flagging.',
    ],
  },
  {
    key: 'ios', label: 'iOS', lang: 'Swift', color: '#ce9178',
    passes: [
      { slug: 'architecture_layering', floor: 'MAJOR', minConf: 0.5 },
      { slug: 'performance_async', floor: 'MINOR', minConf: 0.4 },
      { slug: 'conventions_arch', floor: 'MINOR', minConf: 0.3 },
    ],
    rules: [
      'Model decoding goes through the declared coding keys; a hand-written parser is worth a comment.',
      'Concurrency follows the repo\'s structured pattern rather than ad-hoc dispatch.',
    ],
  },
];

export function PrsRepoManifest() {
  const [sel, setSel] = useState('backend');
  const repo = REPOS.find(r => r.key === sel)!;

  return (
    <div style={BOX}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-amber-deep)', flexWrap: 'wrap' }}>
        {REPOS.map(r => {
          const active = sel === r.key;
          return (
            <button
              key={r.key}
              onClick={() => setSel(r.key)}
              style={{
                flex: '1 1 80px',
                padding: '10px 8px',
                background: active ? 'var(--color-bg)' : 'var(--color-bg2)',
                border: 'none',
                borderBottom: active ? `2px solid ${r.color}` : '2px solid transparent',
                color: active ? r.color : 'var(--color-amber-dim)',
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                letterSpacing: '0.07em',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.15s',
              }}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '10px clamp(13px,4vw,20px)', borderBottom: '1px solid var(--color-amber-deep)', fontSize: 10.5, color: 'var(--color-amber-dim)' }}>
        <span style={{ color: repo.color }}>{repo.lang}</span>
        {' · '}the shared Action is stack-agnostic; this manifest lives in the repo
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(255px,1fr))' }}>
        <div style={{ padding: 'clamp(13px,4vw,18px)', borderRight: '1px solid var(--color-amber-deep)' }}>
          <div style={{ ...TITLE, marginBottom: 11 }}>Passes this repo runs</div>
          {repo.passes.map(p => (
            <div key={p.slug} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 0',
              borderBottom: '1px solid rgba(58,37,8,0.45)',
              fontSize: 11,
            }}>
              <span style={{ color: 'var(--color-amber-text)', flex: 1, minWidth: 0, wordBreak: 'break-word' }}>{p.slug}</span>
              <span style={{ color: 'var(--color-amber-dim)', fontSize: 9.5, flexShrink: 0 }}>≥{p.floor}</span>
              <span style={{ color: 'var(--color-magenta)', fontSize: 9.5, flexShrink: 0 }}>conf {p.minConf}</span>
            </div>
          ))}
          <div style={{ fontSize: 10, color: 'var(--color-amber-dim)', marginTop: 10, lineHeight: 1.6, fontStyle: 'italic' }}>
            Both thresholds are enforced in code after the model answers — findings below either are
            dropped before the merge step sees them.
          </div>
        </div>

        <div style={{ padding: 'clamp(13px,4vw,18px)', background: 'var(--color-bg2)' }}>
          <div style={{ ...TITLE, marginBottom: 11 }}>House rules — mandated, never a bug</div>
          {repo.rules.map(r => (
            <div key={r} style={{ display: 'flex', gap: 9, marginBottom: 11, fontSize: 11.5, lineHeight: 1.65 }}>
              <span style={{ color: repo.color, flexShrink: 0 }}>§</span>
              <span style={{ color: 'var(--color-amber-dim)' }}>{r}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        borderTop: '1px solid var(--color-amber-deep)',
        padding: 'clamp(12px,3vw,15px) clamp(13px,4vw,20px)',
        fontSize: 11.5,
        color: 'var(--color-amber-dim)',
        lineHeight: 1.7,
      }}>
        Same engine, four different definitions of “correct”. A pattern that is a finding in one repo is
        <strong style={{ color: 'var(--color-amber)' }}> mandated</strong> in another — which is why the rules
        cannot live in the reviewer. They have to live next to the code they describe.
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

/* ─────────────────────────────────────────────────────────
   5. PrsContextLens — the same bug, three states of context.

   Shows why "authoritative context" is only sound when code
   guarantees the block is whole: absent degrades safely, torn
   does not.
───────────────────────────────────────────────────────── */

type LensState = 'absent' | 'complete' | 'torn';

const LENS_TABS: { key: LensState; label: string }[] = [
  { key: 'absent', label: 'No definitions' },
  { key: 'complete', label: 'Complete block' },
  { key: 'torn', label: 'Torn block' },
];

const LENS_BLOCKS: Record<LensState, string> = {
  absent: '(nothing injected — the pass sees only the diff)',
  complete: `## REFERENCED DEFINITIONS

### enum Status
  DRAFT
  ACTIVE
  ARCHIVED
  DELETED`,
  torn: `## REFERENCED DEFINITIONS

### enum Status
  DRAFT
  ACTIVE`,
};

export function PrsContextLens() {
  const [state, setState] = useState<LensState>('absent');

  const finding: Record<LensState, {
    severity: string; category: string; conf: string; body: string;
    tone: string; verdict: string; verdictColor: string; note: string;
  }> = {
    absent: {
      severity: 'MINOR', category: 'UNVERIFIED_DATA', conf: '0.40',
      body: 'I think an ARCHIVED record might be skipped here, but I cannot see the list of possible states, so I am not sure. Please double-check.',
      tone: 'var(--color-amber-dim)',
      verdict: 'SAFE — but easy to ignore',
      verdictColor: 'var(--color-amber)',
      note: 'Rule 10 doing its job. The reviewer is honest about the limit of what it can see, so it hedges. Nothing false gets said — but a capped-confidence question is the kind of comment engineers scroll past.',
    },
    complete: {
      severity: 'MAJOR', category: 'DATA', conf: '0.85',
      body: 'Status has four members — DRAFT, ACTIVE, ARCHIVED, DELETED. This switch handles three; an ARCHIVED record falls through and is left out of the total.',
      tone: 'var(--color-amber-text)',
      verdict: 'CORRECT — and checkable in thirty seconds',
      verdictColor: '#4ec9b0',
      note: 'Same bug, same model. The only difference is that it was allowed to know one enum. Because the block is shown and complete, the prompt lifts the hedge for symbols inside it — assert normally, the ground truth is right there.',
    },
    torn: {
      severity: 'MAJOR', category: 'DATA', conf: '0.85',
      body: 'Status has two members — DRAFT and ACTIVE. This switch handles a DELETED case that is not a valid member of the enum. Remove the dead branch.',
      tone: 'var(--color-magenta)',
      verdict: 'CONFIDENTLY WRONG — with a stamp of authority',
      verdictColor: 'var(--color-magenta)',
      note: 'The extractor crashed halfway and handed over a half-written enum. The model followed instructions correctly — the block said authoritative, so it asserted. This is the exact noise the feature exists to kill, now wearing a badge. Absent is safe. Torn is not.',
    },
  };

  const f = finding[state];

  return (
    <div style={BOX}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-amber-deep)' }}>
        {LENS_TABS.map(t => {
          const active = state === t.key;
          const color = t.key === 'torn' ? 'var(--color-magenta)' : t.key === 'complete' ? '#4ec9b0' : 'var(--color-amber)';
          return (
            <button
              key={t.key}
              onClick={() => setState(t.key)}
              style={{
                flex: 1,
                padding: '10px 8px',
                background: active ? 'var(--color-bg)' : 'var(--color-bg2)',
                border: 'none',
                borderBottom: active ? `2px solid ${color}` : '2px solid transparent',
                color: active ? color : 'var(--color-amber-dim)',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.07em',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div style={{ padding: 'clamp(13px,4vw,18px)', borderRight: '1px solid var(--color-amber-deep)', background: 'var(--color-bg2)' }}>
          <div style={{ ...TITLE, marginBottom: 10 }}>Injected into the prompt</div>
          <pre style={{
            margin: 0,
            fontSize: 11,
            lineHeight: 1.65,
            color: state === 'torn' ? 'var(--color-magenta)' : state === 'absent' ? 'var(--color-amber-dim)' : '#4ec9b0',
            whiteSpace: 'pre-wrap',
            fontFamily: 'var(--font-mono)',
          }}>{LENS_BLOCKS[state]}</pre>
          {state === 'torn' && (
            <div style={{ marginTop: 10, fontSize: 10.5, color: 'var(--color-magenta)', lineHeight: 1.55 }}>
              ⚠ truncated mid-enum — but still labelled authoritative
            </div>
          )}
        </div>

        <div style={{ padding: 'clamp(13px,4vw,18px)' }}>
          <div style={{ ...TITLE, marginBottom: 10 }}>What the pass emits</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 9 }}>
            <span style={{ fontSize: 10, padding: '2px 7px', border: '1px solid var(--color-amber-deep)', color: f.tone }}>{f.severity}</span>
            <span style={{ fontSize: 10, color: f.tone }}>{f.category}</span>
            <span style={{ fontSize: 10, color: 'var(--color-amber-dim)', marginLeft: 'auto' }}>confidence {f.conf}</span>
          </div>
          <div style={{ fontSize: 12.5, color: f.tone, lineHeight: 1.65, borderLeft: `3px solid ${f.verdictColor}`, paddingLeft: 12 }}>
            {f.body}
          </div>
          <div style={{ marginTop: 12, fontSize: 10.5, letterSpacing: '0.08em', color: f.verdictColor }}>
            {f.verdict}
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid var(--color-amber-deep)',
        padding: 'clamp(12px,3vw,16px) clamp(13px,4vw,20px)',
        fontSize: 12,
        color: 'var(--color-amber-dim)',
        lineHeight: 1.7,
      }}>
        {f.note}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   6. PrsSymbolMap — store the simple facts, derive the view.
───────────────────────────────────────────────────────── */

interface FileRow {
  path: string;
  definitions: { name: string; kind: string; line: number }[];
  refs: { name: string; line: number }[];
}

const FILE_ROWS: FileRow[] = [
  {
    path: 'services/total.js',
    definitions: [{ name: 'computeTotal', kind: 'function', line: 2 }],
    refs: [{ name: 'Order', line: 2 }],
  },
  {
    path: 'routes/api.js',
    definitions: [{ name: 'handleCheckout', kind: 'function', line: 8 }],
    refs: [{ name: 'computeTotal', line: 11 }, { name: 'Order', line: 9 }],
  },
  {
    path: 'models/order.js',
    definitions: [{ name: 'Order', kind: 'class', line: 4 }],
    refs: [],
  },
];

const ALL_SYMBOLS = ['computeTotal', 'Order', 'handleCheckout'];

export function PrsSymbolMap() {
  const [selected, setSelected] = useState<string | null>('computeTotal');

  // the reverse index is DERIVED at read time — never stored
  const reverseIndex: Record<string, string[]> = {};
  for (const row of FILE_ROWS) {
    for (const r of row.refs) {
      (reverseIndex[r.name] ||= []).push(row.path);
    }
  }

  const dependents = selected ? reverseIndex[selected] ?? [] : [];
  const definedIn = selected
    ? FILE_ROWS.find(r => r.definitions.some(d => d.name === selected))?.path
    : null;

  return (
    <div style={BOX}>
      <div style={BAR}>
        <span style={TITLE}>Symbol map — pick a symbol the PR changed</span>
      </div>

      <div style={{ padding: 'clamp(13px,4vw,18px)', borderBottom: '1px solid var(--color-amber-deep)', display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {ALL_SYMBOLS.map(s => {
          const active = selected === s;
          return (
            <button
              key={s}
              onClick={() => setSelected(s)}
              style={{
                padding: '5px 12px',
                background: active ? 'var(--color-amber)' : 'transparent',
                color: active ? '#000' : 'var(--color-amber-dim)',
                border: `1px solid ${active ? 'var(--color-amber)' : 'var(--color-amber-deep)'}`,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                cursor: 'pointer',
                fontWeight: active ? 700 : 400,
                transition: 'all 0.15s',
              }}
            >
              {s}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {/* stored */}
        <div style={{ padding: 'clamp(13px,4vw,18px)', borderRight: '1px solid var(--color-amber-deep)' }}>
          <div style={{ ...TITLE, marginBottom: 4 }}>Stored — one row per file, per commit</div>
          <div style={{ fontSize: 10, color: 'var(--color-amber-dim)', marginBottom: 12, fontStyle: 'italic' }}>
            self-contained: re-parse a file, overwrite its one row
          </div>

          {FILE_ROWS.map(row => {
            const touches = selected
              ? row.refs.some(r => r.name === selected) || row.definitions.some(d => d.name === selected)
              : false;
            return (
              <div
                key={row.path}
                style={{
                  border: `1px solid ${touches ? 'var(--color-amber-dim)' : 'var(--color-amber-deep)'}`,
                  background: touches ? 'var(--color-amber-sub)' : 'transparent',
                  padding: '9px 11px',
                  marginBottom: 8,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 11.5, color: touches ? 'var(--color-amber)' : 'var(--color-amber-dim)', marginBottom: 5 }}>
                  {row.path}
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-amber-dim)', lineHeight: 1.7 }}>
                  <span style={{ color: '#4ec9b0' }}>defines</span>{' '}
                  {row.definitions.length
                    ? row.definitions.map(d => `${d.name}:${d.kind}`).join(', ')
                    : '—'}
                  <br />
                  <span style={{ color: '#569cd6' }}>refs</span>{' '}
                  {row.refs.length ? row.refs.map(r => r.name).join(', ') : '—'}
                </div>
              </div>
            );
          })}
        </div>

        {/* derived */}
        <div style={{ padding: 'clamp(13px,4vw,18px)', background: 'var(--color-bg2)' }}>
          <div style={{ ...TITLE, marginBottom: 4 }}>Derived at read time — never stored</div>
          <div style={{ fontSize: 10, color: 'var(--color-amber-dim)', marginBottom: 12, fontStyle: 'italic' }}>
            rebuilt from the rows, so it cannot drift out of sync
          </div>

          {selected && (
            <>
              <pre style={{
                margin: 0,
                fontSize: 11,
                lineHeight: 1.7,
                color: 'var(--color-amber-text)',
                whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font-mono)',
              }}>{`{ "${selected}": {\n    "referenced_in": [${dependents.map(d => `\n      "${d}"`).join(',')}${dependents.length ? '\n    ' : ''}]\n} }`}</pre>

              <div style={{ marginTop: 16, paddingTop: 13, borderTop: '1px solid var(--color-amber-deep)', fontSize: 11.5, color: 'var(--color-amber-dim)', lineHeight: 1.7 }}>
                {definedIn && (
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ color: '#4ec9b0' }}>defined in</span> {definedIn}
                  </div>
                )}
                {dependents.length > 0 ? (
                  <div style={{ color: 'var(--color-amber-text)' }}>
                    Change <code style={{ color: 'var(--color-amber)' }}>{selected}</code> and the cross-file
                    pass gets told: <em>{dependents.join(', ')} {dependents.length > 1 ? 'call' : 'calls'} it and
                    may still expect the old shape.</em>
                  </div>
                ) : (
                  <div>Nothing else in the repo references this symbol — a change here is contained.</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{
        borderTop: '1px solid var(--color-amber-deep)',
        padding: 'clamp(12px,3vw,15px) clamp(13px,4vw,20px)',
        display: 'flex',
        gap: 26,
        flexWrap: 'wrap',
        fontSize: 11,
      }}>
        <div>
          <span style={{ color: 'var(--color-magenta)' }}>grep the whole repo</span>
          <span style={{ color: 'var(--color-amber-dim)' }}> — O(N) per symbol, per review</span>
        </div>
        <div>
          <span style={{ color: '#4ec9b0' }}>dictionary lookup</span>
          <span style={{ color: 'var(--color-amber-dim)' }}> — O(1)</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   6b. PrsOrchestrator — a cheap model proposes, deterministic
       code constrains. Triage can make a review cheaper; it
       can never make a money-path review shallower.
───────────────────────────────────────────────────────── */

const ALL_PASSES = [
  'quick_scan', 'security_tenancy', 'data_layer', 'performance_async',
  'testing_hygiene', 'conventions_arch', 'deep_review', 'cross_file',
];

interface Scenario {
  key: string;
  label: string;
  proposed: string[];
  /** passes code force-adds regardless of what triage said */
  forced: string[];
  rule: string | null;
  note: string;
}

const SCENARIOS: Scenario[] = [
  {
    key: 'docs', label: 'README / docs only',
    proposed: ['quick_scan', 'conventions_arch'],
    forced: [],
    rule: null,
    note: 'Nothing here can break auth, corrupt data or leak money. Triage skips the passes that would only generate noise, and code has no reason to object.',
  },
  {
    key: 'css', label: 'CSS tweak',
    proposed: ['quick_scan', 'conventions_arch', 'performance_async'],
    forced: [],
    rule: null,
    note: 'A data-layer pass on a stylesheet produces confident opinions about nothing. Skipped.',
  },
  {
    key: 'auth', label: 'Auth middleware change',
    proposed: ['quick_scan', 'conventions_arch'],
    forced: ['security_tenancy', 'data_layer', 'deep_review'],
    rule: 'Auth path → security + data + deep, always.',
    note: 'Triage looked at a small diff and proposed a cheap review. Code overruled it. This is the case the whole design exists for — the model\'s judgment is an input to the decision, never the decision.',
  },
  {
    key: 'migration', label: 'DB migration',
    proposed: ['quick_scan', 'data_layer'],
    forced: ['security_tenancy', 'deep_review', 'cross_file'],
    rule: 'Migration path → security + data + deep, always.',
    note: 'Migrations are irreversible in a way most code is not. The floor here is not negotiable by a cheap model reading a diff.',
  },
  {
    key: 'large', label: 'Large diff',
    proposed: ['quick_scan', 'conventions_arch'],
    forced: ALL_PASSES,
    rule: 'Diff over the size threshold → full review.',
    note: 'Above a certain size, triage is guessing about too much surface area. The fallback is everything.',
  },
  {
    key: 'error', label: 'Triage itself errored',
    proposed: [],
    forced: ALL_PASSES,
    rule: 'Any triage error → full review.',
    note: 'The orchestrator failing is never allowed to mean "nothing to review here". An unavailable opinion falls back to the expensive, safe answer — not the cheap one.',
  },
];

export function PrsOrchestrator() {
  const [sel, setSel] = useState('docs');
  const s = SCENARIOS.find(x => x.key === sel)!;

  const final = ALL_PASSES.filter(
    p => p === 'quick_scan' || s.proposed.includes(p) || s.forced.includes(p)
  );

  return (
    <div style={BOX}>
      <div style={BAR}>
        <span style={TITLE}>Orchestrator — pick what landed in the PR</span>
        <span style={{ ...TITLE, color: 'var(--color-amber)' }}>{final.length} / {ALL_PASSES.length} passes</span>
      </div>

      <div style={{ padding: 'clamp(12px,3vw,16px) clamp(13px,4vw,18px)', borderBottom: '1px solid var(--color-amber-deep)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {SCENARIOS.map(x => {
          const active = sel === x.key;
          return (
            <button
              key={x.key}
              onClick={() => setSel(x.key)}
              style={{
                padding: '5px 11px',
                background: active ? 'var(--color-amber)' : 'transparent',
                color: active ? '#000' : 'var(--color-amber-dim)',
                border: `1px solid ${active ? 'var(--color-amber)' : 'var(--color-amber-deep)'}`,
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                cursor: 'pointer',
                fontWeight: active ? 700 : 400,
                transition: 'all 0.15s',
              }}
            >
              {x.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 'clamp(14px,4vw,20px)' }}>
        {/* pass grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 6, marginBottom: 16 }}>
          {ALL_PASSES.map(p => {
            const isForced = s.forced.includes(p);
            const isProposed = s.proposed.includes(p);
            const isAlways = p === 'quick_scan';
            const on = isForced || isProposed || isAlways;

            const color = isForced ? 'var(--color-magenta)' : on ? '#4ec9b0' : 'var(--color-amber-deep)';
            return (
              <div key={p} style={{
                border: `1px solid ${on ? color : 'var(--color-amber-deep)'}`,
                background: isForced ? 'var(--color-magenta-soft)' : on ? 'rgba(78,201,176,0.07)' : 'transparent',
                padding: '7px 9px',
                opacity: on ? 1 : 0.4,
                transition: 'all 0.18s',
              }}>
                <div style={{ fontSize: 10.5, color: on ? color : 'var(--color-amber-dim)', wordBreak: 'break-word' }}>
                  {p}
                </div>
                <div style={{ fontSize: 8.5, color: 'var(--color-amber-dim)', marginTop: 3, letterSpacing: '0.05em' }}>
                  {isForced ? 'FORCED BY CODE' : isAlways ? 'ALWAYS RUNS' : isProposed ? 'triage chose' : 'skipped'}
                </div>
              </div>
            );
          })}
        </div>

        {s.rule && (
          <div style={{
            border: '1px solid var(--color-magenta)',
            background: 'var(--color-magenta-soft)',
            padding: '10px 13px',
            marginBottom: 14,
          }}>
            <div style={{ ...TITLE, color: 'var(--color-magenta)', marginBottom: 5 }}>Code-enforced floor</div>
            <div style={{ fontSize: 12, color: 'var(--color-amber-text)' }}>{s.rule}</div>
          </div>
        )}

        <div style={{ fontSize: 12, color: 'var(--color-amber-dim)', lineHeight: 1.75 }}>{s.note}</div>
      </div>

      <div style={{
        borderTop: '1px solid var(--color-amber-deep)',
        padding: 'clamp(12px,3vw,15px) clamp(13px,4vw,20px)',
        fontSize: 11.5,
        color: 'var(--color-amber-dim)',
        lineHeight: 1.7,
      }}>
        <strong style={{ color: 'var(--color-amber)' }}>Let a cheap model propose. Let deterministic code
        constrain.</strong> Triage can make a review cheaper. It can never make a money-path review shallower.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   7. PrsCostLedger — the real per-pass ledger PRS posts on
      every review. Figures are from an actual PR.
───────────────────────────────────────────────────────── */

interface LedgerRow {
  pass: string;
  tier: 'strong' | 'cheap';
  input: number;
  cached: number;
  output: number;
  cost: number;
  why: string;
}

const LEDGER: LedgerRow[] = [
  { pass: 'Deep Review', tier: 'strong', input: 8851, cached: 0, output: 279, cost: 0.0263,
    why: 'The one pass where extra reasoning genuinely changes which findings come out. Worth the strong model; it is also the pass that used to rubber-stamp, so it runs at forced high effort.' },
  { pass: 'Cross-File', tier: 'strong', input: 5921, cached: 0, output: 27, cost: 0.0152,
    why: 'Reasons over the symbol map from Part 3 — "you changed this, here is who depends on it." Relational reasoning, so it stays on the strong model.' },
  { pass: 'Security · Tenancy', tier: 'cheap', input: 11136, cached: 0, output: 554, cost: 0.0145,
    why: 'A breadth pass with a tight, well-specified lane. The rules-of-evidence contract does the precision work here, not the model tier — so the cheap model is enough.' },
  { pass: 'Conventions · Arch', tier: 'cheap', input: 10147, cached: 0, output: 87, cost: 0.0107,
    why: 'Checks the diff against the repo\'s written conventions. Pattern matching against supplied rules — exactly what a cheap model is good at.' },
  { pass: 'Testing · Hygiene', tier: 'cheap', input: 8835, cached: 0, output: 91, cost: 0.0094,
    why: 'Breadth pass. Note the output token count — focused passes that find nothing are cheap, which is what makes running ten of them affordable.' },
  { pass: 'Quick Scan', tier: 'cheap', input: 8576, cached: 0, output: 85, cost: 0.0091,
    why: 'Always runs, no matter what triage decides. The one pass that can never be skipped, so it had better be cheap.' },
];

const LEDGER_TOTAL = { input: 53466, cached: 0, output: 1123, cost: 0.0851 };

export function PrsCostLedger() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div style={BOX}>
      <div style={BAR}>
        <span style={TITLE}>Per-pass cost ledger — posted on every review</span>
        <span style={{ ...TITLE, color: 'var(--color-amber-dim)' }}>click a row</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, minWidth: 460 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-amber-deep)' }}>
              {['Pass', 'Model', 'Input', 'Cached', 'Output', 'Cost'].map((h, i) => (
                <th key={h} style={{
                  textAlign: i >= 2 ? 'right' : 'left',
                  padding: '8px 12px',
                  color: 'var(--color-amber-dim)',
                  fontWeight: 400,
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LEDGER.map(row => {
              const isOpen = open === row.pass;
              return (
                <Fragment key={row.pass}>
                  <tr
                    onClick={() => setOpen(isOpen ? null : row.pass)}
                    style={{
                      cursor: 'pointer',
                      background: isOpen ? 'var(--color-amber-sub)' : 'transparent',
                      borderBottom: '1px solid rgba(58,37,8,0.5)',
                    }}
                  >
                    <td style={{ padding: '8px 12px', color: 'var(--color-amber-text)', whiteSpace: 'nowrap' }}>
                      <span style={{ color: 'var(--color-amber-dim)', marginRight: 7 }}>{isOpen ? '▾' : '▸'}</span>
                      {row.pass}
                    </td>
                    <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        color: row.tier === 'strong' ? 'var(--color-magenta)' : '#4ec9b0',
                        fontSize: 10,
                        border: `1px solid ${row.tier === 'strong' ? 'var(--color-magenta)' : '#4ec9b0'}`,
                        padding: '1px 6px',
                      }}>{row.tier}-tier</span>
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--color-amber-dim)', fontVariantNumeric: 'tabular-nums' }}>{row.input.toLocaleString()}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--color-magenta)', fontVariantNumeric: 'tabular-nums' }}>{row.cached}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--color-amber-dim)', fontVariantNumeric: 'tabular-nums' }}>{row.output}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--color-amber)', fontVariantNumeric: 'tabular-nums' }}>${row.cost.toFixed(4)}</td>
                  </tr>
                  {isOpen && (
                    <tr>
                      <td colSpan={6} style={{
                        padding: '2px 12px 14px 30px',
                        color: 'var(--color-amber-dim)',
                        fontSize: 11.5,
                        lineHeight: 1.7,
                        background: 'var(--color-amber-sub)',
                        borderBottom: '1px solid rgba(58,37,8,0.5)',
                      }}>{row.why}</td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            <tr style={{ borderTop: '1px solid var(--color-amber-deep)' }}>
              <td style={{ padding: '10px 12px', color: 'var(--color-amber)', fontWeight: 700 }}>Total</td>
              <td />
              <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--color-amber)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{LEDGER_TOTAL.input.toLocaleString()}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--color-magenta)', fontWeight: 700 }}>{LEDGER_TOTAL.cached}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--color-amber)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{LEDGER_TOTAL.output.toLocaleString()}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--color-amber)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>${LEDGER_TOTAL.cost.toFixed(4)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{
        borderTop: '1px solid var(--color-amber-deep)',
        padding: 'clamp(13px,3vw,16px) clamp(13px,4vw,20px)',
        fontSize: 11.5,
        color: 'var(--color-amber-dim)',
        lineHeight: 1.75,
      }}>
        Two levers are visible right in this table. The{' '}
        <strong style={{ color: 'var(--color-amber)' }}>model column</strong> is the first — two deep passes on
        the strong tier, four breadth passes on the cheap one. And the{' '}
        <strong style={{ color: 'var(--color-magenta)' }}>cached column reads 0</strong> because this was a first
        review; on a re-review most of that input arrives at roughly a tenth of the price.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   8. PrsPromptOrder — the prompt-prefix cache, reorderable.

   The provider discounts the longest UNCHANGED prefix of a
   request. So the cache survives only up to the first block
   that changes between pushes. Move the diff up and watch the
   discount evaporate.
───────────────────────────────────────────────────────── */

interface PromptBlock {
  id: string;
  label: string;
  note: string;
  /** does this block change between pushes on the same PR? */
  volatile: boolean;
  /** illustrative share of the prompt, for the proportion bar */
  share: number;
}

const CANONICAL_ORDER: PromptBlock[] = [
  { id: 'rules',   label: 'parameter prompt + base rules', note: 'identical per slug, every PR — the anchor', volatile: false, share: 22 },
  { id: 'ctx',     label: 'PR context',                    note: 'stable across a PR\'s pushes',              volatile: false, share: 14 },
  { id: 'learn',   label: 'learnings (semantic re-rank)',  note: 'can shift between pushes',                  volatile: true,  share: 8 },
  { id: 'prior',   label: 'prior findings',                note: 'accumulate each run',                       volatile: true,  share: 6 },
  { id: 'refdefs', label: '## REFERENCED DEFINITIONS',     note: 'per-PR (Part 3)',                           volatile: false, share: 10 },
  { id: 'diff',    label: 'the diff',                      note: 'largest, and changes every single push',    volatile: true,  share: 40 },
];

export function PrsPromptOrder() {
  const [order, setOrder] = useState<PromptBlock[]>(CANONICAL_ORDER);

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  }

  // cache survives from the top until the first volatile block
  const firstVolatile = order.findIndex(b => b.volatile);
  const cachedCount = firstVolatile === -1 ? order.length : firstVolatile;
  const cachedShare = order.slice(0, cachedCount).reduce((a, b) => a + b.share, 0);

  const isCanonical = order.map(o => o.id).join() === CANONICAL_ORDER.map(o => o.id).join();

  return (
    <div style={BOX}>
      <div style={BAR}>
        <span style={TITLE}>Prompt order — the cached prefix</span>
        <button onClick={() => setOrder(CANONICAL_ORDER)} style={BTN_GHOST}>↺ SHIPPED ORDER</button>
      </div>

      <div style={{ padding: 'clamp(13px,4vw,18px)' }}>
        {order.map((b, i) => {
          const cached = i < cachedCount;
          return (
            <div
              key={b.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 11px',
                marginBottom: 6,
                border: `1px solid ${cached ? '#4ec9b0' : 'var(--color-amber-deep)'}`,
                background: cached ? 'rgba(78,201,176,0.07)' : 'transparent',
                transition: 'all 0.18s',
              }}
            >
              <span style={{ fontSize: 10, color: 'var(--color-amber-dim)', width: 16, flexShrink: 0 }}>
                {i + 1}.
              </span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, color: cached ? '#4ec9b0' : 'var(--color-amber-text)' }}>
                  {b.label}
                  {b.volatile && (
                    <span style={{ color: 'var(--color-magenta)', fontSize: 9.5, marginLeft: 8, letterSpacing: '0.06em' }}>
                      CHANGES PER PUSH
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-amber-dim)', marginTop: 2 }}>{b.note}</div>
              </div>

              <span style={{
                fontSize: 9.5,
                letterSpacing: '0.06em',
                color: cached ? '#4ec9b0' : 'var(--color-amber-dim)',
                flexShrink: 0,
                width: 62,
                textAlign: 'right',
              }}>
                {cached ? '~90% OFF' : 'full price'}
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                <button onClick={() => move(i, -1)} disabled={i === 0}
                  style={{ background: 'transparent', border: '1px solid var(--color-amber-deep)', color: i === 0 ? 'var(--color-amber-deep)' : 'var(--color-amber-dim)', cursor: i === 0 ? 'default' : 'pointer', fontSize: 9, lineHeight: 1, padding: '3px 6px', fontFamily: 'var(--font-mono)' }}>▲</button>
                <button onClick={() => move(i, 1)} disabled={i === order.length - 1}
                  style={{ background: 'transparent', border: '1px solid var(--color-amber-deep)', color: i === order.length - 1 ? 'var(--color-amber-deep)' : 'var(--color-amber-dim)', cursor: i === order.length - 1 ? 'default' : 'pointer', fontSize: 9, lineHeight: 1, padding: '3px 6px', fontFamily: 'var(--font-mono)' }}>▼</button>
              </div>
            </div>
          );
        })}

        {/* proportion bar */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '0.08em', color: 'var(--color-amber-dim)', marginBottom: 6 }}>
            <span>SHARE OF PROMPT AT THE DISCOUNTED RATE</span>
            <span style={{ color: cachedShare > 0 ? '#4ec9b0' : 'var(--color-magenta)' }}>{cachedShare}%</span>
          </div>
          <div style={{ height: 10, background: 'var(--color-bg2)', border: '1px solid var(--color-amber-deep)', display: 'flex' }}>
            <div style={{ width: `${cachedShare}%`, background: '#4ec9b0', transition: 'width 0.25s' }} />
            <div style={{ flex: 1, background: 'var(--color-magenta-soft)' }} />
          </div>
        </div>

        <div style={{
          marginTop: 16,
          paddingTop: 14,
          borderTop: '1px solid var(--color-amber-deep)',
          fontSize: 12,
          color: 'var(--color-amber-dim)',
          lineHeight: 1.75,
        }}>
          {isCanonical ? (
            <>
              <strong style={{ color: '#4ec9b0' }}>This is the shipped order.</strong> Most-stable first,
              the diff always last. The provider discounts the longest <em>unchanged prefix</em>, so every
              block you place before a volatile one keeps its discount — and the diff, which is both the
              largest block and the one that changes every push, can only ever be last.
            </>
          ) : cachedShare === 0 ? (
            <>
              <strong style={{ color: 'var(--color-magenta)' }}>Cache fully busted.</strong> A block that
              changes every push now sits at position 1, so there is no unchanged prefix left to discount.
              Every token in every pass is billed at full price on every re-review.
            </>
          ) : (
            <>
              <strong style={{ color: 'var(--color-amber)' }}>Partially busted.</strong> Putting a volatile
              block before a stable one throws away the discount for <em>everything after it</em> — not just
              for that block. That ordering comment is now the most load-bearing comment in the codebase.
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   9. PrsConvergence — five rounds of PRS reviewing the hook
      built to enforce its own correctness. 17→17→15→5→0.
───────────────────────────────────────────────────────── */

interface Round {
  n: number;
  count: number;
  headline: string;
  findings: string[];
}

const ROUNDS: Round[] = [
  {
    n: 1, count: 17,
    headline: 'The whole hook was fail-open',
    findings: [
      'If `gh` was missing, the hook treated that as “clean” and disarmed — silently breaking the exact guarantee it existed to provide.',
      'A transiently failing GitHub query did the same thing: no answer was read as a good answer.',
      'Correct, and embarrassing. The guard shipped with its central property inverted.',
    ],
  },
  {
    n: 2, count: 17,
    headline: 'The fail-closed fix was incomplete — and the safety net had a hole shaped like itself',
    findings: [
      'Two of four GitHub queries still swallowed their errors after the round-1 fix.',
      'The sharpest catch of the whole saga: `block()` itself called `jq`. So the “jq is missing → block” branch produced no output and allowed the stop.',
      'The thing that catches failures could not catch the failure of the thing it needed to catch failures.',
    ],
  },
  {
    n: 3, count: 15,
    headline: 'Still fail-open at three edges',
    findings: [
      '`block()` could *still* fail open when `jq` was present but broken — missing is not the only way a dependency fails.',
      '`git` being missing was fail-open.',
      'A `printf | grep` could drop its match to SIGPIPE under `pipefail`, turning a real hit into a silent miss.',
    ],
  },
  {
    n: 4, count: 5,
    headline: 'A round-3 fix had itself broken convergence',
    findings: [
      'I had made “CI returned no rows” keep the hook armed — safer, on the face of it.',
      'But a repo with no checks configured would then *never* be able to disarm, and the loop could never terminate.',
      'PRS caught that my own hardening had traded a fail-open bug for an infinite loop.',
    ],
  },
  {
    n: 5, count: 0,
    headline: 'Clean',
    findings: [
      'Fifty-four findings across five rounds, every one addressed.',
      'Each fix landed with a test; the suite grew to seventeen mocked cases.',
      'Exactly one finding was not fixed — an ambiguous `git` state with no reliable shell-level distinction between “not a repo” and “corrupted metadata” — reasoned-accepted as a known limitation, in writing, on the thread.',
    ],
  },
];

const MAX_ROUND = 17;

export function PrsConvergence() {
  const [sel, setSel] = useState(1);
  const round = ROUNDS.find(r => r.n === sel)!;

  return (
    <div style={BOX}>
      <div style={BAR}>
        <span style={TITLE}>PRS reviewing its own guardrail — pick a round</span>
        <span style={{ ...TITLE, color: 'var(--color-magenta)' }}>54 findings · 0 remaining</span>
      </div>

      {/* the chart */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 'clamp(6px,2vw,14px)',
        padding: 'clamp(16px,4vw,24px) clamp(13px,4vw,20px) 0',
        height: 168,
      }}>
        {ROUNDS.map(r => {
          const active = r.n === sel;
          const h = r.count === 0 ? 3 : Math.max(6, (r.count / MAX_ROUND) * 118);
          const color = r.count === 0 ? '#4ec9b0' : active ? 'var(--color-magenta)' : 'var(--color-amber-dim)';
          return (
            <button
              key={r.n}
              onClick={() => setSel(r.n)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 7,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                padding: 0,
              }}
            >
              <span style={{ fontSize: 15, color, fontWeight: 700 }}>{r.count}</span>
              <div style={{
                width: '100%',
                height: h,
                background: active ? color : 'transparent',
                border: `1px solid ${color}`,
                transition: 'all 0.25s',
              }} />
              <span style={{
                fontSize: 9.5,
                color: active ? 'var(--color-amber)' : 'var(--color-amber-dim)',
                letterSpacing: '0.06em',
                paddingBottom: 4,
                whiteSpace: 'nowrap',
              }}>
                RD {r.n}
              </span>
            </button>
          );
        })}
      </div>

      {/* the detail */}
      <div style={{
        margin: 'clamp(10px,3vw,16px) clamp(13px,4vw,20px) clamp(16px,4vw,22px)',
        borderTop: '1px solid var(--color-amber-deep)',
        paddingTop: 16,
      }}>
        <div style={{
          fontSize: 12.5,
          color: round.count === 0 ? '#4ec9b0' : 'var(--color-magenta)',
          letterSpacing: '0.04em',
          marginBottom: 12,
        }}>
          Round {round.n} — {round.count} finding{round.count === 1 ? '' : 's'} · {round.headline}
        </div>
        {round.findings.map(f => (
          <div key={f} style={{ display: 'flex', gap: 10, marginBottom: 9, fontSize: 12, lineHeight: 1.7 }}>
            <span style={{ color: 'var(--color-amber-dim)', flexShrink: 0 }}>→</span>
            <span style={{ color: 'var(--color-amber-dim)' }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   10. PrsFailClosed — inject a fault, compare the guarantee.
───────────────────────────────────────────────────────── */

interface Fault {
  id: string;
  label: string;
  open: string;
  closed: string;
  round: number;
}

const FAULTS: Fault[] = [
  {
    id: 'gh', label: '`gh` binary is missing', round: 1,
    open: 'No PR data comes back. The hook reads “no open threads, no red checks” and disarms — the turn ends with review comments still unanswered.',
    closed: 'Cannot determine the state → cannot prove the work is done → block. The agent keeps working.',
  },
  {
    id: 'query', label: 'GitHub query fails transiently', round: 1,
    open: 'A network blip is indistinguishable from a clean PR. The guarantee evaporates for exactly as long as the API is unhappy.',
    closed: 'An error is not an answer. Block, and let the next turn re-query.',
  },
  {
    id: 'jq-missing', label: '`jq` is missing', round: 2,
    open: 'The “jq is missing → block” branch called `block()`, which itself called `jq`. It produced nothing, and the stop was allowed. The safety net had a hole shaped exactly like the thing it was catching.',
    closed: '`block()` falls back to exit code 2, which also blocks — no `jq` required.',
  },
  {
    id: 'jq-broken', label: '`jq` is present but broken', round: 3,
    open: 'The round-2 fix checked only whether `jq` existed. A `jq` that exists and fails still slipped straight through.',
    closed: 'The guard tests the actual invocation, not the binary\'s presence, and falls through to exit 2 on any failure.',
  },
  {
    id: 'git', label: '`git` is missing', round: 3,
    open: 'Same shape, different tool. No git, no branch state, hook disarms.',
    closed: 'Block. Unverifiable state never counts as a passing state.',
  },
  {
    id: 'sigpipe', label: '`printf | grep` hits SIGPIPE under `pipefail`', round: 3,
    open: 'A real match gets dropped when the pipe closes early — the hook concludes there was nothing to find.',
    closed: 'The pipeline is restructured so an early close cannot be mistaken for an empty result.',
  },
];

export function PrsFailClosed() {
  const [sel, setSel] = useState(FAULTS[0].id);
  const fault = FAULTS.find(f => f.id === sel)!;

  return (
    <div style={BOX}>
      <div style={BAR}>
        <span style={TITLE}>Inject a fault — does the guarantee survive?</span>
      </div>

      <div style={{ padding: 'clamp(12px,3vw,16px) clamp(13px,4vw,18px)', borderBottom: '1px solid var(--color-amber-deep)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FAULTS.map(f => {
          const active = sel === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSel(f.id)}
              style={{
                padding: '5px 10px',
                background: active ? 'var(--color-amber)' : 'transparent',
                color: active ? '#000' : 'var(--color-amber-dim)',
                border: `1px solid ${active ? 'var(--color-amber)' : 'var(--color-amber-deep)'}`,
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                cursor: 'pointer',
                fontWeight: active ? 700 : 400,
                transition: 'all 0.15s',
              }}
            >
              {f.label.replace(/`/g, '')}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div style={{ padding: 'clamp(14px,4vw,18px)', borderRight: '1px solid var(--color-amber-deep)' }}>
          <div style={{ fontSize: 10.5, letterSpacing: '0.09em', color: 'var(--color-magenta)', marginBottom: 10 }}>
            ✗ FAIL-OPEN — as shipped, caught in round {fault.round}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-amber-dim)', lineHeight: 1.75 }}>{fault.open}</div>
          <div style={{
            marginTop: 13,
            padding: '8px 11px',
            background: 'var(--color-magenta-soft)',
            borderLeft: '3px solid var(--color-magenta)',
            fontSize: 11,
            color: 'var(--color-magenta)',
          }}>
            Guarantee broken — silently.
          </div>
        </div>

        <div style={{ padding: 'clamp(14px,4vw,18px)', background: 'var(--color-bg2)' }}>
          <div style={{ fontSize: 10.5, letterSpacing: '0.09em', color: '#4ec9b0', marginBottom: 10 }}>
            ✓ FAIL-CLOSED — after the fix
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-amber-dim)', lineHeight: 1.75 }}>{fault.closed}</div>
          <div style={{
            marginTop: 13,
            padding: '8px 11px',
            background: 'rgba(78,201,176,0.09)',
            borderLeft: '3px solid #4ec9b0',
            fontSize: 11,
            color: '#4ec9b0',
          }}>
            Guarantee holds.
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid var(--color-amber-deep)',
        padding: 'clamp(12px,3vw,15px) clamp(13px,4vw,20px)',
        fontSize: 11.5,
        color: 'var(--color-amber-dim)',
        lineHeight: 1.7,
      }}>
        Every one of these is the same bug wearing a different costume: <strong style={{ color: 'var(--color-amber)' }}>an
        unverifiable state being quietly counted as a passing state.</strong> If a component exists to be a
        guarantee, that is the only bug class that really matters.
      </div>
    </div>
  );
}
