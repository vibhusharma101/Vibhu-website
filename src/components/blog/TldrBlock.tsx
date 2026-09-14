import styles from '@/app/blog/[slug]/blog-post.module.css';

interface Props {
  points: string[];
}

export function TldrBlock({ points }: Props) {
  if (points.length === 0) return null;

  return (
    <div className={styles.tldr}>
      <span className={styles.tldrLabel}>{'// tl;dr'}</span>
      <ul className={styles.tldrList}>
        {points.map(point => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
