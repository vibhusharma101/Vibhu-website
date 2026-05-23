# vibhu-website — Claude Code Project Guide

Personal portfolio + landing page built with Next.js 15, React 19, TypeScript, and Mantine 8.

## Dev Commands

```bash
npm run dev      # Start dev server (Turbopack) at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

## Project Structure

```
src/
  app/
    page.tsx              # Homepage — all sections stacked
    layout.tsx            # Root layout with MantineProvider
    blog/
      page.tsx            # Blog listing
      [slug]/page.tsx     # Individual blog post
    project/[slug]/       # Project detail page
    workex/[slug]/        # Work experience detail page
  components/
    hero/                 # HeroText, ChatInterface, ChatPopover, Dots
    ui/                   # Header, Footer, BadgeCard
    aboutme/              # AboutMe section
    myprojects/           # MyProjects section
    workex/               # WorkEx section
    blog/                 # BlogCard
```

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 15.5.4 | Framework (App Router) |
| React | 19.1.0 | UI |
| TypeScript | 5 | Types |
| Mantine | 8.3.3 | Component library + theming |
| Tabler Icons | 3.35 | Icons (`@tabler/icons-react`) |
| SASS | 1.93 | CSS modules |
| PostCSS | — | Mantine postcss preset + simple vars |

## Styling Rules

- **Mix freely**: Mantine components, Tailwind, CSS Modules, plain CSS — use whatever fits best for the task
- Mantine's `MantineProvider` is already in `layout.tsx` — Mantine components work out of the box
- **CSS Modules** (`.module.css` / `.module.scss`) are co-located with components and work alongside any other approach
- Tailwind can be added via `npm install -D tailwindcss` if not already installed
- PostCSS is configured for Mantine — adding Tailwind to `postcss.config` is straightforward

## Component Conventions

- One component per file, named and exported as a named export
- Co-locate CSS module with its component in the same folder
- `'use client'` only when hooks or browser APIs are needed (e.g. `useDisclosure`)
- Server components by default (no `'use client'` unless required)
- Keep components under 200 lines — split if larger

## Landing Page Goals

This is a personal portfolio landing page for **Vibhu Sharma** (vibhu101). The homepage sections are:

1. **Header** — Nav with links: Features, Pricing, Learn, Community + search
2. **HeroText** — Main headline with CTA buttons ("Book a demo", "Purchase a license")
3. **WorkEx** — Professional work experience timeline
4. **MyProjects** — Portfolio project cards
5. **AboutMe** — Personal bio / about section
6. **Footer** — Bottom links
7. **ChatPopover** — Floating chat widget (bottom-right, `Affix`)

### Design Direction

- Avoid generic AI aesthetics: no purple gradients, no rounded-2xl everything, no stock layouts
- Use Mantine's design system tokens consistently
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

- `src/app/layout.tsx` — Root layout, MantineProvider, global CSS import
- `src/app/globals.css` — Global styles
- `src/app/page.tsx` — Homepage composition (add/remove sections here)
- `postcss.config.*` — PostCSS for Mantine
- `next.config.ts` — Next.js config (currently minimal)

## What NOT to Do

- Don't add `'use client'` to components that don't need it
- Don't create new pages without adding them to the nav in `Header.tsx`
- Don't use `<img>` tags — use Next.js `<Image>` from `next/image` for optimization
