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
];
