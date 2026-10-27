'use client';

import { IconBrandGithub, IconBrandLinkedin, IconBrandTwitter, IconMail } from '@tabler/icons-react';
import Link from 'next/link';
import classes from './Footer.module.css';

export function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.inner}>
        <div className={classes.brand}>
          <span className={classes.name}>Vibhanshu Sharma</span>
          <span className={classes.tagline}>Tech Generalist · 2x Founder · IIT Roorkee</span>
        </div>

        <nav className={classes.nav} aria-label="Footer navigation">
          <Link href="/work" className={classes.navLink}>Experience</Link>
          <Link href="/projects" className={classes.navLink}>Projects</Link>
          <Link href="/about" className={classes.navLink}>About</Link>
          <Link href="/blog" className={classes.navLink}>Blog</Link>
          <Link href="/contact" className={classes.navLink}>Contact</Link>
        </nav>

        <div className={classes.social}>
          <a
            href="mailto:sharma.vibhu101@gmail.com"
            aria-label="Email"
            className={classes.socialLink}
          >
            <IconMail size={18} stroke={1.5} />
          </a>
          <a
            href="https://github.com/vibhusharma101"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={classes.socialLink}
          >
            <IconBrandGithub size={18} stroke={1.5} />
          </a>
          <a
            href="https://www.linkedin.com/in/vibhanshu-sharma-b089b2164/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className={classes.socialLink}
          >
            <IconBrandLinkedin size={18} stroke={1.5} />
          </a>
          <a
            href="https://twitter.com/vibhusharma101"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className={classes.socialLink}
          >
            <IconBrandTwitter size={18} stroke={1.5} />
          </a>
        </div>
      </div>

      <div className={classes.bottom}>
        <span>© {new Date().getFullYear()} Vibhanshu Sharma. All rights reserved.</span>
        <button
          className={classes.backToTop}
          onClick={() => { const el = document.getElementById('panel-area'); if (el) el.scrollTo({ top: 0, behavior: 'smooth' }); }}
          type="button"
        >
          ↑ back to top
        </button>
      </div>
    </footer>
  );
}
