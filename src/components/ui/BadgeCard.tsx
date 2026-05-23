import { Project } from '@/data/projects';
import classes from './BadgeCard.module.css';

interface BadgeCardProps {
  project: Project;
}

export function BadgeCard({ project }: BadgeCardProps) {
  return (
    <div className={classes.card}>
      <div className={classes.header}>
        <h3 className={classes.title}>{project.name}</h3>
        {project.highlight && (
          <span className={classes.highlight}>{project.highlight}</span>
        )}
      </div>

      <p className={classes.tagline}>{project.tagline}</p>
      <p className={classes.description}>{project.description}</p>

      <div className={classes.stack}>
        {project.stack.map((tech) => (
          <span key={tech} className={classes.tech}>{tech}</span>
        ))}
      </div>

      {(project.liveUrl || project.githubUrl) && (
        <div className={classes.links}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={classes.link}>
              View Live →
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={classes.link}>
              GitHub →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
