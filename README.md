# vibhu-website

Personal portfolio + technical blog for **Vibhanshu Sharma** — IIT Roorkee Gold Medalist, 2x Founder, currently on the Engineering & AI team at Powerplay.

Live at **[www.viiforwin.in](https://www.viiforwin.in)**

---

## What it is

A VS Code / terminal-aesthetic portfolio built with Next.js 15. The whole site renders as a fake IDE shell — sidebar file tree, tab bar, status bar — with each section as a "file" panel. Posts are written in MDX with interactive React components embedded inline.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19 + Mantine 8 |
| Types | TypeScript 5 |
| Styling | CSS Modules + Tailwind + PostCSS |
| Icons | Tabler Icons |
| Fonts | IBM Plex Mono + IBM Plex Serif |
| Blog | MDX via `next-mdx-remote/rsc` |
| Math | KaTeX (`remark-math` + `rehype-katex`) |
| Code blocks | `rehype-pretty-code` (one-dark-pro theme) |
| Analytics | Vercel Analytics + Speed Insights |
| AI chat | Anthropic Claude API (streaming) |
| Deploy | Vercel |

## Sections

- **Home** — hero with boot log, stats bar, and math visualizer tabs
- **Work** — clickable experience cards (Powerplay, Vignam, Trucks24)
- **Projects** — portfolio project grid
- **About** — bio + contact panel
- **Blog** — MDX posts with live interactive components, infinite scroll

## Blog posts

| Post | Interactive component |
|---|---|
| CLAUDE.md vs hooks — a mental model | ComparisonToggle, HookTrace, TryItChecklist, LayerModel |
| Binary Search: The Math Nobody Actually Derives | MidpointProof, ComplexityTable, SearchRaceVisualizer |
| The DB-Backed Job Queue | JobStateVisualizer |
| Encrypt the Secret Before It Leaves the Browser | SecurityLayerDiagram |
| Fail Closed, Not Open | FailModeCompare |
| Don't Leak Your Database Schema | ManifestMapper |
| Calling a URL Your User Controls: SSRF Defense | URLRiskChecker |

## Dev setup

```bash
npm install
npm run dev        # http://localhost:3000 (Turbopack)
npm run build      # production build
npm run lint       # ESLint
```

### Environment variables

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...   # powers the ask_vibhanshu_anything chat widget
```

## Project structure

```
src/
  app/
    page.tsx                  # homepage → redirects to /home shell
    layout.tsx                # root layout, MantineProvider, Analytics
    [panel]/page.tsx          # /home /work /projects /about /contact /blog
    blog/[slug]/page.tsx      # standalone blog post route
    api/chat/route.ts         # Claude streaming chat endpoint
  components/
    shell/                    # VSCodeShell, ShellPage (the IDE chrome)
    panels/                   # HomePanel, WorkPanel, BlogListPanel, …
    blog/                     # BlogMdxComponents (12 interactive components)
    chat/                     # ChatWidget (streaming chat)
    hero/                     # HeroText, MathVisualizer
  content/blog/               # MDX source files
  data/                       # workex.ts, projects.ts (static data)
  lib/blog.ts                 # MDX parsing, normalizeDate, getAllPosts
  types/                      # BlogPost, WorkExEntry, ChatMessage, …
```

## Branch strategy

| Branch | Purpose |
|---|---|
| `main` | production — deployed to Vercel |
| `develop` | integration branch — PRs merge here first |
| `feat/*` | feature branches |
