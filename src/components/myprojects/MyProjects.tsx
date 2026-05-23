import { BadgeCard } from '@/components/ui/BadgeCard';
import { projects } from '@/data/projects';
import classes from './MyProjects.module.css';

export function MyProjects() {
  return (
    <section className={classes.section}>
      <div className={classes.inner}>
        <h2 className={classes.heading}>Projects</h2>
        <div className={classes.grid}>
          {projects.map((project) => (
            <BadgeCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
