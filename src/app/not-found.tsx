import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: '404',
  description: 'This page does not exist.',
  robots: { index: false, follow: true },
};

const LINKS: Array<{ href: string; label: string }> = [
  { href: '/home', label: 'home.tsx' },
  { href: '/work', label: 'experience.ts' },
  { href: '/projects', label: 'projects.ts' },
  { href: '/blog', label: 'blog.md' },
  { href: '/contact', label: 'contact.sh' },
];

export default function NotFound() {
  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.head}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.headLabel}>build error</span>
        </div>

        <div className={styles.body}>
          <p className={styles.errorLine}>
            <span className={styles.errorTag}>error</span> Module not found: Can&apos;t resolve this route
          </p>
          <p className={styles.code}>404</p>
          <p className={styles.message}>
            Nothing is exported from this path. It was probably moved, renamed, or never existed.
          </p>

          <nav className={styles.links} aria-label="Available pages">
            {LINKS.map(link => (
              <Link key={link.href} href={link.href} className={styles.link}>
                <span className={styles.linkArrow}>→</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </main>
  );
}
