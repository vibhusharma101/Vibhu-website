#!/usr/bin/env node
// Blocks `git push` directly to develop or main. Release process for this repo is:
//   feature branch -> PR into develop -> merge -> PR from develop into main.
// Pushing a feature branch is always allowed.

const { execSync } = require('child_process');

let raw = '';
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const cmd = input?.tool_input?.command ?? '';
  if (!/(^|[;&|]|\s)git\s+push(\s|$)/.test(cmd)) process.exit(0);

  const segmentMatch = cmd.match(/git\s+push[^;&|]*/);
  const segment = segmentMatch ? segmentMatch[0] : '';

  // Explicit refspec: `git push origin develop` / `git push origin HEAD:develop`
  let target = null;
  const refspecMatch = segment.match(/[A-Za-z0-9._/-]+:[A-Za-z0-9._/-]+/);
  if (refspecMatch) {
    target = refspecMatch[0].split(':').pop();
  } else {
    const tokens = segment
      .replace(/^git\s+push\s*/, '')
      .split(/\s+/)
      .filter(t => t && !t.startsWith('-') && t !== 'origin' && t !== 'upstream');
    if (tokens.length > 0) target = tokens[tokens.length - 1];
  }

  // No explicit branch named -> pushing whatever is currently checked out.
  if (!target) {
    try {
      target = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    } catch {
      target = null;
    }
  }

  if (target === 'develop' || target === 'main' || target === 'master') {
    const reason = `Direct push to '${target}' is blocked by this repo's release process. Create a feature branch, open a PR into develop, merge it, then open a separate PR from develop into main. See CLAUDE.md.`;
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    }));
  }

  process.exit(0);
});
