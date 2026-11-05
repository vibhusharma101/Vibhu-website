import type { MouseEvent } from 'react';

/**
 * Shell navigation renders real <a href> links so crawlers can follow
 * them, but an ordinary left click is handled in place (panel switch, no
 * reload). Modified clicks — new tab, new window — fall through to the
 * browser.
 */
export function isPlainClick(e: MouseEvent): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}
