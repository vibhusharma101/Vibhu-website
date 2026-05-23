'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon3dCubeSphere } from '@tabler/icons-react';
import classes from './Header.module.css';

const links = [
  { href: '/workex', label: 'Experience' },
  { href: '/project', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '#about', label: 'About' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Link href="/" className={classes.logo} aria-label="Home">
          <Icon3dCubeSphere size={24} />
          <span>Vibhanshu</span>
        </Link>

        <nav className={classes.nav} aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.label} href={link.href} className={classes.link}>
              {link.label}
            </a>
          ))}
        </nav>

        <button
          className={classes.burger}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <nav className={classes.mobileNav} aria-label="Mobile navigation">
          {links.map((link) => (
            <a key={link.label} href={link.href} className={classes.mobileLink} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
