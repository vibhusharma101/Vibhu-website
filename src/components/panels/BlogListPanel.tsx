import s from './panels.module.css';

export function BlogListPanel() {
  return (
    <div className={s.blogComingSoon}>
      <p className={s.codeComment}>blog.md</p>
      <div className={s.blogComingSoonBody}>
        <span className={s.blogComingSoonLabel}>{'// status'}</span>
        <p className={s.blogComingSoonTitle}>Coming Soon.</p>
        <p className={s.blogComingSoonSub}>
          Writing in progress — thoughts on building companies,{' '}
          AI, and the craft of software. Check back soon.
        </p>
        <div className={s.blogComingSoonMeta}>
          <span className={s.bootPrompt}>→ </span>
          <span className={s.bootValue}>estimated_eta = &quot;soon™&quot;</span>
        </div>
      </div>
    </div>
  );
}
