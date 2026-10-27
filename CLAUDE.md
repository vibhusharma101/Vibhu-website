# vibhu-website — Claude Code Project Guide

Personal portfolio built with Next.js 15, React 19, TypeScript, CSS Modules and MDX.

## Dev Commands

```bash
npm run dev      # Start dev server (Turbopack) at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npm run check:md # Fails if a page has no markdown renderer
```

## Project Structure

```
src/
  app/
    page.tsx              # Redirects / → /home
    layout.tsx            # Root layout, metadata, Person JSON-LD
    [panel]/page.tsx      # /home /work /projects /about /contact — one shell, one panel per tab
    blog/
      page.tsx            # Blog listing (shell, blog panel)
      [slug]/page.tsx     # Individual blog post (MDX)
    api/chat/             # Chat widget backend
    api/md/[[...path]]/   # Markdown version of any page (see "AI-readable site")
    llms.txt/ llms-full.txt/ ai.txt/ robots.txt/   # Generated text routes
  components/
    shell/                # VSCodeShell (tabs, sidebar, status bar), ShellPage
    panels/               # HomePanel, WorkPanel, ProjectsPanel, AboutPanel, ContactPanel, Blog*
    chat/                 # ChatWidget
    blog/                 # MDX components, BlogShell, TldrBlock
    seo/                  # BreadcrumbJsonLd, WebSiteJsonLd
  content/blog/*.mdx      # Blog posts (frontmatter: title, excerpt, date, tags, published, tldr)
  data/                   # bio, about, workex, projects — content shared by HTML + markdown
  lib/
    site.ts               # Site URL / name / description — single source of truth
    md/                   # Markdown renderer registry for the AI-readable site
  middleware.ts           # .md suffix + Accept: text/markdown → /api/md
```

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 15.5 | Framework (App Router) |
| React | 19.1.0 | UI |
| TypeScript | 5 | Types |
| next-mdx-remote | 6 | Blog posts (+ remark-gfm, remark-math, rehype-katex, rehype-pretty-code) |
| Tabler Icons | 3.35 | Icons (`@tabler/icons-react`) |
| SASS | 1.93 | CSS modules |
| Tailwind | 4 | Available via `@tailwindcss/postcss` |

## Styling Rules

- **CSS Modules** (`.module.css`) co-located with components are the main approach; design tokens are CSS variables in `globals.css`
- Tailwind 4 is configured in `postcss.config` and can be mixed in where it fits

## Component Conventions

- One component per file, named and exported as a named export
- Co-locate CSS module with its component in the same folder
- `'use client'` only when hooks or browser APIs are needed
- Server components by default (no `'use client'` unless required)
- Keep components under 200 lines — split if larger

## Site Layout

Personal portfolio for **Vibhanshu Sharma**, built as a VS Code-style shell (`VSCodeShell`): a tab per page (`TABS` in `src/types/panel.ts`), a sidebar, a status bar, and a floating `ChatWidget`. There is no separate header or footer — the tabs are the nav.

Tabs: home · work · projects · about · contact · blog

## AI-readable site (SEO / GEO)

Every public page has a markdown version (`/work.md`, or `Accept: text/markdown`), plus generated `/llms.txt`, `/llms-full.txt`, `/ai.txt` and `/robots.txt`.

- **New page?** Add its route to `MARKDOWN_ROUTES` in `src/lib/md/routes.ts` and a renderer in `src/lib/md/registry.ts`. Run `npm run check:md` — it fails if a page has no renderer.
- **Site URL / name / description** come from `src/lib/site.ts`. Don't hardcode them.
- **Page text** for home/about lives in `src/data/about.ts` so the HTML and markdown stay identical.
- **New page metadata**: use `buildPanelMetadata` (adds canonical, markdown alternate link, `ai-summary`).

### Design Direction

- Avoid generic AI aesthetics: no purple gradients, no rounded-2xl everything, no stock layouts
- Use the design tokens in `globals.css` consistently
- Mobile-first responsive: works at 320px, 768px, 1024px, 1440px
- Accessibility: keyboard navigation, ARIA labels, proper heading hierarchy
- Every section must handle loading/empty/error states

## Installed Skills

### `/frontend-design` (claude-code-templates)
Located: `.claude/skills/frontend-design/SKILL.md`
Use for: Building visually distinctive, production-grade UI. Emphasizes bold aesthetic direction, typography, motion, and avoiding generic AI design.

### `/frontend-ui-engineering` (addyosmani/agent-skills)
Located: `.claude/skills/frontend-ui-engineering/SKILL.md`
Use for: Component architecture, accessibility (WCAG 2.1 AA), state management patterns, design system adherence.

### mattpocock/skills (14 skills in `.agents/skills/`)
Key skills for this project:
- `/prototype` — Build throwaway prototypes to validate design ideas
- `/to-prd` — Convert conversations into formal requirements
- `/grill-me` — Exhaustive planning before building
- `/zoom-out` — Get broader codebase context
- `/diagnose` — Structured debugging
- `/tdd` — Test-driven development
- `/improve-codebase-architecture` — Architecture analysis

## Key Files

- `src/app/layout.tsx` — Root layout, site metadata, global CSS import
- `src/app/globals.css` — Global styles and design tokens
- `src/components/shell/VSCodeShell.tsx` — Shell composition (tabs, panels, status bar)
- `src/lib/panel-metadata.ts` — Per-page titles/descriptions
- `src/lib/site.ts` — Site-level facts
- `next.config.ts` — Next.js config (currently minimal)

## Release Process

Branches: `main` is production (deploys from here), `develop` is the integration branch.

All work goes: **feature branch → PR into `develop`** → merge → **PR from `develop` into `main`**. Never commit or push directly to `develop` or `main` — a `PreToolUse` hook (`.claude/hooks/block-direct-push.js`) blocks direct `git push` to either branch and will error out with instructions if you try.

## What NOT to Do

- Don't add `'use client'` to components that don't need it
- Don't create new pages without adding them to `TABS` (nav) and giving them a markdown renderer
- Don't hardcode the site URL — import from `src/lib/site.ts`
- Don't use `<img>` tags — use Next.js `<Image>` from `next/image` for optimization
