import classes from './BlogCard.module.css';

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  tags?: string[];
}

export function BlogCard({ title, excerpt, date, slug, tags = [] }: BlogCardProps) {
  return (
    <a href={`/blog/${slug}`} className={classes.card}>
      <div className={classes.meta}>
        <time className={classes.date}>{date}</time>
        {tags.map((tag) => (
          <span key={tag} className={classes.tag}>{tag}</span>
        ))}
      </div>
      <h3 className={classes.title}>{title}</h3>
      <p className={classes.excerpt}>{excerpt}</p>
      <span className={classes.readMore}>Read more →</span>
    </a>
  );
}
