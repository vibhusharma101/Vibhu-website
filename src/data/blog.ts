export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  published: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'scaling-android-to-500k',
    title: 'How we scaled the Powerplay Android app to 500,000 users',
    excerpt:
      'What MVVM/Clean Architecture actually looks like in production, and the CI/CD decisions that kept us at 99.98% crash-free even as the team grew from 2 to 20+ engineers.',
    date: '2026-04-10',
    readTime: '7 min',
    tags: ['Android', 'Engineering', 'Scaling'],
    published: false,
  },
  {
    slug: 'solo-founder-to-1m',
    title: 'From solo founder to $1M valuation — what I learned building Vignam',
    excerpt:
      'The honest account of scaling an AI education startup to 20+ people: the technical decisions I made, the ones I regret, and what I would do differently.',
    date: '2026-03-20',
    readTime: '9 min',
    tags: ['Startups', 'Founder', 'AI'],
    published: false,
  },
  {
    slug: 'rag-for-3d-education',
    title: 'Building a RAG search engine over 3D educational simulations',
    excerpt:
      'How I used LLM embeddings and vector databases to make thousands of 3D simulations discoverable by curriculum context — and what broke along the way.',
    date: '2026-02-15',
    readTime: '6 min',
    tags: ['AI', 'RAG', 'LLMs', 'Engineering'],
    published: false,
  },
];
