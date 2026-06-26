export interface WorkExEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  duration: string;
  location: string;
  type: 'founder' | 'engineer' | 'consultant';
  bullets: string[];
  skills: string[];
  current?: boolean;
}

export const workex: WorkExEntry[] = [
  {
    id: 'powerplay-2025',
    company: 'Powerplay',
    role: 'Founding Team Member — Engineering & AI',
    period: 'Oct 2025 – Present',
    duration: '8 months',
    location: 'Bengaluru, India',
    type: 'engineer',
    current: true,
    bullets: [
      'Leading AI initiatives to automate internal processes — positioning Powerplay as an AI-native construction platform.',
      'Built a self PR review system to automate code reviews, improving turnaround and enforcing coding standards.',
      'Working across the full stack — backend, frontend, iOS, and Android — as a tech generalist on the founding team.',
      'Improved crash rate across the mobile platform, strengthening app stability and reliability.',
      'Leading the engineering team: technical direction, mentorship, and execution across projects.',
    ],
    skills: ['AI', 'Full-Stack', 'React', 'Node.js', 'iOS', 'Android'],
  },
  {
    id: 'vignam',
    company: 'Vignam Labs',
    role: 'Solo Founder',
    period: 'Jul 2022 – Oct 2025',
    duration: '3 years 3 months',
    location: 'Delhi, India',
    type: 'founder',
    bullets: [
      'Founded solo and scaled to a 20+ member team — built an AI-powered 3D interactive education platform.',
      'Optimized 3D rendering (Three.js/Unity) and React performance — TTI down 50%, bundle size down 30%.',
      'Built a scalable WebRTC/Node.js live video platform handling 200+ concurrent users with low latency.',
      'Engineered a RAG search API using LLMs and vector databases for a 3D simulations recommendation system.',
      'Scaled a Node.js API via PM2 clustering to serve lakhs of users at 99.99% uptime.',
      'Implemented direct-to-S3 architecture with AWS multipart uploads — 300%+ speed boost for 1GB+ files.',
      'Orchestrated a zero-downtime 2TB+ live database migration with Python, ensuring 100% data integrity.',
    ],
    skills: ['Three.js', 'Unity', 'React', 'Node.js', 'WebRTC', 'Python', 'LLMs', 'AWS', 'RAG'],
  },
  {
    id: 'powerplay-2020',
    company: 'Powerplay',
    role: 'Founding Engineer',
    period: 'Apr 2020 – Jun 2022',
    duration: '2 years 2 months',
    location: 'Bengaluru, India',
    type: 'engineer',
    bullets: [
      'Founding engineer (2nd hire) — scaled the product from zero to 500k+ users and the team from 2 to 20+.',
      'Led architecture and development of the Android app to 500,000+ users using MVVM/Clean Architecture in Kotlin.',
      'Championed app stability via comprehensive testing and CI/CD pipelines — maintained a 99.98% crash-free rate.',
      'Mentored and led 5+ Android engineers through code reviews, pair programming, and technical guidance.',
    ],
    skills: ['Android', 'Kotlin', 'MVVM', 'CI/CD', 'iOS', 'Node.js'],
  },
  {
    id: 'trucks24',
    company: 'Trucks24',
    role: 'Founder & CTO',
    period: 'Jan 2019 – Mar 2020',
    duration: '1 year 3 months',
    location: 'Roorkee, India',
    type: 'founder',
    bullets: [
      'Led complete development of the Trucks24 ecosystem: two native Android apps, a scalable backend API, and a website.',
      'Built a robust RESTful API in Node.js with MongoDB, scaling to 500+ transporters and 20+ factory owners.',
    ],
    skills: ['Android', 'Kotlin', 'Node.js', 'MongoDB', 'GPS/Maps'],
  },
];
