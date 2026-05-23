export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  highlight?: string;
}

export const projects: Project[] = [
  {
    id: 'vignam',
    name: 'Vignam',
    tagline: 'AI-powered 3D interactive education platform',
    description:
      'Built as solo founder from 0 to $1M valuation and a 20+ member team. Includes a 3D simulation engine, RAG-powered search, WebRTC live classes, and a Python growth engine that seeded 10k+ qualified leads.',
    stack: ['Three.js', 'Unity', 'React', 'Node.js', 'WebRTC', 'Python', 'LLMs', 'AWS S3'],
    featured: true,
    highlight: '$1M valuation · 20+ team',
  },
  {
    id: 'powerplay-android',
    name: 'Powerplay Android',
    tagline: 'Construction management app — 500k+ users',
    description:
      'As 2nd engineering hire, led the Android app from launch to 500,000+ downloads. Implemented MVVM/Clean Architecture in Kotlin, CI/CD pipelines, and achieved a 99.98% crash-free session rate across the fleet.',
    stack: ['Kotlin', 'MVVM', 'Clean Architecture', 'CI/CD', 'Android'],
    liveUrl: 'https://play.google.com/store/apps/details?id=com.powerplay',
    featured: true,
    highlight: '500k+ users · 99.98% crash-free',
  },
  {
    id: 'powerplay-ai',
    name: 'Powerplay AI Workforce',
    tagline: "India's first AI workforce for construction",
    description:
      'Led engineering on the AI Agents platform launched at Powerplay CORE 26. Five purpose-built AI agents — estimation, procurement, and project execution — cutting estimation time from weeks to minutes.',
    stack: ['AI Agents', 'Node.js', 'React', 'Python', 'LLMs'],
    liveUrl: 'https://powerplay.in',
    featured: true,
    highlight: '95% reduction in estimation time',
  },
  {
    id: 'trucks24',
    name: 'Trucks24',
    tagline: 'Logistics marketplace for transporters and factories',
    description:
      'Built end-to-end as Founder & CTO: two native Android apps (Trucks24 + Trucks24 Partner), a Node.js/MongoDB backend API, and a public website. Scaled to 500+ transporters and 20+ factory owners.',
    stack: ['Android', 'Kotlin', 'Node.js', 'MongoDB', 'REST API'],
    highlight: '500+ transporters onboarded',
  },
  {
    id: 'rag-search',
    name: 'RAG Simulation Search',
    tagline: '3D simulation recommendation engine using LLMs',
    description:
      'Built at Vignam — a retrieval-augmented generation search API over a corpus of 3D educational simulations. Used vector databases and LLM embeddings to surface relevant simulations based on curriculum context.',
    stack: ['Python', 'LLMs', 'Vector DB', 'RAG', 'FastAPI'],
    highlight: 'Part of Vignam platform',
  },
  {
    id: 'db-migration',
    name: 'Zero-Downtime DB Migration',
    tagline: '2TB+ live database migrated with 100% integrity',
    description:
      'Engineered and orchestrated a 2TB+ live production database migration at Vignam with zero downtime. Written in Python, with custom validation scripts to guarantee 100% data integrity throughout.',
    stack: ['Python', 'PostgreSQL', 'Data Engineering'],
    highlight: '2TB · zero downtime',
  },
];
