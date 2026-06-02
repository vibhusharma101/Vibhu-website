import { IconBrandGithub, IconBrandLinkedin, IconBrandTwitter } from '@tabler/icons-react';
import classes from './Footer.module.css';

export function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.inner}>
        <div className={classes.brand}>
          <span className={classes.name}>Vibhanshu Sharma</span>
          <span className={classes.tagline}>Tech Generalist · 2x Founder · IIT Roorkee</span>
        </div>

        <div className={classes.social}>
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
      </div>
    </footer>
  );
}
