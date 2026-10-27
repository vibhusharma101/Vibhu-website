'use client';

import { useState } from 'react';
import type { BlogPost } from '@/types/blog';
import { buildBlogSidebarTree, type BlogGroup } from '@/lib/blog-groups';
import s from './shell.module.css';

interface Props {
  posts: BlogPost[];
  /** Which group ids should start expanded (e.g. the group containing the active post). */
  defaultOpen?: string[];
  renderFile: (post: BlogPost, indent: number) => React.ReactNode;
}

export function BlogSidebarTree({ posts, defaultOpen = [], renderFile }: Props) {
  const { groups, standalone } = buildBlogSidebarTree(posts);
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(defaultOpen.map(id => [id, true]))
  );

  const toggleOpen = (id: string) => {
    setOpen(o => ({ ...o, [id]: !o[id] }));
  };

  const renderGroup = (group: BlogGroup, indentLevel: number) => {
    const indentClass = s[`indent${indentLevel}`] || s.indent2;
    const postCount = group.posts.length + (group.subgroups ? group.subgroups.reduce((acc, sg) => acc + sg.posts.length, 0) : 0);
    return (
      <div key={group.id}>
        <button
          type="button"
          className={`${s.sidebarFolder} ${indentClass}`}
          onClick={() => toggleOpen(group.id)}
        >
          <span className={s.folderArrow}>{open[group.id] ? '∨' : '›'}</span>
          <span>📁</span><span>{group.label}</span>
          <span className={s.folderCount}>{postCount}</span>
        </button>
        {open[group.id] && (
          <>
            {group.subgroups?.map(sg => renderGroup(sg, indentLevel + 1))}
            {group.posts.map(post => renderFile(post, indentLevel + 1))}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {groups.map(group => renderGroup(group, 2))}
      {standalone.map(post => renderFile(post, 2))}
    </>
  );
}
