'use client';

import { useState } from 'react';
import type { BlogPost } from '@/types/blog';
import { buildBlogSidebarTree } from '@/lib/blog-groups';
import s from './shell.module.css';

interface Props {
  posts: BlogPost[];
  /** Which group ids should start expanded (e.g. the group containing the active post). */
  defaultOpen?: string[];
  renderFile: (post: BlogPost, indent: 2 | 3) => React.ReactNode;
}

export function BlogSidebarTree({ posts, defaultOpen = [], renderFile }: Props) {
  const { groups, standalone } = buildBlogSidebarTree(posts);
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(defaultOpen.map(id => [id, true]))
  );

  return (
    <>
      {groups.map(group => (
        <div key={group.id}>
          <button
            type="button"
            className={`${s.sidebarFolder} ${s.indent2}`}
            onClick={() => setOpen(o => ({ ...o, [group.id]: !o[group.id] }))}
          >
            <span className={s.folderArrow}>{open[group.id] ? '∨' : '›'}</span>
            <span>📁</span><span>{group.label}</span>
            <span className={s.folderCount}>{group.posts.length}</span>
          </button>
          {open[group.id] && group.posts.map(post => renderFile(post, 3))}
        </div>
      ))}
      {standalone.map(post => renderFile(post, 2))}
    </>
  );
}
