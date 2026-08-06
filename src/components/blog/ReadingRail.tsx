'use client';

import { useEffect, useRef, useState } from 'react';
import s from './reading-rail.module.css';

/**
 * Right rail for the reading view: table of contents + progress.
 *
 * It replaces the old "other posts" rail, which asked the reader to
 * leave at exactly the moment they'd started. This rail answers the
 * two questions a reader actually has mid-article — "what's in here"
 * and "how much is left" — and supports the layer-cake scanning
 * pattern (readers hop heading to heading, dipping into the body).
 *
 * Headings are read from the DOM rather than from the MDX AST, so the
 * same component works for both render paths (the static /blog/[slug]
 * route and the in-shell pane) without touching the MDX pipeline.
 * Rendering is a no-op below `minHeadings` — a TOC for a three-section
 * post is chrome, not navigation.
 */

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface Props {
  /** Re-scan when the article changes (in-shell navigation). */
  slug: string;
  minHeadings?: number;
}

function slugify(text: string, taken: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60) || 'section';

  let id = base;
  let n = 2;
  while (taken.has(id)) id = `${base}-${n++}`;
  taken.add(id);
  return id;
}

export function ReadingRail({ slug, minHeadings = 3 }: Props) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const scrollerRef = useRef<HTMLElement | null>(null);

  /* ── Collect headings, assign stable ids ── */
  useEffect(() => {
    const prose = document.querySelector<HTMLElement>('[data-prose]');
    const scroller = document.querySelector<HTMLElement>('[data-article]');
    scrollerRef.current = scroller;
    if (!prose) return;

    const taken = new Set<string>();
    const found: Heading[] = [];

    prose.querySelectorAll<HTMLHeadingElement>('h2, h3').forEach(el => {
      const text = el.textContent?.trim();
      if (!text) return;
      if (!el.id) el.id = slugify(text, taken);
      else taken.add(el.id);
      found.push({ id: el.id, text, level: el.tagName === 'H2' ? 2 : 3 });
    });

    setHeadings(found);
    setActiveId(found[0]?.id ?? '');
  }, [slug]);

  /* ── Track progress + active heading on scroll ── */
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || headings.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;

      const { scrollTop, scrollHeight, clientHeight } = scroller;
      const scrollable = scrollHeight - clientHeight;
      const ratio = scrollable > 0 ? Math.min(1, scrollTop / scrollable) : 0;
      scroller.style.setProperty('--read-progress', ratio.toFixed(4));

      /*
       * Active = last heading whose top has crossed the reading line
       * (a third down the viewport). Simpler and steadier than an
       * IntersectionObserver here, because the scroller is a nested
       * element and headings can be taller than their root margins.
       */
      const line = scroller.getBoundingClientRect().top + clientHeight / 3;
      let current = headings[0].id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= line) current = h.id;
        else break;
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [headings]);

  if (headings.length < minHeadings) return null;

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    const scroller = scrollerRef.current;
    if (!el || !scroller) return;
    const top =
      el.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop -
      24;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <aside className={s.rail} aria-label="Table of contents">
      <div className={s.head}>{'// on this page'}</div>

      <nav className={s.list}>
        {headings.map(h => (
          <button
            key={h.id}
            type="button"
            onClick={() => jumpTo(h.id)}
            className={[
              s.item,
              h.level === 3 ? s.sub : '',
              activeId === h.id ? s.active : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-current={activeId === h.id ? 'true' : undefined}
          >
            {h.text}
          </button>
        ))}
      </nav>
    </aside>
  );
}
