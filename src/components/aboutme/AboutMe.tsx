import classes from './AboutMe.module.css';

export function AboutMe() {
  return (
    <section className={classes.section}>
      <div className={classes.inner}>
        <div className={classes.label}>About</div>
        <h2 className={classes.heading}>Building things that scale.</h2>
        <div className={classes.body}>
          <p>
            I&apos;m Vibhanshu Sharma — a tech generalist who&apos;s been building software since 2019.
            Gold Medalist from IIT Roorkee in Production &amp; Industrial Engineering.
          </p>
          <p>
            I founded Vignam from zero to a $1M valuation and a 20+ member team, building an
            AI-powered 3D education platform. Before that, as the 2nd engineering hire at Powerplay,
            I led the Android app to 500,000+ users.
          </p>
          <p>
            Currently back at Powerplay, leading AI engineering — building India&apos;s first AI
            Workforce for Construction. I work across the full stack: backend, frontend, iOS,
            Android, and AI agents.
          </p>
        </div>
        <a href="mailto:sharma.vibhu101@gmail.com" className={classes.cta}>
          Get in touch →
        </a>
      </div>
    </section>
  );
}
