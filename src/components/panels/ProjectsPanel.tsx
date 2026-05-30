import type { Project } from '@/data/projects';
import s from './panels.module.css';

interface Props {
  projects: Project[];
}

export function ProjectsPanel({ projects }: Props) {
  return (
    <div className={s.panelBody}>
      <p className={s.codeComment}>projects.ts — selected work</p>
      <p className={s.codeComment} style={{ marginBottom: 36 }}>
        {projects.length} entries · click any card to view source ↗
      </p>

      <div className={s.projGrid}>
        {projects.map((proj, i) => (
          <article key={proj.id} className={s.projCard}>
            <div className={s.cardTitlebar}>
              <span className={s.cardTitle}>{proj.id}</span>
              <div className={s.windowDots}>
                <span className={s.windowDot} />
                <span className={s.windowDot} />
                <span className={s.windowDot} />
              </div>
            </div>
            <div className={s.cardBody}>
              <div className={s.cardNum}>P · {String(i + 1).padStart(2, '0')}</div>
              <div className={s.cardName}>{proj.name}</div>
              <p className={s.cardDesc}>{proj.tagline}</p>
              <div className={s.stack}>
                {proj.stack.slice(0, 5).map(tech => (
                  <span key={tech} className={s.stackBadge}>{tech}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
