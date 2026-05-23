---
name: frontend-design
description: Design and style UI sections for this personal portfolio landing page. Use when building or restyling Hero, WorkEx, MyProjects, AboutMe, Blog, Header, Footer, or ChatPopover. Guides aesthetic decisions, typography, spacing, and visual identity — avoiding generic AI-generated looks.
---

This is a personal portfolio for Vibhanshu Sharma — tech generalist, 2x founder, IIT Roorkee gold medalist. The design should feel like a sharp, confident engineer who has built real products at scale. Not a generic "hire me" template.

## Before touching styles

Answer two questions:
- **What is this section communicating?** (e.g. WorkEx = credibility + scale, Hero = immediate hook, Projects = proof of craft)
- **What's the one thing a visitor should feel?** (trust, curiosity, "this person ships")

## Aesthetic direction

Committed choices for this site:
- **No purple gradients, no rounded-2xl everything, no hero-with-stock-photo**
- Clean, editorial feel — think a well-designed personal site, not a SaaS landing page
- Dark mode first is fine; light mode needs to feel equally considered
- Typography does the heavy lifting — pick fonts that feel distinctive, not default Inter/Arial
- Whitespace is intentional: generous breathing room in sections, tight density in data-heavy parts (WorkEx timeline, project cards)

## Styling approach

This project uses a mix — use whatever fits:
- **Mantine components** for interactive elements (modals, popovers, badges, buttons)
- **Tailwind v4** for layout, spacing, responsive utilities
- **CSS Modules (.module.css)** for component-specific styles that need isolation or complex selectors
- **Plain CSS variables** for site-wide tokens (colors, font sizes, spacing scale)

Don't force everything through one system. A section can use Tailwind for layout and a CSS Module for the hover animation.

## Section-specific notes

| Section | Tone | Watch out for |
|---|---|---|
| Hero | Bold, immediate — first impression | Generic headline copy, weak CTA |
| WorkEx | Structured, credible — show scale | Wall of text, no visual hierarchy |
| MyProjects | Proof of craft — show real impact | Card layouts that look like every other portfolio |
| AboutMe | Human, direct — not a resume | Over-formal, third-person voice |
| Blog | Clean reading experience | Clutter, poor typography scale |
| Header | Minimal, functional | Overcrowding the nav |

## What NOT to do

- Don't hardcode hex colors outside of CSS variables
- Don't use `<img>` — use Next.js `<Image>`
- Don't add animations that block interaction or feel gratuitous
- Don't make it look like a Mantine UI demo or a Tailwind template clone
