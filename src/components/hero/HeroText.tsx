import Link from 'next/link';
import classes from './HeroText.module.css';
import { Dots } from './Dots';

export function HeroText() {
  return (
    <section className={classes.wrapper}>
      <Dots className={classes.dotsLeft} />
      <Dots className={classes.dotsRight} />

      <div className={classes.inner}>
        <h1 className={classes.title}>
          Tech Generalist.{' '}
          <span className={classes.highlight}>2x Founder.</span>{' '}
          Builder.
        </h1>

        <p className={classes.description}>
          IIT Roorkee Gold Medalist. Founding engineer at Powerplay (500k+ users).
          Solo founder of Vignam ($1M valuation). Currently leading AI engineering
          at Powerplay — building India&apos;s first AI Workforce for Construction.
        </p>

        <div className={classes.controls}>
          <a href="https://www.linkedin.com/in/vibhanshu-sharma-b089b2164/" target="_blank" rel="noopener noreferrer" className={classes.btnPrimary}>
            Connect on LinkedIn
          </a>
          <Link href="/project" className={classes.btnSecondary}>
            View Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
