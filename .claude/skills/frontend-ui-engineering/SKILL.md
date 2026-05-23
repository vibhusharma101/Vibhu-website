---
name: frontend-ui-engineering
description: Build and modify UI components for this portfolio. Use when creating components, implementing layouts, fixing visual/UX issues, or adding interactivity. Covers component structure, state, accessibility, and responsive design for this Next.js 15 + React 19 project.
---

## Stack

Next.js 15 (App Router), React 19, TypeScript, Mantine 8, Tailwind v4, SASS/CSS Modules.

## Component rules

- One component per file, named export
- `'use client'` only when hooks or browser APIs are needed — server components by default
- Keep components under 200 lines — split if larger
- Co-locate CSS module (`.module.css`) with the component file

File layout example:
```
src/components/workex/
  WorkEx.tsx
  WorkEx.module.css
```

## State

```
useState          → local UI state (open/closed, active tab)
useDisclosure     → Mantine modals/popovers (already in layout)
URL params        → filters, pagination
No global store   → this site doesn't need it
```

## Styling

Pick what fits the component — don't be rigid:
- Mantine components → interactive elements, badges, buttons, popovers
- Tailwind → layout, spacing, responsive breakpoints
- CSS Module → component-specific styles, complex selectors, animations

Breakpoints to test: 320px, 768px, 1024px, 1440px (mobile-first).

## Accessibility

Every component must:
- Be keyboard-navigable (Tab + Enter/Space for interactive elements)
- Have ARIA labels on icon-only buttons and form inputs
- Maintain heading hierarchy: h1 (page) → h2 (section) → h3 (subsection)
- Handle all states: loading, error, empty — never a blank screen

## Avoid the AI aesthetic

| Don't | Do instead |
|---|---|
| Purple gradients | Project's actual color palette |
| Rounded-2xl on everything | Consistent, intentional corner radius |
| Oversized padding | Spacing scale from the design |
| Lorem ipsum | Realistic content (use real data from `src/data/`) |
| Shadow-heavy cards | Subtle or no shadows |

## Checklist before calling done

- [ ] No console errors
- [ ] Keyboard accessible
- [ ] Responsive at 320px and 1440px
- [ ] Loading + empty states handled where data is async
- [ ] No `<img>` tags (use Next.js `<Image>`)
- [ ] No hardcoded hex colors (use CSS variables)
