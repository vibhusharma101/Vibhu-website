export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  highlight?: string;
}

export const projects: Project[] = [
  {
    id: 'session-city',
    name: 'Session City',
    tagline: 'Your Claude Code sessions, rebuilt as a little 3D city you can drive around',
    description:
      'A Claude Code plugin that turns every session into a building and every project into a block. Live sessions glow in Uptown, the ones waiting for you wave a "!", and abandoned ones crumble in Old Town. Drive between them, step inside to watch your agent work, and read each session\'s story with credentials masked. Runs locally with zero npm dependencies; nothing leaves your machine.',
    stack: ['Claude Code', 'Three.js', 'Node.js', 'JavaScript'],
    githubUrl: 'https://github.com/vibhusharma101/session-city',
    featured: true,
    highlight: 'Zero dependencies, local only',
  },
  {
    id: 'jaagte-raho',
    name: 'jaagte-raho',
    tagline: 'Keeps your computer awake while Claude Code is working, and only then',
    description:
      'A Claude Code plugin that holds off sleep while Claude, or its background agents and tasks, are still working, then lets the machine sleep normally the moment it goes idle. No config, no admin rights, nothing to switch off. Works on macOS, Windows and Linux, with an optional lid-closed mode on Windows and Linux while plugged in.',
    stack: ['Claude Code', 'Hooks', 'Bash', 'PowerShell'],
    githubUrl: 'https://github.com/vibhusharma101/jaagte-raho',
    featured: true,
    highlight: 'macOS · Windows · Linux',
  },
  {
    id: 'recyclink',
    name: 'Recyclink',
    tagline: "India's only zero-markup EPR credit exchange",
    description:
      'Built at Novus Hackathon — a marketplace and compliance platform for EPR credits. Features AI-powered pricing, live order book, fraud detection, and full buyer/seller dashboards with Clerk auth and Supabase.',
    stack: ['Next.js', 'AI SDK', 'Anthropic', 'Supabase', 'Clerk'],
    liveUrl: 'https://novus-hackathon.vercel.app/',
    githubUrl: 'https://github.com/vibhusharma101/Novus-Hackathon',
    featured: true,
    highlight: 'Novus Hackathon',
  },
  {
    id: 'vii-stack',
    name: 'vii-stack',
    tagline: 'Claude Code skill pack — a virtual engineering team in your terminal',
    description:
      'Turns Claude into a virtual team of specialists — CEO, Designer, Eng Manager, QA, Security Auditor — via 31 slash commands that follow a Think → Plan → Build → Review → Test → Ship → Reflect workflow.',
    stack: ['Claude Code', 'AI Agents', 'PowerShell', 'Bash'],
    githubUrl: 'https://github.com/vibhusharma101/vii-stack',
    featured: true,
    highlight: '31 slash commands',
  },
  {
    id: 'think-in-html',
    name: 'Think-In-HTML',
    tagline: 'Turn any codebase into an interactive, explorable lesson — one command',
    description:
      'Takes a file or module and generates a single self-contained HTML page that explains it like a teacher would — with visual flow diagrams, guided walkthroughs, quizzes, and a beginner-to-technical toggle. No server, no install.',
    stack: ['Claude Code', 'AI', 'Node.js', 'HTML'],
    githubUrl: 'https://github.com/vibhusharma101/Think-In-HTML',
    featured: true,
    highlight: 'Zero-dependency explainers',
  },
  {
    id: 'kodemux',
    name: 'kodemux',
    tagline: 'Routes every AI coding task to the cheapest model that can actually do it',
    description:
      'A repo-native CLI that estimates task complexity from multiple signals — including the real git diff and critical-path detection — and routes to a Haiku → Sonnet → Opus → Fable capability ladder. Adds risk floors for security/production work, a confidence-gated escalation cascade, and parallel-agent recommendations for multi-agent work, plus git-level guardrails: secrets scanning, branch protection, and scoped post-hooks.',
    stack: ['TypeScript', 'Node.js', 'Claude API', 'CLI'],
    liveUrl: 'https://vibhusharma101.github.io/kodemux/',
    githubUrl: 'https://github.com/vibhusharma101/kodemux',
    featured: true,
    highlight: 'Complexity-driven model routing',
  },
];
