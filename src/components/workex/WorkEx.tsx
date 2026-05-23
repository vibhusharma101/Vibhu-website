import { workex } from '@/data/workex';
import classes from './WorkEx.module.css';

export default function WorkEx() {
  return (
    <section className={classes.section}>
      <div className={classes.inner}>
        <h2 className={classes.heading}>Work Experience</h2>

        <div className={classes.timeline}>
          {workex.map((entry, i) => (
            <div key={entry.id} className={classes.item}>
              <div className={classes.marker}>
                <div className={`${classes.dot} ${entry.current ? classes.dotActive : ''}`} />
                {i < workex.length - 1 && <div className={classes.line} />}
              </div>

              <div className={classes.content}>
                <div className={classes.meta}>
                  <span className={classes.period}>{entry.period}</span>
                  {entry.current && <span className={classes.badge}>Current</span>}
                </div>
                <h3 className={classes.role}>{entry.role}</h3>
                <span className={classes.company}>{entry.company} · {entry.location}</span>

                <ul className={classes.bullets}>
                  {entry.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>

                <div className={classes.skills}>
                  {entry.skills.map((s) => (
                    <span key={s} className={classes.skill}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
