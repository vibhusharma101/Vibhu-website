import type { BlogPost } from '@/types/blog';

export interface BlogGroup {
  id: string;
  label: string;
  posts: BlogPost[];
  subgroups?: BlogGroup[];
}

export interface BlogSidebarTree {
  groups: BlogGroup[];
  standalone: BlogPost[];
}

type GroupDef = {
  id: string;
  label: string;
  tag?: string;
  sort?: 'slug' | 'date';
  subgroups?: GroupDef[];
};

const GROUP_DEFS: GroupDef[] = [
  { id: 'system-design',       label: 'System Design',       tag: 'system-design',       sort: 'date' },
  { id: 'dsa',                 label: 'DSA',                 tag: 'dsa',                 sort: 'date' },
  { id: 'startups',            label: 'Startups',            tag: 'startups',            sort: 'date' },
  { 
    id: 'ai',                  
    label: 'AI',                  
    tag: 'ai',                   
    sort: 'date',
    subgroups: [
      { id: 'prs-series', label: 'PRS Series', tag: 'prs-series', sort: 'slug' }
    ]
  },
  { id: 'dev-concepts',        label: 'Dev Concepts',        tag: 'fallback',            sort: 'date' },
];

export function buildBlogSidebarTree(posts: BlogPost[]): BlogSidebarTree {
  const used = new Set<string>();

  function processGroup(def: GroupDef): BlogGroup {
    // Process subgroups first so they get priority over the parent category catch-all
    const subgroups = def.subgroups ? def.subgroups.map(processGroup) : [];

    let matched: BlogPost[] = [];
    if (def.tag) {
      if (def.tag === 'fallback') {
        matched = posts.filter(p => !used.has(p.slug));
      } else {
        matched = posts.filter(p => p.tags.includes(def.tag!) && !used.has(p.slug));
      }
    }
    
    const sorted = [...matched].sort((a, b) => {
      const s = def.sort || 'date';
      return s === 'slug' ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date);
    });
    
    sorted.forEach(p => used.add(p.slug));
    
    return { 
      id: def.id, 
      label: def.label, 
      posts: sorted,
      ...(subgroups.length > 0 ? { subgroups } : {})
    };
  }

  const groups: BlogGroup[] = GROUP_DEFS.map(processGroup);
  const standalone = posts.filter(p => !used.has(p.slug));

  return { groups, standalone };
}
