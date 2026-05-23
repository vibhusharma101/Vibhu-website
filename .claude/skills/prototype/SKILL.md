---
name: prototype
description: Build a throwaway UI mockup to answer a visual question before committing to it. Use when the user wants to try a design, test a layout, or explore how a section should look — before writing production code.
---

A prototype answers one question fast, then gets deleted or absorbed.

## For this portfolio

Almost all prototypes here will be visual (UI) questions — "how should the WorkEx section look?", "what layout for the project cards?", "how should the blog listing feel?". Build those as standalone HTML/CSS files in `.vii/prototypes/` so they're easy to open in a browser without running the Next.js dev server.

For logic questions (state shape, data model for blog slugs, etc.) — a quick TypeScript scratch file in `.vii/prototypes/` is enough.

## Rules

1. **Throwaway from day one.** Name it obviously: `hero-v1.html`, `workex-layout-test.html`. Never in `src/`.
2. **One command to open** — just a file path, opens in browser directly for HTML prototypes.
3. **No framework needed for UI prototypes** — plain HTML + CSS + maybe a `<style>` block is fastest. Use Tailwind CDN if needed.
4. **Skip polish** — no error handling, no tests, no abstractions.
5. **Show the real content** — use actual text from the plan (Vibhanshu's real work experience, real project names). Fake copy hides layout problems.
6. **Delete when done** — capture the decision in a comment or commit message, then delete the prototype file.

## When done

State the answer before deleting: "timeline layout works better than card grid for WorkEx". That one line is the only thing worth keeping.
